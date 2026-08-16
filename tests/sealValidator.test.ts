import { describe, test, expect, beforeEach, vi } from 'vitest';
import crypto from 'crypto';

// Mock rhythmManager to isolate sealValidator
vi.mock('../src/services/rhythmManager', () => ({
  getTrustStatus: vi.fn(() => 0.9), // default: high trust, no argon2 required
}));

import { verifyEntropySeal } from '../src/services/sealValidator';

// ── Helpers ───────────────────────────────────────────────────────────────────
function buildSeal(
  sharedSecret: Buffer,
  sessionId: string,
  seq: number,
  noise: string,
  tsOverride?: number
): string {
  const hmac = crypto.createHmac('sha256', sharedSecret);
  hmac.update(sessionId);
  hmac.update(seq.toString());
  hmac.update(noise);
  const sig = hmac.digest('hex');
  const ts = (tsOverride ?? Date.now()) * 1000; // microseconds
  return Buffer.from(JSON.stringify({ sig, ts, seq })).toString('base64');
}

const SECRET = crypto.randomBytes(32);
const SESSION = 'default';
const NOISE = '12,5,18,3,22,7,14,9';

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('verifyEntropySeal', () => {
  test('valid seal passes verification', () => {
    const seal = buildSeal(SECRET, SESSION, 1, NOISE);
    const { valid, requiresArgon2 } = verifyEntropySeal(SESSION, seal, NOISE, 1, SECRET);
    expect(valid).toBe(true);
    expect(requiresArgon2).toBe(false); // trust = 0.9 > 0.7 threshold
  });

  test('missing seal header → invalid', () => {
    const { valid } = verifyEntropySeal(SESSION, undefined, NOISE, 1, SECRET);
    expect(valid).toBe(false);
  });

  test('wrong sequence number → invalid (replay / de-sync)', () => {
    const seal = buildSeal(SECRET, SESSION, 5, NOISE); // seq=5
    const { valid } = verifyEntropySeal(SESSION, seal, NOISE, 3, SECRET); // expects seq=3
    expect(valid).toBe(false);
  });

  test('wrong signature (tampered noise) → invalid', () => {
    const seal = buildSeal(SECRET, SESSION, 1, NOISE);
    const tamperedNoise = '0,0,0,0,0,0,0,0'; // noise changed after signing
    const { valid } = verifyEntropySeal(SESSION, seal, tamperedNoise, 1, SECRET);
    expect(valid).toBe(false);
  });

  test('wrong shared secret → invalid (MITM scenario)', () => {
    const seal = buildSeal(SECRET, SESSION, 1, NOISE);
    const wrongSecret = crypto.randomBytes(32);
    const { valid } = verifyEntropySeal(SESSION, seal, NOISE, 1, wrongSecret);
    expect(valid).toBe(false);
  });

  test('stale seal beyond window+skew → invalid (anti-replay)', () => {
    // window is 5s + 30s clock-skew tolerance; 40s ago is genuinely stale
    const staleTs = Date.now() - 40_000;
    const seal = buildSeal(SECRET, SESSION, 1, NOISE, staleTs);
    const { valid } = verifyEntropySeal(SESSION, seal, NOISE, 1, SECRET);
    expect(valid).toBe(false);
  });

  test('slightly-ahead client clock → ACCEPTED (clock-skew tolerance, real-world fix)', () => {
    // Regression: a client ~0.4s ahead of the server used to be rejected (age<0),
    // which broke every real client (browsers behind Cloudflare). Now tolerated.
    const aheadTs = Date.now() + 400; // 0.4s in the future
    const seal = buildSeal(SECRET, SESSION, 1, NOISE, aheadTs);
    const { valid } = verifyEntropySeal(SESSION, seal, NOISE, 1, SECRET);
    expect(valid).toBe(true);
  });

  test('absurd future timestamp beyond skew tolerance → rejected', () => {
    const futureTs = Date.now() + 40_000; // 40s ahead — beyond 30s skew
    const seal = buildSeal(SECRET, SESSION, 1, NOISE, futureTs);
    const { valid } = verifyEntropySeal(SESSION, seal, NOISE, 1, SECRET);
    expect(valid).toBe(false);
  });

  test('malformed base64 → invalid (no crash)', () => {
    const { valid } = verifyEntropySeal(SESSION, 'NOT_VALID_B64!!!', NOISE, 1, SECRET);
    expect(valid).toBe(false);
  });

  test('low trust score triggers requiresArgon2', async () => {
    const { getTrustStatus } = await import('../src/services/rhythmManager');
    vi.mocked(getTrustStatus).mockReturnValueOnce(0.5); // below 0.7 threshold

    const seal = buildSeal(SECRET, SESSION, 1, NOISE);
    const { valid, requiresArgon2 } = verifyEntropySeal(SESSION, seal, NOISE, 1, SECRET);
    expect(valid).toBe(true);
    expect(requiresArgon2).toBe(true);
  });

  test('sequential seals pass correctly (seq monotone)', () => {
    for (let seq = 1; seq <= 5; seq++) {
      const seal = buildSeal(SECRET, SESSION, seq, NOISE);
      const { valid } = verifyEntropySeal(SESSION, seal, NOISE, seq, SECRET);
      expect(valid).toBe(true);
    }
  });
});
