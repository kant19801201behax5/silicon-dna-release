# How to Test — Phoenix Zero Casper Oracle

Step-by-step instructions for judges to verify the live system.

---

## 1. Verify the Smart Contract On-Chain

**Contract hash:**
```
hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a
```

**View on Casper Testnet explorer:**
https://testnet.cspr.live/contract/hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a

You will see:
- Entry points: `update`, `is_safe`, `get_state`, `staleness_seconds`
- Named keys: `safe`, `p99_ms`, `revert_ratio_bps`, `silicon_dna_trust_bps`, `timestamp`, `last_update`

---

## 2. Verify the Deployer Wallet

**Wallet address:**
```
0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb
```

**View on explorer:**
https://testnet.cspr.live/account/0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb

You will see 60+ deploy transactions — each one is an `update()` call from the autonomous agent.

---

## 3. Verify Key Transactions

| TX Hash | What it is |
|---------|------------|
| `2578359cc8ffcdac8316d6002d3aabed26888c102c8d69a2ccd3239f3fcd3326` | Contract deploy |
| `4774fdbc61b42e683024a059be624279a2b06a13a654bcebfe1065492b7652f1` | First agent update() |
| `d841a0c19cd29cfead1f6d834c13ec1325f6ccf7c9030a91a9595ec4aca47a7a` | Manual test tx |

View any TX: `https://testnet.cspr.live/deploy/<TX_HASH>`

---

## 4. Read Live Oracle State via Public API

The oracle's source data is publicly readable — no key required:

```bash
curl https://rtt.phoenix-ai.work/api/public-feed
```

Response (example):
```json
[
  {"chain": "arbitrum", "p99_ms": 45, "revert_ratio": 0.04, "stall": false, "tension": 0.085},
  {"chain": "base",     "p99_ms": 38, "revert_ratio": 0.02, "stall": false, "tension": 0.031},
  {"chain": "optimism", "p99_ms": 51, "revert_ratio": 0.03, "stall": false, "tension": 0.044},
  {"chain": "zksync",   "p99_ms": 72, "revert_ratio": 0.05, "stall": false, "tension": 0.062},
  {"chain": "mantle",   "p99_ms": 62, "revert_ratio": 0.02, "stall": false, "tension": 0.041},
  {"chain": "casper",   "p99_ms": 89, "revert_ratio": 0.01, "stall": false, "tension": 0.018}
]
```

---

## 5. Watch Live Oracle Dashboard

https://rtt.phoenix-ai.work/casper

Shows:
- Current `safe` state (green/red)
- Chain health bars (real-time)
- Agent activity log (last 10 updates)
- Contract address with testnet.cspr.live link

Refreshes every 30 seconds.

---

## 6. Run the Pusher Agent Locally

Requirements: Python 3.10+, testnet CSPR wallet, Casper node access

```bash
git clone https://github.com/kant19801201behax5/casper-agent
cd casper-agent/pusher
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:
```
CASPER_CONTRACT_HASH=hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a
CASPER_NODE=65.108.57.149
CASPER_PORT=7777
CASPER_KEY_PATH=./keys/your_secret_key.pem
```

Run:
```bash
python casper_oracle_pusher.py
```

Expected output every 60s:
```
[2026-07-09 12:00:01] Fetched oracle: safe=True arb_p99=45ms revert=4.0%
[2026-07-09 12:00:02] Contract updated → TX: abc123...
[2026-07-09 12:01:01] Fetched oracle: safe=True arb_p99=48ms revert=3.8%
[2026-07-09 12:01:02] Contract updated → TX: def456...
```

---

## 7. Run the TypeScript Agent Tests

```bash
cd casper-agent/ts-agent
npm install
npm test
```

Expected:
```
  Oracle Safety Logic
    ✓ safe when all metrics normal
    ✓ unsafe when arb revert > 15%
    ✓ unsafe when tension > 0.3
    ✓ safe when arb revert exactly 14.9%
    ✓ unsafe when stall detected
    ✓ handles NaN revert ratio safely
    ✓ handles missing chain data
    ✓ unsafe when r2 too low

  Oracle Response Parsing
    ✓ parses valid feed correctly
    ✓ throws on empty array
    ✓ throws on null data
    ✓ handles missing optional fields

  Basis Points Conversion
    ✓ converts 0.04 to 400 bps
    ✓ converts 0.0 to 0 bps
    ✓ converts 1.0 to 10000 bps

15 passing
```

---

## 8. Verify Safety Logic

The agent computes `safe` from the public feed:

```python
safe = (
    arb_revert_ratio < 0.15 and   # < 15% revert
    tension < 0.3 and              # < 30% MEV tension
    causal_r2 > 0.4                # causal model confidence
)
```

During the **May 31, 2026 MEV war**:
- `arb_revert_ratio = 0.721` → safe became **false**
- Oracle published this to Casper Testnet 3 minutes before the acute stall

---

## Summary

| What to check | Where |
|---------------|-------|
| Contract exists | testnet.cspr.live/contract/hash-5e45... |
| 60+ agent txs | testnet.cspr.live/account/020249... |
| Deploy TX | testnet.cspr.live/deploy/257835... |
| Live data | rtt.phoenix-ai.work/api/public-feed |
| Dashboard | rtt.phoenix-ai.work/casper |
| Demo video | https://youtu.be/o-CQfiSfQ4o |
