# Silicon DNA — Causal Engine

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
crossing its 15% warning threshold. The best-performing predictor is a
gas-pressure-derived velocity term — the exact variable set, index layout,
and entry/hold thresholds are not published here; this document describes
the method, not the specific configuration.

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
