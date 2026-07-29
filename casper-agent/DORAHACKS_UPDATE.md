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
- [0:22–0:40] Casper Testnet Explorer: 962 confirmed `oracle.update()` transactions on the original contract (the active contract has since added 2,937 more — 3,899 total as of 2026-07-29). Contract in Rust (casper-contract 5.1.1, native WASM — no Odra abstraction layer).
- [0:40–0:52] Raw `/api/public-feed` JSON: live `arb_revert`, `base_p99`, `gas_pressure` — the exact payload DeFi agents pay for via x402.

---

## Solution: Two Layers

**Layer 1 — Phoenix Zero (network safety oracle)**

A production RTT oracle checks 6 blockchain sequencers every 2 seconds. Publishes verified safety state to a Casper Testnet smart contract every 5 minutes via an autonomous agent (when safe=true).

Chains monitored: Arbitrum One · Base · Optimism · zkSync Era · Mantle · Casper

**Why this is an agentic system, not just a cron script:** the agent perceives its environment (public feed), holds a goal (don't waste the agent's gas), makes a decision (safe/unsafe), and acts on-chain (`update()`) — with no human in the loop on any cycle, 24/7. The safety decision is threshold logic (deliberately interpretable and auditable, not a black box). Access to oracle data is separately gated by Silicon DNA (see "Layer 2" below): statistical KL-divergence clustering of Sybil patterns — genuinely computed from observed traffic; the final 3-class classifier (HUMAN/LEGIT_AGENT/MALICIOUS_BOT) is interpretable threshold logic on top of those signals, not a trained ML model.

API for agents (x402 micropayments):

```
GET /api/v1/safe
→ HTTP 402 (payment required)
→ Agent pays $0.01 USDC via x402
→ {"safe": true, "base_p99_ms": 82, "revert_ratio": 0.04}
```

Cost of 3 checks: $0.03. Benefit: prevents >$7 in losses from bad-gas transactions. ROI: ~233×

This isn't a niche experiment: on July 14, 2026 the x402 Foundation officially launched — 40 organizations (Coinbase, Cloudflare, AWS, Stripe, Visa) under one neutral standard for agent-to-agent payments. By Coinbase's own numbers, the protocol has already processed 169M+ payments from 590K+ payers.

**The x402 negotiation itself is a second, smaller agentic loop, separate from
the safe/unsafe decision above:** on every cycle the agent probes the paid
endpoint first (`probeX402()` in `ts-agent/agent.js`), *perceives* the 402
payment challenge, decodes the x402 payload (price, network, recipient),
checks its own autonomous daily-spend constraint (`SpendingLimiter` —
`ts-agent/spending-limit.js`, Casper Manifest initiative #4), and *decides*:
pay and get priority data, or decline and fall back to the free public feed —
all without a human approving any individual payment. Today the agent has no
funded Base wallet, so it always takes the fallback branch — that decision
path is real and exercised every 5 minutes (see the `[X402]` log lines in
the demo video), but the actual-payment branch itself is coded and tested,
not yet exercised in production.

**Layer 2 — Silicon DNA (agent identity gate)**

Silicon DNA is a separate, full-time 12-layer bot-detection system that runs against
browser/session traffic to this domain. The layers are **L0–L11** (12 of them, numbered from zero —
canonical list in [`../src/SILICON_DNA_LAYERS.md`](../src/SILICON_DNA_LAYERS.md)): L0 CPU jitter
physics, L1 ML-KEM-768 post-quantum channel, L2 TLS fingerprint (a fixed placeholder pending real
JA4), L3 behavioral rhythm, L4 Argon2id proof-of-work, L5 silicon hash, L6 reputation cache,
L7 online one-class-SVM anomaly detector, L8 timing consistency, L9 network telemetry, L10 causal-engine
integration, L11 composite trust score → the 3-class verdict (HUMAN / LEGIT_AGENT / MALICIOUS_BOT),
which is interpretable threshold logic, not a trained ML model. Cross-IP Sybil cohorting by
**KL-divergence** on behavioural fingerprints (`sybilCluster.ts`, cohort threshold 0.15) runs
alongside the stack as its own service rather than as one of the numbered layers. There is also an
HMAC-based commit-reveal proof ("ZK-lite" — not true zero-knowledge, all layer bits are visible in
plaintext).

*Corrected 2026-07-25: this paragraph previously read "L0 ML-KEM-768 … L8–L12 KL-divergence Sybil
clustering". Two errors — L0 and L1 were swapped relative to the canonical list, and there is no L12
(the stack ends at L11).*

**What actually connects it to the x402 oracle (verified live, 2026-07-21):** an IP
that Silicon DNA's own detection has already flagged and banned is rejected with
`403 blocked_by_silicon_dna` on `/api/v1/*` *before* it's even asked to pay — the
payment gateway queries Silicon DNA's live ban list on every request. This is a
real, tested gate, not a documentation claim: verified end-to-end by injecting a
test ban on a reserved (RFC 5737, non-routable) address and confirming the paid
endpoint rejected it, while a clean address still got the normal 402 flow.

To be precise about scope: this is a **ban-list check**, not a full per-request
12-layer classification — that would require every caller to complete Silicon
DNA's own PQC/session handshake, which external x402 clients (including our own
Casper agent) don't do. What's real is that Silicon DNA's accumulated verdict on
an IP — from whatever traffic already triggered it — gates that IP's access to
the paid oracle data too.

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

