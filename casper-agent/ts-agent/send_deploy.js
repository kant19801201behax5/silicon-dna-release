'use strict';
const fetch = require('node-fetch');
const { DeployUtil } = require('casper-js-sdk');

const NODE_URL = process.env.CASPER_NODE_URL || 'https://node.testnet.casper.network/rpc';

async function sendDeploy(signedDeploy) {
  const deployJson = DeployUtil.deployToJson(signedDeploy);
  const body = JSON.stringify({
    jsonrpc: '2.0', id: 1,
    method: 'account_put_deploy',
    params: { deploy: deployJson.deploy }
  });

  const resp = await fetch(NODE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    timeout: 15000
  });

  const data = await resp.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  if (!data.result) throw new Error('No result from node: ' + JSON.stringify(data));

  // Casper 2.0 returns transaction_hash.Deploy, v1 returns deploy_hash
  const hash = data.result.deploy_hash
    || data.result.transaction_hash?.Deploy
    || data.result.transaction_hash;
  return hash || JSON.stringify(data.result);
}

module.exports = { sendDeploy };
