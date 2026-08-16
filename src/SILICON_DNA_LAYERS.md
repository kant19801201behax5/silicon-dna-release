# Silicon DNA — Layer Architecture

*Corrected 2026-07-29 (first pass): the previous version of this file described
an idealized design (an "online one-class SVM" at L7, a single weighted-average
composite score at L11, an "L10 Causal Engine" tie-in) that did not match the
actual deployed `server.ts`. Rewritten to match the real, running code.*

*Corrected 2026-07-29 (second pass, same day): the first pass only checked
`server.ts`'s inline logic and the L0-L9 cascade below — it never enumerated
every file under `src/services/` and `src/middleware/` before concluding things
"don't exist." Four real, wired-in systems were missing entirely (Golden Seal
protocol, 3-class agent classifier, wallet identity binding), and one genuinely
dead-code case (RPC shadow filter) went unflagged in the opposite direction.
Both errors are the same root cause: conclusions drawn from a partial file list
instead of the actual directory contents. Added below, each marked with exactly
how it was verified (import + route + call site, not just presence of a file).*

*Corrected 2026-07-29 (third pass, same day, after being told directly to keep
looking): the local checkout this whole file was checked against was itself
stale — `diff`'d against the actual file running in production (`/opt/silicon-dna/server.ts`,
live process confirmed via `ps`/`systemctl`) and found a real gap: an import
and ~40 lines this local copy didn't have at all. Local server.ts has now been
replaced with the deployed version. Two more independent ban checks were
missing as a direct result — folded into L4 below (L1.1 GPU/UA consistency,
L1.2 automation/WebDriver detection) — plus a new localhost-only endpoint,
`GET /api/check-ip`, letting other local services (the x402 gateway) query
Silicon DNA's ban list without duplicating logic. Root cause, again: checked
the local repo as if it were authoritative without diffing it against what's
actually deployed. Re-searched the full deployed tree, its tests, and the
separate obfuscated `release/server.js` build artifact (confirmed not running;
the live process executes `server.ts` directly via `tsx`) for the originally-
disputed claims specifically: no `scikit-learn`-style trained one-class SVM
file/import anywhere, and no single formula combining L0-L10 into one number
with the old >0.70/>0.45 cutoffs. That's what's absent — not "no composite
scoring exists anywhere," which would be wrong. Composite/multi-signal scoring
is real in three separate, different forms: the 3-class classifier below
(additive scoring across 6 signals), Golden Seal's Gaussian-decayed
`trustScore`, and JARVIS's causal R²/ATE engine (separate system, see
`src/CAUSAL_ENGINE.md`). Three real mechanisms instead of the one originally
claimed, not zero.*

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

L4  Argon2id Proof-of-Work — REAL, plus two independent sub-checks found
    2026-07-29 (my local checkout was stale vs. the actual deployed server.ts —
    see the correction note at the top of this file)
    `GET /api/challenge` → solve with `hash-wasm`'s `argon2id` (salt
    `quantum_salt_3.2`) → `POST /api/verify-pow`, server recomputes and compares.
    Guards against ASIC/GPU spoofing (`t_min = (m_cost/1024) * 0.8`, rejects
    implausibly fast solves) and "slow-time" replay (claimed solve time exceeding
    real server-side wall-clock elapsed). Difficulty (`m_cost`) adapts per-IP via
    `argonProfiles` (doubles on fast solves <150ms, eases on slow ones >600ms).

    Before the PoW hash itself is checked, the same `/api/verify-pow` submission
    carries a client fingerprint (`fp`) that's run through two more independent,
    immediate-ban checks (both `req.socket.destroy()`, same as L3):
    - **L1.1 GPU/UA consistency**: UA claims macOS but the reported GPU string
      isn't Apple/Metal → `FINGERPRINT_MISMATCH` ban.
    - **L1.2 Automation/WebDriver detection** (`src/services/automationDetector.ts`):
      `navigator.webdriver===true`, ChromeDriver `$cdc_` artifacts, PhantomJS/
      Nightmare.js artifacts, or the combination of 0 plugins + empty
      `navigator.languages` → `AUTOMATION_DETECTED` ban. Reasons are collected
      independently so the ban log shows *why*, not just a bare flag.

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

