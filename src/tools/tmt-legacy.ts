// tmt-legacy — client for KT's Legacy API (Navigatr-stack monolith).
// See twilio-ai-concierge-tmt-api-brief.md at the repo root for endpoint contracts.
//
// Auth: OAuth2 password grant (resource owner credentials).
// Base URL: provided by KT during Week 1.
//
// Rate-limit hygiene per brief §"Rate limit guidance":
//   - Keep concurrency ≤5 on /api/profiles/advancedsearch and /api/cases/* (app-level concern)
//   - 15s client timeout (implemented here)
//   - Retry with exponential backoff on 5xx / network timeouts, max 3 attempts (implemented here)
//   - Do NOT retry 4xx (implemented — 401 is a one-shot refresh-and-retry, all others surface)

import Anthropic from '@anthropic-ai/sdk';
import { isStubMode } from '../stubs/index.js';
import {
  CREATE_NEW_CLIENT_REQUEST_STUB,
  TMT_LEGACY_AUTH_STUB,
} from '../stubs/tmt-legacy.js';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

// Refresh a minute before the token's stated expiry, per brief.
const TOKEN_REFRESH_MARGIN_MS = 60_000;

// Client-side request timeout — the API can be slow under load; 15s per brief.
const REQUEST_TIMEOUT_MS = 15_000;

// Retry policy for 5xx / network errors.
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

let tokenCache: TokenCache | null = null;

interface TmtLegacyConfig {
  baseUrl: string;
  authUrl: string;
  username: string;
  password: string;
}

function loadConfig(): TmtLegacyConfig {
  const baseUrl = process.env.TMT_LEGACY_BASE_URL;
  const authUrl = process.env.TMT_LEGACY_AUTH_URL;
  const username = process.env.TMT_LEGACY_USERNAME;
  const password = process.env.TMT_LEGACY_PASSWORD;

  const missing: string[] = [];
  if (!baseUrl) missing.push('TMT_LEGACY_BASE_URL');
  if (!authUrl) missing.push('TMT_LEGACY_AUTH_URL');
  if (!username) missing.push('TMT_LEGACY_USERNAME');
  if (!password) missing.push('TMT_LEGACY_PASSWORD');
  if (missing.length) {
    throw new Error(`tmt-legacy: missing required env vars: ${missing.join(', ')}`);
  }

  return {
    baseUrl: baseUrl!,
    authUrl: authUrl!,
    username: username!,
    password: password!,
  };
}

