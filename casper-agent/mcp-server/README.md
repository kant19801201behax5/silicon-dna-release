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
both tools return real, live, current values matching the production
agent's own logs.
