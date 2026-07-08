import { config } from 'dotenv';
config();

import {
  TAC,
  TACConfig,
  VoiceChannel,
  SMSChannel,
  TACServer,
} from 'twilio-agent-connect';
import { handleMessage, clearConversation } from './agents/index.js';

const tac = await TAC.create({ config: TACConfig.fromEnv() });

// Register channels
const voiceChannel = new VoiceChannel(tac, {memoryMode: "always"});
const smsChannel = new SMSChannel(tac, {memoryMode: "always"});

tac.registerChannel(voiceChannel);
tac.registerChannel(smsChannel);

// Single handler for all channels — TAC routes the response back correctly
tac.onMessageReady(async ({ conversationId, message, memory, session }) => {
   return handleMessage(tac, { conversationId, message, memory, session })
});

// Clean up in-memory history when a voice call ends
tac.onConversationEnded(({ session }) => {
  clearConversation(String(session.conversationId));
});

const server = new TACServer(tac, {port: 3000, conversationRelayConfig: {
  welcomeGreeting: "Welcome to Kensington Tours.  You have reached Live Answer - how can i help you today?"
}});
await server.start();