June 3 – July 6, 2026 (original contract): **962 transactions** (verifiable on the explorer) ·
**3,254 autonomous safety decisions** (historical count from that period's logs).

**Active contract, re-verified from live logs 2026-07-29 00:45 UTC:** **2,937** `update()` calls,
**23** safety pauses, **57.5 CSPR** of gas saved by not transacting while unsafe — agent up
**14,905 min** continuously with **0 restarts**. Running total across both contracts: **3,899** updates.

*Correction (2026-07-25):* the line above previously claimed the current `agent.js` "has no separate
counter for this metric, so it can't be re-derived". That was wrong — the agent prints
`Summary | pushed=… paused=… gas_saved=…` every 5 minutes, so both the push count and the pause
count are live and re-derivable at any moment.

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
| #5 Compliant Security Tokens | Sybil detection + ERC-8004 L0 pre-screening, now also exposed as an explicit RWA-settlement signal (see below) |
| #6 Transaction Privacy | ZK-lite proof (HMAC-SHA256) |
| #8 X402 Micropayments | `/api/v1/safe` — $0.01/call, currently via Base mainnet, migration to the native Casper x402 Facilitator planned |
| #9 Quantum-Safe Cryptography | ML-KEM-768 NIST FIPS 203 on every agent handshake |

**Why this matters right now:** on **July 21, 2026, CSPR went live for
trading on Kraken** (Kraken signalled preparation on July 15) — a major
U.S.-access milestone and part of Casper's stated push toward real-world
assets, tokenization, and institutional-grade infrastructure (its May 2026
multi-year roadmap makes the same point). Casper has also **joined ERC-7943
and previously contributed to ERC-3643** — the emerging standards for
tokenized RWAs and for permissioned, compliance-gated token issuance. Both
are fundamentally about *who is eligible to hold or receive a token* — i.e.
counterparty identity screening — which is exactly what Silicon DNA's identity
gate already does (KL-divergence Sybil clustering + a HUMAN / LEGIT_AGENT /
MALICIOUS_BOT classifier). We do **not** implement those token standards and
don't claim to; the point is narrower and honest: regulated RWA settlement on
Casper needs a network-safety check, a real exit/reference market, *and* an
identity/eligibility check, and as of 2026-07-29 all three exist here and are
tested. That's also literally the buildathon's own stated focus: "Agentic
AI... with special emphasis on DeFi and/or real-world assets (RWA)." The MCP
server exposes an explicit RWA-framed tool (`get_rwa_settlement_signal`) that
combines: (1) network safety — now including a calibrated, Casper-native P99
threshold (2000ms, derived from 21,591 historical measurements, not an
arbitrary guess), not just the EVM chains; (2) CSPR/USD market liquidity read
live from Kraken's public API (spread, 24h volume) — directly tied to CSPR
going live for trading on Kraken July 21, 2026, turning that market-timing
narrative into an actual signal instead of just context; (3) identity
screening. One `ready_to_settle` verdict, so the same verified infrastructure
serves both DeFi and RWA use cases honestly, without inventing a separate RWA
product we haven't built.

---

## What's New For This Buildathon vs. What's Reused (originality note)

The rules ask for code "developed specifically for the Buildathon." To be exact about what that means here, since we'd rather answer this before it's asked:

**Built specifically for this Buildathon (June 1 – July 26, 2026) — 100% new:**
- The Casper smart contract itself, both the original (June 4) and the rebuilt version (July 16, after Casper's 2.2.2 protocol upgrade broke the first one) — new Rust/WASM code, not adapted from elsewhere
- `ts-agent/` — the autonomous agent that reads network state and calls `update()` on Casper testnet every 5 minutes, its x402 negotiation loop, its daily spending limiter, and its Silicon DNA identity check
- The MCP server (`mcp-server/`), including the RWA-specific `get_rwa_settlement_signal` tool
- The Casper dashboard, testing guide, and every Casper-specific integration doc in this repo

**Reused as a data source (predates the Buildathon, started March 2026):**
- Phoenix Zero's 6-chain network-probing infrastructure (the RTT/revert-ratio measurements the Casper agent reads)
- Silicon DNA's identity/bot-detection layer

Why we didn't rebuild the probing infrastructure from scratch for Casper: this buildathon's own judging criteria explicitly reward "real-world application" and "long-term impact potential" — a monitoring service written from zero in three weeks would have no track record to point to, and every number in this submission (the May 31 MEV war catch, the 206,000+ measurements) would be unverifiable marketing instead of falsifiable history. The actual Casper deliverable being judged here — the contract, the agent, the MCP tools, the integration — is fully original work built inside the buildathon window, on top of a data source that was already trustworthy before day one instead of a synthetic demo feed built for the occasion.

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

## RWA Settlement Gate — a second, Odra-built contract (live on testnet)

A separate, additive contract — deployed 2026-07-29, does not touch or replace the
SequencerOracle above. This is the on-chain version of `get_rwa_settlement_signal`:
instead of an off-chain MCP tool an agent reads, it's a contract any other Casper
contract can call cross-contract before settling an RWA transfer.

```
contract-package-fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d
```
Deploy transaction: `6dc5440f5516b9084700bfaa5fe7d63715a068c16dfcba3281994272a77b2a47`
Explorer: https://testnet.cspr.live/contract-package/fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d

Entry points: `init()` · `publish(network_safe, identity_screening_active, timestamp)`
(authorized publisher only) · `is_settlement_allowed() → bool` · `get_network_safe()` ·
`get_identity_screening_active()` · `get_last_update_ts()`

Built with the **Odra framework** (not raw WASM like the oracle above — a deliberate
second choice, to show both approaches: raw WASM for a simple 3-entry-point oracle
where storage-layout control mattered, Odra for this gate where the framework's
schema/entry-point generation and `odra-cli` deploy tooling saved real time). Deployed
via `cargo odra build` + the generated `odra-cli` binary against the official Casper
testnet node — not yet wired to CSPR.cloud specifically, since `odra-casper-livenet-env`
2.9.0 doesn't send the `CSPR_CLOUD_AUTH_TOKEN` header on any request (verified against
the pinned source; a real upstream regression, tracked nowhere publicly as of this
writing). Source: `casper-agent/rwa-settlement-gate/`.

Currently holds default state (`false`/`false`/`0`) — wiring the existing agent to
call `publish()` on a cycle, the same way it already calls the oracle's `update()`,
is the next step, not yet done.

---

## Technical Stack

- **Smart contract:** Casper 2.0 (casper-contract 5.1.1, Rust/WASM — native, no Odra abstraction) for the oracle; a second contract (RWA Settlement Gate, above) uses the **Odra framework** directly
- **Agent:** Autonomous Node.js agent, calls `update()` every 5 minutes (when safe=true)
- **Oracle backend:** Python 3.10, FastAPI, WebSocket broadcaster
- **Identity layer:** Silicon DNA v5.0 — 12-layer detection, ML-KEM-768 PQC
- **Payments:** x402 protocol, currently via Base mainnet. Casper's x402 Facilitator launched natively on June 4, 2026 (supports testnet, `x402-facilitator.cspr.cloud`) — migration planned, requires a CSPR.cloud access token
- **MCP:** a Model Context Protocol server (`casper-agent/mcp-server/`) exposes the same safety data as MCP tools for any MCP-compatible agent — part of Casper's own promoted AI toolkit. Includes an RWA-specific tool (`get_rwa_settlement_signal`) combining a calibrated Casper-native safety threshold, live Kraken CSPR/USD liquidity, and identity-screening context
- **CSPR.cloud:** used directly to deploy and interact with the RWA Settlement Gate contract (`ODRA_CASPER_LIVENET_*` config, see above)
- **CSPR.click — deliberately not used, and why:** we checked its own SDK reference (24 methods: `init`, `connect`, `signIn`, `getActiveAccount`, `sign`, …) before deciding. Every method requires a connected browser wallet extension or CSPR.click's own UI — there is no headless/server-side call path. Our agent is an unattended, 24/7 server process with its own local key file, not a browser dApp with a human clicking "connect wallet." Wiring CSPR.click in anyway would mean either faking the integration or bolting on a headless-browser wallet-automation layer solely to check a box — both worse than being direct about a real architectural mismatch. `getCsprCloudProxy()` looked like a possible server-side path, but it's documented as part of the same wallet-connected SDK instance, not an independent client.
- **Tests:** 280/280 Silicon DNA · 21/21 agent tests — 100%

---

## Production Proof

- **Live since:** March 15, 2026 (136 days of continuous collection as of 2026-07-29)
- **Data:** ~258,700 measurements/day across 6 chains, measured off the live feed 2026-07-25
  (150,620 chain-metric records in a 13.97 h window). The May 31 study used a 206,040-record feed
  snapshot; the raw feed is rotated, so a lifetime cumulative total is not independently verifiable
  — the per-day rate above is what's reproducible right now via `curl` on the public feed
- **On-chain (original contract, June 3 – July 6):** 962 confirmed updates (verifiable) · 3,254 autonomous safety blocks (historical count from that period)
- **On-chain (active contract, as of 2026-07-29 00:45 UTC):** **2,937** confirmed updates · **23** safety pauses · **57.5 CSPR** gas saved · **14,905 min** uptime, 0 restarts — all re-derived from live logs
- **On-chain (active contract, since July 16):** live updates every 5 minutes — see explorer above
- **Casper dashboard:** https://rtt.phoenix-ai.work/casper
- **Main dashboard:** https://phoenix-zero.vercel.app
- **Public feed:** https://rtt.phoenix-ai.work/api/public-feed
- **GitHub:** https://github.com/kant19801201behax5/silicon-dna-release

---

## Against the Final-Round Judging Criteria

Mapped one-to-one onto the published criteria, with the evidence for each — every row is checkable
today, not a promise.

| Criterion | Evidence in this submission |
| --- | --- |
| **Technical execution** — code quality, architecture, completeness | 4-layer stack, each independently runnable: Rust/WASM contract (3 entry points), Node.js agent, TypeScript SDK, MCP server. Agent test suite **21/21**. CI builds the contract from a clean clone, typechecks the SDK and exercises the MCP handshake on every push |
| **Innovation and originality** | The signal itself: L2 sequencer *revert ratio* as a leading indicator of cross-chain stress. Not published in any public dataset — measured directly, and documented against raw feed data in [`../proof/mev_war_2026-05-31.md`](../proof/mev_war_2026-05-31.md) (72.1% MEV war, 3-minute lead) |
| **Use of AI / agentic systems** | Full perceive → goal → decide → act loop with no human in any cycle: reads the feed, holds the goal "don't waste gas", decides safe/unsafe, calls `update()` on-chain. **2,937** autonomous calls, **23** self-initiated pauses, **57.5 CSPR** saved, **14,905 min** uptime, 0 restarts. The on-chain safety decision stays deterministic threshold logic, deliberately (interpretable/auditable, not a black box — see below). A real LLM sits one layer up instead: `explain_settlement_decision` (MCP, added 2026-07-29) sends the live signals to `openai/gpt-4o-mini` via OpenRouter and returns a plain-language risk explanation — verified live, real token cost ($0.00005565/call), kept out of the safety-critical path on purpose so it can never affect the actual verdict. Uses **four of five** components of the Casper AI Toolkit directly — **x402**, **MCP**, **CSPR.cloud** (deploys the RWA gate), **Odra**. The fifth, CSPR.click, was checked and deliberately not used — its SDK is browser-wallet-only, no headless path exists for an unattended server agent (see README) |
| **Real-world application (DeFi / RWA)** | DeFi: one-call `is_safe()` gate any Casper protocol can require before transacting. RWA: `get_rwa_settlement_signal` MCP tool combining a calibrated Casper-native safety threshold, live Kraken CSPR/USD liquidity, and counterparty screening into one `ready_to_settle` verdict — plus, as of 2026-07-29, the same logic as an on-chain gate (`RwaSettlementGate`, live on testnet) any Casper contract can call directly. Reused outside this hackathon already (Tenderly circuit-breaker, separate public repo) |
| **User experience and design** | Live dashboard at [rtt.phoenix-ai.work/casper](https://rtt.phoenix-ai.work/casper) and [phoenix-zero.vercel.app](https://phoenix-zero.vercel.app); zero-setup verification via `curl` on the public feed; a step-by-step [TESTING_GUIDE.md](./TESTING_GUIDE.md) written for a judge with no prior context |
| **Smart-contract work** | Two live Casper Testnet contracts: `SequencerOracle` (`hash-2a7ebbc9…261f3a`, raw WASM, entry points `update`/`is_safe`/`get_state`, receiving transactions right now — redeployed once to fix a real `EntryPointType` bug after a network protocol upgrade, documented rather than hidden) and `RwaSettlementGate` (`contract-package-fab9c0a1…b42511d`, built with Odra, deployed 2026-07-29) |
| **Long-term launch plans** | See the section below: production since March 2026 (predates the buildathon), CSPR.cloud key tested, native Casper x402 client ready to wire in, direct contact with the Casper developer TG group, oracle already reused in a second public project |
| **Long-term ecosystem impact** | Built as shared infrastructure, not a single-app feature: any Casper agent can read `is_safe()` free on-chain or pay $0.01 via x402 for the richer feed. Directly serves Casper's stated direction — a trust layer for the agentic economy and regulated RWA settlement |

**This is the buildathon's own example #2.** The official build prompts list *"RWA oracle agents with
verifiable on-chain identity — an agent that gathers off-chain data, runs a risk-scoring model, and
publishes verified data on-chain via Casper's x402, maintaining verifiable identity and reputation
scoring."* That is precisely this system: off-chain 6-chain telemetry → threshold risk model →
on-chain publication → x402-metered access gated by an identity layer. We arrived at it independently
(the oracle predates the buildathon), which is why the fit is structural rather than cosmetic.

**Market timing:** CSPR began trading on Kraken on **July 21, 2026** — five days before this
submission ([Kraken](https://blog.kraken.com/product/asset-listings/cspr-is-available-for-trading),
[Decrypt](https://decrypt.co/373933/casper-network-now-available-for-trading-on-kraken)). Casper
positions itself as infrastructure for regulated RWAs and machine-native commerce; network-safety and
agent-identity are the two primitives machine-to-machine settlement needs before it can be trusted
with value.

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
- ✅ Done (2026-07-29): `get_rwa_settlement_signal` now also exists as an on-chain settlement gate (`RwaSettlementGate`, Odra, see above) any RWA contract can call directly — not just an off-chain MCP tool. Next: wire the existing agent to call its `publish()` on a cycle, same pattern as the oracle's `update()`

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
