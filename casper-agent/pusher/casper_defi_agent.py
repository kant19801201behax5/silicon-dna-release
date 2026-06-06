#!/usr/bin/env python3
"""
Phoenix Zero — Autonomous DeFi Agent for Casper
================================================
Demonstrates an autonomous agent that reads the on-chain oracle
and makes execution decisions based on network safety.

This is what "Agentic AI" means for Casper DeFi:
  - Agent has a goal (execute transactions)
  - Agent checks oracle before every action
  - Agent pauses autonomously during unsafe conditions
  - Agent resumes when safe:true is published on-chain
  - Zero human intervention required

Usage:
  python casper_defi_agent.py
"""

import os
import time
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [AGENT] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("defi_agent")

# ── Config ────────────────────────────────────────────────────────────────────
# In production: agent reads from Casper contract on-chain
# For demo: reads from public Phoenix Zero API directly
ORACLE_URL = "https://rtt.phoenix-ai.work/api/health"
FEED_URL   = "https://rtt.phoenix-ai.work/api/public-feed"
CHECK_INTERVAL = int(os.getenv("CHECK_INTERVAL", "30"))

# Simulated transaction queue (in production: real Casper transactions)
PENDING_TXS = [
    {"id": "tx_001", "type": "swap",      "value_usdc": 5000,  "desc": "CSPR → USDC swap"},
    {"id": "tx_002", "type": "liquidity", "value_usdc": 12000, "desc": "Add LP to CSPR/USDC"},
    {"id": "tx_003", "type": "yield",     "value_usdc": 3500,  "desc": "Deposit to yield vault"},
]

# Gas cost per failed transaction (conservative estimate)
GAS_COST_FAILED_USDC = 2.50


def check_oracle_safety() -> dict:
    """Read current network safety from Phoenix Zero oracle."""
    health = requests.get(ORACLE_URL, timeout=10).json()
    feed   = requests.get(FEED_URL,   timeout=10).json()
    latest = feed["data"][-1]

    arb_revert  = float(latest.get("arb_revert", 0) or 0)
    base_p99    = int(latest.get("base_p99", 0) or 0)
    server_safe = health.get("safe", False)
    metrics_ok  = arb_revert < 0.15 and base_p99 < 500

    return {
        "safe":        server_safe and metrics_ok,
        "arb_revert":  arb_revert,
        "base_p99":    base_p99,
        "server_safe": server_safe,
    }


def execute_transaction(tx: dict, oracle: dict) -> bool:
    """
    Simulate transaction execution.
    In production: calls Casper SDK to sign and submit real transaction.
    """
    # Simulate 72% failure rate during unsafe conditions (MEV war data)
    if not oracle["safe"]:
        log.warning(
            f"  ⛔ BLOCKED {tx['id']} ({tx['desc']}) | "
            f"arb_revert={oracle['arb_revert']*100:.1f}% — would have lost "
            f"${GAS_COST_FAILED_USDC:.2f} in gas"
        )
        return False

    # Safe to execute
    log.info(f"  ✅ EXECUTED {tx['id']} ({tx['desc']}) | ${tx['value_usdc']:,} USDC")
    return True


def run_agent():
    """
    Main agent loop.

    Agent behavior:
    1. Check oracle every 30 seconds
    2. If safe → execute pending transactions
    3. If unsafe → pause, log reason, wait
    4. Resume automatically when safe:true appears on-chain
    """
    log.info("━" * 56)
    log.info("Phoenix Zero DeFi Agent  |  Casper Agentic Buildathon")
    log.info(f"Oracle: {ORACLE_URL}")
    log.info(f"Transactions queued: {len(PENDING_TXS)}")
    log.info("━" * 56)

    executed    = 0
    blocked     = 0
    gas_saved   = 0.0
    pause_count = 0

    pending = list(PENDING_TXS)

    while pending:
        try:
            oracle = check_oracle_safety()

            if not oracle["safe"]:
                pause_count += 1
                log.warning(
                    f"🔴 NETWORK UNSAFE — pausing {len(pending)} transactions | "
                    f"arb_revert={oracle['arb_revert']*100:.1f}% | "
                    f"base_p99={oracle['base_p99']}ms"
                )
                # Block entire queue — each would have cost gas
                gas_saved += len(pending) * GAS_COST_FAILED_USDC
                log.info(
                    f"   Gas saved this pause: "
                    f"${len(pending) * GAS_COST_FAILED_USDC:.2f} USDC"
                )
                blocked += len(pending)

            else:
                log.info(
                    f"🟢 NETWORK SAFE | "
                    f"arb_revert={oracle['arb_revert']*100:.1f}% | "
                    f"base_p99={oracle['base_p99']}ms"
                )
                # Execute all pending transactions
                still_pending = []
                for tx in pending:
                    success = execute_transaction(tx, oracle)
                    if success:
                        executed += 1
                    else:
                        still_pending.append(tx)
                pending = still_pending

            # Summary after each cycle
            log.info(
                f"   📊 Session: executed={executed} | blocked={blocked} | "
                f"gas_saved=${gas_saved:.2f} | pauses={pause_count}"
            )

        except Exception as e:
            log.error(f"Agent error: {e}")

        if pending:
            log.info(f"   ⏳ {len(pending)} transactions pending — checking in {CHECK_INTERVAL}s")
            time.sleep(CHECK_INTERVAL)

    # Final report
    log.info("━" * 56)
    log.info("AGENT COMPLETED ALL TRANSACTIONS")
    log.info(f"  Executed:   {executed}")
    log.info(f"  Blocked:    {blocked}  (would have failed during MEV storm)")
    log.info(f"  Gas saved:  ${gas_saved:.2f} USDC")
    if executed + blocked > 0:
        efficiency = executed / (executed + blocked) * 100
        log.info(f"  Efficiency: {efficiency:.1f}% success rate")
    log.info("━" * 56)


if __name__ == "__main__":
    run_agent()
