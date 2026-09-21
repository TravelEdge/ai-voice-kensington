// Silence watchdog — three-stage escalation driven purely by ConversationRelay
// speaker events (agentSpeaking / clientSpeaking on-off). The customer's POV:
//
//   1. Agent finishes speaking → agentSpeaking:off arrives → we arm the next
//      pending stage's timer (SILENCE_ONE by default).
//   2. If the caller speaks before the timer fires → clientSpeaking:on
//      cancels the timer and resets the escalation to stage 0.
//   3. If the caller stays silent through the timeout → the stage fires:
//        - SILENCE_ONE / SILENCE_TWO: inject a synthetic prompt into
//          handleMessage so the LLM re-asks the last question. The LLM's
//          response is sent back to CR via voiceChannel.sendResponse. After
//          TTS plays it, the resulting agentSpeaking:off arms the NEXT stage.
//        - HANGUP_CALL: bypass the LLM entirely. Set pendingHandoffData on
//          the session via executeEndCall, then sendResponse with a hardcoded
//          farewell — TAC's sendResponse also flushes pendingHandoffData over
//          the WS as the "end" frame, so CR cleanly closes the session and
//          the caller's line hangs up after the farewell finishes playing.

import type {
  TAC,
  VoiceChannel,
  ConversationId,
  ConversationSession,
} from 'twilio-agent-connect';

import { sessionLog, isLogEnabled } from './logger.js';
import { executeEndCall } from './tools/end-call.js';

// Deferred import to avoid a compile-time cycle between watchdog ↔ agents.
// handleMessage is only invoked at runtime, not at module init.
import { handleMessage } from './agents/index.js';

// Stages are named after the message string we synthesize on fire. `IDLE`
// is the terminal state after HANGUP has fired (call is on its way out) OR
// the initial state when no timer has run yet — but we treat "no state" and
// IDLE-with-nextStage-SILENCE_ONE as the same starting condition, so any
// fresh agentSpeaking:off begins the escalation from SILENCE_ONE.
export type WatchdogStage = 'SILENCE_ONE' | 'SILENCE_TWO' | 'HANGUP_CALL';

interface WatchdogState {
  nextStage: WatchdogStage | 'IDLE';
  timer?: NodeJS.Timeout;
}

const HANGUP_FAREWELL =
  "It seems like something has gone wrong at your end, please call us again at your earliest convenience. Thank you for calling Kensington Tours, goodbye!";

const state = new Map<string, WatchdogState>();

// Cached at init() time so we don't have to plumb tac/voiceChannel through
// every arm/cancel call site.
let tacRef: TAC | undefined;
let voiceRef: VoiceChannel | undefined;

export function initWatchdog(tac: TAC, voiceChannel: VoiceChannel): void {
  tacRef = tac;
  voiceRef = voiceChannel;
}

