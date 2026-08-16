import { describe, test, expect } from 'vitest';
import crypto from 'crypto';
import {
  blind,
  blindEvaluate,
  finalize,
  evaluate,
  deserializeElement,
  serializeElement,
  hashToGroup,
  randomScalar,
  parseSecretKey,
  publicKey,
  PrivacyPassIssuer,
  SUITE,
  SUITE_MODE,
} from '../src/services/privacyPass';

const hexToBytes = (h: string) => Uint8Array.from(Buffer.from(h, 'hex'));

// ── RFC 9497 §A.4.1.1 — OPRF(P-384, SHA-384), Base Mode, Test Vector 1 ────────
// These are the canonical known-answer values published in the RFC. If any single
// step of the implementation drifts, one of these equalities breaks.
const RFC = {
  skSm: 'dfe7ddc41a4646901184f2b432616c8ba6d452f9bcd0c4f75a5150ef2b2ed02ef40b8b92f60ae591bcabd72a6518f188',
  Input: '00',
  Blind: '504650f53df8f16f6861633388936ea23338fa65ec36e0290022b48eb562889d89dbfa691d1cde91517fa222ed7ad364',
  BlindedElement: '02a36bc90e6db34096346eaf8b7bc40ee1113582155ad3797003ce614c835a874343701d3f2debbd80d97cbe45de6e5f1f',
  EvaluationElement: '03af2a4fc94770d7a7bf3187ca9cc4faf3732049eded2442ee50fbddda58b70ae2999366f72498cdbc43e6f2fc184afe30',
  Output: 'ed84ad3f31a552f0456e58935fcc0a3039db42e7f356dcb32aa6d487b6b815a07d5813641fb1398c03ddab5763874357',
};

describe('OPRF core — RFC 9497 known-answer test', () => {
  const input = hexToBytes(RFC.Input);
  const skS = BigInt('0x' + RFC.skSm);
  const blindScalar = BigInt('0x' + RFC.Blind);

  test('Blind reproduces the RFC BlindedElement', () => {
    const { blindedElement } = blind(input, blindScalar);
    expect(blindedElement).toBe(RFC.BlindedElement);
  });

  test('BlindEvaluate reproduces the RFC EvaluationElement', () => {
    expect(blindEvaluate(skS, RFC.BlindedElement)).toBe(RFC.EvaluationElement);
  });

  test('Finalize reproduces the RFC Output', () => {
    expect(finalize(input, blindScalar, RFC.EvaluationElement)).toBe(RFC.Output);
  });

  test('server-direct evaluate reproduces the same Output (redemption path)', () => {
    // The server recomputes the token output from (skS, input) WITHOUT the blind —
    // this is exactly what redemption relies on.
    expect(evaluate(skS, input)).toBe(RFC.Output);
  });

  test('suite identifiers match RFC (mode 0x00, P-384/SHA-384)', () => {
    expect(SUITE).toBe('OPRF(P-384, SHA-384)');
    expect(SUITE_MODE).toBe(0x00);
  });
});

describe('OPRF round-trip with random blinds', () => {
  test('client blind → server evaluate → client finalize == server direct', () => {
    const skS = randomScalar();
    const nonce = crypto.randomBytes(32);
    const { blind: r, blindedElement } = blind(nonce);
    const evaluated = blindEvaluate(skS, blindedElement);
    const clientOut = finalize(nonce, r, evaluated);
    const serverOut = evaluate(skS, nonce);
    expect(clientOut).toBe(serverOut);
  });

  test('unlinkability: two blinds of the same input produce different blinded elements', () => {
    const nonce = crypto.randomBytes(32);
    const a = blind(nonce).blindedElement;
    const b = blind(nonce).blindedElement;
    expect(a).not.toBe(b); // random blind masks the input
  });

  test('a different key yields a different output for the same input', () => {
    const nonce = crypto.randomBytes(32);
    expect(evaluate(randomScalar(), nonce)).not.toBe(evaluate(randomScalar(), nonce));
  });
});

describe('element (de)serialization', () => {
  test('round-trips a valid element', () => {
    const el = hashToGroup(crypto.randomBytes(16));
    expect(serializeElement(deserializeElement(serializeElement(el)))).toBe(serializeElement(el));
  });
  test('rejects wrong length', () => {
    expect(() => deserializeElement('02abcd')).toThrow();
  });
  test('rejects non-hex', () => {
    expect(() => deserializeElement('zz'.repeat(49))).toThrow();
  });
  test('rejects off-curve bytes', () => {
    expect(() => deserializeElement('02' + 'ff'.repeat(48))).toThrow();
  });
});

describe('key helpers', () => {
  test('parseSecretKey accepts the RFC key and rejects bad ones', () => {
    expect(parseSecretKey(RFC.skSm)).toBe(BigInt('0x' + RFC.skSm));
    expect(() => parseSecretKey('00')).toThrow();          // wrong length
    expect(() => parseSecretKey('gg'.repeat(48))).toThrow(); // non-hex
  });
  test('publicKey(skS) is a valid 49-byte compressed element', () => {
    const pk = publicKey(randomScalar());
    expect(pk).toMatch(/^0[23][0-9a-f]{96}$/);
    expect(() => deserializeElement(pk)).not.toThrow();
  });
  test('randomScalar is in range and (practically) unique', () => {
    const a = randomScalar(); const b = randomScalar();
    expect(a).toBeGreaterThan(0n);
    expect(a).not.toBe(b);
  });
});

