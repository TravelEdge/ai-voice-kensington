import Anthropic from '@anthropic-ai/sdk';

import type {
  TACMemoryResponse,
  ConversationSession,
} from 'twilio-agent-connect';

import {
  authenticate as leadDepoAuthenticate,
  getAllDestinations,
  getAllActivities,
  getAllChannels,
} from '../tools/lead-queue.js';
import { authenticate as tmtLegacyAuthenticate } from '../tools/tmt-legacy.js';
import { authenticate as tmtProfileAuthenticate } from '../tools/tmt-profile.js';

// Per-conversation message history keyed by conversationId
export const histories = new Map<string, Anthropic.MessageParam[]>();

// Per-conversation memory cache
// we dont want to load memory by default for any calls
// only explicitly when about to handoff for a new lead
// so we can save the new lead data (we never care about its presence)
// and when we have a call returned from a handoff, so we can use that data
export const memoryCache = new Map<string, TACMemoryResponse>();

// Per-conversation cache of the formatted NewLead traits string. STACK_CALL
// needs those traits injected into the system prompt on every turn — caching
// avoids a round-trip to the Memory API each time the caller speaks.
export const traitsCache = new Map<string, string>();

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
export const intents = new IntentMap();

// CallSid captured on ConversationRelay setup, keyed by the caller's address.
// The voice channel exposes callSid on setup (before the conversation is
// initialized) and provides authorInfo.address on the first prompt, so we join
// on the caller's address to move it onto session.metadata.callSid.
const pendingCallSidByFrom = new Map<string, string>();

// ConversationRelay <Parameter> values captured on setup, keyed by from. Used
// to signal takeback flows into handleMessage before the first user prompt.
const pendingCustomParamsByFrom = new Map<string, Record<string, unknown>>();

// Traits string prefetched by /redirect-back-to-agent and delivered as a CR
// <Parameter> on the takeback session. Keyed by caller E.164 (same convention
// as the other pending maps) because at voice.setup time we don't have the
// conversation id yet. Consumed on the first user turn — the value is promoted
// into the conversation-scoped traitsCache and this entry is cleared. A 30s
// TTL sweeps any straggler if the caller hangs up before the first turn, so
// we don't leak preloaded state onto the next call from the same number.
const pendingPreloadedTraitsByFrom = new Map<string, string>();
const pendingPreloadedTraitsTimers = new Map<string, NodeJS.Timeout>();
const PRELOADED_TRAITS_TTL_MS = 30_000;

// URL query params captured on the inbound /twiml POST, keyed by CallSid.
// Populated by the Fastify preHandler in additional-routes/twiml-query-
// carrier.ts (which reads them without mutating request.body so TAC's
// signature check stays valid) and consumed by the onInboundCallTwiml
// customizer. 30s TTL guards against orphan entries if TAC's route handler
// errors out before consuming.
export const twimlQueryByCallSid = new Map<string, Record<string, string>>();
export const twimlQueryTimers = new Map<string, NodeJS.Timeout>();
export const TWIML_QUERY_TTL_MS = 30_000;

export function registerPendingCallSid(from: string, callSid: string): void {
  pendingCallSidByFrom.set(from, callSid);
}

export function registerPendingCustomParams(
  from: string,
  params: Record<string, unknown> | undefined
): void {
  if (params && Object.keys(params).length > 0) pendingCustomParamsByFrom.set(from, params);
}

export function registerPreloadedTraits(from: string, traits: string): void {
  if (!traits) return;
  // Reset the TTL if we're overwriting an existing entry.
  const existingTimer = pendingPreloadedTraitsTimers.get(from);
  if (existingTimer) clearTimeout(existingTimer);
  pendingPreloadedTraitsByFrom.set(from, traits);
  const timer = setTimeout(() => {
    pendingPreloadedTraitsByFrom.delete(from);
    pendingPreloadedTraitsTimers.delete(from);
  }, PRELOADED_TRAITS_TTL_MS);
  // Don't keep the event loop alive just for this timer during shutdown.
  timer.unref?.();
  pendingPreloadedTraitsTimers.set(from, timer);
}

export function consumePreloadedTraits(from: string): string | undefined {
  const traits = pendingPreloadedTraitsByFrom.get(from);
  if (traits === undefined) return undefined;
  pendingPreloadedTraitsByFrom.delete(from);
  const timer = pendingPreloadedTraitsTimers.get(from);
  if (timer) {
    clearTimeout(timer);
    pendingPreloadedTraitsTimers.delete(from);
  }
  return traits;
}

export const resolveCallSid = (session: ConversationSession): string | undefined => {
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

export const resolveCustomParams = (
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

// Purge every per-conversation cache so a hung-up call doesn't leak state
// into a subsequent one on the same caller number. The pending maps are keyed
// by the caller's E.164 address (populated on ConversationRelay setup); they
// normally clear themselves on the first prompt via resolveCallSid/
// resolveCustomParams, but a caller who hangs up before saying anything would
// leak an entry — sweep them here too.
export function purgeConversation(convId: string, from: string | undefined): void {
  histories.delete(convId);
  intents.delete(convId);
  memoryCache.delete(convId);
  traitsCache.delete(convId);

  if (from) {
    pendingCallSidByFrom.delete(from);
    pendingCustomParamsByFrom.delete(from);
    // Sweep any straggling preloaded traits + cancel its TTL timer.
    const timer = pendingPreloadedTraitsTimers.get(from);
    if (timer) {
      clearTimeout(timer);
      pendingPreloadedTraitsTimers.delete(from);
    }
    pendingPreloadedTraitsByFrom.delete(from);
  }
}

// One-time startup priming for the third-party backends the agent depends on.
// Called from the server entry point before channels start accepting traffic.
export async function cacheBackendData(): Promise<void> {
  // pre-auth and cache entity values for leadDepo
  // caches desintations, activities and channels
  await leadDepoAuthenticate();

  const [destinations, activities, channels] = await Promise.all([
    getAllDestinations(),
    getAllActivities(),
    getAllChannels(),
  ]);
  console.log(
    `[LeadDepo] Cached ${destinations.length} continents, ${activities.length} activities, ${channels.length} channels.`
  );

  // Pre-cache TMT bearer tokens. Non-fatal — TMT service-account credentials
  // are provisioned during Week 1, so a missing/invalid config at boot should
  // not block the rest of the server from starting.
  await Promise.all([
    tmtLegacyAuthenticate().then(
      () => console.log('[tmt-legacy] Cached bearer token.'),
      (err: unknown) =>
        console.warn(
          `[tmt-legacy] Startup auth skipped: ${err instanceof Error ? err.message : String(err)}`
        )
    ),
    tmtProfileAuthenticate().then(
      () => console.log('[tmt-profile] Cached bearer token.'),
      (err: unknown) =>
        console.warn(
          `[tmt-profile] Startup auth skipped: ${err instanceof Error ? err.message : String(err)}`
        )
    ),
  ]);
}
