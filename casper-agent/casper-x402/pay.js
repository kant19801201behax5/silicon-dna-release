'use strict';
/**
 * Native Casper x402 payer for Phoenix Zero.
 *
 * Casper x402 settles in a CEP-18 stablecoin authorized via an EIP-712
 * signature: the client signs a payment authorization, the facilitator
 * (x402-facilitator.cspr.cloud) submits `transfer_with_authorization` on the
 * CEP-18 token. Signing needs NO balance; only settlement moves the token.
 * So this payer is fully wired and works the moment the payer wallet holds the
 * CEP-18 asset — no code change required to "go live", just funds.
 *
 * Upstream @make-software/casper-x402 v1.0.0 has a CJS interop bug (derefs a
 * non-existent casper-js-sdk `.default`); fixed here via patch-package
 * (patches/), applied automatically on npm install.
 */
require('dotenv').config();
const { PrivateKey, KeyAlgorithm } = require('casper-js-sdk');
const {
  toClientCasperSigner, createClientCasperSigner,
  NETWORK_CASPER_TESTNET, SCHEME_EXACT,
} = require('@make-software/casper-x402');
const { ExactCasperScheme } = require('@make-software/casper-x402/exact/client');

async function getSigner() {
  const keyPath = process.env.CASPER_SECRET_KEY_PATH;
  if (keyPath) return createClientCasperSigner(keyPath, KeyAlgorithm.SECP256K1);
  return toClientCasperSigner(PrivateKey.generate(KeyAlgorithm.SECP256K1)); // ephemeral: self-test only
}

async function signPayment(paymentRequirements) {
  const scheme = new ExactCasperScheme(await getSigner());
  return scheme.createPaymentPayload(2, paymentRequirements);
}

// GET url; on 402 pick the Casper accept, sign, replay with X-PAYMENT.
async function payAndFetch(url, fetchImpl = fetch) {
  const res = await fetchImpl(url);
  if (res.status !== 402) return res;
  const chal = JSON.parse(Buffer.from(res.headers.get('payment-required') || '', 'base64').toString());
  const casper = (chal.accepts || []).find(a => String(a.network).startsWith('casper:'));
  if (!casper) throw new Error('resource offers no Casper x402 option');
  const payload = await signPayment(casper);
  const header = Buffer.from(JSON.stringify(payload)).toString('base64');
  return fetchImpl(url, { headers: { 'X-PAYMENT': header } });
}

if (require.main === module) {
  const sample = {
    scheme: SCHEME_EXACT, network: NETWORK_CASPER_TESTNET, amount: '10000',
    resource: 'https://rtt.phoenix-ai.work/api/v1/safe',
    payTo: '00' + '11'.repeat(32), maxTimeoutSeconds: 300,
    asset: process.env.CASPER_X402_ASSET || 'ab'.repeat(32),
    extra: { feePayer: process.env.CASPER_X402_FEEPAYER
      || '81d557c9dcaadea97c34d79bf7b6af07aa9d760e5dd1aabf78a45fb39e072c3a', name: 'USD Coin', version: '2' },
  };
  signPayment(sample).then(p => {
    console.log('[casper-x402] payer WIRED — signed a valid authorization (no funds needed to sign):');
    console.log(JSON.stringify(p.payload ? p.payload.authorization : p, null, 2));
    console.log('\nTo settle for real: fund the payer wallet with the CEP-18 asset, set CASPER_X402_ASSET, point at a Casper-x402 resource — settlement is then automatic.');
  }).catch(e => { console.error('[casper-x402] FAILED:', e.message); process.exit(1); });
}
module.exports = { signPayment, payAndFetch };
