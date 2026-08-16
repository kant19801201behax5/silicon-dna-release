import { describe, test, expect } from 'vitest';
import { P2Quantile, PageHinkley, DriftAdaptiveThreshold } from '../src/services/driftModel';

// deterministic PRNG so the statistical assertions are reproducible
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('P2Quantile (P² algorithm)', () => {
  test('estimates the median of a uniform stream', () => {
    const q = new P2Quantile(0.5);
    const rnd = mulberry32(1);
    for (let i = 0; i < 20000; i++) q.observe(rnd());
    expect(Math.abs(q.value - 0.5)).toBeLessThan(0.03);
  });

  test('estimates a high quantile of a uniform stream', () => {
    const q = new P2Quantile(0.9);
    const rnd = mulberry32(2);
    for (let i = 0; i < 20000; i++) q.observe(rnd());
    expect(Math.abs(q.value - 0.9)).toBeLessThan(0.03);
  });

  test('is O(1) memory yet order-insensitive to a reasonable degree', () => {
    // shuffled 1..1000 → p50 ≈ 500
    const vals = Array.from({ length: 1000 }, (_, i) => i + 1);
    const rnd = mulberry32(7);
    for (let i = vals.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [vals[i], vals[j]] = [vals[j], vals[i]]; }
    const q = new P2Quantile(0.5);
    vals.forEach((v) => q.observe(v));
    expect(q.value).toBeGreaterThan(450);
    expect(q.value).toBeLessThan(550);
  });

  test('returns the exact quantile before 5 samples', () => {
    const q = new P2Quantile(0.5);
    q.observe(10); q.observe(30); q.observe(20);
    expect(q.count).toBe(3);
    expect(q.value).toBe(20); // median of {10,20,30}
  });

  test('rejects an out-of-range p', () => {
    expect(() => new P2Quantile(0)).toThrow();
    expect(() => new P2Quantile(1)).toThrow();
  });

  test('ignores non-finite input', () => {
    const q = new P2Quantile(0.5);
    [1, 2, NaN, 3, Infinity, 4, 5].forEach((v) => q.observe(v));
    expect(q.count).toBe(5); // NaN/Infinity skipped
  });
});

describe('PageHinkley change detector', () => {
  test('stays quiet on a stationary stream', () => {
    const ph = new PageHinkley({ delta: 0.01, lambda: 20 });
    const rnd = mulberry32(3);
    let anyDrift = false;
    for (let i = 0; i < 1000; i++) anyDrift = ph.observe(10 + (rnd() - 0.5)).drift || anyDrift;
    expect(anyDrift).toBe(false);
  });

  test('detects an upward mean shift', () => {
    const ph = new PageHinkley({ delta: 0.01, lambda: 20 });
    const rnd = mulberry32(4);
    for (let i = 0; i < 500; i++) ph.observe(10 + (rnd() - 0.5)); // stationary
    let detected = false;
    for (let i = 0; i < 100 && !detected; i++) detected = ph.observe(30 + (rnd() - 0.5)).drift;
    expect(detected).toBe(true);
  });

  test('detects a downward mean shift', () => {
    const ph = new PageHinkley({ delta: 0.01, lambda: 20 });
    const rnd = mulberry32(5);
    for (let i = 0; i < 500; i++) ph.observe(50 + (rnd() - 0.5));
    let detected = false;
    for (let i = 0; i < 100 && !detected; i++) detected = ph.observe(10 + (rnd() - 0.5)).drift;
    expect(detected).toBe(true);
  });
});

describe('DriftAdaptiveThreshold', () => {
  test('returns the floor during warmup, then a clamped adaptive value', () => {
    const d = new DriftAdaptiveThreshold({ quantile: 0.1, floor: 1, ceil: 5, margin: 1.5, warmup: 50 });
    for (let i = 0; i < 10; i++) d.observe(2 + i * 0.1);
    expect(d.ready).toBe(false);
    expect(d.threshold).toBe(1); // floor during warmup
    for (let i = 0; i < 100; i++) d.observe(2 + (i % 10) * 0.05);
    expect(d.ready).toBe(true);
    expect(d.threshold).toBeGreaterThanOrEqual(1);
    expect(d.threshold).toBeLessThanOrEqual(5);
  });

  test('clamps to ceil no matter how large the samples get', () => {
    const d = new DriftAdaptiveThreshold({ quantile: 0.5, floor: 1, ceil: 5, warmup: 20 });
    for (let i = 0; i < 200; i++) d.observe(1000); // absurdly large legit signal
    expect(d.threshold).toBe(5);
  });

  test('clamps to floor no matter how small the samples get', () => {
    const d = new DriftAdaptiveThreshold({ quantile: 0.5, floor: 1, ceil: 5, warmup: 20 });
    for (let i = 0; i < 200; i++) d.observe(-1000);
    expect(d.threshold).toBe(1);
  });

  test('transitions warmup → stable → drift and counts drift events', () => {
    const d = new DriftAdaptiveThreshold({
      quantile: 0.5, floor: 0, ceil: 1000, warmup: 50, ph: { delta: 0.01, lambda: 20 },
    });
    const rnd = mulberry32(9);
    for (let i = 0; i < 300; i++) d.observe(10 + (rnd() - 0.5));
    expect(d.status).toBe('stable');
    expect(d.drifts).toBe(0);
    let sawDrift = false;
    for (let i = 0; i < 200; i++) { d.observe(60 + (rnd() - 0.5)); if (d.status === 'drift') sawDrift = true; }
    expect(sawDrift).toBe(true);
    expect(d.drifts).toBeGreaterThanOrEqual(1);
  });

  test('snapshot exposes the fields the metrics endpoint needs', () => {
    const d = new DriftAdaptiveThreshold({ quantile: 0.1, floor: 1, ceil: 5, warmup: 5 });
    for (let i = 0; i < 30; i++) d.observe(2);
    const s = d.snapshot();
    expect(s).toHaveProperty('threshold');
    expect(s).toHaveProperty('status');
    expect(s).toHaveProperty('samples');
    expect(s).toHaveProperty('drifts');
    expect(s.samples).toBe(30);
  });

  test('rejects floor > ceil', () => {
    expect(() => new DriftAdaptiveThreshold({ quantile: 0.5, floor: 5, ceil: 1 })).toThrow();
  });
});
