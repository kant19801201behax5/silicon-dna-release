/**
 * Phoenix Zero Casper Agent — Reputation Scorer Unit Tests
 * Same custom runner style as agent.test.js (no framework dependency).
 */

'use strict';

const {
  ARB_REVERT_MAX,
  BASE_P99_MAX,
  DEFAULT_WINDOW_SECONDS,
  isAdverseSample,
  classifyVerdict,
  scoreHistory,
} = require('./reputation_scorer');

// ── Test runner ───────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected ${b}, got ${a}`);
}

// ── isAdverseSample ─────────────────────────────────────────────────────────
console.log('\n🔵 isAdverseSample');

test('Calm sample → not adverse', () => {
  assert(!isAdverseSample({ arb_revert: 0.04, base_p99: 45 }));
});

test('arb_revert exactly at threshold (15%) → adverse', () => {
  assert(isAdverseSample({ arb_revert: ARB_REVERT_MAX, base_p99: 100 }));
});

test('arb_revert just under threshold (14.9%) → not adverse', () => {
  assert(!isAdverseSample({ arb_revert: 0.149, base_p99: 100 }));
});

test('base_p99 exactly at threshold (500ms) → adverse', () => {
  assert(isAdverseSample({ arb_revert: 0.0, base_p99: BASE_P99_MAX }));
});

test('base_p99 just under threshold (499ms) → not adverse', () => {
  assert(!isAdverseSample({ arb_revert: 0.0, base_p99: 499 }));
});

test('MEV war sample (arb_revert=72.1%) → adverse', () => {
  assert(isAdverseSample({ arb_revert: 0.721, base_p99: 1144 }));
});

test('Missing fields treated as zero → not adverse', () => {
  assert(!isAdverseSample({}));
});

// ── classifyVerdict: window mechanics ──────────────────────────────────────
console.log('\n🔵 classifyVerdict — window mechanics');

test('No telemetry at all → UNSCOREABLE', () => {
  const r = classifyVerdict({ ts: 1000, safe: true }, [], 900);
  assertEqual(r.classification, 'UNSCOREABLE');
  assertEqual(r.sampleCount, 0);
});

test('Sample exactly AT verdict.ts is excluded (strict > , avoids tautology)', () => {
  const r = classifyVerdict({ ts: 1000, safe: false }, [{ ts: 1000, arb_revert: 0.9, base_p99: 900 }], 900);
  assertEqual(r.classification, 'UNSCOREABLE', 'the only sample equals verdict.ts, so it must not count');
});

test('Sample exactly at verdict.ts + window is included (inclusive upper bound)', () => {
  const r = classifyVerdict(
    { ts: 1000, safe: false },
    [{ ts: 1900, arb_revert: 0.9, base_p99: 900 }],
    900
  );
  assertEqual(r.classification, 'TP', 'sample at ts+900 is inside the window');
});

test('Sample one second past the window is excluded → UNSCOREABLE', () => {
  const r = classifyVerdict(
    { ts: 1000, safe: false },
    [{ ts: 1901, arb_revert: 0.9, base_p99: 900 }],
    900
  );
  assertEqual(r.classification, 'UNSCOREABLE');
});

test('Sample before verdict.ts is ignored even if later ones exist', () => {
  const r = classifyVerdict(
    { ts: 1000, safe: true },
    [
      { ts: 900, arb_revert: 0.9, base_p99: 900 },   // before → ignored
      { ts: 1100, arb_revert: 0.01, base_p99: 20 },  // after, calm
    ],
    900
  );
  assertEqual(r.classification, 'TN', 'only the post-verdict calm sample should count');
});

// ── classifyVerdict: the four outcomes ─────────────────────────────────────
console.log('\n🔵 classifyVerdict — TP / FP / TN / FN');

