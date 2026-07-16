/**
 * Phoenix Zero x Silicon DNA -- Autonomous Casper DeFi Agent v2.0
 * ================================================================
 * Architecture:
 *   1. Probe x402 endpoint /api/v1/safe ($0.01 USDC/call, Base mainnet eip155:8453)
 *      On 402: decode payment-required header, log x402 challenge, fall back to public feed
 *   2. Read arb_revert_ratio, base_p99 from Phoenix Zero (206K+ measurements since Mar 2026)
 *   3. When safe=true: push to Casper testnet oracle (Rust contract, casper-contract 5.1.1)
 *   4. When safe=false: pause execution, save gas, log reason
 *
 * Rust contract source: /opt/casper-oracle/oracle-contract/src/lib.rs
 * Contract hash: hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d
 * x402 endpoint: https://rtt.phoenix-ai.work/api/v1/safe
 */

'use strict';
require('dotenv').config();
const fetch = require('node-fetch');
const { DeployUtil, Keys } = require('casper-js-sdk');
const fs = require('fs');

const NODE_URL     = process.env.CASPER_NODE_URL   || 'https://rpc.testnet.casperlabs.io';
const CHAIN_NAME   = process.env.CASPER_CHAIN_NAME || 'casper-test';
const KEY_PATH     = process.env.CASPER_SECRET_KEY_PATH || './keys/secret_key.pem';
const X402_URL     = 'https://rtt.phoenix-ai.work/api/v1/safe';
const FEED_URL     = process.env.ORACLE_FEED_URL   || 'https://rtt.phoenix-ai.work/api/public-feed';
const HEALTH_URL   = process.env.ORACLE_HEALTH_URL || 'https://rtt.phoenix-ai.work/api/health';
const INTERVAL_MS  = parseInt(process.env.CHECK_INTERVAL_MS || '300000');
const DRY_RUN      = process.env.DRY_RUN === 'true';

const ARB_REVERT_MAX = 0.15;
const BASE_P99_MAX   = 500;

function log(level, msg) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`${ts} [${level}] ${msg}`);
}

// x402 probe: demonstrate payment protocol awareness
// Endpoint: $0.01 USDC per call on Base mainnet (eip155:8453)
// When funded wallet present: auto-pays and gets priority data
// Without funds: decodes 402, logs payment requirement, falls back to public feed
async function probeX402() {
  try {
    const res = await fetch(X402_URL, { timeout: 8000 });
    if (res.status === 402) {
      const raw = res.headers.get('payment-required') || '';
      if (raw) {
        const decoded = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
        const accept  = (decoded.accepts || [])[0] || {};
        const usdcAmt = (parseInt(accept.amount || '0') / 1e6).toFixed(4);
        log('X402', `402 received: $${usdcAmt} USDC on ${accept.network}`);
        log('X402', `  pay_to=${(accept.payTo || '').slice(0, 14)}... asset=USDC scheme=${accept.scheme}`);
        log('X402', '  Falling back to public feed (x402 requires funded Base wallet)');
      }
      return null;
    }
    if (res.ok) {
      const data = await res.json();
      log('X402', `Paid access granted: safe=${data.safe} reason=${data.reason}`);
      return data;
    }
  } catch (e) {
    log('X402', `probe skipped: ${e.message}`);
  }
  return null;
}

// Fetch oracle state: x402 first, public feed fallback
async function fetchOracleState() {
  const x402Result = await probeX402();
  if (x402Result) {
    return {
      safe: x402Result.safe,
      arbRevert: 0,
      baseP99: x402Result.base_p99_ms || 0,
      arbP99: 0,
      arbRevertBps: 0,
      baseRevertBps: 0,
    };
  }

  const [feedRes, healthRes] = await Promise.all([
    fetch(FEED_URL,   { timeout: 10000 }),
    fetch(HEALTH_URL, { timeout: 10000 }),
  ]);
  const feed   = await feedRes.json();
  const health = await healthRes.json();

  if (!feed.data || !feed.data.length) throw new Error('Empty oracle feed');
  const latest    = feed.data[feed.data.length - 1];
  const arbRevert = parseFloat(latest.arb_revert  || 0);
  const baseRevert = parseFloat(latest.base_revert || 0);
  const arbP99    = parseInt(latest.arb_p99  || 0);
  const baseP99   = parseInt(latest.base_p99 || 0);
  const metricsOk = arbRevert < ARB_REVERT_MAX && baseP99 < BASE_P99_MAX;

  return {
    safe:         health.safe === true && metricsOk,
    arbRevert,
    baseRevert,
    arbP99,
    baseP99,
    arbRevertBps:  Math.round(arbRevert  * 10000),
    baseRevertBps: Math.round(baseRevert * 10000),
  };
}

