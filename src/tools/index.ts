import Anthropic from '@anthropic-ai/sdk';

import {
  createStudioHandoffTool,
  TAC,
  type TACTool,
} from 'twilio-agent-connect';

import { createKnowledgeToolFromConfig } from './knowledge-base.js'
import {
  getProfile,
  formatTraitsForPrompt,
  updateProfileTraits,
} from './memory-client.js';


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
  }
];


/**
 * Execute a tool call and return the result
 */
export const executeTool = async (
  toolName: string,
  toolInput: Record<string, unknown>,
  context?: { profileId?: string; memorySid?: string }
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
  tacHandoffTool = createStudioHandoffTool(tac, session, {
      attributes: {
        test: "true"
      }
  })
  if(tacHandoffTool) {
    console.log("ADDED HANDOFF TOOL");
    tools.push(tacToolToAnthropicTool(tacHandoffTool));
  }

  return tools;
}