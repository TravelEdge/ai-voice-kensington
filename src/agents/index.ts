import Anthropic from '@anthropic-ai/sdk';

import {
  TAC,
  type TACMemoryResponse,
  type ConversationSession,
  type ConversationId,
} from 'twilio-agent-connect';

import { executeTool, extractCustomerProfileId, getProfileTraitsForPrompt } from '../tools/index.js';
import { executeHandoff } from '../tools/handoff.js';
import { AGENTS, AGENT_NAMES, preparePrompt } from './prompts.js';
import {
  histories,
  memoryCache,
  traitsCache,
  intents,
  resolveCallSid,
  resolveCustomParams,
  consumePreloadedTraits,
  purgeConversation,
} from '../cache/index.js';
import {
  runInSession,
  sessionLog,
  getSessionStore,
  isLogEnabled,
  registerSessionCallSid,
  purgeSessionState,
  deepAutoParse,
  type ClaudeApiCall,
} from '../logger.js';

let claude: Anthropic | undefined;

// Default TTS-friendly copy for the fallback path. Overridden by
// FALLBACK_LIVE_ANSWER_MESSAGE env var.
const DEFAULT_FALLBACK_LIVE_ANSWER_MESSAGE =
  "I'm sorry, I'm having difficulty reaching critical services. " +
  "I'm going to connect you to a live agent who will direct you to the correct specialist.";

// Build the "recorded call" object for the aggregate AGENT_RESPONSE log. When
// CLAUDE_API_PAYLOAD is enabled, includes the full request payload; otherwise
// falls back to a cheap { model, lastMessage } shape. deepAutoParse unwraps
// stringified JSON that tool_result blocks carry as `content` strings, so the
// pretty-printer renders the structure instead of an escaped one-liner.
function recordClaudeCall(
  params: Anthropic.MessageCreateParamsNonStreaming,
  requestTime: number,
): void {
  const store = getSessionStore();
  if (!store) return;
  const messages = params.messages;
  const includeFull = isLogEnabled('CLAUDE_API_PAYLOAD');
  const call: ClaudeApiCall = includeFull
    ? {
        model: params.model,
        max_tokens: params.max_tokens,
        system: params.system,
        messages: deepAutoParse(params.messages) as unknown,
        tools: params.tools,
        requestTime,
      }
    : {
        model: params.model,
        lastMessage: deepAutoParse(messages[messages.length - 1]),
        requestTime,
      };
  store.claudeApiCalls.push(call);

  if (isLogEnabled('CLAUDE_API')) {
    sessionLog().info(call, 'CLAUDE_API');
  }
}