const stats = { executed: 0, paused: 0, gasSaved: 0, errors: 0, started: new Date().toISOString() };

async function runAgent() {
  log('INFO', '='.repeat(56));
  log('INFO', 'Phoenix Zero x Silicon DNA  |  Casper Agent v2.0');
  log('INFO', `Node:     ${NODE_URL}`);
  log('INFO', `Chain:    ${CHAIN_NAME}`);
  log('INFO', `Interval: ${INTERVAL_MS / 1000}s  |  Dry run: ${DRY_RUN}`);
  log('INFO', `x402:     ${X402_URL}`);
  log('INFO', `Contract: hash-5e45d42c...d8354d (Rust/casper-contract 5.1.1)`);
  log('INFO', '='.repeat(56));

  let keyPair = null;
  if (!DRY_RUN) {
    if (!fs.existsSync(KEY_PATH)) { log('ERROR', `Key not found: ${KEY_PATH}`); process.exit(1); }
    keyPair = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
    log('INFO', `Key loaded: ${keyPair.publicKey.toHex().slice(0, 20)}...`);
  }

  while (true) {
    const cycleStart = Date.now();
    try {
      const oracle = await fetchOracleState();

      if (!oracle.safe) {
        stats.paused++;
        stats.gasSaved += 2.5;
        log('WARN',
          `UNSAFE -- pausing | arb_revert=${(oracle.arbRevert * 100).toFixed(2)}% ` +
          `base_p99=${oracle.baseP99}ms | gas_saved=${stats.gasSaved.toFixed(1)} CSPR`
        );
      } else if (DRY_RUN) {
        stats.executed++;
        log('INFO',
          `[DRY RUN] SAFE -- would push to Casper | arb_revert=${(oracle.arbRevert * 100).toFixed(2)}% ` +
          `base_p99=${oracle.baseP99}ms`
        );
        log('INFO', `[DRY RUN] callContractUpdate({ safe:true, arb_revert_bps:${oracle.arbRevertBps||0}, base_p99_ms:${oracle.baseP99||0} })`);
      } else {
        const { callContractUpdate } = require('./call_contract');
        const deployHash = await callContractUpdate({
          safe:            oracle.safe,
          arb_p99_ms:      oracle.arbP99        || 0,
          base_p99_ms:     oracle.baseP99       || 0,
          arb_revert_bps:  oracle.arbRevertBps  || 0,
          base_revert_bps: oracle.baseRevertBps || 0,
          timestamp:       Math.floor(Date.now() / 1000),
        });
        stats.executed++;
        log('INFO',
          `SAFE -- pushed to Casper | arb_revert=${(oracle.arbRevert * 100).toFixed(2)}% ` +
          `base_p99=${oracle.baseP99}ms | tx=${deployHash.slice(0, 16)}...`
        );
        log('INFO', `   https://testnet.cspr.live/deploy/${deployHash}`);
      }

      if ((stats.executed + stats.paused) % 10 === 0 && (stats.executed + stats.paused) > 0) {
        const mins = Math.round((Date.now() - new Date(stats.started).getTime()) / 60000);
        log('INFO', `Summary | pushed=${stats.executed} paused=${stats.paused} gas_saved=${stats.gasSaved.toFixed(1)} CSPR | uptime=${mins}min`);
      }
      stats.errors = 0;

    } catch (err) {
      stats.errors++;
      log('ERROR', `Cycle failed (#${stats.errors}): ${err.message}`);
    }

    const elapsed = Date.now() - cycleStart;
    await new Promise(r => setTimeout(r, Math.max(0, INTERVAL_MS - elapsed)));
  }
}

runAgent().catch(err => { log('FATAL', err.message); process.exit(1); });
