import Anthropic from '@anthropic-ai/sdk';
import {
  TAC,
  MemoryPromptBuilder,
  type TACMemoryResponse,
  type ConversationSession,
  type ConversationId,
} from 'twilio-agent-connect';
import { contextLog } from '../logger.js';

/**
 * Twilio Conversation Memory API Client
 * Direct API access for profile traits, observations, and recall
 */

interface ProfileTraits {
  [groupName: string]: {
    [fieldName: string]: unknown;
  };
}

interface Profile {
  id: string;
  serviceSid: string;
  traits: ProfileTraits;
  dateCreated: string;
  dateUpdated: string;
  url: string;
}

// Response shape for POST /v1/Stores/{storeId}/Profiles/Lookup — verified
// against the Twilio Memory API reference. `profiles` is an array of profile
// IDs (strings), NOT an array of full Profile objects.
interface ProfileLookupResponse {
  normalizedValue: string;
  profiles: string[];
}

const MEMORY_API_BASE = "https://memory.twilio.com/v1";


/**
 * Extract customer profile ID from TAC memory response
 * Profile ID is nested in communications[].author.profileId where author.type === "CUSTOMER"
 */
export const extractCustomerProfileId = (memory: TACMemoryResponse | undefined): string | undefined => {
  if (!memory) return undefined;

  const memoryData = (memory as any)?._data || memory;
  const communications = memoryData?.communications || [];

  // Find first communication where author is CUSTOMER and has profileId
  for (const comm of communications) {
    if (comm.author?.type === 'CUSTOMER' && comm.author?.profileId) {
      return comm.author.profileId;
    }
  }
  
  return undefined;
}

/**
 * Get profile by profile ID
 */
export async function getProfile(
  memorySid: string,
  profileId: string,
): Promise<Profile | null> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    contextLog().error(
      {
        backend: 'ConversationMemory',
        description: 'Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN — cannot fetch profile',
      },
      'MEMORY_ERROR',
    );
    return null;
  }

  try {
    const url = `${MEMORY_API_BASE}/Stores/${memorySid}/Profiles/${profileId}`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      contextLog().error(
        {
          backend: 'ConversationMemory',
          profileId,
          memorySid,
          status: response.status,
          statusText: response.statusText,
          description: 'Failed to fetch profile',
        },
        'MEMORY_ERROR',
      );
      return null;
    }

    return (await response.json()) as Profile;
  } catch (error) {
    contextLog().error(
      {
        backend: 'ConversationMemory',
        profileId,
        memorySid,
        err: error instanceof Error ? error.message : String(error),
        description: 'Error fetching profile',
      },
      'MEMORY_ERROR',
    );
    return null;
  }
}

/**
 * Look up profile by phone number, email, or other identifier configured in
 * the store's identity resolution settings. Hits
 * POST /v1/Stores/{storeId}/Profiles/Lookup with { idType, value }.
 * Returns the first matching profile ID (a string) or null when no match.
 * (This endpoint returns profile IDs, not full profile objects — if you need
 * the full profile, follow up with getProfile().)
 */
export async function lookupProfile(
  memorySid: string,
  idType: "phone" | "email",
  value: string,
): Promise<string | null> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    contextLog().error(
      {
        backend: 'ConversationMemory',
        description: 'Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN — cannot look up profile',
      },
      'MEMORY_ERROR',
    );
    return null;
  }

  try {
    // NOTE: the endpoint lives under /Stores/, NOT /Services/. Twilio's
    // Memory REST API uses the /Stores/{storeId}/... prefix for every profile-
    // related operation (get, patch, and this lookup). The previous
    // /Services/... path always 404'd, which is what silently broke the
    // trait-write fallback in this codebase.
    const url = `${MEMORY_API_BASE}/Stores/${memorySid}/Profiles/Lookup`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idType, value }),
    });

    if (!response.ok) {
      contextLog().error(
        {
          backend: 'ConversationMemory',
          idType,
          status: response.status,
          description: 'Profile lookup failed',
        },
        'MEMORY_ERROR',
      );
      return null;
    }

    const result = (await response.json()) as ProfileLookupResponse;
    return result.profiles[0] ?? null;
  } catch (error) {
    contextLog().error(
      {
        backend: 'ConversationMemory',
        idType,
        err: error instanceof Error ? error.message : String(error),
        description: 'Error looking up profile',
      },
      'MEMORY_ERROR',
    );
    return null;
  }
}

