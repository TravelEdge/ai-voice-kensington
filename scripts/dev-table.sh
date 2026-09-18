#!/usr/bin/env bash
# Runs the dev server with JSON logging and pipes through a filter + formatter
# for a compact, colorized table view. Only session-relevant categories flow
# through; TAC/Fastify internal chatter is dropped.
#
# Usage: `npm run dev:table`
# Requires: jq (brew install jq)

set -euo pipefail

LOG_FORMAT=json NODE_ENV=development NODE_OPTIONS='--disable-warning=FSTDEP023' tsx src/index.ts | jq -rR --unbuffered '
  . as $line
  | try (fromjson) catch empty
  | select(.msg | IN("CUSTOM_ROUTE","CUSTOMER_INPUT","INTENT_CHANGE","AGENT_RESPONSE","CLAUDE_API","INTERRUPT","TOOL_CALL","TOOL_RESULT","CONVERSATION_ENDED"))
  | [
      (.time / 1000 | strflocaltime("%H:%M:%S")),
      .msg,
      (.callSid // "-"),
      (
        # MS column: pick the right timing field per category.
        if   .msg == "AGENT_RESPONSE"                        then ((.customerToAgentResponseTime // "") | tostring)
        elif .msg == "TOOL_RESULT" or .msg == "CLAUDE_API"   then ((.requestTime // "") | tostring)
        else "" end
      ),
      (
        if   .msg == "TOOL_CALL"      then .tool
        elif .msg == "TOOL_RESULT"    then .tool
        elif .msg == "CLAUDE_API"     then .model
        elif .msg == "AGENT_RESPONSE" then .response
        elif .msg == "CUSTOMER_INPUT" then .input
        elif .msg == "INTENT_CHANGE"  then ((.description // "") + " : " + (.intent // ""))
        elif .msg == "CUSTOM_ROUTE"   then ((.route // "") + "   " + (.description // ""))
        elif .msg == "INTERRUPT"      then ((.durationUntilInterruptMs // 0 | tostring) + "ms" + (if (.utterance // "") != "" then " — " + .utterance else "" end))
        else "" end
      ) | tostring | gsub("\n"; " ")
    ]
  | @tsv
' | awk -F "\t" '
  BEGIN {
    # ANSI color codes — one per category. Empty string for anything missing
    # falls through to a plain (no color) row.
    RESET  = "\033[0m"
    BOLD   = "\033[1m"
    colors["CUSTOMER_INPUT"]     = "\033[36m"   # cyan
    colors["AGENT_RESPONSE"]     = "\033[32m"   # green
    colors["CLAUDE_API"]         = "\033[96m"   # bright cyan
    colors["TOOL_CALL"]          = "\033[33m"   # yellow
    colors["TOOL_RESULT"]        = "\033[93m"   # bright yellow
    colors["INTERRUPT"]          = "\033[31m"   # red
    colors["INTENT_CHANGE"]      = "\033[35m"   # magenta
    colors["CONVERSATION_ENDED"] = "\033[90m"   # gray
    colors["CUSTOM_ROUTE"]       = "\033[34m"   # blue

    # Column headers, printed once at startup so the reader knows what each
    # field is without having to consult docs.
    printf "%s%-9s  %-18s  %-9s  %6s  %s%s\n", BOLD, "TIME", "TYPE", "CALLSID", "MS", "DETAIL", RESET
    printf "%s%-9s  %-18s  %-9s  %6s  %s%s\n", BOLD, "---------", "------------------", "---------", "------", "------", RESET
  }
  {
    # Truncate CallSid to a short "…xxxxxx" suffix so the column stays narrow.
    sid = $3
    if (length(sid) > 8) sid = "…" substr(sid, length(sid) - 6)
    # Truncate the DETAIL column so long agent responses / tool payloads
    # dont line-wrap the terminal.
    val = $5
    if (length(val) > 200) val = substr(val, 1, 197) "..."
    color = colors[$2]
    if (color == "") color = ""
    printf "%s%-9s  %-18s  %-9s  %6s  %s%s\n", color, $1, $2, sid, $4, val, RESET
  }
'
