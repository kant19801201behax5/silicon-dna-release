# Silicon DNA — Physical-Layer Identity Verification for Web3

> **Arbitrum Open House Singapore 2026** · **ETHOnline 2026** · **Casper Agentic Buildathon 2026**
>
> Academic paper: [IACR ePrint 2026/111419](https://eprint.iacr.org/2026/111419) · [Zenodo DOI 10.5281/zenodo.22239862](https://doi.org/10.5281/zenodo.22239862)
>
> Security hardening summary: [`HARDENING_REPORT.md`](HARDENING_REPORT.md) — P0.1-P2.8 complete, 581 tests across 29 files

---

## What This Is

A production identity-verification and network-intelligence system that combines physical-layer bot detection with real-time cross-chain monitoring. Two layers, one stack:

**Layer 1 — Phoenix Zero (Cross-Chain RTT Oracle):** Probes 12 blockchain sequencers every 2 seconds, measuring RTT, revert ratios, stall flags, gas pressure, and blob fees. Publishes verified safety state to on-chain oracle contracts. Live since March 15, 2026.

**Layer 2 — Silicon DNA (9-Gate Bot Detection):** A cascade of independent physical-layer checks — any one of which can ban an IP on its own. Not a single pipeline producing one score, but a defense-in-depth system where CPU jitter physics, post-quantum cryptography, proof-of-work, and behavioral analysis each act independently.

**The core discovery:** transaction revert ratios on Arbitrum (`arb_revert_ratio`) are a causal leading indicator of cross-chain stress events — MEV wars, sequencer stalls, gas spikes. Documented against a 206,040-record production feed snapshot.

**Proven:** May 31, 2026 — detected a 72.1% MEV war **3 minutes before the acute stall** on Arbitrum and Base.

---

## Core Technology

### 9-Gate Bot Detection (Silicon DNA)

| Gate | Technology | What It Detects |
|------|-----------|-----------------|
| L0 | CPU jitter physics (`probe-worker.js`) | Real hardware thermal noise vs. VM/sandbox flat signals |
| L1 | ML-KEM-768 post-quantum channel (NIST FIPS 203) | Clients that cannot complete a real PQC handshake |
| L2 | TLS JA4 fingerprint (`tlsFingerprint.ts`) | Browser/client identity via ClientHello analysis |
| L3 | Frankenstein UA/header consistency | Mismatched User-Agent vs. actual platform capabilities |
| L4 | Argon2id proof-of-work | ASIC spoofing, slow-time replay, GPU/UA inconsistency, WebDriver artifacts |
| L5 | Synthetic-rhythm detector | Automated scripts with unnaturally regular timing |
| L6 | Host telemetry gate (userspace sensor) | Process exec / TCP connect / RTT anomalies via `/proc` |
| L7 | Spearman stall detector | Static-script correlation patterns |
| L8 | Network telemetry gate | Cross-chain tension and latency anomalies |

**Additional systems:** 3-class classifier (HUMAN / LEGIT_AGENT / MALICIOUS_BOT), Golden Seal timing-rhythm protocol, EIP-191 wallet-to-fingerprint binding with KL-divergence Sybil clustering, Trust Engine fusion layer (OPA/SPIFFE-inspired graduated ALLOW/STEP_UP/SHADOW_LIMIT/DENY decisions), Privacy Pass anonymous tokens (RFC 9497 OPRF), drift-adaptive anomaly calibration (P2 quantile + Page-Hinkley change detection).

Full technical breakdown with code citations: [`src/SILICON_DNA_LAYERS.md`](src/SILICON_DNA_LAYERS.md)

### 12-Chain RTT Oracle (Phoenix Zero)

Monitors sequencer health across 12 chains every 2 seconds:

| Chain | Type |
|-------|------|
| Arbitrum One | EVM L2 |
| Base | EVM L2 |
| Optimism | EVM L2 |
| zkSync Era | EVM L2 |
| Scroll | EVM L2 |
| Blast | EVM L2 |
| Linea | EVM L2 |
| Mode | EVM L2 |
| Polygon zkEVM | EVM L2 |
| Taiko | EVM L2 |
| Mantle | EVM L2 |
| Casper | Non-EVM L1 |

Each probe calls `eth_blockNumber` / `eth_gasPrice` / `debug_traceBlock` (EVM) or `info_get_status` (Casper) and computes RTT P99, revert ratio, stall flags, and tension scores.

### Post-Quantum Cryptography

- **ML-KEM-768** (NIST FIPS 203): Post-quantum key encapsulation on every agent handshake
- **ML-DSA-65** (NIST FIPS 204 / Dilithium3): Post-quantum agent identity signatures
- Per-connection PQC sessions (no IP-based session collision behind proxies)

### eBPF/XDP Kernel Enforcement (Production)

- **XDP Threat Shield:** Drops banned IPs at the NIC driver level (~5-20us latency)
- **LSM Agent Guard:** Kernel sandbox restricting AI agent file/network/process access
- Requires Linux kernel >= 5.7 with `CONFIG_BPF_LSM=y`, `CONFIG_XDP_SOCKETS=y`

### Privacy Pass (RFC 9497)

OPRF(P-384, SHA-384) anonymous tokens — solve one Argon2 PoW, get a batch of blinded one-time tokens. Unforgeable, unlinkable, one-time. Pinned to official RFC 9497 test vectors.

### x402 Micropayments

```
GET https://rtt.phoenix-ai.work/api/v1/safe
--> HTTP 402 (payment required)
--> Agent pays $0.01 USDC via x402
--> {"safe": true, "base_p99_ms": 82, "revert_ratio": 0.04}
```

Currently settled on Base mainnet. First revenue: $0.02 USDC (September 1, 2026). 7 x402 endpoints, 2 verified settlements on Base.

---

## Architecture

```
Phoenix Zero (DigitalOcean NYC1, live since March 2026)
|
|  Probes 12 chains every 2 seconds:
|    eth_blockNumber / eth_gasPrice / debug_traceBlock (EVM)
|    info_get_status (Casper)
|    Measures: RTT P99, revert ratio, stall flags, blob fees, tension
|
v  /api/public-feed  (public JSON, no auth)
|
|  Silicon DNA (per-visitor bot-detection cascade, separate data path)
|    9 independent gates — any one bans on its own
|    3-class classifier, Golden Seal, wallet-Sybil binding
|    Trust Engine fusion layer (graduated ALLOW/DENY)
|    Privacy Pass anonymous tokens (RFC 9497)
|    Post-quantum: ML-KEM-768 channel + ML-DSA-65 signatures
|
v  On-chain oracle contracts
|    Casper Testnet: SequencerOracle (every 5 min)
|    Casper Testnet: RwaSettlementGate (every 15 min)
|
v  Any DeFi agent:
     oracle.is_safe() --> true / false
     oracle.get_state() --> full metrics snapshot
```

---

## Cross-Chain Intelligence: arb_revert_ratio

The key discovery: Arbitrum transaction revert ratios are a **causal leading indicator** of cross-chain stress:

```
arb_revert_ratio = (reverted_txns / total_txns) per 2s window

Normal:    0.04-0.08  (4-8%)
Warning:   > 0.15     (15%) --> safe=false published to oracle
MEV war:   0.72       (72%) -- May 31 event
```

**Why this is valuable:**
- MEV bots start sandwiching transactions --> revert ratio rises
- This happens **before** gas prices spike (which is what everyone else watches)
- Lead time is actionable: 3 minutes on the May 31 event documented in [`proof/`](proof/mev_war_2026-05-31.md), 27 seconds on the May 17 Base event
- This is the data signal that institutional MEV searchers know about but do not publish

---

## MEV War Case Study — May 31, 2026

```
01:04 UTC  Phoenix Zero: Arbitrum RTT climbing, arb_revert = 12%
01:07 UTC  arb_revert_ratio > 15% --> oracle publishes safe=false
01:09 UTC  arb_revert_ratio = 72.1% (9x normal)
01:15 UTC  Base P99 = 1,144ms (normal: ~80ms)
01:27 UTC  ZKSync fully timed out
```

**Any DeFi agent reading the oracle stopped submitting transactions at 01:07 — 8 minutes before the cascade hit other chains.**

Full analysis with raw data: [`proof/mev_war_2026-05-31.md`](proof/mev_war_2026-05-31.md)

---

## Data — Live Measurements Since March 15, 2026

| Metric | Value |
|--------|-------|
| Production since | **March 15, 2026** (DigitalOcean NYC1) |
| Chains monitored | **12** (Arbitrum, Base, Optimism, zkSync, Scroll, Blast, Linea, Mode, Polygon zkEVM, Taiko, Mantle, Casper) |
| Current throughput | **~258,700 measurements/day** (measured 2026-07-25) |
| Analysis dataset | **206,040** feed records (May 31 MEV-war study) |
| Documented lead time | **3 minutes** (May 31, 2026 — 72.1% MEV war) |
| Secondary lead time | **27 seconds** (May 17, 2026 — RTT spike to Base revert threshold) |
| Production services | **10** (systemd-managed on DO droplet) |
| Test suite | **581 tests** across 29 files |

---

## Casper Integration (Primary On-Chain)

**Active contract (live, receiving `update()` calls every 5 min):**

| Item | Value |
|------|-------|
| Contract hash | [`hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a`](https://testnet.cspr.live/contract/hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a) |
| Deployed | July 16, 2026 |
| Deployer wallet | [`0202494268f6507...`](https://testnet.cspr.live/account/0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb) |
| Casper dashboard | https://rtt.phoenix-ai.work/casper |
| On-chain updates | **12,302** total (`update()` calls across both contracts) |
| Safety pauses | **170** autonomous pauses, **425 CSPR** gas saved |
| Uptime | **57,808 min** continuously, 0 restarts |
| Testing guide | [casper-agent/TESTING_GUIDE.md](casper-agent/TESTING_GUIDE.md) |

**Original deployment (historical proof, 962 real on-chain `update()` calls over 33 days):**

| Item | Value |
|------|-------|
| Contract hash | [`hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d`](https://testnet.cspr.live/contract/hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d) |
| Deploy TX | [`2578359cc8ffcdac8316d6002d3aabed26888c102c8d69a2ccd3239f3fcd3326`](https://testnet.cspr.live/deploy/2578359cc8ffcdac8316d6002d3aabed26888c102c8d69a2ccd3239f3fcd3326) |
| On-chain updates | 962 transactions, June 3 - July 6, 2026 |

**RWA Settlement Gate** (second contract, Odra framework, live since 2026-07-29):
```
contract-package-fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d
```
Entry points: `init()` / `publish()` / `is_settlement_allowed()` / `get_network_safe()` / `get_identity_screening_active()`

Note: the SequencerOracle contract used `EntryPointType::Caller` initially, which under Casper 2.x resolves named keys in the initiating account's context. After a network protocol upgrade, calls began reverting. The active contract fixes this with `EntryPointType::Called` and adds caller-authorization on `update()`.

---

## Technical Stack

| Component | Technology | Location |
|-----------|-----------|----------|
| Core server (production) | Node.js / TypeScript, compiled binary | `server.js` (obfuscated) |
| CPU jitter probe | Node.js `hrtime()` with real micro-workload | `probe-worker.js` |
| XDP Threat Shield | eBPF/XDP, BPF C, Python loader | prod: `/opt/silicon-dna/ebpf/` |
| LSM Agent Guard | BPF LSM, Python loader | prod: `/opt/silicon-dna/ebpf/` |
| L6 userspace sensor | Python, stdlib `/proc` reader | `phoenix_userspace_sensor.py` |
| ZK-lite health proof | HMAC-SHA256 commitment | `/api/health-proof` |
| Dashboard | React + Vite | `dist/` |
| Casper oracle contract | Rust, casper-contract 5.1.1 (native WASM) | `casper-agent/oracle-contract/` |
| RWA Settlement Gate | Rust, Odra framework | `casper-agent/rwa-settlement-gate/` |
| Casper agent | Node.js autonomous agent | `casper-agent/ts-agent/` |
| MCP server | Model Context Protocol | `casper-agent/mcp-server/` |
| TypeScript SDK | Client library | `casper-agent/sdk-typescript/` |

**Key dependencies:** `mlkem` (ML-KEM-768), `@noble/post-quantum` (ML-DSA-65), `@noble/curves` (secp256k1, P-384), `hash-wasm` (Argon2id), `express`, `ws`, `lru-cache`

---

## Business Potential

**Who pays for this data:**
- MEV searchers: $200-500/mo for real-time revert ratio feeds
- DeFi protocols: pay-per-call via x402 ($0.01/verification)
- Hedge funds: historical dataset for backtesting ($500-2000/dataset)
- RWA settlement platforms: network-safety + identity screening as a service

**x402 monetization (live):**
1. 7 x402-gated endpoints on Base mainnet
2. First revenue: $0.02 USDC (September 1, 2026)
3. 2 verified on-chain settlements
4. x402 Foundation launched July 14, 2026 — 40 organizations (Coinbase, Cloudflare, AWS, Stripe, Visa)
5. Native Casper x402 payer scaffolded in `casper-agent/casper-x402/`

**Go-to-market:**
1. Now: API access for trading firms needing sequencer intelligence
2. H2 2026: Expand x402 micropayments across chains
3. 2027: Pull-oracle — protocols verify signatures on-chain without a push agent

---

## Quick Start

**Requirements:** Node.js >= 20.0.0

```bash
# 1. Install dependencies
npm install --production

# 2. Configure (optional -- runs with defaults)
cp .env.example .env

# 3. Start the server (pre-compiled binary)
npm start
# --> Silicon DNA [L0_CORE] Active --> http://localhost:3000
```

> **Note:** This is a binary release. The core server (`server.js`) is a compiled, obfuscated bundle. Source code is proprietary — available to verified judges on request.

**Casper agent:** see [casper-agent/README.md](casper-agent/README.md) — `cd casper-agent/ts-agent && npm install && npm test`

**Read the live public feed (no setup needed):**
```bash
curl https://rtt.phoenix-ai.work/api/public-feed
```

---

## Live Proof

| Resource | URL |
|----------|-----|
| Main dashboard | https://rtt.phoenix-ai.work |
| Health endpoint | https://rtt.phoenix-ai.work/api/health |
| Public feed | https://rtt.phoenix-ai.work/api/public-feed |
| Casper dashboard | https://rtt.phoenix-ai.work/casper |
| SequencerOracle (Casper Testnet) | [hash-2a7ebbc9...261f3a](https://testnet.cspr.live/contract/hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a) |
| RwaSettlementGate (Casper Testnet) | [contract-package-fab9c0a1...b42511d](https://testnet.cspr.live/contract-package/fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d) |
| Demo video (Casper) | https://youtu.be/KtTrz23B92w |
| GitHub | https://github.com/kant19801201behax5/silicon-dna-release |
| DoraHacks (Casper) | https://dorahacks.io/buidl/43859 |

---

## Academic Publication

- **IACR ePrint:** [2026/111419](https://eprint.iacr.org/2026/111419)
- **Zenodo:** [DOI 10.5281/zenodo.22239862](https://doi.org/10.5281/zenodo.22239862)

The paper documents the physical-layer NIC fingerprinting methodology and 12-chain correlation analysis (R_xy) that underpins Silicon DNA's identity verification.

---

## Contact

Aleksandr · Telegram: [@Kentyrk](https://t.me/Kentyrk) · Email: aleksandrkent64@gmail.com
