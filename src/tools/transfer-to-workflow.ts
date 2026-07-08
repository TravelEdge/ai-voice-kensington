import Anthropic from '@anthropic-ai/sdk';
import twilio from 'twilio';

export const TRANSFER_TO_WORKFLOW_TOOL: Anthropic.Tool = {
  name: 'transfer_to_workflow',
  description:
    'Transfer the current live voice call to a TaskRouter Workflow. This tool updates the in-progress call with new TwiML that first plays a short hold message (via <Say>) and then enqueues the call to the given TaskRouter Workflow with the supplied task attributes. Use this only when you are ready to hand the caller off to a human agent routed by TaskRouter.',
  input_schema: {
    type: 'object',
    properties: {
      workflow_sid: {
        type: 'string',
        description:
          'The TaskRouter Workflow SID (starts with WW...) that will route the resulting task. Use exactly the value provided in the system prompt.',
      },
      task_attributes: {
        type: 'object',
        description:
          'JSON object of TaskRouter task attributes to attach to the created task. Use exactly the object provided in the system prompt.',
        additionalProperties: true,
      },
      hold_message: {
        type: 'string',
        description:
          'Short one-sentence message to play to the caller before the enqueue happens. Defaults to a generic hold message if omitted.',
      },
    },
    required: ['workflow_sid', 'task_attributes'],
  },
};

interface TransferParams {
  workflow_sid: string;
  task_attributes: Record<string, unknown>;
  hold_message?: string;
}

const DEFAULT_HOLD_MESSAGE =
  'please hold while i transfer you to an agent that can handle that for you';

const buildTransferTwiml = (params: TransferParams): string => {
  const message = params.hold_message?.trim() || DEFAULT_HOLD_MESSAGE;

  const response = new twilio.twiml.VoiceResponse();
  response.say(message);
  const enqueue = response.enqueue({ workflowSid: params.workflow_sid });
  enqueue.task(JSON.stringify(params.task_attributes ?? {}));

  return response.toString();
};

export const executeTransferToWorkflow = async (
  toolInput: Record<string, unknown>,
  callSid: string | undefined
): Promise<string> => {
  const { workflow_sid, task_attributes, hold_message } = toolInput as unknown as TransferParams;

  if (!callSid) {
    return 'Error: Cannot transfer call - no active call SID found on this session.';
  }
  if (!workflow_sid) {
    return 'Error: workflow_sid is required to transfer the call.';
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !(authToken || (apiKey && apiSecret))) {
    return 'Error: Twilio credentials are not configured on the server.';
  }

  const client = apiKey && apiSecret
    ? twilio(apiKey, apiSecret, { accountSid })
    : twilio(accountSid, authToken as string);

  const twimlBody = buildTransferTwiml({
    workflow_sid,
    task_attributes: task_attributes ?? {},
    ...(hold_message ? { hold_message } : {}),
  });

  try {
    await client.calls(callSid).update({ twiml: twimlBody });
    console.log(`[TRANSFER] Updated call ${callSid} with enqueue TwiML for workflow ${workflow_sid}`);
    return `Successfully transferring the call to workflow ${workflow_sid}. The caller is now being held and routed to an agent.`;
  } catch (err) {
    console.error('[TRANSFER] Failed to update call with transfer TwiML:', err);
    const errMessage = err instanceof Error ? err.message : String(err);
    return `Failed to transfer the call: ${errMessage}`;
  }
};
