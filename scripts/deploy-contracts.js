const { TonClient, WalletContractV4, internal, toNano, beginCell, Address } = require('@ton/ton');
const { mnemonicToWalletKey } = require('@ton/crypto');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function deployContracts() {
  // Initialize TON client
  const client = new TonClient({
    endpoint: process.env.TON_ENDPOINT || 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Create wallet from mnemonic
  const mnemonic = process.env.DEPLOYER_MNEMONIC.split(' ');
  const key = await mnemonicToWalletKey(mnemonic);
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  // Get wallet address
  const walletAddress = wallet.address.toString();
  console.log('Deployer wallet:', walletAddress);

  // Check balance
  const balance = await client.getBalance(wallet.address);
  console.log('Wallet balance:', balance / 1e9, 'TON');

  if (balance < toNano('0.5')) {
    throw new Error('Insufficient balance for deployment');
  }

  // Compile contracts (you need to compile .fc files to .boc first)
  const gameWalletCode = fs.readFileSync(
    path.join(__dirname, '../contracts/GameWallet.boc')
  );
  const rewardPoolCode = fs.readFileSync(
    path.join(__dirname, '../contracts/RewardPool.boc')
  );

  // Deploy Game Wallet
  console.log('Deploying Game Wallet...');
  const gameWalletData = beginCell()
    .storeAddress(wallet.address) // admin
    .storeUint(0, 64) // total_points
    .storeCoins(0) // total_withdrawn
    .storeUint(500, 32) // withdrawal_fee (5%)
    .storeUint(50000, 64) // min_withdrawal
    .storeUint(10000, 32) // points_to_ton_rate
    .storeUint(0, 1) // emergency_pause
    .endCell();

  const gameWalletAddress = await deployContract(
    client,
    wallet,
    key.secretKey,
    gameWalletCode,
    gameWalletData
  );
  console.log('Game Wallet deployed at:', gameWalletAddress);

  // Deploy Reward Pool
  console.log('Deploying Reward Pool...');
  const rewardPoolData = beginCell()
    .storeAddress(wallet.address) // admin
    .storeCoins(toNano('0.1')) // daily_reward_amount
    .storeCoins(toNano('10')) // tournament_pool
    .storeUint(Math.floor(Date.now() / 1000), 32) // last_tournament_end
    .storeUint(7 * 24 * 60 * 60, 32) // tournament_duration (7 days)
    .storeDict(null) // claimed_rewards (empty dict)
    .endCell();

  const rewardPoolAddress = await deployContract(
    client,
    wallet,
    key.secretKey,
    rewardPoolCode,
    rewardPoolData
  );
  console.log('Reward Pool deployed at:', rewardPoolAddress);

  // Save addresses to config
  const config = {
    gameWallet: gameWalletAddress,
    rewardPool: rewardPoolAddress,
    deployedAt: new Date().toISOString(),
    network: process.env.TON_NETWORK || 'testnet',
  };

  fs.writeFileSync(
    path.join(__dirname, '../contracts/deployed.json'),
    JSON.stringify(config, null, 2)
  );

  console.log('Deployment complete! Addresses saved to deployed.json');
}

async function deployContract(client, wallet, secretKey, code, data) {
  const init = { code, data };
  const contractAddress = contractAddress(0, init);

  const deployAmount = toNano('0.1');
  
  const seqno = await wallet.getSeqno();
  
  await wallet.sendTransfer({
    secretKey,
    seqno,
    messages: [
      internal({
        to: contractAddress,
        value: deployAmount,
        init,
        body: beginCell().endCell(),
      }),
    ],
  });

  // Wait for deployment
  console.log('Waiting for deployment...');
  let attempts = 0;
  while (attempts < 30) {
    await sleep(2000);
    const state = await client.getContractState(contractAddress);
    if (state.state === 'active') {
      return contractAddress.toString();
    }
    attempts++;
  }

  throw new Error('Deployment timeout');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run deployment
deployContracts().catch(console.error);