const readTimeoutSeconds = (envKey: string): number => {
  const raw = process.env[envKey];
  const parsed = raw ? parseFloat(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15;
};

const timeoutMsForStage = (stage: WatchdogStage): number => {
  switch (stage) {
    case 'SILENCE_ONE':  return readTimeoutSeconds('WATCHDOG_SILENCE_ONE_SECONDS') * 1000;
    case 'SILENCE_TWO':  return readTimeoutSeconds('WATCHDOG_SILENCE_TWO_SECONDS') * 1000;
    case 'HANGUP_CALL':  return readTimeoutSeconds('WATCHDOG_HANGUP_SECONDS') * 1000;
  }
};

const advanceStage = (fired: WatchdogStage): WatchdogStage | 'IDLE' => {
  switch (fired) {
    case 'SILENCE_ONE':  return 'SILENCE_TWO';
    case 'SILENCE_TWO':  return 'HANGUP_CALL';
    case 'HANGUP_CALL':  return 'IDLE';
  }
};

// Called from agentSpeaking:off. Arms whichever stage is pending next.
// Idempotent — safe to call from a re-armed cycle (post-SILENCE_ONE fire
// triggering fresh agentSpeaking events for the nudge response).
export function armSilenceTimer(
  conversationId: string,
  session: ConversationSession | undefined,
): void {
  const entry = state.get(conversationId) ?? { nextStage: 'SILENCE_ONE' as const };
  if (entry.nextStage === 'IDLE') {
    // HANGUP has already fired — call is ending, do not arm anything else.
    return;
  }

  // Cancel any existing timer before re-arming (defense against double-fire).
  if (entry.timer) clearTimeout(entry.timer);

  const stage = entry.nextStage;
  const ms = timeoutMsForStage(stage);
  entry.timer = setTimeout(() => {
    void fireStage(conversationId, session, stage);
  }, ms);
  entry.timer.unref?.();
  state.set(conversationId, entry);
}

// Called from clientSpeaking:on. Cancels any active timer and resets the
// escalation to stage 0 — treating the caller as freshly engaged. If the
// watchdog has been disabled (handoff / end_call terminal action already
// fired), we intentionally do NOT re-arm the escalation: any last-second
// caller speech during the outbound farewell TTS should not resurrect the
// timer for a session that's about to die.
export function cancelSilenceTimer(conversationId: string): void {
  const entry = state.get(conversationId);
  if (!entry) return;
  if (entry.timer) clearTimeout(entry.timer);
  entry.timer = undefined;
  if (entry.nextStage !== 'IDLE') {
    entry.nextStage = 'SILENCE_ONE';
  }
  state.set(conversationId, entry);
}

// Called from executeHandoff / executeEndCall — i.e. when a terminal action
// has fired and the current session is being wound down but hasn't been
// torn down yet (TTS still needs to play the farewell, CR still needs to
// receive the WS "end" frame). We MUST keep an IDLE marker in the state
// map — deleting it here would let the next agentSpeaking:off (from the
// farewell TTS) re-create a fresh { nextStage: 'SILENCE_ONE' } entry and
// arm the timer all over again. armSilenceTimer / cancelSilenceTimer both
// respect the IDLE marker and refuse to re-arm.
export function disableWatchdog(conversationId: string): void {
  const entry = state.get(conversationId) ?? { nextStage: 'IDLE' as const };
  if (entry.timer) clearTimeout(entry.timer);
  entry.timer = undefined;
  entry.nextStage = 'IDLE';
  state.set(conversationId, entry);
}

// Called from clearConversationById at teardown so the IDLE marker (and any
// dangling timer, though there should be none by this point) is swept and
// the map doesn't leak entries across calls.
export function purgeWatchdogState(conversationId: string): void {
  const entry = state.get(conversationId);
  if (entry?.timer) clearTimeout(entry.timer);
  state.delete(conversationId);
}

async function fireStage(
  conversationId: string,
  session: ConversationSession | undefined,
  stage: WatchdogStage,
): Promise<void> {
  if (isLogEnabled('SILENCE_TIMER')) {
    sessionLog(conversationId).warn({ description: stage }, 'SILENCE_TIMER');
  }

  // Advance the pending stage BEFORE firing so the post-fire agentSpeaking:off
  // (from the LLM/hardcoded response's TTS) arms the correct next stage.
  const entry = state.get(conversationId) ?? { nextStage: 'SILENCE_ONE' as const };
  entry.timer = undefined;
  entry.nextStage = advanceStage(stage);
  state.set(conversationId, entry);

  if (!voiceRef || !tacRef) {
    sessionLog(conversationId).error(
      { description: 'Watchdog fired before initWatchdog() ran — this is a wiring bug' },
      'SILENCE_TIMER',
    );
    return;
  }

  // Cast: our internal Map keys are plain strings, but sendResponse and
  // handleMessage need the branded ConversationId. Runtime it's the same
  // string; TS just wants the brand.
  const cid = conversationId as ConversationId;

  if (stage === 'HANGUP_CALL') {
    // Bypass the LLM. Set pendingHandoffData first (via executeEndCall),
    // then send the farewell — TAC's sendResponse pipes the pendingHandoffData
    // as the WS "end" frame right after the text token, so CR speaks the
    // farewell, closes, and calls the action URL.
    if (!session) {
      sessionLog(conversationId).error(
        { description: 'Watchdog HANGUP_CALL fired but no session — cannot hang up cleanly' },
        'SILENCE_TIMER',
      );
      return;
    }
    try {
      await executeEndCall({ reason: 'silence-watchdog-hangup' }, session);
      await voiceRef.sendResponse(cid, HANGUP_FAREWELL);
    } catch (err) {
      sessionLog(conversationId).error(
        {
          err: err instanceof Error ? err.message : String(err),
          description: 'Watchdog HANGUP send failed',
        },
        'SILENCE_TIMER',
      );
    }
    return;
  }

  // SILENCE_ONE / SILENCE_TWO — route the synthetic prompt through the LLM
  // so it can look up "the last question" in history via the SILENCE HANDLING
  // section preparePrompt appends to every agent's system prompt.
  if (!session) {
    sessionLog(conversationId).error(
      { description: `Watchdog ${stage} fired but no session — cannot inject prompt` },
      'SILENCE_TIMER',
    );
    return;
  }

  try {
    const response = await handleMessage(tacRef, {
      conversationId: cid,
      message: stage,
      session,
    });
    if (response.trim()) {
      await voiceRef.sendResponse(cid, response);
    } else {
      sessionLog(conversationId).warn(
        { description: `Watchdog ${stage} produced empty LLM response — caller will hear silence` },
        'SILENCE_TIMER',
      );
    }
  } catch (err) {
    sessionLog(conversationId).error(
      {
        err: err instanceof Error ? err.message : String(err),
        description: `Watchdog ${stage} injection failed`,
      },
      'SILENCE_TIMER',
    );
  }
}
