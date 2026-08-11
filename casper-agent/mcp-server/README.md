# Phoenix Zero Oracle — MCP Server

Exposes the same live sequencer-safety data that powers the Casper
`SequencerOracle` contract as [Model Context Protocol](https://modelcontextprotocol.io)
tools — part of Casper's own promoted AI toolkit
(https://www.casper.network/ai lists MCP servers as a core building block
for agentic apps). Any MCP-compatible client (Claude Desktop, or any tool
speaking MCP) can call these directly, without knowing this project's REST
API shape.

This is a thin protocol adapter, not a separate data source — both tools
read the same public, no-auth endpoints (`/api/public-feed`, `/api/health`)
the Casper agent (`ts-agent/agent.js`) itself reads, using the identical
safety thresholds (`arb_revert < 15%`, `base_p99 < 500ms`).

## Tools

| Tool | Returns |
|---|---|
| `get_sequencer_safety` | `{ safe, reason, arb_revert_pct, base_p99_ms, ts }` — the same safe/unsafe decision the on-chain oracle publishes |
| `get_oracle_state` | Full raw latest measurement across all 6 monitored chains |
| `get_rwa_settlement_signal` | Network safety (incl. Casper's own P99) + Kraken CSPR/USD liquidity + identity-screening context, combined into one `ready_to_settle` verdict for tokenized real-world-asset (RWA) settlement — see below |
| `explain_settlement_decision` | Same signals, explained in plain language by a real LLM call (OpenRouter) — see below. Optional; the other three tools need no configuration |

### `get_rwa_settlement_signal`

RWA transfers care about three things a plain network-safety check doesn't
separate: (a) is the chain environment stable enough to settle without a
failed/expensive retry, (b) is there real market liquidity to exit into,
and (c) has the counterparty side passed identity screening. This tool
reports all three and combines them into one `ready_to_settle` verdict:

- **Network safety** — `network_safe_to_settle`, gated on `arb_revert < 15%`,
  `base_p99 < 500ms`, **and now Casper's own P99 < 2000ms**
  (`casper_p99_ms` / `casper_safe`). The 2000ms threshold was calibrated
  2026-07-29 from 21,591 historical `casper_p99` records spanning 15 days
  (p95=1586ms, p99=1997ms, only 0.97% of samples exceeded it) — Casper's
  consensus has a materially higher baseline latency than the EVM chains
  (median 872ms vs. Base's ~15-50ms normal), so this is a tail-percentile
  cut, not the same kind of threshold as `BASE_P99_MAX`.
- **Market liquidity** (`market_liquidity`) — live CSPR/USD bid/ask spread
  and 24h volume from Kraken's public Ticker API (no auth, no key). Flags
  `liquid: false` if spread ≥ 1% or 24h volume ≤ $10k — thresholds set
  conservatively wide (observed spread on 2026-07-29 was ~0.25%) since the
  pair is young (CSPR listed on Kraken 2026-07-21) and hasn't been
  calibrated against months of history. Degrades to `available: false`
  rather than blocking the verdict if Kraken itself is unreachable.
- **Identity screening** (`identity_screening`) — Silicon DNA's live bot-ban
  gate on the paid x402 endpoint (verified in production — see
  `casper-agent/CHECKLIST.md`).

### `explain_settlement_decision`

Takes the exact same live signals as `get_rwa_settlement_signal` and sends
them to a real LLM (via [OpenRouter](https://openrouter.ai), default model
`openai/gpt-4o-mini`) for a short, plain-language explanation of the verdict
and its main risk driver — matching Casper's own promoted pattern of
piping on-chain/oracle state into an LLM through MCP. Deliberately kept out
of the deterministic safety path (`ts-agent/agent.js`, the on-chain
contracts): if this call fails or the key isn't set, it returns
`available: false` and never throws, so an optional explanation layer can
never affect the actual safe/unsafe decision.

```bash
cp .env.example .env
# fill in OPENROUTER_API_KEY (free key at https://openrouter.ai/keys)
```

Live sample (2026-07-29, cost $0.00005565):
```json
{
  "available": true,
  "ready_to_settle": true,
  "explanation": "It is currently safe to settle a real-world asset transfer, as the system is ready to settle. The single biggest risk driver is the Casper P99 milliseconds response time, which is at 692 ms and approaching levels that would be deemed unsafe (>= 2000 ms).",
  "model": "openai/gpt-4o-mini"
}
```

## Run it

```bash
cd casper-agent/mcp-server
npm install
node index.js
```

It speaks MCP over stdio — it won't print anything and will appear to hang
when run directly; that's normal, it's waiting for a client to connect.

## Use with Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "phoenix-zero-casper-oracle": {
      "command": "node",
      "args": ["/absolute/path/to/casper-agent/mcp-server/index.js"]
    }
  }
}
```

## Verified working

Tested end-to-end against a real MCP client (`@modelcontextprotocol/sdk`'s
own `Client` + `StdioClientTransport`) on a completely fresh `npm install` —
all four tools return real, live, current values matching the production
agent's own logs. `get_rwa_settlement_signal` was verified live catching a
real high-revert edge case (`arb_revert_pct: 15.73%`, just above the 15%
threshold) on 2026-07-21, and re-verified 2026-07-29 after adding the
Casper-native threshold and Kraken liquidity signal — live output that day:
`casper_p99_ms: 880` (safe, threshold 2000), `market_liquidity: { liquid:
true, spread_pct: 0.246, volume_24h_usd: 60386 }`, `ready_to_settle: true`.
`explain_settlement_decision` was verified 2026-07-29 with a real, working
OpenRouter key end-to-end — real HTTP call to `openai/gpt-4o-mini`, real
generated explanation referencing the actual live `casper_p99_ms` value
(692ms that call), real token cost ($0.00005565), confirmed the other three
tools were unaffected by adding it.
