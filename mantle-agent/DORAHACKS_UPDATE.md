# Silicon DNA × Mantle — DoraHacks BUIDL Update
# Mantle Turing Test Hackathon 2026
# Track: AI Trading & Strategy — Mirana Alpha & Data

---

## Vision (256 chars)
Silicon DNA turns continuous live sequencer telemetry into investment-grade intelligence - running since 2026-03-15, ~258,700 measurements/day across 6 chains. Detected a 72.1% MEV war 3 minutes early. Now published on-chain via TuringOracle on Mantle Sepolia.

*Corrected 2026-07-29: dropped "R²=0.998 causal model" from this vision line — that
figure belongs to a causal-signal model confirmed running inside JARVIS (a separate
trading agent on the same server), not to this oracle or the Mantle pusher. See the
correction note in `src/CAUSAL_ENGINE.md` for the full explanation.*

---

## Project Description

### The Data Problem No One Talks About

MEV bots, quantitative traders, and market makers all rely on the same edge: **they see network stress before everyone else**. They watch transaction revert ratios, sequencer RTT, and mempool pressure. Retail traders and DeFi protocols don't have this data.

Silicon DNA changes that.

---

### What We Built

**Continuous blockchain telemetry collection since 2026-03-15**, turned into a live causal intelligence system.

**Phoenix Zero** probes 6 chains every 2 seconds:
- Mantle, Arbitrum, Base, Optimism, zkSync, Casper (Ethereum L1 also probed separately for blob-fee/gas-pressure)
- Measures: RTT P99, transaction revert ratios, stall detection, blob fees

**The Discovery: arb_revert_ratio as a leading indicator**

After analyzing a 206,040-record production feed snapshot, we found that `arb_revert_ratio` (Arbitrum transaction revert ratio) is a **causal leading indicator** of cross-chain stress events:

```
Normal:    4–8%  (baseline)
Warning:  >15%   (MEV activity starting)
MEV war:   72%   (May 31, 2026 — documented event)
```

*Corrected 2026-07-29: the "causal model, R²=0.998" claim previously here has been
removed — that SGD-regression/R²/ATE mechanism is real and running, but it's inside
JARVIS (a separate trading agent on the same server, gating its own trades), not part
of this oracle's code. See `src/CAUSAL_ENGINE.md` for the full correction. The
revert-ratio threshold crossings above (4-8% baseline → >15% warning → 72% MEV war)
are this project's own simple threshold logic, unaffected by that removal.*

This signal precedes visible gas price spikes by **27 seconds** on average, based on
a separately-documented event (RTT spike → revert-ratio threshold crossing, May 17
2026 — see the main [`README.md`](../README.md) proof section), not the SGD model
above.

---

### Mantle Integration

**On-chain oracle: TuringOracle.sol**

Deployed on Mantle Sepolia Testnet — designed to update every 60 seconds via
an autonomous pusher agent. Contract itself is live and verified on-chain;
the pusher's wallet ran out of testnet gas on 2026-07-08 and remains
unfunded as of this update (a few thousandths of a MNT short, confirmed via
live RPC balance check) — every push attempt since has failed with
insufficient-funds. A testnet faucet refuel (free, ~2 minutes) will resume
updates immediately; not yet done.

```solidity
// Any Mantle DeFi protocol gets live network intelligence:
ITuringOracle oracle = ITuringOracle(ORACLE_ADDRESS);
bool safe = oracle.is_legitimate();  // mantle healthy + traffic clean?
TuringState memory state = oracle.get_state();
// state.trust_score_bps, state.bot_ratio_bps, state.mantle_safe, state.p99_ms
```

**Autonomous pusher agent**

Node.js agent running on DO NYC1. Reads Silicon DNA state, pushes to Mantle contract every 60s.

**Mantle-specific data:**
- Mantle P99 RTT (milliseconds) — published on-chain
- Mantle sequencer stall detection
- Cross-chain correlation: Mantle health vs Arbitrum revert ratio

---

### Silicon DNA — Identity Layer

*Corrected 2026-07-29: this section previously had its own copy of the fictional
trust-score cutoffs and "Reputation → Anomaly detection → ... → Causal engine"
pipeline — missed in an earlier pass that fixed the same claim elsewhere in this
file. Real breakdown, with file/line citations: [`../src/SILICON_DNA_LAYERS.md`](../src/SILICON_DNA_LAYERS.md).*

Beyond network data, Silicon DNA classifies every web connection via a real,
separate 3-class classifier (`agentClassifier.ts`, `POST /api/classify`,
additive scoring — different formula, not the cutoffs previously listed here):
HUMAN / LEGIT_AGENT / MALICIOUS_BOT.

Per-visitor cascade: CPU jitter physics → ML-KEM-768 post-quantum → TLS
fingerprint (currently a fixed placeholder value pending a real JA4
implementation — see note below) → "Frankenstein" UA/header check → Argon2id
PoW → session identity hash → PoW-difficulty cache → synthetic-rhythm detector
→ Spearman stall detector → network telemetry gate. Separately: the 3-class
classifier above, a "Golden Seal" timing-rhythm + entropy-seal protocol
guarding `/api/enclave`, and EIP-191 wallet-Sybil binding. None of this feeds
the Mantle pusher, which reads network telemetry only (see "Mantle Integration"
above).

