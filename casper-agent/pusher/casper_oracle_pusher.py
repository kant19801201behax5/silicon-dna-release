#!/usr/bin/env python3
"""
Phoenix Zero — Casper Sequencer Health Oracle Pusher
=====================================================
Autonomous agent. Reads live MEV/network data from the PUBLIC
Phoenix Zero feed and pushes safety state to Casper Testnet contract.

PUBLIC DATA SOURCE — no private tokens required to run this agent.
  https://rtt.phoenix-ai.work/api/public-feed   (free, 60 data points, 5-min lag)
  https://rtt.phoenix-ai.work/api/health         (operational status)

Usage:
  pip install -r requirements.txt
  cp .env.example .env        # fill CONTRACT_HASH and CASPER_KEY_PATH
  python casper_oracle_pusher.py
"""

import asyncio
import os
import time
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

# ── pycspr 1.2.0 imports ──────────────────────────────────────────────────────
try:
    import pycspr
    from pycspr import NodeRpcClient as NodeClient
    from pycspr import NodeRpcConnectionInfo as NodeConnectionInfo
    from pycspr.types.crypto import KeyAlgorithm
    from pycspr.types.cl import CLV_Bool, CLV_U64
    from pycspr.types.node import DeployOfStoredContractByHash
    PYCSPR_OK = True
except ImportError:
    PYCSPR_OK = False

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("oracle_pusher")

# ── Config ────────────────────────────────────────────────────────────────────
FEED_URL      = "https://rtt.phoenix-ai.work/api/public-feed"
HEALTH_URL    = "https://rtt.phoenix-ai.work/api/health"
CONTRACT_HASH = os.getenv("CONTRACT_HASH", "")          # hash-xxxx... after deploy
NODE_HOST     = os.getenv("CASPER_NODE",   "65.108.57.149")
NODE_PORT     = int(os.getenv("CASPER_PORT", "7777"))
KEY_PATH      = os.getenv("CASPER_KEY_PATH", "./keys/secret_key.pem")
CHAIN_NAME    = os.getenv("CHAIN_NAME",    "casper-test")
PAYMENT_MOTES = int(os.getenv("PAYMENT_MOTES", "3000000000"))  # 3 CSPR
INTERVAL      = int(os.getenv("PUSH_INTERVAL", "60"))
DRY_RUN       = os.getenv("DRY_RUN", "false").lower() == "true" or not PYCSPR_OK

# Calibrated thresholds — derived from 206K+ real measurements since March 2026
ARB_REVERT_THRESHOLD = 0.15   # >15% = MEV storm (calibrated: ARB)
BASE_P99_THRESHOLD   = 500    # >500ms = sequencer stall (calibrated: Base)


def fetch_oracle_data() -> dict:
    """
    Fetch latest network health from public Phoenix Zero API.
    No authentication required — data is public.
    """
    feed   = requests.get(FEED_URL,   timeout=10).json()
    health = requests.get(HEALTH_URL, timeout=10).json()

    latest      = feed["data"][-1]
    arb_revert  = float(latest.get("arb_revert",  0) or 0)
    base_revert = float(latest.get("base_revert", 0) or 0)
    arb_p99     = int(latest.get("arb_p99",  0) or 0)
    base_p99    = int(latest.get("base_p99", 0) or 0)

    server_safe = health.get("safe", False)
    metrics_ok  = arb_revert < ARB_REVERT_THRESHOLD and base_p99 < BASE_P99_THRESHOLD

    return {
        "safe":             server_safe and metrics_ok,
        "arb_p99_ms":       arb_p99,
        "base_p99_ms":      base_p99,
        "arb_revert_bps":   int(arb_revert  * 10_000),  # 0.15 → 1500
        "base_revert_bps":  int(base_revert * 10_000),
        "timestamp":        int(time.time()),
        "_arb_revert":      arb_revert,
        "_base_revert":     base_revert,
        "_server_safe":     server_safe,
    }


async def push_to_casper(state: dict, client: NodeClient, signer) -> str:
    """
    Call update() on the SequencerOracle Casper contract.
    Uses pycspr 1.2.0 API with DeployOfStoredContractByHash.
    Returns deploy hash hex string.
    """
    hash_bytes = bytes.fromhex(CONTRACT_HASH.replace("hash-", ""))

    params = pycspr.create_deploy_parameters(
        account=signer,
        chain_name=CHAIN_NAME,
    )
    payment = pycspr.create_standard_payment(PAYMENT_MOTES)
    session = DeployOfStoredContractByHash(
        entry_point="update",
        hash=hash_bytes,
        args={
            "safe":             CLV_Bool(state["safe"]),
            "arb_p99_ms":       CLV_U64(state["arb_p99_ms"]),
            "base_p99_ms":      CLV_U64(state["base_p99_ms"]),
            "arb_revert_bps":   CLV_U64(state["arb_revert_bps"]),
            "base_revert_bps":  CLV_U64(state["base_revert_bps"]),
            "timestamp":        CLV_U64(state["timestamp"]),
        }
    )

    deploy = pycspr.create_deploy(params, payment, session)
    deploy.approve(signer)
    await client.send_deploy(deploy)
    return deploy.hash.hex()


async def main():
    log.info("━" * 58)
    log.info("Phoenix Zero × Silicon DNA  |  Casper Oracle Pusher v1.0")
    log.info(f"Feed:     {FEED_URL}")
    log.info(f"Contract: {CONTRACT_HASH or 'NOT SET — dry run mode'}")
    log.info(f"Interval: {INTERVAL}s  |  Dry run: {DRY_RUN}")
    log.info("━" * 58)

    client = signer = None
    if not DRY_RUN and CONTRACT_HASH and PYCSPR_OK:
        client = NodeClient(NodeConnectionInfo(NODE_HOST, NODE_PORT))
        signer = pycspr.parse_private_key(KEY_PATH, KeyAlgorithm.ED25519)
        log.info(f"Node:   {NODE_HOST}:{NODE_PORT}")
        log.info(f"Signer: {signer.account_key.hex()[:20]}...")

    errors = 0
    while True:
        try:
            state = fetch_oracle_data()

            if client and signer:
                deploy_hash = await push_to_casper(state, client, signer)
            else:
                deploy_hash = "DRY_RUN"

            status = "✅ SAFE  " if state["safe"] else "🚨 UNSAFE"
            log.info(
                f"{status} | arb_revert={state['_arb_revert']*100:.2f}% "
                f"base_revert={state['_base_revert']*100:.2f}% | "
                f"arb_p99={state['arb_p99_ms']}ms base_p99={state['base_p99_ms']}ms | "
                f"tx={deploy_hash[:16]}..."
            )
            errors = 0

        except Exception as e:
            errors += 1
            log.error(f"Error #{errors}: {e}")
            if errors >= 5:
                log.critical("5 consecutive failures — check network connectivity")

        await asyncio.sleep(INTERVAL)


if __name__ == "__main__":
    asyncio.run(main())
