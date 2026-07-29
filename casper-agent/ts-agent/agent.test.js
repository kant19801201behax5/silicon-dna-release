/**
 * Phoenix Zero Casper Agent — Unit Tests
 * Tests oracle safety logic, thresholds, and agent decision making
 */

'use strict';

// ── Inline the logic from agent.js for testing ────────────────────────────────
const ARB_REVERT_MAX = 0.15;
const BASE_P99_MAX   = 500;

function computeSafety(arbRevert, baseP99, serverSafe) {
  const metricsOk = arbRevert < ARB_REVERT_MAX && baseP99 < BASE_P99_MAX;
  return serverSafe && metricsOk;
}

function parseOracleResponse(feedData, healthData) {
  const latest     = feedData.data[feedData.data.length - 1];
  const arbRevert  = parseFloat(latest.arb_revert  || 0);
  const baseRevert = parseFloat(latest.base_revert || 0);
  const arbP99     = parseInt(latest.arb_p99  || 0);
  const baseP99    = parseInt(latest.base_p99 || 0);
  const serverSafe = healthData.safe === true;
  return {
    safe:       computeSafety(arbRevert, baseP99, serverSafe),
    arbRevert,  baseRevert, arbP99, baseP99, serverSafe,
  };
}

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

// ── Oracle safety logic tests ─────────────────────────────────────────────────
console.log('\n🔵 Oracle Safety Logic');

test('Normal conditions → safe', () => {
  assert(computeSafety(0.04, 45, true), 'Should be safe: arb=4%, p99=45ms');
});

test('arb_revert exactly at threshold (14.9%) → safe', () => {
  assert(computeSafety(0.149, 100, true), 'Should be safe: 14.9% < 15%');
});

test('arb_revert at threshold (15.0%) → unsafe', () => {
  assert(!computeSafety(0.15, 100, true), 'Should be unsafe: 15% = threshold');
});

test('MEV war May 31: arb_revert=72.1% → unsafe', () => {
  assert(!computeSafety(0.721, 1144, true), 'MEV war must be unsafe');
});

test('base_p99=697ms (above 500ms) → unsafe', () => {
  assert(!computeSafety(0.0, 697, true), 'p99=697ms exceeds threshold');
});

test('base_p99=499ms (below 500ms) → safe', () => {
  assert(computeSafety(0.05, 499, true), 'p99=499ms is safe');
});

test('server_safe=false → unsafe regardless of metrics', () => {
  assert(!computeSafety(0.01, 10, false), 'Server down = unsafe');
});

test('server_safe=true + good metrics → safe', () => {
  assert(computeSafety(0.05, 100, true), 'All good = safe');
});

// ── Oracle response parsing tests ─────────────────────────────────────────────
console.log('\n🔵 Oracle Response Parsing');

const mockFeed = {
  data: [
    { ts: 1748900000, arb_revert: '0.04', base_revert: '0.02', arb_p99: '45', base_p99: '52' }
  ]
};
const mockHealth = { safe: true, health: 'operational' };

test('Parses feed and health correctly', () => {
  const result = parseOracleResponse(mockFeed, mockHealth);
  assertEqual(result.arbRevert, 0.04, 'arb_revert parsed');
  assertEqual(result.baseP99, 52, 'base_p99 parsed');
  assertEqual(result.safe, true, 'safe computed correctly');
});

test('Handles null/missing values gracefully', () => {
  const feed = { data: [{ ts: 1, arb_revert: null, base_revert: null, arb_p99: null, base_p99: null }] };
  const result = parseOracleResponse(feed, mockHealth);
  assertEqual(result.arbRevert, 0, 'null arb_revert → 0');
  assertEqual(result.baseP99, 0, 'null base_p99 → 0');
  assertEqual(result.safe, true, 'safe when all zeros');
});

test('MEV war scenario parsed correctly', () => {
  const mevFeed = {
    data: [{ ts: 1748649600, arb_revert: '0.721', base_revert: '0.426', arb_p99: '980', base_p99: '1144' }]
  };
  const result = parseOracleResponse(mevFeed, mockHealth);
  assertEqual(result.safe, false, 'MEV war must be unsafe');
  assert(result.arbRevert > 0.7, 'High revert ratio');
  assert(result.baseP99 > 1000, 'High p99');
});

test('Uses LAST data point from feed array', () => {
  const multiFeed = {
    data: [
      { ts: 1, arb_revert: '0.9', base_revert: '0.9', arb_p99: '999', base_p99: '999' },
      { ts: 2, arb_revert: '0.02', base_revert: '0.01', arb_p99: '40', base_p99: '50' },
    ]
  };
  const result = parseOracleResponse(multiFeed, mockHealth);
  assertEqual(result.safe, true, 'Uses latest (safe) data point');
});

// ── Basis points conversion tests ─────────────────────────────────────────────
console.log('\n🔵 Basis Points (for contract storage)');

test('0.15 → 1500 bps', () => {
  assertEqual(Math.round(0.15 * 10000), 1500, 'ARB threshold in bps');
});

test('0.721 → 7210 bps (MEV war)', () => {
  assertEqual(Math.round(0.721 * 10000), 7210, 'MEV war in bps');
});

test('0.0 → 0 bps', () => {
  assertEqual(Math.round(0.0 * 10000), 0, 'Zero revert');
});

// ── Spending limiter tests (smart-account-style guardrail) ───────────────────
console.log('\n🔵 Spending Limiter (x402 daily cap)');
const { SpendingLimiter } = require('./spending-limit');

test('Allows spend under the cap', () => {
  const l = new SpendingLimiter(1.00);
  assert(l.canSpend(0.50), 'Should allow $0.50 against $1.00 cap');
});

test('Blocks spend over the cap', () => {
  const l = new SpendingLimiter(1.00);
  assert(!l.canSpend(1.50), 'Should block $1.50 against $1.00 cap');
});

test('Tracks cumulative spend within the same day', () => {
  const l = new SpendingLimiter(1.00);
  l.recordSpend(0.60);
  assert(!l.canSpend(0.60), '$0.60 + $0.60 exceeds $1.00 cap');
  assert(l.canSpend(0.40), '$0.60 + $0.40 is exactly at the cap');
});

test('recordSpend throws once the cap would be exceeded', () => {
  const l = new SpendingLimiter(1.00);
  l.recordSpend(1.00);
  let threw = false;
  try { l.recordSpend(0.01); } catch (e) { threw = true; }
  assert(threw, 'recordSpend should throw when over cap, not silently over-spend');
});

test('remaining() reflects spend so far', () => {
  const l = new SpendingLimiter(1.00);
  l.recordSpend(0.30);
  assertEqual(l.remaining().toFixed(2), '0.70', 'Remaining budget after $0.30 spent');
});

test('constructor rejects a non-positive limit', () => {
  let threw = false;
  try { new SpendingLimiter(0); } catch (e) { threw = true; }
  assert(threw, 'A zero or negative daily limit is not a valid guardrail');
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
