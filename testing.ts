import axios from 'axios';
import { ContractAbi, TransactionHash, Uint256, Web3 } from 'web3';
import {
  get_router_v3_abi,
  get_router_abi,
  get_erc20_abi,
  get_VOLUME_BOOST_CONTRACTing_abi,
} from '../../utils/fetchAbi'; // import utilities
import {
  WETH_ADDRESS,
  UNISWAP_ROUTER_V3,
  UNISWAP_ROUTER_V2,
  SLIPPAGE,
  ETH_BASE_WALLET_ADDRESS,
  chainId,
  CONFIRM_ENDPOINT,
  VOLUME_BOOST_CONTRACT,
} from '../../utils/constant'; // import constants
import { createNewEthereumWallet, getEstimateConfirmTime, sendETHToWallet } from './utils';
import { Balance } from '../../utils/types';
import { calcExecution, calcTotalTxns, calcTxns, revertBoosting, revertWorking, updateBoosting } from '../../utils/utils';
import { w3 } from '../../main';

// export const swapETHToToken = async (userId: string, amount: number, dexId: string, wallet_addr: string, token_addr: string, owner: string) => {
//   console.log('ETH ------------------------------------------------> TOKEN');

//   try {
//     let routerContract;
//     let abi;

//     if (dexId === 'v3') {
//       abi = get_router_v3_abi();
//       routerContract = new w3.eth.Contract(abi, UNISWAP_ROUTER_V3);
//     } else if (dexId === 'v2') {
//       abi = get_router_abi();
//       routerContract = new w3.eth.Contract(abi, UNISWAP_ROUTER_V2);
//     } else {
//       // await revertBoosting(userId, false);
//       return false;
//     }

//     const tokenAbi = get_erc20_abi();
//     const deadline = Math.floor(Date.now() / 1000) + 1200;
//     const amount_in_wei = w3.utils.toWei(amount.toString(), 'ether');

//     console.log('amount_in_wei :>> ', amount_in_wei);
//     console.log('w3.utils.toChecksumAddress(WETH_ADDRESS) :>> ', w3.utils.toChecksumAddress(WETH_ADDRESS));
//     console.log('w3.utils.toChecksumAddress(token_addr) :>> ', w3.utils.toChecksumAddress(token_addr));

//     const expectedAmountOut: Uint256[] = await routerContract.methods
//       .getAmountsOut(amount_in_wei, [
//         w3.utils.toChecksumAddress(WETH_ADDRESS),
//         w3.utils.toChecksumAddress(token_addr),
//       ])
//       .call();

//     const tokenContract = new w3.eth.Contract(
//       tokenAbi,
//       w3.utils.toChecksumAddress(token_addr)
//     );

//     const decimal = await tokenContract.methods.decimals().call();
//     const expectedAmountOutString = expectedAmountOut[expectedAmountOut.length - 1].toString();
//     const slippageAdjustedAmountOut = (BigInt(expectedAmountOutString) * BigInt((1 - SLIPPAGE) * 1000000000)) / BigInt(1000000000);
//     const amount_out_min = Math.floor(parseFloat(w3.utils.toWei(slippageAdjustedAmountOut.toString(), 'wei')) / 10 ** Number(decimal)) * 10 ** Number(decimal);

//     console.log('expectedAmountOut :>> ', expectedAmountOut);
//     console.log('decimal :>> ', decimal);
//     console.log('amount_out_min :>> ', amount_out_min);

//     if (amount_out_min <= 0) {
//       return false;
//     }

//     console.log('wallet_addr :>> ', wallet_addr);
//     console.log('deadline :>> ', deadline);

//     const swapFunction = routerContract.methods.swapExactETHForTokens(
//       amount_out_min,
//       [
//         w3.utils.toChecksumAddress(WETH_ADDRESS),
//         w3.utils.toChecksumAddress(token_addr),
//       ],
//       w3.utils.toChecksumAddress(wallet_addr),
//       deadline
//     );

//     const tx = {
//       data: swapFunction.encodeABI(),
//       to: w3.utils.toChecksumAddress(UNISWAP_ROUTER_V2), // Replace with the contract address
//       from: w3.utils.toChecksumAddress(wallet_addr),
//       nonce: await w3.eth.getTransactionCount(w3.utils.toChecksumAddress(wallet_addr), 'pending'),
//       gas: await swapFunction.estimateGas({ from: w3.utils.toChecksumAddress(wallet_addr), value: amount_in_wei, }),
//       gasPrice: await w3.eth.getGasPrice() + BigInt(w3.utils.toWei(2, 'gwei')),
//       value: amount_in_wei,
//       chainId: chainId,
//     }

