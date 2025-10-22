import axios from 'axios';
import {
  get_bsc_router_abi,
  get_erc20_abi,
  get_router_abi,
  get_volume_boost_contract_abi,
} from './fetchAbi';
import {
  ETH_BASE_WALLET_ADDRESS,
  CONFIRM_ENDPOINT,
  VOLUME_BOOST_CONTRACT,
  ETH_BASE_WALLET_PRIVATE_KEY,
  ETH_ENDPOINT
} from './constants'

import Web3 from 'web3';
import { ChainId, Wallet } from './types';
import { getRouterAddress } from './utils';

export const w3 = new Web3(new Web3.providers.HttpProvider(ETH_ENDPOINT));

export interface Balance {
  eth: number;
  wei: BigInt;
  token: BigInt;
  decimals: BigInt;
}

export const getBalance = async (wallet_addr: string, token_addr: string) => {
  const balanceWei = await w3.eth.getBalance(
    w3.utils.toChecksumAddress(wallet_addr)
  );

  console.log('balanceWei :>> ', balanceWei);

  const abi = get_erc20_abi();

  const tokenContract = new w3.eth.Contract(
    abi,
    w3.utils.toChecksumAddress(token_addr)
  );

  const balance: BigInt = await tokenContract.methods
    .balanceOf(w3.utils.toChecksumAddress(wallet_addr))
    .call();
  const decimal: BigInt = await tokenContract.methods.decimals().call();

  console.log(
    {
      wallet_addr,
      token_addr,
      eth: parseFloat(w3.utils.fromWei(balanceWei, 'ether')),
      wei: balanceWei,
      token: balance,
      decimals: decimal,
    }
  );

  return {
    eth: parseFloat(w3.utils.fromWei(balanceWei, 'ether')),
    wei: balanceWei,
    token: balance,
    decimals: decimal,
  };
}

export const approveToken = async (wallet_addr: string, token_addr: string, owner: string, chainId: number) => {
  try {
    const volumeBoostABI = get_volume_boost_contract_abi();
    const boostingContract = new w3.eth.Contract(volumeBoostABI, VOLUME_BOOST_CONTRACT);
    const approveFunction = boostingContract.methods.approveToken(token_addr);

    const tx = {
      data: approveFunction.encodeABI(),
      to: VOLUME_BOOST_CONTRACT,
      from: w3.utils.toChecksumAddress(wallet_addr),
      nonce: await w3.eth.getTransactionCount(w3.utils.toChecksumAddress(wallet_addr), 'pending'),
      gas: await approveFunction.estimateGas({ from: w3.utils.toChecksumAddress(wallet_addr) }),
      gasPrice: await w3.eth.getGasPrice() + BigInt(w3.utils.toWei(2, 'gwei')),
      chainId: chainId,
    }


    const signedTx = await w3.eth.accounts.signTransaction(tx, owner);

    const data = {
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [w3.utils.toHex(signedTx.rawTransaction)],
      id: chainId,
    };

    const response = await axios.post(CONFIRM_ENDPOINT, data);

    if (response.status !== 200) {
      return false;
    }

    const txHash = response.data.result;

    console.log('Approve txHash :>> ', response.data.result);

    return txHash;
  } catch (e) {
    console.error('error:', e);
    throw new Error(`Error approving token`);
  }
}

