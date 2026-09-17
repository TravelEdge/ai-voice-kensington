import type { FastifyRequest } from 'fastify';
import type { TACServer } from 'twilio-agent-connect';

import {
  twimlQueryByCallSid,
  twimlQueryTimers,
  TWIML_QUERY_TTL_MS,
} from '../cache/index.js';

// TAC's inbound /twiml handler builds TwiMLRequest.extra from request.body
// ONLY (twilio-agent-connect/dist/index.js:6112) — URL query params are
// dropped. Naive fix: merge query into body in a preHandler. Problem: TAC's
// Twilio signature validation (route-level preHandler) recomputes the sig
// over `URL + sorted body params`. Mutating body before that check makes the
// recomputed signature mismatch what Twilio sent → 403 "Invalid webhook
// signature".
//
// This module solves it without touching the body: a global preHandler on
// POST /twiml stashes the URL query in a CallSid-keyed side map (owned by
// cache/index.ts alongside the other pending-per-call caches), then
// onInboundCallTwiml consumes from that map to build customParameters.
// Body stays byte-identical, TAC's signature check passes, and the query
// values still reach the LLM pipeline.
//
// A 30-second TTL guards against orphan entries if TAC's handler errors out
// before consuming — same safety pattern as pendingPreloadedTraitsByFrom.

/**
 * Normalize a Twilio custom-parameter value to the string "true" or "false".
 * ConversationRelay <Parameter> values are always strings at the wire level,
 * so we coerce here to keep the setup event's customParameters shape stable.
 * Anything that isn't literally `true` / `"true"` collapses to `"false"`.
 */
export const normalizeBoolParam = (value: unknown): string =>
  value === true || value === 'true' ? 'true' : 'false';

/**
 * Called from `onInboundCallTwiml(req => ...)` — returns the URL query fields
 * from the corresponding /twiml POST (or undefined if nothing was carried).
 * Consuming clears the entry so a retry of the same CallSid won't get a stale
 * carry-over from a prior request.
 */
export function consumeTwimlQueryForCall(
  callSid: string | undefined
): Record<string, string> | undefined {
  if (!callSid) return undefined;
  const query = twimlQueryByCallSid.get(callSid);
  if (query === undefined) return undefined;
  twimlQueryByCallSid.delete(callSid);
  const timer = twimlQueryTimers.get(callSid);
  if (timer) {
    clearTimeout(timer);
    twimlQueryTimers.delete(callSid);
  }
  return query;
}

const isTwimlPostRequest = (request: FastifyRequest): boolean => {
  if (request.method !== 'POST') return false;
  const rawUrl = request.url ?? '';
  return rawUrl === '/twiml' || rawUrl.startsWith('/twiml?');
};

/**
 * Register the Fastify preHandler that mirrors /twiml URL query params into a
 * side map for the onInboundCallTwiml customizer to read.
 *
 * MUST be called before `server.start()` so the hook is in place when Fastify
 * begins accepting requests. Safe to call before or after custom routes are
 * added — global hooks apply to all routes regardless of registration order.
 */
export function registerTwimlQueryCarrier(server: TACServer): void {
  server.fastify.addHook('preHandler', async (request) => {
    if (!isTwimlPostRequest(request)) return;

    const query = (request.query ?? {}) as Record<string, string>;
    const body = (request.body ?? {}) as Record<string, unknown>;
    const callSid = typeof body.CallSid === 'string' ? body.CallSid : undefined;

    if (!callSid || Object.keys(query).length === 0) return;

    // Reset TTL if we're overwriting an existing entry (Twilio retry).
    const existingTimer = twimlQueryTimers.get(callSid);
    if (existingTimer) clearTimeout(existingTimer);

    twimlQueryByCallSid.set(callSid, query);
    const timer = setTimeout(() => {
      twimlQueryByCallSid.delete(callSid);
      twimlQueryTimers.delete(callSid);
    }, TWIML_QUERY_TTL_MS);
    timer.unref?.();
    twimlQueryTimers.set(callSid, timer);

    request.log.child({ type: 'session' }).info(
      {
        route: '/twiml',
        callSid,
        query,
        description: 'Captured inbound /twiml URL query params for onInboundCallTwiml customizer',
      },
      'CUSTOM_ROUTE',
    );
  });
}
