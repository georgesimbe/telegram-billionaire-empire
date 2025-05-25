import { TonClient, WalletContractV4, internal } from '@ton/ton';
import { toNano, fromNano } from '@ton/core';
import { GAME_CONFIG } from '../config/gameConfig';

// Initialize TON client
const client = new TonClient({
  endpoint: GAME_CONFIG.TON.NETWORK === 'mainnet' 
    ? 'https://toncenter.com/api/v2/jsonRPC'
    : 'https://testnet.toncenter.com/api/v2/jsonRPC',
});

// Game smart contract addresses (deploy these contracts)
const GAME_WALLET_ADDRESS = 'EQD...'; // Your game's wallet address
const REWARD_POOL_ADDRESS = 'EQC...'; // Reward pool contract

export const TonIntegration = {
  // Connect wallet
  async connectWallet(tonConnectUI) {
    try {
      const connectedWallet = await tonConnectUI.connectWallet();
      return connectedWallet;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  },

  // Get wallet balance
  async getBalance(address) {
    try {
      const balance = await client.getBalance(address);
      return fromNano(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  },

  // Convert points to TON
  async convertPointsToTON(points, walletAddress, tonConnectUI) {
    try {
      // Validate minimum withdrawal
      if (points < GAME_CONFIG.MIN_WITHDRAWAL) {
        throw new Error(`Minimum withdrawal is ${GAME_CONFIG.MIN_WITHDRAWAL} points`);
      }

      // Calculate TON amount after fee
      const tonAmount = points / GAME_CONFIG.POINTS_TO_TON_RATE;
      const fee = tonAmount * GAME_CONFIG.WITHDRAWAL_FEE;
      const finalAmount = tonAmount - fee;

      // Create transaction
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: walletAddress,
            amount: toNano(finalAmount.toString()),
            payload: 'Points withdrawal from Billionaire Empire',
          },
        ],
      };

      // Send transaction through TonConnect
      const result = await tonConnectUI.sendTransaction(transaction);
      
      return {
        success: true,
        amount: finalAmount,
        txHash: result.hash,
      };
    } catch (error) {
      console.error('Withdrawal failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Purchase Stars with TON
  async purchaseStars(tonAmount, tonConnectUI) {
    try {
      const stars = Math.floor(tonAmount * 100); // 1 TON = 100 Stars
      
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: GAME_WALLET_ADDRESS,
            amount: toNano(tonAmount.toString()),
            payload: JSON.stringify({
              action: 'purchase_stars',
              stars: stars,
            }),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      
      return {
        success: true,
        stars: stars,
        txHash: result.hash,
      };
    } catch (error) {
      console.error('Star purchase failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Verify transaction on blockchain
  async verifyTransaction(txHash) {
    try {
      // Wait for transaction to be confirmed
      let attempts = 0;
      while (attempts < 30) {
        const tx = await client.getTransaction(txHash);
        if (tx) {
          return {
            verified: true,
            transaction: tx,
          };
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      }
      
      return {
        verified: false,
        error: 'Transaction timeout',
      };
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return {
        verified: false,
        error: error.message,
      };
    }
  },

  // Anti-fraud: Verify wallet ownership
  async verifyWalletOwnership(walletAddress, telegramUserId) {
    try {
      // Create a unique message for signing
      const message = `Verify ownership for Billionaire Empire\nUser: ${telegramUserId}\nTimestamp: ${Date.now()}`;
      
      // This would require the user to sign a message
      // Implementation depends on your wallet integration
      
      return true;
    } catch (error) {
      console.error('Wallet verification failed:', error);
      return false;
    }
  },

  // Get transaction history
  async getTransactionHistory(address, limit = 10) {
    try {
      const transactions = await client.getTransactions(address, { limit });
      return transactions.map(tx => ({
        hash: tx.hash,
        time: new Date(tx.utime * 1000),
        amount: fromNano(tx.amount),
        fee: fromNano(tx.fee),
      }));
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return [];
    }
  },

  // Smart contract interaction for rewards
  async claimDailyReward(walletAddress, tonConnectUI) {
    try {
      // Check if user can claim (server-side validation recommended)
      const canClaim = await this.checkDailyRewardEligibility(walletAddress);
      if (!canClaim) {
        throw new Error('Daily reward already claimed');
      }

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: REWARD_POOL_ADDRESS,
            amount: toNano('0.05'), // Gas fee
            payload: JSON.stringify({
              action: 'claim_daily',
              wallet: walletAddress,
            }),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      
      return {
        success: true,
        txHash: result.hash,
      };
    } catch (error) {
      console.error('Daily reward claim failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Check daily reward eligibility
  async checkDailyRewardEligibility(walletAddress) {
    // This should query your backend or smart contract
    // to check last claim time
    return true; // Placeholder
  },
};