Note on the TLS fingerprint layer: real JA4 fingerprinting requires reading the raw TLS ClientHello, which isn't visible to the origin server once traffic is proxied through Cloudflare (a paid Bot Management tier would expose it via headers). This layer is currently a fixed placeholder in the live code, honestly disclosed here rather than left silently implied as working.

**CPU jitter layer:** measures nanosecond-scale timing variance between consecutive `hrtime.bigint()` calls — real OS/hardware scheduling jitter, though not a deliberately-engineered physical noise source. The ">99.5% accuracy" figure is not currently backed by a measured validation dataset in this repo and should be treated as a target, not a verified result.

---

### Live Proof

**Network monitoring:**
- Continuous RTT measurement since March 15, 2026 - ~258,700/day across 6 chains (measured off the live feed 2026-07-25); the May 31 study used a 206,040-record snapshot
- Dashboard: https://phoenix-zero.vercel.app
- Public feed: https://rtt.phoenix-ai.work/api/public-feed

**MEV war case study — May 31, 2026:**
```
01:04 UTC  Arbitrum RTT climbing, arb_revert = 12%
01:07 UTC  arb_revert > 15% → oracle: safe=false
01:09 UTC  arb_revert = 72.1% (9× normal)
01:15 UTC  Base P99 = 1,144ms (normal: ~80ms)
01:27 UTC  ZKSync fully timed out
```
Any agent reading our oracle paused at 01:07 — **8 minutes before the cascade**.

**Demo video:** https://youtu.be/o-CQfiSfQ4o

---

### Technical Stack

| Component | Technology |
|-----------|-----------|
| Oracle server | Node.js, WebSocket, Worker Threads |
| CPU jitter probe | Node.js `process.hrtime.bigint()` |
| Post-quantum channel | ML-KEM-768 (NIST FIPS 203, `mlkem` npm) |
| Causal model | SGD regression, Pearson R² — real, live (R²=0.9983 at last check), but runs inside JARVIS, a separate system on the same server; not part of this repo's oracle/pusher code, see `src/CAUSAL_ENGINE.md` |
| Dashboard | React + Vite |
| Mantle contract | Solidity 0.8.20, Mantle Sepolia |
| Mantle pusher | ethers v6, Node.js |

**Architecture docs:** `src/CAUSAL_ENGINE.md`, `src/SILICON_DNA_LAYERS.md`

---

### Why This Wins Alpha & Data Track

**vs. "Insight value" (15 pts):** arb_revert_ratio as a leading indicator is not in any public dataset. We discovered it through continuous measurement since 2026-03-15.

**vs. "Data source quality" (15 pts):** 6 chains, 2-second granularity, continuous since 2026-03-15. Mantle-native data included. Not scraped — directly measured RTT from DO NYC1.

**vs. "Investment utility" (12 pts):** 27-second lead time before MEV peaks. May 31 case study is documented and verifiable from our public feed.

**vs. "Scalability" (8 pts):** Adding a new chain takes < 1 hour. Oracle contract deploys to any EVM chain in minutes.

---

### Business Model (target, not yet under contract)

| Target customer | Proposed pricing | What they'd buy |
|----------|---------|---------------|
| MEV searchers | $200–500/mo | Real-time revert ratio + RTT feed |
| DeFi protocols | $0.01/call | Per-verification via x402 micropayment (live today) |
| Hedge funds | $500–2000 | Historical dataset for backtesting |
| AI agent infrastructure | $50–200/mo | Silicon DNA identity verification API |

The only revenue mechanism actually live today is the $0.01/call x402
micropayment on `/api/v1/safe`. The rest of this table is a proposed
go-to-market, not existing paying customers.

**Total addressable (market sizing, not signed customers):** 200+ active MEV searchers on Arbitrum alone. 50+ DeFi protocols on Mantle.

---

### GitHub

https://github.com/kant19801201behax5/silicon-dna-release

```
/server.ts             — Core Silicon DNA server, the real deployed implementation
/                      — probe-worker.mjs, package.json, tsconfig.json (root project)
/src/                  — services/middleware/db/utils (real source, not just docs)
                          + architecture write-ups (SILICON_DNA_LAYERS.md, CAUSAL_ENGINE.md)
/mantle-agent/         — Mantle Sepolia contract + pusher
/casper-agent/         — Casper Agentic Buildathon integration
/dist/                 — Live dashboard (React)
```

*Corrected 2026-07-29: `/src/` used to say "Architecture documentation (readable)" — until today
that's all it was, because `server.ts` and every file it imports from `src/services/` etc. lived
only in a separate private repo, so the layer docs cited line numbers no one outside the team
could open. Published the real files here the same day so those citations resolve for anyone.*

---

### Contact

Aleksandr · Telegram: [@Kentyrk](https://t.me/Kentyrk) · Email: aleksandrkent64@gmail.com
