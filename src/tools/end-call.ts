import Anthropic from '@anthropic-ai/sdk';
import type { ConversationSession, PendingHandoffData } from 'twilio-agent-connect';

/**
 * Anthropic tool declaration for `end_call`. Signals that the active
 * ConversationRelay session should be closed after the LLM's final response
 * has been spoken. TAC will send the WebSocket "end" message once the LLM's
 * text has finished streaming, ConversationRelay POSTs to the action URL
 * (/enqueue-or-end-call) with `HandoffData` embedded, and that route sees the
 * `endCall: true` flag and returns empty TwiML — which lets the call hang up
 * naturally after the goodbye is heard.
 */
export const END_CALL: Anthropic.Tool = {
  name: 'end_call',
  description:
    'Signal that the current phone call should end after your final spoken response. Use this only when the conversation is truly finished — e.g., after a callback has been recorded or the caller has confirmed no further help is needed. IMPORTANT: include your farewell in the same response as this tool call — the caller will hear your text before the line disconnects.',
  input_schema: {
    type: 'object',
    properties: {
      reason: {
        type: 'string',
        description:
          'Optional short reason for the hangup — logged server-side only, never spoken to the caller. Examples: "callback recorded", "caller said goodbye".',
      },
    },
  },
};

/**
 * Execute the end_call tool. Rather than terminating the call directly via
 * the Twilio REST API (which would cut off the LLM's farewell mid-word), this
 * mirrors handoff by staging a `PendingHandoffData` payload on the session.
 * TAC's voice channel sends the WS "end" message AFTER the assistant's final
 * response finishes streaming, ConversationRelay then POSTs to the action URL
 * with our JSON payload in `HandoffData`, and the /enqueue-or-end-call route
 * returns empty TwiML when it sees `endCall: true` so the call hangs up.
 */
export const executeEndCall = async (
  toolInput: Record<string, unknown>,
  session: ConversationSession,
): Promise<string> => {
  if (session.channel !== 'voice') {
    return 'Error: end_call is only supported on voice channels.';
  }

  const reason = typeof toolInput.reason === 'string' ? toolInput.reason : undefined;

  const payload = {
    endCall: true,
    reason: reason ?? null,
  };

  const pending: PendingHandoffData = {
    type: 'end',
    handoffData: JSON.stringify(payload),
  };
  session.pendingHandoffData = pending;

  console.log(`[END_CALL] scheduled end for conversation ${session.conversationId}${reason ? ` (${reason})` : ''}`);
  return 'end_call_initiated';
};