/** Fetch a fresh password-grant bearer token and store it in the module-level cache. */
export async function authenticate(): Promise<string> {
  if (isStubMode()) {
    tokenCache = {
      accessToken: TMT_LEGACY_AUTH_STUB,
      expiresAt: Date.now() + 60 * 60 * 1000,
    };
    console.log('[tmt-legacy] STUB: returning dummy bearer token');
    return TMT_LEGACY_AUTH_STUB;
  }
  const cfg = loadConfig();

  const body = new URLSearchParams({
    grant_type: 'password',
    username: cfg.username,
    password: cfg.password,
  });

  const response = await fetch(cfg.authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`tmt-legacy authenticate failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
  };

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return tokenCache.accessToken;
}

/** Return a valid bearer token; auto-fetches if missing or within the refresh margin of expiry. */
export async function getBearerToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt - TOKEN_REFRESH_MARGIN_MS > Date.now()) {
    return tokenCache.accessToken;
  }
  return authenticate();
}

/** Clear the cached token — forces the next call to re-authenticate. */
export function clearTokenCache(): void {
  tokenCache = null;
}

// ---------------------------------------------------------------------------
// Phone normalisation — per brief §"Phone normalisation (for Customer Lookup)"
//
// Twilio callers arrive in several shapes; the Legacy API's search endpoints
// expect the last-10-digits of the national number.
// ---------------------------------------------------------------------------

/**
 * Normalise a Twilio-supplied phone number (E.164, sip:, sips:, tel:) into the
 * last-10-digit national number expected by Legacy search endpoints.
 * Returns null if fewer than 10 digits could be extracted.
 */
export function normalisePhone(input: string): string | null {
  if (!input) return null;

  // Strip SIP/SIPS/tel scheme, then anything after `@` (the host portion).
  let s = input.trim().replace(/^(sips?:|tel:)/i, '');
  const at = s.indexOf('@');
  if (at !== -1) s = s.slice(0, at);

  const digits = s.replace(/\D+/g, '');
  if (digits.length < 10) return null;
  return digits.slice(-10);
}

// ---------------------------------------------------------------------------
// Core request plumbing
// ---------------------------------------------------------------------------

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>): URL {
  const { baseUrl } = loadConfig();
  const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  return url;
}

async function sendWithTimeout(input: URL | string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input.toString(), { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/**
 * Options controlling per-call behaviour.
 * - `treat404AsNull` — for lookups (e.g. profile-by-phone) the brief says 404
 *   is a valid empty result, not an error. Return null instead of throwing.
 */
interface RequestOptions {
  treat404AsNull?: boolean;
}

/**
 * Send a request with token auth, timeout, 401-refresh-and-retry-once, and
 * exponential backoff on 5xx / network timeouts (max 3 attempts).
 * Optionally returns null on 404 for lookup-style endpoints.
 */
async function requestJson<T>(
  method: 'GET' | 'POST' | 'PUT',
  path: string,
  {
    body,
    query,
    options,
  }: {
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
    options?: RequestOptions;
  } = {}
): Promise<T | null> {
  const url = buildUrl(path, query);
  const hasBody = body !== undefined;

  const send = async (token: string): Promise<Response> => {
    const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
    if (hasBody) headers['Content-Type'] = 'application/json';
    return sendWithTimeout(url, {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      let response = await send(await getBearerToken());

      // 401 → token might be revoked / clock-skewed. Refresh and retry once.
      if (response.status === 401) {
        clearTokenCache();
        response = await send(await getBearerToken());
      }

      if (options?.treat404AsNull && response.status === 404) {
        return null;
      }

      // 5xx → retriable per brief.
      if (response.status >= 500) {
        lastError = new Error(
          `tmt-legacy ${method} ${path} failed (${response.status})`
        );
        if (attempt < MAX_RETRY_ATTEMPTS) {
          await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
          continue;
        }
        const text = await response.text().catch(() => '');
        throw new Error(
          `tmt-legacy ${method} ${path} failed (${response.status}): ${text}`
        );
      }

      // 4xx (non-401) → surface immediately, per brief "do not retry 4xx".
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(
          `tmt-legacy ${method} ${path} failed (${response.status}): ${text}`
        );
      }

      // Empty body (e.g. 204) → return null.
      const text = await response.text();
      if (!text) return null as T | null;
      return JSON.parse(text) as T;
    } catch (err) {
      // Network / abort / parse errors — retriable within budget.
      lastError = err;
      const isAbort = (err as { name?: string })?.name === 'AbortError';
      const retriable = isAbort || err instanceof TypeError; // fetch network errors surface as TypeError
      if (retriable && attempt < MAX_RETRY_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
        continue;
      }
      throw err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`tmt-legacy ${method} ${path} failed after ${MAX_RETRY_ATTEMPTS} attempts`);
}

/** Generic GET — exposed for endpoints not yet wrapped below. */
export async function legacyApiGet<T = unknown>(
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
  options?: RequestOptions
): Promise<T | null> {
  return requestJson<T>('GET', path, { query, options });
}

/** Generic POST — exposed for endpoints not yet wrapped below. */
export async function legacyApiPost<T = unknown>(
  path: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T | null> {
  return requestJson<T>('POST', path, { body, options });
}

/** Generic PUT — exposed for endpoints not yet wrapped below. */
export async function legacyApiPut<T = unknown>(
  path: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T | null> {
  return requestJson<T>('PUT', path, { body, options });
}

// ---------------------------------------------------------------------------
// Capability 1 — Customer Lookup by Phone
//
// Request/response bodies live in TE.TMT.APIContracts.* — field validation
// lands during Week 1 sandbox testing.
// ---------------------------------------------------------------------------

/**
 * Primary customer lookup — returns ProfileDto + LatestCase in a single call.
 * Accepts phone, email, or name. Pass phone via normalisePhone() first — the
 * endpoint expects the last-10-digits of the national number.
 *
 * Returns null on 404 (treat as net-new caller, per brief).
 */
export async function advancedSearch<T = unknown>(
  criteria: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/profiles/advancedsearch', criteria, {
    treat404AsNull: true,
  });
}

/**
 * Alternative client-layer search. Use if case data isn't required or
 * advancedsearch returns too broad a result set.
 */
export async function searchNamePhoneEmail<T = unknown>(
  criteria: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/clients/searchnamephoneemail', criteria, {
    treat404AsNull: true,
  });
}

// ---------------------------------------------------------------------------
// Capability 2 — Lead Creation
// ---------------------------------------------------------------------------

/** Room-type dictionary entry referenced by traveler-room selections. */
export interface RoomType {
  Code?: string;
  RoomTypeID?: number;
  Name?: string;
  AdultCapacity?: number;
  MaxKidCapacity?: number;
  DisplayOrder?: number;
}

/** One physical room in the enquiry with its occupants and configuration. */
export interface TravelerRoom {
  IsTwin?: boolean;
  Adults?: number;
  /** Ages (in years) of the children in this room. */
  Children?: number[];
  RoomType?: RoomType;
}

export interface BudgetInformation {
  MaximumBudgetPerPerson?: string;
  AirlineTravelIncludedInBudget?: boolean;
  Priority?: string;
}

export interface TravelAgentInformation {
  IsAgent?: boolean;
  AssociationType?: string;
  AssociationId?: string;
}

export interface LeadClient {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
}

/** Structured lead payload embedded when CreateLead=true. */
export interface LeadRequestInformation {
  /** ISO-8601 date string. */
  DepartureDate?: string;
  Destination?: string;
  LocaleId?: number;
  ItineraryId?: number;
  Comments?: string;
  DateFlexible?: boolean;
  TripLength?: number;
  URL?: string;
  TrackingParameters?: string;
  CampaignUrl?: string;
  Notes?: string;
  Client?: LeadClient;
  TravelerRooms?: TravelerRoom[];
  BudgetInformation?: BudgetInformation;
  TravelAgentInformation?: TravelAgentInformation;
}

/**
 * Request body for POST /api/client/clientrequest/createnew.
 * Mirrors the TE.TMT.APIContracts NewClientRequest DTO.
 */
export interface CreateNewClientRequest {
  IsBaseItinerary?: boolean;
  /** ISO-8601 date string. */
  DepartureDate?: string;
  NumAdults?: number;
  NumChildren?: number;
  /** Ages (in years) of children on the enquiry. */
  ChildrenAges?: string[];
  NumHotelRooms?: number;
  ItineraryId?: number;
  MinimumNumTourDays?: number;
  MaximumNumTourDays?: number;
  Destination?: string;
  MaximumBudget?: string;
  Notes?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
  MobilePhone?: string;
  MobilePhoneCanSms?: boolean;
  PreferredContactMethod?: number;
  CampaignUrl?: string;
  LocaleId?: number;
  DateFlexible?: boolean;
  Triplength?: number;
  URL?: string;
  TrackingParameters?: string;
  CreateLead?: boolean;
  LeadRequestInformation?: LeadRequestInformation;
  LeadType?: number;
  DepartureAirport?: string;
  CabinClassPreference?: string;
  AirlineAlliancePreference?: string;
}

/**
 * Create a new inbound enquiry (client request) — standard entry point for
 * net-new callers after their profile has been created via the Profile API.
 */
export async function createNewClientRequest<T = unknown>(
  request: CreateNewClientRequest
): Promise<T | null> {
  if (isStubMode()) {
    console.log('[tmt-legacy] STUB: returning stubbed createNewClientRequest response');
    return CREATE_NEW_CLIENT_REQUEST_STUB as T | null;
  }
  return legacyApiPost<T>('/api/client/clientrequest/createnew', request);
}

/**
 * Anthropic tool declaration for `create_new_client_request`. Exposed to the
 * STACK_CALL agent so the LLM can record a callback request when live-agent
 * transfer failed. Mirrors the CreateNewClientRequest interface above — all
 * fields are optional; the LLM populates whatever it has captured.
 */
export const CREATE_NEW_CLIENT_REQUEST: Anthropic.Tool = {
  name: 'create_new_client_request',
  description:
    'Record a callback request in the KT Legacy system when a caller could not be transferred to a live agent. Populate every field for which information was captured during the call; leave unknown fields out.',
  input_schema: {
    type: 'object',
    properties: {
      FirstName: { type: 'string', description: "Caller's first name." },
      LastName: { type: 'string', description: "Caller's last name." },
      Email: { type: 'string', description: "Caller's email address." },
      Phone: { type: 'string', description: "Caller's primary phone number." },
      MobilePhone: { type: 'string', description: "Caller's mobile phone number." },
      MobilePhoneCanSms: {
        type: 'boolean',
        description: 'True if the mobile number can receive SMS.',
      },
      PreferredContactMethod: {
        type: 'number',
        description: 'Enum for preferred contact method (confirm ID mapping with KT).',
      },
      NumAdults: { type: 'number', description: 'Number of adult travellers.' },
      NumChildren: { type: 'number', description: 'Number of child travellers.' },
      ChildrenAges: {
        type: 'array',
        items: { type: 'string' },
        description: 'Ages (in years) of children on the enquiry.',
      },
      NumHotelRooms: { type: 'number', description: 'Number of hotel rooms required.' },
      Destination: { type: 'string', description: 'Country or region the caller wants to travel to.' },
      DepartureDate: { type: 'string', description: 'ISO-8601 date for planned departure.' },
      DateFlexible: { type: 'boolean', description: 'True if departure date is flexible.' },
      Triplength: { type: 'number', description: 'Trip length in days.' },
      MinimumNumTourDays: { type: 'number', description: 'Minimum tour length in days.' },
      MaximumNumTourDays: { type: 'number', description: 'Maximum tour length in days.' },
      MaximumBudget: { type: 'string', description: 'Overall maximum budget (currency string).' },
      DepartureAirport: { type: 'string', description: 'Preferred departure airport (code or name).' },
      CabinClassPreference: {
        type: 'string',
        description: 'Preferred cabin class (economy, business, first).',
      },
      AirlineAlliancePreference: {
        type: 'string',
        description: 'Preferred airline or alliance.',
      },
      Notes: { type: 'string', description: 'Free-text notes captured during the call.' },
      ItineraryId: { type: 'number', description: 'Existing itinerary ID if the caller referenced one.' },
      IsBaseItinerary: {
        type: 'boolean',
        description: 'True if the enquiry uses a base itinerary as its starting point.',
      },
      LocaleId: { type: 'number', description: 'Locale ID.' },
      CampaignUrl: { type: 'string', description: 'Marketing campaign URL if known.' },
      URL: { type: 'string', description: 'Referring URL if known.' },
      TrackingParameters: { type: 'string', description: 'Marketing tracking parameters if known.' },
      CreateLead: {
        type: 'boolean',
        description: 'When true, also populate LeadRequestInformation with a full structured lead payload.',
      },
      LeadType: { type: 'number', description: 'Lead type enum.' },
      LeadRequestInformation: {
        type: 'object',
        description: 'Structured lead payload — populated when CreateLead=true.',
        properties: {
          DepartureDate: { type: 'string', description: 'ISO-8601 date for departure.' },
          Destination: { type: 'string' },
          LocaleId: { type: 'number' },
          ItineraryId: { type: 'number' },
          Comments: { type: 'string' },
          DateFlexible: { type: 'boolean' },
          TripLength: { type: 'number' },
          URL: { type: 'string' },
          TrackingParameters: { type: 'string' },
          CampaignUrl: { type: 'string' },
          Notes: { type: 'string' },
          Client: {
            type: 'object',
            properties: {
              FirstName: { type: 'string' },
              LastName: { type: 'string' },
              Email: { type: 'string' },
              Phone: { type: 'string' },
            },
          },
          TravelerRooms: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                IsTwin: { type: 'boolean' },
                Adults: { type: 'number' },
                Children: {
                  type: 'array',
                  items: { type: 'number' },
                  description: 'Ages of children in this room.',
                },
                RoomType: {
                  type: 'object',
                  properties: {
                    Code: { type: 'string' },
                    RoomTypeID: { type: 'number' },
                    Name: { type: 'string' },
                    AdultCapacity: { type: 'number' },
                    MaxKidCapacity: { type: 'number' },
                    DisplayOrder: { type: 'number' },
                  },
                },
              },
            },
          },
          BudgetInformation: {
            type: 'object',
            properties: {
              MaximumBudgetPerPerson: { type: 'string' },
              AirlineTravelIncludedInBudget: { type: 'boolean' },
              Priority: { type: 'string' },
            },
          },
          TravelAgentInformation: {
            type: 'object',
            properties: {
              IsAgent: { type: 'boolean' },
              AssociationType: { type: 'string' },
              AssociationId: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

/**
 * Execute the create_new_client_request tool call. Wraps createNewClientRequest
 * with the shape the tool-dispatch layer expects (string return, error → error
 * string). The LLM receives the raw response so it can confirm success to the
 * caller and include any returned identifiers.
 */
export const executeCreateNewClientRequest = async (
  toolInput: Record<string, unknown>
): Promise<string> => {
  try {
    const result = await createNewClientRequest(toolInput as CreateNewClientRequest);
    return `client_request_created: ${JSON.stringify(result ?? {})}`;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return `Failed to create client request: ${message}`;
  }
};

/**
 * Create a case against a known profile — for existing customers with no
 * active case.
 */
export async function createCase<T = unknown>(
  caseBody: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/cases', caseBody);
}

// ---------------------------------------------------------------------------
// Capability 3 — Lead Stacking / Callback-Queue Write
// ---------------------------------------------------------------------------

/** Create a new entry in the DE lead queue — direct equivalent of lead stacking. */
export async function createQuoteAgentLeadQueue<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/quoteagentleadqueue/createquoteagentleadqueue', body);
}

/** Update an existing lead-queue entry — e.g. adjust priority or reassign. */
export async function updateQuoteAgentLeadQueue<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPut<T>('/api/quoteagentleadqueue/updatequoteagentleadqueue', body);
}

/** Link a case to a lead-queue assignment (create-only). */
export async function createCase2LeadAssignment<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/case2leadassignment', body);
}

/**
 * Upsert case↔lead-assignment link. Preferred for idempotent writes where
 * the assignment may already exist.
 */
export async function upsertCase2LeadAssignment<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/case2leadassignment/createorupdate', body);
}

/** Update a lead-assignment record — e.g. change the assigned DE. */
export async function updateLeadAssignment<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPut<T>('/api/leadassignment/updateleadassignment', body);
}

/** Append an entry to the assignment audit log. Recommended for every queue write. */
export async function createLeadAssignmentLog<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/leadassignmentlog/createleadassignmentlog', body);
}

// ---------------------------------------------------------------------------
// Capability 4 — DE Availability Query
//
// Prefer LeadQueue API `/LeadAssignments/Queue` for live routing decisions.
// These endpoints cover ad-hoc availability checks and named-DE eligibility.
// ---------------------------------------------------------------------------

/** Returns the next available DE per TMT routing rules. */
export async function nextAvailableQuoteAgent<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/quoteagents/nextavailable', body);
}

/** Boolean check for a specific DE — confirms active and within lead limits. */
export async function canReceiveLeads<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/quoteagents/canreceiveleads', body);
}

/** Checks whether a specific DE's current lead load is at or beyond their threshold. */
export async function beyondLeadLimit<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/quoteagents/beyondleadlimit', body);
}

/** Checks scheduled unavailability — out of office, non-working hours, leave. */
export async function scheduledOff<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/quoteagents/scheduledoff', body);
}

// ---------------------------------------------------------------------------
// Capability 5 — Disposition / Call-Note Write-Back
// ---------------------------------------------------------------------------

/**
 * Cached action-type taxonomy. The brief instructs: "Call once during Week 1
 * setup and cache." Populated on first getAllActionTypes() call.
 */
let actionTypesCache: unknown[] | null = null;

/**
 * Fetch the full action-type taxonomy. Cached in memory after first success —
 * writing with an incorrect actionTypeId places records in the wrong workflow
 * queue, so identify the AI Concierge disposition IDs during Week 1.
 */
export async function getAllActionTypes<T = unknown>(): Promise<T[]> {
  if (actionTypesCache) return actionTypesCache as T[];
  const result = await legacyApiGet<T[]>('/api/actiontypes/getall');
  actionTypesCache = (result ?? []) as unknown[];
  return actionTypesCache as T[];
}

/** Force a refresh of the action-types cache on next getAllActionTypes(). */
export function clearActionTypesCache(): void {
  actionTypesCache = null;
}

/** Create a typed action against a specific case. Requires an actionTypeId. */
export async function createActionOnCase<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/actions/cases', body);
}

/** Generic action creation — use if the action isn't case-specific yet. */
export async function createAction<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/actions', body);
}

/**
 * Unstructured note creation. Use only if the disposition type doesn't map to
 * any entry in the action taxonomy.
 */
export async function createNote<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/notes', body);
}

/** Append a record to the case audit trail. Supplements action creation. */
export async function createCaseHistory<T = unknown>(
  body: Record<string, unknown>
): Promise<T | null> {
  return legacyApiPost<T>('/api/casehistories', body);
}
