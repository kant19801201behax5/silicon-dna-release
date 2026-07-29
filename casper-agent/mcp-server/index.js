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

// Calibrated 2026-07-29 from 21,591 historical casper_p99 records spanning
// 2026-07-15 to 2026-07-28 (15 days, /opt/phoenix_zero/metrics_history.jsonl
// + rotated logs). Casper's own consensus has a materially different latency
// profile than the EVM chains above (median 872ms vs. Base's ~15-50ms
// normal), so this is NOT the same multiple-of-baseline logic as
// BASE_P99_MAX — it's a tail-percentile cut: p95=1586ms, p98=1819ms,
// p99=1997ms, and only 0.97% of the 15-day sample exceeded 2000ms (15
// records, 0.07%, hit a hard 5000ms probe-timeout cap). 2000ms flags
// genuine tail/stall events without reacting to Casper's normal jitter.
const CASPER_P99_MAX = 2000;

const KRAKEN_TICKER_URL = "https://api.kraken.com/0/public/Ticker?pair=CSPRUSD";
// Not independently calibrated against months of Kraken history (the pair is
// young — CSPR went live on Kraken 2026-07-21) — set conservatively wide
// instead: observed spread on 2026-07-29 was ~0.2-0.3%, so 1% leaves real
// margin before flagging, and $10k/24h is a low bar meant only to catch a
// genuinely dead/delisted market, not to gate on normal volume swings.
const KRAKEN_SPREAD_MAX_PCT  = 1.0;
const KRAKEN_MIN_24H_VOL_USD = 10000;

async function fetchLatest() {
  const [feedRes, healthRes] = await Promise.all([fetch(FEED_URL), fetch(HEALTH_URL)]);
  const feed = await feedRes.json();
  const health = await healthRes.json();
  if (!feed.data || !feed.data.length) throw new Error("Empty oracle feed");
  const latest = feed.data[feed.data.length - 1];
  return { latest, health };
}

// Public Kraken market data for CSPR/USD — no auth, no key, no cost.
// Returns null (never throws) on any failure so a Kraken outage degrades
// this one signal gracefully instead of breaking the whole tool.
async function fetchKrakenLiquidity() {
  try {
    const r = await fetch(KRAKEN_TICKER_URL, { signal: AbortSignal.timeout(8000) });
    const j = await r.json();
    if (j.error && j.error.length) throw new Error(j.error.join("; "));
    const t = j.result && j.result.CSPRUSD;
    if (!t) throw new Error("CSPRUSD pair missing from response");
    const bid = parseFloat(t.b[0]);
    const ask = parseFloat(t.a[0]);
    const lastPrice = parseFloat(t.c[0]);
    const vol24h = parseFloat(t.v[1]); // index 1 = last 24h (index 0 = today-so-far)
    const mid = (bid + ask) / 2;
    const spreadPct = mid > 0 ? ((ask - bid) / mid) * 100 : null;
    const vol24hUsd = vol24h * lastPrice;
    const liquid = spreadPct !== null
      && spreadPct < KRAKEN_SPREAD_MAX_PCT
      && vol24hUsd > KRAKEN_MIN_24H_VOL_USD;
    return {
      available: true,
      liquid,
      price_usd: lastPrice,
      spread_pct: spreadPct !== null ? +spreadPct.toFixed(3) : null,
      volume_24h_usd: Math.round(vol24hUsd),
      source: "Kraken public Ticker API (CSPRUSD)",
    };
  } catch (e) {
    return { available: false, liquid: null, error: e.message };
  }
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
      "Combines network safety (incl. Casper's own P99, calibrated 2026-07-29), " +
      "CSPR market liquidity on Kraken, and identity screening context into one " +
      "settlement-readiness verdict for tokenized real-world-asset (RWA) " +
      "transfers on Casper — a settlement needs the chain to be stable, a real " +
      "exit/reference market to exist, and the counterparty to have passed " +
      "identity screening.",
    inputSchema: {},
  },
  async () => {
    const { latest, health } = await fetchLatest();
    const kraken = await fetchKrakenLiquidity();

    const arbRevert = parseFloat(latest.arb_revert || 0);
    const baseP99   = parseInt(latest.base_p99 || 0, 10);
    const casperP99 = latest.casper_p99 != null ? Math.round(latest.casper_p99) : null;

    const evmOk    = arbRevert < ARB_REVERT_MAX && baseP99 < BASE_P99_MAX;
    const casperOk = casperP99 !== null && casperP99 < CASPER_P99_MAX;
    const networkSafe = health.safe === true && evmOk && casperOk;
    // Liquidity gates the overall verdict only when we got a real reading —
    // a Kraken outage degrades to "unknown" rather than silently blocking
    // every RWA settlement on an unrelated third-party API being down.
    const liquidityOk = kraken.available ? kraken.liquid : true;
    const readyToSettle = networkSafe && liquidityOk;

    let reason = "ok";
    if (!networkSafe) {
      reason = arbRevert >= ARB_REVERT_MAX ? "high_revert"
             : baseP99 >= BASE_P99_MAX     ? "elevated_base_p99"
             : !casperOk                   ? "elevated_casper_p99"
             : "oracle_unsafe";
    } else if (!liquidityOk) {
      reason = "low_kraken_liquidity";
    }

    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          ready_to_settle: readyToSettle,
          network_safe_to_settle: networkSafe,
          reason,
          arb_revert_pct: +(arbRevert * 100).toFixed(2),
          base_p99_ms: baseP99,
          casper_p99_ms: casperP99,
          casper_safe: casperOk, // calibrated threshold: 2000ms, see CASPER_P99_MAX
          market_liquidity: kraken,
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
