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
| `get_rwa_settlement_signal` | Network safety plus identity-screening context, framed for tokenized real-world-asset (RWA) settlement — see below |

### `get_rwa_settlement_signal`

RWA transfers care about two things a plain network-safety check doesn't
separate: (a) is the chain environment stable enough to settle without a
failed/expensive retry, and (b) has the counterparty side passed identity
screening. This tool reports both — the same `network_safe_to_settle`
verdict as `get_sequencer_safety`, plus an `identity_screening` field
describing Silicon DNA's live bot-ban gate on the paid x402 endpoint
(verified in production — see `casper-agent/CHECKLIST.md`). It also
reports Casper's own P99 informationally (`casper_p99_ms_informational`)
without gating on it — Casper's consensus has a different latency profile
than the EVM chains the safety threshold was calibrated against, and this
project hasn't calibrated a separate threshold for it, so it's reported
honestly rather than folded into a fabricated verdict.

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
all three tools return real, live, current values matching the production
agent's own logs. `get_rwa_settlement_signal` was verified live catching a
real high-revert edge case (`arb_revert_pct: 15.73%`, just above the 15%
threshold) on 2026-07-21.
