# Native Casper x402 payer

The agent's payment rail on **native Casper** (the oracle's paid API currently
settles on Base mainnet; this is the Casper-native path).

Uses [`@make-software/casper-x402`](https://github.com/make-software/casper-x402)
+ the **live** Casper facilitator `x402-facilitator.cspr.cloud` (verified 200,
supports `casper:casper-test`). Casper x402 settles in a **CEP-18 stablecoin**
authorized via an **EIP-712 signature** — the facilitator submits
`transfer_with_authorization` on the token contract.

## Status: wired and verified — settles the moment the wallet is funded

Signing a payment authorization needs **no balance**; only the final settlement
moves the token. So this payer is fully functional today — verified end to end
except for holding the CEP-18 asset.

```bash
npm install       # postinstall applies the upstream patch (see below)
npm run selftest  # signs a real Casper x402 authorization and prints it
```

`selftest` output is a real signed `authorization` (`from / to / value /
validAfter / validBefore / nonce` + signature). **To go live there is no code
to write** — fund the payer wallet with the CEP-18 asset, set `CASPER_X402_ASSET`
to that token's package hash, point `payAndFetch()` at a Casper-x402 resource,
and settlement happens automatically.

## Upstream patch (why `patches/` exists)

`@make-software/casper-x402` v1.0.0's CJS build dereferences
`casper-js-sdk.default`, which does not exist in its own pinned
`casper-js-sdk@5.0.12` (that SDK exports at the top level, no `.default`), so the
module **throws on load** as published. Fixed here with a one-line-per-site
`(x.default || x)` fallback via
[`patch-package`](https://github.com/ds300/patch-package), applied automatically
on `npm install`. Patch file: `patches/@make-software+casper-x402+1.0.0.patch`.

## API

```js
const { signPayment, payAndFetch } = require('./pay');

// low level: sign an authorization for a Casper PaymentRequirements
const payload = await signPayment(paymentRequirements);

// high level: GET a paid URL, auto-pay a Casper 402 challenge, return the response
const res = await payAndFetch('https://…/api/v1/safe');
```

Uses `CASPER_SECRET_KEY_PATH` (same Secp256K1 key as the oracle agent) when set;
falls back to an ephemeral key for the sign-only self-test.

Isolated from `../ts-agent/` on purpose: that agent pins `casper-js-sdk` v3,
this rail needs v5 — kept in a separate package so neither breaks the other.
