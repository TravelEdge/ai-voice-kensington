import { AsyncLocalStorage } from 'node:async_hooks';
import pino, { type Logger } from 'pino';

const isDev = process.env.NODE_ENV !== 'production';
// LOG_FORMAT=json forces raw JSON output even in dev, so `npm run dev` can be
// piped through jq for a compact table view (see the dev:table example in the
// README). Without it, dev output flows through pino-pretty.
const forceJson = process.env.LOG_FORMAT === 'json';

// Shared root pino instance. Handed to TAC (`TAC.create({ logger })`) and to
// Fastify (`loggerInstance`) so every log source — TAC internals, Fastify
// request-lifecycle, our own code — flows through the same transport. In dev
// that transport is pino-pretty (readable one-liners); in prod it's raw JSON
// so aggregators can parse it.
export const logger: Logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(isDev && !forceJson && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss.l',
        ignore: 'pid,hostname,reqId',
      },
    },
  }),
});

// Server-scoped logger — boot-time cache priming, backend auth, everything
// that isn't tied to a specific voice call.
export const serverLog: Logger = logger.child({ type: 'server' });

// -----------------------------------------------------------------------------
// Session context (AsyncLocalStorage)
// -----------------------------------------------------------------------------

// Per-invocation state that follows a single handleMessage flow — including its
// recursive intent-detection re-entry — via AsyncLocalStorage. Tools running
// inside the flow read the same store, so they log with the right
// conversationId and their timing data lands in the aggregate response log.
interface SessionStore {
  conversationId: string;
  callSid?: string;
  log: Logger;
  startedAt: number;
  claudeApiCalls: ClaudeApiCall[];
}

export interface ClaudeApiCall {
  model: string;
  requestTime: number;
  // Present when CLAUDE_API_PAYLOAD flag is enabled — the full request body.
  max_tokens?: number;
  system?: unknown;
  messages?: unknown;
  tools?: unknown;
  // Present when CLAUDE_API_PAYLOAD is disabled — cheap fallback fields.
  lastMessage?: unknown;
}

const sessionContext = new AsyncLocalStorage<SessionStore>();

// Side-map from conversationId to CallSid. Populated by handleMessage on entry
// so event handlers that fire OUTSIDE the ALS scope (interrupt, teardown) can
// still emit logs tagged with the right CallSid. A reverse map is maintained
// alongside so HTTP routes (e.g. /enqueue-or-end-call) that only receive
// CallSid can resolve back to the conversationId for cleanup.
const sessionCallSids = new Map<string, string>();
const callSidToConversationIds = new Map<string, string>();

// Side-map for interrupt timestamps. When onInterrupt fires (outside the ALS
// scope), we record performance.now() here — the next handleMessage invocation
// consumes it as its startedAt, so customerToAgentResponseTime is measured
// from the barge-in moment (when the caller started speaking) rather than
// from when the ASR-transcribed prompt finally landed on onMessageReady.
const interruptTimestamps = new Map<string, number>();

export function registerSessionCallSid(
  conversationId: string,
  callSid: string | undefined,
): void {
  if (!callSid) return;
  sessionCallSids.set(conversationId, callSid);
  callSidToConversationIds.set(callSid, conversationId);
}

export function lookupCallSid(conversationId: string): string | undefined {
  return sessionCallSids.get(conversationId);
}

export function lookupConversationIdByCallSid(callSid: string): string | undefined {
  return callSidToConversationIds.get(callSid);
}

export function recordInterruptTimestamp(conversationId: string): void {
  interruptTimestamps.set(conversationId, performance.now());
}

function consumeInterruptTimestamp(conversationId: string): number | undefined {
  const ts = interruptTimestamps.get(conversationId);
  if (ts !== undefined) interruptTimestamps.delete(conversationId);
  return ts;
}

// Called from clearConversation when the CR session ends — evicts per-call
// state so a subsequent call on the same conversationId (or memory pressure)
// isn't polluted by stale entries.
export function purgeSessionState(conversationId: string): void {
  const callSid = sessionCallSids.get(conversationId);
  sessionCallSids.delete(conversationId);
  interruptTimestamps.delete(conversationId);
  if (callSid) callSidToConversationIds.delete(callSid);
}

// Idempotent — if we're already inside a session (recursive handleMessage from
// the intent-detection path), keep using the existing store so accumulated
// timings survive the re-entry. Otherwise start a fresh store.
export function runInSession<T>(
  conversationId: string,
  callSid: string | undefined,
  fn: () => Promise<T>,
): Promise<T> {
  const existing = sessionContext.getStore();
  if (existing) return fn() as Promise<T>;

  // If the caller just barged in on the AI, use the interrupt moment as the
  // response-timer start — the caller has been "waiting" since then, not since
  // ASR delivered the transcribed prompt.
  const interruptedAt = consumeInterruptTimestamp(conversationId);
  const startedAt = interruptedAt ?? performance.now();

  const bindings: Record<string, unknown> = { type: 'session', conversationId };
  if (callSid) bindings.callSid = callSid;

  const store: SessionStore = {
    conversationId,
    callSid,
    log: logger.child(bindings),
    startedAt,
    claudeApiCalls: [],
  };
  return sessionContext.run(store, fn);
}

