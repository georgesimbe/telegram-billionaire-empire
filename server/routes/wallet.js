const express = require('express');
const { Address, Cell, beginCell } = require('@ton/core');
const { TonClient } = require('@ton/ton');
const User = require('../models/User');
const logger = require('../utils/logger');

const router = express.Router();

// TON client configuration
const tonClient = new TonClient({
  endpoint: process.env.TON_ENDPOINT || 'https://toncenter.com/api/v2/jsonRPC'
});

// Game configuration
const POINTS_TO_TON_RATE = parseInt(process.env.POINTS_TO_TON_RATE) || 10000;
const WITHDRAWAL_FEE_PERCENT = parseInt(process.env.WITHDRAWAL_FEE_PERCENT) || 5;
const MIN_WITHDRAWAL_POINTS = parseInt(process.env.MIN_WITHDRAWAL_POINTS) || 50000;

// Connect TON wallet
router.post('/connect', async (req, res) => {
  try {
    const { address, proof } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Validate TON address format
    let walletAddress;
    try {
      walletAddress = Address.parse(address);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid TON address format' });
    }

    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // TODO: Verify wallet ownership proof in production
    // For MVP, we'll skip complex proof verification

    // Update user's wallet information
    user.tonWallet.address = walletAddress.toString();
    user.tonWallet.isConnected = true;

    await user.save();

    logger.info(`Wallet connected for user ${req.user.id}: ${address}`);

    res.json({
      success: true,
      wallet: {
        address: user.tonWallet.address,
        isConnected: user.tonWallet.isConnected
      }
    });

  } catch (error) {
    logger.error('Error connecting wallet:', error);
    res.status(500).json({ error: 'Failed to connect wallet' });
  }
});

// Disconnect wallet
router.post('/disconnect', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.tonWallet.address = null;
    user.tonWallet.isConnected = false;

    await user.save();

    res.json({ success: true });

  } catch (error) {
    logger.error('Error disconnecting wallet:', error);
    res.status(500).json({ error: 'Failed to disconnect wallet' });
  }
});

// Get withdrawal information
router.get('/withdrawal-info', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const availablePoints = user.points;
    const tonAmount = availablePoints / POINTS_TO_TON_RATE;
    const feeAmount = tonAmount * (WITHDRAWAL_FEE_PERCENT / 100);
    const netAmount = tonAmount - feeAmount;

    const canWithdraw = availablePoints >= MIN_WITHDRAWAL_POINTS && user.tonWallet.isConnected;

    res.json({
      availablePoints,
      tonAmount,
      feeAmount,
      netAmount,
      feePercent: WITHDRAWAL_FEE_PERCENT,
      minWithdrawalPoints: MIN_WITHDRAWAL_POINTS,
      canWithdraw,
      walletConnected: user.tonWallet.isConnected,
      walletAddress: user.tonWallet.address
    });

  } catch (error) {
    logger.error('Error getting withdrawal info:', error);
    res.status(500).json({ error: 'Failed to get withdrawal info' });
  }
});

// Request withdrawal
router.post('/withdraw', async (req, res) => {
  try {
    const { pointsToWithdraw } = req.body;

    if (!pointsToWithdraw || pointsToWithdraw < MIN_WITHDRAWAL_POINTS) {
      return res.status(400).json({
        error: `Minimum withdrawal is ${MIN_WITHDRAWAL_POINTS} points`
      });
    }

    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.tonWallet.isConnected || !user.tonWallet.address) {
      return res.status(400).json({ error: 'Wallet not connected' });
    }

    if (user.points < pointsToWithdraw) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    // Check withdrawal cooldown (24 hours)
    if (user.tonWallet.lastWithdrawal) {
      const hoursSinceLastWithdrawal = (Date.now() - user.tonWallet.lastWithdrawal) / (1000 * 60 * 60);
      if (hoursSinceLastWithdrawal < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastWithdrawal);
        return res.status(429).json({
          error: `Withdrawal cooldown active. Try again in ${hoursRemaining} hours.`
        });
      }
    }

    // Calculate withdrawal amounts
    const tonAmount = pointsToWithdraw / POINTS_TO_TON_RATE;
    const feeAmount = tonAmount * (WITHDRAWAL_FEE_PERCENT / 100);
    const netTonAmount = tonAmount - feeAmount;

    // In production, this would interact with smart contracts
    // For MVP, we'll simulate the withdrawal process

    try {
      // TODO: Implement actual smart contract interaction
      // const withdrawalResult = await processWithdrawal(user.tonWallet.address, netTonAmount);

      // For now, simulate successful withdrawal
      const withdrawalResult = {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        amount: netTonAmount
      };

      if (withdrawalResult.success) {
        // Update user balance
        user.points -= pointsToWithdraw;
        user.tonWallet.totalWithdrawn += netTonAmount;
        user.tonWallet.lastWithdrawal = new Date();

        await user.save();

        logger.info(`Withdrawal processed for user ${req.user.id}: ${netTonAmount} TON`);

        res.json({
          success: true,
          withdrawal: {
            pointsWithdrawn: pointsToWithdraw,
            tonAmount: netTonAmount,
            feeAmount,
            transactionHash: withdrawalResult.transactionHash,
            remainingPoints: user.points
          }
        });
      } else {
        throw new Error('Withdrawal failed');
      }

    } catch (withdrawalError) {
      logger.error('Withdrawal processing failed:', withdrawalError);
      res.status(500).json({ error: 'Withdrawal failed. Please try again later.' });
    }

  } catch (error) {
    logger.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

// Get withdrawal history
router.get('/history', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // TODO: Implement withdrawal history from database
    // For MVP, return basic wallet stats

    res.json({
      totalWithdrawn: user.tonWallet.totalWithdrawn || 0,
      lastWithdrawal: user.tonWallet.lastWithdrawal,
      walletAddress: user.tonWallet.address,
      withdrawalCount: 0 // TODO: Add withdrawal count to user model
    });

  } catch (error) {
    logger.error('Error getting withdrawal history:', error);
    res.status(500).json({ error: 'Failed to get withdrawal history' });
  }
});

// Verify transaction status
router.get('/verify/:hash', async (req, res) => {
  try {
    const { hash } = req.params;

    // TODO: Implement actual transaction verification using TON client
    // For MVP, return mock verification

    res.json({
      hash,
      status: 'confirmed',
      amount: 0.5,
      timestamp: Date.now(),
      verified: true
    });

  } catch (error) {
    logger.error('Error verifying transaction:', error);
    res.status(500).json({ error: 'Failed to verify transaction' });
  }
});

// Helper function to process withdrawal (placeholder for smart contract integration)
async function processWithdrawal(walletAddress, amount) {
  // This would interact with the deployed smart contracts
  // For MVP, we'll return a mock response

  return {
    success: true,
    transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    amount
  };
}

module.exports = router; 