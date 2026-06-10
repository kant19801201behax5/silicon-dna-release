# Silicon DNA × Mantle — Turing Test Oracle

> Mantle Turing Test Hackathon 2026 — integration layer

---

## What This Does

Pushes Silicon DNA **Turing verdicts** to `TuringOracle.sol` on **Mantle Sepolia Testnet** every 60 seconds.

Any Mantle DeFi protocol can call `is_legitimate()` to get real-time bot/human traffic status.

---

## How It Works

```
Silicon DNA Server (DO NYC1)
│  12-layer classification: HUMAN / LEGIT_AGENT / MALICIOUS_BOT
│  Monitors: Mantle, Arbitrum, Base, Optimism, zkSync, Ethereum
│
↓ mantle_pusher.js  (runs every 60s)
│  Reads: trust_score, bot_ratio, mantle_safe, p99_ms
│  Computes: human_traffic = trust > 60% AND bot_ratio < 40%
│
↓ TuringOracle.sol (Mantle Sepolia)
   update(human_traffic, trust_bps, bot_ratio_bps, mantle_safe, p99_ms)

Any Mantle DeFi protocol:
   oracle.is_legitimate()  →  true / false
   oracle.get_state()      →  full snapshot
```

---

## Contract Address

Deployed on **Mantle Sepolia Testnet** (chain ID: 5003) ✅

Deployed: June 10, 2026 | Block: 39780635
Tx: 0x01bfc35f2bb9e7e460a1df79b66a597a5cd99396f5459a47c965ee397a467b2f
```
CONTRACT_ADDRESS=0xd394ffae51d8fb52187cf3ae3b014ddc80dc7b15
```

Explorer: https://sepolia.mantlescan.xyz/address/0xd394ffae51d8fb52187cf3ae3b014ddc80dc7b15

---

## Setup

### 1. Deploy TuringOracle

```bash
# Using Remix IDE (simplest):
# 1. Open https://remix.ethereum.org
# 2. Create new file → paste TuringOracle.sol
# 3. Compile: Solidity 0.8.20
# 4. Deploy: Environment → Injected Provider (MetaMask on Mantle Sepolia)
# 5. Copy contract address → paste in .env

# Get Mantle Sepolia testnet MNT:
# Faucet: https://faucet.testnet.mantle.xyz
```

### 2. Run Pusher

```bash
cd mantle-agent
npm install
cp .env.example .env
# Edit .env: add PRIVATE_KEY and CONTRACT_ADDRESS
node mantle_pusher.js
```

---

## Integration Example

```solidity
interface ITuringOracle {
    function is_legitimate() external view returns (bool);
    function get_state() external view returns (
        bool human_traffic,
        uint256 trust_score_bps,
        uint256 bot_ratio_bps,
        bool mantle_safe,
        uint256 p99_ms,
        uint256 timestamp,
        uint256 update_count
    );
}

contract MyMantleProtocol {
    ITuringOracle public immutable oracle;

    constructor(address _oracle) {
        oracle = ITuringOracle(_oracle);
    }

    function safeExecute() external {
        // Reject if bot traffic detected OR Mantle sequencer unhealthy
        require(oracle.is_legitimate(), "Turing Test: traffic not verified");
        // ... rest of protocol logic
    }
}
```

---

## Silicon DNA Layers (12-layer Turing Test)

| Layer | What It Checks |
|-------|---------------|
| L0 | CPU jitter physics (sub-microsecond, cannot be faked by VMs) |
| L1 | ML-KEM-768 quantum channel (NIST FIPS 203) |
| L2 | JA3/JA4 TLS fingerprint vs bot library database |
| L3 | Behavioral rhythm (mouse events, timing patterns) |
| L4 | Argon2 Proof-of-Work (200ms compute cost per session) |
| L5 | Silicon Hash (session identity chain) |
| L6 | Reputation cache (LRU history) |
| L7 | ML anomaly detection (deviation from human baseline) |
| L8 | Timing consistency (jitter variance over time) |
| L9 | Network telemetry (Mantle RTT, revert ratio, sequencer) |
| L10 | Causal engine (R²=0.998 predictive model) |
| L11 | Composite Silicon DNA trust score [0.0–1.0] |

---

## Files

| File | Description |
|------|-------------|
| `TuringOracle.sol` | Solidity contract — deploys on Mantle Sepolia |
| `mantle_pusher.js` | Node.js autonomous agent — pushes every 60s |
| `package.json` | Dependencies (ethers v6, dotenv) |
| `.env.example` | Config template |
