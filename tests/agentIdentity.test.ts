import { describe, test, expect } from 'vitest';
import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';
import {
  verifyEip191, eip191Hash, recoverAddress, credentialMessage,
  verifyAgentCredential, agentTrustDecision, type AgentCredential,
} from '../src/services/agentIdentity';

// Test signer: real secp256k1 key, sign exactly like a wallet's personal_sign.
const priv = keccak_256(new TextEncoder().encode('silicon-dna-test-key-1'));
const pubUncompressed = secp256k1.getPublicKey(priv, false);
const ADDR = '0x' + Buffer.from(keccak_256(pubUncompressed.slice(1)).slice(-20)).toString('hex');

function personalSign(message: string, key: Uint8Array = priv): string {
  const sig = secp256k1.sign(eip191Hash(message), key);
  const rec = sig.recovery; // 0/1
  const rs = sig.toCompactRawBytes();
  return '0x' + Buffer.from(rs).toString('hex') + (27 + rec).toString(16).padStart(2, '0');
}

describe('verifyEip191 — real ecrecover', () => {
  test('recovers the exact signer address', () => {
    expect(verifyEip191('hello world', personalSign('hello world'))).toBe(ADDR);
  });
  test('wrong message → different/failed recovery, not the signer', () => {
    expect(verifyEip191('tampered', personalSign('hello world'))).not.toBe(ADDR);
  });
  test('garbage signature → null', () => {
    expect(verifyEip191('x', '0xdeadbeef')).toBeNull();
    expect(verifyEip191('x', 'not-hex')).toBeNull();
  });
  test('recoverAddress handles v=27/28 and 0/1 encodings', () => {
    const sig = secp256k1.sign(eip191Hash('m'), priv);
    const rs = Buffer.from(sig.toCompactRawBytes()).toString('hex');
    const v27 = '0x' + rs + (27 + sig.recovery).toString(16).padStart(2, '0');
    const v01 = '0x' + rs + sig.recovery.toString(16).padStart(2, '0');
    expect(recoverAddress(eip191Hash('m'), v27)).toBe(ADDR);
    expect(recoverAddress(eip191Hash('m'), v01)).toBe(ADDR);
  });
});

describe('verifyAgentCredential', () => {
  const base: AgentCredential = {
    agentId: 'phoenix-oracle-agent',
    issuer: ADDR,
    reputation: 7200,
    expiry: 9999999999,
    nonce: 'n-1',
  };
  const sign = (c: AgentCredential, key?: Uint8Array) => personalSign(credentialMessage(c), key);

  test('valid credential signed by issuer → valid', () => {
    const r = verifyAgentCredential(base, sign(base));
    expect(r.valid).toBe(true);
    expect(r.agentId).toBe('phoenix-oracle-agent');
    expect(r.reputation).toBe(7200);
    expect(r.signer).toBe(ADDR);
  });
  test('expired → rejected', () => {
    const r = verifyAgentCredential({ ...base, expiry: 1 }, sign({ ...base, expiry: 1 }), { nowSec: 1000 });
    expect(r.valid).toBe(false);
    expect(r.reason).toBe('EXPIRED');
  });
  test('signature by a different key (signer != issuer) → SIGNER_MISMATCH', () => {
    const otherKey = keccak_256(new TextEncoder().encode('attacker-key'));
    const r = verifyAgentCredential(base, sign(base, otherKey));
    expect(r.valid).toBe(false);
    expect(r.reason).toBe('SIGNER_MISMATCH');
  });
  test('tampered reputation after signing → SIGNER_MISMATCH (sig no longer matches)', () => {
    const sig = sign(base);
    const r = verifyAgentCredential({ ...base, reputation: 10000 }, sig);
    expect(r.valid).toBe(false);
  });
  test('untrusted issuer allowlist → rejected', () => {
    const r = verifyAgentCredential(base, sign(base), { trustedIssuers: new Set(['0xother']) });
    expect(r.valid).toBe(false);
    expect(r.reason).toBe('UNTRUSTED_ISSUER');
  });
  test('bad issuer / reputation shapes rejected', () => {
    expect(verifyAgentCredential({ ...base, issuer: 'nope' }, 'x').reason).toBe('BAD_ISSUER');
    expect(verifyAgentCredential({ ...base, reputation: 99999 }, 'x').reason).toBe('BAD_REPUTATION');
  });
});

describe('agentTrustDecision', () => {
  const ok = { valid: true, reason: 'OK', reputation: 7000, signer: ADDR };
  test('verified reputable agent → ALLOW even with automated behavior', () =>
    expect(agentTrustDecision(ok, 0.6)).toBe('ALLOW'));
  test('verified agent with extreme behavior → STEP_UP', () =>
    expect(agentTrustDecision(ok, 0.97)).toBe('STEP_UP'));
  test('no credential + high risk → DENY', () =>
    expect(agentTrustDecision({ valid: false, reason: 'X' }, 0.85)).toBe('DENY'));
  test('no credential + low risk → ALLOW', () =>
    expect(agentTrustDecision({ valid: false, reason: 'X' }, 0.2)).toBe('ALLOW'));
  test('low-reputation verified agent + mid risk → STEP_UP', () =>
    expect(agentTrustDecision({ valid: true, reason: 'OK', reputation: 1000 }, 0.6)).toBe('STEP_UP'));
});
