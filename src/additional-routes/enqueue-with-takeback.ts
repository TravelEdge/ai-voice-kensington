import fastifyStatic from '@fastify/static';
import type { FastifyBaseLogger, FastifyRequest, FastifyReply } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import Twilio from 'twilio';
import { TAC, TACServer } from 'twilio-agent-connect';

import { getProfileTraitsForPrompt } from '../tools/memory-client.js';
import { clearConversationById } from '../agents/index.js';
import { lookupConversationIdByCallSid } from '../logger.js';

// Belt-and-braces cleanup for CR sessions that end without a proper handoff
// (customer hang-up or end_call tool). In Orchestrator mode TAC only fires
// its onConversationEnded callback when Conversation Orchestrator posts a
// CLOSED status back to TAC — which doesn't happen unless something CLOSES
// the CO conversation. We do both:
//   1. Fire-and-forget close the CO conversation via REST so TAC's internal
//      activeConversations map (and any CO-side downstream) sees the CLOSED
//      transition — this fires the normal onConversationEnded pathway.
//   2. Directly call clearConversationById so our in-memory state (histories,
//      intents, caches, session-context side maps) is evicted RIGHT NOW,
//      independent of whether the CO webhook lands.
// The direct call is safe to run alongside the webhook-driven cleanup because
// clearConversationById is idempotent.
async function finalizeConversation(
    tac: TAC,
    log: FastifyBaseLogger,
    route: string,
    callSid: string,
    reason: string,
): Promise<void> {
    const convId = lookupConversationIdByCallSid(callSid);
    if (!convId) {
        log.warn(
            {
                route,
                callSid,
                reason,
                description: 'CR session ended but no conversationId is registered for this CallSid — nothing to clean up',
            },
            'CUSTOM_ROUTE',
        );
        return;
    }

    const coClient = tac.getConversationClient();
    if (coClient) {
        try {
            await coClient.updateConversation(convId, 'CLOSED');
            log.info(
                {
                    route,
                    callSid,
                    conversationId: convId,
                    reason,
                    description: 'Marked CO conversation CLOSED — TAC onConversationEnded webhook path should now fire',
                },
                'CUSTOM_ROUTE',
            );
        } catch (err) {
            log.warn(
                {
                    route,
                    callSid,
                    conversationId: convId,
                    reason,
                    err: err instanceof Error ? err.message : String(err),
                    description: 'Failed to CLOSE CO conversation — proceeding with direct cleanup anyway',
                },
                'CUSTOM_ROUTE',
            );
        }
    }

    clearConversationById(convId, undefined);
}

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
        const log = request.log.child({ type: 'session' });

        // profileId hitchhikes on the query string from /enqueue-or-end-call so
        // /redirect-back-to-agent can prefetch traits without needing to look up
        // the task. This is Twilio-agnostic — no reliance on TaskAttributes
        // being echoed back in the waitUrl POST body.
        const { profileId } = (request.query ?? {}) as { profileId?: string };
        const callSid = (request.body as { CallSid?: string } | undefined)?.CallSid;
        log.info(
            {
                route: '/waitUrl',
                callSid,
                profileId: profileId ?? null,
                description: 'Hold-music wait URL hit — TaskRouter is holding the caller before takeback',
            },
            'CUSTOM_ROUTE',
        );
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
        const log = request.log.child({ type: 'session' });

        const { CallSid } = request.body as TwilioPayload;
        const { profileId } = (request.query ?? {}) as { profileId?: string };
        log.info(
            {
                route: '/redirect-back-to-agent',
                callSid: CallSid,
                profileId: profileId ?? null,
                description: 'Takeback flow triggered — reissuing ConversationRelay after TaskRouter failed to reserve an agent',
            },
            'CUSTOM_ROUTE',
        );

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
            if (existing.length > 0) {
                log.info(
                    {
                        callSid: CallSid,
                        staleConversationIds: existing.map((c) => c.id),
                        description: 'Deleting stale conversations for CallSid before reissuing ConversationRelay',
                    },
                    'CUSTOM_ROUTE',
                );
            }
            const axiosInstance = (conversationClient as unknown as { axiosInstance: { request: (opts: unknown) => Promise<unknown> } }).axiosInstance;
            await Promise.all(
                existing.map(async c => {
                    try {
                        await axiosInstance.request({
                            url: `/v2/Conversations/${c.id}`,
                            method: 'DELETE',
                        });
                    } catch (err) {
                        log.warn(
                            {
                                callSid: CallSid,
                                staleConversationId: c.id,
                                err: err instanceof Error ? err.message : String(err),
                                description: 'Failed to delete stale conversation before takeback — proceeding anyway; TAC may reject the new session',
                            },
                            'CUSTOM_ROUTE',
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
                log.info(
                    {
                        callSid: CallSid,
                        profileId,
                        traitsPreloaded: Boolean(preloadedTraits),
                        description: 'Prefetched caller traits for takeback session',
                    },
                    'CUSTOM_ROUTE',
                );
            } catch (err) {
                log.warn(
                    {
                        callSid: CallSid,
                        profileId,
                        err: err instanceof Error ? err.message : String(err),
                        description: 'Trait preload failed — takeback session will fall back to a live Memory API fetch on the first turn',
                    },
                    'CUSTOM_ROUTE',
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
            speechModel: process.env.RETURN_TO_AGENT_TWIML_OPTIONS_SPEECH_MODEL,
            eotThreshold: process.env.RETURN_TO_AGENT_TWIML_OPTIONS_EOT_THRESHOLD ? +process.env.RETURN_TO_AGENT_TWIML_OPTIONS_EOT_THRESHOLD : undefined
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

        log.info(
            {
                callSid: CallSid,
                profileId: profileId ?? null,
                description: 'Takeback ConversationRelay reissued via Calls.update — caller returning to AI agent',
            },
            'CUSTOM_ROUTE',
        );

        reply.type('text/xml');
        await reply.send(new Twilio.twiml.VoiceResponse().toString());

    });

    server.fastify.post('/enqueue-or-end-call', async (request: FastifyRequest, reply: FastifyReply) => {
        const log = request.log.child({ type: 'session' });

        const { CallSid, CallStatus, HandoffData:handoffdataString } = request.body as TwilioPayload

        // The takeback CR fires this action URL when it ends for any reason —
        // not only via TAC handoff. Bail cleanly when there's no HandoffData
        // (e.g., caller hung up).
        if (!handoffdataString) {
            log.info(
                {
                    route: '/enqueue-or-end-call',
                    callSid: CallSid,
                    callStatus: CallStatus,
                    description: 'ConversationRelay ended without HandoffData — caller likely hung up; no enqueue required',
                },
                'CUSTOM_ROUTE',
            );
            reply.type('text/xml');
            await reply.send(new Twilio.twiml.VoiceResponse().toString());
            await finalizeConversation(tac, log, '/enqueue-or-end-call', CallSid, 'caller-hangup');
            return;
        }

        // The end_call tool sets pendingHandoffData with {endCall: true}. When
        // we see that flag, return empty TwiML — with no further verbs the
        // call ends naturally after ConversationRelay has finished speaking
        // the LLM's farewell.
        const parsed = JSON.parse(handoffdataString) as Partial<HandoffData & EndCallData>;
        if (parsed?.endCall === true) {
            log.info(
                {
                    route: '/enqueue-or-end-call',
                    callSid: CallSid,
                    reason: parsed.reason ?? null,
                    description: 'end_call tool signaled — returning empty TwiML so call hangs up after farewell',
                },
                'CUSTOM_ROUTE',
            );
            reply.type('text/xml');
            await reply.send(new Twilio.twiml.VoiceResponse().toString());
            await finalizeConversation(tac, log, '/enqueue-or-end-call', CallSid, 'end-call-tool');
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

        if (CallStatus !== 'in-progress') {
            log.warn(
                {
                    route: '/enqueue-or-end-call',
                    callSid: CallSid,
                    callStatus: CallStatus,
                    workflowSid: workflow_sid,
                    description: 'Handoff requested but call is no longer in progress — skipping enqueue',
                },
                'CUSTOM_ROUTE',
            );
            return
        }

        const response = new Twilio.twiml.VoiceResponse();

        // Pin profileId onto the waitUrl so /waitUrl → /redirect-back-to-agent
        // can carry it forward and prefetch the caller's traits before the CR
        // session resumes. Empty profileId → skip the query param entirely.
        const waitUrl = HandoffData.profileId
            ? `/waitUrl?profileId=${encodeURIComponent(HandoffData.profileId)}`
            : '/waitUrl';
        // `action` fires when Enqueue ends for ANY reason — bridged (agent
        // picked up), hangup (caller left the queue), queue-full, error, etc.
        // Without this, a caller hanging up during hold music leaves the CO
        // conversation open until CO's own timeout kicks in. See
        // /enqueue-completed handler below for the cleanup logic.
        const enqueue = response.enqueue({
            workflowSid: workflow_sid,
            waitUrl,
            action: '/enqueue-completed',
        });
        enqueue.task(JSON.stringify(taskAttributes));

        reply.type('text/xml');
        await reply.send(response.toString());
        log.info(
            {
                route: '/enqueue-or-end-call',
                callSid: CallSid,
                workflowSid: workflow_sid,
                conversationId: HandoffData.conversationId,
                profileId: HandoffData.profileId,
                triageTarget: taskAttributes.triage_target_friendly_name,
                triageTargetSecondary: taskAttributes.triage_target_friendly_name_secondary,
                reason: HandoffData.attributes.reason,
                description: 'Handoff enqueued to TaskRouter workflow — caller will now sit on the waitUrl until an agent reserves',
            },
            'CUSTOM_ROUTE',
        );

    });

    // Fires when <Enqueue> terminates for any reason. Twilio passes QueueResult
    // to tell us why: "bridged" (agent picked up — Flex owns lifecycle from
    // here), "hangup" (caller left the queue), "queue-full", "error",
    // "redirected", "system-error", "timeout". For everything except "bridged"
    // we run the same finalizeConversation cleanup used by the caller-hangup
    // and end_call branches above, so a caller who hangs up during hold music
    // doesn't leave the CO conversation stranded until CO's own timeout.
    server.fastify.post('/enqueue-completed', async (request: FastifyRequest, reply: FastifyReply) => {
        const log = request.log.child({ type: 'session' });
        const body = request.body as {
            CallSid?: string;
            CallStatus?: string;
            QueueResult?: string;
            QueueSid?: string;
            TaskSid?: string;
            WorkflowSid?: string;
        };
        const { CallSid, CallStatus, QueueResult, QueueSid, TaskSid } = body;

        log.info(
            {
                route: '/enqueue-completed',
                callSid: CallSid,
                callStatus: CallStatus,
                queueResult: QueueResult,
                queueSid: QueueSid,
                taskSid: TaskSid,
                description: 'Enqueue ended',
            },
            'CUSTOM_ROUTE',
        );

        // Bridged → the caller and an agent are now on a live bridge. The
        // downstream Flex flow owns the conversation from here (it'll flip CO
        // back to ACTIVE on pickup and CLOSED on hangup). Do nothing.
        if (QueueResult === 'bridged') {
            reply.type('text/xml');
            await reply.send(new Twilio.twiml.VoiceResponse().toString());
            return;
        }

        // Any other QueueResult means the enqueue ended without a live agent
        // picking up — hangup, timeout, queue-full, error. Clean up.
        if (CallSid) {
            await finalizeConversation(tac, log, '/enqueue-completed', CallSid, `enqueue-${QueueResult ?? 'unknown'}`);
        }

        // Return empty TwiML so the call terminates cleanly.
        reply.type('text/xml');
        await reply.send(new Twilio.twiml.VoiceResponse().toString());
    });
}

export default enqueue_and_wait_routes;