test('TP: predicted unsafe, window actually went bad (MEV-war shape)', () => {
  // Oracle warns at 01:07, real stall hits at 01:10 (3 min later) — matches
  // the documented May 31 2026 case study's lead time.
  const verdict = { ts: 1000, safe: false };
  const telemetry = [
    { ts: 1060, arb_revert: 0.06, base_p99: 80 },   // still calm at +1min
    { ts: 1180, arb_revert: 0.721, base_p99: 1144 }, // stall hits at +3min
  ];
  const r = classifyVerdict(verdict, telemetry, DEFAULT_WINDOW_SECONDS);
  assertEqual(r.classification, 'TP');
});

test('FP: predicted unsafe, but nothing bad happened in the window', () => {
  const verdict = { ts: 1000, safe: false };
  const telemetry = [
    { ts: 1060, arb_revert: 0.02, base_p99: 40 },
    { ts: 1800, arb_revert: 0.03, base_p99: 60 },
  ];
  const r = classifyVerdict(verdict, telemetry, DEFAULT_WINDOW_SECONDS);
  assertEqual(r.classification, 'FP');
});

test('TN: predicted safe, and it stayed calm', () => {
  const verdict = { ts: 1000, safe: true };
  const telemetry = [
    { ts: 1060, arb_revert: 0.01, base_p99: 30 },
    { ts: 1500, arb_revert: 0.02, base_p99: 50 },
  ];
  const r = classifyVerdict(verdict, telemetry, DEFAULT_WINDOW_SECONDS);
  assertEqual(r.classification, 'TN');
});

test('FN: predicted safe, but conditions turned adverse in-window (missed warning)', () => {
  const verdict = { ts: 1000, safe: true };
  const telemetry = [
    { ts: 1060, arb_revert: 0.01, base_p99: 30 },
    { ts: 1400, arb_revert: 0.83, base_p99: 1300 },
  ];
  const r = classifyVerdict(verdict, telemetry, DEFAULT_WINDOW_SECONDS);
  assertEqual(r.classification, 'FN');
});

test('One adverse sample among many calm ones in-window is still enough for TP', () => {
  const verdict = { ts: 1000, safe: false };
  const telemetry = [
    { ts: 1030, arb_revert: 0.01, base_p99: 20 },
    { ts: 1060, arb_revert: 0.02, base_p99: 30 },
    { ts: 1090, arb_revert: 0.9, base_p99: 900 }, // the one bad tick
    { ts: 1120, arb_revert: 0.01, base_p99: 25 },
  ];
  const r = classifyVerdict(verdict, telemetry, DEFAULT_WINDOW_SECONDS);
  assertEqual(r.classification, 'TP');
});

// ── scoreHistory: aggregation ───────────────────────────────────────────────
console.log('\n🔵 scoreHistory — aggregation');

test('Empty verdict history → null scores, zero sample size', () => {
  const r = scoreHistory([], []);
  assertEqual(r.sampleSize, 0);
  assertEqual(r.accuracy, null);
  assertEqual(r.accuracyBps, null);
  assertEqual(r.precision, null);
  assertEqual(r.recall, null);
});

test('All-UNSCOREABLE history (no telemetry) does not count toward sampleSize', () => {
  const verdicts = [{ ts: 1000, safe: true }, { ts: 2000, safe: false }];
  const r = scoreHistory(verdicts, []);
  assertEqual(r.sampleSize, 0);
  assertEqual(r.unscoreable, 2);
  assertEqual(r.accuracy, null);
});

test('Perfect record (all TP + TN) → accuracy 1.0 / 10000 bps', () => {
  const verdicts = [
    { ts: 1000, safe: false }, // will be TP
    { ts: 3000, safe: true },  // will be TN
  ];
  const telemetry = [
    { ts: 1100, arb_revert: 0.9, base_p99: 900 },  // adverse, right after verdict 1 → TP
    { ts: 3100, arb_revert: 0.01, base_p99: 20 },  // calm, right after verdict 2 → TN
  ];
  const r = scoreHistory(verdicts, telemetry, { windowSeconds: 900 });
  assertEqual(r.tp, 1); assertEqual(r.tn, 1); assertEqual(r.fp, 0); assertEqual(r.fn, 0);
  assertEqual(r.sampleSize, 2);
  assertEqual(r.accuracy, 1);
  assertEqual(r.accuracyBps, 10000);
  assertEqual(r.precision, 1);
  assertEqual(r.recall, 1);
});

