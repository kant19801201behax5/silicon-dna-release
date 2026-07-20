'use strict';
require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');
const { DeployUtil, Keys, RuntimeArgs } = require('casper-js-sdk');

const NODE_URL   = 'https://node.testnet.casper.network/rpc';
const CHAIN_NAME = process.env.CASPER_CHAIN_NAME || 'casper-test';
const KEY_PATH   = process.env.CASPER_SECRET_KEY_PATH || './keys/secret_key.pem';
const WASM_PATH  = '/opt/casper-oracle/oracle-contract/target/wasm32-unknown-unknown/release/sequencer_oracle.wasm';

async function deploy() {
  console.log('Deploying SequencerOracle to Casper Testnet...');
  
  const keyPair   = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
  const wasmBytes = new Uint8Array(fs.readFileSync(WASM_PATH));
  console.log('WASM:', wasmBytes.length, 'bytes');
  console.log('From:', keyPair.publicKey.toFormattedString().slice(0,24) + '...');

  const params  = new DeployUtil.DeployParams(keyPair.publicKey, CHAIN_NAME, 1, 1800000);
  const session = DeployUtil.ExecutableDeployItem.newModuleBytes(wasmBytes, RuntimeArgs.fromMap({}));
  const payment = DeployUtil.standardPayment(200000000000); // 200 CSPR
  const deploy  = DeployUtil.makeDeploy(params, session, payment);
  const signed  = DeployUtil.signDeploy(deploy, keyPair);

  const deployJson = DeployUtil.deployToJson(signed);
  const body = JSON.stringify({
    jsonrpc: '2.0', id: 1,
    method: 'account_put_deploy',
    params: { deploy: deployJson.deploy }
  });

  const resp = await fetch(NODE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body, timeout: 30000
  });

  const data = await resp.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  
  const hash = data.result.deploy_hash;
  console.log('\n✅ CONTRACT DEPLOY SENT!');
  console.log('Hash:', hash);
  console.log('Track: https://testnet.cspr.live/deploy/' + hash);
  console.log('\nWait 3-5 min then check your account named keys at:');
  console.log('https://testnet.cspr.live/account/0202494268f650725fb759e6b89bde9a44300a89a02b7d72477eff8894c857c5defb');
}

deploy().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
