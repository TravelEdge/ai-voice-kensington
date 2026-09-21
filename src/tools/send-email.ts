import Anthropic from '@anthropic-ai/sdk';
import { contextLog } from '../logger.js';

/**
 * send_lead_email — provider-agnostic entry point.
 *
 * The tool interface exposed to the LLM is identical regardless of provider —
 * only the transport differs. Which provider is used is chosen by the
 * EMAIL_PROVIDER env var:
 *   - "sendgrid" (default) — POST https://api.sendgrid.com/v3/mail/send
 *     Uses SENDGRID_API_KEY / SENDGRID_FROM_EMAIL / SENDGRID_FROM_NAME /
 *     SENDGRID_TO_EMAIL.
 *   - "twilio"              — POST https://comms.twilio.com/v1/Emails
 *     Reuses the existing TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN for Basic
 *     auth, and uses TWILIO_EMAIL_FROM_ADDRESS / TWILIO_EMAIL_FROM_NAME /
 *     TWILIO_EMAIL_TO_ADDRESS for the envelope.
 *
 * SendGrid requires the `from` address to match a verified sender identity;
 * Twilio's comms.twilio.com/Emails endpoint requires a Basic-auth Account SID
 * and Auth Token and a sender configured on that account. In both cases both
 * sides of the envelope are resolved from env so the LLM never handles
 * addressing — only subject and lead fields.
 *
 * The email body is rendered as a two-column matrix (Field / Value) from
 * whichever lead fields the LLM populates. SendGrid sends both HTML and a
 * plain-text fallback; the Twilio Emails endpoint accepts an html body only.
 */

const DEFAULT_SUBJECT = 'New Lead Summary';

const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';
const TWILIO_EMAILS_API_URL = 'https://comms.twilio.com/v1/Emails';

// Every send_lead_email invocation returns this exact string to the LLM,
// regardless of whether the underlying HTTP send succeeded, failed with a 4xx,
// or blew up on missing config. Success and failure are BOTH observable to
// operators via the EMAIL_SENT / EMAIL_FAILURE pino logs — but the LLM must
// never see a failure-shaped string, because that derails the caller-facing
// flow ("Failed to send..." reads to the model as "surface this to the user").
const LEAD_EMAIL_TOOL_RESULT = 'lead_email_processed';

type EmailProvider = 'sendgrid' | 'twilio';

function resolveProvider(): EmailProvider {
  const raw = (process.env.EMAIL_PROVIDER ?? 'sendgrid').trim().toLowerCase();
  if (raw === 'sendgrid' || raw === 'twilio') return raw;
  contextLog().warn(
    {
      backend: 'email',
      configured: raw,
      description: 'Unknown EMAIL_PROVIDER — falling back to "sendgrid"',
    },
    'EMAIL_CONFIG',
  );
  return 'sendgrid';
}

// Fields the LLM can populate on the tool call. Order here is preserved when
// rendering the matrix so the email always reads top-down in a predictable
// shape (name → destination → dates → group breakdown → contact → notes).
const LEAD_FIELDS = [
  { key: 'isAgent', label: 'Travel Agent?'},
  { key: 'isRepeat', label: 'Repeat Customer?'},
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'location', label: 'Destination' },
  { key: 'travelDates', label: 'Travel Dates' },
  { key: 'numberOfTravelers', label: 'Number of Travelers' },
  { key: 'numberOfAdults', label: 'Number of Adults' },
  { key: 'numberOfChildren', label: 'Number of Children' },
  { key: 'numberOfRooms', label: 'Number of Rooms' },
  { key: 'twinRoom', label: 'Twin Room Required' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'email', label: 'Email' },
  { key: 'notes', label: 'Notes' },
] as const;

type LeadFieldKey = (typeof LEAD_FIELDS)[number]['key'];

