import { config } from 'dotenv';
config();

import {
  TAC,
  TACConfig,
  VoiceChannel,
  SMSChannel,
  TACServer,
} from 'twilio-agent-connect';
import { handleMessage, clearConversation, registerPendingCallSid } from './agents/index.js';
import {
  authenticate as leadDepoAuthenticate,
  getAllDestinations,
  getAllActivities,
  getAllChannels,
} from './tools/LeadDepo.js';
import { authenticate as tmtLegacyAuthenticate } from './tools/tmt-legacy.js';
import { authenticate as tmtProfileAuthenticate } from './tools/tmt-profile.js';


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

console.log("ACTIVITIES: " + JSON.stringify(activities, null, 4));
console.log("CHANNELS: " + JSON.stringify(channels, null, 4));

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

//console.log(JSON.stringify(activities, null, 4));

const tac = await TAC.create({ config: TACConfig.fromEnv() });

// Register channels
const voiceChannel = new VoiceChannel(tac, {
  memoryMode: "never",
  defaultTwimlOptions: {
    speechTimeout: "auto",
    welcomeGreeting: "Welcome to Kensington Tours.  You have reached Live Answer - how can i help you today?"
  }

});
const smsChannel = new SMSChannel(tac, {memoryMode: "never"});


tac.registerChannel(voiceChannel);
tac.registerChannel(smsChannel);

// Capture the CallSid from the ConversationRelay setup so tools can
// update the in-progress call (e.g. transfer_to_workflow) later.
voiceChannel.on('setup', ({ callSid, from }) => {
  registerPendingCallSid(from, callSid);
});

// Single handler for all channels — TAC routes the response back correctly
tac.onMessageReady(async ({ conversationId, message, memory, session }) => {
   return handleMessage(tac, { conversationId, message, memory, session })
});

// Clean up in-memory history when a voice call ends
tac.onConversationEnded(({ session }) => {
  clearConversation(String(session.conversationId));
});

const server = new TACServer(tac, {port: 3000});
await server.start();
