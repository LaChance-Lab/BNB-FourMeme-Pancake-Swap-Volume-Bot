<div align="center">

# 🤖 EVM Volume Trading Bot

### Automated Volume Generation for EVM-Compatible Chains

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)](https://ethereum.org/)
[![BSC](https://img.shields.io/badge/BSC-F3BA2F?style=for-the-badge&logo=binance&logoColor=black)](https://www.bnbchain.org/)

[📱 Contact](https://t.me/lachancelab) • [🎥 Demo](#-demo) • [📊 Examples](#-live-transactions)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Supported Chains](#-supported-chains)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Demo](#-demo)
- [Live Transactions](#-live-transactions)
- [Roadmap](#-roadmap)
- [Contact](#-contact)

---

## 🌟 Overview

A sophisticated trading bot that generates organic trading volume on EVM-compatible chains by simulating real trader behavior through multiple wallet interactions. Perfect for token launches, liquidity testing, and market making activities.

## 🔗 Supported Chains

| Chain | Status | Network ID |
|-------|--------|------------|
| 🟡 Binance Smart Chain (BSC) | ✅ Supported | 56 |
| 🔵 Ethereum Mainnet | ✅ Supported | 1 |
| 🟣 Sepolia Testnet | ✅ Supported | 11155111 |
| ⚪ Any EVM Chain | ✅ Supported | Custom |

## ✨ Features

- 🎲 **Random Wallet Generation** - Creates multiple sub-wallets for authentic trading patterns
- 💰 **Automated Funding** - Distributes funds across wallets automatically
- 📈 **Realistic Trading** - Simulates real trader behavior with randomized amounts and intervals
- 🔄 **Fund Recovery** - Gathers funds back to main wallet after operations
- 🛡️ **Wallet Persistence** - Saves generated wallets to JSON for fund recovery
- ⚡ **Configurable Parameters** - Full control over timing, amounts, and wallet count

## 🛠️ Technology Stack

- **Language:** TypeScript
- **Smart Contracts:** Solidity
- **Type:** Automated Bot Script
- **Networks:** Multi-chain EVM support

---

## 🚀 Quick Start

### 1️⃣ Installation

```bash
npm install
```

### 2️⃣ Environment Setup

Edit your `.env` file with your wallet credentials:

```env
ETH_BASE_WALLET_ADDRESS="Your wallet address here"
ETH_BASE_WALLET_PRIVATE_KEY="Your private key here"
```

> ⚠️ **Security Note:** Never share your private keys or commit them to version control!

> 💡 **RPC Endpoints:** Default RPC addresses are included but are free tier. For better performance, use your own paid RPC endpoints.

### 3️⃣ Run the Bot

```bash
npm run dev
```

---

## ⚙️ Configuration

### Basic Configuration (`config.json`)

```typescript
// Trading Intervals (milliseconds)
export const maxInterval = 30000  // Maximum time between trades
export const minInterval = 5000   // Minimum time between trades

// Wallet Funding Amounts (ETH/BNB)
export const amountMax = 0.03     // Maximum balance per wallet
export const amountMin = 0.01     // Minimum balance per wallet (≥ 0.001)

// Gas Fee Reserve
export const fee = 0.005          // Reserved for transaction fees (≥ 0.001)

// Wallet Configuration
export const subWalletNum = 20    // Number of sub-wallets to generate

// Target Chain
export const CHAINID: ChainId = ChainId.BSC
```

### 💰 Funding Calculator

**Formula:** `(amountMax + fee) × subWalletNum`

**Example:**
```
Configuration:
- amountMax: 0.03 ETH/BNB
- fee: 0.005 ETH/BNB  
- subWalletNum: 20

Required Balance: (0.03 + 0.005) × 20 = 0.7 ETH/BNB
```

### 📝 Recommendations

| Parameter | Recommended Value | Notes |
|-----------|------------------|-------|
| `fee` | 0.01 - 0.06 | Higher fee ensures successful transactions and easier fund recovery |
| `amountMin` | ≥ 0.001 | Minimum viable trading amount |
| `subWalletNum` | 10 - 50 | Balance between volume and management complexity |

> 💡 **Pro Tip:** Use a higher fee value (e.g., 0.01) to ensure smooth operation and easy fund recovery in case of errors.

> 🔐 **Backup:** The bot automatically creates a JSON file with generated wallets, allowing you to withdraw funds manually if needed.

---

## 🎥 Demo

Watch the bot in action:

https://github.com/user-attachments/assets/ac6e55f6-7ece-4cad-8dc7-883423c32f4e

---

## 📊 Live Transactions

### Real Transaction Examples on BSC

| Transaction | Link |
|-------------|------|
| TX 1 | [View on BSCScan](https://bscscan.com/tx/0x581cda788080b52fbd5db8c4d3500c22a6c136a07b73e2311d1fc29330d48fe5) |
| TX 2 | [View on BSCScan](https://bscscan.com/tx/0x8c870cf1721c2c765b45d2b13731bf384ec2e8020552aafb0436c01ded98f2ab) |
| TX 3 | [View on BSCScan](https://bscscan.com/tx/0xb46d289c48d04dc6cc74849ecd9ef4fff6bf86aa3b16fc231d019b82c7789bc2) |

---

## 🗺️ Roadmap

- [ ] **Smart Amount Randomization** - More sophisticated trading amount distribution
- [ ] **Dynamic Frequency Control** - Adaptive buy/sell frequency based on market conditions
- [ ] **Multi-Pool Support** - Randomized pool selection for distributed volume
- [ ] **Automatic Fund Gathering** - Enhanced automated fund recovery system
- [ ] **Advanced Analytics** - Trading statistics and performance metrics
- [ ] **GUI Dashboard** - Web interface for easier configuration and monitoring

---

## 📞 Contact

💬 **Telegram:** [t.me/lachancelab](https://t.me/lachancelab)

---

<div align="center">

### ⚠️ Disclaimer

**This bot is for educational and testing purposes. Always comply with local regulations and exchange terms of service. Use responsibly.**

---

Made with ❤️ by LaChanceLab

</div>
