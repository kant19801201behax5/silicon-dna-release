'use strict';
/**
 * Append-only verdict log — the real data source behind reputation_scorer.js.
 * Same pattern as src/db/persist.ts's logEvent() (append-only JSONL), kept
 * as its own small module (like spending-limit.js) so it stays independently
 * testable and agent.js's require('./verdict_log') doesn't drag in fs mocks.
 *
 * Without this, reputation_scorer.js would have a correct formula and
 * nothing real to run it on — same "empty shell" failure mode already found
 * once this session in a different feature. Logging happens unconditionally
 * for every cycle (safe or unsafe, dry-run or executed), because the score
 * needs the oracle's full track record, not just the calls it acted on.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const VERDICT_LOG_PATH = path.join(DATA_DIR, 'verdict_log.jsonl');

function formatVerdictLine(ts, safe, arbRevert, baseP99) {
  return JSON.stringify({ ts, safe, arb_revert: arbRevert, base_p99: baseP99 }) + '\n';
}

function appendVerdict(ts, safe, arbRevert, baseP99, logPath = VERDICT_LOG_PATH) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, formatVerdictLine(ts, safe, arbRevert, baseP99), 'utf8');
}

// Tolerant of a corrupt/partial last line (e.g. process killed mid-write) —
// skip lines that don't parse rather than throwing away the whole log.
function readVerdicts(logPath = VERDICT_LOG_PATH) {
  if (!fs.existsSync(logPath)) return [];
  const raw = fs.readFileSync(logPath, 'utf8');
  return raw
    .split('\n')
    .filter(Boolean)
    .map(line => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(v => v && typeof v.ts === 'number' && typeof v.safe === 'boolean');
}

module.exports = { formatVerdictLine, appendVerdict, readVerdicts, VERDICT_LOG_PATH, DATA_DIR };
