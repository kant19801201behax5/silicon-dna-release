# How to Test — Phoenix Zero Casper Oracle

Step-by-step instructions for judges to verify the live system.

---

## 1. Verify the Smart Contract On-Chain

**Active contract hash (redeployed July 16, 2026):**

```
hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a
```

**View on Casper Testnet explorer:**
https://testnet.cspr.live/contract/hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a

You will see:

- Entry points: `update`, `is_safe`, `get_state`
- Named keys: `safe`, `arb_p99_ms`, `base_p99_ms`, `arb_revert_bps`, `base_revert_bps`, `last_update_ts`, `total_pushes`, `authorized`

**Original contract (historical proof, 962 real transactions, June 3 – July 6, 2026):**
`hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d`

---

## 2. Verify the Deployer Wallet

**Wallet address:**

```
0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb
```

**View on explorer:**
https://testnet.cspr.live/account/0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb

Every `update` deploy on this account (against either contract hash above) came from the autonomous agent — the same wallet is used for both.

---

## 3. Verify Key Transactions

| TX Hash | What it is |
|---------|------------|
| `2578359cc8ffcdac8316d6002d3aabed26888c102c8d69a2ccd3239f3fcd3326` | Original contract deploy (June 3, 2026) |
| `4774fdbc61b42e683024a059be624279a2b06a13a654bcebfe1065492b7652f1` | First agent update() on the original contract |

View any TX: `https://testnet.cspr.live/deploy/<TX_HASH>`

---

## 3b. Verify the RWA Settlement Gate (second contract, Odra)

A separate, additive contract — does not touch the oracle above. Deployed 2026-07-29.

**Contract package:**
```
contract-package-fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d
```

**View on explorer:**
https://testnet.cspr.live/contract-package/fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d

**Deploy transaction:** `6dc5440f5516b9084700bfaa5fe7d63715a068c16dfcba3281994272a77b2a47`
View: `https://testnet.cspr.live/transaction/6dc5440f5516b9084700bfaa5fe7d63715a068c16dfcba3281994272a77b2a47`

You will see entry points: `init`, `publish`, `is_settlement_allowed`, `get_network_safe`,
`get_identity_screening_active`, `get_last_update_ts`. Source and full build/deploy recipe:
`rwa-settlement-gate/` — see the main [README.md](./README.md) (note: this contract needs
`cargo-odra` + a current `binaryen`, a different toolchain from the raw-WASM oracle above).

---

## 4. Read Live Oracle State via Public API

The oracle's source data is publicly readable — no key required:

```bash
curl https://rtt.phoenix-ai.work/api/public-feed
```

Returns a JSON array of recent readings, one object per ~1-minute tick, each with fields including `arb_p99`, `base_p99`, `arb_revert`, `base_revert`, `ts`, and per-chain z-scores. See the last entry's `ts` (Unix seconds) to confirm the feed is live.

---

## 4b. Verify the Silicon DNA Systems Beyond the Main Cascade

Full breakdown: [`../src/SILICON_DNA_LAYERS.md`](../src/SILICON_DNA_LAYERS.md). Three of these are
live on production right now, no key required:

```bash
# 3-class classifier (HUMAN/LEGIT_AGENT/MALICIOUS_BOT, real additive scoring)
curl -X POST https://rtt.phoenix-ai.work/api/classify -H "Content-Type: application/json" \
  -d '{"ua":"Mozilla/5.0","spearmanRho":0.5,"variance":3,"entropy":3,"frankensteinScore":0,"hasPoW":false}'
# → {"agentClass":"HUMAN","confidence":0.8,"signals":[...]}

# Wallet-Sybil binding stats (empty until a wallet actually binds via /api/wallet/bind)
curl https://rtt.phoenix-ai.work/api/wallet/stats
# → {"totalBound":0,"sybilGroups":0,"largestGroup":0}

# RPC shadow-filter stats — verifiably always zero, on purpose: the endpoint is real but the
# middleware that would populate it (shadowFilterMiddleware) is defined and never mounted
# anywhere in the codebase. Listed here as a known, disclosed gap, not a working feature.
curl https://rtt.phoenix-ai.work/api/shadow-stats
# → {"tracked_ips":0,"throttled_ips":0,"total_requests":0,"bot_hits":0}
```

`/api/sync-pulse` (Golden Seal rhythm protocol) and `/api/enclave` (entropy-seal gate) both require
an established PQC session first (`403 PQC_SESSION_NOT_ESTABLISHED` on a bare `curl`) — they're
exercised by the live dashboard's own WebSocket handshake, not directly curl-able without replaying
that handshake. Source: `src/services/rhythmManager.ts`, `src/services/sealValidator.ts`.

---

## 5. Watch Live Oracle Dashboard

https://rtt.phoenix-ai.work/casper

---

## 6. Run the Agent Locally (dry run)

The deployed, production agent is Node.js (`ts-agent/agent.js` — this is what actually runs on the server, not the Python pusher also present in this repo).

