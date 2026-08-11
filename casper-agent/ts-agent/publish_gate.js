'use strict';
/**
 * RWA Settlement Gate — publisher.
 *
 * Wires the live oracle signals into the on-chain RWA Settlement Gate
 * (Odra contract, package hash below) by calling its `publish()` entry point.
 * This is the piece that was previously "written but not wired": run on a
 * cycle (see the systemd timer / cron that invokes it), the gate stops holding
 * default state and starts reflecting real network-safety + identity-screening
 * status, so any other Casper contract can gate an RWA transfer on
 * `is_settlement_allowed()`.
 *
 * Deliberately standalone — it does NOT touch the oracle agent's update() loop
 * (agent.js / call_contract.js) or the x402 payment gateway. Same deploy
 * pattern and wallet as the oracle, a separate ~2.5 CSPR call.
 *
 * Entry point (from rwa-settlement-gate/src/rwa_settlement_gate.rs):
 *   publish(network_safe: bool, identity_screening_active: bool, timestamp: u64)
 */
require('dotenv').config();
const fetch = require('node-fetch');
const { DeployUtil, Keys, RuntimeArgs, CLValueBuilder } = require('casper-js-sdk');

const NODE_URL     = process.env.CASPER_NODE_URL   || 'https://node.testnet.casper.network/rpc';
const CHAIN_NAME   = process.env.CASPER_CHAIN_NAME || 'casper-test';
const KEY_PATH     = process.env.CASPER_SECRET_KEY_PATH || './keys/secret_key.pem';
// The RWA Settlement Gate package hash (Odra deploy, 2026-07-29).
const GATE_PACKAGE = process.env.GATE_PACKAGE_HASH
  || 'fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d';
const HEALTH_URL   = process.env.ORACLE_HEALTH_URL || 'https://rtt.phoenix-ai.work/api/health';

async function fetchSignals() {
  // network_safe: the oracle's own live safety verdict.
  // identity_screening_active: true while Silicon DNA's gate is operational.
  const r = await fetch(HEALTH_URL, { timeout: 15000 });
  const h = await r.json();
  return {
    network_safe: h.safe === true,
    identity_screening_active: h.health === 'operational',
  };
}

async function publishGate() {
  const keyPair = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
  const sig = await fetchSignals();
  const timestamp = Math.floor(Date.now() / 1000);

  const args = RuntimeArgs.fromMap({
    network_safe:              CLValueBuilder.bool(sig.network_safe),
    identity_screening_active: CLValueBuilder.bool(sig.identity_screening_active),
    timestamp:                 CLValueBuilder.u64(timestamp),
  });

  const params = new DeployUtil.DeployParams(keyPair.publicKey, CHAIN_NAME, 1, 1800000);
  const pkgBytes = Uint8Array.from(Buffer.from(GATE_PACKAGE.replace('hash-', ''), 'hex'));
  const session = DeployUtil.ExecutableDeployItem.newStoredVersionContractByHash(
    pkgBytes, null, 'publish', args
  );
  const payment = DeployUtil.standardPayment(5000000000); // 5 CSPR (headroom over update()'s 2.5)
  const deploy  = DeployUtil.makeDeploy(params, session, payment);
  const signed  = DeployUtil.signDeploy(deploy, keyPair);

  const resp = await fetch(NODE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1,
      method: 'account_put_deploy',
      params: { deploy: DeployUtil.deployToJson(signed).deploy }
    }),
    timeout: 15000
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.data || data.error.message || JSON.stringify(data.error));
  const hash = data.result.deploy_hash
    || data.result.transaction_hash?.Deploy
    || data.result.transaction_hash;
  return { hash, ...sig, timestamp };
}

if (require.main === module) {
  publishGate()
    .then(r => {
      console.log(`[GATE] published network_safe=${r.network_safe} identity_screening_active=${r.identity_screening_active} ts=${r.timestamp}`);
      console.log(`[GATE] deploy: https://testnet.cspr.live/deploy/${r.hash}`);
    })
    .catch(e => { console.error('[GATE] publish failed:', e.message); process.exit(1); });
}

module.exports = { publishGate };