export const SEND_LEAD_EMAIL: Anthropic.Tool = {
  name: 'send_lead_email',
  description:
    'Internal audit-log side-effect. Fires off a "New Lead Summary" email to the ops team containing the lead details captured on the call. This is fire-and-forget: its return value is always "lead_email_processed" and is for logging purposes only. It MUST NOT influence what you say to the caller, whether or when you end the call, or your decision to advance in the current flow. Recipient, sender, and email provider (SendGrid or Twilio) are configured server-side. Pass only fields the caller actually provided — omit unknowns.',
  input_schema: {
    type: 'object',
    properties: {
      subject: {
        type: 'string',
        description: `Optional email subject. Defaults to "${DEFAULT_SUBJECT}" if omitted.`,
      },
      isAgent: {type: 'boolean', description: "Is this a travel agent booking on behalf of the traveller"},
      isRepeat: {type: 'boolean', description: "Has this traveller booked with Kensington Tours before"},
      firstName: { type: 'string', description: "Caller's first name." },
      lastName: { type: 'string', description: "Caller's last name." },
      location: {
        type: 'string',
        description: 'Destination the caller is interested in travelling to.',
      },
      travelDates: {
        type: 'string',
        description: 'Travel dates the caller mentioned (free text is fine).',
      },
      numberOfTravelers: {
        type: 'string',
        description: 'Total number of travellers on the enquiry.',
      },
      numberOfAdults: {
        type: 'string',
        description: 'Number of adults in the group.',
      },
      numberOfChildren: {
        type: 'string',
        description:
          'Number of children in the group. If adults equals the total group size, pass "0" — do not omit.',
      },
      numberOfRooms: {
        type: 'string',
        description: 'Number of hotel rooms required for the group.',
      },
      twinRoom: {
        type: 'string',
        description:
          'Whether the caller needs a twin room ("yes" / "no"). Omit if not asked.',
      },
      phoneNumber: {
        type: 'string',
        description: "Caller's phone number.",
      },
      email: {
        type: 'string',
        description: "Caller's email address, if captured.",
      },
      notes: {
        type: 'string',
        description:
          'Any additional context or free-form notes worth passing on to the specialist.',
      },
    },
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function collectLeadRows(
  toolInput: Record<string, unknown>,
): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = [];
  for (const { key, label } of LEAD_FIELDS) {
    const raw = toolInput[key as LeadFieldKey];
    if (typeof raw === 'string' && raw.trim().length > 0) {
      rows.push({ label, value: raw.trim() });
    }
  }
  return rows;
}

function renderHtmlMatrix(rows: Array<{ label: string; value: string }>): string {
  if (rows.length === 0) {
    return '<p>No lead details were captured.</p>';
  }
  const body = rows
    .map(
      ({ label, value }) =>
        `<tr>` +
        `<td style="padding:6px 12px;border:1px solid #ccc;font-weight:bold;background:#f5f5f5;">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 12px;border:1px solid #ccc;">${escapeHtml(value)}</td>` +
        `</tr>`,
    )
    .join('');
  return (
    `<p>A new lead was captured on a Kensington Tours call. Details below:</p>` +
    `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">` +
    `<thead><tr>` +
    `<th style="padding:6px 12px;border:1px solid #ccc;background:#eee;text-align:left;">Field</th>` +
    `<th style="padding:6px 12px;border:1px solid #ccc;background:#eee;text-align:left;">Value</th>` +
    `</tr></thead>` +
    `<tbody>${body}</tbody>` +
    `</table>`
  );
}

function renderTextMatrix(rows: Array<{ label: string; value: string }>): string {
  if (rows.length === 0) {
    return 'No lead details were captured.';
  }
  const labelWidth = Math.max(...rows.map((r) => r.label.length));
  const lines = rows.map(
    ({ label, value }) => `${label.padEnd(labelWidth)}  |  ${value}`,
  );
  const header = `${'Field'.padEnd(labelWidth)}  |  Value`;
  const divider = `${'-'.repeat(labelWidth)}--+--${'-'.repeat(Math.max(5, ...rows.map((r) => r.value.length)))}`;
  return [
    'A new lead was captured on a Kensington Tours call. Details below:',
    '',
    header,
    divider,
    ...lines,
  ].join('\n');
}

interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
  fieldCount: number;
}

function renderEmail(toolInput: Record<string, unknown>): RenderedEmail {
  const subject =
    typeof toolInput.subject === 'string' && toolInput.subject.trim().length > 0
      ? toolInput.subject.trim()
      : DEFAULT_SUBJECT;
  const rows = collectLeadRows(toolInput);
  return {
    subject,
    html: renderHtmlMatrix(rows),
    text: renderTextMatrix(rows),
    fieldCount: rows.length,
  };
}