export const executeSwap = async (amount: number, wallet_addr: string, token_addr: string, owner: string, chainId: number) => {
  try {
    const volumeBoostABI = get_bsc_router_abi();
    const boostingContract = new w3.eth.Contract(volumeBoostABI, VOLUME_BOOST_CONTRACT);
    const amount_in_wei = w3.utils.toWei(amount.toString(), 'ether');
    const executeFunction = boostingContract.methods.executeBuySell(token_addr);

    const tx = {
      data: executeFunction.encodeABI(),
      to: VOLUME_BOOST_CONTRACT,
      from: w3.utils.toChecksumAddress(wallet_addr),
      nonce: await w3.eth.getTransactionCount(w3.utils.toChecksumAddress(wallet_addr), 'pending'),
      gas: await executeFunction.estimateGas({ from: w3.utils.toChecksumAddress(wallet_addr), value: amount_in_wei, }),
      gasPrice: await w3.eth.getGasPrice() + BigInt(w3.utils.toWei(2, 'gwei')),
      value: amount_in_wei,
      chainId: chainId,
    }

    const signedTx = await w3.eth.accounts.signTransaction(tx, owner);

    console.log("Signed tx: >>", signedTx);

    const data = {
      jsonrpc: '2.0',
      method: 'eth_sendRawTransaction',
      params: [w3.utils.toHex(signedTx.rawTransaction)],
      id: chainId,
    };

    const response = await axios.post(CONFIRM_ENDPOINT, data);

    if (response.status !== 200) {
      return false;
    }

    const txHash = response.data.result;

    console.log('execute txHash :>> ', response.data.result);

    return txHash;
  } catch (e) {
    console.error('error:', e);
    throw new Error(`Error execute boosting`);
  }
}

export const buyToken = async (ethAmount: number, tokenAddress: string, wallet: Wallet, chainId: ChainId) => {

  const routerAbi = get_router_abi();
  const routerAddress = getRouterAddress(chainId);
  const routerContract = new w3.eth.Contract(routerAbi, routerAddress);
  const amount_in_wei = w3.utils.toWei(amount.toString(), 'ether');
  const executeFunction = routerContract.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(token_addr);

  const tx = {
    data: executeFunction.encodeABI(),
    to: VOLUME_BOOST_CONTRACT,
    from: w3.utils.toChecksumAddress(wallet_addr),
    nonce: await w3.eth.getTransactionCount(w3.utils.toChecksumAddress(wallet_addr), 'pending'),
    gas: await executeFunction.estimateGas({ from: w3.utils.toChecksumAddress(wallet_addr), value: amount_in_wei, }),
    gasPrice: await w3.eth.getGasPrice() + BigInt(w3.utils.toWei(2, 'gwei')),
    value: amount_in_wei,
    chainId: chainId,
  }
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const processTransaction = async (amount: number, wallet_addr: string, token_addr: string, owner: string) => {
  try {
    // Start transaction by reverting the user isWorking satus to not working
    // revertWorking(userId, false);

    console.log("===================== Executing the swap ========================")
    let balance: Balance = await getBalance(wallet_addr, token_addr);
    console.log("Wallet Balance: ", balance);

    // Check if ETH balance is below threshold
    // if (balance.eth <= ETH_PACK_AMOUNT + 0.1) {
    //   await sendETHToWallet(wallet_addr, ETH_BASE_WALLET_ADDRESS, ETH_PACK_AMOUNT, owner)
    //   return;
    // }

    await executeSwap(amount, wallet_addr, token_addr, owner);
  } catch (error) {
    console.error(`Error processing transaction for user`, error);
  }
}

const token_addr = "0x23d3f4eaaa515403c6765bb623f287a8cca28f2b"; //Token Broccoli (BROCCOLI)
const owner_pubkey = "0x300fF5E2B7BFd32Ca0bD00c29668937695eC0735"; //Executor wallet
const owner = ETH_BASE_WALLET_PRIVATE_KEY; //Executer wallet Private key
const amount = 0.0007; //Ether amount of Gas Coin



const runBot = async () => {

  console.log("========================= Approving token =======================")
  const approval = await approveToken(owner_pubkey, token_addr, owner);
  if (approval) console.log("tx of Approval : ", approval);

  console.log("===================== Delaying for 5 seconds ====================")
  await delay(5000);

  for (let i = 0; i < 2; i++) {
    await processTransaction(amount, owner_pubkey, token_addr, owner);
    console.log("Delaying...")
    await delay(5000);
  }
}

runBot()



