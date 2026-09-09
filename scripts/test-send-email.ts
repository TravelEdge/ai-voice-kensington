// Smoke test for the send_lead_email tool.
// Loads .env, invokes executeSendLeadEmail with a fake NEW_LEAD payload,
// and prints the tool's return string. Run with:
//   npx tsx scripts/test-send-email.ts
import { config } from 'dotenv';
config();

import { executeSendLeadEmail } from '../src/tools/send-email.js';

const samplePayload = {
  firstName: 'Test',
  lastName: 'Lead',
  location: 'Kenya',
  travelDates: 'Mid-March 2027, 10 nights',
  numberOfTravelers: '4',
  numberOfAdults: '2',
  numberOfChildren: '2',
  numberOfRooms: '2',
  twinRoom: 'yes',
  phoneNumber: '+15551234567',
  email: 'test.lead@example.com',
  notes: 'Smoke test invocation from scripts/test-send-email.ts',
};

console.log('[test] Invoking executeSendLeadEmail with sample payload…');
const result = await executeSendLeadEmail(samplePayload);
console.log('[test] Tool result:', result);
