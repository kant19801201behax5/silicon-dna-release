# Mantle Turing Test Hackathon 2026 Hackathon — Submission Checklist

## General Requirements (Part A — Mantle, 50 pts)

| Criterion | Status | Score Target |
|-----------|--------|-------------|
| Technical: architecture readable | ✅ src/CAUSAL_ENGINE.md + src/SILICON_DNA_LAYERS.md | 12/15 |
| Technical: core runs end-to-end on Mantle | ✅ Deployed, contract verified live on-chain | ⚠️ pusher currently unfunded — see TODO #2 |
| Ecosystem fit: Mantle integration | ✅ Deployed and integrated | ⚠️ pusher currently unfunded — see TODO #2 |
| Business potential: PMF + GTM | ✅ B2B data sales + x402 | 8/10 |
| Innovation: novel data + causal model | ⚠️ MEV war proof is this project's own; R²=0.998 causal model belongs to JARVIS (separate system, not wired into this oracle — see src/CAUSAL_ENGINE.md) | 6/10 |
| UX: dashboard | ✅ phoenix-zero.vercel.app | 3/5 |
| **Part A estimate** | | **~35/50 (no deploy) → 44/50 (deployed)** |

## Track-Specific Requirements (Part B — Mirana Alpha & Data, 50 pts)

| Criterion | Status | Score Target |
|-----------|--------|-------------|
| Insight value (15): unique on-chain insight | ✅ arb_revert_ratio as MEV leading indicator | 13/15 |
| Data source quality (15): breadth, freshness | ✅ 6 chains, 2s granularity, continuous since 2026-03-15 (132 days as of 2026-07-25) | 13/15 |
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

2. [ ] **STILL UNRESOLVED as of 2026-07-29 (re-verified live via `journalctl -u mantle-pusher.service`):**
   Refuel pusher wallet `0x3eB081ea4eC0cFb5d16d610d1eb295e12Cb633a8` on Mantle Sepolia.
   Confirmed still retrying every 60s and still failing every single attempt,
   continuously since **2026-07-08** — three weeks of zero successful pushes as
   of this check. Balance ~0.00542 MNT; current tx cost fluctuates ~0.0069-0.0071
   MNT with live gas prices, short by ~0.0015-0.0017 MNT. This is the single
   highest-leverage fix outstanding: a ~2-minute testnet faucet request resumes
   on-chain updates immediately, systemd service is already running and will
   pick it up on its next 60s tick with no restart needed.
   Faucets: https://faucet.quicknode.com/mantle/sepolia (no social auth, but
   requires solving a browser challenge — could not be scripted) or
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
| Internal (non-public) systems | ✅ NOT mentioned anywhere |
| Private keys | ✅ .env only (gitignored) |
| Production server IP | ✅ NOT in any file |
| Signal auth token | ✅ Uses public feed only |
| Sensitive trading data | ✅ Only public metrics shown |
