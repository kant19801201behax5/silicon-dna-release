/**
 * Deploy SequencerOracle contract to Casper Testnet
 * Uses casper-js-sdk (already installed)
 * Run: node deploy_contract.js
 */
'use strict';
require('dotenv').config();
const fs = require('fs');
const {
  CasperClient,
  DeployUtil,
  Keys,
  CLPublicKey,
  RuntimeArgs,
} = require('casper-js-sdk');

const NODE_URL   = process.env.CASPER_NODE_URL  || 'https://rpc.testnet.casperlabs.io';
const CHAIN_NAME = process.env.CASPER_CHAIN_NAME || 'casper-test';
const KEY_PATH   = process.env.CASPER_SECRET_KEY_PATH || './keys/secret_key.pem';
const WASM_PATH  = process.env.WASM_PATH || '/opt/casper-oracle/oracle-contract/target/wasm32-unknown-unknown/release/sequencer_oracle.wasm';

async function deploy() {
  console.log('━'.repeat(50));
  console.log('Phoenix Zero — Casper Contract Deployer');
  console.log(`Node:  ${NODE_URL}`);
  console.log(`Chain: ${CHAIN_NAME}`);
  console.log(`WASM:  ${WASM_PATH}`);
  console.log('━'.repeat(50));

  // Load key
  if (!fs.existsSync(KEY_PATH)) {
    console.error(`❌ Key not found: ${KEY_PATH}`);
    process.exit(1);
  }
  const keyContent = fs.readFileSync(KEY_PATH, 'utf8');
  const keyPair = Keys.Ed25519.parsePrivateKey(
    Keys.Ed25519.readBase64WithPEM(keyContent)
  );
  console.log(`Key: ${keyPair.publicKey.toHex().slice(0, 24)}...`);

  // Load WASM
  if (!fs.existsSync(WASM_PATH)) {
    console.error(`❌ WASM not found: ${WASM_PATH}`);
    process.exit(1);
  }
  const wasmBytes = new Uint8Array(fs.readFileSync(WASM_PATH));
  console.log(`WASM: ${wasmBytes.length} bytes`);

  // Build deploy
  const deployParams = new DeployUtil.DeployParams(
    keyPair.publicKey,
    CHAIN_NAME,
    1,       // gas price
    1800000  // TTL 30 min
  );

  // Module bytes session = WASM deployment
  const session = DeployUtil.ExecutableDeployItem.newModuleBytes(
    wasmBytes,
    RuntimeArgs.fromMap({})  // no constructor args — call() takes none
  );

  const payment = DeployUtil.standardPayment(200000000000n); // 200 CSPR for deploy

  const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
  const signedDeploy = DeployUtil.signDeploy(deploy, keyPair);

  console.log('\n▶ Sending deploy to Casper Testnet...');
  const client = new CasperClient(NODE_URL);
  const deployHash = await client.putDeploy(signedDeploy);

  console.log(`\n✅ Deploy sent!`);
  console.log(`   Hash:    ${deployHash}`);
  console.log(`   Track:   https://testnet.cspr.live/deploy/${deployHash}`);
  console.log('\n⏳ Wait 2-3 minutes for finalization, then run:');
  console.log(`   node get_contract_hash.js ${deployHash}`);
}

deploy().catch(err => {
  console.error('❌ Deploy failed:', err.message);
  process.exit(1);
});
