import { config } from 'dotenv';
config();

import {
  TAC,
  TACConfig,
  VoiceChannel,
  SMSChannel,
  TACServer,
} from 'twilio-agent-connect';
import {
  handleMessage,
  clearConversation,
} from './agents/index.js';
import {
  cacheBackendData,
  histories,
  registerPendingCallSid,
  registerPendingCustomParams,
  registerPreloadedTraits,
} from './cache/index.js';
import enqueue_and_wait_routes from './additional-routes/enqueue-with-takeback.js'
import {
  consumeTwimlQueryForCall,
  normalizeBoolParam,
  registerTwimlQueryCarrier,
} from './additional-routes/twiml-query-carrier.js';


await cacheBackendData();

const tac = await TAC.create({ config: TACConfig.fromEnv() });

// speechTimeout accepts "auto" or a number of seconds; env vars are strings so
// we coerce numeric values here.
const speechTimeoutEnv = process.env.DEFAULT_TWIML_OPTIONS_SPEECH_TIMEOUT;
const speechTimeout: 'auto' | number | undefined =
  !speechTimeoutEnv ? undefined
    : speechTimeoutEnv === 'auto' ? 'auto'
    : Number(speechTimeoutEnv);

// Barge-in tuning. `interruptible` gates what caller input cuts off TTS
// ("speech" ignores accidental DTMF), and `interruptSensitivity` controls how
// easily background noise triggers an interrupt (Twilio defaults to "high",
// which fires on coughs / backchannel "mm-hmm"s — "medium" is safer).
const interruptible = process.env.DEFAULT_TWIML_OPTIONS_INTERRUPTIBLE as
  | 'any' | 'speech' | 'none' | undefined;
const interruptSensitivity = process.env.DEFAULT_TWIML_OPTIONS_INTERRUPT_SENSITIVITY as
  | 'high' | 'medium' | 'low' | undefined;
const welcomeGreetingInterruptible = process.env.DEFAULT_TWIML_OPTIONS_WELCOME_GREETING_INTERRUPTIBLE as
  | 'any' | 'speech' | 'none' | undefined;

// Register channels
const voiceChannel = new VoiceChannel(tac, {
  memoryMode: "never",
  defaultTwimlOptions: {
    speechTimeout,
    welcomeGreeting: process.env.DEFAULT_TWIML_OPTIONS_WELCOME_GREETING,
    actionUrl: `https://${process.env.TWILIO_VOICE_PUBLIC_DOMAIN}/enqueue-or-end-call`,
    voice: process.env.DEFAULT_TWIML_OPTIONS_VOICE,
    interruptible,
    interruptSensitivity,
    welcomeGreetingInterruptible,
  }

});
const smsChannel = new SMSChannel(tac, {memoryMode: "never"});


tac.registerChannel(voiceChannel);
tac.registerChannel(smsChannel);

// Per-call customizer for the inbound /twiml endpoint. Always emits isAgent
// and isRepeat as ConversationRelay <Parameter> values so they're guaranteed
// to appear on the setup event's customParameters. Values come from query/
// form fields on the Twilio number's voice webhook URL — anything else
// defaults to "false".
voiceChannel.onInboundCallTwiml(async (req) => {
  // TAC drops URL query params before this callback fires (see
  // additional-routes/twiml-query-carrier.ts for the full explanation), so we
  // read them from the CallSid-keyed side map populated by that preHandler.
  const carriedQuery = consumeTwimlQueryForCall(req.callSid);
  return {
    customParameters: {
      isAgent: normalizeBoolParam(carriedQuery?.isAgent),
      isRepeat: normalizeBoolParam(carriedQuery?.isRepeat),
    },
  };
});

// Capture the CallSid from the ConversationRelay setup so tools can
// update the in-progress call (e.g. transfer_to_workflow) later.
voiceChannel.on('setup', ({ callSid, from, customParameters }) => {
  registerPendingCallSid(from, callSid);
  registerPendingCustomParams(from, customParameters);
  // Takeback flow: /redirect-back-to-agent prefetches the caller's traits and
  // hands them off as a CR <Parameter>. Stash them so the STACK_CALL first
  // turn can skip the Memory API call. Done on setup (not in the route) so
  // the traits land on the same server instance that owns the WS session.
  const preloadedTraits = customParameters?.traits;
  if (typeof preloadedTraits === 'string' && preloadedTraits.length > 0) {
    registerPreloadedTraits(from, preloadedTraits);
  }
});

// Barge-in bookkeeping. ConversationRelay stops TTS on its side automatically
// and TAC aborts the in-flight stream task before this fires — our job here is
// to fix the transcript. The last assistant turn in history is the FULL text
// we intended to say; rewrite it to what the caller actually heard (from
// utteranceUntilInterrupt) and tag it so Claude's next turn doesn't try to
// finish the interrupted thought.
voiceChannel.on('interrupt', ({ conversationId, utteranceUntilInterrupt, durationUntilInterruptMs }) => {
  const convId = String(conversationId);
  const history = histories.get(convId);
  if (!history || history.length === 0) return;

  const last = history[history.length - 1];
  // Skip tool_use turns (content is an array) — those aren't spoken to the caller.
  if (last.role !== 'assistant' || typeof last.content !== 'string') return;

  const spoken = (utteranceUntilInterrupt ?? '').trim();
  if (spoken.length === 0) {
    // Nothing reached the caller — drop the turn entirely.
    history.pop();
  } else {
    last.content = `${spoken} [caller interrupted]`;
  }

  console.log(
    `%cINTERRUPT: %c${spoken || '(nothing spoken)'} %c(${durationUntilInterruptMs ?? 0}ms)`,
    'color: yellow;',
    'color: green;',
    'color: gray;',
  );
});

// Single handler for all channels — TAC routes the response back correctly
tac.onMessageReady(async ({ conversationId, message, session }) => {
   return handleMessage(tac, { conversationId, message, session })
});

// Clean up in-memory history when a voice call ends
tac.onConversationEnded(({ session }) => {
  clearConversation(session);
});

const server = new TACServer(tac, {port: 3000});

// register custom routes
await enqueue_and_wait_routes(server, tac);

// Mirror /twiml URL query params into a CallSid-keyed side map so
// onInboundCallTwiml can consume them. Non-mutating — preserves the body
// bytes Twilio signed, so TAC's route-level signature check still passes.
registerTwimlQueryCarrier(server);

await server.start();
