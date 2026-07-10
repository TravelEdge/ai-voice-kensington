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

const tac = await TAC.create({ config: TACConfig.fromEnv() });

// Register channels
const voiceChannel = new VoiceChannel(tac, {
  memoryMode: "never",
  defaultTwimlOptions: {
    speechTimeout: 800,
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
