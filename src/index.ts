// dotenv MUST run before any other import's module-body code executes, because
// modules like ./logger.js read process.env at import time. `import 'dotenv/config'`
// is the side-effect form that populates process.env during import resolution;
// the older `import { config } from 'dotenv'; config()` pattern runs config()
// too late in ES modules (imports are hoisted above the config() statement).
import 'dotenv/config';

import Fastify from 'fastify';
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
import {
  logger,
  sessionLog,
  isLogEnabled,
} from './logger.js';
import {
  initWatchdog,
  armSilenceTimer,
  cancelSilenceTimer,
} from './watchdog.js';


await cacheBackendData();

// Hand the shared pino instance to TAC so its own logs (channel registration,
// conversation lifecycle, memory client, etc.) flow through the same
// transport as ours.
const tac = await TAC.create({ config: TACConfig.fromEnv(), logger });

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
const speechModel = process.env.DEFAULT_TWIML_OPTIONS_SPEECH_MODEL as 
  | 'flux' | 'nova-3-general' | 'nova-3-medical' | 'nova-2-general' | undefined;
const eotThreshold = process.env.DEFAULT_TWIML_OPTIONS_EOT_THRESHOLD  as number | undefined;

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
    speechModel,
    eotThreshold,
    // Subscribe to CR speaker events (agentSpeaking / clientSpeaking on-off).
    // Hardcoded rather than env-configurable because the silence watchdog
    // (see src/watchdog.ts) depends on these events firing — letting an env
    // var quietly disable them would break the watchdog with no warning.
    events: 'speaker-events',
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
      // Ride the greeting text over as a CR <Parameter> so the setup event
      // exposes it on customParameters. handleMessageInternal seeds the
      // history with it on turn 0 — that way Claude knows what the bot
      // just said, and the silence-watchdog's "repeat last question" clause
      // has an assistant turn to reference on the very first nudge.
      welcomeGreeting: process.env.DEFAULT_TWIML_OPTIONS_WELCOME_GREETING ?? '',
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

  if (isLogEnabled('INTERRUPT')) {
    sessionLog(convId).info(
      { utterance: spoken || null, durationUntilInterruptMs: durationUntilInterruptMs ?? 0 },
      'INTERRUPT',
    );
  }
});

// -----------------------------------------------------------------------------
// Silence watchdog wiring
// -----------------------------------------------------------------------------
// CR emits agentSpeaking on/off around TTS playback and clientSpeaking on/off
// around STT-detected caller speech. The watchdog uses these two signals to
// escalate through SILENCE_ONE → SILENCE_TWO → HANGUP_CALL when the caller
// goes quiet. handleMessage has no bearing on the timers — the timer is
// driven purely by what the caller experiences on the CR side of the wire.
initWatchdog(tac, voiceChannel);

voiceChannel.on('agentSpeaking', ({ conversationId, value, session }) => {
  const convId = String(conversationId);
  if (isLogEnabled('CR_SPEAK_EVENT')) {
    sessionLog(convId).info({}, value === 'on' ? 'CR_AGENT_SPEAK_ON' : 'CR_AGENT_SPEAK_OFF');
  }
  // Arm the next-stage silence timer the moment the agent stops speaking.
  // On the very first turn this arms SILENCE_ONE; after a nudge has fired,
  // fireStage() has already advanced nextStage, so this arms SILENCE_TWO
  // (and then HANGUP_CALL after that).
  if (value === 'off') {
    armSilenceTimer(convId, session);
  }
});

voiceChannel.on('clientSpeaking', ({ conversationId, value }) => {
  const convId = String(conversationId);
  if (isLogEnabled('CR_SPEAK_EVENT')) {
    sessionLog(convId).info({}, value === 'on' ? 'CR_CLIENT_SPEAK_ON' : 'CR_CLIENT_SPEAK_OFF');
  }
  // Caller is engaged again — cancel the current timer and reset the
  // escalation to stage 0. Next agentSpeaking:off starts SILENCE_ONE fresh.
  if (value === 'on') {
    cancelSilenceTimer(convId);
  }
});

// Single handler for all channels — TAC routes the response back correctly
tac.onMessageReady(async ({ conversationId, message, session }) => {
   return handleMessage(tac, { conversationId, message, session })
});

// Clean up in-memory history when a voice call ends
tac.onConversationEnded(({ session }) => {
  clearConversation(session);
});

// Build our own Fastify instance so we can share the pino logger with TAC.
// `disableRequestLogging` silences the "incoming request" / "request completed"
// per-request noise while preserving error logs. It emits a FSTDEP023
// deprecation notice pointing at the future `logController` API, but the
// runtime rejects the object form of that new API in Fastify 5.x — the
// top-level flag is the working path until Fastify 6 lands.
// The `as any` on fastifyInstance sidesteps a Fastify 5 type-strictness
// issue where passing `loggerInstance` shifts the inferred generic away from
// TAC's expected FastifyInstance shape. No runtime impact.
const fastifyApp = Fastify({
  loggerInstance: logger,
  disableRequestLogging: true,
});

const server = new TACServer(tac, {
  port: 3000,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fastifyInstance: fastifyApp as any,
});

// register custom routes
await enqueue_and_wait_routes(server, tac);

// Mirror /twiml URL query params into a CallSid-keyed side map so
// onInboundCallTwiml can consume them. Non-mutating — preserves the body
// bytes Twilio signed, so TAC's route-level signature check still passes.
registerTwimlQueryCarrier(server);

await server.start();
