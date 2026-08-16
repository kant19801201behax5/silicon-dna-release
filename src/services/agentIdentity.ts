// src/services/agentIdentity.ts
// P1.4 — cryptographic agent identity. Replaces "is this a human?" with
// "which agent is this, and can I verify it?" — the model the Casper machine
// economy actually needs.
//
// The old walletBinder only checked a signature was 130 hex chars (structure),
// so any blob "bound" any wallet — spoofable identity. This does REAL secp256k1
// ecrecover (EIP-191 personal_sign), so binding/credentials require proof the
// caller controls the key. Then an agent can present a signed credential
// (agentId + issuer + reputation + expiry + nonce); we verify the signer and
// gate access on verifiable identity+reputation, not on "human vs bot".
//
// Pure functions, unit-tested by signing with the same secp256k1 in the test.

import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak_256 } from '@noble/hashes/sha3';

const enc = new TextEncoder();
const toHex = (b: Uint8Array) => '0x' + Buffer.from(b).toString('hex');

/** Ethereum address (lowercased) from an uncompressed (65-byte, 0x04-prefixed) pubkey. */
function pubToAddress(pub65: Uint8Array): string {
  return toHex(keccak_256(pub65.slice(1)).slice(-20));
}

/** keccak256 of arbitrary bytes (exported for callers/tests). */
export function keccak256(data: Uint8Array): Uint8Array {
  return keccak_256(data);
}

/** EIP-191 personal_sign digest: keccak256("\x19Ethereum Signed Message:\n"+len+msg). */
export function eip191Hash(message: string): Uint8Array {
  const msg = enc.encode(message);
  const prefix = enc.encode(`\x19Ethereum Signed Message:\n${msg.length}`);
  const buf = new Uint8Array(prefix.length + msg.length);
  buf.set(prefix, 0);
  buf.set(msg, prefix.length);
  return keccak_256(buf);
}

/** Recover the signer address (lowercased 0x…) from a 32-byte digest + 65-byte sig, or null. */
export function recoverAddress(digest: Uint8Array, signatureHex: string): string | null {
  try {
    const hex = signatureHex.startsWith('0x') ? signatureHex.slice(2) : signatureHex;
    if (hex.length !== 130) return null;
    const rs = hex.slice(0, 128);
    let v = parseInt(hex.slice(128, 130), 16);
    if (v >= 27) v -= 27;            // 27/28 → 0/1
    if (v !== 0 && v !== 1) return null;
    const sig = secp256k1.Signature.fromCompact(rs).addRecoveryBit(v);
    const pub = sig.recoverPublicKey(digest).toRawBytes(false);
    return pubToAddress(pub);
  } catch {
    return null;
  }
}

/** Verify an EIP-191 personal_sign signature over `message`; returns signer address or null. */
export function verifyEip191(message: string, signatureHex: string): string | null {
  return recoverAddress(eip191Hash(message), signatureHex);
}

// ── Agent credentials ────────────────────────────────────────────────────────

export interface AgentCredential {
  agentId: string;    // opaque agent identifier
  issuer: string;     // 0x… address expected to have signed this
  reputation: number; // 0..10000 bps (issuer-attested historical accuracy, etc.)
  expiry: number;     // unix seconds
  nonce: string;      // anti-replay
}

/** Canonical, stable string an agent signs (deterministic field order). */
export function credentialMessage(c: AgentCredential): string {
  return [
    'SiliconDNA Agent Credential v1',
    `agentId=${c.agentId}`,
    `issuer=${c.issuer.toLowerCase()}`,
    `reputation=${c.reputation}`,
    `expiry=${c.expiry}`,
    `nonce=${c.nonce}`,
  ].join('\n');
}

export interface CredentialCheck {
  valid: boolean;
  reason: string;
  agentId?: string;
  reputation?: number;
  signer?: string;
}

/**
 * Verify a signed agent credential. Confirms the signature recovers to the
 * declared `issuer`, the credential hasn't expired, and (optionally) the issuer
 * is in a trusted-issuer allowlist. `nowSec` injectable for tests.
 */
export function verifyAgentCredential(
  c: AgentCredential,
  signatureHex: string,
  opts: { trustedIssuers?: Set<string>; nowSec?: number } = {},
): CredentialCheck {
  const now = opts.nowSec ?? Math.floor(Date.now() / 1000);
  if (!c || typeof c.agentId !== 'string' || !c.agentId) return { valid: false, reason: 'BAD_AGENT_ID' };
  if (!/^0x[0-9a-fA-F]{40}$/.test(c.issuer || '')) return { valid: false, reason: 'BAD_ISSUER' };
  if (!Number.isFinite(c.reputation) || c.reputation < 0 || c.reputation > 10000) return { valid: false, reason: 'BAD_REPUTATION' };
  if (!Number.isFinite(c.expiry) || c.expiry <= now) return { valid: false, reason: 'EXPIRED' };
  const signer = verifyEip191(credentialMessage(c), signatureHex);
  if (!signer) return { valid: false, reason: 'BAD_SIGNATURE' };
  if (signer !== c.issuer.toLowerCase()) return { valid: false, reason: 'SIGNER_MISMATCH', signer };
  if (opts.trustedIssuers && !opts.trustedIssuers.has(signer)) return { valid: false, reason: 'UNTRUSTED_ISSUER', signer };
  return { valid: true, reason: 'OK', agentId: c.agentId, reputation: c.reputation, signer };
}

export type AgentDecision = 'ALLOW' | 'STEP_UP' | 'DENY';

/**
 * Combine a verified credential with the live behavioral risk into a graduated
 * decision. Unverified identity → fall back to behavior (STEP_UP/DENY); a verified,
 * well-reputed agent is allowed even if behavior looks automated (it IS an agent —
 * that's the point), unless behavior is egregious.
 */
export function agentTrustDecision(check: CredentialCheck, behaviorRisk: number): AgentDecision {
  if (check.valid) {
    const rep = check.reputation ?? 0;
    if (behaviorRisk >= 0.95) return 'STEP_UP';      // verified but extreme behavior → challenge
    if (rep >= 6000) return 'ALLOW';                 // reputable verified agent
    if (rep >= 3000) return behaviorRisk > 0.7 ? 'STEP_UP' : 'ALLOW';
    return behaviorRisk > 0.5 ? 'STEP_UP' : 'ALLOW';
  }
  // No verified identity → decide on behavior alone.
  if (behaviorRisk >= 0.8) return 'DENY';
  if (behaviorRisk >= 0.5) return 'STEP_UP';
  return 'ALLOW';
}
