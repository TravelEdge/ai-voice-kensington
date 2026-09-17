import fastifyStatic from '@fastify/static';
import type { FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import Twilio from 'twilio';
import { TAC, TACServer } from 'twilio-agent-connect';

import { getProfileTraitsForPrompt } from '../tools/memory-client.js';

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
        workflow_sid: string,
        triage_target_friendly_name?: string,
        triage_target_friendly_name_secondary?: string,
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
        // profileId hitchhikes on the query string from /enqueue-or-end-call so
        // /redirect-back-to-agent can prefetch traits without needing to look up
        // the task. This is Twilio-agnostic — no reliance on TaskAttributes
        // being echoed back in the waitUrl POST body.
        const { profileId } = (request.query ?? {}) as { profileId?: string };
        const response = new Twilio.twiml.VoiceResponse();
        response.play("https://amber-pig-5530.twil.io/assets/DefaultMusic60s.wav");
        const redirectTarget = profileId
            ? `/redirect-back-to-agent?profileId=${encodeURIComponent(profileId)}`
            : '/redirect-back-to-agent';
        response.redirect({ method: 'POST' }, redirectTarget);
        reply.type('text/xml');
        await reply.send(response.toString());

    });

    server.fastify.post('/redirect-back-to-agent', async (request: FastifyRequest, reply: FastifyReply) => {

        const { CallSid } = request.body as TwilioPayload;
        const { profileId } = (request.query ?? {}) as { profileId?: string };
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

        // Prefetch the caller's NewLead traits so STACK_CALL's first turn can
        // skip the Memory API round-trip. Wrapped in try/catch — a failure here
        // is non-fatal: the existing STACK_CALL branch falls back to the API on
        // its own if the preloaded traits aren't in the cache.
        let preloadedTraits: string | undefined;
        if (profileId) {
            try {
                preloadedTraits = await getProfileTraitsForPrompt(
                    profileId,
                    process.env.TWILIO_MEMORY_STORE_ID
                );
            } catch (err) {
                console.warn(
                    `REDIRECT-BACK-TO-AGENT: trait preload failed for ${profileId}: ${(err as Error).message}`
                );
            }
        }

        const domain = process.env.TWILIO_VOICE_PUBLIC_DOMAIN;
        const takebackTwiml = new Twilio.twiml.VoiceResponse();
        const connect = takebackTwiml.connect({
            action: `https://${domain}/enqueue-or-end-call`,
        });

        const relay = connect.conversationRelay({
            welcomeGreeting: process.env.RETURN_TO_AGENT_TWIML_OPTIONS_WELCOME_GREETING,
            url: `wss://${domain}/ws`,
            actionUrl: `https://${process.env.TWILIO_VOICE_PUBLIC_DOMAIN}/enqueue-or-end-call`,
            conversationConfiguration: process.env.TWILIO_CONVERSATION_CONFIGURATION_ID,
            speechTimeout: process.env.RETURN_TO_AGENT_TWIML_OPTIONS_SPEECH_TIMEOUT,
            voice: process.env.RETURN_TO_AGENT_TWIML_OPTIONS_VOICE,
            interruptible: process.env.RETURN_TO_AGENT_TWIML_OPTIONS_INTERRUPTIBLE,
            interruptSensitivity: process.env.RETURN_TO_AGENT_TWIML_OPTIONS_INTERRUPT_SENSITIVITY,
            welcomeGreetingInterruptible: process.env.RETURN_TO_AGENT_TWIML_OPTIONS_WELCOME_GREETING_INTERRUPTIBLE,
        } as never);
        relay.parameter({ name: 'takeback', value: 'true' });
        if (preloadedTraits) {
            // Passed via CR <Parameter> (not stashed server-side) so the value
            // rides the WS setup to whichever instance owns the new session —
            // avoids the multi-instance affinity problem we'd have if we cached
            // it here on the /redirect-back-to-agent instance.
            relay.parameter({ name: 'traits', value: preloadedTraits });
        }

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

        // workflow_sid drives the enqueue destination but should NOT leak into
        // the TaskRouter task's own attributes — split it out here.
        const { workflow_sid, ...restAttributes } = HandoffData.attributes;
        const taskAttributes = {
            conversationId: HandoffData.conversationId,
            storeId: HandoffData.storeId,
            profileId: HandoffData.profileId,
            ...restAttributes,
        }

        //TODO REMOVE HARDCODED TARGET
        taskAttributes.triage_target_friendly_name = 'jhunter@twilio.com'
        taskAttributes.triage_target_friendly_name_secondary = 'jhunter'

        if(CallStatus !== 'in-progress') {
            console.log("ENQUEUE-OR-END-CALL: " + "FAIL - CALL NOT IN PROGRESS");
            return
        }

        const response = new Twilio.twiml.VoiceResponse();

        // Pin profileId onto the waitUrl so /waitUrl → /redirect-back-to-agent
        // can carry it forward and prefetch the caller's traits before the CR
        // session resumes. Empty profileId → skip the query param entirely.
        const waitUrl = HandoffData.profileId
            ? `/waitUrl?profileId=${encodeURIComponent(HandoffData.profileId)}`
            : '/waitUrl';
        const enqueue = response.enqueue({
            workflowSid: workflow_sid,
            waitUrl,
        });
        enqueue.task(JSON.stringify(taskAttributes));

        reply.type('text/xml');
        await reply.send(response.toString());
        console.log("ENQUEUE-OR-END-CALL: " + "SUCCESS");

    });
}

export default enqueue_and_wait_routes;