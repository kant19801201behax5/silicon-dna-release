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

## 4. Read Live Oracle State via Public API

The oracle's source data is publicly readable — no key required:

```bash
curl https://rtt.phoenix-ai.work/api/public-feed
```

Returns a JSON array of recent readings, one object per ~1-minute tick, each with fields including `arb_p99`, `base_p99`, `arb_revert`, `base_revert`, `ts`, and per-chain z-scores. See the last entry's `ts` (Unix seconds) to confirm the feed is live.

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

## Summary

| What to check | Where |
|---|---|
| Active contract | testnet.cspr.live/contract/hash-2a7ebbc9... |
| Original contract (962 historical tx) | testnet.cspr.live/contract/hash-5e45d42c... |
| Agent wallet | testnet.cspr.live/account/020249... |
| Live data | rtt.phoenix-ai.work/api/public-feed |
| Dashboard | rtt.phoenix-ai.work/casper |
| Demo video | https://youtu.be/o-CQfiSfQ4o |
