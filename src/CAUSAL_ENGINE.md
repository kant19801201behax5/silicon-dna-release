# Silicon DNA — Causal Engine

## Overview

The Causal Engine implements SGD-based linear regression to find which network variables **causally predict** market stress events.

It runs continuously on a sliding window of network telemetry samples. For each of 26 tracked variables, it computes:
- **Pearson R²** — how well this variable predicts stress (target: gas_spike, revert_spike)
- **ATE** (Average Treatment Effect) — directional impact (positive = stress increases)
- **best_var** — the highest R² variable at any given moment

## Current Best Predictor

`gas_pressure_velocity` (state[498]) — R²=0.998 at steady state.

This is the EMA-normalized deviation of L1 gas pressure over time. When it spikes, it means gas is rising faster than the EMA baseline — a leading indicator of mempool congestion.

## Key Thresholds

```typescript
const R2_ENTRY  = 0.60;   // minimum R² to open a directional position
const R2_HOLD   = 0.25;   // minimum R² to keep a position open
const R2_NOISE  = 0.40;   // below this: regime=NOISE, no LLM proposals accepted
```

## State Vector (512d Lorentz)

```
state[492] = blob_base_fee      (normalized)
state[493] = gas_pressure       (gasUsed/gasLimit on L1)
state[494] = arb_revert_ratio   (reverted/total on Arbitrum, 2s window)
state[495] = base_revert_ratio  (same for Base)
state[496] = blob_fee_velocity  (EMA deviation × 10)
state[497] = revert_ratio_velocity
state[498] = gas_pressure_velocity  ← best_var, R²=0.998
state[499] = op_p99_velocity
state[500] = l1BaseFeeNorm
state[501] = l1BlockUtil
state[502] = isolation_score
```

## Algorithm

```
For each variable v in [492..499]:
  1. Compute Pearson correlation between v[t-1] and target[t]
     target = arb_revert_ratio spike (>0.15 threshold crossed)
  2. SGD update: w[v] += lr * (target - prediction) * v[t-1]
  3. R²[v] = 1 - (residual_variance / total_variance)
  4. ATE[v] = mean(target | v > median) - mean(target | v ≤ median)

best_var = argmax(R²)
ate_mod  = clamp(ATE[best_var] * 0.25, -0.20, +0.20)
```

## Cold Start Recovery

After a server restart, R² rebuilds from 0:
- Cycles 1-50: warming up (NOISE regime)
- Cycles 50-200: R² climbs to ~0.40 threshold
- Cycles 200-500: R² stabilizes at 0.45-0.55
- Cycles 500+: R² reaches 0.998 peak

With `causal_state.json.gz` restored from HuggingFace Dataset, R² recovers to 0.998 from cycle 1.
