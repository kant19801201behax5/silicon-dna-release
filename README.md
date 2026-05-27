# Silicon DNA v5.0 — Binary Release

> **12-layer Physics-Bound Identity Verification + ML-KEM-768 Post-Quantum Cryptography**
> Binary-only distribution for evaluation. Source code is proprietary.

**[Live Dashboard](https://phoenix-zero.vercel.app)** · **[Live API](https://rtt.phoenix-ai.work/api/health)**

---

## What This Is

Silicon DNA is a 12-layer bot and Sybil detection system for blockchain/DeFi protocols.

| Metric | Value |
| ------ | ----- |
| Identity layers | 12 (L0–L11) |
| Test suite | 270/270 tests pass |
| Live bot drop rate | 100% (32,048 requests blocked May 15, 2026) |
| PQC | ML-KEM-768 NIST FIPS 203 (real keygen/encap/decap) |
| PoW | Argon2id t=3 m=65536 |
| RTT Oracle | 5 chains: Arb/OP/Base/ZKSync/Mantle (2-second probe interval) |

---

## Detection Layers

| Layer | Name | Signal |
| ----- | ---- | ------ |
| L0 | CPU Jitter Probe | `Atomics.wait()` thermal noise — VMs produce flat <0.5µs |
| L1 | Digital Frankenstein | 12+ HTTP header cross-validation → TCP DESTROY |
| L2 | SNIPER σ²/R1 | Welford online variance on inter-request timing |
| L3 | Spearman ρ | Timing correlation rank test |
| L4 | Argon2id PoW | WASM proof-of-work forgery detection |
| L5 | ML-KEM-768 Entropy Seal | NIST FIPS 203: per-connection key exchange, ratchets every 50 packets |
| L6 | eBPF Kernel Probe | Linux sys\_execve + tcp\_connect kprobe feed |
| L7 | Sybil Cluster | Coordinated timing graph detection |
| L8 | ERC-8004 L0 Gate | Pre-validation gate for on-chain identity |
| L9 | ZK-lite PoH | Zero-knowledge proof of humanity |
| L10 | Behavioral Entropy | Timing distribution fingerprint |
| L11 | Sequencer Health | Multi-chain RTT gate — blocks during sequencer stalls |

---

## Quick Start

**Requirements:** Node.js >= 20.0.0

```bash
# 1. Install runtime dependencies
npm install --production

# 2. Configure (optional — runs with defaults)
cp .env.example .env
# Edit .env if needed

# 3. Start
node server.js
# or on Windows:
start.bat

# 4. Open dashboard
# http://localhost:3001
```

**API endpoints:**
- `GET /api/health` — operational status (`operational` / `degraded` / `unavailable`)
- `GET /api/silicon-metrics` — live threat scores
- `GET /api/public-feed` — Phoenix Zero RTT data (5-min delayed, no auth)
- `WSS /` — authenticated WebSocket stream

---

## Live Deployment

System is running live on DigitalOcean NYC1 since March 2026:

```
Dashboard:  https://phoenix-zero.vercel.app
API:        https://rtt.phoenix-ai.work/api/public-feed
Health:     https://rtt.phoenix-ai.work/api/health
WSS:        wss://rtt.phoenix-ai.work/ws
```

---

## Source Repositories (Private)

| Repo | Contents |
| ---- | -------- |
| `silicon-dna` | TypeScript source, 270 tests, server.ts |
| `phoenix-zero` | Python RTT Oracle, multi_chain_probe.py |
| `silicon-dna-phoenix-zero` | Merged Docker Compose deployment |

Source available to verified judges on request: [aleksandrkent64@gmail.com](mailto:aleksandrkent64@gmail.com)

---

## Project Fingerprint

```
PROJECT:    Silicon DNA v5.0 x Phoenix Zero Phase 64
DATE:       2026-05-27
TESTS:      270/270  15 suites  100%
DROP_RATE:  1.0 (32,048 live bot requests blocked May 15 2026)
PQC:        ML-KEM-768  NIST FIPS 203  mlkem v2.7.0
POW:        Argon2id  t=3 m=65536 p=4
LAYERS:     12 (L0-L11)
BUILD:      Obfuscated binary (javascript-obfuscator, RC4 string encoding)
```
