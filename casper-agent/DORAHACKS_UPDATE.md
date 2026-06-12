# Phoenix Zero × Silicon DNA — DoraHacks BUIDL Update
# Casper Agentic Buildathon 2026

---

## Vision (256 chars)
Sequencer stalls kill DeFi agents. Malicious bots drain x402 budgets. Phoenix Zero monitors 6 chains every 2s — agents pay $0.001 via x402, get safe:true/false. Silicon DNA verifies agent identity before any payment. Live since March 2026. 206K+ datapoints. Contract on Casper Testnet.

---

## Updated Project Description

### The Dual Problem

**Problem 1 — Network blindness:**
Autonomous DeFi agents operating on Casper cannot see sequencer congestion before it hits. During MEV wars, revert ratios spike from 5% to 72%. An agent submitting transactions during such events burns gas on every failed attempt.

**Problem 2 — Identity vacuum:**
In Casper's machine economy (Casper Manifest, May 2026), "the first billion machines" need payment rails without humans. But without identity verification, any malicious bot can make x402 payments, drain liquidity pools, or manipulate governance — indistinguishable from a legitimate AI agent.

**Real event, May 31, 2026:** Arbitrum revert ratio hit 72.1% (9× above normal). Our oracle detected the MEV war 3 minutes before the acute stall. Any agent reading our Casper contract would have paused — saving gas and protecting capital.

---

### The Solution: Two Layers

**Layer 1 — Phoenix Zero (Network Oracle)**
Real-time sequencer health oracle. Probes 6 chains every 2 seconds. Publishes `{safe: bool, arb_revert_bps, base_p99_ms, timestamp}` to Casper Testnet smart contract every 60 seconds via autonomous agent.

Any Casper DeFi agent queries: `is_safe()` → true/false. One call. Paid via x402.

**Layer 2 — Silicon DNA (Agent Identity)**
12-layer bot and agent verification system. Before a DeFi agent makes any x402 payment on Casper, Silicon DNA attests:
- CPU jitter physics (cannot be faked by VMs)
- ML-KEM-768 post-quantum channel (Casper Manifest Initiative #9)
- ZK-lite proof: "this agent passed all 12 verification layers"
- 3-class classification: HUMAN / LEGIT_AGENT / MALICIOUS_BOT

Result: only legitimate agents get oracle data. Malicious bots are dropped at L0.

---

### Alignment with Casper Manifest (May 2026)

| Casper Initiative | Our Implementation |
|---|---|
| #8 X402 Micropayments | Phoenix Zero `/api/v1/safe` — $0.001/call via x402 |
| #9 Quantum-Safe Cryptography | ML-KEM-768 (NIST FIPS 203) in Silicon DNA L0 |
| #5 Compliant Security Tokens | Silicon DNA Sybil detection + ERC-8004 L0 gate |
| #3 Smart Accounts for Agents | LEGIT_AGENT vs MALICIOUS_BOT classifier |

---

### Live Proof

**Oracle on Casper Testnet:**
- Contract: `hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d`
- Agent calls `update()` every 60 seconds — **962 transactions** since June 3, 2026
- Safety gate blocked **3,254 unsafe executions** (arb_revert > 15%) — autonomous decision-making in action
- Wallet: `0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb`

**Network monitoring (live since March 2026):**
- 206,000+ RTT measurements
- Dashboard: https://phoenix-zero.vercel.app
- Public feed: https://rtt.phoenix-ai.work/api/public-feed

**MEV war case study — May 31, 2026:**
- Arbitrum revert ratio: 72.1% (normal: 5-8%)
- Base P99 latency: 1,144ms (normal: ~80ms)
- Oracle detected 3 minutes before peak
- Any Casper agent reading our contract would have saved 100% of gas during this window

---

### Technical Stack

- **Smart contract:** Casper 2.0 (casper-contract 5.1.1, Rust WASM)
- **Agent:** Node.js, autonomous, calls contract update() every 60s
- **Oracle backend:** Python 3.10, FastAPI, DigitalOcean NYC1
- **Identity layer:** TypeScript/Node.js, 12-layer detection pipeline
- **Payments:** x402 protocol (Base Sepolia testnet → Casper native when launched)
- **Tests:** 15/15 passing (oracle safety logic, parsing, threshold calibration)

---

### Why This Wins

Most hackathon agents answer: "What should I do?"
We answer: "Can I safely do it, and am I who I claim to be?"

Every DeFi agent on Casper needs both answers before every transaction.
We are the infrastructure that provides them.

---

### Long-Term Vision

1. **Now:** Oracle + agent identity on Casper Testnet
2. **H2 2026:** Native Casper x402 integration (when Casper ships it)
3. **2027:** Pull-oracle (EIP-3668) — DeFi protocols verify our signatures on-chain
4. **Beyond:** Silicon DNA as the L0 identity gate for Casper's machine economy — before any machine can transact, it proves it's legitimate

**BOT Chain integration** (parallel track): adding as 7th monitored chain — same oracle, same identity layer, expanding to Asia DeFi ecosystem.

---

### GitHub
https://github.com/kant19801201behax5/silicon-dna-release

### Demo Video
https://youtu.be/o-CQfiSfQ4o

### Live Dashboard
https://phoenix-zero.vercel.app