//     console.log('nonce :>> ', await w3.eth.getTransactionCount(w3.utils.toChecksumAddress(wallet_addr), 'pending'));
//     console.log('tx :>> ', tx);

//     const signedTx = await w3.eth.accounts.signTransaction(tx, owner);

//     console.log('signedTx :>> ', signedTx);

//     const data = {
//       jsonrpc: '2.0',
//       method: 'eth_sendRawTransaction',
//       params: [w3.utils.toHex(signedTx.rawTransaction)],
//       id: chainId,
//     };

//     const response = await axios.post(CONFIRM_ENDPOINT1, data);

//     if (response.status !== 200) {
//       return false;
//     }

//     const txHash = response.data.result;

//     console.log('txHash :>> ', response.data.result);

//     return txHash;
//   } catch (e) {
//     revertBoosting(userId, false);
//     revertWorking(userId, false);
//     console.error('error:', e);
//     return e;
//   }
// }

// export const swapTokenToETH = async (userId: string, amount: BigInt, dexId: string, wallet_addr: string, token_addr: string, owner: string) => {
//   console.log('TOKEN ------------------------------------------------> ETH');

//   try {
//     let routerContract;
//     let abi;

//     if (dexId === 'v3') {
//       abi = get_router_v3_abi();
//       routerContract = new w3.eth.Contract(abi, UNISWAP_ROUTER_V3);
//     } else if (dexId === 'v2') {
//       abi = get_router_abi();
//       routerContract = new w3.eth.Contract(abi, UNISWAP_ROUTER_V2);
//     } else {
//       revertBoosting(userId, false);
//       return false;
//     }

//     const tokenAbi = get_erc20_abi();
//     const amountIn = amount;
//     const deadline = Math.floor(Date.now() / 1000) + 3000;

//     // const expectedAmountOut = await routerContract.methods
//     //   .getAmountsOut(amountIn, [
//     //     w3.utils.toChecksumAddress(token_addr),
//     //     w3.utils.toChecksumAddress(WETH_ADDRESS),
//     //   ])
//     //   .call();

//     const tokenContract = new w3.eth.Contract(
//       tokenAbi,
//       w3.utils.toChecksumAddress(token_addr)
//     );

//     const allowance: BigInt = await tokenContract.methods
//       .allowance(
//         w3.utils.toChecksumAddress(wallet_addr),
//         UNISWAP_ROUTER_V2
//       )
//       .call();

//     console.log('allowance :>> ', allowance);
//     console.log('amountIn :>> ', amountIn);
//     console.log('allowance < amountIn :>> ', allowance < amountIn);

//     if (allowance < amountIn) {
//       const approveAmount = amountIn;
//       const decimal = await tokenContract.methods.decimals().call();
//       const approveFunction = tokenContract.methods.approve(
//         UNISWAP_ROUTER_V2,
//         Number(approveAmount) * 10 ** Number(decimal)
//       );

//       const approveTx = {
//         to: w3.utils.toChecksumAddress(token_addr),
//         data: approveFunction.encodeABI(),
//         gas: await approveFunction.estimateGas({ from: w3.utils.toChecksumAddress(wallet_addr) }),
//         gasPrice: await w3.eth.getGasPrice() + BigInt(w3.utils.toWei(2, 'gwei')),
//         nonce: await w3.eth.getTransactionCount(w3.utils.toChecksumAddress(wallet_addr), 'pending'),
//         chainId: chainId
//       }

//       console.log('approveTx :>> ', approveTx);

//       const signedApproveTx = await w3.eth.accounts.signTransaction(
//         approveTx,
//         owner
//       );

//       console.log('signedApproveTx :>> ', signedApproveTx);

//       const data = {
//         jsonrpc: '2.0',
//         method: 'eth_sendRawTransaction',
//         params: [w3.utils.toHex(signedApproveTx.rawTransaction)],
//         id: chainId,
//       };

//       const response = await axios.post(CONFIRM_ENDPOINT2, data);

//       if (response.status !== 200) {
//         return false;
//       }