export function getSessionStore(): SessionStore | undefined {
  return sessionContext.getStore();
}

// Prefer the ALS-bound child logger. Outside the ALS scope, build a fresh
// child with { conversationId, callSid } — callSid comes from the caller if
// provided, else from the sessionCallSids side-map. If neither conversationId
// nor callSid is available, tag the record so we can spot uncontextualized
// session logs and fix them.
export function sessionLog(
  conversationId?: string,
  callSid?: string,
): Logger {
  const bound = sessionContext.getStore();
  if (bound) return bound.log;

  const bindings: Record<string, unknown> = { type: 'session' };
  bindings.conversationId = conversationId ?? 'unknown';
  const resolvedCallSid = callSid ?? (conversationId ? lookupCallSid(conversationId) : undefined);
  if (resolvedCallSid) bindings.callSid = resolvedCallSid;
  return logger.child(bindings);
}

// Automatic session-vs-server picker for code paths that run in BOTH contexts
// (e.g. a backend auth helper called at boot for prewarming AND at runtime
// during a tool call).
export function contextLog(): Logger {
  const bound = sessionContext.getStore();
  return bound ? bound.log : serverLog;
}

// -----------------------------------------------------------------------------
// JSON auto-parsing for logs
// -----------------------------------------------------------------------------
//
// Tool return values are strings by contract (Anthropic tool_result content is
// string-typed), so JSON payloads travel through the system as escaped strings.
// pino-pretty renders those as one giant blob of `\n`s. deepAutoParse walks
// the log payload, finds strings that ARE JSON (or embed JSON after a
// "prefix: " marker), and parses them so the pretty printer can render the
// structure. Non-JSON strings pass through unchanged.

const looksLikeJson = (s: string): boolean => {
  const t = s.trim();
  return (
    (t.startsWith('{') && t.endsWith('}')) ||
    (t.startsWith('[') && t.endsWith(']'))
  );
};

export function deepAutoParse(value: unknown): unknown {
  if (typeof value === 'string') {
    if (looksLikeJson(value)) {
      try {
        return deepAutoParse(JSON.parse(value));
      } catch {
        return value;
      }
    }
    // "prefix: {json}" — tool return strings commonly use this shape, e.g.
    // `new_lead_traits_updated: {"isAgent":true,...}`. Split at the first `{`
    // or `[`, keep the prefix as `message`, put the parsed JSON in `data`.
    const braceIdx = value.search(/[{[]/);
    if (braceIdx > 0) {
      const rest = value.slice(braceIdx);
      if (looksLikeJson(rest)) {
        try {
          const message = value.slice(0, braceIdx).trim().replace(/[:,]$/, '').trim();
          return { message, data: deepAutoParse(JSON.parse(rest)) };
        } catch {
          return value;
        }
      }
    }
    return value;
  }
  if (Array.isArray(value)) return value.map(deepAutoParse);
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepAutoParse(v);
    }
    return out;
  }
  return value;
}

// -----------------------------------------------------------------------------
// Flag-based log suppression
// -----------------------------------------------------------------------------
//
// LOG_DISABLED_FLAGS is a comma-separated list of category keys to SUPPRESS.
// Default (empty) → everything is logged. Set to a subset to quiet down the
// stream without touching code.
//
// Available flags (see docs in .env.example):
//   TOOLS_CALL          per-tool-invocation log with input + start time
//   TOOLS_RESULT        per-tool-result log with the full parsed result + duration
//   CLAUDE_API          per-Claude-attempt log with model + requestTime
//   CLAUDE_API_PAYLOAD  MODIFIER — when enabled, CLAUDE_API + AGENT_RESPONSE
//                       records include the full request payload
//                       (model/max_tokens/system/messages/tools). When
//                       disabled, only { model, lastMessage } is included.
//   CUSTOMER_INPUT      the "Customer input" log at handleMessage entry
//   AGENT_RESPONSE      the aggregate response log with customerToAgentResponseTime
//   INTERRUPT           barge-in event log
//   INTENT_CHANGE       IntentMap setAndLog transitions
//   CONVERSATION_LIFECYCLE  conversation-ended + full-transcript debug dump
//   HANDOFF_LIFECYCLE   end_call scheduling + handoff-initiated markers
//   FALLBACK            Claude retry warn + double-failure error + fallback handoff
//
// Note: error-level logs (auth failures, HTTP 5xx from backends, exceptions)
// are never gated behind a flag — you always see them.

const disabledFlags = new Set(
  (process.env.LOG_DISABLED_FLAGS ?? '')
    .split(',')
    .map((f) => f.trim().toUpperCase())
    .filter(Boolean),
);

export type LogFlag =
  | 'TOOLS_CALL'
  | 'TOOLS_RESULT'
  | 'CLAUDE_API'
  | 'CLAUDE_API_PAYLOAD'
  | 'CUSTOMER_INPUT'
  | 'AGENT_RESPONSE'
  | 'INTERRUPT'
  | 'INTENT_CHANGE'
  | 'CONVERSATION_LIFECYCLE'
  | 'HANDOFF_LIFECYCLE'
  | 'FALLBACK';

export function isLogEnabled(flag: LogFlag): boolean {
  return !disabledFlags.has(flag);
}
