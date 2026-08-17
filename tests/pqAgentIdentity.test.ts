import { describe, test, expect } from 'vitest';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import {
  mlDsaFingerprint,
  verifyMlDsaCredential,
  credentialMessage,
  agentTrustDecision,
  ML_DSA_PUBLICKEY_BYTES,
  ML_DSA_SIGNATURE_BYTES,
  type AgentCredential,
} from '../src/services/agentIdentity';

const enc = new TextEncoder();
const hex = (u: Uint8Array) => Buffer.from(u).toString('hex');

// Deterministic ML-DSA-65 keypair from a fixed seed (FIPS 204 keygen is
// seed-deterministic; signing is hedged/randomized).
function keypair(seedByte: number) {
  const seed = Uint8Array.from(Array(32).fill(seedByte));
  return ml_dsa65.keygen(seed);
}

function signCredential(c: AgentCredential, secretKey: Uint8Array): string {
  return hex(ml_dsa65.sign(enc.encode(credentialMessage(c)), secretKey));
}

function makeCredential(pk: Uint8Array, over: Partial<AgentCredential> = {}): AgentCredential {
  return {
    agentId: 'agent-alpha',
    issuer: mlDsaFingerprint(pk),
    reputation: 7200,
    expiry: Math.floor(Date.now() / 1000) + 3600,
    nonce: 'n-123',
    ...over,
  };
}

describe('ML-DSA-65 agent credentials (P2.8)', () => {
  test('KAT: FIPS 204 keygen is deterministic from a seed (pins the algorithm)', () => {
    // Anchor to @noble's ML-DSA-65 output for seed = 0x07*32 (matches the reference
    // implementation). Guards against a silent library/param swap.
    const pk = keypair(7).publicKey;
    expect(pk.length).toBe(ML_DSA_PUBLICKEY_BYTES);
    expect(hex(pk).slice(0, 16)).toBe('37584a6e4279aece');
    // fingerprint is a deterministic pure function of the public key
    expect(mlDsaFingerprint(pk)).toBe(mlDsaFingerprint(keypair(7).publicKey));
    expect(mlDsaFingerprint(pk)).toMatch(/^pq:[0-9a-f]{40}$/);
  });

  test('a validly signed PQ credential verifies', () => {
    const kp = keypair(1);
    const c = makeCredential(kp.publicKey);
    const sig = signCredential(c, kp.secretKey);
    const res = verifyMlDsaCredential(c, sig, hex(kp.publicKey));
    expect(res).toMatchObject({ valid: true, reason: 'OK', agentId: 'agent-alpha', reputation: 7200 });
    expect(res.signer).toBe(c.issuer);
  });

  test('tampering with a signed field breaks verification', () => {
    const kp = keypair(2);
    const c = makeCredential(kp.publicKey);
    const sig = signCredential(c, kp.secretKey);
    const tampered = { ...c, reputation: 9999 }; // changed after signing
    expect(verifyMlDsaCredential(tampered, sig, hex(kp.publicKey)).valid).toBe(false);
  });

  test('a public key not matching the issuer fingerprint is rejected', () => {
    const kp = keypair(3);
    const other = keypair(4);
    const c = makeCredential(kp.publicKey);
    const sig = signCredential(c, kp.secretKey);
    // present a different key than the fingerprint commits to
    const res = verifyMlDsaCredential(c, sig, hex(other.publicKey));
    expect(res).toMatchObject({ valid: false, reason: 'SIGNER_MISMATCH' });
  });

  test('a signature from a different key is rejected', () => {
    const kp = keypair(5);
    const attacker = keypair(6);
    const c = makeCredential(kp.publicKey);
    const forged = signCredential(c, attacker.secretKey); // signed by the wrong key
    expect(verifyMlDsaCredential(c, forged, hex(kp.publicKey)).valid).toBe(false);
  });

  test('expired credential → EXPIRED', () => {
    const kp = keypair(1);
    const c = makeCredential(kp.publicKey, { expiry: Math.floor(Date.now() / 1000) - 10 });
    const sig = signCredential(c, kp.secretKey);
    expect(verifyMlDsaCredential(c, sig, hex(kp.publicKey))).toMatchObject({ valid: false, reason: 'EXPIRED' });
  });

  test('malformed issuer / pubkey / signature lengths are rejected cleanly', () => {
    const kp = keypair(1);
    const c = makeCredential(kp.publicKey);
    const sig = signCredential(c, kp.secretKey);
    expect(verifyMlDsaCredential({ ...c, issuer: '0xabc' }, sig, hex(kp.publicKey)).reason).toBe('BAD_ISSUER');
    expect(verifyMlDsaCredential(c, sig, 'ab').reason).toBe('BAD_PUBLICKEY');
    expect(verifyMlDsaCredential(c, 'abcd', hex(kp.publicKey)).reason).toBe('BAD_SIGNATURE');
    expect(verifyMlDsaCredential(c, 'zz', hex(kp.publicKey)).reason).toBe('BAD_ENCODING');
    expect(ML_DSA_SIGNATURE_BYTES).toBe(3309);
  });

  test('trusted-issuer allowlist gates PQ credentials', () => {
    const kp = keypair(8);
    const c = makeCredential(kp.publicKey);
    const sig = signCredential(c, kp.secretKey);
    const pkHex = hex(kp.publicKey);
    expect(verifyMlDsaCredential(c, sig, pkHex, { trustedIssuers: new Set() }).reason).toBe('UNTRUSTED_ISSUER');
    expect(verifyMlDsaCredential(c, sig, pkHex, { trustedIssuers: new Set([c.issuer]) }).valid).toBe(true);
  });

  test('agentTrustDecision treats a verified PQ agent the same as a classical one', () => {
    const kp = keypair(9);
    const c = makeCredential(kp.publicKey, { reputation: 6500 });
    const sig = signCredential(c, kp.secretKey);
    const check = verifyMlDsaCredential(c, sig, hex(kp.publicKey));
    expect(agentTrustDecision(check, 0.9)).toBe('ALLOW');   // reputable verified agent
    expect(agentTrustDecision(check, 0.97)).toBe('STEP_UP'); // extreme behavior → challenge
  });
});
