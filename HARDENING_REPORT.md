# Hardening Report — what was closed, and how much it improved

Date: **2026-08-17**. Result: the hardening roadmap **P0.1 → P2.8 is fully complete**; the full suite is **371 tests** green (including 2 official cryptographic known-answer tests: RFC 9497 and NIST FIPS 204), `tsc` clean, everything deployed and verified live in production (`rtt.phoenix-ai.work`, behind Cloudflare).

The "how much improved" column is honest — where something was fake / dead / broken, it says so.

Related: [`src/SILICON_DNA_LAYERS.md`](src/SILICON_DNA_LAYERS.md) (line-by-line layer breakdown) · [`casper-agent/DORAHACKS_UPDATE.md`](casper-agent/DORAHACKS_UPDATE.md).

---

## 1. Dead / fake code → genuinely working

| Item | Before | After | Files / endpoints | Improvement |
|---|---|---|---|---|
| **L6 host telemetry (P0.1)** | eBPF sensor needs bcc + kernel headers (absent on the droplet) → `phoenix_exec/tcp/rtt` = **0**, layer dead | userspace `/proc` sensor, live feed every 2s, non-zero values; 22 tests | `phoenix_userspace_sensor.py`, `phoenix-sensor.service` | **0 → 100%** (dead → live) |
| **L2 TLS JA4 (P0.2)** | hard-coded **fake** constant `ja3:0.5` | real JA4 (FoxIO) from a trusted front, or honest `null`; 21 tests | `src/services/tlsFingerprint.ts`, `tls_ja4`/`tls_risk` | fake → truthful |
| **L0 CPU jitter (P0.3)** | timed two adjacent `hrtime` calls with no work between → measured call overhead, **cv≈0** (noise) | times a real micro-workload → genuine jitter, **cv≈0.18–0.31 organic**; 14 tests | `src/services/jitterProbe.ts`, `jitter_verdict`/`jitter_cv` | meaningless signal → physical one |
| **RPC Shadow Filter** | middleware **never mounted** → `/api/shadow-stats` always zero | mounted via `app.use(...)`, stats populate | `src/services/shadowFilter.ts`, `/api/shadow-stats` | dead → live |
| **L7.5 Sybil cluster** | instantiated but only reachable from manual admin endpoints | wired into `sniperFilter`, fed on every request | `src/services/sybilCluster.ts` | dead on the detection path → live |
| **RAM PUF (`ramSalt`)** | client sent it, server **never read it** | folded into the DNA-hash noise pool (`updateNoise`) | `/api/verify-rhythm` | entropy source restored |
| **L7 synthetic rhythm** | inline variance-only heuristic | tested `scoreBotRequest`: σ² + entropy + autocorr + header, 45 tests | `src/sniper.ts`, `sniperFilter` | crude heuristic → covered scoring |

## 2. Real vulnerabilities closed

| Item | Before (risk) | After | Files / endpoints | Severity |
|---|---|---|---|---|
| **Wallet bind (P1.4)** | accepted **any** 130-hex blob as a signature → anyone "bound" any wallet | real secp256k1 **ecrecover** (EIP-191); signature must recover to `wallet`, else 401 | `src/services/agentIdentity.ts`, `/api/wallet/bind` | **critical** — full identity bypass |
| **X-Forwarded-For** | raw XFF trusted blindly in ~12 places → ban evasion by rotation + framing another IP | `getClientIp()` trusted-proxy aware (`TRUSTED_PROXY_IPS`) | `server.ts` | **critical** — bypass of the whole ban cascade |
| **Seal clock-skew (P1.5)** | validator rejected `age<0` → **every** browser whose clock ran even ms fast → enclave unusable behind Cloudflare | ±30s tolerance both ways (`CLOCK_SKEW_US`), window = 5s + skew; regression tests | `src/services/sealValidator.ts`, `/api/enclave` | **fundamental** — feature was unusable for real clients |
| **Per-IP PQC sessions (P1.5)** | behind a shared CF IP two clients collided → the second legit client looked like a replay | per-connection session token (`x-silicon-dna-session`), per-session sequence | `server.ts` (`sessionIdOf`) | **critical** — false bans of legit clients |
| **Golden Seal replay** | reusing a consumed seq → generic `ENTROPY_SEAL_INVALID` | explicit `REPLAY_ATTACK` ban before signature check | `/api/enclave` | catches earlier and labels it |
| **`reset-bans`** | cleared only `bannedIPs` (sybil flag lived up to 24h) | full reset: bans + sybil + shadow + timing | `/api/admin/reset-bans` | operational correctness |

## 3. New cryptographic capabilities (from nothing → real, with proof)

| Item | Added | Files / endpoints | "Genuinely real" proof |
|---|---|---|---|
| **Agent identity (P1.4)** | cryptographic agent identity: signed credential (agentId + issuer + reputation + expiry + nonce), graduated ALLOW/STEP_UP/DENY | `src/services/agentIdentity.ts`, `/api/agent/verify` | 15 tests, live on prod |
| **Privacy Pass (P1.6)** | anonymous **one-time** tokens instead of repeated Argon2 PoW: real **OPRF P-384** (RFC 9497) — unforgeable / unlinkable / one-time | `src/services/privacyPass.ts`, `/api/pat/config`, `/api/pat/issue` | **pinned to RFC 9497 §A.4.1.1** vector (byte-for-byte), 23 tests, live |
| **PQ agent signatures (P2.8)** | **ML-DSA-65 (Dilithium3, FIPS 204)** for credentials → identity is post-quantum **end to end** with the ML-KEM channel | `verifyMlDsaCredential` in `agentIdentity.ts`, `/api/agent/verify` (`alg='ml-dsa-65'`) | **FIPS 204 keygen KAT**, 9 tests, live (real→ALLOW, tamper→BAD_SIGNATURE) |

## 4. Adaptivity / future-proofing

| Item | Before | After | Files / endpoints | Improvement |
|---|---|---|---|---|
| **Drift-adaptive σ² (P2.7)** | 5-minute batch `clamp(p10·1.5,1,5)`, buffer discarded each cycle, no memory, no drift signal, fed by **all** traffic (poisoning) | online **P² quantile** (Jain–Chlamtac 1985) + **Page-Hinkley** change detector (explicit drift alarm), clamped [1,5], fed **only by passed** traffic | `src/services/driftModel.ts`, `adaptive_sigma2`/`drift_status`/`drift_samples`/`drift_events` | crude batch → principled streaming model with self-diagnosis |

## 5. By the numbers

- **371 tests**, all green; 2 official cryptographic KATs (RFC 9497, FIPS 204). `tsc` clean.
- **3 critical-severity vulnerabilities** closed (wallet-bind, XFF, seal clock-skew) + 2 usability-critical (per-IP sessions, per-IP seq).
- **7 dead/fake spots** made working or made honest.
- **3 new cryptographic mechanisms**, 2 proven against reference vectors.
- **Prod**: `health operational`, jitter `organic`, all new endpoints live; public repo + CI green on every commit (P1.6→P2.8).
