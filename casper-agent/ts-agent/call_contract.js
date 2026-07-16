'use strict';
require('dotenv').config();
const fetch = require('node-fetch');
const { DeployUtil, Keys, RuntimeArgs, CLValueBuilder } = require('casper-js-sdk');

const NODE_URL   = process.env.CASPER_NODE_URL  || 'https://node.testnet.casper.network/rpc';
const CHAIN_NAME = process.env.CASPER_CHAIN_NAME || 'casper-test';
const KEY_PATH   = process.env.CASPER_SECRET_KEY_PATH || './keys/secret_key.pem';
const CONTRACT   = process.env.CONTRACT_HASH || '';

async function callContractUpdate(oracleState) {
  if (!CONTRACT) throw new Error('CONTRACT_HASH not set in .env');

  const keyPair = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);

  const args = RuntimeArgs.fromMap({
    safe:            CLValueBuilder.bool(oracleState.safe),
    arb_p99_ms:      CLValueBuilder.u64(oracleState.arb_p99_ms),
    base_p99_ms:     CLValueBuilder.u64(oracleState.base_p99_ms),
    arb_revert_bps:  CLValueBuilder.u64(oracleState.arb_revert_bps),
    base_revert_bps: CLValueBuilder.u64(oracleState.base_revert_bps),
    timestamp:       CLValueBuilder.u64(oracleState.timestamp),
  });

  const params = new DeployUtil.DeployParams(keyPair.publicKey, CHAIN_NAME, 1, 1800000);

  // Use contract hash directly (not named key — agent doesn't own the contract)
  const contractHashHex = CONTRACT.replace('hash-', '');
  const contractHashBytes = Uint8Array.from(Buffer.from(contractHashHex, 'hex'));
  const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
    contractHashBytes, 'update', args
  );

  const payment = DeployUtil.standardPayment(2500000000); // 2.5 CSPR
  const deploy  = DeployUtil.makeDeploy(params, session, payment);
  const signed  = DeployUtil.signDeploy(deploy, keyPair);

  const deployJson = DeployUtil.deployToJson(signed);
  const resp = await fetch(NODE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1,
      method: 'account_put_deploy',
      params: { deploy: deployJson.deploy }
    }),
    timeout: 15000
  });

  const data = await resp.json();
  if (data.error) throw new Error((data.error.data || data.error.message || JSON.stringify(data.error)));
  if (!data.result) throw new Error('No result from node: ' + JSON.stringify(data));

  // Casper 2.0: transaction_hash.Deploy | Casper 1.x: deploy_hash
  const hash = data.result.deploy_hash
    || data.result.transaction_hash?.Deploy
    || data.result.transaction_hash;
  return hash || JSON.stringify(data.result);
}

module.exports = { callContractUpdate };
