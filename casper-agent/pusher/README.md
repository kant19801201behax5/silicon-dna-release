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

## Install constraint (important)

`pip install -r requirements.txt` **requires a Rust toolchain** on modern Python.

Why: `pycspr==1.2.0` (its latest release) pins `blake3<0.5.0,>=0.4.1`. The only
`blake3` in that range is `0.4.1`, published as a source sdist with **no wheel
for Python 3.12+**, so pip tries to compile it from Rust. Without a Rust
toolchain the install stops at `metadata-generation-failed` on `blake3`.

This is an upstream `pycspr` constraint — the pusher code itself is fine.

### Options to install

- **Recommended:** don't. Use [`../ts-agent/`](../ts-agent/) — it needs only
  Node.js and reproduces the full agent behaviour (see
  [`../TESTING_GUIDE.md`](../TESTING_GUIDE.md) §6–7).
- If you specifically need the Python path, install a Rust toolchain
  (`rustup`) first so pip can build `blake3 0.4.1` from source, then
  `pip install -r requirements.txt`.

## Run (after a successful install)

```bash
cp .env.example .env      # fill in CASPER_CONTRACT_HASH, key path, etc.
python casper_oracle_pusher.py
```
