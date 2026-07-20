# DoraHacks BUIDL — Casper Agentic Buildathon 2026
# Final text for the BUIDL page

---

## The Problem

Autonomous DeFi agents face two critical shortcomings:

**1 — Network blindness:** During MEV wars, L2 sequencer revert ratios spike sharply from 5-8% to 70%+. An agent sending transactions loses gas on every failed attempt — 7 out of 10 transactions revert without executing.

**2 — No identity verification:** Casper's machine economy needs "the first billion machines" able to transact autonomously. But without identity verification, any malicious bot can make x402 payments, drain liquidity, or manipulate governance — indistinguishable from a legitimate AI agent.

**Real event, May 31, 2026:** Arbitrum's revert ratio hit 72.1% (9x above normal). The Base sequencer stalled at 1,144ms P99. zkSync threw a timeout error. Our oracle detected the MEV war 3 minutes before the acute crash — enough time for any agent to pause and protect its capital.

🎬 **Demo video (52 sec, no audio):** https://youtu.be/KtTrz23B92w

No marketing. No voiceover. Raw screen recording from a working production system.

- [0:00–0:22] Live agent logs: network safe → arb_revert spikes to 16% → agent instantly pauses (🚨 UNSAFE — pausing) → resumes after conditions clear.
- [0:22–0:40] Casper Testnet Explorer: 962 confirmed `oracle.update()` transactions. Contract in Rust (casper-contract 5.1.1, native WASM — no Odra abstraction layer).
- [0:40–0:52] Raw `/api/public-feed` JSON: live `arb_revert`, `base_p99`, `gas_pressure` — the exact payload DeFi agents pay for via x402.

---

## Solution: Two Layers

**Layer 1 — Phoenix Zero (network safety oracle)**

A production RTT oracle checks 6 blockchain sequencers every 2 seconds. Publishes verified safety state to a Casper Testnet smart contract every 5 minutes via an autonomous agent (when safe=true).

Chains monitored: Arbitrum One · Base · Optimism · zkSync Era · Mantle · Casper

**Why this is an agentic system, not just a cron script:** the agent perceives its environment (public feed), holds a goal (don't waste the agent's gas), makes a decision (safe/unsafe), and acts on-chain (`update()`) — with no human in the loop on any cycle, 24/7. The safety decision is threshold logic (deliberately interpretable and auditable, not a black box). Access to oracle data is separately gated by Silicon DNA (L8–L12 below): statistical KL-divergence clustering of Sybil patterns — genuinely trained on data; the final 3-class classifier (HUMAN/LEGIT_AGENT/MALICIOUS_BOT) is interpretable threshold logic on top of those signals, not a trained ML model.

API for agents (x402 micropayments):

```
GET /api/v1/safe
→ HTTP 402 (payment required)
→ Agent pays $0.01 USDC via x402
→ {"safe": true, "base_p99_ms": 82, "revert_ratio": 0.04}
```

Cost of 3 checks: $0.03. Benefit: prevents >$7 in losses from bad-gas transactions. ROI: ~233×

This isn't a niche experiment: on July 14, 2026 the x402 Foundation officially launched — 40 organizations (Coinbase, Cloudflare, AWS, Stripe, Visa) under one neutral standard for agent-to-agent payments. By Coinbase's own numbers, the protocol has already processed 169M+ payments from 590K+ payers.

**Layer 2 — Silicon DNA (agent identity gate)**

Before any DeFi agent can use Phoenix Zero's data via x402, it must pass Silicon DNA's 12-layer check:

- L0: ML-KEM-768 post-quantum channel (NIST FIPS 203)
- L1–L7: CPU jitter physics, Spearman correlation, Argon2id PoW, entropy compaction
- L8–L12: KL-divergence Sybil clustering, threshold-based 3-class agent classifier (interpretable logic, not a trained ML model), HMAC-based commit-reveal proof ("ZK-lite" — not true zero-knowledge, all layer bits are visible in plaintext)

Result: HUMAN / LEGIT_AGENT → gets Oracle data. MALICIOUS_BOT → dropped at L0.

Silicon DNA is the L0 pre-screening gateway for Casper's machine economy: before any machine can transact, it must prove its legitimacy.

---

## Casper Smart Contract (live on testnet)

**Active contract (accepting `update()` right now, every 5 minutes):**
```
hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a
```
Deployed July 16, 2026 — after Casper's protocol upgrade to 2.2.2, the old contract stopped accepting calls (`EntryPointType::Caller` in 2.x resolves named keys in the calling account's context, not the contract's own). Rebuilt with `EntryPointType::Called` plus an added caller check in `update()`.

The contract is written in plain `casper-contract` 5.1.1 (Rust/WASM), with no Odra framework. This is a deliberate choice, not a gap: for a single-purpose oracle (3 entry points, simple state storage), raw WASM gives full control over storage layout and entry-point semantics — which is exactly what made it possible to quickly diagnose and fix the `EntryPointType` bug above. Odra is being considered for future, more complex contracts (see long-term plans).

**Original contract (historical proof, 962 real transactions):**
```
hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d
```
Deployed June 4, 2026, ran until July 6, 2026.

Entry points:
- `update(safe, arb_p99_ms, arb_revert_bps, base_p99_ms, base_revert_bps, timestamp)` — agent submits Oracle state every 5 minutes (when safe=true)
- `is_safe() → bool` — any Casper DeFi agent checks this before transacting
- `get_state() → JSON` — full Oracle snapshot

June 3 – July 6, 2026 (original contract): **962 transactions** (verifiable on the explorer) · **3,254 autonomous safety decisions** (⚠️ historical count from that period's logs; the current `agent.js` has no separate counter for this metric, so it can't be re-derived from the current system)