L7  Synthetic Rhythm Detector — REAL, scored (upgraded 2026-08-16), not an ML model
    In `sniperFilter` (active only once the server is in SNIPER mode): over the
    last 10-20 request timestamps from one IP it now calls the tested
    `scoreBotRequest` (`src/sniper.ts`, 45 unit tests) — a multi-factor score of
    σ² + interval-entropy + lag-1 autocorrelation + header signals; total ≥ 60 ⇒
    synthetic, ban. The σ² threshold is `liveRules.sigma2`, auto-calibrated every
    5 minutes from a rolling p10 of observed variance (`AUTO-CAL`). Before
    2026-08-16 this was an inline variance-only check (`v < sigma2 || (v>10 &&
    |r1|<0.1)`) and `src/sniper.ts` was tested but unwired; it is now the live
    detector. Still explicit scoring on computed statistics — **not** a trained
    or online-updated SVM. On block it also feeds L7.5 Sybil (`sybilCluster.flag`),
    now wired into the detection path (was manual-endpoint-only before).

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

L10 (Removed as a layer of THIS system — but real and live elsewhere) An
    earlier version of this doc described a "Causal Engine Integration" layer
    reading R² and best_var from a causal regression model. That model is
    real and live — confirmed R²=0.9983 querying JARVIS's `/api/signal`
    directly — but it's inside JARVIS, a separate trading agent. The
    relationship runs the other way: Silicon DNA's own trust output is a
    live input INTO that engine (`silicon_dna:{trust,fresh}` in the same
    response), not the reverse. It is not read by, or wired into, Silicon
    DNA's own `server.ts` ban logic. Full detail: `src/CAUSAL_ENGINE.md`.
    Removed as a numbered layer of this cascade, not removed as "doesn't exist."

L11 (Removed as originally described — but a different real classifier exists,
    see below) An earlier version of this doc described a weighted-average
    formula combining "L0..L10" into one trust number with fixed cutoffs
    (>0.70 HUMAN, >0.45 LEGIT_AGENT, ≤0.45 MALICIOUS_BOT). That specific
    formula does not exist in `server.ts`. But a real 3-class classifier
    producing the same HUMAN/LEGIT_AGENT/MALICIOUS_BOT verdict *does* exist,
    with a different (additive, not weighted-average) formula — see
    "3-Class Agent Classifier" below. The 2026-07-29 first-pass correction
    said "no unified score, no 3-class verdict" — that was too strong; it
    should have said "not *this* formula."
```

## Additional independent systems (not part of the L0-L9 cascade above)

These four were missing from every version of this file until 2026-07-29
(second pass) — found by enumerating `src/services/` and `src/middleware/`
directly instead of grepping `server.ts` for specific expected terms.

```
Golden Seal Protocol ("Dynamic Chord") — REAL, independent ban trigger,
gates /api/enclave specifically
    src/services/rhythmManager.ts + src/services/sealValidator.ts.
    Client calls GET /api/sync-pulse to get a server-generated timing
    sequence (derived from the L1 ML-KEM session key), replays it back via
    POST /api/verify-rhythm with measured client-side timings. Server scores
    the deviation with a Gaussian window into a per-session trustScore
    (0.0-1.0): trustScore < 0.3 → session dropped; 0.3-0.7 → interrogation
    required. Separately, every /api/enclave request must carry an
    HMAC-signed "entropy seal" header (sig/ts/seq) — sealValidator.ts checks
    a 5-second anti-replay window, strict sequence-number enforcement, and
    HMAC signature match; failure → immediate 403 ENTROPY_SEAL_INVALID,
    independent of every other gate in this file. Since 2026-08-16 a seal that
    reuses an already-consumed sequence number (seq ≤ last accepted) is caught
    before signature check and banned with an explicit 403 REPLAY_ATTACK (was
    previously an unlabeled ENTROPY_SEAL_INVALID). Low trustScore forces an
    extra Argon2 PoW challenge (403 ACTIVE_INTERROGATION_REQUIRED) before
    the request is served.
    Verified: imported at server.ts:14-15, routes at server.ts:510-523,
    enforcement at server.ts:526-568. Client side calls confirmed live in
    the shipped dashboard bundle (dist/assets/index-SaaJg3ZO.js).
    Caveat: the client-side worker (src/services/rhythmWorker.ts) also
    computes a "software PUF" RAM-latency fingerprint (ramDna) and sends it
    to /api/verify-rhythm — but the server only reads `timings` from that
    body, not `ramDna`. That signal is collected and transmitted but not
    currently verified server-side. Not claiming it's checked; it isn't yet.

