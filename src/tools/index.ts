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


export { extractCustomerProfileId, getProfileTraitsForPrompt } from './memory-client.js';

// Tool definitions for Claude so claude knows how to use them
export const TOOLS: Anthropic.Tool[] = [
  HANDOFF,
  GET_LEAD_ASSIGNMENT_QUEUE
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
