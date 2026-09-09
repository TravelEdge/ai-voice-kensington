// tmt-profile — client for KT's Profile API (Triparc-stack microservice).
// See twilio-ai-concierge-tmt-api-brief.md at the repo root for endpoint contracts.
//
// Auth: OAuth2 client_credentials (machine-to-machine).
// Base URL (prod): https://tmx-profile-api.triparcservices.com
//
// Response shape: Profile API wraps results in a generic envelope with the
// actual record(s) under `response`. See ProfileEnvelope<T> below.

import { isStubMode } from '../stubs/index.js';
import { TMT_PROFILE_AUTH_STUB } from '../stubs/tmt-profile.js';

/** Generic Profile API response envelope. Records live under `response`. */
export interface ProfileEnvelope<T> {
  request?: unknown;
  parameters?: unknown;
  result?: unknown;
  response: T;
  profiling?: unknown;
  debug?: unknown;
}

/**
 * Optional related-entity expansion. Valid values are not enumerated in the
 * Swagger — confirm with KT during Week 1 (e.g. ["TourAgent", "QuoteAgent"]).
 */
export type ProfileIncludes = string[];

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

// Refresh a minute before the token's stated expiry, per brief.
const TOKEN_REFRESH_MARGIN_MS = 60_000;

// Client-side request timeout — Profile API hasn't been observed to struggle
// under burst load, but apply the same 15s hygiene as Legacy.
const REQUEST_TIMEOUT_MS = 15_000;

let tokenCache: TokenCache | null = null;

interface TmtProfileConfig {
  baseUrl: string;
  authUrl: string;
  clientId: string;
  clientSecret: string;
}

function loadConfig(): TmtProfileConfig {
  const baseUrl =
    process.env.TMT_PROFILE_BASE_URL ?? 'https://tmx-profile-api.triparcservices.com';
  const authUrl = process.env.TMT_PROFILE_AUTH_URL;
  const clientId = process.env.TMT_PROFILE_CLIENT_ID;
  const clientSecret = process.env.TMT_PROFILE_CLIENT_SECRET;

  const missing: string[] = [];
  if (!authUrl) missing.push('TMT_PROFILE_AUTH_URL');
  if (!clientId) missing.push('TMT_PROFILE_CLIENT_ID');
  if (!clientSecret) missing.push('TMT_PROFILE_CLIENT_SECRET');
  if (missing.length) {
    throw new Error(`tmt-profile: missing required env vars: ${missing.join(', ')}`);
  }

  return {
    baseUrl,
    authUrl: authUrl!,
    clientId: clientId!,
    clientSecret: clientSecret!,
  };
}

/** Fetch a fresh client_credentials bearer token and store it in the module-level cache. */
export async function authenticate(): Promise<string> {
  if (isStubMode()) {
    tokenCache = {
      accessToken: TMT_PROFILE_AUTH_STUB,
      expiresAt: Date.now() + 60 * 60 * 1000,
    };
    console.log('[tmt-profile] STUB: returning dummy bearer token');
    return TMT_PROFILE_AUTH_STUB;
  }
  const cfg = loadConfig();

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
  });

  const response = await fetch(cfg.authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`tmt-profile authenticate failed (${response.status}): ${text}`);
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

/**
 * GET a Profile API endpoint. Handles 401 by refreshing the token and retrying once.
 * Returns the parsed JSON body (envelope-wrapped if the endpoint wraps).
 */
export async function profileApiGet<T = unknown>(
  path: string,
  query?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = buildUrl(path, query);

  const send = async (token: string) =>
    sendWithTimeout(url, { method: 'GET', headers: { Authorization: `Bearer ${token}` } });

  let response = await send(await getBearerToken());
  if (response.status === 401) {
    clearTokenCache();
    response = await send(await getBearerToken());
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`tmt-profile GET ${path} failed (${response.status}): ${text}`);
  }
  return (await response.json()) as T;
}

/**
 * POST a Profile API endpoint. Handles 401 by refreshing the token and retrying once.
 */
export async function profileApiPost<T = unknown>(
  path: string,
  body: unknown,
  query?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const url = buildUrl(path, query);

  const send = async (token: string) =>
    sendWithTimeout(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body ?? {}),
    });

  let response = await send(await getBearerToken());
  if (response.status === 401) {
    clearTokenCache();
    response = await send(await getBearerToken());
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`tmt-profile POST ${path} failed (${response.status}): ${text}`);
  }
  return (await response.json()) as T;
}

// ---------------------------------------------------------------------------
// Endpoint wrappers
//
// Request body shapes are defined in external .NET assemblies
// (TE.TMT.APIContracts.*) and are not embedded in the Swagger. These wrappers
// pass bodies through as-is; typed field-level validation lands post-Week-1.
// ---------------------------------------------------------------------------

/**
 * Create a new customer profile. Prerequisite for net-new callers before a
 * client-request / case can be opened via the Legacy API (Capability 2).
 */
export async function createProfile<T = unknown>(
  profile: Record<string, unknown>
): Promise<ProfileEnvelope<T>> {
  return profileApiPost<ProfileEnvelope<T>>('/api/profiles', profile);
}

/**
 * Look up an employee by email. Used for agent/employee metadata during
 * routing decisions. Pass `includes` to opt in to related-entity expansion
 * (e.g. TourAgent, QuoteAgent) — valid values TBD with KT.
 */
export async function searchEmployeeByEmail<T = unknown>(
  email: string,
  includes?: ProfileIncludes
): Promise<ProfileEnvelope<T>> {
  const query: Record<string, string> = { email };
  if (includes && includes.length) query.includes = includes.join(',');
  return profileApiGet<ProfileEnvelope<T>>('/api/v1/employee/search', query);
}