// Every return path returns the same neutral `lead_email_processed` string.
// Failures are surfaced ONLY via the pino error log (EMAIL_FAILURE) — the LLM
// never sees a failure-shaped string, so its next spoken response cannot be
// derailed by an ops-team audit action that shouldn't affect the caller.
async function sendViaSendGrid(email: RenderedEmail): Promise<string> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const fromName = process.env.SENDGRID_FROM_NAME;
  const toEmail = process.env.SENDGRID_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    contextLog().error(
      {
        backend: 'sendgrid',
        missing: [
          !apiKey && 'SENDGRID_API_KEY',
          !fromEmail && 'SENDGRID_FROM_EMAIL',
          !toEmail && 'SENDGRID_TO_EMAIL',
        ].filter(Boolean),
        description: 'SendGrid config missing — cannot send lead email',
      },
      'EMAIL_FAILURE',
    );
    return LEAD_EMAIL_TOOL_RESULT;
  }

  const payload = {
    personalizations: [{ to: [{ email: toEmail }] }],
    from: fromName ? { email: fromEmail, name: fromName } : { email: fromEmail },
    subject: email.subject,
    content: [
      { type: 'text/plain', value: email.text },
      { type: 'text/html', value: email.html },
    ],
  };

  try {
    const response = await fetch(SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 202) {
      contextLog().info(
        { backend: 'sendgrid', to: toEmail, subject: email.subject, fieldCount: email.fieldCount },
        'EMAIL_SENT',
      );
      return LEAD_EMAIL_TOOL_RESULT;
    }

    const errorBody = await response.text();
    contextLog().error(
      {
        backend: 'sendgrid',
        to: toEmail,
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        description: 'SendGrid send failed',
      },
      'EMAIL_FAILURE',
    );
    return LEAD_EMAIL_TOOL_RESULT;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    contextLog().error(
      {
        backend: 'sendgrid',
        err: message,
        description: 'Error sending lead email via SendGrid',
      },
      'EMAIL_FAILURE',
    );
    return LEAD_EMAIL_TOOL_RESULT;
  }
}

async function sendViaTwilio(email: RenderedEmail): Promise<string> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromAddress = process.env.TWILIO_EMAIL_FROM_ADDRESS;
  const fromName = process.env.TWILIO_EMAIL_FROM_NAME;
  const toAddress = process.env.TWILIO_EMAIL_TO_ADDRESS;

  if (!accountSid || !authToken || !fromAddress || !toAddress) {
    contextLog().error(
      {
        backend: 'twilio-email',
        missing: [
          !accountSid && 'TWILIO_ACCOUNT_SID',
          !authToken && 'TWILIO_AUTH_TOKEN',
          !fromAddress && 'TWILIO_EMAIL_FROM_ADDRESS',
          !toAddress && 'TWILIO_EMAIL_TO_ADDRESS',
        ].filter(Boolean),
        description: 'Twilio Emails config missing — cannot send lead email',
      },
      'EMAIL_FAILURE',
    );
    return LEAD_EMAIL_TOOL_RESULT;
  }

  const payload = {
    from: fromName
      ? { address: fromAddress, name: fromName }
      : { address: fromAddress },
    to: [{ address: toAddress }],
    content: {
      subject: email.subject,
      html: email.html,
    },
  };

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  try {
    const response = await fetch(TWILIO_EMAILS_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      contextLog().info(
        { backend: 'twilio-email', to: toAddress, subject: email.subject, fieldCount: email.fieldCount },
        'EMAIL_SENT',
      );
      return LEAD_EMAIL_TOOL_RESULT;
    }

    const errorBody = await response.text();
    contextLog().error(
      {
        backend: 'twilio-email',
        to: toAddress,
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
        description: 'Twilio Emails send failed',
      },
      'EMAIL_FAILURE',
    );
    return LEAD_EMAIL_TOOL_RESULT;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    contextLog().error(
      {
        backend: 'twilio-email',
        err: message,
        description: 'Error sending lead email via Twilio Emails',
      },
      'EMAIL_FAILURE',
    );
    return LEAD_EMAIL_TOOL_RESULT;
  }
}

export const executeSendLeadEmail = async (
  toolInput: Record<string, unknown>,
): Promise<string> => {
  const provider = resolveProvider();
  const email = renderEmail(toolInput);
  return provider === 'twilio' ? sendViaTwilio(email) : sendViaSendGrid(email);
};
