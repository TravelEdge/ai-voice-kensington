import 'dotenv/config';

import Anthropic from '@anthropic-ai/sdk';
import {
  TAC,
  PendingHandoffData,
  ConversationSession,
  HandoffPayload
} from 'twilio-agent-connect';

import { purgeWatchdogState } from '../watchdog.js';

export const HANDOFF: Anthropic.Tool = {
  name: 'handoff',
  description: 'Hand off the conversation to a human agent by enqueuing the call into a specific TaskRouter workflow. Use this when we have collected sufficient information and are ready to transfer the call.',
  input_schema: {
    type: 'object',
    properties: {
      workflow_sid: {
        type: 'string',
        description: 'The TaskRouter workflow SID (must start with "WW" and be 34 characters long) that should receive the enqueued task.',
      },
      triage_target_friendly_name: {
        type: 'string',
        description: 'The email address of a specific agent to route to. Required only when workflow_sid targets the NEW_LEAD handoff workflow; omit otherwise.',
      },
      triage_target_friendly_name_secondary: {
        type: 'string',
        description: 'Optional fallback agent email address. When provided, TaskRouter can route to this agent if the primary triage_target_friendly_name is unavailable. Never required.',
      },
      reason: {
        type: 'string',
        description: 'The reason for handing off to a human agent.',
      }
    },
    required: ['workflow_sid', 'reason'],
  },
};

interface TransferParams {
  workflow_sid: string;
  triage_target_friendly_name?: string;
  triage_target_friendly_name_secondary?: string;
  reason: string;
}

function buildHandoffPayload(
  session: ConversationSession,
  memoryStoreId: string,
  attributes: Record<string, unknown>
): HandoffPayload {
  return {
    conversationId: session.conversationId,
    storeId: memoryStoreId,
    profileId: session.profileId ?? '',
    attributes,
  };
}

export const executeHandoff = async (
  toolInput: Record<string, unknown>,
  tac: TAC,
  session: any
): Promise<string> => {
  const {
    workflow_sid,
    triage_target_friendly_name,
    triage_target_friendly_name_secondary,
    reason,
  } = toolInput as unknown as TransferParams;

  if (!workflow_sid) {
    return 'Error: workflow_sid is required to hand off the call.';
  }
  if (!workflow_sid.startsWith('WW') || workflow_sid.length !== 34) {
    return `Error: workflow_sid must start with "WW" and be 34 characters long. Provided ${workflow_sid}`;
  }
  if (!reason) {
    return 'Error: reason is required to hand off the call.';
  }

  // triage_target_friendly_name is only required when handing off to the
  // NEW_LEAD workflow, which routes to a specific advisor by email. Other
  // handoff workflows route via TaskRouter rules and don't need a target.
  const newLeadWorkflowSid = process.env.HANDOFF_NEW_LEAD_WORKFLOW_SID;
  if (workflow_sid === newLeadWorkflowSid && !triage_target_friendly_name) {
    return 'Error: triage_target_friendly_name is required when handing off to the NEW_LEAD workflow.';
  }

  try {
    const coClient = tac.getConversationClient();
    const memoryStoreId = tac.getMemoryStoreId();

    if (!coClient) throw new Error('Conversation Orchestrator is required to execute handoff');
    if (!memoryStoreId) throw new Error('Memory store ID is required to execute handoff');

    const attributes: Record<string, unknown> = { workflow_sid, reason };
    if (triage_target_friendly_name) attributes.triage_target_friendly_name = triage_target_friendly_name;
    if (triage_target_friendly_name_secondary) attributes.triage_target_friendly_name_secondary = triage_target_friendly_name_secondary;

    const payload = buildHandoffPayload(session, memoryStoreId, attributes);

    // 1. Set conversation to INACTIVE to trigger the CO-generated
    // conversation summary that Flex fetches on pickup. Downstream
    // (Studio/Flex) flips it back to ACTIVE on pickup and CLOSED on hangup —
    // we don't close it ourselves.
    try {
        await coClient.updateConversation(session.conversationId, 'INACTIVE');
      } catch (err) {
        tac.logger.warn(
          { err, conversation_id: session.conversationId },
          'Failed to set conversation INACTIVE during handoff'
        );
      }

    // 2. Clear statusCallbacks so TAC stops receiving webhook events for
    // this conversation (Flex/human agent will handle it from here).
    try {
      await coClient.clearStatusCallbacks(session.conversationId);
    } catch (err) {
      tac.logger.warn(
        { err, conversation_id: session.conversationId },
        'Failed to clear status callbacks during handoff'
      );
    }

    // 3. Deliver handoff payload.
    if (session.channel === 'voice') {
      // Voice: store on session for deferred delivery. The voice channel
      // sends the WS "end" message after the LLM's final response so the
      // caller hears a goodbye before transfer. handoffData is a JSON
      // *string* — ConversationRelay forwards it verbatim in the POST body
      // to the action URL.
      const pending: PendingHandoffData = {
        type: 'end',
        handoffData: JSON.stringify(payload),
      };
      session.pendingHandoffData = pending;

      // The moment we commit to transferring, cancel any pending silence
      // watchdog timer for this conversation. Otherwise the timer keeps
      // counting after CR tears down the WebSocket, then fires an injection
      // into a dead session ("No active WebSocket connection...").
      purgeWatchdogState(String(session.conversationId));
    }

    return 'handoff_initiated';

  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err);
    return `Failed to handoff the call: ${errMessage}`;
  }
};
