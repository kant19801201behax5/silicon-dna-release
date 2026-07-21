# Phoenix Zero × Silicon DNA — Casper Sequencer Health Oracle

> **Casper Agentic Buildathon 2026** submission
> Track: On-chain AI services and infrastructure

---

## What This Is

An autonomous agent that monitors 6 blockchain sequencers in real time and publishes verified safety data to a **Casper Testnet smart contract** — so any DeFi agent on Casper can check "is it safe to transact right now?" with a single on-chain call.

**Live data since:** March 15, 2026
**Chains monitored:** Arbitrum, Base, Optimism, zkSync, Mantle, Casper
**Measurements collected:** 206,000+
**Proven:** MEV war May 31, 2026 — 72.1% revert ratio detected 3 minutes early

---

## Architecture

```
Phoenix Zero (DO NYC1)
│  Probes 6 chains every 2s via eth_blockNumber / info_get_status
│  Measures: RTT P99, revert ratio, stall detection
│
↓ https://rtt.phoenix-ai.work/api/public-feed  (public, no auth)
│
│  [
│    { "chain": "arbitrum", "p99_ms": 45, "revert_ratio": 0.04, "stall": false, "tension": 0.085 },
│    { "chain": "mantle",   "p99_ms": 62, "revert_ratio": 0.02, "stall": false, "tension": 0.041 },
│    ...
│  ]
│
↓ ts-agent/agent.js  (Node.js autonomous agent, checks every 5 min, pushes when safe)
│
│  Computes:
│    safe = server_safe AND arb_revert < 15% AND base_p99 < 500ms
│
↓ Casper Testnet — SequencerOracle contract
   update(safe, arb_p99_ms, base_p99_ms, arb_revert_bps, base_revert_bps, timestamp)

Any Casper DeFi agent:
   oracle.is_safe()  →  true / false
   oracle.get_state()  →  full metrics snapshot (JSON string)
```

---

## Components

### 1. Casper Smart Contract (`oracle-contract/`)

Raw `casper-contract` 5.1.1 (Rust/WASM) — no Odra abstraction layer.

```
Entry points:
  call()                     — deploy, records deployer as authorized caller
  update(safe, arb_p99_ms, base_p99_ms,
         arb_revert_bps, base_revert_bps, timestamp)
                              — authorized caller only, pushes new state
  is_safe() → bool           — any agent reads this
  get_state() → String       — full snapshot as JSON
```

`update()` checks the caller against the account that deployed the contract (added after the June deployment — see [DORAHACKS_UPDATE.md](./DORAHACKS_UPDATE.md) for why).

### 2. Agent (`ts-agent/agent.js`)

Node.js autonomous agent — the one actually running in production (`systemd` unit `casper-agent.service`). Reads the public feed, decides safe/unsafe, calls `update()` via `call_contract.js`.

```bash
cd ts-agent
npm install
cp .env.example .env
# fill in CASPER_SECRET_KEY_PATH, CONTRACT_HASH
npm start
```

A Python implementation (`pusher/casper_oracle_pusher.py`) also exists in this repo with equivalent logic, but it is not the one deployed — the Node.js agent above is.

### 3. MCP Server (`mcp-server/`)

Exposes the same live safety data as [Model Context Protocol](https://modelcontextprotocol.io)
tools (`get_sequencer_safety`, `get_oracle_state`) — part of the AI toolkit
Casper itself promotes (https://www.casper.network/ai). Lets any MCP-compatible
agent (Claude Desktop, etc.) query network safety without touching this
project's REST API directly.

```bash
cd mcp-server
npm install
node index.js
```

See [mcp-server/README.md](./mcp-server/README.md) for the Claude Desktop config and what was verified.

---

## x402 Integration

Agents that want oracle data pay **$0.01 USDC** via x402:

```
GET https://rtt.phoenix-ai.work/api/v1/safe
→ HTTP 402
→ Agent pays $0.01 via x402
→ { "safe": true, "p99_ms": 45, "revert_ratio": 0.04 }
```

Currently settled on Base mainnet. Casper's own x402 Facilitator (`x402-facilitator.cspr.cloud`) launched natively on June 4, 2026 and supports testnet — migration is planned (see `ts-agent/x402-casper-pay.js`, prepared but not yet wired in).

---

## Live Proof

- Dashboard: https://phoenix-zero.vercel.app
- Public feed: https://rtt.phoenix-ai.work/api/public-feed
- Demo video: https://youtu.be/o-CQfiSfQ4o (general Phoenix Zero walkthrough)
- Demo video (Casper-specific, 52s, unnarrated screen capture): https://youtu.be/KtTrz23B92w
- DoraHacks: https://dorahacks.io/buidl/43859

---

## MEV War Case Study — May 31, 2026

```
01:04 UTC  Phoenix Zero detects Arbitrum RTT climbing
01:07 UTC  arb_revert_ratio crosses 15% threshold → safe: false published on Casper
01:09 UTC  arb_revert_ratio = 72.1% (9× above normal)
01:15 UTC  Base P99 = 1,144ms (normal: ~80ms)
01:27 UTC  ZKSync fully timed out
```

**Any DeFi agent reading our Casper oracle avoided 72% gas waste during this window.**

---

## Setup

### Deploy Contract to Casper Testnet

```bash
# 1. Install Rust nightly + wasm32 target + rust-src (needed for -Z build-std)
rustup toolchain install nightly --profile minimal
rustup target add wasm32-unknown-unknown --toolchain nightly
rustup component add rust-src --toolchain nightly

# 2. Get testnet CSPR (one-time 5000 CSPR grant per account)
# Faucet: https://testnet.cspr.live/tools/faucet

# 3. Build — must target pure MVP wasm (this network's execution engine
#    rejects the bulk-memory / sign-ext ops modern LLVM emits by default)
cd oracle-contract
RUSTFLAGS="-C link-arg=--import-undefined -C target-cpu=mvp" \
  cargo +nightly build -Z build-std=core,alloc --release --target wasm32-unknown-unknown

# 4. Deploy (see ts-agent/deploy_contract.js) and copy the resulting
#    contract hash into ts-agent/.env as CONTRACT_HASH
```

⚠️ **Known build gap:** `Cargo.toml` currently has `[patch.crates-io] casper-contract
= { path = "/opt/casper-oracle/casper-contract-patched" }` — an absolute path on
the production server, not included in this repo. A fresh `cargo build` from a
clean clone will fail on this line as-is. `casper-contract 5.1.1` is published
normally on crates.io, so removing that `[patch.crates-io]` block should let a
fresh clone build, but this hasn't been verified end-to-end against a clean
checkout. Until it is, treat the deployed, on-chain contract (hash below, live
and independently verifiable via the testnet explorer) as the source of truth
rather than rebuilding from source.

### Run the Agent

```bash
cd ts-agent
npm install
cp .env.example .env
# Edit .env: CASPER_SECRET_KEY_PATH, CONTRACT_HASH
npm start
```

---

## Contact

Aleksandr · Telegram: [@Kentyrk](https://t.me/Kentyrk) · Email: aleksandrkent64@gmail.com
DoraHacks: [buidl/43859](https://dorahacks.io/buidl/43859)