// Single retry with a short pause. Voice is real-time, so backoff is minimal —
// if the second attempt fails, the outer handler falls back to a live-agent
// handoff. Retries on any error (503, network, timeout, etc.) since we're
// going to fall back anyway if the second attempt fails.
async function callClaudeWithRetry(
  params: Anthropic.MessageCreateParamsNonStreaming,
): Promise<Anthropic.Message> {
  claude ??= new Anthropic();
  const attempt = async (): Promise<Anthropic.Message> => {
    const start = performance.now();
    const result = await claude!.messages.create(params);
    recordClaudeCall(params, Math.round(performance.now() - start));
    return result;
  };

  try {
    return await attempt();
  } catch (err) {
    if (isLogEnabled('FALLBACK')) {
      sessionLog().warn(
        {
          err: err instanceof Error ? err.message : String(err),
          description: 'Claude first attempt failed, retrying once',
        },
        'CLAUDE_RETRY',
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    return attempt();
  }
}

// Fallback when Claude is unreachable twice in a row. Manually invokes the
// handoff tool (Claude can't do it because Claude is what's failing) to
// enqueue the call into a fallback live-answer workflow, and returns a
// TTS-friendly apology so ConversationRelay has something to speak before
// the transfer.
async function fallbackToLiveAgent(
  tac: TAC,
  session: ConversationSession,
  history: Anthropic.MessageParam[],
  err: unknown,
): Promise<string> {
  if (isLogEnabled('FALLBACK')) {
    sessionLog().error(
      {
        err: err instanceof Error ? err.message : String(err),
        description: 'Both Claude attempts failed — initiating fallback handoff',
      },
      'CLAUDE_FAILURE',
    );
  }

  const workflowSid = process.env.HANDOFF_LIVE_ANSWER_WORKFLOW_SID;
  const fallbackMessage =
    process.env.FALLBACK_LIVE_ANSWER_MESSAGE ?? DEFAULT_FALLBACK_LIVE_ANSWER_MESSAGE;

  if (workflowSid) {
    try {
      await executeHandoff(
        {
          workflow_sid: workflowSid,
          reason: 'AI backend failure — automatic fallback to live agent',
        },
        tac,
        session,
      );
    } catch (handoffErr) {
      sessionLog().error(
        {
          err: handoffErr instanceof Error ? handoffErr.message : String(handoffErr),
          description: 'Fallback handoff itself failed',
        },
        'CLAUDE_FAILURE',
      );
    }
  } else {
    sessionLog().error(
      { description: 'HANDOFF_LIVE_ANSWER_WORKFLOW_SID not set — cannot initiate fallback handoff' },
      'CLAUDE_FAILURE',
    );
  }

  // Keep history coherent: record the apology as the assistant turn so the
  // next customer input (if any) doesn't confuse the model.
  history.push({ role: 'assistant', content: fallbackMessage });
  return fallbackMessage;
}

// Tool return values are strings by contract — many are pure JSON, some are
// "prefix: {json}" markers. deepAutoParse handles both, and recurses into any
// embedded structures so pino-pretty renders them as trees instead of
// escaped-newline blobs.

// Heuristic for "this tool return string looks like a failure." Tools in this
// codebase surface errors by returning strings that start with "Error:" or
// "Failed" (their return type is `string`, not `throw`) so Claude can decide
// how to react without breaking the tool loop. We use this to emit a separate
// TOOL_ERROR log so silent tool failures surface in dev-table + prod logs.
// Case-insensitive on the leading token; trims first to survive stray
// whitespace.
const looksLikeToolError = (result: string): boolean => {
  const trimmed = result.trimStart();
  return /^(Error[:\s]|Failed[:\s])/i.test(trimmed);
};

// Public entry point. Establishes the AsyncLocalStorage session context (one
// per top-level customer utterance) and emits the aggregate AGENT_RESPONSE log
// with timings once the recursive worker returns. Recursive re-entry from
// intent detection or CHANGE_INTENT uses handleMessageInternal directly so
// timings accumulate into a single AGENT_RESPONSE record.
export async function handleMessage(
  tac: TAC,
  params: {
    conversationId: ConversationId;
    message: string;
    session: ConversationSession;
  },
): Promise<string> {
  const { conversationId, message, session } = params;
  const convId = String(conversationId);

  // Resolve the CallSid up front so every log inside this turn carries it as
  // a first-class binding, and so onInterrupt (which fires outside our ALS
  // scope) can look it up via the sessionCallSids side-map.
  const callSid = session.channel === 'voice' ? resolveCallSid(session) : undefined;
  registerSessionCallSid(convId, callSid);

  return runInSession(convId, callSid, async () => {
    if (isLogEnabled('CUSTOMER_INPUT')) {
      sessionLog().info({ input: message }, 'CUSTOMER_INPUT');
    }

    const response = await handleMessageInternal(tac, params);

    if (isLogEnabled('AGENT_RESPONSE')) {
      const store = getSessionStore()!;
      sessionLog().info(
        {
          response,
          customerToAgentResponseTime: Math.round(performance.now() - store.startedAt),
          claudeApiResponseTimes: store.claudeApiCalls,
        },
        'AGENT_RESPONSE',
      );
    }

    return response;
  });
}

async function handleMessageInternal(
  tac: TAC,
  params: {
    conversationId: ConversationId;
    message: string;
    session: ConversationSession;
  },
): Promise<string> {
  const { conversationId, message, session } = params;
  const convId = String(conversationId);

  // initilaize conversation history in local array if it doesnt already exist
  if (!histories.has(convId)) histories.set(convId, []);
  if (!intents.has(convId)) {
    // If this session was reconnected via the takeback flow (see
    // additional-routes/enqueue-with-takeback.ts), the ConversationRelay
    // <Parameter> arrives on setup as customParameters. Skip intent
    // detection and jump straight to STACK_CALL.
    const customParams = session.channel === 'voice' ? resolveCustomParams(session) : undefined;
    const takeback = customParams?.takeback;
    if (takeback === 'true' || takeback === true) {
      intents.setAndLog(convId, "STACK_CALL");
      memoryCache.set(convId, await tac.retrieveMemory(session));

      // If /redirect-back-to-agent prefetched the caller's traits and TAC
      // handed them to us via CR <Parameter> at setup, promote the value into
      // the conversation-scoped traitsCache now. The STACK_CALL branch below
      // reads traitsCache first, so this turn skips the Memory API round-trip.
      const fromAddress = session.authorInfo?.address;
      const preloadedTraits = fromAddress ? consumePreloadedTraits(fromAddress) : undefined;
      if (preloadedTraits) traitsCache.set(convId, preloadedTraits);
    } else {
      intents.setAndLog(convId, "INTENT_DETECTION");
    }
  }

  // fetch the converstion
  const history = histories.get(convId)!;
  const intent = intents.get(convId)! as string;
  const memory = memoryCache.get(convId) as TACMemoryResponse | undefined;
  const profileId = memory ? extractCustomerProfileId(memory) : "";

  // store customers message
  history.push({ role: 'user', content: message });

  // Extract customer profile ID from TAC memory response
  const memorySid = process.env.TWILIO_MEMORY_STORE_ID;
  const callSid = session.channel === 'voice' ? resolveCallSid(session) : undefined;

  // Resolve traits context for STACK_CALL — fetch once on first turn, then
  // reuse the cached string on every subsequent turn to avoid hitting the
  // Memory API on each customer utterance.
  let traitsContext = '';
  if (intent === AGENT_NAMES.STACK_CALL) {
    const cached = traitsCache.get(convId);
    if (cached !== undefined) {
      traitsContext = cached;
    } else {
      const fetched = await getProfileTraitsForPrompt(profileId, memorySid);
      if (fetched) {
        traitsCache.set(convId, fetched);
        traitsContext = fetched;
      }
    }
  }

  // generate the prompt for the relevant agent
  const systemPrompt = await preparePrompt(intent, session, AGENTS[intent].prompt, traitsContext);

  try {
    let response = await callClaudeWithRetry({
      model: AGENTS[intent].model,
      max_tokens: AGENTS[intent].max_tokens || 512,
      system: systemPrompt,
      messages: history,
      tools: AGENTS[intent].tools,
    });

    const reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    if (intent === "INTENT_DETECTION") {

      if (Object.values(AGENT_NAMES).includes(reply as AGENT_NAMES)) {
        intents.setAndLog(convId, reply);
        return handleMessageInternal(tac, { conversationId, message, session });
      } else {
        history.push({ role: 'assistant', content: reply });
        return reply;
      }


    } else if (reply === "CHANGE_INTENT") {
      intents.setAndLog(convId, "INTENT_DETECTION");
      return handleMessageInternal(tac, { conversationId, message, session });
    } else {

      // ConversationRelay is non-streaming from our side — the caller only
      // ever hears the string we return at the end of this function. But
      // Claude can emit text blocks alongside tool_use blocks in ANY turn of
      // the tool loop (e.g. "one moment while I look that up" preceding a
      // parallel tool call). Historically we only returned text from the
      // FINAL Claude call, which silently discarded any text Claude produced
      // in intermediate turns — and if Claude said its farewell alongside a
      // handoff/end_call tool_use, the caller heard nothing. Collect text
      // from every turn so nothing gets lost.
      const collectedText: string[] = [];
      if (reply.trim()) collectedText.push(reply);

      // Handle tool calls (agentic loop)
      while (response.stop_reason === 'tool_use') {
        const toolUseBlocks = response.content.filter(
          (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
        );

        // Add assistant's response (including tool_use blocks) to history
        history.push({
          role: 'assistant',
          content: response.content,
        });

        // Execute all tool calls and collect results
        const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
          toolUseBlocks.map(async (toolUse) => {
            if (isLogEnabled('TOOLS_CALL')) {
              sessionLog().info(
                { tool: toolUse.name, input: toolUse.input },
                'TOOL_CALL',
              );
            }
            const toolStart = performance.now();
            const result = await executeTool(
              toolUse.name,
              toolUse.input as Record<string, unknown>,
              tac,
              { profileId, memorySid, callSid },
              session,
              undefined,
            );
            const requestTime = Math.round(performance.now() - toolStart);
            if (isLogEnabled('TOOLS_RESULT')) {
              sessionLog().info(
                { tool: toolUse.name, requestTime, result: deepAutoParse(result) },
                'TOOL_RESULT',
              );
            }

            // Tools in this codebase return failure as an error-shaped STRING
            // (rather than throwing) so Claude can decide how to react. That's
            // deliberate — retries usually re-fail the same way — but it also
            // means silent bugs (like the Memory write that never landed) go
            // unnoticed because Claude treats the string as a normal result.
            // Surface those as a separate warn-level TOOL_ERROR so they show
            // up in dev-table + prod logs without needing to grep raw JSON.
            if (isLogEnabled('TOOL_ERROR') && looksLikeToolError(result)) {
              sessionLog().warn(
                { tool: toolUse.name, requestTime, result: deepAutoParse(result) },
                'TOOL_ERROR',
              );
            }

            return {
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: result,
            };
          }),
        );

        // Add tool results to history
        history.push({
          role: 'user',
          content: toolResults,
        });

        // Continue the conversation with tool results
        response = await callClaudeWithRetry({
          model: AGENTS[intent].model,
          max_tokens: AGENTS[intent].max_tokens || 512,
          system: systemPrompt,
          messages: history,
          tools: AGENTS[intent].tools,
        });

        // Collect any text blocks from this new response before the loop
        // re-checks stop_reason — so text produced alongside subsequent tool
        // calls also makes it to the caller.
        const turnText = response.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('');
        if (turnText.trim()) collectedText.push(turnText);
      }

      // Concatenate every text block emitted across the tool loop. Trim to
      // strip trailing whitespace when a turn was empty; a single space
      // joiner reads naturally when a "one moment" line meets a "here you go"
      // closer.
      const final_reply = collectedText.join(' ').trim();

      history.push({ role: 'assistant', content: final_reply });

      // Defensive early-warning: an empty final_reply means ConversationRelay
      // gets nothing to speak, so the caller sits in silence until they say
      // something. Almost always a prompt-drift issue (Claude followed a
      // "don't speak" instruction, or the tools were called without a text
      // block in the FIRST response). Log loudly so it's grep-able.
      if (final_reply.trim().length === 0) {
        sessionLog().warn(
          {
            description: 'Claude returned an empty text response after the tool loop — caller will hear silence until they speak',
            historyLength: history.length,
          },
          'CLAUDE_EMPTY_RESPONSE',
        );
      }

      return final_reply;
    }
  } catch (err) {
    // Two consecutive Claude failures — fall back to a live-agent handoff so
    // the caller isn't stuck on a broken bot. This bypasses Claude entirely
    // (invoking the handoff tool directly from code) because the model is
    // exactly what's unavailable.
    return fallbackToLiveAgent(tac, session, history, err);
  }
}

// TAC-facing entry point: fires from tac.onConversationEnded when Conversation
// Orchestrator posts a CLOSED webhook back to TAC. In the current deployment
// this pathway is not guaranteed to fire for every hang-up (CO closes on its
// own schedule / relies on downstream to CLOSE), so the /enqueue-or-end-call
// route also calls clearConversationById directly as a belt-and-braces cleanup.
export function clearConversation(session: ConversationSession): void {
  const convId = String(session.conversationId);
  const from = session.authorInfo?.address;
  clearConversationById(convId, from);
}

// Direct cleanup path for callers that only have a conversationId + optional
// caller address (e.g. HTTP route handlers). Idempotent — safe to call twice
// on the same conversation because purgeConversation / purgeSessionState use
// Map.delete, which is a no-op for missing keys.
export function clearConversationById(convId: string, from: string | undefined): void {
  const history = histories.get(convId);
  const alreadyPurged = !history && !intents.has(convId);

  // Teardown: one info-level marker for lifecycle visibility, plus the full
  // transcript at debug level for post-mortems without polluting normal logs.
  // Skip if the state has already been purged so a duplicate hangup callback
  // doesn't emit a phantom teardown log.
  if (!alreadyPurged && isLogEnabled('CONVERSATION_LIFECYCLE')) {
    sessionLog(convId).info(
      { from, historyLength: history?.length ?? 0 },
      'CONVERSATION_ENDED',
    );
    sessionLog(convId).debug({ history }, 'CONVERSATION_TRANSCRIPT');
  }

  purgeConversation(convId, from);
  purgeSessionState(convId);
}