//       console.log('approveTxHash :>> ', response.data);

//       await waitForUpdateApprove(token_addr, wallet_addr, tokenAbi, amount);
//       await waitForConfirmation(response.data.result);
//     }

//     console.log('token amountIn :>> ', amountIn);

//     const swapFunction =
//       routerContract.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
//         amountIn,
//         0,
//         [
//           w3.utils.toChecksumAddress(token_addr),
//           w3.utils.toChecksumAddress(WETH_ADDRESS),
//         ],
//         wallet_addr,
//         deadline
//       );

//     const tx = {
//       to: UNISWAP_ROUTER_V2, // Replace with the contract address
//       data: swapFunction.encodeABI(),
//       gas: await swapFunction.estimateGas({ from: w3.utils.toChecksumAddress(wallet_addr) }),
//       gasPrice: await w3.eth.getGasPrice() + BigInt(w3.utils.toWei(2, 'gwei')),
//       nonce: await w3.eth.getTransactionCount(w3.utils.toChecksumAddress(wallet_addr), 'pending'),
//       chainId: chainId,
//     }

//     console.log('nonce :>> ', await w3.eth.getTransactionCount(w3.utils.toChecksumAddress(wallet_addr), 'pending'));

//     const signedTx = await w3.eth.accounts.signTransaction(tx, owner);

//     const data = {
//       jsonrpc: '2.0',
//       method: 'eth_sendRawTransaction',
//       params: [w3.utils.toHex(signedTx.rawTransaction)],
//       id: chainId,
//     };

//     const response = await axios.post(CONFIRM_ENDPOINT2, data);
//     if (response.status !== 200) {
//       return false;
//     }

//     const txHash = response.data.result;
//     console.log('tx hash :>> ', txHash);

//     return txHash;
//   } catch (e) {
//     revertBoosting(userId, false);
//     revertWorking(userId, false);
//     console.error('error:', e);
//   }
// }

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

// export const waitForUpdateApprove = async (token_addr: string, wallet_addr: string, tokenAbi: ContractAbi, amount: BigInt) => {
//   const tokenContract = new w3.eth.Contract(
//     tokenAbi,
//     w3.utils.toChecksumAddress(token_addr)
//   );

//   let allowance: BigInt = await tokenContract.methods
//     .allowance(
//       w3.utils.toChecksumAddress(wallet_addr),
//       UNISWAP_ROUTER_V2
//     )
//     .call();

//   while (allowance < amount) {
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     console.log(`Waiting for update approve token transfer - wallet_addr : ${wallet_addr}, token_addr : ${token_addr}`);

//     allowance = await tokenContract.methods
//       .allowance(
//         w3.utils.toChecksumAddress(wallet_addr),
//         UNISWAP_ROUTER_V2
//       )
//       .call();
//   }
// }

// export async function waitForConfirmation(txHash: TransactionHash) {
//   try {
//     let receipt = null;
//     let retries = 0;
//     const maxRetries = 10; // Set the number of retries (you can adjust this)

//     while (retries < maxRetries) {
//       receipt = await w3.eth.getTransactionReceipt(txHash);

//       if (receipt !== null) {
//         console.log('Transaction confirmed in block:', receipt.blockNumber);
//         return receipt;
//       }

//       console.log('Waiting for confirmation...');
//       retries++;
//       await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 1 second before retrying
//     }

//     throw new Error('Transaction confirmation failed after multiple retries');
//   } catch (error) {
//     console.error('Error waiting for confirmation:', error);
//   }
// }


// export const waitForUpdateBalance = async (balanceBefore: Balance, wallet_addr: string, token_addr: string) => {
//   let balanceAfter = await getBalance(wallet_addr, token_addr);
//   while (
//     balanceAfter.token === balanceBefore.token &&
//     balanceAfter.eth === balanceBefore.eth
//   ) {
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     console.log(`Waiting for update token balance - wallet_addr : ${wallet_addr}, token_addr : ${token_addr}`);

//     balanceAfter = await getBalance(wallet_addr, token_addr)
//   }
//   return balanceAfter;
// }

// export const waitForUpdateETHBalance = async (amount: number, wallet_addr: string) => {
//   const balanceWei = await w3.eth.getBalance(wallet_addr);
//   let balanceETH = parseFloat(w3.utils.fromWei(balanceWei, 'ether'));
//   while (amount == balanceETH) {
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     console.log(`Waiting for update token balance - wallet_addr : ${wallet_addr}, ETH amount : ${balanceETH}`);