3-Class Agent Classifier — REAL, wired, different formula than the removed
L11
    src/services/agentClassifier.ts, POST /api/classify. Additive scoring
    across 6 signals (Spearman ρ, variance, entropy, User-Agent against
    known-agent/known-malicious regex lists, the L3 Frankenstein score,
    whether PoW was verified) into three buckets (h/a/b); highest bucket
    wins, confidence = winner / total. Produces exactly the HUMAN /
    LEGIT_AGENT / MALICIOUS_BOT labels the original (fictional) L11
    described, via a real, different, additive formula — not a trained
    model, not the weighted-average originally claimed.
    Verified: imported at server.ts:20, route at server.ts:972-984.

Trust Engine — fusion layer over the signals above, REAL, wired
    src/services/trustEngine.ts + trustSignals.ts, POST /api/trust-assessment.
    Added 2026-08-09 after researching how OPA, SPIFFE/SPIRE, and NIST SP
    800-207 each solve "combine several independent trust signals into one
    decision" — all three keep verifiers "dumb" (evidence only, never a
    verdict) and put combination policy in exactly one place. This module is
    that place for Silicon DNA: PQC session absence, WebDriver artifacts, and
    Frankenstein >=100 are hard gates (matches how server.ts already treats
    them elsewhere — this doesn't loosen anything); rhythm trustScore,
    classifier confidence, and wallet-Sybil proximity fuse into one score,
    weighted-averaged then moderated by the weakest signal (a single bad
    signal pulls the fused score down materially, not just diluted by
    weight — see trustEngine.ts's fuseSoftSignals for the exact formula).
    Bands: >=0.7 ALLOW, >=0.4 STEP_UP, >=0.2 SHADOW_LIMIT, else DENY.
    This is additive, not a replacement: none of the underlying checks
    (sniperFilter, microStallMiddleware, /api/enclave's own gate) changed —
    /api/trust-assessment composes the same real signals into one structured,
    graduated decision, verified with 6 hand-checked scenarios (clean session,
    missing PQC session, WebDriver detected, one bad signal among good ones,
    grey-zone mix, Sybil wallet) before being wired into server.ts.
    Corrected 2026-08-10, same day it shipped: first version only returned
    the decision as JSON — a real gap, not a design choice, caught when asked
    directly "what does this actually do for any program." DENY now writes to
    `bannedIPs` the same way every other detector in this file already does
    (matches the Spearman/Frankenstein/PoW-forgery ban call sites exactly —
    bannedIPs.set + persistBan + logEvent + broadcastThreat). That connects
    to something real: `/api/check-ip` (server.ts:802-810) already reads
    `bannedIPs.has(ip)` for the x402 payment gateway to reject banned IPs
    before they're asked to pay — verified end-to-end on a clean server
    start: POST a WebDriver fingerprint to /api/trust-assessment, then
    GET /api/check-ip?ip=<that IP> flips from false to true. It does NOT
    connect to the Casper agent itself (ts-agent/agent.js) — that's a
    separate system publishing network-safety data to the SequencerOracle
    contract, unrelated to who can pay for Silicon DNA-gated API access.
    Grepped casper-agent/ directly to confirm: zero references to
    trustEngine/evaluateTrust/trust-assessment outside this file's own docs.
    Verified: imported at server.ts:25-29, route at server.ts:1000-1050,
    typechecked and smoke-tested locally (started clean, ban-then-check-ip
    round-trip confirmed on a fresh process, not a stale one — the first
    attempt at this test hit a leftover process from an earlier smoke test
    and produced a false negative, caught by checking the log instead of
    trusting the first result).
    Deployed to production 2026-08-10: server.ts.bak_pre_trust_engine_20260810
    kept as rollback, typechecked in the real prod environment before
    restart, live cycle re-run against rtt.phoenix-ai.work post-restart.
    That live run found two real, pre-existing bugs in the ban-persistence
    layer (data/bans.json silently losing every ban since some earlier point
    due to an array/object type mismatch; /api/admin/reset-bans bypassing
    persist.ts's own state) — unrelated to this feature but only surfaced by
    testing it end-to-end instead of stopping at "the endpoint responds."
    Both fixed and deployed the same day (persist.ts.bak_pre_clearbans_20260810
    kept as rollback); see that commit for the full mechanism. Post-deploy
    sanity check: /api/wallet/stats, /api/shadow-stats, /api/classify, and
    the unrelated casper-agent/silicon-dna-keepalive/phoenix-zero services
    all confirmed still healthy.

RPC Shadow Filter — REAL and WIRED (fixed 2026-08-16; was dead before)
    src/middleware/shadowFilter.ts. Zero-latency Alchemy/QuickNode-style
    shadow filter: pass every request through immediately, classify in the
    background via classifyAgent(), throttle (429) an IP after 5 consecutive
    MALICIOUS_BOT hits in a 1-minute window. Until 2026-08-16 the
    `shadowFilterMiddleware` was defined but never passed to `app.use`, so
    `shadowRecords` was never written and `/api/shadow-stats` always returned
    zeros — the genuinely-dead case the 2026-07-29 second pass flagged.
    Now mounted: `app.use(shadowFilterMiddleware(ctx, getClientIp))` before the
    routes, resolving IP through the trusted-proxy-aware `getClientIp` and
    exempting control/observability paths (/metrics, /api/admin/*, /api/health,
    /api/public-feed) so a flagged monitor IP can't 429 out the reset endpoint.
    Verified live 2026-08-16 (local + prod redeploy): `/api/shadow-stats`
    populates (`tracked_ips`>0).

Wallet Identity Binding — REAL, wired
    src/services/walletBinder.ts. Binds an EIP-191 wallet address to an
    HMAC-derived behavioral fingerprint (entropy/variance/Spearman-ρ,
    keyed by the session secret — raw values never stored). 3+ distinct
    wallets sharing one behavioral hash flags as a Sybil group.
    Verified: imported at server.ts:23, routes at server.ts:574 (legacy
    /api/wallet stub), 1001 (/api/wallet/bind), 1036 (/api/wallet/lookup),
    1048 (/api/wallet/stats), 1052 (localhost-only admin clear).

L6 Host-Telemetry Feed — REAL and LIVE (userspace fallback added 2026-08-16)
    The README's "L6 eBPF" is a host-telemetry feed (process-exec / TCP-connect
    velocity + live RTT), surfaced as phoenix_exec / phoenix_tcp / phoenix_rtt_ms
    / phoenix_threat and ingested localhost-only via POST /api/agent/interact.
    The eBPF sensor needs bcc + kernel headers, which the prod droplet lacks — so
    the feed sat at zero. phoenix_userspace_sensor.py (stdlib-only /proc reader:
    new PIDs = exec, /proc/net/tcp[6] = TCP-connect, socket RTT) now feeds it as
    phoenix-sensor.service, no kernel modules. Verified live: the phoenix_* fields
    are non-zero. Pure functions unit-tested (tests/test_phoenix_sensor.py, 22
    cases) + CI job test-l6-sensor. /api/agent/interact is exempt from the shadow
    throttle (localhost-only, nginx-denied externally).
```

## Cross-IP Sybil Clustering (separate service, not one of the numbered layers)

`sybilCluster.ts` — KL-divergence on behavioral fingerprints (entropy, variance,
autocorrelation, Spearman ρ, request-interval histograms) across IPs, cohort
threshold 0.15. Runs alongside the layer cascade above as its own service.

## Why the real (corrected) picture still holds up

Even without a trained one-class-SVM model or a single L0-L10 weighted-average
formula, defeating this system requires simultaneously: real hardware-level
timing noise (L0), a real post-quantum KEM handshake (L1), a consistent and
non-automated User-Agent/platform/header/WebDriver profile (L3, L1.1, L1.2), a
genuine memory-hard PoW solve within plausible wall-clock time (L4), human-like
(not too regular, not too random) request timing (L7/L8), and — for
`/api/enclave` specifically — a correctly sequenced, replay-protected,
HMAC-signed entropy seal plus a Gaussian-scored timing-rhythm trust score
(Golden Seal) that IS a real composite score, just not the one originally
described. Add the 3-class classifier's own 6-signal additive score on top.
That's a materially harder bar than a single learned threshold, and — contrary
to how an earlier pass here phrased it — it isn't "no composite scoring
anywhere," it's several real composite mechanisms instead of the one originally
claimed. The interpretability of each individual piece is the point, not a
limitation being apologized for.

One correction was owed the other direction too: not everything wired into the
codebase was doing something. The RPC Shadow Filter above was real code with a
real pitch behind it, sitting unmounted — and listing it as inert was as
important as listing the real gates as real. **As of 2026-08-16 it is now
mounted and live** (verified local + prod: `/api/shadow-stats` populates), so
the one genuinely-dead entry is closed. The remaining honest non-gate is the L2
TLS/JA3 placeholder, which stays a declared placeholder (raw ClientHello bytes
aren't available behind Cloudflare) — a conscious stub, not dead code. That's
what "verified against the actual code" has to mean.