test('Mixed record: 1 TP, 1 FP, 1 TN, 1 FN → accuracy = 0.5, bps = 5000', () => {
  const verdicts = [
    { ts: 1000, safe: false }, // TP: adverse follows
    { ts: 3000, safe: false }, // FP: nothing follows
    { ts: 5000, safe: true },  // TN: calm follows
    { ts: 7000, safe: true },  // FN: adverse follows
  ];
  const telemetry = [
    { ts: 1100, arb_revert: 0.9, base_p99: 900 },
    { ts: 3100, arb_revert: 0.01, base_p99: 20 },
    { ts: 5100, arb_revert: 0.02, base_p99: 30 },
    { ts: 7100, arb_revert: 0.8, base_p99: 950 },
  ];
  const r = scoreHistory(verdicts, telemetry, { windowSeconds: 900 });
  assertEqual(r.tp, 1); assertEqual(r.fp, 1); assertEqual(r.tn, 1); assertEqual(r.fn, 1);
  assertEqual(r.sampleSize, 4);
  assertEqual(r.accuracy, 0.5);
  assertEqual(r.accuracyBps, 5000);
  assertEqual(r.precision, 0.5); // tp/(tp+fp)
  assertEqual(r.recall, 0.5);    // tp/(tp+fn)
});

test('All false alarms (FP only) → accuracy 0, precision 0, recall null (no TP+FN)', () => {
  const verdicts = [{ ts: 1000, safe: false }, { ts: 3000, safe: false }];
  const telemetry = [
    { ts: 1100, arb_revert: 0.01, base_p99: 20 },
    { ts: 3100, arb_revert: 0.02, base_p99: 30 },
  ];
  const r = scoreHistory(verdicts, telemetry, { windowSeconds: 900 });
  assertEqual(r.fp, 2);
  assertEqual(r.accuracy, 0);
  assertEqual(r.precision, 0);
  assertEqual(r.recall, null, 'no TP and no FN means recall is undefined, not 0');
});

test('maxHistory keeps only the most recent N verdicts, by timestamp not array order', () => {
  // Deliberately out of order in the input array.
  const verdicts = [
    { ts: 5000, safe: true },  // most recent, calm → TN
    { ts: 1000, safe: false }, // oldest, would be TP — must be dropped by maxHistory:1
    { ts: 3000, safe: false }, // middle, would be FP — must be dropped too
  ];
  const telemetry = [
    { ts: 1100, arb_revert: 0.9, base_p99: 900 },
    { ts: 3100, arb_revert: 0.01, base_p99: 20 },
    { ts: 5100, arb_revert: 0.01, base_p99: 20 },
  ];
  const r = scoreHistory(verdicts, telemetry, { windowSeconds: 900, maxHistory: 1 });
  assertEqual(r.sampleSize, 1);
  assertEqual(r.tn, 1, 'only the newest verdict (ts=5000, TN) should survive maxHistory:1');
  assertEqual(r.tp, 0);
  assertEqual(r.fp, 0);
});

test('Default window is DEFAULT_WINDOW_SECONDS when none is given', () => {
  const verdicts = [{ ts: 1000, safe: false }];
  // Adverse sample sits just past the 15-minute default window.
  const telemetry = [{ ts: 1000 + DEFAULT_WINDOW_SECONDS + 1, arb_revert: 0.9, base_p99: 900 }];
  const r = scoreHistory(verdicts, telemetry);
  assertEqual(r.sampleSize, 0, 'sample outside the default window must be UNSCOREABLE, not TP');
  assertEqual(r.windowSeconds, DEFAULT_WINDOW_SECONDS);
});

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('✅ ALL TESTS PASSED');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED');
  process.exit(1);
}
