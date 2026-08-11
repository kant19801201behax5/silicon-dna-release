'use strict';
/**
 * Reputation Registry — publisher.
 *
 * Sources the two inputs reputation_scorer.js needs from real, replayable
 * data (not synthetic numbers): the oracle's own verdict history
 * (verdict_log.js, written every cycle by agent.js) and the public
 * telemetry feed (FEED_URL — the same feed agent.js and reputation_scorer's
 * own tests are already built against). Scores them, then pushes the raw
 * TP/FP/TN/FN counts to the ReputationRegistry contract's `publish()` entry
 * point — the contract derives accuracy_bps itself (see
 * reputation-registry/src/reputation_registry.rs), so this script cannot
 * shade the number in its own favor even if it wanted to.
 *
 * Deliberately standalone, same pattern as publish_gate.js: its own cycle,
 * its own ~2.5-5 CSPR call, doesn't touch agent.js's update() loop or the
 * RWA settlement gate's publish() loop.
 *
 * Entry point (from reputation-registry/src/reputation_registry.rs):
 *   publish(tp: u32, fp: u32, tn: u32, fn_count: u32, window_seconds: u64, timestamp: u64)
 */
require('dotenv').config();
const fetch = require('node-fetch');
const { DeployUtil, Keys, RuntimeArgs, CLValueBuilder } = require('casper-js-sdk');
const { readVerdicts } = require('./verdict_log');
const { scoreHistory, DEFAULT_WINDOW_SECONDS } = require('./reputation_scorer');

const NODE_URL   = process.env.CASPER_NODE_URL   || 'https://node.testnet.casper.network/rpc';
const CHAIN_NAME = process.env.CASPER_CHAIN_NAME || 'casper-test';
const KEY_PATH   = process.env.CASPER_SECRET_KEY_PATH || './keys/secret_key.pem';
const FEED_URL   = process.env.ORACLE_FEED_URL   || 'https://rtt.phoenix-ai.work/api/public-feed';
// Set after deploy — see reputation-registry/bin/cli.rs. No default on
// purpose: publishing against a placeholder hash would silently fail (or
// worse, hit the wrong contract) rather than making the missing config obvious.
const REGISTRY_PACKAGE = process.env.REGISTRY_PACKAGE_HASH || null;

async function fetchTelemetryHistory() {
  const r = await fetch(FEED_URL, { timeout: 15000 });
  const j = await r.json();
  return (j.data || []).map(s => ({ ts: s.ts, arb_revert: s.arb_revert, base_p99: s.base_p99 }));
}

/** Pure-ish: takes the two histories, returns the score. No network/chain calls. */
function computeScore(verdicts, telemetry, windowSeconds = DEFAULT_WINDOW_SECONDS) {
  return scoreHistory(verdicts, telemetry, { windowSeconds });
}

async function publishReputation() {
  if (!REGISTRY_PACKAGE) {
    throw new Error('REGISTRY_PACKAGE_HASH not set — deploy reputation-registry first, then set the env var');
  }

  const verdicts  = readVerdicts();
  const telemetry = await fetchTelemetryHistory();
  const score = computeScore(verdicts, telemetry);

  if (score.sampleSize === 0) {
    // Contract reverts on a zero-sample publish (Error::NoSamples) — don't
    // pay gas for a call we know will fail. Most likely cause: agent.js
    // hasn't accumulated enough verdict/telemetry overlap yet.
    console.log(`[REPUTATION] skip: sampleSize=0 (unscoreable=${score.unscoreable}), nothing to publish yet`);
    return { skipped: true, ...score };
  }

  const keyPair = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
  const timestamp = Math.floor(Date.now() / 1000);

  const args = RuntimeArgs.fromMap({
    tp:             CLValueBuilder.u32(score.tp),
    fp:             CLValueBuilder.u32(score.fp),
    tn:             CLValueBuilder.u32(score.tn),
    fn_count:       CLValueBuilder.u32(score.fn),
    window_seconds: CLValueBuilder.u64(score.windowSeconds),
    timestamp:      CLValueBuilder.u64(timestamp),
  });

  const params  = new DeployUtil.DeployParams(keyPair.publicKey, CHAIN_NAME, 1, 1800000);
  const pkgBytes = Uint8Array.from(Buffer.from(REGISTRY_PACKAGE.replace('hash-', ''), 'hex'));
  const session  = DeployUtil.ExecutableDeployItem.newStoredVersionContractByHash(
    pkgBytes, null, 'publish', args
  );
  const payment = DeployUtil.standardPayment(5000000000); // 5 CSPR, same headroom as publish_gate.js
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

  return { hash, skipped: false, timestamp, ...score };
}

if (require.main === module) {
  publishReputation()
    .then(r => {
      if (r.skipped) return;
      console.log(
        `[REPUTATION] published accuracy=${(r.accuracy * 100).toFixed(1)}% ` +
        `(tp=${r.tp} fp=${r.fp} tn=${r.tn} fn=${r.fn}, n=${r.sampleSize}, window=${r.windowSeconds}s) ts=${r.timestamp}`
      );
      console.log(`[REPUTATION] deploy: https://testnet.cspr.live/deploy/${r.hash}`);
    })
    .catch(e => { console.error('[REPUTATION] publish failed:', e.message); process.exit(1); });
}

module.exports = { computeScore, fetchTelemetryHistory, publishReputation };
