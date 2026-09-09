import Anthropic from '@anthropic-ai/sdk';
import { isStubMode } from '../stubs/index.js';
import {
  ACTIVITIES_STUB,
  CHANNELS_STUB,
  DESTINATIONS_STUB,
  LEAD_ASSIGNMENT_QUEUE_STUB,
  LEAD_QUEUE_AUTH_STUB,
} from '../stubs/lead-queue.js';

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
  description?: string;
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
  description?: string;
  quickFilterApplicableId: number;
  externalId: string | null;
}

export interface Channel {
  id: number;
  name: string;
  description?: string;
  quickFilterApplicableId: number;
}

export interface LeadAssignmentAdvisor {
  id?: number,
  firstName?: string,
  lastName?: string,
  email?: string,
  externalId?: string,
  originId?: number,
  timeZoneId?: number,
  teamId?: number,
  userType?: string,
  reportsToId?: number,
  receiveLeads?: boolean,
  maxCapacity?: number,
  maxMonthlyCapacity?: number,
  startDate?: string,
  dateCreated?: string,
  dateModified?: string,
  assignmentOrder?: number | null;
  advisorId?: number;
  advisorName?: string;
  priorityQueueId?: string | null;
  roundRobinQueueId?: string | null;
  lastReceivedLead?: string | null;
  isEligible?: boolean;
  currentLeadsCount?: number;
  maximumCurrentLeadsCapacity?: number;
  currentMonthlyLeadsCount?: number;
  maximumMonthlyLeadsCapacity?: number;
  shift?: string | null;
  isAvailable?: boolean;
  decisionLog?: unknown | null;
  currentCondition?: string;
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
  if (isStubMode()) {
    tokenCache = {
      accessToken: LEAD_QUEUE_AUTH_STUB,
      expiresAt: Date.now() + 60 * 60 * 1000,
    };
    console.log('[LeadDepo] STUB: returning dummy bearer token');
    return LEAD_QUEUE_AUTH_STUB;
  }
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

  return unwrap<T>(response, path);
}

/** Get all destinations grouped by continent. Cached after first successful call. */
export async function getAllDestinations(
  onlyAssignedDestinations = false
): Promise<DestinationContinent[]> {
  if (destinationsCache) return destinationsCache;
  if (isStubMode()) {
    console.log('[LeadDepo] STUB: returning stubbed destinations');
    destinationsCache = DESTINATIONS_STUB;
    return destinationsCache;
  }
  destinationsCache = await apiGet<DestinationContinent[]>('/Destinations', {
    onlyAssignedDestinations,
  });
  return destinationsCache;
}

/** Get all activities. Cached after first successful call. */
export async function getAllActivities(): Promise<Activity[]> {
  if (activitiesCache) return activitiesCache;
  if (isStubMode()) {
    console.log('[LeadDepo] STUB: returning stubbed activities');
    activitiesCache = ACTIVITIES_STUB;
    return activitiesCache;
  }
  activitiesCache = await apiGet<Activity[]>('/Activities');
  return activitiesCache;
}

/** Get all channels. Cached after first successful call. */
export async function getAllChannels(): Promise<Channel[]> {
  if (channelsCache) return channelsCache;
  if (isStubMode()) {
    console.log('[LeadDepo] STUB: returning stubbed channels');
    channelsCache = CHANNELS_STUB;
    return channelsCache;
  }
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
async function getLeadAssignmentQueue(
  params: LeadAssignmentQueueParams
): Promise<LeadAssignmentQueueResult[]> {
  if (isStubMode()) {
    console.log('[LeadDepo] STUB: returning stubbed lead assignment queue');
    return LEAD_ASSIGNMENT_QUEUE_STUB;
  }
  return apiGet<LeadAssignmentQueueResult[]>('/LeadAssignments/Queue', {
    DestinationId: params.destinationId,
    ActivityId: params.activityId,
    ChannelId: params.channelId,
    CategoryId: params.categoryId,
    ShowAdvisorLogs: params.showAdvisorLogs,
  });
}

export const GET_LEAD_ASSIGNMENT_QUEUE: Anthropic.Tool = {
    name: 'get_lead_assignment_queue',
    description:
      `Return the ranked advisor (Destination Expert) queue for a destination + activity + channel combination. Use this to identify who the caller should be routed to. 
       Resolve the numeric IDs from the LEAD ASSIGNMENT REFERENCE CATALOG that appears in the system prompt — do NOT invent IDs, and do NOT pass names.
       If this service times out, call it again with the same parameters`,
    input_schema: {
      type: 'object',
      properties: {
        destination_id: {
          type: 'number',
          description:
            'Numeric ID of the destination country from the destinations section of the reference catalog.',
        },
        activity_id: {
          type: 'number',
          description:
            'Numeric ID of the trip activity from the activities section of the reference catalog.',
        },
        channel_id: {
          type: 'number',
          description:
            'Numeric ID of the channel from the channels section of the reference catalog.',
        },
        category_id: {
          type: 'number',
          description: 'Optional category filter ID.',
        },
        show_advisor_logs: {
          type: 'boolean',
          description:
            'Optional. Include per-advisor decision logs in the response. Default false.',
        },
      },
      required: ['destination_id', 'activity_id', 'channel_id'],
    },
  }

  export async function executeGetLeadAssignmentQueue(toolInput: Record<string, unknown>): Promise<string> {
    const {
        destination_id,
        activity_id,
        channel_id,
        category_id,
        show_advisor_logs,
      } = toolInput as {
        destination_id?: number;
        activity_id?: number;
        channel_id?: number;
        category_id?: number;
        show_advisor_logs?: boolean;
      };

      if (
        typeof destination_id !== 'number' ||
        typeof activity_id !== 'number' ||
        typeof channel_id !== 'number'
      ) {
        return 'Error: destination_id, activity_id, and channel_id are all required numeric IDs from the reference catalog.';
      }

      try {
        const results = await getLeadAssignmentQueue({
          destinationId: destination_id,
          activityId: activity_id,
          channelId: channel_id,
          categoryId: category_id,
          showAdvisorLogs: show_advisor_logs,
        }) as unknown as Array<LeadAssignmentQueueResult>

        const response = JSON.stringify(results, null, 2);
        
        if(results?.[0]?.selectedAdvisor) console.log("GET LEAD ASSIGNMENT RESULT: " + JSON.stringify(results?.[0].selectedAdvisor));
        else console.log("GET LEAD ASSIGNMENT RESULT: " + "No selected advisor");
        
        return response;
      } catch (err) {
        return `Error fetching lead assignment queue: ${err instanceof Error ? err.message : String(err)}`;
      }
  }
