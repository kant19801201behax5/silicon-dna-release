# Casper Agentic Buildathon 2026 — Submission Checklist

## Mandatory Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| Working prototype on Casper Testnet | ✅ DONE | Active contract: hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a |
| Blockchain transactions generated | ✅ DONE | 962 confirmed update() calls (June 3 – July 6) on original contract, live updates resumed July 16 on redeployed contract |
| Open source GitHub repo | ✅ DONE | https://github.com/kant19801201behax5/silicon-dna-release |
| README with documentation | ✅ DONE | README.md complete with architecture + setup |
| Demo video | ✅ DONE | https://youtu.be/o-CQfiSfQ4o (general Phoenix Zero walkthrough) — Casper-specific 52s clip: https://youtu.be/KtTrz23B92w |

## Live Proof

| Item | Value |
|------|-------|
| Active contract hash | hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a |
| Active contract deployed | July 16, 2026 |
| Original contract hash | hash-5e45d42c52872f66c47e73cdf24b0ced852f9d929834e55ea6b6fa8872d8354d (June 3 – July 6, 2026) |
| Total on-chain updates | 962 (original) + ongoing (active) |
| Safety gate blocks | 3,254 (autonomous decisions) — ⚠️ historical count from the original contract's period (Jun 3–Jul 6); no live counter for this exists in the current deployed `agent.js`, so this figure cannot be independently re-derived from current logs |
| Wallet | 0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb |
| Explorer | https://testnet.cspr.live |
| Dashboard | https://phoenix-zero.vercel.app |
| Public feed | https://rtt.phoenix-ai.work/api/public-feed |
| Demo video (general) | https://youtu.be/o-CQfiSfQ4o |
| Demo video (Casper-specific, 52s) | https://youtu.be/KtTrz23B92w |
| GitHub | https://github.com/kant19801201behax5/silicon-dna-release |

## Privacy Check — Nothing Private Leaks

| Item | Status |
|------|--------|
| JARVIS URL | ✅ NOT in code or README |
| JARVIS token | ✅ NOT in code or README |
| DO server IP 198.211.103.36 | ✅ NOT in any casper-agent file |
| Private keys | ✅ Only in .env (gitignored) |
| Signal format with causal.r2 | ✅ REMOVED — uses public API only |
| SIGNAL_TOKEN | ✅ REMOVED — public feed needs no auth |

## Casper Manifest Alignment (6 of 9 initiatives — see [DORAHACKS_UPDATE.md](./DORAHACKS_UPDATE.md) for the canonical table)

| Initiative | Our Implementation |
|---|---|
| #1 EVM Compatibility | Monitoring 5 EVM chains (Arbitrum, Base, Optimism, zkSync, Mantle) |
| #4 Smart Accounts for Agents | Daily x402 spending cap (`ts-agent/spending-limit.js`) — checked before every payment attempt, not after |
| #5 Compliant Security Tokens | Silicon DNA Sybil detection + ERC-8004 L0 gate |
| #6 Transaction Privacy | ZK-lite proof (HMAC-SHA256) — not true zero-knowledge, disclosed as such |
| #8 X402 Micropayments | Phoenix Zero /api/v1/safe — $0.01/call via x402 |
| #9 Quantum-Safe Cryptography | ML-KEM-768 (NIST FIPS 203) in Silicon DNA L0 |

