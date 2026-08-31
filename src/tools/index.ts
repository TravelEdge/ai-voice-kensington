import Anthropic from '@anthropic-ai/sdk';

import {
  TAC,
  type TACTool,
} from 'twilio-agent-connect';

import { 
  GET_LEAD_ASSIGNMENT_QUEUE, 
  executeGetLeadAssignmentQueue } from './lead-queue.js';

import {
  HANDOFF,
  executeHandoff
} from './handoff.js'

import {
  CREATE_NEW_CLIENT_REQUEST,
  executeCreateNewClientRequest
} from './tmt-legacy.js'


import {
  UPDATE_NEW_LEAD_TRAITS,
  executeUpdateNewLeadTraits,
} from './memory-client.js';

import {
  END_CALL,
  executeEndCall
} from './end-call.js'


export { extractCustomerProfileId, getProfileTraitsForPrompt } from './memory-client.js';

// Tool definitions for Claude so claude knows how to use them
export const TOOLS: Anthropic.Tool[] = [
  HANDOFF,
  GET_LEAD_ASSIGNMENT_QUEUE,
  CREATE_NEW_CLIENT_REQUEST,
  UPDATE_NEW_LEAD_TRAITS,
  END_CALL
];


export interface ToolExecutionContext {
  profileId?: string;
  memorySid?: string;
  callSid?: string;
}

/**
 * Execute a tool call and return the result
 */
export const executeTool = async (
  toolName: string,
  toolInput: Record<string, unknown>,
  tac: TAC,
  context?: ToolExecutionContext,
  session?: any,
  attributes?: any

): Promise<string>  => {
  switch (toolName) {

    case 'get_lead_assignment_queue': {
      return await executeGetLeadAssignmentQueue(toolInput);
    }

    case 'handoff': {
      return await executeHandoff(toolInput, tac, session)
    }

    case 'create_new_client_request': {
      return await executeCreateNewClientRequest(toolInput);
    }

    case 'update_new_lead_traits': {
      return await executeUpdateNewLeadTraits(toolInput, tac, session);
    }

    case 'end_call': {
      return await executeEndCall(toolInput, session);
    }

    default:
      return `Unknown tool: ${toolName}`;
  }
}

export const tacToolToAnthropicTool = (tacTool: TACTool<any, any>): Anthropic.Tool => {
  return {
    name: tacTool.name,
    description: tacTool.description,
    input_schema: tacTool.parameters as any,
  };
}


export const getAllTools = (tac: TAC, session: any, attributes?: any): Anthropic.Tool[] => {
  const tools = [...TOOLS];

  return tools;
}
