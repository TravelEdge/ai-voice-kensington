import Anthropic from '@anthropic-ai/sdk';

import {
  createStudioHandoffTool,
  TAC,
  type TACTool,
} from 'twilio-agent-connect';

import { createKnowledgeToolFromConfig } from './knowledge-base.js'
import { getLeadAssignmentQueue } from './LeadDepo.js';
import {
  getProfile,
  formatTraitsForPrompt,
  updateProfileTraits,
} from './memory-client.js';
import {
  TRANSFER_TO_WORKFLOW_TOOL,
  executeTransferToWorkflow,
} from './transfer-to-workflow.js';


let tacKnowledgeTool: TACTool<any, any> | undefined;
let tacHandoffTool: TACTool<any, any> | undefined;

export { extractCustomerProfileId, getProfileTraitsForPrompt } from './memory-client.js';

// Tool definitions for Claude so claude knows how to use them
export const TOOLS: Anthropic.Tool[] = [
  {
    name: 'update_contact_info',
    description:
      'Update customer contact information (first name, last name, email) in their profile. Use when customer provides missing contact details.',
    input_schema: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          description: 'Customer first name',
        },
        last_name: {
          type: 'string',
          description: 'Customer last name',
        },
        email: {
          type: 'string',
          description: 'Customer email address',
        },
      },
      required: [],
    },
  },
  TRANSFER_TO_WORKFLOW_TOOL,
  {
    name: 'get_lead_assignment_queue',
    description:
      'Return the ranked advisor (Destination Expert) queue for a destination + activity + channel combination. Use this to identify who the caller should be routed to. Resolve the numeric IDs from the LEAD ASSIGNMENT REFERENCE CATALOG that appears in the system prompt — do NOT invent IDs, and do NOT pass names.',
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
  },
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
  context?: ToolExecutionContext
): Promise<string>  => {
  switch (toolName) {

    case 'update_contact_info': {
      if (!context?.profileId || !context?.memorySid) {
        return 'Error: Cannot update contact info - no profile found.';
      }

      const { first_name, last_name, email } = toolInput as {
        first_name?: string;
        last_name?: string;
        email?: string;
      };

      const traits: Record<string, any> = { Contact: {} };

      if (first_name) traits.Contact.firstName = first_name;
      if (last_name) traits.Contact.lastName = last_name;
      if (email) traits.Contact.email = email;

      const success = await updateProfileTraits(context.memorySid, context.profileId, traits);

      if (success) {
        const updated = [];
        if (first_name) updated.push('first name');
        if (last_name) updated.push('last name');
        if (email) updated.push('email');
        return `Successfully updated your ${updated.join(', ')}.`;
      }

      return 'Failed to update contact information. Please try again.';
    }

    case 'transfer_to_workflow': {
      return executeTransferToWorkflow(toolInput, context?.callSid);
    }

    case 'get_lead_assignment_queue': {
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
        });
        const response = JSON.stringify(results, null, 2);
        console.log("GET LEAD ASSIGNMENT RESULT: " + response);
        return response;
      } catch (err) {
        return `Error fetching lead assignment queue: ${err instanceof Error ? err.message : String(err)}`;
      }
    }

    default:
      if (tacKnowledgeTool && toolName === tacKnowledgeTool.name) {
        const result = await tacKnowledgeTool.implementation(toolInput as any);

        if (Array.isArray(result) && result.length > 0) {
          return result
            .map((chunk: any, idx: number) =>
              `[Document ${idx + 1}]\n${chunk.content}${chunk.score ? `\n(Relevance: ${Math.round(chunk.score * 100)}%)` : ''}`
            )
            .join('\n\n---\n\n');
        }
        return 'No relevant information found in knowledge base.';
      }

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

export const getAllTools = (tac: TAC, session: any): Anthropic.Tool[] => {
  const tools = [...TOOLS];
  tacKnowledgeTool = createKnowledgeToolFromConfig(tac)
  if (tacKnowledgeTool) {
    tools.push(tacToolToAnthropicTool(tacKnowledgeTool));
  }
  // tacHandoffTool = createStudioHandoffTool(tac, session, {
  //     attributes: {
  //       test: "true"
  //     }
  // })
  // if(tacHandoffTool) {
  //   console.log("ADDED HANDOFF TOOL");
  //   tools.push(tacToolToAnthropicTool(tacHandoffTool));
  // }

  return tools;
}
