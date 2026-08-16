import { describe, test, expect } from 'vitest';
import {
  microWorkload, jitterStats, jitterVerdict, jitterSyntheticScore,
} from '../src/services/jitterProbe';

describe('microWorkload', () => {
  test('deterministic — same input, same output', () => {
    expect(microWorkload(256)).toBe(microWorkload(256));
  });
  test('does real work — output depends on rounds', () => {
    expect(microWorkload(64)).not.toBe(microWorkload(256));
  });
  test('returns an unsigned 32-bit int (not optimized to a constant 0)', () => {
    const v = microWorkload(256);
    expect(Number.isInteger(v)).toBe(true);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(0xffffffff);
  });
});

describe('jitterStats', () => {
  test('empty → all zero, no throw', () => {
    const s = jitterStats([]);
    expect(s.n).toBe(0);
    expect(s.cv).toBe(0);
  });
  test('constant series → zero variance / cv', () => {
    const s = jitterStats(Array(50).fill(100));
    expect(s.variance).toBe(0);
    expect(s.cv).toBe(0);
    expect(s.range).toBe(0);
  });
  test('cv is scale-free (stddev/mean)', () => {
    const s = jitterStats([90, 110, 90, 110, 90, 110]);
    expect(s.mean).toBeCloseTo(100, 5);
    expect(s.cv).toBeCloseTo(0.1, 2);
  });
  test('captures min/max/range', () => {
    const s = jitterStats([5, 9, 2, 7]);
    expect(s.min).toBe(2);
    expect(s.max).toBe(9);
    expect(s.range).toBe(7);
  });
});

describe('jitterVerdict', () => {
  test('flat: pinned/deterministic VM (near-constant timings) → flat', () => {
    // tiny spread around 100 → cv well under 3%, low entropy
    const flat = Array.from({ length: 100 }, (_, i) => 100 + (i % 2)); // 100/101 alternating
    const s = jitterStats(flat);
    expect(s.cv).toBeLessThan(0.03);
    expect(jitterVerdict(s)).toBe('flat');
  });
  test('organic: real hardware jitter (mean + natural spread + memory) → organic', () => {
    // base 500ns with correlated drift + noise → moderate cv, non-trivial entropy/autocorr
    const organic = Array.from({ length: 100 }, (_, i) =>
      500 + Math.round(60 * Math.sin(i / 6) + 40 * Math.sin(i / 2.3) + (i % 7) * 3));
    const s = jitterStats(organic);
    expect(jitterVerdict(s)).toBe('organic');
  });
  test('chaotic: heavy-tailed pseudo-random, no lag-1 memory → chaotic', () => {
    // LCG-random (decorrelated at lag-1) with a squared transform → heavy tail,
    // cv > 0.8, |autocorr| ~ 0 — i.e. artificial "Math.random()-style" jitter.
    let x = 12345;
    const rnd = () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; };
    const chaotic = Array.from({ length: 100 }, () => { const u = rnd(); return Math.round(u * u * 8000) + 1; });
    const s = jitterStats(chaotic);
    expect(s.cv).toBeGreaterThan(0.8);
    expect(Math.abs(s.autocorr)).toBeLessThan(0.12);
    expect(jitterVerdict(s)).toBe('chaotic');
  });
  test('insufficient: <10 samples', () => {
    expect(jitterVerdict(jitterStats([1, 2, 3]))).toBe('insufficient');
  });
});

describe('jitterSyntheticScore', () => {
  test('flat → high synthetic risk', () => {
    const s = jitterStats(Array.from({ length: 100 }, (_, i) => 100 + (i % 2)));
    expect(jitterSyntheticScore(s)).toBeGreaterThan(0.6);
  });
  test('organic → low risk', () => {
    const organic = Array.from({ length: 100 }, (_, i) =>
      500 + Math.round(60 * Math.sin(i / 6) + 40 * Math.sin(i / 2.3) + (i % 7) * 3));
    expect(jitterSyntheticScore(jitterStats(organic))).toBeLessThan(0.3);
  });
  test('insufficient data → 0.5 neutral (honest unknown)', () => {
    expect(jitterSyntheticScore(jitterStats([1, 2, 3]))).toBe(0.5);
  });
});