**Sample testnet transactions:**

| TX Hash | Description |
|---------|----------|
| `2578359cc8ffcdac8316d6002d3aabed26888c102c8d69a2ccd3239f3fcd3326` | Contract deploy (June 4, 2026) |
| `4774fdbc61b42e683024a059be624279a2b06a13a654bcebfe1065492b7652f1` | First update() call from the agent |
| `d841a0c19cd29cfead1f6d834c13ec1325f6ccf7c9030a91a9595ec4aca47a7a` | Manual test transaction |

All transactions: https://testnet.cspr.live/account/0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb

---

## Casper Manifest Alignment (May 2026) — 6 of 9 initiatives

| Initiative | Our Implementation |
|---|---|
| #1 EVM Compatibility | Monitoring 5 EVM chains (Arb, Base, OP, ZK, Mantle) |
| #4 Smart Accounts for Agents | Daily spending cap on x402 payments (`ts-agent/spending-limit.js`) — the agent can't spend more than a set limit per day on any payment rail, checked before a payment is attempted |
| #5 Compliant Security Tokens | Sybil detection + ERC-8004 L0 pre-screening |
| #6 Transaction Privacy | ZK-lite proof (HMAC-SHA256) |
| #8 X402 Micropayments | `/api/v1/safe` — $0.01/call, currently via Base mainnet, migration to the native Casper x402 Facilitator planned |
| #9 Quantum-Safe Cryptography | ML-KEM-768 NIST FIPS 203 on every agent handshake |

---

## How It Works

```
Phoenix Zero (DO NYC1, live since March 2026)
│  Probes 6 chains every 2s — RTT, revert ratio, stall detection
↓
autonomous agent (Node.js, runs 24/7)
↓
Casper Testnet Smart Contract
│  update() called every 5 min when safe=true
↓
Any Casper DeFi Agent:
   oracle.is_safe() → true/false before every transaction
```

---

## Technical Stack

- **Smart contract:** Casper 2.0 (casper-contract 5.1.1, Rust/WASM — native, no Odra abstraction)
- **Agent:** Autonomous Node.js agent, calls `update()` every 5 minutes (when safe=true)
- **Oracle backend:** Python 3.10, FastAPI, WebSocket broadcaster
- **Identity layer:** Silicon DNA v5.0 — 12-layer detection, ML-KEM-768 PQC
- **Payments:** x402 protocol, currently via Base mainnet. Casper's x402 Facilitator launched natively on June 4, 2026 (supports testnet, `x402-facilitator.cspr.cloud`) — migration planned, requires a CSPR.cloud access token
- **Tests:** 280/280 Silicon DNA · 21/21 agent tests — 100%

---

## Production Proof

- **Live since:** March 15, 2026
- **Data:** 206,000+ RTT measurements
- **On-chain (original contract, June 3 – July 6):** 962 confirmed updates (verifiable) · 3,254 autonomous safety blocks (⚠️ historical count, not re-derived from the current system)
- **On-chain (active contract, since July 16):** live updates every 5 minutes — see explorer above
- **Casper dashboard:** https://rtt.phoenix-ai.work/casper
- **Main dashboard:** https://phoenix-zero.vercel.app
- **Public feed:** https://rtt.phoenix-ai.work/api/public-feed
- **GitHub:** https://github.com/kant19801201behax5/silicon-dna-release

---

## Long-Term Launch Plans

**Already in motion, not a hypothesis:**
- The 6-chain oracle has run in production since March 2026 — this isn't a hackathon prototype, it's live infrastructure that the hackathon extended onto Casper
- A working CSPR.cloud API key has been found and confirmed (tested directly against the facilitator), and a client module for native Casper x402 payments is ready — neither is wired into production yet, deliberately, to avoid risking a working payment service. The next concrete step after the buildathon: wire it in on the server side that accepts payment for `/api/v1/safe`
- We maintain direct contact with the Casper team (developer TG group) — have already received and promptly resolved two independent messages about issues with the qualification-round submission
- The same oracle has already been reused outside this hackathon: [phoenix-tenderly-circuit-breaker](https://github.com/kant19801201behax5/phoenix-tenderly-circuit-breaker) — a public, separate project, a Tenderly Web3 Action that automatically pauses any `Pausable` contract (Base, Arbitrum, Optimism, zkSync) 27 seconds before network overload, using the same `/api/v1/safe` signal. This isn't a hypothetical plan — it's already-written, published code

**Next 1–3 months:**
- Migrate `/api/v1/safe` payments from Base mainnet to native Casper x402 (Manifest initiative #8)
- Expand the set of monitored sequencer chains beyond the current 6, as Casper DeFi agents request it
- Consider Odra for new, more complex contracts (the current oracle deliberately stays on plain WASM — see above)

**Beyond that:** the oracle is designed as reusable infrastructure — not just for our own agent, but as a public safety service for any agent on Casper willing to pay $0.01 for a pre-transaction check.

---

## How to Test (step by step)

**1. Verify the active contract on Casper Testnet Explorer:**
https://testnet.cspr.live/contract/hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a

You'll see entry points: `update`, `is_safe`, `get_state`

**2. Verify the agent's transactions (both contracts, same wallet):**
https://testnet.cspr.live/account/0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb

**3. Read live data (no auth required):**
```bash
curl https://rtt.phoenix-ai.work/api/public-feed
```

**4. Casper dashboard (updates every 30s):**
https://rtt.phoenix-ai.work/casper

**5. Run the tests:**
```bash
git clone https://github.com/kant19801201behax5/silicon-dna-release
cd silicon-dna-release/casper-agent/ts-agent
npm install && npm test
# Expected: 21 passing
```

Full guide: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
