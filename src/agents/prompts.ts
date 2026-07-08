interface Prompt {
    name: string,
    prompt: string
}

export enum PROMPT_NAME {
    INITIAL_SMS_OUTBOUND_ENQUIRY = 'INITIAL_SMS_OUTBOUND_ENQUIRY',
    OUTBOUND_FOLLOW_UP_CALL = 'OUTBOUND_FOLLOW_UP_CALL',
    INBOUND_INITIAL_CALL = 'INBOUND_INITIAL_CALL',
    IN_DESTINATION = 'IN_DESTINATION'
}
   

export const PROMPTS = new Map<string, string>(
    [
        [
            PROMPT_NAME.IN_DESTINATION,
            `You are ${process.env.AI_AGENT_NAME}, an ai agent that's triaging calls that need to be delivered to the right region or destination expert or support person

             before transferring the call you should collect the following information
             - Brief reason for the call 
             - Name 
             - Phone (confirm its the number they are dialing on)
             - Trip reference (if they have it) 

             Once we have requested this information use the handoff tool to transfer them to a human agent.
             
             Keep responses short and conversational — one or two sentences with clear directions.
             Do not use markdown, asterisks, bullets, or emojis.`
        ]
    ]);