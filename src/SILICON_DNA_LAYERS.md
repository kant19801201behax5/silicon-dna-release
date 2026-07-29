# Silicon DNA — Layer Architecture

*Corrected 2026-07-29: the previous version of this file described an idealized
design (an "online one-class SVM" at L7, a single weighted-average composite
score at L11, an "L10 Causal Engine" tie-in) that does not match the actual
deployed `server.ts`. This directly contradicted `casper-agent/DORAHACKS_UPDATE.md`,
which correctly states the classifier is "interpretable threshold logic... not a
trained ML model." Rewritten below to match the real, running code — verified
against `server.ts` line by line, not re-described from memory.*

## Purpose

Classifies incoming HTTP/WebSocket traffic and independently gates it at several
points. This is **not** a single L0→L11 pipeline feeding one composite score —
it's a set of independent checks, several of which can ban an IP on their own the
moment they fail. Passing "all layers" isn't a single number crossing a
threshold; it's *not tripping any individual gate*.

## What's real, layer by layer

```
L0  CPU Jitter Physics — REAL
    probe-worker.mjs (Worker thread) samples process.hrtime.bigint() continuously.
    Feeds mean/variance/entropy/autocorrelation into currentMetrics, published
    over WebSocket every cycle. Also drives the SNIPER/STRESS/IDLE mode timer
    and the synthetic-rhythm ban check (see L7 below).

L1  ML-KEM-768 Channel (NIST FIPS 203) — REAL
    Library: `mlkem` (npm). Real keypair generated per WebSocket connection,
    real decapsulation on the client's response — this is an actual post-quantum
    KEM handshake, not a placeholder. The resulting shared secret becomes the
    HMAC key for L5 below and is ratcheted (re-derived from accumulated client
    noise) every 50 packets on the protected `/api/enclave` endpoint.

L2  TLS Fingerprint (JA3/JA4) — PLACEHOLDER, honestly disclosed as such
    Fixed `ja3: 0.5` value, sent as-is to JARVIS's ingestion endpoint. JA3 is
    obsolete since Chrome 110 randomized ClientHello extension order (Jan 2023);
    real JA4 fingerprinting would need raw TLS ClientHello bytes, which aren't
    available once traffic is proxied through Cloudflare without their paid Bot
    Management tier. Not implemented — not claimed to be.

L3  "Frankenstein" Consistency Check — REAL, independent ban trigger
    `checkConsistency()` scores User-Agent / `sec-ch-ua-platform` / `sec-fetch-mode`
    mismatches (e.g. UA claims Windows, platform header says Linux) plus explicit
    automation headers (`x-puppeteer-version`, `x-selenium-id`). Score ≥ 100 →
    immediate ban (`sniperFilter`), independent of every other check here.

L4  Argon2id Proof-of-Work — REAL
    `GET /api/challenge` → solve with `hash-wasm`'s `argon2id` (salt
    `quantum_salt_3.2`) → `POST /api/verify-pow`, server recomputes and compares.
    Guards against ASIC/GPU spoofing (`t_min = (m_cost/1024) * 0.8`, rejects
    implausibly fast solves) and "slow-time" replay (claimed solve time exceeding
    real server-side wall-clock elapsed). Difficulty (`m_cost`) adapts per-IP via
    `argonProfiles` (doubles on fast solves <150ms, eases on slow ones >600ms).

L5  Session Identity Hash — REAL, different formula than earlier documented
    `computeQuantumDNAHash()`: `HMAC-SHA256(key = L1's ML-KEM session key,
    message = jitterMean‖jitterVar‖spearmanRho‖powCalcTime‖powMemCost‖powHash)`.
    Combines the L0 jitter stats, the L8 Spearman correlation, and the L4 PoW
    result into one session-bound value — not a plain `SHA-256(jitter‖kem‖pow‖ts)`
    as an earlier version of this doc claimed; no separate timestamp field, and
    it's an HMAC (keyed by the session secret) rather than an unkeyed hash.

L6  PoW Difficulty Profile Cache — REAL, per-IP, not a general "reputation" score
    `argonProfiles` (LRU, 24h TTL): per-IP `{m_cost, t_cost, successes}`,
    persisted to disk (`persistProfile`) so it survives restarts. This adapts
    *how hard* the next PoW challenge is for a given IP based on past solve
    speed — it does not track a generic trust/reputation number.

L7  Synthetic Rhythm Detector — REAL, but threshold logic, not an ML model
    In `sniperFilter` (active only once the server is in SNIPER mode): computes
    variance and lag-1 autocorrelation over the last 10-20 request timestamps
    from one IP. Bans if `variance < liveRules.sigma2` (too perfectly regular —
    a bot's fixed interval) OR `variance > 10 && |autocorr| < 0.1` (too random —
    `Math.random()`-style jitter with no physical memory). This is explicit
    threshold logic on two computed statistics, auto-calibrated every 5 minutes
    from a rolling p10 of observed variance (`AUTO-CAL`) — **not** a trained or
    online-updated SVM or any other ML model. An earlier version of this doc
    called it one; that was aspirational, not a description of the shipped code.

L8  Spearman "Grey Zone" Stall Correlation — REAL, independent ban trigger
    `microStallMiddleware`: injects a small random server-side delay (5-30ms)
    only in SNIPER mode when toxicity is elevated, then measures the Spearman
    rank correlation between injected server delays and the client's next-request
    gaps over 7+ pairs. `ρ < liveRules.rho` (default 0.3) → banned outright
    ("static script" — no adaptive reaction to server timing). `0.3 ≤ ρ < 0.6` →
    flagged "grey zone" (raises toxicity for L7) but not banned by itself.

L9  Network Telemetry Gate — REAL, but this is a separate MCP tool's threshold,
    not part of the ban cascade above
    `arb_revert_ratio > 15%` or `base_p99 > 500ms` (also, since 2026-07-29,
    Casper's own P99 > 2000ms — see `casper-agent/mcp-server/`) marks the
    *network*, not the caller, unsafe. This gates `get_sequencer_safety` /
    `get_rwa_settlement_signal` and the paid x402 endpoint; it does not feed
    into `bannedIPs` and is unrelated to L0-L8's per-IP bot/human decision.

L10 (Removed — was never implemented) An earlier version of this doc described
    a "Causal Engine Integration" layer reading R² and best_var from a causal
    regression model. That model exists inside JARVIS, a separate system, and
    is not read by, or wired into, Silicon DNA's own `server.ts` ban logic.
    Removed from this list rather than left as an inaccurate claim.

L11 (Removed — no single composite score exists) An earlier version of this doc
    described a weighted-average formula combining "L0..L10" into one trust
    number with fixed classification cutoffs (>0.70 HUMAN, >0.45 LEGIT_AGENT,
    ≤0.45 MALICIOUS_BOT). No such formula exists in `server.ts` — grepped for
    it directly, zero matches. The real system is the cascade above: any single
    gate (L3 Frankenstein, L4 PoW forgery/ASIC/slow-time, L7 synthetic rhythm,
    L8 static-script Spearman) can ban independently. There is no unified score.
```

## Cross-IP Sybil Clustering (separate service, not one of the numbered layers)

`sybilCluster.ts` — KL-divergence on behavioral fingerprints (entropy, variance,
autocorrelation, Spearman ρ, request-interval histograms) across IPs, cohort
threshold 0.15. Runs alongside the layer cascade above as its own service.

## Why the real (corrected) picture still holds up

Even without an ML model or a single composite score, defeating this system
requires simultaneously: real hardware-level timing noise (L0), a real
post-quantum KEM handshake (L1), a consistent and non-automated
User-Agent/platform/header profile (L3), a genuine memory-hard PoW solve within
plausible wall-clock time (L4), and human-like (not too regular, not too random)
request timing (L7/L8). That's a materially harder bar than a single learned
threshold, even though no individual piece of it is a trained model — the
interpretability is the point, not a limitation being apologized for.
