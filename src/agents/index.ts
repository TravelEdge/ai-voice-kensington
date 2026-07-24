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
} from '../tools/LeadDepo.js';
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
const intents = new Map<string, string>();


// CallSid captured on ConversationRelay setup, keyed by the caller's address.
// The voice channel exposes callSid on setup (before the conversation is
// initialized) and provides authorInfo.address on the first prompt, so we join
// on the caller's address to move it onto session.metadata.callSid.
const pendingCallSidByFrom = new Map<string, string>();

export function registerPendingCallSid(from: string, callSid: string): void {
  pendingCallSidByFrom.set(from, callSid);
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

const preparePrompt = async (
  intent: string,
  profileId: string | undefined,
  memorySid: string | undefined,
  memory: TACMemoryResponse | undefined,
  session: ConversationSession,
  prompt: string | undefined) => {


  // Fetch profile traits if we have a profile ID
  const traitsContext = process.env.TWILIO_MEMORY_LOAD_TRAITS ? await getProfileTraitsForPrompt(profileId, memorySid) : '';

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

  // Inject Twilio Conversation Memory + session context + profile traits into the system prompt
  const memoryContext = MemoryPromptBuilder.build(memory, session);

  // IN_DESTINATION agent needs the destination/activity/channel ID catalog so
  // it can resolve names → numeric IDs before calling get_lead_assignment_queue.
  const catalogContext =
    intent === AGENT_NAMES.IN_DESTINATION ? formatLeadDepoCatalog() : '';

  const systemPrompt =
    prompt +
    dateTimeContext +
    (traitsContext ? traitsContext : '') +
    (memoryContext ? `\n\n${memoryContext}` : '') +
    catalogContext;

  return systemPrompt;
}


export async function handleMessage(tac: TAC, params: {
  conversationId: ConversationId;
  message: string;
  memory: TACMemoryResponse | undefined;
  session: ConversationSession;
}): Promise<string> {

  const { conversationId, message, memory, session } = params;

  console.log(JSON.stringify(params, null, 4));
  const convId = String(conversationId);

   // initilaize conversation history in local array if it doesnt already exist
  if (!histories.has(convId)) histories.set(convId, []);
  if (!intents.has(convId)) intents.set(convId, "INTENT_DETECTION");

  // fetch the converstion
  const history = histories.get(convId)!;
  const intent = intents.get(convId)! as string;

  console.log("INTENT IS:", intent);

  // store customers message
  history.push({ role: 'user', content: message });

  // initialize claude if it hasnt already
  claude ??= new Anthropic();

  // Extract customer profile ID from TAC memory response
  const profileId = extractCustomerProfileId(memory);
  const memorySid = process.env.TWILIO_MEMORY_STORE_ID;
  const callSid = session.channel === 'voice' ? resolveCallSid(session) : undefined;

  // generate the prompt for the relevant agent
  const systemPrompt = await preparePrompt(intent, profileId, memorySid, memory, session, AGENTS[intent].prompt)
  
  
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
      intents.set(convId, reply);
      return handleMessage(tac, { conversationId, message, memory, session })
    } else {
      history.push({ role: 'assistant', content: reply });
      return reply;
    }


  } else if (reply === "CHANGE_INTENT"){
    intents.set(convId, "INTENT_DETECTION");
    return handleMessage(tac, { conversationId, message, memory, session })
  } else {

    console.log("Claude Response: " + JSON.stringify(response, null, 4));
    
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
          { profileId, memorySid, callSid }
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

export function clearConversation(conversationId: string): void {
  // PRINT Conversation on hangup
  console.log(JSON.stringify(histories.get(conversationId)), null, 4);

  // then clear it
  histories.delete(conversationId);
  intents.delete(conversationId);
}
