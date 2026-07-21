#!/usr/bin/env node
/**
 * Phoenix Zero Oracle — MCP Server
 * =================================
 * Exposes the same live sequencer-safety data that powers the Casper
 * SequencerOracle contract as MCP tools, so any MCP-compatible AI agent
 * (Claude Desktop, or any client speaking the Model Context Protocol) can
 * check network safety directly, without needing to know this project's
 * REST API shape.
 *
 * Backed by the same public, no-auth endpoints the Casper agent itself
 * reads (https://rtt.phoenix-ai.work/api/public-feed, /api/health) — this
 * is a thin protocol adapter, not a separate data source.
 *
 * Run directly:
 *   node index.js
 *
 * Or point an MCP client at it, e.g. Claude Desktop's claude_desktop_config.json:
 *   {
 *     "mcpServers": {
 *       "phoenix-zero-casper-oracle": {
 *         "command": "node",
 *         "args": ["/absolute/path/to/casper-agent/mcp-server/index.js"]
 *       }
 *     }
 *   }
 */
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

const FEED_URL   = "https://rtt.phoenix-ai.work/api/public-feed";
const HEALTH_URL = "https://rtt.phoenix-ai.work/api/health";

// Same thresholds as ts-agent/agent.js and the on-chain contract's own
// safety logic — kept in sync deliberately, see casper-agent/README.md.
const ARB_REVERT_MAX = 0.15;
const BASE_P99_MAX   = 500;

async function fetchLatest() {
  const [feedRes, healthRes] = await Promise.all([fetch(FEED_URL), fetch(HEALTH_URL)]);
  const feed = await feedRes.json();
  const health = await healthRes.json();
  if (!feed.data || !feed.data.length) throw new Error("Empty oracle feed");
  const latest = feed.data[feed.data.length - 1];
  return { latest, health };
}

const server = new McpServer({ name: "phoenix-zero-casper-oracle", version: "1.0.0" });

server.registerTool(
  "get_sequencer_safety",
  {
    title: "Get Casper sequencer network safety",
    description:
      "Checks whether it's currently safe to submit DeFi transactions, based on " +
      "live Arbitrum/Base sequencer revert ratio and P99 latency (same thresholds " +
      "as the on-chain Casper oracle: arb_revert < 15% AND base_p99 < 500ms).",
    inputSchema: {},
  },
  async () => {
    const { latest, health } = await fetchLatest();
    const arbRevert = parseFloat(latest.arb_revert || 0);
    const baseP99   = parseInt(latest.base_p99 || 0, 10);
    const metricsOk = arbRevert < ARB_REVERT_MAX && baseP99 < BASE_P99_MAX;
    const safe      = health.safe === true && metricsOk;
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          safe,
          reason: safe ? "ok" : (arbRevert >= ARB_REVERT_MAX ? "high_revert" : "elevated_p99"),
          arb_revert_pct: +(arbRevert * 100).toFixed(2),
          base_p99_ms: baseP99,
          ts: latest.ts,
        }, null, 2),
      }],
    };
  }
);

server.registerTool(
  "get_oracle_state",
  {
    title: "Get full Phoenix Zero oracle snapshot",
    description:
      "Returns the latest raw measurement across all 6 monitored chains " +
      "(Arbitrum, Base, Optimism, zkSync, Mantle, Casper) — the same data " +
      "published on-chain to the Casper SequencerOracle contract every 5 minutes.",
    inputSchema: {},
  },
  async () => {
    const { latest } = await fetchLatest();
    return { content: [{ type: "text", text: JSON.stringify(latest, null, 2) }] };
  }
);

server.registerTool(
  "get_rwa_settlement_signal",
  {
    title: "Get RWA settlement readiness signal for Casper",
    description:
      "Combines network safety with identity screening context for tokenized " +
      "real-world-asset (RWA) settlement decisions on Casper — RWA transfers " +
      "care about both (a) whether the broader chain environment is stable " +
      "enough to settle without a failed/expensive retry, and (b) whether the " +
      "counterparty side of the flow has passed identity screening.",
    inputSchema: {},
  },
  async () => {
    const { latest, health } = await fetchLatest();
    const arbRevert = parseFloat(latest.arb_revert || 0);
    const baseP99   = parseInt(latest.base_p99 || 0, 10);
    const casperP99 = latest.casper_p99 != null ? Math.round(latest.casper_p99) : null;
    const metricsOk = arbRevert < ARB_REVERT_MAX && baseP99 < BASE_P99_MAX;
    const networkSafe = health.safe === true && metricsOk;
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          network_safe_to_settle: networkSafe,
          reason: networkSafe ? "ok" : (arbRevert >= ARB_REVERT_MAX ? "high_revert" : "elevated_p99"),
          arb_revert_pct: +(arbRevert * 100).toFixed(2),
          base_p99_ms: baseP99,
          // Informational only — Casper's own P99 has a different latency
          // profile than the EVM chains above (different consensus, block
          // time), and this project has not calibrated a safe/unsafe
          // threshold for it specifically. Not used to gate the verdict.
          casper_p99_ms_informational: casperP99,
          identity_screening: {
            available: true,
            note:
              "Paid access to this oracle (/api/v1/safe) is gated by Silicon DNA's " +
              "live bot-ban list — an IP already flagged by its detection is " +
              "rejected before payment is even requested. This tool reads the " +
              "free public feed and does not itself perform that check; it " +
              "only applies to the paid x402 endpoint. See casper-agent/CHECKLIST.md " +
              "for how this was verified.",
          },
          ts: latest.ts,
        }, null, 2),
      }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal MCP server error:", err);
  process.exit(1);
});
