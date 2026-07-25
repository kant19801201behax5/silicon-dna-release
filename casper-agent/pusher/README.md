# Casper Oracle Pusher (Python) — reference implementation

> **This is not the deployed agent.** The agent running in production is the
> Node.js one in [`../ts-agent/`](../ts-agent/) — start there for a fully
> runnable, zero-toolchain path (`npm install && npm test && npm start`).
> This Python version exists to show the same oracle-push logic in a second
> language; it is kept in sync in intent, not used on the server.

## Files

- `casper_oracle_pusher.py` — pushes sequencer-safety state to the Casper
  contract (equivalent logic to `ts-agent/agent.js`).
- `casper_defi_agent.py` — example DeFi agent that reads the oracle before acting.
- `.env.example` — configuration template.

Both scripts compile cleanly (`python -m py_compile`).

## Install — fixed 2026-07-25, the demo now needs no toolchain

`pip install -r requirements.txt` **used to require a Rust toolchain**, because
`pycspr==1.2.0` sat in that file as a hard requirement. It pins
`blake3<0.5.0,>=0.4.1`, and the only `blake3` in that range (`0.4.1`) is a source
sdist with **no wheel for Python 3.12+**, so pip tried to compile it from Rust
and stopped at `metadata-generation-failed`. Upstream `pycspr` constraint, not a
bug in this code — but it blocked the script most people want to run.

`pycspr` is now **optional**, and the split follows what the scripts actually import:

| Script | Needs | Status |
| --- | --- | --- |
| `casper_defi_agent.py` — autonomous-agent demo | `requests`, `python-dotenv` only | ✅ **Runs with a plain `pip install -r requirements.txt`.** Verified 2026-07-25 against the live oracle: read `arb_revert=0.0% base_p99=9ms`, executed all 3 queued transactions, printed its session summary |
| `casper_oracle_pusher.py` — on-chain pusher | `pycspr` (optional) | Import is already guarded (`try: import pycspr / except ImportError: PYCSPR_OK = False`), so the module loads and reports the missing dependency instead of crashing |

```bash
pip install -r requirements.txt   # requests + python-dotenv, no toolchain
python casper_defi_agent.py       # agent demo against the live oracle
```

Only if you want the Python pusher to sign and send real deploys: install a Rust
toolchain (`rustup`), then `pip install pycspr==1.2.0`.

The production agent remains the Node.js one in [`../ts-agent/`](../ts-agent/) —
see [`../TESTING_GUIDE.md`](../TESTING_GUIDE.md) §6–7.

## Run (after a successful install)

```bash
cp .env.example .env      # fill in CASPER_CONTRACT_HASH, key path, etc.
python casper_oracle_pusher.py
```
