/**
 * Phoenix Zero Casper Agent — Verdict Log Unit Tests
 * Same custom runner style as agent.test.js.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { formatVerdictLine, appendVerdict, readVerdicts } = require('./verdict_log');

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

// Isolated temp path per test run — must never touch the real data/ dir,
// otherwise tests would corrupt the agent's actual verdict history.
function tempLogPath() {
  return path.join(os.tmpdir(), `verdict_log_test_${Date.now()}_${Math.random().toString(36).slice(2)}.jsonl`);
}

console.log('\n🔵 formatVerdictLine');

test('Produces a single JSON line with a trailing newline', () => {
  const line = formatVerdictLine(1000, true, 0.02, 40);
  assert(line.endsWith('\n'), 'must end with newline for append-only reads');
  const parsed = JSON.parse(line.trim());
  assertEqual(parsed.ts, 1000);
  assertEqual(parsed.safe, true);
  assertEqual(parsed.arb_revert, 0.02);
  assertEqual(parsed.base_p99, 40);
});

console.log('\n🔵 appendVerdict / readVerdicts round-trip');

test('Nonexistent log file → empty array, no throw', () => {
  const p = tempLogPath();
  const result = readVerdicts(p);
  assertEqual(result.length, 0);
});

test('Single append is readable back with correct shape', () => {
  const p = tempLogPath();
  appendVerdict(1000, false, 0.72, 1144, p);
  const result = readVerdicts(p);
  assertEqual(result.length, 1);
  assertEqual(result[0].ts, 1000);
  assertEqual(result[0].safe, false);
  fs.unlinkSync(p);
});

test('Multiple appends preserve order and all fields', () => {
  const p = tempLogPath();
  appendVerdict(1000, true, 0.01, 20, p);
  appendVerdict(2000, false, 0.5, 700, p);
  appendVerdict(3000, true, 0.02, 30, p);
  const result = readVerdicts(p);
  assertEqual(result.length, 3);
  assertEqual(result[0].ts, 1000);
  assertEqual(result[1].safe, false);
  assertEqual(result[2].base_p99, 30);
  fs.unlinkSync(p);
});

test('Creates parent directory on first append if missing', () => {
  const dir = path.join(os.tmpdir(), `verdict_log_test_dir_${Date.now()}`);
  const p = path.join(dir, 'nested', 'verdict_log.jsonl');
  assert(!fs.existsSync(dir), 'sanity: dir must not pre-exist');
  appendVerdict(1000, true, 0.01, 20, p);
  assert(fs.existsSync(p), 'file should now exist after mkdir+append');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('Corrupt/partial last line is skipped, not fatal', () => {
  const p = tempLogPath();
  appendVerdict(1000, true, 0.01, 20, p);
  fs.appendFileSync(p, '{"ts": 2000, "safe": tru', 'utf8'); // simulated truncated write, no trailing \n
  const result = readVerdicts(p);
  assertEqual(result.length, 1, 'only the one well-formed line should survive');
  assertEqual(result[0].ts, 1000);
  fs.unlinkSync(p);
});

test('Lines missing required fields are filtered out', () => {
  const p = tempLogPath();
  fs.writeFileSync(p, JSON.stringify({ ts: 1000 }) + '\n', 'utf8'); // no `safe`
  const result = readVerdicts(p);
  assertEqual(result.length, 0);
  fs.unlinkSync(p);
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
