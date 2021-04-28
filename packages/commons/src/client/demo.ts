import CKB from '@nervosnetwork/ckb-sdk-core/';
import { ethers } from 'ethers';
import { ForceBridgeAPIV1Handler } from './client';

const FORCE_BRIDGE_URL = 'http://47.56.233.149:3080/force-bridge/api/v1';
const client = new ForceBridgeAPIV1Handler(FORCE_BRIDGE_URL);

const ETH_NODE_URL = 'https://rinkeby.infura.io/v3/48be8feb3f9c46c397ceae02a0dbc7ae';
const ETH_WALLET_PRIV = '0x49740e7b29259e7c2b693f365a9fd581cef75d1e346c8dff89ec037cdfd9f89d';
const ETH_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';
const ETH_SENDER = '0xf7185B3B967fAEB46Ac9F15BDa82EC61E49F7795';

const CKB_NODE_URL = 'https://testnet.ckbapp.dev';
const CKB_PRI_KEY = '0xa800c82df5461756ae99b5c6677d019c98cc98c7786b80d7b2e77256e46ea1fe';
const CKB_ADDRESS = 'ckt1qyqyph8v9mclls35p6snlaxajeca97tc062sa5gahk';

async function lock() {
  const lockPayload = {
    sender: ETH_SENDER,
    recipient: CKB_ADDRESS,
    asset: {
      network: 'Ethereum',
      ident: ETH_TOKEN_ADDRESS,
      amount: '1',
    },
  };
  const mintTx = await client.generateBridgeInNervosTransaction(lockPayload);

  // metamask will provide nonce, gasLimit and gasPrice.
  const provider = new ethers.providers.JsonRpcProvider(ETH_NODE_URL);
  const wallet = new ethers.Wallet(ETH_WALLET_PRIV, provider);

  const unsignedTx = <ethers.PopulatedTransaction>mintTx.rawTransaction;
  unsignedTx.nonce = await wallet.getTransactionCount();
  unsignedTx.gasLimit = ethers.BigNumber.from(1000000);
  unsignedTx.gasPrice = await provider.getGasPrice();

  // use metamask to sign and send tx.
  const signedTx = await wallet.signTransaction(unsignedTx);
  const lockTxHash = (await provider.sendTransaction(signedTx)).hash;
  console.log('lock tx hash', lockTxHash);
  return lockTxHash;
}

async function burn() {
  const burnPayload = {
    network: 'Ethereum',
    sender: CKB_ADDRESS,
    recipient: '0x1000000000000000000000000000000000000001',
    asset: ETH_TOKEN_ADDRESS,
    amount: '1',
  };

  const burnTx = await client.generateBridgeOutNervosTransaction(burnPayload);

  const ckb = new CKB(CKB_NODE_URL);
  const signedTx = ckb.signTransaction(CKB_PRI_KEY)(<CKBComponents.RawTransactionToSign>burnTx.rawTransaction);
  const burnTxHash = await ckb.rpc.sendTransaction(signedTx);
  console.log('burn tx hash', burnTxHash);
  return burnTxHash;
}

async function getTransaction() {
  const getTxPayload = {
    network: 'Ethereum',
    userIdent: CKB_ADDRESS,
    assetIdent: ETH_TOKEN_ADDRESS,
  };

  const txs = await client.getBridgeTransactionSummaries(getTxPayload);
  console.log('txs', JSON.stringify(txs));
  return txs;
}

async function checkTransaction(txId: string) {
  let find = false;
  for (let i = 0; i < 100; i++) {
    await asyncSleep(3000);
    const txs = await getTransaction();
    for (const tx of txs) {
      if (tx.status == 'Successful' && tx.txSummary.fromTransaction.txId == txId) {
        console.log(tx);
        find = true;
        break;
      }
    }
    if (find) {
      break;
    }
  }
  if (!find) {
    throw new Error(`rpc test failed, can not find record ${txId}`);
  }
}

function asyncSleep(ms = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const lockTxId = await lock();
  await checkTransaction(lockTxId);

  asyncSleep(10000);

  const burnTxId = await burn();
  await checkTransaction(burnTxId);
}

main();
