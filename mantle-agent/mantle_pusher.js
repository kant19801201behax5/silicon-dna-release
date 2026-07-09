'use strict';

/**
 * mantle_pusher.js
 * ----------------
 * Reads Silicon DNA live state and pushes Turing verdicts to TuringOracle on Mantle Sepolia.
 * Runs every 60 seconds. Requires: PRIVATE_KEY, CONTRACT_ADDRESS in .env
 *
 * Mantle Sepolia RPC:  https://rpc.sepolia.mantle.xyz
 * Chain ID:            5003
 * Block explorer:      https://explorer.sepolia.mantle.xyz
 */

const { ethers } = require('ethers');
require('dotenv').config();

// ── Config ──────────────────────────────────────────────────────────────────
const MANTLE_SEPOLIA_RPC = 'https://rpc.sepolia.mantle.xyz';
const PUSH_INTERVAL_MS   = 60_000; // 60 seconds

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY      = process.env.PRIVATE_KEY;
const SIGNAL_URL       = process.env.SIGNAL_URL || 'https://rtt.phoenix-ai.work/api/public-feed';

if (!CONTRACT_ADDRESS || !PRIVATE_KEY) {
  console.error('[FATAL] CONTRACT_ADDRESS and PRIVATE_KEY must be set in .env');
  process.exit(1);
}

// Minimal ABI — only the functions we call
const ABI = [
  'function update(bool human_traffic, uint256 trust_bps, uint256 bot_ratio_bps, bool mantle_safe, uint256 p99_ms) external',
  'function get_state() external view returns (tuple(bool human_traffic, uint256 trust_score_bps, uint256 bot_ratio_bps, bool mantle_safe, uint256 p99_ms, uint256 timestamp, uint256 update_count))',
  'function update_count() external view returns (uint256)',
];

// ── Helpers ──────────────────────────────────────────────────────────────────
async function fetchSiliconDNA() {
  const resp = await fetch(SIGNAL_URL, { signal: AbortSignal.timeout(10_000) });
  if (!resp.ok) throw new Error(`Signal fetch failed: ${resp.status}`);
  const data = await resp.json();

  // public-feed returns an array of chain objects: [{chain, p99_ms, stall, arb_revert_ratio, ...}, ...]
  const chains = Array.isArray(data) ? data : (data.chains ?? []);
  const mantle = chains.find(c => (c.chain ?? '').toLowerCase().includes('mantle'));
  const arb    = chains.find(c => (c.chain ?? '').toLowerCase().includes('arb'));

  // Derive trust from overall network tension (avg RTT health across chains)
  const avgTension = chains.length > 0
    ? chains.reduce((s, c) => s + (c.tension ?? 0.1), 0) / chains.length
    : 0.1;
  const arb_revert = arb ? (arb.arb_revert_ratio ?? arb.revert_ratio ?? 0.05) : 0.05;

  const trust_bps     = clamp(Math.round((1 - avgTension) * 10_000), 0, 10_000);
  const bot_ratio_bps = clamp(Math.round(arb_revert * 10_000), 0, 10_000);

  return {
    trust_bps,
    bot_ratio_bps,
    // Bug-fix: compute AFTER trust/bot are derived, not from raw data fields
    human_traffic: trust_bps > 6_000 && bot_ratio_bps < 4_000,
    mantle_safe:   mantle ? (mantle.p99_ms < 500 && !mantle.stall) : true,
    p99_ms:        mantle ? Math.round(mantle.p99_ms ?? 0) : 0,
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ── Main loop ────────────────────────────────────────────────────────────────
async function push() {
  const provider = new ethers.JsonRpcProvider(MANTLE_SEPOLIA_RPC);
  const wallet   = new ethers.Wallet(PRIVATE_KEY, provider);
  const oracle   = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  console.log(`[PUSHER] Connected. Wallet: ${wallet.address}`);
  console.log(`[PUSHER] Oracle:    ${CONTRACT_ADDRESS}`);
  console.log(`[PUSHER] Interval:  ${PUSH_INTERVAL_MS / 1000}s`);

  async function tick() {
    try {
      const state = await fetchSiliconDNA();

      const trust_bps     = clamp(state.trust_bps,     0, 10_000);
      const bot_ratio_bps = clamp(state.bot_ratio_bps, 0, 10_000);

      console.log(`[PUSHER] Pushing: human=${state.human_traffic} trust=${trust_bps}bps bot=${bot_ratio_bps}bps mantle_safe=${state.mantle_safe} p99=${state.p99_ms}ms`);

      // Query current baseFee to set tight gas params (avoid 2×baseFee default from ethers)
      const feeData  = await provider.getFeeData();
      const baseFee  = feeData.lastBaseFeePerGas ?? feeData.gasPrice ?? ethers.parseUnits('60', 'gwei');
      // maxFeePerGas = baseFee + 10 Gwei tip buffer. Must fit: gasLimit × maxFeePerGas <= balance
      const maxFee   = baseFee + ethers.parseUnits('10', 'gwei');
      const prioFee  = ethers.parseUnits('1', 'gwei');
      console.log(`[PUSHER] BaseFee=${Number(baseFee)/1e9|0}Gwei maxFee=${Number(maxFee)/1e9|0}Gwei`);

      const tx = await oracle.update(
        state.human_traffic,
        trust_bps,
        bot_ratio_bps,
        state.mantle_safe,
        state.p99_ms,
        {
          gasLimit:            80_000,          // estimate: ~70k first call, ~50k subsequent
          maxFeePerGas:        maxFee,           // baseFee + 10 Gwei (not 2×baseFee default)
          maxPriorityFeePerGas: prioFee,         // 1 Gwei tip
        }
      );

      console.log(`[PUSHER] Tx sent: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`[PUSHER] Confirmed in block ${receipt.blockNumber}. Gas used: ${receipt.gasUsed}`);

    } catch (err) {
      console.error(`[PUSHER] Error: ${err.message}`);
    }
  }

  // Run immediately, then on interval
  await tick();
  setInterval(tick, PUSH_INTERVAL_MS);
}

push().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
