// LeadDepo — client for the LeadQueue API (Auth0 M2M bearer + reference data + queue lookup).
// See LeadQueue-API-Consumer-Guide_2.md at the repo root for endpoint contracts.

export interface ApiEnvelope<T> {
  result: T;
  isSuccess: boolean;
  errors: Array<{ code: string; message: string }>;
}

export interface Destination {
  id: number;
  name: string;
  description: string;
  quickFilterApplicableId: number;
}

export interface DestinationContinent {
  id: number;
  continent: string;
  countries: Destination[];
}

export interface Activity {
  id: number;
  name: string;
  description: string;
  quickFilterApplicableId: number;
  externalId: string | null;
}

export interface Channel {
  id: number;
  name: string;
  description: string;
  quickFilterApplicableId: number;
}

export interface LeadAssignmentAdvisor {
  assignmentOrder: number | null;
  advisorId: number;
  advisorName: string;
  priorityQueueId: string | null;
  roundRobinQueueId: string | null;
  lastReceivedLead: string | null;
  isEligible: boolean;
  currentLeadsCount: number;
  maximumCurrentLeadsCapacity: number;
  currentMonthlyLeadsCount: number;
  maximumMonthlyLeadsCapacity: number;
  shift: string | null;
  isAvailable: boolean;
  decisionLog: unknown | null;
  currentCondition: string;
}

export interface LeadAssignmentQueueResult {
  distributionId: number;
  distributionName: string;
  priorityQueueAdvisors: LeadAssignmentAdvisor[];
  roundRobinAdvisors: LeadAssignmentAdvisor[];
  selectedAdvisor: LeadAssignmentAdvisor | null;
  decisionLog: unknown | null;
}

export interface LeadAssignmentQueueParams {
  destinationId: number;
  activityId: number;
  channelId: number;
  categoryId?: number;
  showAdvisorLogs?: boolean;
}

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

// Refresh a minute before Auth0 says the token expires.
const TOKEN_REFRESH_MARGIN_MS = 60_000;

let tokenCache: TokenCache | null = null;
let destinationsCache: DestinationContinent[] | null = null;
let activitiesCache: Activity[] | null = null;
let channelsCache: Channel[] | null = null;

interface LeadDepoConfig {
  auth0Domain: string;
  clientId: string;
  clientSecret: string;
  audience: string;
  baseUrl: string;
}

function loadConfig(): LeadDepoConfig {
  const auth0Domain = process.env.LEADQUEUE_AUTH0_DOMAIN;
  const clientId = process.env.LEADQUEUE_CLIENT_ID;
  const clientSecret = process.env.LEADQUEUE_CLIENT_SECRET;
  const audience = process.env.LEADQUEUE_AUDIENCE;
  const baseUrl =
    process.env.LEADQUEUE_BASE_URL ?? 'https://leadqueue-api.dev.triparcdev.com';

  const missing: string[] = [];
  if (!auth0Domain) missing.push('LEADQUEUE_AUTH0_DOMAIN');
  if (!clientId) missing.push('LEADQUEUE_CLIENT_ID');
  if (!clientSecret) missing.push('LEADQUEUE_CLIENT_SECRET');
  if (!audience) missing.push('LEADQUEUE_AUDIENCE');
  if (missing.length) {
    throw new Error(`LeadDepo: missing required env vars: ${missing.join(', ')}`);
  }

  return {
    auth0Domain: auth0Domain!,
    clientId: clientId!,
    clientSecret: clientSecret!,
    audience: audience!,
    baseUrl,
  };
}

/** Fetch a fresh Auth0 M2M bearer token and store it in the module-level cache. */
export async function authenticate(): Promise<string> {
  const cfg = loadConfig();

  const response = await fetch(`https://${cfg.auth0Domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      audience: cfg.audience,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`LeadDepo authenticate failed (${response.status}): ${body}`);
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

async function unwrap<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`LeadDepo ${path} failed (${response.status}): ${body}`);
  }
  const envelope = (await response.json()) as ApiEnvelope<T>;
  //console.log("ENVELOPE" + JSON.stringify(envelope, null, 4));
  if (!envelope.result) {
    const errs = envelope.errors?.map(e => `${e.code}: ${e.message}`).join('; ');
    throw new Error(`LeadDepo ${path} returned errors: ${errs}`);
  }
  return envelope.result;
}

async function apiGet<T>(
  path: string,
  query?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const { baseUrl } = loadConfig();
  const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const send = async (token: string) =>
    fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });

  let response = await send(await getBearerToken());

  // Token could have been revoked or clock-skewed — force a refresh and retry once.
  if (response.status === 401) {
    tokenCache = null;
    response = await send(await getBearerToken());
  }


  console.log("QUERY" + query + "\n" + "RESPONSE" + JSON.stringify(response, null, 4));
  return unwrap<T>(response, path);
}

/** Get all destinations grouped by continent. Cached after first successful call. */
export async function getAllDestinations(
  onlyAssignedDestinations = false
): Promise<DestinationContinent[]> {
  if (destinationsCache) return destinationsCache;
  destinationsCache = await apiGet<DestinationContinent[]>('/Destinations', {
    onlyAssignedDestinations,
  });
  return destinationsCache;
}

/** Get all activities. Cached after first successful call. */
export async function getAllActivities(): Promise<Activity[]> {
  if (activitiesCache) return activitiesCache;
  activitiesCache = await apiGet<Activity[]>('/Activities');
  return activitiesCache;
}

/** Get all channels. Cached after first successful call. */
export async function getAllChannels(): Promise<Channel[]> {
  if (channelsCache) return channelsCache;
  channelsCache = await apiGet<Channel[]>('/Channels');
  return channelsCache;
}

/** Synchronous cache accessors — return the in-memory value or null if not yet loaded. */
export const getCachedDestinations = (): DestinationContinent[] | null => destinationsCache;
export const getCachedActivities = (): Activity[] | null => activitiesCache;
export const getCachedChannels = (): Channel[] | null => channelsCache;

/** Force a refresh of the reference-data caches on the next getAll* call. */
export function clearReferenceCache(): void {
  destinationsCache = null;
  activitiesCache = null;
  channelsCache = null;
}

/**
 * Fetch the ranked advisor queue for a destination / activity / channel combo.
 * Not cached — reflects live advisor availability.
 */
export async function getLeadAssignmentQueue(
  params: LeadAssignmentQueueParams
): Promise<LeadAssignmentQueueResult[]> {
  return apiGet<LeadAssignmentQueueResult[]>('/LeadAssignments/Queue', {
    DestinationId: params.destinationId,
    ActivityId: params.activityId,
    ChannelId: params.channelId,
    CategoryId: params.categoryId,
    ShowAdvisorLogs: params.showAdvisorLogs,
  });
}
