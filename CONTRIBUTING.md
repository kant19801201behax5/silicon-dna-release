# Contributing

Thanks for your interest in Phoenix Zero / Silicon DNA.

1. Fork the repository and create a branch from `master`.
2. Keep changes scoped — one fix or feature per pull request.
3. For the Casper agent, run `cd casper-agent/ts-agent && npm install && npm test` (21 tests).
4. The Rust oracle contract (`casper-agent/oracle-contract/`) has no unit test
   suite yet — verify changes with `cargo build --release --target wasm32-unknown-unknown`
   and by testing against Casper Testnet (see `casper-agent/TESTING_GUIDE.md`).
5. There is no test suite for the Mantle pusher (`mantle-agent/`) yet either —
   verify manually against Mantle Sepolia.
6. Open a pull request describing what changed and why.

## Reporting bugs

Open a GitHub issue using the bug report template. For security vulnerabilities, see [SECURITY.md](SECURITY.md) instead of opening a public issue.