//     balanceETH = parseFloat(w3.utils.fromWei(balanceWei, 'ether'));
//   }
//   return balanceETH;
// }

// export const testingProcessTransaction = async (userId: string, dexId: string, wallet_addr: string, token_addr: string, owner: string, txn: number) => {
//   // revertWorking(userId, false);
//   let balance = await getBalance(wallet_addr, token_addr);

// Check if ETH balance is sufficient for transaction
// if (balance.eth - 0.11 <= 0) return;

// // Attempt to swap ETH to Token
// const swapETHToTokenTxHash = await swapETHToToken(userId, 0.1, dexId, wallet_addr, token_addr, owner);

// if (!swapETHToTokenTxHash) return;

// // Wait for the balance update after the swap
// balance = await waitForUpdateBalance(balance, wallet_addr, token_addr);

// // If token balance is greater than the threshold, proceed with the next swap
// if (Number(balance.token) > 10 ** (Number(balance.decimals) / 2)) {
//   try {
//     // Attempt to swap Token to ETH
//     const isSwapedTokenToETH = await swapTokenToETH(userId, balance.token, dexId, wallet_addr, token_addr, owner);

//     if (isSwapedTokenToETH) {
//       calcTotalTxns(userId);
//       calcTxns(userId);

//       // Stop if we've hit the transaction limit
//       if (txn === 5) {
//         revertWorking(userId, false);
//         return;
//       }

//       revertWorking(userId, true);
//       return;
//     }
//   } catch (error) {
//     console.error("Error during token to ETH swap:", error);
//     // Optionally, handle the error here (e.g., revert or log details)
//   }
// }
// }

// const finalizeTransaction = async (
//   userId: string,
//   txn: number,
//   balance: Balance,
//   walletAddr: string,
//   owner: string
// ): Promise<void> => {
//   // Recalculate total and individual transactions
//   calcTotalTxns(userId);
//   calcTxns(userId);
//   revertWorking(userId, true);

//   // If it's every 20th transaction, generate a new wallet and transfer ETH
//   if ((txn + 1) % 20 === 0) {
//     const { privateKey, publicKey } = await createNewEthereumWallet();
//     const balanceETH = await waitForUpdateETHBalance(balance.eth, walletAddr);

//     // Send remaining ETH to the new wallet (leaving a small buffer)
//     await sendETHToWallet(walletAddr, publicKey, balanceETH - 0.003, owner);
//     updateBoosting(userId, publicKey, privateKey);
//   }
// };


export const approveToken = async (userId: string, wallet_addr: string, token_addr: string, owner: string) => {
  try {
    const volumeBoostABI = get_VOLUME_BOOST_CONTRACTing_abi();
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

    console.log('approve txHash :>> ', response.data.result);

    return txHash;
  } catch (e) {
    console.error('error:', e);
    throw new Error(`Error approving token: ${userId}`);
  }
}

export const executeSwap = async (userId: string, amount: number, wallet_addr: string, token_addr: string, owner: string) => {
  try {
    const volumeBoostABI = get_VOLUME_BOOST_CONTRACTing_abi();
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
    throw new Error(`Error execute boosting: ${userId}`);
  }
}

export const testingProcessTransaction = async (userId: string, wallet_addr: string, token_addr: string, owner: string) => {
  try {
    // Start transaction by reverting the user isWorking satus to not working
    revertWorking(userId, false);

    // Fetch balance details
    let balance: Balance = await getBalance(wallet_addr, token_addr);

    // // Check if ETH balance is below threshold
    // if (balance.eth <= 1.01) {
    //   await sendETHToWallet(wallet_addr, ETH_BASE_WALLET_ADDRESS, 1, owner)
    //   return;
    // }
    
    // const isExecuted = await executeSwap(userId, 1, wallet_addr, token_addr, owner);

    if (balance.eth <= 0.11) {
      await sendETHToWallet(wallet_addr, ETH_BASE_WALLET_ADDRESS, 0.1, owner)
      return;
    }

    const isExecuted = await executeSwap(userId, 0.1, wallet_addr, token_addr, owner);

    if (isExecuted) {
      calcExecution(userId);
    }
  } catch (error) {
    console.error(`Error processing transaction for user ${userId}, error`);
  }
}