# Silicon DNA — Autonomous Turing Test for Web3 Agents

> **Mantle Turing Test Hackathon 2026** · Track: AI agents & identity infrastructure
> 
> **Also submitted to:** Casper Agentic Buildathon 2026 (`casper-agent/`)

---

## The Problem Silicon DNA Solves

The Mantle ecosystem — like every L2 — faces an identity vacuum:

- DeFi protocols can't tell human users from bots
- Autonomous AI agents look identical to malicious scrapers
- MEV bots drain liquidity silently; sequencer stalls happen without warning
- There is no Turing Test for the onchain world

**Silicon DNA is that Turing Test.**

---

## What This Is

A 12-layer autonomous verification system that classifies every web request as:

```
HUMAN        — real user, gets full access
LEGIT_AGENT  — verified AI agent (passes all 12 layers)
MALICIOUS_BOT — dropped at L0 before any computation
```

Live since **March 15, 2026**. Over **206,000+ measurements** collected across 6 chains.

**The Mantle layer adds:** on-chain Turing verdicts — any Mantle DeFi protocol can call `is_legitimate()` before processing a transaction.

---

## Architecture

```
Browser / Agent
│
↓ L0  CPU Jitter Physics     — hrtime() sub-microsecond sampling (cannot be faked)
↓ L1  ML-KEM-768 Channel     — NIST FIPS 203 post-quantum handshake
↓ L2  JA3/JA4 Fingerprint    — TLS fingerprint vs known bot libraries
↓ L3  Behavioral Rhythm      — mouse/event timing analysis
↓ L4  Argon2 Proof-of-Work   — bot tax: 200ms compute cost
↓ L5  Silicon Hash           — session identity chain
↓ L6  Reputation Cache       — LRU history of this fingerprint
↓ L7  Anomaly Detector       — ML deviation from human baseline
↓ L8  Timing Consistency     — jitter variance over time
↓ L9  Network Telemetry      — RTT, revert ratio, sequencer health
↓ L10 Causal Engine          — R²=0.998 predictive model (gas_pressure_velocity)
↓ L11 Silicon DNA Trust      — composite score [0.0 – 1.0]
│
├→ API response: { classification, trust, verdict }
└→ TuringOracle.sol (Mantle Sepolia) — verdict published on-chain every 60s
```

---

## Mantle Integration

### Smart Contract — `TuringOracle.sol`

Deployed on **Mantle Sepolia Testnet**.

```
Entry points:
  update(human_traffic, trust_bps, bot_ratio_bps, mantle_safe, p99_ms)
  is_legitimate() → bool       — any DeFi protocol checks this
  get_state()     → TuringState — full snapshot
  staleness_seconds() → uint256 — data freshness
```

Any Mantle DeFi protocol gets bot protection with one call:
```solidity
ITuringOracle oracle = ITuringOracle(ORACLE_ADDRESS);
require(oracle.is_legitimate(), "Traffic verification failed");
```

### Autonomous Pusher — `mantle-agent/mantle_pusher.js`

Node.js agent. Reads live Silicon DNA state every 60 seconds, publishes verdict to Mantle contract.

---

## Live Proof

| Evidence | Value |
|----------|-------|
| Measurements | 206,000+ RTT samples |
| Live dashboard | https://phoenix-zero.vercel.app |
| Public feed | https://rtt.phoenix-ai.work/api/public-feed |
| MEV war detected | May 31, 2026 — 72.1% revert ratio, 3 min early |
| Causal model accuracy | R²=0.998 (gas_pressure_velocity → market impact) |
| Demo video | https://youtu.be/o-CQfiSfQ4o |

---

## MEV War Case Study — May 31, 2026

```
01:04 UTC  Mantle + Arbitrum RTT starts climbing
01:07 UTC  arb_revert_ratio crosses 15% → is_legitimate(): false
01:09 UTC  arb_revert_ratio = 72.1% (9× normal)
01:15 UTC  Base P99 = 1,144ms (normal: ~80ms)
01:27 UTC  ZKSync fully timed out
```

**Any Mantle protocol reading our oracle stopped processing transactions during this window — saving 100% of gas waste.**

---

## Why This Wins the Turing Test

| Metric | Silicon DNA | Typical Submission |
|--------|-----------|--------------------|
| Classification layers | 12 (physics → ML → chain) | 1-2 |
| Data source | 206K+ real measurements | Mock data |
| MEV war proof | May 31 — documented | N/A |
| Quantum-safe channel | ML-KEM-768 NIST FIPS 203 | N/A |
| On-chain verdict | Mantle Sepolia TuringOracle | N/A |
| Lead time | 27 seconds before peak | N/A |

---

## Components

| Folder | Description |
|--------|-------------|
| `server.js` | Silicon DNA core (12-layer detection pipeline) |
| `probe-worker.mjs` | CPU jitter sampler (L0 physics layer) |
| `dist/` | Live dashboard frontend |
| `mantle-agent/` | **Mantle Turing Test integration** ← this hackathon |
| `casper-agent/` | Casper Agentic Buildathon integration |

---

## Quick Start

```bash
# Clone
git clone https://github.com/kant19801201behax5/silicon-dna-release
cd silicon-dna-release

# Install
npm install

# Run Silicon DNA server
node server.js
# Dashboard: http://localhost:3000

# Run Mantle pusher (separate terminal)
cd mantle-agent
npm install
cp .env.example .env
# Edit .env: add PRIVATE_KEY, CONTRACT_ADDRESS
node mantle_pusher.js
```

---

## Chains Monitored (Real-Time)

| Chain | Metric | Current Status |
|-------|--------|----------------|
| **Mantle** | RTT P99, sequencer health | Live |
| Arbitrum | RTT P99, revert ratio | Live |
| Base | RTT P99, stall detection | Live |
| Optimism | RTT P99 | Live |
| zkSync | RTT P99 | Live |
| Ethereum L1 | gas pressure, blob fees | Live |

---

## Long-Term Vision

1. **Now:** Silicon DNA Turing test for Mantle agents — bot vs human classification
2. **H2 2026:** Pull-oracle — Mantle DeFi protocols verify our signatures on-chain
3. **2027:** Silicon DNA as identity L0 for Mantle's AI agent ecosystem
4. **Beyond:** The standard Turing test layer for every L2

---

## Contact

Aleksandr · Telegram: [@Kentyrk](https://t.me/Kentyrk) · Email: aleksandrkent64@gmail.com

DoraHacks (Mantle): https://dorahacks.io/hackathon/mantle-turing-test/buidl  
DoraHacks (Casper): https://dorahacks.io/buidl/43859
