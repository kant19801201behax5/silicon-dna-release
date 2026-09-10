# Silicon DNA — Causal Engine

*Corrected 2026-07-29, twice same day. First pass: this document was written as
if the causal engine below is part of Phoenix Zero / Silicon DNA's own oracle
pipeline. It is not — grepped the entire `silicon-dna-release` repo, zero
implementation matches. The real implementation lives in `decisionEngine.ts`,
inside a separate autonomous trading agent on the same server. That
part still stands: the oracle pusher reads `/api/public-feed` directly and
does not call the trading system.*

*Second pass, after being pushed to check more carefully: the first pass's
"R^2=0.998 could not be re-verified, no connection to this repo's oracle
anywhere" was too strong in two ways it shouldn't have been. (1) The live
trading API returns a live causal block right now, `r2: 0.9983`, essentially
the figure below — genuinely current, not historical. (2) "No connection
anywhere" was flatly wrong: Silicon DNA's own trust output is a real, live
input into the trading engine. And the trading engine's output is consumed by
a real, separately-running production service — an Allora Network worker
(confirmed running continuously since June 5) — which forwards a volatility
estimate derived from this exact `causal.r2` to Allora Network's Topic 69
(ETH 8h log-return). That's a real, live, working pipeline; it just isn't
*this repo's* pipeline. The oracle pusher and Phoenix Zero's own
`/api/public-feed` still do not read from it.*

## Overview

The Causal Engine implements SGD-based online linear regression to find which
network variables **causally predict** market stress events (gas spikes,
transaction revert spikes) ahead of time, rather than reacting after they
happen.

It runs continuously on a sliding window of network telemetry, tracking
several dozen candidate variables derived from the 12-chain RTT/gas/revert
feed. For each candidate, it maintains:

- **Pearson R^2** — how well this variable predicts the target stress event
- **ATE** (Average Treatment Effect) — directional impact (positive = stress increases)
- **best_var** — whichever tracked variable currently has the highest R^2

## Current Performance

**R^2 = 0.998** at steady state, against a live target of `arb_revert_ratio`
crossing its 15% warning threshold. Live-verified 2026-07-29 via the
production trading system's API: `r2: 0.9983` at query time. `best_var` is
not fixed — at that same query it was `dex_flow_ratio`, not a gas-pressure
term; the live endpoint tracks several dozen candidate variables and
`best_var` shifts as conditions change. The exact variable set, index layout,
and entry/hold thresholds are not published here; this document describes the
method, not the specific configuration.

## Algorithm (method, not parameters)

```
For each candidate variable v:
  1. Compute Pearson correlation between v[t-1] and target[t]
  2. Online SGD weight update using prediction error
  3. R^2[v] = 1 - (residual_variance / total_variance)
  4. ATE[v] = mean(target | v above median) - mean(target | v below median)

best_var = argmax(R^2)
```

A directional signal is only surfaced once R^2 clears a confidence floor;
below that, the engine reports a `NOISE` regime rather than a low-confidence
prediction. Signal strength is dampened by a clamped ATE term rather than
used directly, to avoid overreacting to a single noisy reading.

## Cold Start Recovery

After a server restart, R^2 rebuilds from zero and climbs back toward its
steady-state value over the following measurement cycles as enough samples
accumulate for the online regression to re-converge. Persisted state can
restore this without a cold start.

## Verified Real-World Result

May 31, 2026: `arb_revert_ratio` crossed 15% at 01:07 UTC; the acute
sequencer stall followed at 01:10 UTC — a 3-minute lead time, independently
documented in `proof/mev_war_2026-05-31.md` against raw production feed
data (206,040 records).
