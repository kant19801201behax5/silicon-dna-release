# Silicon DNA — 12-Layer Classification Pipeline

## Purpose

Classifies every incoming HTTP/WebSocket connection as:
- `HUMAN` — real browser user
- `LEGIT_AGENT` — verified autonomous AI agent
- `MALICIOUS_BOT` — adversarial bot, dropped at first failed layer

## Layer Architecture

```
L0  CPU Jitter Physics
    probe-worker.mjs samples process.hrtime.bigint() 100× per 200ms
    Computes: mean, stddev, percentiles of nanosecond deltas
    Human:     σ > 800ns  (thermal noise, OS scheduler jitter)
    VM/Bot:    σ < 200ns  (deterministic, no physical noise)
    Verdict:   jitter_score = clamp(σ / 1000, 0, 1)

L1  ML-KEM-768 Channel (NIST FIPS 203)
    Library:   mlkem (npm)
    Purpose:   establishes post-quantum authenticated channel
    Proves:    client has real compute (cannot be trivially spoofed)
    Verdict:   kem_pass = boolean

L2  JA3/JA4 TLS Fingerprint
    Captures:  TLS ClientHello cipher suites, extensions, elliptic curves
    Database:  known bot library signatures (Puppeteer, Playwright, curl, etc.)
    Verdict:   ja3_score = 0.0 (known bot) → 1.0 (clean browser)

L3  Behavioral Rhythm
    Measures:  mouse events, keypress timing, scroll velocity
    Analysis:  entropy of inter-event intervals
    Bots:      zero or perfectly uniform timing
    Verdict:   behavioral_score = entropy_normalized

L4  Argon2 Proof-of-Work
    Library:   argon2-browser (in dist/assets/)
    Cost:      ~200ms on modern CPU (negligible for humans, expensive for bots at scale)
    Verifies:  argon2 hash of challenge on server side
    Verdict:   pow_pass = boolean

L5  Silicon Hash
    Purpose:   session identity chain (links requests to verified session)
    Hash:      SHA-256(L0_jitter || L1_kem_public || L4_solution || timestamp)
    Verdict:   session_bound = boolean

L6  Reputation Cache
    Storage:   LRU cache (lru-cache npm, 10,000 entries, TTL=1h)
    Key:       Silicon Hash fingerprint
    Tracks:    pass rate, fail rate, total sessions
    Verdict:   reputation_score ∈ [0, 1]

L7  ML Anomaly Detector
    Model:     online one-class SVM (simplified, incremental)
    Features:  [jitter_score, behavioral_score, ja3_score, rtt_ms]
    Baseline:  built from first 1000 human sessions
    Verdict:   anomaly_score = distance from human centroid

L8  Timing Consistency
    Measures:  jitter variance ACROSS multiple requests (not single session)
    Detects:   distributed bots with consistent inter-request timing
    Verdict:   timing_consistency_score

L9  Network Telemetry
    Sources:   Phoenix Zero RTT feed (arb_revert_ratio, gas_pressure, tension)
    Logic:     if arb_revert_ratio > 0.15 → elevated bot/MEV activity in network
    Verdict:   network_safe = boolean

L10 Causal Engine Integration
    Input:     current R² and best_var from causal regression
    Logic:     if R² > 0.40 → causal signal available → higher trust threshold
    Verdict:   causal_confidence ∈ [0, 1]

L11 Composite Trust Score
    Formula:   trust = weighted_average(L0..L10 verdicts)
    Weights:   [L0:0.20, L1:0.15, L2:0.15, L3:0.10, L4:0.10,
                L5:0.08, L6:0.07, L7:0.06, L8:0.05, L9:0.02, L10:0.02]
    Output:    trust ∈ [0.0, 1.0]
    
    Classification:
      trust > 0.70  →  HUMAN
      trust > 0.45  →  LEGIT_AGENT
      trust ≤ 0.45  →  MALICIOUS_BOT
```

## API Response

```json
{
  "classification": "HUMAN",
  "trust": 0.94,
  "layers": {
    "jitter": 0.91,
    "kem": true,
    "ja3": 0.88,
    "behavioral": 0.95,
    "pow": true
  },
  "network_safe": true,
  "silicon_dna_version": "5.0.0"
}
```

## Why It Cannot Be Faked

**L0 (CPU Jitter):** Requires physical hardware thermal noise. VMs and containers produce deterministic timing — detectable with >99.5% accuracy.

**L1 (ML-KEM-768):** Post-quantum key encapsulation. The key exchange itself proves computational capability. Replay attacks impossible (fresh challenge per session).

**L4 (Argon2 PoW):** Memory-hard function. Botnet at scale: 200ms × N bots = real infrastructure cost. Single human: imperceptible.

**Combined:** Passing all 12 layers simultaneously requires: physical hardware + real browser TLS stack + genuine user behavior. No known automation framework achieves this.
