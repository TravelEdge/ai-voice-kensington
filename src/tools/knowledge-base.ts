
import {
  TAC,
  createKnowledgeSearchTool
} from 'twilio-agent-connect';
import { serverLog } from '../logger.js';


export const createKnowledgeToolFromConfig = (tac: TAC) => {

    if(!process.env.TWILIO_KNOWLEDGE_BASE_ID || !process.env.TWILIO_KNOWLEDGE_BASE_PROMPT) return;

    try {
        const knowledgeClient = (tac as any).knowledgeClient;

        if (knowledgeClient) {
            const knowledgeTool = createKnowledgeSearchTool(
                knowledgeClient,
                process.env.TWILIO_KNOWLEDGE_BASE_ID,
                {
                    name: 'search_knowledge_base',
                    description: process.env.TWILIO_KNOWLEDGE_BASE_PROMPT,
                    topK: 3,
                }
            );

            serverLog.info(
                {
                    knowledgeBaseId: process.env.TWILIO_KNOWLEDGE_BASE_ID,
                    description: 'Created knowledge base tool',
                },
                'KNOWLEDGE_BASE_INIT',
            );
            return knowledgeTool;
        }
        else {
            serverLog.warn(
                { description: 'Knowledge client not available on TAC — knowledge tool not created' },
                'KNOWLEDGE_BASE_INIT',
            );
        }
    } catch (error) {
        serverLog.error(
            {
                err: error instanceof Error ? error.message : String(error),
                description: 'Failed to create knowledge tool',
            },
            'KNOWLEDGE_BASE_INIT',
        );
    }
}
