import Anthropic from '@anthropic-ai/sdk';

import {
  TAC,
  type TACMemoryResponse,
  type ConversationSession,
  type ConversationId,
} from 'twilio-agent-connect';

import { getAllTools, executeTool, extractCustomerProfileId, getProfileTraitsForPrompt } from '../tools/index.js';
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

let claude: Anthropic | undefined;

export async function handleMessage(tac: TAC, params: {
  conversationId: ConversationId;
  message: string;
  session: ConversationSession;
}): Promise<string> {

  const { conversationId, message, session } = params;

  console.log("%cCUSTOMER INPUT: " + "%c" + message, "color: white;", "color: green;");
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

  // initialize claude if it hasnt already
  claude ??= new Anthropic();

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
  const systemPrompt = await preparePrompt(intent, session, AGENTS[intent].prompt, traitsContext)
  
  
  let response = await claude.messages.create({
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

  if (intent === "INTENT_DETECTION"){
    
    if(Object.values(AGENT_NAMES).includes(reply as AGENT_NAMES)) {
      intents.setAndLog(convId, reply);
      return handleMessage(tac, { conversationId, message, session })
    } else {
      history.push({ role: 'assistant', content: reply });
      return reply;
    }


  } else if (reply === "CHANGE_INTENT"){
    intents.setAndLog(convId, "INTENT_DETECTION");
    return handleMessage(tac, { conversationId, message, session })
  } else {

    const { content } = response;
    content.forEach((value, index) => {
      if (value.type === "text") console.log(`%cCLAUDE RESPONSE[${index}]: %c` + value.text, "color: blue;", "color: green;")
    })
    
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
          console.log(`[TOOL_CALL] ${toolUse.name} with input:`, toolUse.input);
          const result = await executeTool(
            toolUse.name,
            toolUse.input as Record<string, unknown>,
            tac,
            { profileId, memorySid, callSid },
            session,
            undefined
          );
          console.log(`[TOOL_RESULT] ${toolUse.name}:`, result.substring(0, 200) + '...');

          return {
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: result,
          };
        })
      );

      // Add tool results to history
      history.push({
        role: 'user',
        content: toolResults,
      });

      // Continue the conversation with tool results
      response = await claude.messages.create({
        model: AGENTS[intent].model,
        max_tokens: AGENTS[intent].max_tokens || 512,
        system: systemPrompt,
        messages: history,
        tools: AGENTS[intent].tools,
      });
    }

    // Extract final text response
    const final_reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');

    history.push({ role: 'assistant', content: final_reply });

    return reply;
}
}

export function clearConversation(session: ConversationSession): void {
  const convId = String(session.conversationId);
  const from = session.authorInfo?.address;

  // PRINT Conversation on hangup
  console.log(JSON.stringify(histories.get(convId), null, 4));

  purgeConversation(convId, from);
}
