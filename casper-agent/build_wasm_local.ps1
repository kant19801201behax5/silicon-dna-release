# ⚠️ SUPERSEDED — do not use. Kept only for history, per this repo's
# never-delete policy. This script builds via `cargo odra build`, but the
# actually-deployed contract is raw casper-contract 5.1.1 with NO Odra
# (see README.md's "Deploy Contract to Casper Testnet" section for the
# real, current build command — cargo +nightly build -Z build-std, no
# Odra). This script also targets the Python pusher/casper-oracle-pusher
# path, which was never deployed — see README.md's "Components" section:
# the real, deployed agent is ts-agent/agent.js (Node.js). Left as-is
# rather than deleted or silently rewritten.
#
# Phoenix Zero — Build Casper WASM contract locally (Windows PowerShell)
# Run this BEFORE deploying to server
# Requires: Rust installed (https://rustup.rs)

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Building Casper Oracle Contract (WASM)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$ContractDir = "$PSScriptRoot\oracle-contract"
$DoServer    = "user@YOUR_SERVER"          # replace with your server
$SshKey      = "C:\path\to\your\key.pem"  # replace with your SSH key path

# Step 1: Check Rust
Write-Host "`n▶ Step 1: Checking Rust..." -ForegroundColor Yellow
if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "  ❌ Rust not found. Install from https://rustup.rs" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Rust: $(cargo --version)"

# Step 2: Add WASM target
Write-Host "`n▶ Step 2: Adding wasm32 target..." -ForegroundColor Yellow
rustup target add wasm32-unknown-unknown
Write-Host "  ✅ wasm32-unknown-unknown ready"

# Step 3: Install cargo-odra
Write-Host "`n▶ Step 3: Installing cargo-odra..." -ForegroundColor Yellow
cargo install cargo-odra --locked --quiet
Write-Host "  ✅ cargo-odra installed"

# Step 4: Build WASM
Write-Host "`n▶ Step 4: Building WASM contract..." -ForegroundColor Yellow
Set-Location $ContractDir
cargo odra build
$WasmFile = Get-ChildItem -Path . -Recurse -Filter "sequencer_oracle.wasm" | Select-Object -First 1
if (-not $WasmFile) {
    Write-Host "  ❌ WASM not found after build" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ WASM: $($WasmFile.FullName) ($([math]::Round($WasmFile.Length/1KB))KB)"

# Step 5: Upload to DO server
Write-Host "`n▶ Step 5: Uploading WASM to DO server..." -ForegroundColor Yellow
& scp -i $SshKey $WasmFile.FullName "${DoServer}:/opt/casper-oracle/sequencer_oracle.wasm"
Write-Host "  ✅ Uploaded to /opt/casper-oracle/sequencer_oracle.wasm"

# Step 6: Upload casper-agent files
Write-Host "`n▶ Step 6: Uploading agent files..." -ForegroundColor Yellow
& scp -i $SshKey -r "$PSScriptRoot\pusher"    "${DoServer}:/opt/silicon-dna/casper-agent/"
& scp -i $SshKey    "$PSScriptRoot\deploy_to_testnet.sh" "${DoServer}:/opt/casper-oracle/"
& scp -i $SshKey    "$PSScriptRoot\casper-oracle-pusher.service" "${DoServer}:/opt/casper-oracle/"
Write-Host "  ✅ Files uploaded"

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ WASM built and uploaded. Now run on DO server:" -ForegroundColor Green
Write-Host ""
Write-Host "  ssh -i `"$SshKey`" $DoServer" -ForegroundColor White
Write-Host "  bash /opt/casper-oracle/deploy_to_testnet.sh" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
