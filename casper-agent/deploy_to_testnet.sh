#!/bin/bash
# Phoenix Zero — Casper Testnet Deploy Script
# ============================================
# Strategy: WASM built locally (memory-intensive Rust compilation)
#           Deploy + pusher run on DO server (lightweight operations only)
#
# Run on DO server AFTER uploading pre-built WASM:
#   bash deploy_to_testnet.sh
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phoenix Zero × Silicon DNA  |  Casper Testnet Deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DEPLOY_DIR="/opt/casper-oracle"
WASM_PATH="$DEPLOY_DIR/sequencer_oracle.wasm"
CASPER_NODE="rpc.testnet.casperlabs.io"
CHAIN_NAME="casper-test"

mkdir -p "$DEPLOY_DIR/keys"

# ── Step 1: Install casper-client ─────────────────────────────────────────────
echo ""
echo "▶ Step 1: Installing casper-client..."
if ! command -v casper-client &> /dev/null; then
    curl -JLO https://github.com/casper-ecosystem/casper-client-rs/releases/latest/download/casper-client-ubuntu20.04-$(uname -m).tar.gz
    tar -xzf casper-client-*.tar.gz
    mv casper-client /usr/local/bin/
    rm -f casper-client-*.tar.gz
fi
casper-client --version
echo "  ✅ casper-client ready"

# ── Step 2: Check WASM exists (must be uploaded first) ────────────────────────
echo ""
echo "▶ Step 2: Checking WASM binary..."
if [ ! -f "$WASM_PATH" ]; then
    echo "  ❌ WASM not found at $WASM_PATH"
    echo ""
    echo "  Build locally first (Windows/WSL):"
    echo "    rustup target add wasm32-unknown-unknown"
    echo "    cargo install cargo-odra --locked"
    echo "    cd casper-agent/oracle-contract"
    echo "    cargo odra build"
    echo "    # WASM at: target/wasm32-unknown-unknown/release/sequencer_oracle.wasm"
    echo ""
    echo "  Then upload:"
    echo "    scp target/wasm32-unknown-unknown/release/sequencer_oracle.wasm user@YOUR_SERVER:/opt/casper-oracle/"
    exit 1
fi
echo "  ✅ WASM found: $WASM_PATH ($(du -h $WASM_PATH | cut -f1))"

# ── Step 3: Generate Casper key pair ─────────────────────────────────────────
echo ""
echo "▶ Step 3: Key pair..."
if [ ! -f "$DEPLOY_DIR/keys/secret_key.pem" ]; then
    casper-client keygen "$DEPLOY_DIR/keys"
    echo "  ✅ Keys generated"
    echo ""
    PUBKEY=$(cat "$DEPLOY_DIR/keys/public_key_hex")
    echo "  ⚠️  Fund this address with testnet CSPR:"
    echo "     Address: $PUBKEY"
    echo "     Faucet:  https://testnet.cspr.live/tools/faucet"
    echo ""
    echo "  Paste address, request tokens, then press ENTER..."
    read -r
else
    echo "  ✅ Keys already exist"
    cat "$DEPLOY_DIR/keys/public_key_hex"
fi

# ── Step 4: Deploy WASM to Casper Testnet ────────────────────────────────────
echo ""
echo "▶ Step 4: Deploying contract to Casper Testnet..."
echo "  Node: $CASPER_NODE"

RESULT=$(casper-client put-deploy \
    --node-address "https://$CASPER_NODE" \
    --chain-name "$CHAIN_NAME" \
    --secret-key "$DEPLOY_DIR/keys/secret_key.pem" \
    --session-path "$WASM_PATH" \
    --payment-amount 100000000000)

DEPLOY_HASH=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['deploy_hash'])")

echo "  ✅ Deploy hash: $DEPLOY_HASH"
echo "  🔍 Track: https://testnet.cspr.live/deploy/$DEPLOY_HASH"
echo ""
echo "  ⏳ Waiting 60s for finalization..."
sleep 60

# ── Step 5: Get contract hash ─────────────────────────────────────────────────
echo ""
echo "▶ Step 5: Getting contract hash..."

STATE_ROOT=$(casper-client get-state-root-hash \
    --node-address "https://$CASPER_NODE" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['state_root_hash'])")

PUBKEY=$(cat "$DEPLOY_DIR/keys/public_key_hex")

CONTRACT_HASH=$(casper-client query-global-state \
    --node-address "https://$CASPER_NODE" \
    --state-root-hash "$STATE_ROOT" \
    --key "$PUBKEY" \
    | python3 -c "
import sys, json
data = json.load(sys.stdin)
named_keys = data['result']['stored_value']['Account']['named_keys']
for nk in named_keys:
    if 'sequencer' in nk['name'].lower() or 'oracle' in nk['name'].lower():
        print(nk['key'])
        break
")

if [ -z "$CONTRACT_HASH" ]; then
    echo "  ❌ Contract hash not found — deploy may not have finalized"
    echo "  Check: https://testnet.cspr.live/deploy/$DEPLOY_HASH"
    exit 1
fi

echo "  ✅ Contract hash: $CONTRACT_HASH"
echo "  🔍 Explore: https://testnet.cspr.live/contract/$CONTRACT_HASH"

# ── Step 6: Configure pusher ─────────────────────────────────────────────────
echo ""
echo "▶ Step 6: Writing pusher config..."
cat > "$DEPLOY_DIR/pusher.env" << EOF
CONTRACT_HASH=$CONTRACT_HASH
CASPER_NODE=$CASPER_NODE
CASPER_PORT=443
CASPER_KEY_PATH=$DEPLOY_DIR/keys/secret_key.pem
CHAIN_NAME=$CHAIN_NAME
PUSH_INTERVAL=60
DRY_RUN=false
EOF
echo "  ✅ Config: $DEPLOY_DIR/pusher.env"

# ── Step 7: Install Python deps ───────────────────────────────────────────────
echo ""
echo "▶ Step 7: Python dependencies..."
pip3 install pycspr==1.2.0 requests==2.31.0 python-dotenv==1.0.0 -q
echo "  ✅ Done"

# ── Step 8: Install systemd service ──────────────────────────────────────────
echo ""
echo "▶ Step 8: Installing systemd service..."
cp /opt/silicon-dna/casper-agent/casper-oracle-pusher.service /etc/systemd/system/
sed -i "s|EnvironmentFile=.*|EnvironmentFile=$DEPLOY_DIR/pusher.env|" \
    /etc/systemd/system/casper-oracle-pusher.service

systemctl daemon-reload
systemctl enable casper-oracle-pusher
systemctl start  casper-oracle-pusher

sleep 3
systemctl status casper-oracle-pusher --no-pager
echo "  ✅ Service running"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE"
echo ""
echo "Contract: $CONTRACT_HASH"
echo "Explorer: https://testnet.cspr.live/contract/$CONTRACT_HASH"
echo ""
echo "Monitor:  journalctl -fu casper-oracle-pusher"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