```bash
git clone https://github.com/kant19801201behax5/silicon-dna-release
cd silicon-dna-release/casper-agent/ts-agent
npm install
cp .env.example .env
# DRY_RUN=true is set in .env.example — safe to run without a funded key
npm start
```

With `DRY_RUN=true`, it logs what it would push every 5 minutes (`CHECK_INTERVAL_MS=300000`) without sending real transactions.

---

## 7. Run the Agent Test Suite

```bash
cd casper-agent/ts-agent
npm install
npm test
```

Expected output:

```
🔵 Oracle Safety Logic
  ✅ Normal conditions → safe
  ✅ arb_revert exactly at threshold (14.9%) → safe
  ✅ arb_revert at threshold (15.0%) → unsafe
  ✅ MEV war May 31: arb_revert=72.1% → unsafe
  ✅ base_p99=697ms (above 500ms) → unsafe
  ✅ base_p99=499ms (below 500ms) → safe
  ✅ server_safe=false → unsafe regardless of metrics
  ✅ server_safe=true + good metrics → safe

🔵 Oracle Response Parsing
  ✅ Parses feed and health correctly
  ✅ Handles null/missing values gracefully
  ✅ MEV war scenario parsed correctly
  ✅ Uses LAST data point from feed array

🔵 Basis Points (for contract storage)
  ✅ 0.15 → 1500 bps
  ✅ 0.721 → 7210 bps (MEV war)
  ✅ 0.0 → 0 bps

🔵 Spending Limiter (x402 daily cap)
  ✅ Allows spend under the cap
  ✅ Blocks spend over the cap
  ✅ Tracks cumulative spend within the same day
  ✅ recordSpend throws once the cap would be exceeded
  ✅ remaining() reflects spend so far
  ✅ constructor rejects a non-positive limit

Results: 21 passed, 0 failed
```

---

## 8. Verify Safety Logic

The agent computes `safe` from the public feed (`agent.js`, `fetchOracleState()`):

```js
const metricsOk = arbRevert < 0.15 && baseP99 < 500; // 15% revert, 500ms P99
const safe = serverSafe && metricsOk;
```

During the **May 31, 2026 MEV war**: `arb_revert_ratio` reached `0.721` → `safe` became `false`, and the oracle's off-chain feed reflected this 3 minutes before the acute stall.

---

## 9. Run the MCP Server (4 tools, incl. RWA + LLM)

```bash
cd casper-agent/mcp-server
npm install
node index.js
```

Speaks MCP over stdio — hangs waiting for a client, that's normal. Point Claude Desktop or
any MCP client at it (see [mcp-server/README.md](./mcp-server/README.md) for the config).
Four tools:

| Tool | Needs a key? |
|---|---|
| `get_sequencer_safety` | No |
| `get_oracle_state` | No |
| `get_rwa_settlement_signal` | No — includes the calibrated Casper P99 threshold and live Kraken CSPR/USD liquidity, both free public APIs |
| `explain_settlement_decision` | Optional — needs `OPENROUTER_API_KEY` (free key at openrouter.ai/keys) for the LLM explanation; returns `available: false` cleanly without one, everything else still works |

mcp-server/README.md has real, live sample output for all four, including exact numbers from
the actual verification runs.

---

## 10. Build and Run the Core Silicon DNA Server (the code behind sections 4/4b above)

Added 2026-07-29: `server.ts` and everything under `src/services/`, `src/middleware/`,
`src/db/`, `src/utils/` at the repo root are the actual, currently-deployed implementation
that [`../src/SILICON_DNA_LAYERS.md`](../src/SILICON_DNA_LAYERS.md) cites by exact line
number — not a description of it, the real file. CI builds and starts it on every push
(`check-core-server` job); to do the same yourself:

```bash
git clone https://github.com/kant19801201behax5/silicon-dna-release
cd silicon-dna-release
npm install
npx tsc --noEmit    # typecheck — should produce no output
npm start           # or: npx tsx server.ts
```

Should print `Silicon DNA [L0_CORE] Active → http://localhost:3000` within a second or two.
`curl http://localhost:3000/metrics` returns Prometheus-format metrics from your own local
instance (separate from the production one at rtt.phoenix-ai.work).

---

## Summary

| What to check | Where |
|---|---|
| Active contract (oracle) | testnet.cspr.live/contract/hash-2a7ebbc9... |
| Original contract (962 historical tx) | testnet.cspr.live/contract/hash-5e45d42c... |
| RWA Settlement Gate (2nd contract, Odra) | testnet.cspr.live/contract-package/fab9c0a1... |
| Agent wallet | testnet.cspr.live/account/020249... |
| Live data | rtt.phoenix-ai.work/api/public-feed |
| Dashboard | rtt.phoenix-ai.work/casper |
| MCP server (4 tools) | `casper-agent/mcp-server/` |
| Core server (buildable from clean clone) | `server.ts` + `src/` at repo root |
| Demo video (general) | https://youtu.be/o-CQfiSfQ4o |
| Demo video (Casper-specific, 52s) | https://youtu.be/KtTrz23B92w |
