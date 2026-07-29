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
│  Monitors: Mantle, Arbitrum, Base, Optimism, zkSync, Casper (6 chains; Ethereum L1 probed separately for blob-fee/gas-pressure)
│  Publishes: /api/public-feed — per-chain RTT/revert-ratio/tension telemetry
│
↓ mantle_pusher.js  (runs every 60s)
│  Reads the public feed above (network telemetry, NOT the per-visitor bot-detection
│  layers below — corrected 2026-07-29, this previously implied it read from the
│  12-layer identity cascade, it does not).
│  trust_bps     = (1 - avg_cross_chain_tension) * 10000
│  bot_ratio_bps = arbitrum_revert_ratio * 10000
│  human_traffic = trust_bps > 6000 AND bot_ratio_bps < 4000
│  ("human_traffic"/"bot_ratio" here are network-congestion proxies, not a
│  verdict about who is visiting the site — see note below the layer table.)
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

## Silicon DNA Layers (per-visitor bot-detection cascade)

*Corrected 2026-07-29: L7/L10/L11 below previously described features that
don't exist in the deployed code ("ML anomaly detection", "Causal engine
R²=0.998", "Composite trust score [0.0-1.0]"). Full verified breakdown, with
exact file/line citations, in
[`../src/SILICON_DNA_LAYERS.md`](../src/SILICON_DNA_LAYERS.md) — table below
trimmed to match it.*

| Layer | What It Checks |
|-------|---------------|
| L0 | CPU jitter physics (sub-microsecond, cannot be faked by VMs) |
| L1 | ML-KEM-768 quantum channel (NIST FIPS 203) |
| L2 | TLS fingerprint vs bot library database — currently a fixed placeholder, real JA4 needs raw ClientHello access unavailable behind Cloudflare's free tier |
| L3 | "Frankenstein" UA/header consistency check (independent ban trigger) |
| L4 | Argon2id Proof-of-Work, with ASIC-spoof and slow-time replay guards |
| L5 | Session identity hash: HMAC-SHA256 keyed by the L1 ML-KEM session key |
| L6 | PoW difficulty cache (per-IP, adapts challenge cost — not a reputation score) |
| L7 | Synthetic-rhythm variance/autocorrelation threshold (independent ban trigger, not an ML model) |
| L8 | Spearman rank-correlation "static script" stall detector (independent ban trigger) |
| L9 | Network telemetry gate (this project's own signal: `arb_revert_ratio`/`p99` — this is what `mantle_pusher.js` actually reads, see diagram above) |

**Separately** (not part of the L0-L9 cascade, not read by `mantle_pusher.js`):
a real 3-class HUMAN/LEGIT_AGENT/MALICIOUS_BOT classifier
(`agentClassifier.ts`, `POST /api/classify`), a "Golden Seal" timing-rhythm +
entropy-seal protocol guarding `/api/enclave`, and EIP-191 wallet-to-behavioral
Sybil binding. None of these feed the Mantle oracle — TuringOracle's
`trust_bps`/`bot_ratio_bps` come from L9's network telemetry only, per the
diagram above. Full detail: [`../src/SILICON_DNA_LAYERS.md`](../src/SILICON_DNA_LAYERS.md).

---

## Files

| File | Description |
|------|-------------|
| `TuringOracle.sol` | Solidity contract — deploys on Mantle Sepolia |
| `mantle_pusher.js` | Node.js autonomous agent — pushes every 60s |
| `package.json` | Dependencies (ethers v6, dotenv) |
| `.env.example` | Config template |