/**
 * Format traits for prompt injection
 */
export function formatTraitsForPrompt(traits: ProfileTraits): string {
  const lines: string[] = [];

  for (const [groupName, fields] of Object.entries(traits)) {
    lines.push(`${groupName}:`);
    for (const [fieldName, value] of Object.entries(fields)) {
      lines.push(
        `  ${fieldName}: ${typeof value === "string" ? value : JSON.stringify(value)}`,
      );
    }
  }

  return lines.join("\n");
}

/**
 * Get Profile Traits for prompt injection
 */
export async function getProfileTraitsForPrompt(profileId: string | undefined, memorySid: string | undefined): Promise<string | undefined> {

  if (profileId && memorySid) {
    const profile = await getProfile(memorySid, profileId);

    if (profile?.traits && Object.keys(profile.traits).length > 0) {
      return `\n\nCustomer Profile:\n${formatTraitsForPrompt(profile.traits)}`;
    }
  } else if (!memorySid) {
    contextLog().warn(
      {
        backend: 'ConversationMemory',
        description: 'TWILIO_MEMORY_STORE_ID not configured — trait lookup skipped',
      },
      'MEMORY_CONFIG',
    );
  }

  return;
}

/**
 * Update profile traits
 */
export async function updateProfileTraits(
  memorySid: string,
  profileId: string,
  traits: ProfileTraits,
): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    contextLog().error(
      {
        backend: 'ConversationMemory',
        description: 'Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN — cannot update traits',
      },
      'MEMORY_ERROR',
    );
    return false;
  }

  try {
    const url = `${MEMORY_API_BASE}/Stores/${memorySid}/Profiles/${profileId}`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ traits }),
    });

    // API returns 202 Accepted for async processing
    if (response.status !== 202 && !response.ok) {
      const errorBody = await response.text();
      contextLog().error(
        {
          backend: 'ConversationMemory',
          profileId,
          memorySid,
          status: response.status,
          statusText: response.statusText,
          body: errorBody,
          description: 'Failed to update traits',
        },
        'MEMORY_ERROR',
      );
      return false;
    }

    return true;
  } catch (error) {
    contextLog().error(
      {
        backend: 'ConversationMemory',
        profileId,
        memorySid,
        err: error instanceof Error ? error.message : String(error),
        description: 'Error updating traits',
      },
      'MEMORY_ERROR',
    );
    return false;
  }
}

/**
 * Anthropic tool declaration for `update_new_lead_traits`. Exposed to the
 * NEW_LEAD agent so the LLM can persist the caller's captured details to the
 * NewLead trait group on the caller's Conversation Memory profile immediately
 * before invoking handoff — that way the receiving agent (and any takeback
 * flow) has structured caller context.
 */
export const UPDATE_NEW_LEAD_TRAITS: Anthropic.Tool = {
  name: 'update_new_lead_traits',
  description:
    'Persist the caller information gathered during a NEW_LEAD call to the NewLead trait group on the caller profile in Twilio Conversation Memory. Call this immediately before invoking the handoff tool. Only pass fields you actually captured — omit unknowns.',
  input_schema: {
    type: 'object',
    properties: {
      firstName: { type: 'string', description: 'First Name of the caller.' },
      lastName: { type: 'string', description: 'Last name of the caller.' },
      location: {
        type: 'string',
        description: 'The location the caller is interested in traveling to.',
      },
      numberOfTravelers: {
        type: 'string',
        description: 'The number of travelers the caller is trying to plan a trip for.',
      },
      phoneNumber: { type: 'string', description: 'Phone number of the caller.' },
      travelDates: {
        type: 'string',
        description: 'The dates the caller is interested in traveling.',
      },
      isAgent: {
        type: 'boolean',
        description: 'Indicates whether the caller is a travel agent calling on behalf of the actual traveller'
      },
      isRepeat: {
        type: 'boolean',
        description: 'Indicates whether the caller is a repeat caller who has booked with Kensington Tours before'
      }
    },
  },
};

// Kept in sync with the NewLead trait group in Conversation Memory (see
// the trait table in the KT admin console).
const NEW_LEAD_TRAIT_FIELDS = [
  'isAgent',
  'isRepeat',
  'firstName',
  'lastName',
  'location',
  'numberOfTravelers',
  'phoneNumber',
  'travelDates',
] as const;

