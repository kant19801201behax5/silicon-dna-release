'use strict';
/**
 * Phoenix Zero x Silicon DNA -- Oracle Reputation Scorer
 * =========================================================
 * Deterministic, pure functions. No I/O here on purpose: given the same
 * verdict history + telemetry history, any third party gets the same score
 * by re-running this file against the same public data -- that's what makes
 * the resulting on-chain number "trust-minimized" rather than self-attested.
 * (See reputation_publish.js for how the inputs are actually sourced.)
 *
 * ── Methodology ──────────────────────────────────────────────────────────
 * The oracle publishes a verdict `{ ts, safe }` every cycle. "Historical
 * accuracy" only means something if it's checked against something the
 * oracle did NOT already know at publish time -- otherwise it's just
 * grading the sensor against itself. So each verdict is checked against
 * telemetry samples that arrive AFTER it (strictly `sample.ts > verdict.ts`),
 * inside a bounded look-ahead window. That turns "safe=false" into an actual
 * testable claim: "conditions will still look bad for the next W seconds."
 *
 * "Adverse" reuses the exact thresholds agent.js already gates real
 * transactions on (arb_revert >= 15% OR base_p99 >= 500ms) -- see
 * ARB_REVERT_MAX / BASE_P99_MAX in agent.js and agent.test.js. Duplicated
 * here rather than imported, matching the precedent agent.test.js already
 * set ("Inline the logic from agent.js for testing") -- agent.js is a
 * self-running script with no exports. If those thresholds ever change,
 * update both copies.
 *
 * Classification per verdict, using only samples in (verdict.ts, verdict.ts + W]:
 *   predicted unsafe, window WAS adverse   -> TP  (correct warning)
 *   predicted unsafe, window NOT adverse   -> FP  (false alarm)
 *   predicted safe,   window NOT adverse   -> TN  (correctly calm)
 *   predicted safe,   window WAS adverse   -> FN  (missed warning)
 *   no telemetry sample falls in the window (yet) -> UNSCOREABLE, excluded
 *     from every count. A recent verdict with no future data yet is not
 *     evidence of anything -- counting it as FN would punish the oracle
 *     for how recently it spoke, not for being wrong.
 *
 * The published score is accuracy = (TP+TN) / (TP+FP+TN+FN), because that's
 * the literal word the Casper Buildathon's own track description uses
 * ("reputation score based on historical accuracy") and it stays well
 * defined even when precision/recall don't (e.g. zero false alarms yet).
 * Precision/recall are still returned for transparency/audit, just not
 * published as *the* number.
 */

const ARB_REVERT_MAX = 0.15;
const BASE_P99_MAX   = 500;

const DEFAULT_WINDOW_SECONDS = 900; // 15 min: several multiples of the feed's
// ~60s tick, and long enough to catch a slower-building stall than the 3-min
// lead time documented in the May 31 2026 MEV-war case study, without
// dragging in unrelated later events from an overlong window.

function isAdverseSample(sample) {
  const arbRevert = parseFloat(sample.arb_revert || 0);
  const baseP99   = parseInt(sample.base_p99 || 0, 10);
  return arbRevert >= ARB_REVERT_MAX || baseP99 >= BASE_P99_MAX;
}

/**
 * Classifies a single verdict against a telemetry history.
 * @param {{ts:number, safe:boolean}} verdict
 * @param {Array<{ts:number, arb_revert:number, base_p99:number}>} telemetry
 * @param {number} windowSeconds
 */
function classifyVerdict(verdict, telemetry, windowSeconds = DEFAULT_WINDOW_SECONDS) {
  const windowEnd = verdict.ts + windowSeconds;
  const windowSamples = telemetry.filter(s => s.ts > verdict.ts && s.ts <= windowEnd);

  if (windowSamples.length === 0) {
    return { classification: 'UNSCOREABLE', windowAdverse: null, sampleCount: 0 };
  }

  const windowAdverse = windowSamples.some(isAdverseSample);
  const predictedSafe = verdict.safe === true;

  let classification;
  if (!predictedSafe && windowAdverse)  classification = 'TP';
  else if (!predictedSafe && !windowAdverse) classification = 'FP';
  else if (predictedSafe && !windowAdverse)  classification = 'TN';
  else classification = 'FN'; // predictedSafe && windowAdverse

  return { classification, windowAdverse, sampleCount: windowSamples.length };
}

/**
 * Scores a full verdict history against a telemetry history.
 * @param {Array<{ts:number, safe:boolean}>} verdicts
 * @param {Array<{ts:number, arb_revert:number, base_p99:number}>} telemetry
 * @param {{windowSeconds?: number, maxHistory?: number}} [options]
 */
function scoreHistory(verdicts, telemetry, options = {}) {
  const windowSeconds = options.windowSeconds || DEFAULT_WINDOW_SECONDS;
  // "Historical" accuracy is unweighted cumulative by default (matches the
  // buildathon wording literally); maxHistory lets a caller opt into a
  // rolling-window variant instead, without that choice being silently
  // baked into the function's only behavior.
  const maxHistory = options.maxHistory || Infinity;

  const sorted = [...verdicts].sort((a, b) => a.ts - b.ts);
  const scoped = Number.isFinite(maxHistory) ? sorted.slice(-maxHistory) : sorted;

  let tp = 0, fp = 0, tn = 0, fn = 0, unscoreable = 0;
  for (const v of scoped) {
    const { classification } = classifyVerdict(v, telemetry, windowSeconds);
    if (classification === 'TP') tp++;
    else if (classification === 'FP') fp++;
    else if (classification === 'TN') tn++;
    else if (classification === 'FN') fn++;
    else unscoreable++;
  }

  const sampleSize = tp + fp + tn + fn;
  const accuracy  = sampleSize > 0 ? (tp + tn) / sampleSize : null;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : null;
  const recall    = (tp + fn) > 0 ? tp / (tp + fn) : null;

  return {
    tp, fp, tn, fn,
    unscoreable,
    sampleSize,
    accuracy,
    accuracyBps: accuracy === null ? null : Math.round(accuracy * 10000),
    precision,
    recall,
    windowSeconds,
  };
}

module.exports = {
  ARB_REVERT_MAX,
  BASE_P99_MAX,
  DEFAULT_WINDOW_SECONDS,
  isAdverseSample,
  classifyVerdict,
  scoreHistory,
};
