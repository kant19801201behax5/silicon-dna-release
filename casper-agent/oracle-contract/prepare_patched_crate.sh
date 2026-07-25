#!/usr/bin/env bash
# Fetches casper-contract 5.1.1 from crates.io into ./vendor and applies the local patch.
#
# Why this exists: casper-contract 5.1.1 does not compile on any current rustc — it puts
# `#[no_mangle]` on `#[panic_handler]` / `#[alloc_error_handler]`, which rustc now rejects as
# "internal language items". Cargo.toml therefore points `[patch.crates-io]` at the vendored,
# patched copy this script produces. Until 2026-07-25 that path was absolute and pointed at one
# specific machine (`/opt/casper-oracle/casper-contract-patched`), so nobody else could build the
# contract at all — the build died on the very first crate.
#
# Run once before the build command in README.md ("Deploy Contract to Casper Testnet").
# Idempotent: re-running is a no-op once the marker file exists.
set -euo pipefail

CRATE=casper-contract
VER=5.1.1
DIR="$(cd "$(dirname "$0")" && pwd)"
VENDOR="$DIR/vendor/$CRATE"
PATCH="$DIR/patches/$CRATE-$VER-no_mangle.patch"

if [ -f "$VENDOR/.patched" ]; then
  echo "OK: $VENDOR already prepared (delete it to redo)"
  exit 0
fi
if [ -e "$VENDOR" ]; then
  echo "ERROR: $VENDOR exists but is not marked patched. Remove it and re-run." >&2
  exit 1
fi
[ -f "$PATCH" ] || { echo "ERROR: patch not found: $PATCH" >&2; exit 1; }

for t in curl tar patch; do
  command -v "$t" >/dev/null || { echo "ERROR: '$t' is required" >&2; exit 1; }
done

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "-> downloading $CRATE $VER from crates.io"
# crates.io rejects requests without a User-Agent (HTTP 403) — send an identifiable one.
curl -sSfL -A "phoenix-zero-oracle-build (+https://github.com/kant19801201behax5/silicon-dna-release)" \
  "https://static.crates.io/crates/$CRATE/$CRATE-$VER.crate" -o "$tmp/crate.tar.gz" \
  || curl -sSfL -A "phoenix-zero-oracle-build" \
       "https://crates.io/api/v1/crates/$CRATE/$VER/download" -o "$tmp/crate.tar.gz"
tar -xzf "$tmp/crate.tar.gz" -C "$tmp"
[ -d "$tmp/$CRATE-$VER" ] || { echo "ERROR: unexpected archive layout" >&2; exit 1; }

mkdir -p "$DIR/vendor"
mv "$tmp/$CRATE-$VER" "$VENDOR"

echo "-> applying $(basename "$PATCH")"
patch -p1 -d "$VENDOR" < "$PATCH"
touch "$VENDOR/.patched"

echo "OK: patched crate ready at vendor/$CRATE"
echo "   next: RUSTFLAGS=\"-C link-arg=--import-undefined -C target-cpu=mvp\" \\"
echo "         cargo +nightly build -Z build-std=core,alloc --release --target wasm32-unknown-unknown"