/**
 * Execute the update_new_lead_traits tool call. Filters the LLM-supplied input
 * to the known NewLead fields and PATCHes the profile via updateProfileTraits.
 *
 * The wider agent flow deliberately skips loading TAC memory for most intents
 * to avoid biasing the LLM with prior conversation summaries — so this tool
 * loads memory lazily on invocation (it always fires immediately before
 * handoff) and resolves both the caller's profile ID and the memory store ID
 * from TAC directly rather than accepting them via context.
 */
export const executeUpdateNewLeadTraits = async (
  toolInput: Record<string, unknown>,
  tac: TAC,
  session: ConversationSession,
): Promise<string> => {
  const memorySid = tac.getMemoryStoreId();
  if (!memorySid) {
    return 'Error: cannot update NewLead traits — TAC memory store is not configured.';
  }

  // ProfileId resolution has two paths, tried in order:
  //
  //   1. tac.retrieveMemory(session) → extractCustomerProfileId — reads
  //      communications[].author for a CUSTOMER entry with a profileId. This
  //      is fast but relies on Twilio Memory having ingested the current
  //      call's customer communications, which does NOT happen reliably
  //      during the NEW_LEAD leg (ingestion is async and the conversation
  //      is still ACTIVE). Silently returning "no profileId" here meant
  //      every NEW_LEAD trait update was a no-op, and downstream STACK_CALL
  //      read ancient prior-session values.
  //
  //   2. Fallback: lookupProfile(memorySid, 'phone', session.authorInfo.address).
  //      Directly POSTs to Memory's /Profiles/Lookup endpoint keyed by the
  //      caller's E.164 phone number. This works even when the current
  //      conversation's communications haven't been ingested — the profile
  //      itself exists (Memory creates one automatically on first contact).
  //
  // We try (1) first because when it succeeds it's a single API call we
  // already made; (2) is one extra POST.
  let profileId: string | undefined;
  try {
    const memory = await tac.retrieveMemory(session);
    profileId = extractCustomerProfileId(memory);
  } catch (err) {
    contextLog().warn(
      {
        backend: 'ConversationMemory',
        err: err instanceof Error ? err.message : String(err),
        description: 'retrieveMemory failed during trait-update profileId resolution — falling back to phone lookup',
      },
      'MEMORY_ERROR',
    );
  }

  if (!profileId) {
    const phone = session.authorInfo?.address;
    if (phone) {
      // lookupProfile now returns the profileId string directly (was Profile
      // before — the Memory Lookup endpoint only returns IDs, not full
      // profiles).
      const resolved = await lookupProfile(memorySid, 'phone', phone);
      if (resolved) {
        profileId = resolved;
        contextLog().info(
          { backend: 'ConversationMemory', phone, profileId, description: 'Resolved profileId via phone-lookup fallback' },
          'MEMORY_ERROR',
        );
      }
    }
  }

  if (!profileId) {
    contextLog().error(
      {
        backend: 'ConversationMemory',
        phone: session.authorInfo?.address,
        description: 'Could not resolve customer profileId via retrieveMemory OR phone lookup — trait update abandoned',
      },
      'MEMORY_ERROR',
    );
    return 'Error: cannot update NewLead traits — no customer profile ID resolved from the memory response.';
  }

  // Preserve the incoming primitive type. The Memory API validates each trait
  // against its declared schema type (isAgent/isRepeat are boolean; the rest
  // are string) — coercing booleans to "true"/"false" here yields a 400
  // "Validation failed ... Expected: boolean, given: string".
  const newLead: Record<string, string | boolean> = {};
  for (const key of NEW_LEAD_TRAIT_FIELDS) {
    const value = toolInput[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      newLead[key] = value.trim();
    } else if (typeof value === 'boolean') {
      newLead[key] = value;
    }
  }

  if (Object.keys(newLead).length === 0) {
    return 'Error: no NewLead trait values were provided.';
  }

  const ok = await updateProfileTraits(memorySid, profileId, { NewLead: newLead });
  return ok
    ? `new_lead_traits_updated: ${JSON.stringify(newLead)}`
    : 'Failed to update NewLead traits';
};
