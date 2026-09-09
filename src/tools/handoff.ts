import Anthropic from '@anthropic-ai/sdk';
import {
  TAC,
  PendingHandoffData,
  ConversationSession,
  HandoffPayload
} from 'twilio-agent-connect';

export const HANDOFF: Anthropic.Tool = {
  name: 'handoff',
  description: 'Hand off the conversation to a human agent that has been identified by email address. Use this when we have collected sufficient information and are ready to transfer the call to a specific agent.',
  input_schema: {
    type: 'object',
    properties: {
      triage_target_friendly_name: {
        type: 'string',
        description: 'The email address of the agent that should be transfered to',
      },
      reason: {
        type: 'string',
        description: 'The reason for handing off to a human agent.',
      }
    },
    required: ['task_attributes', 'reason'],
  },
};

interface TransferParams {
  triage_target_friendly_name: string;
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
  const { triage_target_friendly_name, reason } = toolInput as unknown as TransferParams;

  if (!triage_target_friendly_name) {
    return 'Error: Cannot transfer call - require an triage_target_friendly_name target.';
  }
  if (!reason) {
    return 'Error: reason is required to transfer the call.';
  }

  try {
    const coClient = tac.getConversationClient();
    const memoryStoreId = tac.getMemoryStoreId();

    if (!coClient) throw new Error('Conversation Orchestrator is required to execute handoff');
    if (!memoryStoreId) throw new Error('Memory store ID is required to execute handoff');

    const payload = buildHandoffPayload(session, memoryStoreId, {triage_target_friendly_name, reason});
    
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
    } 

    return 'handoff_initiated';

  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err);
    return `Failed to handoff the call: ${errMessage}`;
  }
};
