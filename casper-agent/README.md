# Phoenix Zero × Silicon DNA — Casper Sequencer Health Oracle

> **Casper Agentic Buildathon 2026 — Final Round** submission
> Track (per the rules): the buildathon runs a **single** track — the Casper Innovation Track.
> Focus areas: Agentic AI applied to DeFi and/or RWA on Casper.
>
> **What we are inside that track: on-chain AI services and infrastructure.** Not an app that happens
> to use an oracle — the oracle *is* the product, and it is shared infrastructure any other Casper
> agent can build on (free `is_safe()` on-chain, or $0.01/call via x402 for the full feed). It ran in
> production for three months before this buildathon and is already consumed by a second, unrelated
> public project. That is the category we are competing in.

---

## Track Fit — Agentic AI × DeFi × RWA

The buildathon asks for production-ready applications at the convergence of **Agentic AI**, **DeFi**
and **RWA** on Casper. All three are addressed by working, live components — each verifiable right
now, not planned:

| Focus area | What is actually running | How to check it yourself |
| --- | --- | --- |
| **Agentic AI** | A Node.js agent perceives (public feed), holds a goal (don't waste gas), decides (safe/unsafe) and acts on-chain (`update()`) every 5 min, 24/7, no human in the loop. **2,937** `update()` calls on the active contract, **23** autonomous pauses, **57.5 CSPR** of gas saved, **14,905 min** uptime with 0 restarts | `ts-agent/` + testnet explorer; `DRY_RUN=true` reproduces the decision loop locally |
| **DeFi** | Any Casper DeFi agent can gate a transaction on `is_safe()` in one on-chain call. TypeScript SDK reads the live contract; x402 endpoint monetises the same data at $0.01/call (`HTTP 402` with a real payment challenge) | `sdk-typescript/` demo prints EXECUTE/BLOCK per transaction; `curl -i https://rtt.phoenix-ai.work/api/v1/safe` |
| **RWA** | Regulated RWA settlement needs a network-safety check, real market liquidity, and counterparty screening. `get_rwa_settlement_signal` (MCP tool) combines all three — network safety now includes a calibrated Casper-native P99 threshold, plus live CSPR/USD liquidity read from Kraken's public API — into one `ready_to_settle` verdict. As of 2026-07-29 the same logic also exists as an on-chain contract (`RwaSettlementGate`, built with Odra) any other Casper contract can call directly via `is_settlement_allowed()` | `mcp-server/` — call the tool; `rwa-settlement-gate/` — contract source; [testnet explorer](https://testnet.cspr.live/contract-package/fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d) |

**Machine-native commerce context:** CSPR went live for trading on Kraken on **July 21, 2026**
([Kraken](https://blog.kraken.com/product/asset-listings/cspr-is-available-for-trading),
[Decrypt](https://decrypt.co/373933/casper-network-now-available-for-trading-on-kraken)) — four days
before this submission. Casper's own positioning is infrastructure for regulated RWAs and
machine-native commerce; a network-safety oracle plus an agent-identity gate are exactly the two
primitives that machine-to-machine settlement needs before it can be trusted with value.

**Submission requirements:** public repo ✅ (this one) · demo video ✅
([52 s, Casper-specific](https://youtu.be/KtTrz23B92w)) · working prototype on Casper Testnet ✅
(contract hash below, receiving `update()` right now) · documentation ✅ (this README +
[TESTING_GUIDE.md](./TESTING_GUIDE.md), which walks a judge through on-chain verification step by step).

---

## What This Is

An autonomous agent that monitors 6 blockchain sequencers in real time and publishes verified safety data to a **Casper Testnet smart contract** — so any DeFi agent on Casper can check "is it safe to transact right now?" with a single on-chain call.

**Live data since:** March 15, 2026
**Chains monitored:** Arbitrum, Base, Optimism, zkSync, Mantle, Casper
**Measurement throughput:** ~258,700/day across the 6 chains (measured off the live feed 2026-07-25); the May 31 study below was run on a 206,040-record feed snapshot
**Proven:** MEV war May 31, 2026 — 72.1% revert ratio detected 3 minutes early

**Market context:** CSPR went live for trading on Kraken July 21, 2026, and Casper has joined **ERC-7943** (RWA tokenization) and contributed to **ERC-3643** (permissioned, compliance-gated issuance). Regulated RWA settlement needs both a network-safety check *and* counterparty identity screening — the two signals this project already provides (network oracle + Silicon DNA identity gate). We don't implement those token standards; see [DORAHACKS_UPDATE.md](./DORAHACKS_UPDATE.md) for the honest framing.

---

## Architecture

```
Phoenix Zero (DO NYC1)
│  Probes 6 chains every 2s via eth_blockNumber / info_get_status
│  Measures: RTT P99, revert ratio, stall detection
│
↓ https://rtt.phoenix-ai.work/api/public-feed  (public, no auth)
│
│  [
│    { "chain": "arbitrum", "p99_ms": 45, "revert_ratio": 0.04, "stall": false, "tension": 0.085 },
│    { "chain": "mantle",   "p99_ms": 62, "revert_ratio": 0.02, "stall": false, "tension": 0.041 },
│    ...
│  ]
│
↓ ts-agent/agent.js  (Node.js autonomous agent, checks every 5 min, pushes when safe)
│
│  Computes:
│    safe = server_safe AND arb_revert < 15% AND base_p99 < 500ms
│
↓ Casper Testnet — SequencerOracle contract
   update(safe, arb_p99_ms, base_p99_ms, arb_revert_bps, base_revert_bps, timestamp)

Any Casper DeFi agent:
   oracle.is_safe()  →  true / false
   oracle.get_state()  →  full metrics snapshot (JSON string)
```

---

## Components

### 1. Casper Smart Contract (`oracle-contract/`)

Raw `casper-contract` 5.1.1 (Rust/WASM) — no Odra abstraction layer.

```
Entry points:
  call()                     — deploy, records deployer as authorized caller
  update(safe, arb_p99_ms, base_p99_ms,
         arb_revert_bps, base_revert_bps, timestamp)
                              — authorized caller only, pushes new state
  is_safe() → bool           — any agent reads this
  get_state() → String       — full snapshot as JSON
```

`update()` checks the caller against the account that deployed the contract (added after the June deployment — see [DORAHACKS_UPDATE.md](./DORAHACKS_UPDATE.md) for why).

### 2. Agent (`ts-agent/agent.js`)

Node.js autonomous agent — the one actually running in production (`systemd` unit `casper-agent.service`). Reads the public feed, decides safe/unsafe, calls `update()` via `call_contract.js`.

```bash
cd ts-agent
npm install
cp .env.example .env
# fill in CASPER_SECRET_KEY_PATH, CONTRACT_HASH
npm start
```

A Python implementation (`pusher/casper_oracle_pusher.py`) also exists in this repo with equivalent logic, but it is not the one deployed — the Node.js agent above is.

### 3. MCP Server (`mcp-server/`)

Exposes the same live safety data as [Model Context Protocol](https://modelcontextprotocol.io)
tools (`get_sequencer_safety`, `get_oracle_state`) — part of the AI toolkit
Casper itself promotes (https://www.casper.network/ai). Lets any MCP-compatible
agent (Claude Desktop, etc.) query network safety without touching this
project's REST API directly.

```bash
cd mcp-server
npm install
node index.js
```

See [mcp-server/README.md](./mcp-server/README.md) for the Claude Desktop config and what was verified.

### 4. RWA Settlement Gate (`rwa-settlement-gate/`)

A second, additive contract — live on Casper Testnet since 2026-07-29, built with the
**Odra** framework (the main oracle above deliberately uses raw WASM instead; this
contract shows both approaches in the same repo). It turns `get_rwa_settlement_signal`
from a read-only MCP tool into something any Casper contract can call cross-contract
before settling an RWA transfer.

```
contract-package-fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d
```

```
Entry points:
  init()
  publish(network_safe, identity_screening_active, timestamp) — authorized publisher only
  is_settlement_allowed() → bool   — true only if both signals are true
  get_network_safe() / get_identity_screening_active() / get_last_update_ts()
```

**Prerequisites (one-time, not needed for the raw-WASM oracle above — Odra's own
toolchain, separate from steps 1-4 in "Deploy Contract to Casper Testnet" below):**

```bash
# System packages cargo-odra needs to build (Debian/Ubuntu) — without these,
# `cargo install cargo-odra` fails with an openssl-sys/pkg-config error.
sudo apt-get install -y pkg-config libssl-dev

# cargo-odra itself
cargo install cargo-odra --locked

# wasm32 target for whatever toolchain cargo-odra invokes
rustup target add wasm32-unknown-unknown

# wasm-strip — apt's binaryen package normally has this too, fine as-is
which wasm-strip || sudo apt-get install -y wabt
```

**The one prerequisite that actually blocks a build, twice-confirmed:** apt's
`binaryen` package (`wasm-opt`) is commonly too old — v105 does not recognize the
`--signext-lowering` flag `cargo odra build`'s optimization step passes it, and the
build fails with `Unknown option '--signext-lowering'` / `Wasm preprocessing error:
... Bulk memory operations are not supported` if you skip optimization and deploy
anyway (confirmed: costs real gas, the transaction fails on-chain). Fetch a current
release directly instead of relying on apt:

```bash
curl -sSfL -A "rwa-gate-build" \
  "https://github.com/WebAssembly/binaryen/releases/download/version_128/binaryen-version_128-x86_64-linux.tar.gz" \
  -o /tmp/binaryen.tar.gz
tar -xzf /tmp/binaryen.tar.gz -C /tmp
export PATH="/tmp/binaryen-version_128/bin:$PATH"   # must come before system wasm-opt in PATH
```

**Build and deploy:**

```bash
cd rwa-settlement-gate
cargo odra build
# Expected: wasm/RwaSettlementGate.wasm, ~148 KB. Sanity check before spending any gas:
#   wasm-objdump -x wasm/RwaSettlementGate.wasm | grep '"call"'   # must show the call() export
#   wasm2wat wasm/RwaSettlementGate.wasm -o /tmp/check.wat && \
#     grep -c 'memory.copy\|memory.fill' /tmp/check.wat            # must be 0

ODRA_CASPER_LIVENET_NODE_ADDRESS=https://node.testnet.casper.network \
ODRA_CASPER_LIVENET_CHAIN_NAME=casper-test \
ODRA_CASPER_LIVENET_EVENTS_URL=https://node.testnet.casper.network/events \
ODRA_CASPER_LIVENET_SECRET_KEY_PATH=./keys/secret_key.pem \
  cargo run --bin rwa_settlement_gate_cli -- deploy
```

Note: point `ODRA_CASPER_LIVENET_NODE_ADDRESS` at the **official** Casper node, not
`node.testnet.cspr.cloud` — `odra-casper-livenet-env` 2.9.0 reads `CSPR_CLOUD_AUTH_TOKEN`
into its config but never actually attaches it to any HTTP request (confirmed against
the pinned `release/2.9.0` source), so every CSPR.cloud call 401s. See
[DORAHACKS_UPDATE.md](./DORAHACKS_UPDATE.md) and [CHECKLIST.md](./CHECKLIST.md) for the
full story, including the two earlier failed deploy attempts and why.

**Also check `ODRA_CASPER_LIVENET_TTL` / gas limit if redeploying:** the shipped
`bin/cli.rs` requests 500 CSPR gas — 200 CSPR genuinely ran out of gas on the first
real attempt (documented in CHECKLIST.md), so don't lower this without re-testing.

Wired (2026-07-30): `ts-agent/publish_gate.js` calls `publish()` every 15 min (cron,
separate from the oracle's `update()` loop). First on-chain publish verified — deploy
`5e5a89bc…` executed Success, `is_settlement_allowed()` now returns true — so the gate
holds live state, not default.

### On CSPR.click — checked, deliberately not used

Of the five components in Casper's promoted AI toolkit (x402, MCP servers, CSPR.click
Agent Skill, CSPR.cloud API, Odra), this repo genuinely uses three: **x402** (payment
gateway), **MCP** (`mcp-server/`), and **Odra** (`rwa-settlement-gate/`). **CSPR.cloud**
was tested — the API key is confirmed working against the x402 facilitator — but is not
wired into the deploy path: `odra-casper-livenet-env` 2.9.0 never sends the
`CSPR_CLOUD_AUTH_TOKEN` header, so every CSPR.cloud RPC 401s (see above) and the
`rwa-settlement-gate` deploy runs against the official testnet node instead. CSPR.click
is the last one, and it's a deliberate exclusion: its own SDK reference lists 24 methods (`init`, `connect`, `signIn`,
`getActiveAccount`, `sign`, …), and every one of them requires a connected browser
wallet extension or CSPR.click's own UI — there is no headless/server-side call path.
This project's agent is an unattended, 24/7 server process signing with its own local
key file, not a browser dApp with a human clicking "connect wallet." Faking that
integration, or bolting on a headless-browser wallet-automation layer solely to check
a box, seemed worse than being direct about a real architectural mismatch.

---

## x402 Integration

Agents that want oracle data pay **$0.01 USDC** via x402:

```
GET https://rtt.phoenix-ai.work/api/v1/safe
→ HTTP 402
→ Agent pays $0.01 via x402
→ { "safe": true, "p99_ms": 45, "revert_ratio": 0.04 }
```

Currently settled on Base mainnet (the live rail). A native Casper x402 payer is scaffolded in `casper-agent/casper-x402/` — a clean `npm install && npm run selftest` signs a valid EIP-712 authorization for the `casper:casper-test` scheme (upstream package load-bug patched via patch-package). It is **not production-live yet**: a standalone skeleton, not wired into the agent, not yet run end-to-end against the facilitator's `verify`/`settle`, and it needs a real CEP-18 asset + balance to actually pay. The Base rail is left untouched.

---

## Live Proof

- Dashboard: https://phoenix-zero.vercel.app
- Casper dashboard: https://rtt.phoenix-ai.work/casper
- Public feed: https://rtt.phoenix-ai.work/api/public-feed
- SequencerOracle contract: https://testnet.cspr.live/contract/hash-2a7ebbc91e4177df0ed3143495b412290733a308a017d084fc7e6662e3261f3a
- RwaSettlementGate contract: https://testnet.cspr.live/contract-package/fab9c0a11314515796efddc5f5f98e0681cbdc717a2787a75a313cb5cb42511d
- Demo video: https://youtu.be/o-CQfiSfQ4o (general Phoenix Zero walkthrough)
- Demo video (Casper-specific, 52s, unnarrated screen capture): https://youtu.be/KtTrz23B92w
- DoraHacks: https://dorahacks.io/buidl/43859

---

## MEV War Case Study — May 31, 2026

```
01:04 UTC  Phoenix Zero detects Arbitrum RTT climbing
01:07 UTC  arb_revert_ratio crosses 15% threshold → safe: false published on Casper
01:09 UTC  arb_revert_ratio = 72.1% (9× above normal)
01:15 UTC  Base P99 = 1,144ms (normal: ~80ms)
01:27 UTC  ZKSync fully timed out
```

**Any DeFi agent reading our Casper oracle avoided 72% gas waste during this window.**

---

## Setup

### Deploy Contract to Casper Testnet

```bash
# 1. Install Rust nightly + wasm32 target + rust-src (needed for -Z build-std)
rustup toolchain install nightly --profile minimal
rustup target add wasm32-unknown-unknown --toolchain nightly
rustup component add rust-src --toolchain nightly

# 2. Get testnet CSPR (one-time 5000 CSPR grant per account)
# Faucet: https://testnet.cspr.live/tools/faucet

# 3. Vendor + patch casper-contract 5.1.1 (REQUIRED — one-time, idempotent)
#    Upstream 5.1.1 does NOT compile on any current rustc: it puts #[no_mangle] on
#    #[panic_handler] / #[alloc_error_handler], which rustc rejects as internal language items.
#    This script fetches the crate from crates.io into vendor/ and removes those two attributes
#    (see patches/). Cargo.toml's [patch.crates-io] points at vendor/casper-contract.
#    Added 2026-07-25: that path used to be absolute and pointed at the maintainer's own server,
#    so nobody else could build this contract — the build died on the first crate.
cd oracle-contract
./prepare_patched_crate.sh

# 4. Build — must target pure MVP wasm (this network's execution engine
#    rejects the bulk-memory / sign-ext ops modern LLVM emits by default)
RUSTFLAGS="-C link-arg=--import-undefined -C target-cpu=mvp" \
  cargo +nightly build -Z build-std=core,alloc --release --target wasm32-unknown-unknown
# Expected: target/wasm32-unknown-unknown/release/sequencer_oracle.wasm (~145 KB)
# Note: nightly is mandatory — on stable this fails with error[E0554], and without
# --import-undefined the link step fails on casper_* host symbols.

# 5. Deploy (see ts-agent/deploy_contract.js) and copy the resulting
#    contract hash into ts-agent/.env as CONTRACT_HASH
```

✅ **Build gap CLOSED — verified end-to-end 2026-07-25.** A clean clone now builds.

This section previously carried a known gap: `Cargo.toml` pointed `[patch.crates-io]` at
`/opt/casper-oracle/casper-contract-patched`, an absolute path on the production server that is not
part of this repo, so a fresh clone died on that line. It also proposed that simply *removing* the
`[patch.crates-io]` block "should let a fresh clone build". **That proposal was tested and is wrong** —
upstream `casper-contract 5.1.1` does not compile on any current rustc at all:

```
error[E0554]: `#![feature]` may not be used on the stable release channel
error: `#[no_mangle]` cannot be used on internal language items
```

The crate puts `#[no_mangle]` on `#[panic_handler]` / `#[alloc_error_handler]`, which rustc now
rejects as internal language items (reproduced on rustc 1.97.1, both with and without the patch).

**Fix:** `prepare_patched_crate.sh` (step 3 above) fetches the crate from crates.io into `vendor/`
and applies `patches/casper-contract-5.1.1-no_mangle-and-allocator.patch` — removes the two
`#[no_mangle]` attributes, and (added 2026-07-28) swaps the default global allocator from the
unmaintained `wee_alloc` (GHSA-rc23-xxgq-x27g, no fixed version exists, flagged critical by
Dependabot) to `dlmalloc` — the same allocator Rust's own wasm32 std target uses internally. The
patch is diffed against upstream and tracked in this repo. `[patch.crates-io]` now points at the
relative `vendor/casper-contract`.

**Verification:** clean files → `./prepare_patched_crate.sh` → the build command above → produced
`sequencer_oracle.wasm` at **155,129 bytes**, reproduced identically twice (once incrementally, once
from a fully clean `rm -rf vendor`) on the exact pinned toolchain (`nightly-2026-07-16`, see
`rust-toolchain.toml`). `wee_alloc` no longer appears anywhere in `Cargo.lock`. Anyone can now
rebuild from source and compare; the on-chain contract remains independently verifiable via the
testnet explorer either way.

### Run the Agent

```bash
cd ts-agent
npm install
cp .env.example .env
# Edit .env: CASPER_SECRET_KEY_PATH, CONTRACT_HASH
npm start
```

---

## Contact

Aleksandr · Telegram: [@Kentyrk](https://t.me/Kentyrk) · Email: aleksandrkent64@gmail.com
DoraHacks: [buidl/43859](https://dorahacks.io/buidl/43859)