Note: an earlier version of this table numbered "Smart Accounts for Agents" as
#3 and described it as the LEGIT_AGENT/MALICIOUS_BOT classifier. That was
inconsistent with the actual Casper Manifest (which lists Smart Accounts as
#4) and pointed at the wrong component — the classifier is threshold logic,
not a spend-limit guardrail. Fixed above to match DORAHACKS_UPDATE.md.

## Architecture

```
PUBLIC data → public oracle contract → autonomous agent decisions
     ↓               ↓                        ↓
rtt.phoenix-ai.work  Casper Testnet     ts-agent/agent.js
(verifiable)         (on-chain proof)   (Node.js, deployed, runs the real cycle)
```

Note: `casper-agent/pusher/casper_defi_agent.py` is a local, off-chain
demo script (3 hardcoded fake transactions, no Casper SDK, no signing)
illustrating the pause/resume concept — it is not the deployed agent
and does not itself touch the chain. The real on-chain agent is
`ts-agent/agent.js`.

## Known Incomplete Work

| Item | Status |
|---|---|
| `casper-agent/sdk-typescript/casper-oracle-reader.ts` | ✅ FIXED (2026-07-21) — now genuinely working, not just documented as such. Root cause of the old "state-query predates entity-model addressing" bug: it depended on `casper-js-sdk ^2.15.4`, upgraded to `^3.0.0-rc05` (matching the production `ts-agent`) and rewritten to read state via `query_global_state` — also had to work around a bug in v3.0.0-rc05's own `getEntity()`/`Contract.queryContractData()` helpers (malformed request params against this node). Added the missing `tsconfig.json` (the package had none — `npm run build` failed on a clean checkout with no way to know why). Verified end-to-end on a completely fresh install in an isolated directory: `npm install && npm run build && npm run demo` all succeed and `getState()` returns real, live, current on-chain values (`safe`, `arb_p99_ms`, `base_p99_ms`, `last_update_ts`) matching the production agent's own logs. Also fixed the demo's default staleness threshold (was 180s, tighter than the real ~300s push cycle — would falsely read "stale" for ~40% of any given cycle purely from timing; raised to 360s). |
| Casper-native x402 payment (`ts-agent/x402-casper-pay.js`) | ⚠️ Client module + working CSPR.cloud API key both confirmed ready. Not wired into the live payment-accepting side (`/opt/phoenix_zero/x402_gateway.py`, Base-only today) — that requires editing a live production payment gateway, deliberately not done without an explicit go-ahead per session. Full facilitator API spec (verify/settle schema, real testnet asset: CEP-18 "Wrapped CSPR", package hash `3d80df21ba4ee4d66a2a1f60c32570dd5685e4b279f6538162a5fd1314847c1e`) already researched and confirmed live on-chain — implementation-ready whenever approved. |
| Surge pricing (`_surge_price()` in x402_gateway.py) | ⚠️ Computed and exposed informationally via `/v1/price`, but never actually applied to what `/v1/safe` charges — that endpoint always charges the flat rate regardless of network conditions. Either wire it in for real or stop describing it as a live pricing mechanism. |
| Mantle pusher wallet unfunded | ⚠️ Dead since 2026-07-08 (out of testnet gas). Contract itself confirmed live on-chain. Mantle Turing Test Hackathon's own schedule shows winners were to be announced 2026-07-10 — refueling now most likely doesn't affect that hackathon's outcome, but the pusher should still be revived since it feeds the same shared oracle. |
| Possible past "Allora" connection | ⚠️ User recalled this x402 gateway may have originally been built for/discussed with a specific external party (possibly related to Allora Network) who never followed up after an agreement. No record of this found in memory or this repo — needs the user's own recollection (name, chat log, anything concrete) before it can be investigated further. |
| Casper Final Round registration | ✅ DONE (2026-07-18) — registered, submitted the current/corrected BUIDL text (not the stale qualification-round version) to the finals page. Awaiting results. |
| `oracle-contract/Cargo.toml` build from a fresh clone | ⚠️ Has a `[patch.crates-io]` pointing at an absolute path on the production server (`/opt/casper-oracle/casper-contract-patched`), not included in this repo. `cargo build` on a clean checkout will fail on that line. `casper-contract 5.1.1` is published normally on crates.io, so removing the patch block should work, but that hasn't been verified end-to-end. Verify against the deployed, on-chain contract instead of rebuilding until this is fixed. |
| `ts-agent/call_contract.js`, `ts-agent/deploy_contract.js`, `ts-agent/agent.js`, `ts-agent/.env.example` | ✅ Deeper pass (2026-07-21) found these had drifted from what's actually running in production: `call_contract.js` used an outdated SDK call (`newStoredContractByHash` instead of the `newStoredVersionContractByHash` the live entity-model contract actually needs — same class of bug as the sdk-typescript issue above), `deploy_contract.js` pointed at a paid CSPR.cloud RPC needing an API key nobody cloning this repo would have, and `.env.example` set `DRY_RUN=false` and a dead RPC URL, contradicting TESTING_GUIDE.md's "safe to run without a funded key" instructions. All four synced to match the real, working production code. |
| MCP server (`mcp-server/`) | ✅ ADDED (2026-07-21) — Casper's own AI toolkit page promotes MCP servers as a core agentic-AI building block; this repo previously used none of the toolkit (no MCP, no CSPR.click Agent Skill, no CSPR.cloud API). Added a real one: exposes `get_sequencer_safety` and `get_oracle_state` as MCP tools over the same public feed the Casper agent itself reads. Verified end-to-end with a real MCP client (`@modelcontextprotocol/sdk`'s `Client` + `StdioClientTransport`) on a completely fresh `npm install` — both tools return live data. CSPR.click and native CSPR.cloud API remain unused; the x402 payment rail also remains on Base mainnet, not Casper's native facilitator (see Technical Stack). |
| `pusher/requirements.txt` install on modern Python | ⚠️ Found 2026-07-21: `pycspr==1.2.0` pins `blake3>=0.4.1,<0.5.0`, an old release with no prebuilt wheel for newer Python versions (verified failing on 3.13 — pip falls back to a source build requiring a Rust toolchain). Doesn't block the documented judge path (TESTING_GUIDE.md only exercises `ts-agent/`, never this Python pusher, which is explicitly non-deployed reference code — see the note under Architecture above). Would need pinning a newer blake3 or pycspr release to fix, not attempted since it's off the critical path. |
| `build_wasm_local.ps1`, `deploy_to_testnet.sh` | ⚠️ Found 2026-07-21: superseded leftover scripts, not referenced by any current doc. Both describe an older deploy path (`cargo odra build`) that contradicts this repo's actual, current build process (raw casper-contract 5.1.1, no Odra — see README.md's Setup section) and target the Python pusher + `casper-oracle-pusher.service`, neither of which is the real deployed agent. Marked with a warning header in both files rather than deleted or silently rewritten. |
| Live Casper dashboard (`rtt.phoenix-ai.work/casper`) | ✅ FIXED (2026-07-21) — the most important finding of this pass. `/opt/casper-dashboard/index.html` on the production server (what TESTING_GUIDE.md step 4 actually sends judges to) had not been touched since June 3 and was completely out of sync with every fix in this repo: showed the *original, dead* contract hash (`hash-5e45d42c...` instead of the active `hash-2a7ebbc9...`), the wrong x402 price ($0.001 instead of $0.01), a 60s/60+ tx cadence instead of the real 5-minute/962+ cadence, and the old, inflated "Silicon DNA — 12-layer identity check → LEGIT_AGENT/MALICIOUS_BOT" framing this same audit had already corrected everywhere else. Deployed the repo's corrected `dashboard/index.html` to the live server (backed up the old file first); verified byte-for-byte identical to the repo afterward. |
| `casper-agent.service` (repo copy) | ✅ Synced (2026-07-21) — repo said `User=phoenix`, live systemd unit actually runs `User=root`. Updated the repo file to match reality; did not change the live service's user (would need to know why it runs as root before touching that). |
| Silicon DNA ↔ x402 gate | ✅ FIXED (2026-07-21). Was previously documented as a real integration but wasn't wired up anywhere in the deployed code — `/api/v1/safe` never called Silicon DNA at all. Now genuinely connected: `x402_gateway.py` queries a new, localhost-only `/api/check-ip` endpoint on Silicon DNA before granting access to any `/v1/*` route, and rejects IPs already on Silicon DNA's live ban list with `403 blocked_by_silicon_dna` — before payment is even requested. Fails open (never blocks) if Silicon DNA is unreachable, so a Silicon DNA outage can't take down paid access. Verified end-to-end in production: injected a test ban on a reserved (RFC 5737, non-routable) address, confirmed the gateway rejected it, confirmed a clean address still got the normal 402 flow, confirmed the live casper-agent's real 5-minute push cycle was undisturbed across the change. Also found and fixed during this: the "localhost-only" checks on this new endpoint and on the pre-existing `/api/agent/interact` endpoint were not actually enforced (both compared against `req.socket.remoteAddress`, which is always nginx's loopback connection once proxied — so external callers passed the check). Real enforcement added at the nginx layer (`deny all` on both exact paths). |
