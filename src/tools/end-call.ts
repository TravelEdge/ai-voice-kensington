import Anthropic from '@anthropic-ai/sdk';
import type { ConversationSession, PendingHandoffData } from 'twilio-agent-connect';
import { sessionLog, isLogEnabled } from '../logger.js';
import { disableWatchdog } from '../watchdog.js';

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
    'HANG UP the current phone call. Invoke this ONLY when BOTH conditions are true: (1) the conversation is genuinely finished — every requested action is complete, the caller has confirmed they need nothing else, and there is no follow-up work to do; AND (2) you are speaking (or have just spoken in the immediately-preceding text block) a spoken FAREWELL to the caller such as "Thanks for calling Kensington Tours, have a great day!" or similar. Invoking end_call disconnects the line — anything you were going to do afterward CANNOT happen. Never invoke this tool as a substitute for another action (e.g. do NOT invoke it to "log" a callback — that is create_new_client_request\'s job). Never invoke it before a farewell has been spoken — the caller would hear a hard cut with no goodbye. Never invoke it while any other work is pending (e.g. while you still need to fire create_new_client_request or send_lead_email). The tool takes an optional "reason" string used only for server-side logs (never spoken to the caller).',
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

  // Kill any pending silence watchdog timer for this conversation AND leave
  // an IDLE sentinel so the trailing agentSpeaking:off event (from the
  // farewell TTS) doesn't re-arm the watchdog for a session that's about
  // to hang up. Final cleanup happens in clearConversationById via
  // purgeWatchdogState.
  disableWatchdog(String(session.conversationId));

  if (isLogEnabled('HANDOFF_LIFECYCLE')) {
    sessionLog(String(session.conversationId)).info(
      { reason: reason ?? null },
      'END_CALL_SCHEDULED',
    );
  }
  return 'end_call_initiated';
};
