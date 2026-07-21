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
 *   const oracle = new SequencerOracleClient(CONTRACT_HASH); // package hash
 *   const safe = await oracle.isSafe();
 *   if (safe) { await submitTransaction(); }
 *
 * STATUS (2026-07-21): FIXED AND VERIFIED against the live deployed
 * contract. Three real bugs were found and fixed:
 *   1. A CJS/ESM import crash.
 *   2. A dead default RPC URL (rpc.testnet.casperlabs.io no longer
 *      resolves — casper-js-sdk v2.15.4 predates the current
 *      node.testnet.casper.network naming).
 *   3. The real blocker: casper-js-sdk v2.15.4's getBlockState() predates
 *      Casper's entity-model addressing (protocol 2.x). Fixed by upgrading
 *      to casper-js-sdk ^3.0.0-rc05 (the same version the production
 *      ts-agent already uses) and reading state via query_global_state
 *      instead. Also found that v3.0.0-rc05's own high-level helpers
 *      (getEntity(), Contract.queryContractData()) send malformed params
 *      against this node — worked around by calling query_global_state
 *      directly through the client's low-level request() method.
 *
 * One addressing subtlety worth understanding: CONTRACT_HASH as published
 * everywhere else in this repo (README, TESTING_GUIDE, the .env files) is
 * the contract's *package* hash — the address `update()` deploys target via
 * StoredVersionedContractByHash. Reading stored state, however, requires
 * the *entity* hash (the specific deployed version under that package) —
 * a different address. This client resolves package → entity automatically
 * on first use and caches it, so callers only ever need the package hash
 * they already have.
 *
 * Verified live: getState() against the real deployed contract returns
 * safe/arb_p99_ms/base_p99_ms/last_update_ts matching the production
 * agent's own logs, with staleSec tracking the real ~5-minute push cycle.
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
  private packageHash: string;
  private entityHash: string | null = null;

  // Max acceptable data staleness (seconds)
  private maxStaleSec: number;

  /**
   * @param contractHash The contract's package hash (same value published
   *   as CONTRACT_HASH elsewhere in this repo — e.g.
   *   hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a).
   */
  constructor(
    contractHash: string,
    nodeUrl = "https://node.testnet.casper.network/rpc",
    // Production pushes every ~300s (5 min) — default threshold set with
    // margin above that so a normal push-cycle gap doesn't read as stale.
    maxStaleSec = 360
  ) {
    this.packageHash = contractHash.replace("hash-", "");
    this.client       = new CasperServiceByJsonRPC(nodeUrl);
    this.maxStaleSec  = maxStaleSec;
  }

  /** Low-level query_global_state call, bypassing the SDK's own broken
   *  getEntity()/queryContractData() helpers for this node/SDK combo. */
  private async rawQuery(key: string, path: string[]): Promise<any> {
    const stateRootHash = await this.client.getStateRootHash();
    return (this.client as any).client.request({
      method: "query_global_state",
      params: {
        state_identifier: { StateRootHash: stateRootHash },
        key,
        path,
      },
    });
  }

  /** Resolve this contract's package hash to its current entity (contract)
   *  hash, once, and cache it. */
  private async resolveEntityHash(): Promise<string> {
    if (this.entityHash) return this.entityHash;
    const result = await this.rawQuery(`hash-${this.packageHash}`, []);
    const versions = result?.stored_value?.ContractPackage?.versions ?? [];
    const latest = versions[versions.length - 1];
    if (!latest) {
      throw new Error(`No entity versions found for package ${this.packageHash}`);
    }
    this.entityHash = String(latest.contract_hash).replace("contract-", "");
    return this.entityHash;
  }

  /** Read a single named-key value from the contract's stored state. */
  private async readField(name: string): Promise<any> {
    const entityHash = await this.resolveEntityHash();
    const result = await this.rawQuery(`hash-${entityHash}`, [name]);
    return result?.stored_value?.CLValue?.parsed;
  }

  /**
   * Read full oracle state from on-chain storage.
   */
  async getState(): Promise<OracleState> {
    const [safe, arbP99, baseP99, arbRevertBps, baseRevertBps, lastTs] =
      await Promise.all([
        this.readField("safe"),
        this.readField("arb_p99_ms"),
        this.readField("base_p99_ms"),
        this.readField("arb_revert_bps"),
        this.readField("base_revert_bps"),
        this.readField("last_update_ts"),
      ]);

    const now = Math.floor(Date.now() / 1000);
    const lastUpdateTs = Number(lastTs) || 0;

    return {
      safe:              Boolean(safe),
      arbP99Ms:          Number(arbP99) || 0,
      baseP99Ms:         Number(baseP99) || 0,
      arbRevertPercent:  (Number(arbRevertBps) || 0) / 100,
      baseRevertPercent: (Number(baseRevertBps) || 0) / 100,
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
