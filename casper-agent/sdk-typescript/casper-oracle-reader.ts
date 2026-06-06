/**
 * Phoenix Zero — Casper Sequencer Health Oracle SDK (TypeScript)
 * ==============================================================
 * TypeScript client for DeFi agents to read the on-chain oracle state.
 *
 * Any autonomous DeFi agent built with TypeScript/JavaScript can use this
 * to check network safety before submitting transactions on Casper.
 *
 * Usage:
 *   import { SequencerOracleClient } from './casper-oracle-reader';
 *
 *   const oracle = new SequencerOracleClient(CONTRACT_HASH);
 *   const safe = await oracle.isSafe();
 *   if (safe) { await submitTransaction(); }
 */

import { CasperServiceByJsonRPC } from "casper-js-sdk";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OracleState {
  safe: boolean;
  arbP99Ms: number;
  baseP99Ms: number;
  arbRevertPercent: number;   // human-readable: 4.00 = 4.00%
  baseRevertPercent: number;
  lastUpdateTs: number;       // Unix timestamp
  staleSec: number;           // seconds since last push
}

export interface AgentDecision {
  execute: boolean;
  reason: string;
  oracleState: OracleState;
}

// ── Oracle Client ─────────────────────────────────────────────────────────────

export class SequencerOracleClient {
  private client: CasperServiceByJsonRPC;
  private contractHash: string;

  // Max acceptable data staleness (seconds)
  private maxStaleSec: number;

  constructor(
    contractHash: string,
    nodeUrl = "https://rpc.testnet.casperlabs.io",
    maxStaleSec = 180
  ) {
    this.contractHash  = contractHash.replace("hash-", "");
    this.client        = new CasperServiceByJsonRPC(nodeUrl);
    this.maxStaleSec   = maxStaleSec;
  }

  /**
   * Read full oracle state from on-chain storage.
   */
  async getState(): Promise<OracleState> {
    const stateRoot = await this.client.getStateRootHash();

    const readKey = async (name: string): Promise<string> => {
      const result = await this.client.getBlockState(
        stateRoot,
        `hash-${this.contractHash}`,
        [name]
      );
      return (result as any).CLValue?.value?.toString() ?? "0";
    };

    const [safe, arbP99, baseP99, arbRevertBps, baseRevertBps, lastTs] =
      await Promise.all([
        readKey("safe"),
        readKey("arb_p99_ms"),
        readKey("base_p99_ms"),
        readKey("arb_revert_bps"),
        readKey("base_revert_bps"),
        readKey("last_update_ts"),
      ]);

    const now = Math.floor(Date.now() / 1000);
    const lastUpdateTs = parseInt(lastTs, 10) || 0;

    return {
      safe:              safe === "true",
      arbP99Ms:          parseInt(arbP99, 10),
      baseP99Ms:         parseInt(baseP99, 10),
      arbRevertPercent:  parseInt(arbRevertBps, 10) / 100,
      baseRevertPercent: parseInt(baseRevertBps, 10) / 100,
      lastUpdateTs,
      staleSec:          now - lastUpdateTs,
    };
  }

  /**
   * Primary check: is it safe to transact right now?
   * Returns false if data is stale (oracle pusher may be down).
   */
  async isSafe(): Promise<boolean> {
    const state = await this.getState();
    if (state.staleSec > this.maxStaleSec) return false;
    return state.safe;
  }

  /**
   * Full agent decision with reasoning — use in logs/audit trail.
   */
  async decide(txDescription: string): Promise<AgentDecision> {
    const state = await this.getState();

    if (state.staleSec > this.maxStaleSec) {
      return {
        execute: false,
        reason:  `Oracle data stale (${state.staleSec}s > ${this.maxStaleSec}s threshold) — treat as unsafe`,
        oracleState: state,
      };
    }

    if (!state.safe) {
      return {
        execute: false,
        reason:  `Network unsafe: arb_revert=${state.arbRevertPercent.toFixed(2)}% base_p99=${state.baseP99Ms}ms`,
        oracleState: state,
      };
    }

    return {
      execute: true,
      reason:  `Network safe: arb_revert=${state.arbRevertPercent.toFixed(2)}% base_p99=${state.baseP99Ms}ms`,
      oracleState: state,
    };
  }
}

// ── Demo: Autonomous DeFi Agent ───────────────────────────────────────────────

async function runDemoAgent() {
  const CONTRACT_HASH = process.env.CONTRACT_HASH ?? "";
  if (!CONTRACT_HASH) {
    console.error("Set CONTRACT_HASH env variable");
    process.exit(1);
  }

  const oracle = new SequencerOracleClient(CONTRACT_HASH);

  const pendingTransactions = [
    { id: "tx_001", desc: "CSPR → USDC swap",      valueUsdc: 5000  },
    { id: "tx_002", desc: "Add LP to CSPR/USDC",   valueUsdc: 12000 },
    { id: "tx_003", desc: "Deposit to yield vault", valueUsdc: 3500  },
  ];

  console.log("━".repeat(56));
  console.log("Phoenix Zero Oracle Client  |  Casper TypeScript SDK");
  console.log(`Contract: ${CONTRACT_HASH}`);
  console.log(`Transactions queued: ${pendingTransactions.length}`);
  console.log("━".repeat(56));

  for (const tx of pendingTransactions) {
    const decision = await oracle.decide(tx.desc);

    if (decision.execute) {
      console.log(`✅ EXECUTE ${tx.id} | ${tx.desc} | $${tx.valueUsdc.toLocaleString()} USDC`);
      console.log(`   Reason: ${decision.reason}`);
    } else {
      console.log(`⛔ BLOCKED ${tx.id} | ${tx.desc}`);
      console.log(`   Reason: ${decision.reason}`);
      console.log(`   Saved: ~$2.50 in failed gas`);
    }
    console.log();
  }
}

if (require.main === module) {
  runDemoAgent().catch(console.error);
}
