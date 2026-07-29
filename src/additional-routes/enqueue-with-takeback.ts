import fastifyStatic from '@fastify/static';
import type { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import Twilio from 'twilio';
import { TACServer } from 'twilio-agent-connect';

interface TwilioPayload {
    "Called": string
    "ToState": string
    "CallerCountry": string
    "Direction": string
    "SessionDuration": string
    "CallerState": string
    "ToZip": string
    "SessionStatus": string
    "CallSid": string
    "To": string
    "CallerZip": string
    "ToCountry": string
    "SessionId": string
    "CalledZip": string
    "ApiVersion": string
    "CalledCity": string
    "CallStatus": string
    "HandoffData": string
    "From": string
    "AccountSid": string
    "CalledCountry": string
    "CallerCity": string
    "ToCity": string
    "FromCountry": string
    "Caller": string
    "FromCity": string
    "CalledState": string
    "FromZip": string
    "FromState": string
}

interface HandoffData {
    conversationId: string,
    storeId: string,
    profileId: string,
    attributes: {
        triage_target_friendly_name: string
        reason: string,
    }
}


const enqueue_and_wait_routes = async (server: TACServer) => {
    // Layer the custom routes onto the same Fastify instance TAC provides.
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    await server.fastify.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/',
    });

    server.fastify.post('/waitUrl', async (request: FastifyRequest, reply: FastifyReply) => {

        console.log("WAIT URL: hit wait url")
        const response = new Twilio.twiml.VoiceResponse();
        response.redirect('https://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient')
        reply.type('text/xml');
        await reply.send(response.toString());

    });

    server.fastify.post('/enqueue-call', async (request: FastifyRequest, reply: FastifyReply) => {        

        const { CallStatus, HandoffData:handoffdataString } = request.body as TwilioPayload
        const HandoffData = JSON.parse(handoffdataString) as HandoffData
        const taskAttributes = { 
            conversationId: HandoffData.conversationId, 
            storeId: HandoffData.storeId, 
            profileId: HandoffData.profileId, 
            ...HandoffData.attributes }

            taskAttributes.triage_target_friendly_name = 'jhunter@twilio.com'
        
        if(CallStatus !== 'in-progress') {
            console.log("ENQUEUE-CALL: " + "FAIL - CALL NOT IN PROGRESS"); 
            return
        }

        const response = new Twilio.twiml.VoiceResponse();

        const enqueue = response.enqueue({ 
            workflowSid: `${process.env.HANDOFF_WORKFLOW_SID}`,
            waitUrl: '/waitUrl' 
        });
        enqueue.task(JSON.stringify(taskAttributes));

        reply.type('text/xml');
        await reply.send(response.toString());
        console.log("ENQUEUE-CALL: " + "SUCCESS");

    });
}

export default enqueue_and_wait_routes;