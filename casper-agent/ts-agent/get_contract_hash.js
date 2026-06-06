/**
 * Get contract hash after deploy finalization
 * Run: node get_contract_hash.js <deploy_hash>
 */
'use strict';
require('dotenv').config();
const { CasperServiceByJsonRPC, CLPublicKey, Keys } = require('casper-js-sdk');
const fs = require('fs');

const NODE_URL = process.env.CASPER_NODE_URL || 'https://rpc.testnet.casperlabs.io';
const KEY_PATH = process.env.CASPER_SECRET_KEY_PATH || './keys/secret_key.pem';

async function getHash(deployHash) {
  const client = new CasperServiceByJsonRPC(NODE_URL);

  // Get account info
  const keyContent = fs.readFileSync(KEY_PATH, 'utf8');
  const keyPair = Keys.Ed25519.parsePrivateKey(
    Keys.Ed25519.readBase64WithPEM(keyContent)
  );

  const stateRoot = await client.getStateRootHash();
  const accountInfo = await client.getBlockState(
    stateRoot,
    keyPair.publicKey.toAccountHashStr(),
    []
  );

  const namedKeys = accountInfo?.Account?.named_keys || [];
  const oracleKey = namedKeys.find(k => k.name === 'sequencer_oracle');

  if (!oracleKey) {
    console.log('Contract not found yet — wait more and retry');
    console.log('Named keys:', namedKeys.map(k => k.name));
    return;
  }

  const contractHash = oracleKey.key;
  console.log('\n✅ CONTRACT DEPLOYED!');
  console.log(`Hash: ${contractHash}`);
  console.log(`Explorer: https://testnet.cspr.live/contract/${contractHash}`);
  console.log('\nAdd to /opt/casper-agent/.env:');
  console.log(`CONTRACT_HASH=${contractHash}`);
}

const deployHash = process.argv[2];
if (!deployHash) {
  console.error('Usage: node get_contract_hash.js <deploy_hash>');
  process.exit(1);
}
getHash(deployHash).catch(console.error);
