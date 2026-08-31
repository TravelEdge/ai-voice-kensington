import Anthropic from '@anthropic-ai/sdk';

import {
  TAC,
  MemoryPromptBuilder,
  type TACMemoryResponse,
  type ConversationSession,
  type ConversationId,
} from 'twilio-agent-connect';

import { TOOLS, getAllTools, executeTool, extractCustomerProfileId, getProfileTraitsForPrompt } from '../tools/index.js';
import {
  getCachedDestinations,
  getCachedActivities,
  getCachedChannels,
} from '../tools/lead-queue.js';
import { AGENTS, AGENT_NAMES } from './prompts.js';

/**
 * Format the cached LeadDepo destinations/activities/channels as a reference
 * catalog block for the IN_DESTINATION agent. Returns '' if caches aren't
 * populated yet (e.g. startup auth still in flight).
 */
function formatLeadDepoCatalog(): string {
  const destinations = getCachedDestinations();
  const activities = getCachedActivities();
  const channels = getCachedChannels();
  if (!destinations || !activities || !channels) return '';

  const destLines: string[] = [];
  for (const continent of destinations) {
    destLines.push(`  ${continent.continent}:`);
    for (const country of continent.countries) {
      destLines.push(`    - id=${country.id}: ${country.name}`);
    }
  }
  const activityLines = activities.map(a => `  - id=${a.id}: ${a.name}`);
  const channelLines = channels.map(c => `  - id=${c.id}: ${c.name}`);

  return `\n\n## LEAD ASSIGNMENT REFERENCE CATALOG

When calling the get_lead_assignment_queue tool, pass the numeric IDs from these lists — never pass names, and never invent IDs.

### Destinations (grouped by continent)
${destLines.join('\n')}

### Activities
${activityLines.join('\n')}

### Channels
${channelLines.join('\n')}`;
}

let claude: Anthropic | undefined;


// Per-conversation message history keyed by conversationId
const histories = new Map<string, Anthropic.MessageParam[]>();
// Per-conversation memory cache
// we dont want to load memory by default for any calls
// only explicitly when about to handoff for a new lead
// so we can save the new lead data (we never care about its presence)
// and when we have a call returned from a handoff, so we can use that data
const memoryCache =  new Map<string, TACMemoryResponse>();
// Per-conversation cache of the formatted NewLead traits string. STACK_CALL
// needs those traits injected into the system prompt on every turn — caching
// avoids a round-trip to the Memory API each time the caller speaks.
const traitsCache = new Map<string, string>();

// extend the operations on Map so we can neatly log
// intent changes
class IntentMap extends Map<string, string> {
  setAndLog(key: string, value: string): this {
    const currentValue = super.get(key);
    super.set(key, value);
    if (!currentValue) console.log(`%cSET INITIAL INTENT: %c${value}`, "color: red;", "color: green;");
    else console.log(`%cCHANGED INTENT: %c${currentValue} => %c${value}`, "color: red;", "color: blue;", "color: green;")
    return this;
  }
}

// initialize a new intent map on startup
const intents = new IntentMap()

// CallSid captured on ConversationRelay setup, keyed by the caller's address.
// The voice channel exposes callSid on setup (before the conversation is
// initialized) and provides authorInfo.address on the first prompt, so we join
// on the caller's address to move it onto session.metadata.callSid.
const pendingCallSidByFrom = new Map<string, string>();

// ConversationRelay <Parameter> values captured on setup, keyed by from. Used
// to signal takeback flows into handleMessage before the first user prompt.
const pendingCustomParamsByFrom = new Map<string, Record<string, unknown>>();

export function registerPendingCallSid(from: string, callSid: string): void {
  pendingCallSidByFrom.set(from, callSid);
}

export function registerPendingCustomParams(
  from: string,
  params: Record<string, unknown> | undefined
): void {
  if (params && Object.keys(params).length > 0) pendingCustomParamsByFrom.set(from, params);
}

const resolveCallSid = (session: ConversationSession): string | undefined => {
  const existing = session.metadata?.callSid;
  if (typeof existing === 'string' && existing.length > 0) return existing;

  const from = session.authorInfo?.address;
  if (!from) return undefined;

  const callSid = pendingCallSidByFrom.get(from);
  if (!callSid) return undefined;

  if (!session.metadata) session.metadata = {};
  session.metadata.callSid = callSid;
  pendingCallSidByFrom.delete(from);
  return callSid;
};

const resolveCustomParams = (
  session: ConversationSession
): Record<string, unknown> | undefined => {
  const existing = session.metadata?.customParameters;
  if (existing && typeof existing === 'object') return existing as Record<string, unknown>;

  const from = session.authorInfo?.address;
  if (!from) return undefined;

  const params = pendingCustomParamsByFrom.get(from);
  if (!params) return undefined;

  if (!session.metadata) session.metadata = {};
  session.metadata.customParameters = params;
  pendingCustomParamsByFrom.delete(from);
  return params;
};

const preparePrompt = async (
  intent: string,
  session: ConversationSession,
  prompt: string | undefined,
  traitsContext: string) => {


  // for intent detection, we only need the basic prompt
  // this improves TTFT
  if(intent === AGENT_NAMES.INTENT_DETECTION) return prompt;

  // Get current date and time for temporal context
  const now = new Date();
  const dateTimeContext = `\n\nCurrent date and time: ${now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York', // Adjust to your stadium's timezone
  })}`;

  // Inject Twilio Conversation Memory + session context into the system prompt
  // for this solution we actually dont want to preserve any of the conversation
  // history while talking to the bot
  // const memoryContext = MemoryPromptBuilder.build(memory, session);

  // Surface the caller's phone number to the LLM so it can confirm the callback
  // number, tag it into tool calls (e.g., update_new_lead_traits.phoneNumber),
  // and answer questions like "what number are you calling from?". TAC populates
  // session.authorInfo.address with the E.164 number on voice-channel setup.
  const callerAddress = session.authorInfo?.address;
  const callerContext =
    session.channel === 'voice' && callerAddress
      ? `\n\nCaller phone number (E.164, from Twilio caller ID): ${callerAddress}`
      : '';

  // IN_DESTINATION agent needs the destination/activity/channel ID catalog so
  // it can resolve names → numeric IDs before calling get_lead_assignment_queue.
  const catalogContext =
    intent === AGENT_NAMES.NEW_LEAD ? formatLeadDepoCatalog() : '';

  const systemPrompt =
    prompt +
    dateTimeContext +
    callerContext +
    (traitsContext ? traitsContext : '') +
    // (memoryContext ? `\n\n${memoryContext}` : '') +
    catalogContext;

  return systemPrompt;
}


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
    tools: AGENTS[intent].tools || getAllTools(tac, session),
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
        tools: AGENTS[intent].tools || getAllTools(tac, session),
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

  // Purge every per-conversation cache so a hung-up call doesn't leak state
  // into a subsequent one on the same caller number.
  histories.delete(convId);
  intents.delete(convId);
  memoryCache.delete(convId);
  traitsCache.delete(convId);

  // The pending maps are keyed by the caller's E.164 address (populated on
  // ConversationRelay setup). They normally clear themselves on the first
  // prompt via resolveCallSid/resolveCustomParams, but a caller who hangs up
  // before saying anything would leak an entry — sweep them here too.
  if (from) {
    pendingCallSidByFrom.delete(from);
    pendingCustomParamsByFrom.delete(from);
  }
}
