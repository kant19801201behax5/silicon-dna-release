# Silicon DNA — Causal Engine

*Corrected 2026-07-29, twice same day. First pass: this document was written as
if the causal engine below is part of Phoenix Zero / Silicon DNA's own oracle
pipeline. It is not — grepped the entire `silicon-dna-release` repo, zero
implementation matches. The real implementation lives in `decisionEngine.ts`,
inside JARVIS (a separate autonomous trading agent on the same server). That
part still stands: `mantle_pusher.js` reads `/api/public-feed` directly and
does not call JARVIS.*

*Second pass, after being pushed to check more carefully: the first pass's
"R²=0.998 could not be re-verified, no connection to this repo's oracle
anywhere" was too strong in two ways it shouldn't have been. (1) Checked the
wrong place — local log files on the DO droplet — instead of JARVIS's actual
live API. Queried `https://kant19801201behax5-jarvis-agi.hf.space/api/signal`
directly: it returns a live causal block right now, `r2: 0.9983`, essentially
the figure below — genuinely current, not historical. (2) "No connection
anywhere" was flatly wrong: that same live response includes
`"silicon_dna":{"trust":1,"fresh":true}` — Silicon DNA's own trust output is a
real, live input into JARVIS's engine. And JARVIS's `/api/signal` output is
consumed by a real, separately-running production service —
`/opt/allora/allora_worker.py` (confirmed running continuously since June 5,
`GET /inference/ETH` returns 200 with a live prediction) — which forwards a
volatility estimate derived from this exact `causal.r2` to Allora Network's
Topic 69 (ETH 8h log-return). That's a real, live, working pipeline; it just
isn't *this hackathon submission's* pipeline. `mantle_pusher.js` and Phoenix
Zero's own `/api/public-feed` still do not read from it — verified by grepping
every `.py` file in `/opt/phoenix_zero/` for any JARVIS reference: one hit, a
docstring comment naming JARVIS as a hypothetical "any data buyer," not a call.*

## Overview

The Causal Engine implements SGD-based online linear regression to find which
network variables **causally predict** market stress events (gas spikes,
transaction revert spikes) ahead of time, rather than reacting after they
happen.

It runs continuously on a sliding window of network telemetry, tracking
several dozen candidate variables derived from the 6-chain RTT/gas/revert
feed. For each candidate, it maintains:

- **Pearson R²** — how well this variable predicts the target stress event
- **ATE** (Average Treatment Effect) — directional impact (positive = stress increases)
- **best_var** — whichever tracked variable currently has the highest R²

## Current Performance

**R² = 0.998** at steady state, against a live target of `arb_revert_ratio`
crossing its 15% warning threshold. Live-verified 2026-07-29 via
`GET /api/signal` on the production JARVIS instance: `r2: 0.9983` at query
time. `best_var` is not fixed — at that same query it was `dex_flow_ratio`,
not a gas-pressure term; the live endpoint tracks several dozen candidate
variables (visible in the same response's `causal.vars`) and `best_var`
shifts as conditions change. The exact variable set, index layout, and
entry/hold thresholds are not published here; this document describes the
method, not the specific configuration.

## Algorithm (method, not parameters)

```
For each candidate variable v:
  1. Compute Pearson correlation between v[t-1] and target[t]
  2. Online SGD weight update using prediction error
  3. R²[v] = 1 - (residual_variance / total_variance)
  4. ATE[v] = mean(target | v above median) - mean(target | v below median)

best_var = argmax(R²)
```

A directional signal is only surfaced once R² clears a confidence floor;
below that, the engine reports a `NOISE` regime rather than a low-confidence
prediction. Signal strength is dampened by a clamped ATE term rather than
used directly, to avoid overreacting to a single noisy reading.

## Cold Start Recovery

After a server restart, R² rebuilds from zero and climbs back toward its
steady-state value over the following measurement cycles as enough samples
accumulate for the online regression to re-converge. Persisted state can
restore this without a cold start.

## Verified Real-World Result

May 31, 2026: `arb_revert_ratio` crossed 15% at 01:07 UTC; the acute
sequencer stall followed at 01:10 UTC — a 3-minute lead time, independently
documented in `proof/mev_war_2026-05-31.md` against raw production feed
data (206,040 records).
