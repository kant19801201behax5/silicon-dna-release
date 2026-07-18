# Mantle Turing Test Hackathon 2026 Hackathon — Submission Checklist

## General Requirements (Part A — Mantle, 50 pts)

| Criterion | Status | Score Target |
|-----------|--------|-------------|
| Technical: architecture readable | ✅ src/CAUSAL_ENGINE.md + src/SILICON_DNA_LAYERS.md | 12/15 |
| Technical: core runs end-to-end on Mantle | ✅ Deployed, contract verified live on-chain | ⚠️ pusher currently unfunded — see TODO #2 |
| Ecosystem fit: Mantle integration | ✅ Deployed and integrated | ⚠️ pusher currently unfunded — see TODO #2 |
| Business potential: PMF + GTM | ✅ B2B data sales + x402 | 8/10 |
| Innovation: novel data + causal model | ✅ R²=0.998, MEV war proof | 9/10 |
| UX: dashboard | ✅ phoenix-zero.vercel.app | 3/5 |
| **Part A estimate** | | **~35/50 (no deploy) → 44/50 (deployed)** |

## Track-Specific Requirements (Part B — Mirana Alpha & Data, 50 pts)

| Criterion | Status | Score Target |
|-----------|--------|-------------|
| Insight value (15): unique on-chain insight | ✅ arb_revert_ratio as MEV leading indicator | 13/15 |
| Data source quality (15): breadth, freshness | ✅ 6 chains, 2s granularity, 14 months | 13/15 |
| Investment utility (12): informs real decisions | ✅ 27s lead time, May 31 case study | 10/12 |
| Scalability (8): can grow | ✅ new chain < 1 hour | 7/8 |
| **Part B estimate** | | **~43/50** |

## Total Estimate: ~78-87/100 (Good → Excellent range)

## Priority TODO — status as of 2026-07-18 (re-audited)

1. [x] **DONE:** Deploy TuringOracle.sol to Mantle Sepolia
   - Address: `0xd394ffae51d8fb52187cf3ae3b014ddc80dc7b15`
   - Tx: `0x01bfc35f2bb9e7e460a1df79b66a597a5cd99396f5459a47c965ee397a467b2f`
   - Block: 39780635 | Deployed: June 10, 2026
   - Explorer: https://sepolia.mantlescan.xyz/address/0xd394ffae51d8fb52187cf3ae3b014ddc80dc7b15
   - Re-verified 2026-07-18: contract bytecode confirmed live on-chain via `eth_getCode`

2. [ ] **STILL UNRESOLVED — this exact item was flagged before June 15 and never actioned:**
   Refuel pusher wallet `0x3eB081ea4eC0cFb5d16d610d1eb295e12Cb633a8` on Mantle Sepolia.
   As of 2026-07-18: balance ~0.0054 MNT, needs ~0.0069 MNT — short by about
   0.0015 MNT. Pusher has been retrying every 60s and failing on every single
   attempt since **2026-07-08** (14,372 consecutive failures, zero successes).
   The dependency vulnerability below has been fixed independently of this —
   funding is the only remaining blocker.
   Faucets: https://faucet.quicknode.com/mantle/sepolia (no social auth) or
   https://faucet.sepolia.mantle.xyz/ (up to 1000 MNT, needs X/Twitter).

3. [ ] **VERIFY MANUALLY — cannot be confirmed from this repo alone:**
   Was this file's content ever actually pasted into the live DoraHacks BUIDL
   page? This exact TODO line was never checked off. If it wasn't done, the
   live submission may not reflect anything fixed since June 12.

4. [x] Contract address in README.md ✅

5. [x] **NEW 2026-07-18:** Fixed a HIGH-severity `ws` DoS vulnerability
   (memory exhaustion, via `ethers`'s transitive dependency) — bumped
   `ethers` 6.13→6.17 in `package.json`, 0 vulnerabilities remain, verified
   on the production server and restarted.

## Privacy Check

| Item | Status |
|------|--------|
| JARVIS / Phoenix AGI | ✅ NOT mentioned anywhere |
| Private keys | ✅ .env only (gitignored) |
| DO server IP 198.211.103.36 | ✅ NOT in any file |
| Signal auth token | ✅ Uses public feed only |
| Sensitive trading data | ✅ Only public metrics shown |
