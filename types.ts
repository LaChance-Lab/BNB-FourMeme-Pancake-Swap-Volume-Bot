export type Wallet = {
  address: string,
  privateKey: string,
  amount: number,
  fund: number,
}

export enum ChainId {
  BSC = 56,
  Ethereum = 1,
  Sepolia = 11155111,
}
