import fastifyStatic from '@fastify/static';
import type { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import Twilio from 'twilio';
import { TAC, TACServer } from 'twilio-agent-connect';

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

/**
 * Payload emitted by the end_call tool via session.pendingHandoffData. Arrives
 * on the /enqueue-or-end-call route as a JSON string in the HandoffData field.
 */
interface EndCallData {
    endCall: true;
    reason?: string | null;
}


const enqueue_and_wait_routes = async (server: TACServer, tac: TAC) => {
    // Layer the custom routes onto the same Fastify instance TAC provides.
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    await server.fastify.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/',
    });

    server.fastify.post('/waitUrl', async (request: FastifyRequest, reply: FastifyReply) => {

        console.log("WAIT URL: hit wait url")
        const response = new Twilio.twiml.VoiceResponse();
        response.pause({ length: 15 });
        response.redirect({ method: 'POST' }, '/redirect-back-to-agent');
        reply.type('text/xml');
        await reply.send(response.toString());

    });

    server.fastify.post('/redirect-back-to-agent', async (request: FastifyRequest, reply: FastifyReply) => {

        const { CallSid } = request.body as TwilioPayload;
        console.log("END-CALL-AND-CREATE-LEAD: hit for CallSid " + CallSid);

        // Delete any conversation already grouped under this CallSid before we
        // reissue <ConversationRelay>. Orchestrator creates a fresh conversation
        // for the takeback session on the same CallSid, and TAC asserts exactly-1
        // via listConversations (which counts CLOSED convos too), so closing
        // isn't enough — the stale conversation must be removed. TAC's client
        // doesn't expose deleteConversation, so hit the CO REST API directly
        // through the pre-authenticated axios instance.
        const conversationClient = tac.getConversationClient();
        if (conversationClient) {
            const existing = await conversationClient.listConversations({ channelId: CallSid });
            const axiosInstance = (conversationClient as unknown as { axiosInstance: { request: (opts: unknown) => Promise<unknown> } }).axiosInstance;
            await Promise.all(
                existing.map(async c => {
                    try {
                        await axiosInstance.request({
                            url: `/v2/Conversations/${c.id}`,
                            method: 'DELETE',
                        });
                    } catch (err) {
                        console.warn(
                            `END-CALL-AND-CREATE-LEAD: failed to delete stale conversation ${c.id}: ${(err as Error).message}`
                        );
                    }
                })
            );
        }

        const domain = process.env.TWILIO_VOICE_PUBLIC_DOMAIN;
        const takebackTwiml = new Twilio.twiml.VoiceResponse();
        const connect = takebackTwiml.connect({
            action: `https://${domain}/enqueue-or-end-call`,
        });

        const relay = connect.conversationRelay({
            welcomeGreeting: "I apologize, it appears the agent i tried to transfer you to is not available, can i ask you a few more questions so i can pass along your infromation and have them call you back?",
            url: `wss://${domain}/ws`,
            conversationConfiguration: process.env.TWILIO_CONVERSATION_CONFIGURATION_ID,
            speechTimeout: 'auto',
        } as never);
        relay.parameter({ name: 'takeback', value: 'true' });

        const client = Twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        await client.calls(CallSid).update({ twiml: takebackTwiml.toString() });

        reply.type('text/xml');
        await reply.send(new Twilio.twiml.VoiceResponse().toString());

    });

    server.fastify.post('/enqueue-or-end-call', async (request: FastifyRequest, reply: FastifyReply) => {

        const { CallStatus, HandoffData:handoffdataString } = request.body as TwilioPayload

        // The takeback CR fires this action URL when it ends for any reason —
        // not only via TAC handoff. Bail cleanly when there's no HandoffData
        // (e.g., caller hung up).
        if (!handoffdataString) {
            console.log("ENQUEUE-OR-END-CALL: no HandoffData on request — nothing to enqueue");
            reply.type('text/xml');
            await reply.send(new Twilio.twiml.VoiceResponse().toString());
            return;
        }

        // The end_call tool sets pendingHandoffData with {endCall: true}. When
        // we see that flag, return empty TwiML — with no further verbs the
        // call ends naturally after ConversationRelay has finished speaking
        // the LLM's farewell.
        const parsed = JSON.parse(handoffdataString) as Partial<HandoffData & EndCallData>;
        if (parsed?.endCall === true) {
            console.log(`ENQUEUE-OR-END-CALL: end_call requested${parsed.reason ? ` (${parsed.reason})` : ''} — returning empty TwiML`);
            reply.type('text/xml');
            await reply.send(new Twilio.twiml.VoiceResponse().toString());
            return;
        }

        const HandoffData = parsed as HandoffData;
        const taskAttributes = {
            conversationId: HandoffData.conversationId,
            storeId: HandoffData.storeId,
            profileId: HandoffData.profileId,
            ...HandoffData.attributes }

            taskAttributes.triage_target_friendly_name = 'jhunter@twilio.com'

        if(CallStatus !== 'in-progress') {
            console.log("ENQUEUE-OR-END-CALL: " + "FAIL - CALL NOT IN PROGRESS");
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
        console.log("ENQUEUE-OR-END-CALL: " + "SUCCESS");

    });
}

export default enqueue_and_wait_routes;