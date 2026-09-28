import type { FastifyRequest, FastifyReply } from 'fastify';
import type { TACServer } from 'twilio-agent-connect';
import Twilio from 'twilio';

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

// -----------------------------------------------------------------------------
// Twilio signature validation for our custom routes
// -----------------------------------------------------------------------------
//
// TAC's SDK runs a signature-validation preHandler on its own routes
// (/twiml, /webhook, /conversation-relay-callback) but NOT on any user-added
// routes registered on `server.fastify`. That means /waitUrl,
// /redirect-back-to-agent, /enqueue-or-end-call, and /enqueue-completed
// would accept unauthenticated POSTs unless we add validation ourselves.
//
// We replicate TAC's validation logic verbatim here (see TACServer's
// validateRequestSignature in node_modules/twilio-agent-connect/dist/index.js):
//   1. Read X-Twilio-Signature header.
//   2. Reconstruct the full public URL, honouring X-Forwarded-* headers so
//      it works behind ngrok / a proxy.
//   3. If bodySHA256 is in the URL, use validateRequestWithBody (raw body
//      hash); otherwise use validateRequest (POST-form-param sort + HMAC).
//   4. On failure, reply 403 — Fastify halts the request when reply.send
//      is called in a preHandler, so the route handler never runs.
//
// /twiml is deliberately excluded — TAC's own preHandler covers it.

const PROTECTED_CUSTOM_ROUTES: ReadonlySet<string> = new Set([
  '/waitUrl',
  '/redirect-back-to-agent',
  '/enqueue-or-end-call',
  '/enqueue-completed',
]);

const routeRequiresSignatureCheck = (request: FastifyRequest): boolean => {
  if (request.method !== 'POST') return false;
  const rawUrl = request.url ?? '';
  // Strip query string when matching — Twilio may append ?foo=bar to waitUrl
  // etc. (we do this ourselves in enqueue-with-takeback.ts).
  const pathOnly = rawUrl.split('?')[0];
  return PROTECTED_CUSTOM_ROUTES.has(pathOnly);
};

const getForwardedProto = (request: FastifyRequest): string => {
  const raw = request.headers['x-forwarded-proto'];
  const first = Array.isArray(raw) ? raw[0] : raw;
  return first?.split(',')[0]?.trim() || 'https';
};

const getForwardedHost = (request: FastifyRequest): string => {
  const raw = request.headers['x-forwarded-host'] || request.headers.host;
  const first = Array.isArray(raw) ? raw[0] : raw;
  return first?.split(',')[0]?.trim() || '';
};

const getWebhookUrl = (request: FastifyRequest): string => {
  const proto = getForwardedProto(request);
  const host = getForwardedHost(request);
  return `${proto}://${host}${request.url}`;
};

async function validateTwilioSignature(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    // Fail closed — refusing to validate is safer than accepting unsigned
    // requests. This should never happen in a properly-configured deploy.
    request.log.error(
      { route: request.url },
      'TWILIO_AUTH_TOKEN not set — cannot validate Twilio signature; refusing request',
    );
    await reply.code(500).send({ error: 'Server misconfigured: missing TWILIO_AUTH_TOKEN' });
    return;
  }

  const signatureHeader = request.headers['x-twilio-signature'];
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
  const url = getWebhookUrl(request);

  let isValid: boolean;
  if (request.url?.includes('bodySHA256=')) {
    // Raw-body signature variant — used when Twilio posts JSON.
    const rawBody = (request as unknown as { rawBody?: string }).rawBody ?? '';
    isValid = Twilio.validateRequestWithBody(authToken, signature ?? '', url, rawBody);
  } else {
    // Standard form-post variant — used by every one of our custom routes.
    const params = (request.body as Record<string, string> | undefined) || {};
    isValid = Twilio.validateRequest(authToken, signature ?? '', url, params);
  }

  if (!isValid) {
    request.log.warn(
      { url, hasSignature: Boolean(signature) },
      'Invalid Twilio webhook signature on custom route — rejecting',
    );
    await reply.code(403).send({ error: 'Invalid webhook signature' });
  }
}

/**
 * Register the Fastify preHandler that validates the X-Twilio-Signature
 * header on our custom routes (/waitUrl, /redirect-back-to-agent,
 * /enqueue-or-end-call, /enqueue-completed). /twiml is deliberately skipped —
 * TAC's own preHandler covers it. Must be called before server.start().
 *
 * The preHandler is registered globally (matches all requests) and internally
 * checks the URL against PROTECTED_CUSTOM_ROUTES — this way we don't have to
 * modify each route registration to add per-route preHandlers, which would
 * be brittle if new routes are added later without wiring the hook.
 */
export function registerTwilioSignatureValidator(server: TACServer): void {
  server.fastify.addHook('preHandler', async (request, reply) => {
    if (!routeRequiresSignatureCheck(request)) return;
    await validateTwilioSignature(request, reply);
  });
}

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