// ── high-level issuer / one-time redemption lifecycle ─────────────────────────
describe('PrivacyPassIssuer', () => {
  // Emulate a client obtaining and redeeming a token against the issuer.
  function mintToken(issuer: PrivacyPassIssuer) {
    const nonce = crypto.randomBytes(32);
    const { blind: r, blindedElement } = blind(nonce);
    const [evaluated] = issuer.issueBatch([blindedElement]);
    const output = finalize(nonce, r, evaluated);
    return { nonceHex: Buffer.from(nonce).toString('hex'), output };
  }

  test('config advertises the suite and public key', () => {
    const issuer = new PrivacyPassIssuer();
    const cfg = issuer.config();
    expect(cfg.suite).toBe(SUITE);
    expect(cfg.mode).toBe(0x00);
    expect(cfg.publicKey).toMatch(/^0[23][0-9a-f]{96}$/);
    expect(cfg.maxBatch).toBeGreaterThan(0);
  });

  test('a freshly minted token redeems exactly once', () => {
    const issuer = new PrivacyPassIssuer();
    const { nonceHex, output } = mintToken(issuer);
    expect(issuer.redeem(nonceHex, output)).toEqual({ valid: true });
    // replay:
    expect(issuer.redeem(nonceHex, output)).toEqual({ valid: false, reason: 'TOKEN_ALREADY_SPENT' });
    expect(issuer.stats.redeemed).toBe(1);
    expect(issuer.stats.rejected).toBe(1);
    expect(issuer.spentSize).toBe(1);
  });

  test('forged output for a fresh nonce is rejected (unforgeable without skS)', () => {
    const issuer = new PrivacyPassIssuer();
    const nonceHex = crypto.randomBytes(32).toString('hex');
    const forged = crypto.randomBytes(48).toString('hex');
    expect(issuer.redeem(nonceHex, forged)).toEqual({ valid: false, reason: 'TOKEN_INVALID' });
    expect(issuer.spentSize).toBe(0); // invalid tokens are not consumed
  });

  test('a token is not redeemable at a different issuer (key isolation)', () => {
    const issuerA = new PrivacyPassIssuer();
    const issuerB = new PrivacyPassIssuer();
    const { nonceHex, output } = mintToken(issuerA);
    expect(issuerB.redeem(nonceHex, output).valid).toBe(false);
    expect(issuerA.redeem(nonceHex, output).valid).toBe(true);
  });

  test('malformed nonce / output are rejected without crashing', () => {
    const issuer = new PrivacyPassIssuer();
    expect(issuer.redeem('nothex', 'ab'.repeat(48))).toEqual({ valid: false, reason: 'MALFORMED_NONCE' });
    expect(issuer.redeem('aa', 'ab'.repeat(48))).toEqual({ valid: false, reason: 'MALFORMED_NONCE' }); // too short
    expect(issuer.redeem('aa'.repeat(32), 'short')).toEqual({ valid: false, reason: 'MALFORMED_OUTPUT' });
  });

  test('issueBatch enforces batch bounds', () => {
    const issuer = new PrivacyPassIssuer({ maxBatch: 3 });
    const one = blind(crypto.randomBytes(8)).blindedElement;
    expect(() => issuer.issueBatch([])).toThrow();
    expect(() => issuer.issueBatch([one, one, one, one])).toThrow(); // 4 > 3
    expect(issuer.issueBatch([one, one]).length).toBe(2);
    expect(issuer.stats.issued).toBe(2);
  });

  test('a fixed key reproduces deterministic redemption across instances', () => {
    const issuer1 = new PrivacyPassIssuer({ keyHex: RFC.skSm });
    const issuer2 = new PrivacyPassIssuer({ keyHex: RFC.skSm });
    expect(issuer1.publicKeyHex).toBe(issuer2.publicKeyHex);
    const { nonceHex, output } = mintToken(issuer1);
    // minted against issuer1, redeemable against issuer2 because they share the key
    expect(issuer2.redeem(nonceHex, output).valid).toBe(true);
  });

  test('batch issuance → each token redeems independently, once', () => {
    const issuer = new PrivacyPassIssuer();
    const nonces = [0, 1, 2].map(() => crypto.randomBytes(32));
    const blinds = nonces.map((n) => blind(n));
    const evaluated = issuer.issueBatch(blinds.map((b) => b.blindedElement));
    const tokens = nonces.map((n, i) => ({
      nonceHex: Buffer.from(n).toString('hex'),
      output: finalize(n, blinds[i].blind, evaluated[i]),
    }));
    for (const t of tokens) expect(issuer.redeem(t.nonceHex, t.output).valid).toBe(true);
    // all spent now
    for (const t of tokens) expect(issuer.redeem(t.nonceHex, t.output).valid).toBe(false);
    expect(issuer.stats.redeemed).toBe(3);
  });
});
