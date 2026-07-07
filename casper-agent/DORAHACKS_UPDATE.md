# Phoenix Zero × Silicon DNA — Casper Agentic Buildathon 2026

## What it is

Phoenix Zero is a sequencer-health oracle for 6 blockchains (Arbitrum, Base, Optimism, zkSync, Mantle, Casper), probed every 2 seconds. Silicon DNA is a 12-layer bot/agent identity classifier gating access to that data. Together: a Casper smart contract publishes `safe: true/false` and network metrics every 60 seconds, so any Casper DeFi agent can check network health before sending a transaction, and any x402 payment for that data first passes an identity check.

## How to test it

1. **Verify the on-chain contract** — query the Casper testnet RPC directly:
   ```
   POST https://node.testnet.casper.network/rpc
   {"jsonrpc":"2.0","id":1,"method":"query_global_state","params":{"key":"hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d","path":[]}}
   ```
   Returns the deployed `ContractPackage` for the oracle. Wallet: `0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb`.

2. **Check the live off-chain feed:**
   ```
   curl https://rtt.phoenix-ai.work/api/public-feed
   ```
   Returns real-time RTT/revert-ratio data updated every 2 seconds.

3. **Run the oracle server locally:**
   ```
   git clone https://github.com/kant19801201behax5/silicon-dna-release
   cd silicon-dna-release
   npm install
   node server.js
   # Dashboard: http://localhost:3000
   ```

4. **Run the Casper agent tests:**
   ```
   cd casper-agent/pusher
   pip install -r requirements.txt
   pytest
   ```

5. **Dashboard (hosted):** https://phoenix-zero.vercel.app

## Live proof

| Item | Value |
|---|---|
| Contract hash | `hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d` |
| Deployed | June 3, 2026 |
| Confirmed on-chain `update()` calls | 962 (verifiable via RPC or https://testnet.cspr.live) |
| Autonomous safety-gate blocks recorded | 3,254 (`arb_revert_ratio` > 15% threshold) |
| Off-chain data collection | Live since March 2026, 206,000+ RTT measurements |
| On-chain pusher status | Currently paused — testnet wallet balance is 0 CSPR, pending refill. Off-chain oracle and dashboard remain live. |

## Architecture

```
Phoenix Zero (DigitalOcean) — probes 6 chains every 2s
        ↓
casper_oracle_pusher.py — publishes state on-chain every 60s
        ↓
SequencerOracle (Casper Testnet, Rust/WASM)
        ↓
Any Casper DeFi agent: oracle.is_safe() before sending a transaction
```

## Casper Manifest alignment

| Initiative | Implementation |
|---|---|
| #8 X402 Micropayments | `/api/v1/safe` — $0.001/call via x402 |
| #9 Quantum-Safe Cryptography | ML-KEM-768 (NIST FIPS 203) in Silicon DNA L0 |
| #5 Compliant Security Tokens | Sybil detection + ERC-8004-style L0 gate |
| #3 Smart Accounts for Agents | LEGIT_AGENT / MALICIOUS_BOT / HUMAN classifier |

## Links

- GitHub: https://github.com/kant19801201behax5/silicon-dna-release
- Demo video: https://youtu.be/o-CQfiSfQ4o
- Dashboard: https://phoenix-zero.vercel.app
- Contact: Telegram [@Kentyrk](https://t.me/Kentyrk) · aleksandrkent64@gmail.com
