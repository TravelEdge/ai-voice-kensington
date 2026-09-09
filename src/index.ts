import { config } from 'dotenv';
config();

import {
  TAC,
  TACConfig,
  VoiceChannel,
  SMSChannel,
  TACServer,
} from 'twilio-agent-connect';
import {
  handleMessage,
  clearConversation,
  registerPendingCallSid,
  registerPendingCustomParams,
} from './agents/index.js';
import {
  authenticate as leadDepoAuthenticate,
  getAllDestinations,
  getAllActivities,
  getAllChannels,
} from './tools/lead-queue.js';
import { authenticate as tmtLegacyAuthenticate } from './tools/tmt-legacy.js';
import { authenticate as tmtProfileAuthenticate } from './tools/tmt-profile.js';
import enqueue_and_wait_routes from './additional-routes/enqueue-with-takeback.js'




// pre-auth and cache entity values for leadDepo
// caches desintations, activities and channels
await leadDepoAuthenticate();

const [destinations, activities, channels] = await Promise.all([
  getAllDestinations(),
  getAllActivities(),
  getAllChannels(),
]);
console.log(
  `[LeadDepo] Cached ${destinations.length} continents, ${activities.length} activities, ${channels.length} channels.`
);


// Pre-cache TMT bearer tokens. Non-fatal — TMT service-account credentials
// are provisioned during Week 1, so a missing/invalid config at boot should
// not block the rest of the server from starting.
await Promise.all([
  tmtLegacyAuthenticate().then(
    () => console.log('[tmt-legacy] Cached bearer token.'),
    (err: unknown) =>
      console.warn(
        `[tmt-legacy] Startup auth skipped: ${err instanceof Error ? err.message : String(err)}`
      )
  ),
  tmtProfileAuthenticate().then(
    () => console.log('[tmt-profile] Cached bearer token.'),
    (err: unknown) =>
      console.warn(
        `[tmt-profile] Startup auth skipped: ${err instanceof Error ? err.message : String(err)}`
      )
  ),
]);

const tac = await TAC.create({ config: TACConfig.fromEnv() });

// Register channels
const voiceChannel = new VoiceChannel(tac, {
  memoryMode: "never",
  defaultTwimlOptions: {
    speechTimeout: "auto",
    welcomeGreeting: "Welcome to Kensington Tours.  You have reached Live Answer - how can i help you today?",
    actionUrl: `https://${process.env.TWILIO_VOICE_PUBLIC_DOMAIN}/enqueue-or-end-call`,
    voice: 'lxYfHSkYm1EzQzGhdbfc'
  }

});
const smsChannel = new SMSChannel(tac, {memoryMode: "never"});


tac.registerChannel(voiceChannel);
tac.registerChannel(smsChannel);

// Capture the CallSid from the ConversationRelay setup so tools can
// update the in-progress call (e.g. transfer_to_workflow) later.
voiceChannel.on('setup', ({ callSid, from, customParameters }) => {
  registerPendingCallSid(from, callSid);
  registerPendingCustomParams(from, customParameters);
});

// Single handler for all channels — TAC routes the response back correctly
tac.onMessageReady(async ({ conversationId, message, session }) => {
   return handleMessage(tac, { conversationId, message, session })
});

// Clean up in-memory history when a voice call ends
tac.onConversationEnded(({ session }) => {
  clearConversation(session);
});

const server = new TACServer(tac, {port: 3000});

// register custom routes
await enqueue_and_wait_routes(server, tac);

await server.start();
