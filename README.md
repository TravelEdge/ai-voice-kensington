# tac-voice-sample

A TypeScript sample app using [Twilio Agent Connect (TAC)](https://www.twilio.com/docs/platform/tac/overview) to handle inbound **Voice** and **SMS** conversations, routing each message to a **Claude** AI agent.

## Architecture

```
Twilio (Voice / SMS)
        │
        ▼
   TACServer (Express)
        │
     TAC SDK
   ┌────┴─────┐
   │          │
VoiceChannel  SMSChannel
   └────┬─────┘
        │  onMessageReady
        ▼
   src/agent.ts   ← Claude claude-sonnet-4-6 via Anthropic SDK
        │
   Per-conversation history + optional Twilio Memory context
```

- **`src/index.ts`** — wires TAC channels and starts the server
- **`src/agent.ts`** — self-contained Claude agent with per-conversation history

## Prerequisites

- Node.js ≥ 22.13
- A Twilio account with:
  - A phone number capable of Voice + SMS
  - TAC services provisioned (run the [TAC setup wizard](https://github.com/twilio/twilio-agent-connect-typescript))
- An [Anthropic API key](https://console.anthropic.com/)
- [ngrok](https://ngrok.com/) (for local development)
- [`jq`](https://jqlang.github.io/jq/) — only needed for `npm run dev:table` (see [Logging](#logging)). Install with `brew install jq`.

## Setup

### 1. Install the TAC TypeScript SDK

TAC is not yet published to npm. Clone and build it alongside this project:

```bash
git clone https://github.com/twilio/twilio-agent-connect-typescript.git
cd twilio-agent-connect-typescript
npm install && npm run build
cd ..
```

Then, in `package.json`, update the `twilio-agent-connect` dependency path if you cloned it locally:

```json
"twilio-agent-connect": "file:../twilio-agent-connect-typescript"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token |
| `TWILIO_API_KEY` | Twilio API Key SID |
| `TWILIO_API_SECRET` | Twilio API Key Secret |
| `TWILIO_CONVERSATION_CONFIGURATION_ID` | From the TAC setup wizard |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number |
| `TWILIO_VOICE_PUBLIC_DOMAIN` | Public domain for ConversationRelay WebSocket |
| `TWILIO_MEMORY_STORE_ID` | (Optional) Conversation Memory store ID |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |

### 4. Expose your local server

```bash
ngrok http 3000
```

Set `TWILIO_VOICE_PUBLIC_DOMAIN` to the ngrok hostname (e.g. `abc123.ngrok.io`, no `https://`).

### 5. Configure Twilio webhooks

In the [Twilio Console](https://console.twilio.com/), set your phone number's:

- **Voice webhook** → `https://<your-domain>/voice`
- **SMS webhook** → `https://<your-domain>/sms`

### 6. Run

```bash
# Development (tsx, no compile step, pino-pretty output)
npm run dev

# Development with a compact, colorized, one-line-per-event table view
# (filters to session-relevant categories only — see Logging below)
npm run dev:table

# Production
npm run build && npm start
```

## Logging

The app uses a shared [pino](https://getpino.io/) logger for TAC internals, Fastify request lifecycle, and our own custom logs. In dev the stream flows through [pino-pretty](https://github.com/pinojs/pino-pretty) for readable output; in prod (`NODE_ENV=production`) it's raw JSON that log aggregators can parse.

### Environment variables

| Variable | Description |
|---|---|
| `LOG_LEVEL` | pino threshold — `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace`. Default `info`. Set to `debug` to unhide the full-conversation transcript dump at teardown. |
| `LOG_DISABLED_FLAGS` | Comma-separated list of log categories to suppress. See [`.env.example`](.env.example) for the full flag list. Errors are never gated behind flags. |
| `LOG_FORMAT` | Set to `json` to force raw JSON even in dev (used by `npm run dev:table`). Bypasses `pino-pretty`. |

### Log categories

All hand-authored session/server logs use short category keywords as the `msg` field, with structured fields on the payload:

| Category | Fires when |
|---|---|
| `CUSTOMER_INPUT` | Customer utterance received on `handleMessage` |
| `AGENT_RESPONSE` | Final reply returned to CR, with `customerToAgentResponseTime` + `claudeApiResponseTimes[]` array |
| `CLAUDE_API` | Per-Claude-attempt log (full payload gated by the `CLAUDE_API_PAYLOAD` flag) |
| `CLAUDE_RETRY` / `CLAUDE_FAILURE` | Single-retry warn + double-failure fallback error |
| `TOOL_CALL` / `TOOL_RESULT` | Tool invocation + full pretty-printed result |
| `INTERRUPT` | Caller barge-in with `durationUntilInterruptMs` + partial `utterance` |
| `INTENT_CHANGE` | Initial + subsequent intent transitions |
| `CONVERSATION_ENDED` | Teardown marker with `historyLength` |
| `STUBBED_RESPONSE` | Stubbed backend response (LeadDepo / TMT) |
| `BACKEND_CACHED` / `BACKEND_AUTH_SKIPPED` | Boot-time cache priming outcome |
| `MEMORY_ERROR` / `MEMORY_CONFIG` | Conversation Memory API errors + config warnings |
| `EMAIL_SENT` / `EMAIL_FAILURE` / `EMAIL_CONFIG` | Email tool outcomes |
| `KNOWLEDGE_BASE_INIT` | Knowledge base tool init at boot |
| `END_CALL_SCHEDULED` | `end_call` tool signal |
| `CUSTOM_ROUTE` | Any log from the additional-routes handlers (`/waitUrl`, `/enqueue-or-end-call`, `/enqueue-completed`, etc.) |

Every session log also carries `type: "session"`, `conversationId`, and `callSid`. Server logs carry `type: "server"`.

### Compact table view

For a scannable, one-line-per-event view during development:

```bash
npm run dev:table
```

Sample output:

```
TIME       TYPE                CALLSID        MS  DETAIL
---------  ------------------  ---------  ------  ------
11:36:40   CUSTOMER_INPUT      …a4f2698           Hi there. I am looking to plan a trip
11:36:41   CLAUDE_API          …a4f2698    2789  claude-haiku-4-5
11:36:41   AGENT_RESPONSE      …a4f2698    3049  Great! What is your name?
11:36:42   INTERRUPT           …a4f2698           117ms — Nice to meet you
11:36:43   INTENT_CHANGE       -                  Intent changed : NEW_LEAD
11:36:44   CUSTOM_ROUTE        -                  /waitUrl   Hold-music wait URL hit
11:36:45   TOOL_CALL           …a4f2698           handoff
11:36:45   TOOL_RESULT         …a4f2698     706  handoff
```

The **MS** column carries whichever timing field is relevant to the row: `customerToAgentResponseTime` for `AGENT_RESPONSE`, `requestTime` for `CLAUDE_API` and `TOOL_RESULT`, blank otherwise. Each type is rendered in its own ANSI color (customer=cyan, claude-api=bright cyan, agent=green, tool=yellow, tool-result=bright yellow, interrupt=red, intent=magenta, route=blue, conversation-ended=gray). Only session-relevant categories are shown — TAC internal chatter and Fastify request logs are dropped from this view.

The pipeline lives in [`scripts/dev-table.sh`](scripts/dev-table.sh) — tweak the colors, column widths, category whitelist, or DETAIL-column formula there.

**Requires `jq` on PATH.** Install with `brew install jq`.

### Full-detail log file

`dev:table` also writes the raw JSON stream to **`logs/dev.log`** (via `tee`), so any details dropped from the table view — TAC internals, Fastify request logs, full Claude payloads, everything — are preserved on disk. The path is announced in a gray banner at startup.

The file is overwritten on each `dev:table` invocation. Override the destination if you want a per-run archive:

```bash
LOG_FILE=logs/dev-$(date +%s).log npm run dev:table
```

Typical post-mortem workflows:

```bash
# Just the Claude call records
cat logs/dev.log | jq 'select(.msg == "CLAUDE_API")'

# Everything for a specific conversation
cat logs/dev.log | jq 'select(.conversationId == "conv_...")'

# Live tail in another terminal while the table streams in your main one
tail -f logs/dev.log | jq
```

`logs/` is gitignored.

## How it works

1. An inbound call or SMS arrives at your Twilio number.
2. TAC's `VoiceChannel` or `SMSChannel` handles the Twilio protocol (TwiML, ConversationRelay WebSocket for voice; webhook for SMS).
3. TAC invokes `onMessageReady` with the user's message plus any Twilio Conversation Memory context.
4. `src/agent.ts` appends the message to the per-conversation history, calls Claude with the full history, and returns the reply.
5. TAC sends the reply back to the caller or SMS sender.
6. When the conversation ends, history is cleared to free memory.

## Customising the agent

Edit `src/agent.ts`:

- Change `SYSTEM_PROMPT` to give the agent a different persona or instructions.
- Change `model` to another Claude model (e.g. `claude-opus-4-8` for higher capability).
- Add tool use via `anthropic.messages.create({ tools: [...] })` for function calling.

## License

MIT
