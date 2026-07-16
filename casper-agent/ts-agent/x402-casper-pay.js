/**
 * Casper-native x402 payment client.
 *
 * NOT WIRED IN — this is a standalone module, not yet called from agent.js.
 * Casper's own x402 Facilitator (x402-facilitator.cspr.cloud) launched
 * natively on mainnet June 4, 2026 and supports testnet (casper:casper-test).
 * Our agent currently pays via Base mainnet USDC (@coinbase/x402) instead.
 *
 * To activate:
 *   1. npm install @make-software/casper-x402 @x402/core casper-js-sdk@^5
 *      (a second, newer major version of casper-js-sdk — coexists fine
 *      with the existing v3 used by call_contract.js since Node resolves
 *      them independently; do not mix their types)
 *   2. Get an access token: https://docs.cspr.cloud (facilitator requires
 *      Authorization on /verify and /settle — see server-side integration,
 *      not needed for this client-only payer code)
 *   3. Set CASPER_SECRET_KEY_PATH (same key already used by call_contract.js
 *      works, since it's Secp256K1 — but loaded here via the v5 SDK's
 *      PrivateKey.fromPem, a different loader than the v3 Keys.Secp256K1
 *      used elsewhere in this repo)
 *   4. Test with a tiny amount against a real 402 response before relying
 *      on this — it has not been run against the live facilitator.
 *
 * Reference: github.com/make-software/casper-x402
 * (js/packages/mechanisms/casper/src/exact/client/scheme.ts, signer.ts)
 */

'use strict';

async function payCasperX402(url, options = {}) {
  const {
    ExactCasperScheme,
    createClientCasperSigner,
  } = require('@make-software/casper-x402');
  const { KeyAlgorithm } = require('casper-js-sdk');

  const keyPath = process.env.CASPER_SECRET_KEY_PATH || './keys/secret_key.pem';
  const signer = await createClientCasperSigner(keyPath, KeyAlgorithm.SECP256K1);
  const scheme = new ExactCasperScheme(signer);

  // 1. Initial request — expect 402 with payment requirements.
  const firstResp = await fetch(url, options);
  if (firstResp.status !== 402) {
    return firstResp; // no payment required, or already succeeded
  }

  const body = await firstResp.json();
  const x402Version = body.x402Version;
  const paymentRequirements = (body.accepts || []).find(
    r => r.network === 'casper:casper-test' || r.network === 'casper:casper'
  );
  if (!paymentRequirements) {
    throw new Error('x402: no Casper payment option offered by resource server');
  }

  // 2. Build and sign the payment payload.
  const paymentPayloadResult = await scheme.createPaymentPayload(x402Version, paymentRequirements);

  // 3. Resend with the payment signature header.
  const paymentHeader = Buffer.from(JSON.stringify(paymentPayloadResult)).toString('base64');
  const secondResp = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      'PAYMENT-SIGNATURE': paymentHeader,
    },
  });

  return secondResp;
}

module.exports = { payCasperX402 };
