const express = require('express');
// Use DevUserService in development mode
const UserService = process.env.NODE_ENV === 'development'
  ? require('../services/DevUserService')
  : require('../services/UserService');
const { redisUtils } = require('../config/redis');
const logger = require('../utils/logger');
const { BUSINESS_CONFIG, getBusinessById, getAllBusinesses, calculateUpgradeCost, calculateIncome } = require('../config/businessConfig');
const { GAME_CONFIG, calculateLevel, calculateClickPower } = require('../config/gameConfig');

const router = express.Router();

// Use daily limits from game config
const DAILY_LIMITS = GAME_CONFIG.DAILY_LIMITS;

// Get user profile and game state
router.get('/profile', async (req, res) => {
  try {
    // Try to get user from cache first
    let user = await UserService.getCachedUser(req.user.id);

    if (!user) {
      // Get from database
      user = await UserService.findByTelegramId(req.user.id);

      if (!user) {
        // Create new user
        user = await UserService.createUser({
          id: req.user.id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          username: req.user.username,
          languageCode: req.user.languageCode,
          isPremium: req.user.isPremium
        });
        logger.info(`New user created: ${req.user.id}`);
      } else {
        // Update last active
        await UserService.updateLastActive(user.id);
      }

      // Cache user data
      await UserService.cacheUser(user);
    }

    // Get user businesses
    const businesses = await UserService.getUserBusinesses(user.id);

    // Get daily stats
    const dailyStats = await UserService.getDailyStats(user.id);

    res.json({
      user: {
        id: user.telegram_id,
        firstName: user.first_name,
        username: user.username,
        points: user.points,
        level: user.level,
        experience: user.experience,
        clickPower: user.click_power,
        businesses: businesses,
        tonWallet: user.ton_wallet,
        settings: user.settings,
        referralCode: user.referral_code,
        referralCount: user.referral_count,
        dailyStats: dailyStats
      }
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Handle tap/click action
router.post('/tap', async (req, res) => {
  try {
    const { taps = 1 } = req.body;

    if (taps < 1 || taps > 10) {
      return res.status(400).json({ error: 'Invalid tap count' });
    }

    const user = await UserService.findByTelegramId(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check daily tap limit
    const canTap = await UserService.canPerformAction(user.id, 'clicks', DAILY_LIMITS.clicks);
    if (!canTap) {
      return res.status(429).json({ error: 'Daily tap limit reached' });
    }

    // Calculate points earned
    const pointsPerTap = user.click_power * (user.vip_status?.isActive ? 2 : 1);
    const pointsEarned = pointsPerTap * taps;

    // Update user stats
    const updatedUser = await UserService.updatePoints(user.id, pointsEarned);

    // Record actions
    await UserService.recordAction(user.id, 'clicks', taps);
    await UserService.recordAction(user.id, 'points_earned', pointsEarned);

    // Check for level up
    const leveledUp = updatedUser.level > user.level;

    // Get updated daily stats
    const dailyStats = await UserService.getDailyStats(user.id);

    res.json({
      points: updatedUser.points,
      pointsEarned,
      level: updatedUser.level,
      leveledUp,
      clickPower: updatedUser.click_power,
      dailyStats: dailyStats
    });

  } catch (error) {
    logger.error('Error processing tap:', error);
    res.status(500).json({ error: 'Failed to process tap' });
  }
});

// Purchase business
router.post('/business/purchase', async (req, res) => {
  try {
    const { businessId } = req.body;

    const user = await UserService.findByTelegramId(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if business exists in config
    const businessConfig = getBusinessById(businessId);
    if (!businessConfig) {
      return res.status(400).json({ error: 'Business not found' });
    }

    // Check level requirement
    if (user.level < businessConfig.requiredLevel) {
      return res.status(400).json({ error: 'Level requirement not met' });
    }

    // Check if user already owns this business
    const businesses = await UserService.getUserBusinesses(user.id);
    const existingBusiness = businesses.find(b => b.business_id === businessId);

    if (existingBusiness) {
      return res.status(400).json({ error: 'Business already owned' });
    }

    // Check if user has enough points
    if (user.points < businessConfig.baseCost) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    // Purchase business
    const newPoints = user.points - businessConfig.baseCost;
    await UserService.updatePoints(user.id, -businessConfig.baseCost);

    // Add business to user
    await UserService.updateBusinessLevel(user.id, businessId, 1);

    // Get updated businesses
    const updatedBusinesses = await UserService.getUserBusinesses(user.id);

    res.json({
      points: newPoints,
      businesses: updatedBusinesses,
      purchased: { id: businessId, ...businessConfig }
    });

  } catch (error) {
    logger.error('Error purchasing business:', error);
    res.status(500).json({ error: 'Failed to purchase business' });
  }
});

// Upgrade business
router.post('/business/upgrade', async (req, res) => {
  try {
    const { businessId } = req.body;

    const user = await UserService.findByTelegramId(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check daily upgrade limit
    const canUpgrade = await UserService.canPerformAction(user.id, 'business_upgrades', DAILY_LIMITS.businessUpgrades);
    if (!canUpgrade) {
      return res.status(429).json({ error: 'Daily upgrade limit reached' });
    }

    // Get user businesses
    const businesses = await UserService.getUserBusinesses(user.id);
    const userBusiness = businesses.find(b => b.business_id === businessId);

    if (!userBusiness) {
      return res.status(400).json({ error: 'Business not owned' });
    }

    // Calculate upgrade cost
    const businessConfig = BUSINESS_CONFIG[businessId];
    const upgradeCost = Math.floor(businessConfig.baseCost * Math.pow(1.5, userBusiness.level));

    // Check if user has enough points
    if (user.points < upgradeCost) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    // Upgrade business
    await UserService.updatePoints(user.id, -upgradeCost);
    await UserService.updateBusinessLevel(user.id, businessId, userBusiness.level + 1);

    // Record action
    await UserService.recordAction(user.id, 'business_upgrades', 1);

    // Get updated data
    const updatedUser = await UserService.findByTelegramId(req.user.id);
    const updatedBusinesses = await UserService.getUserBusinesses(user.id);

    res.json({
      points: updatedUser.points,
      businesses: updatedBusinesses,
      upgraded: {
        id: businessId,
        newLevel: userBusiness.level + 1,
        cost: upgradeCost
      }
    });

  } catch (error) {
    logger.error('Error upgrading business:', error);
    res.status(500).json({ error: 'Failed to upgrade business' });
  }
});

// Collect business income
router.post('/business/collect', async (req, res) => {
  try {
    const { businessId } = req.body;

    const user = await UserService.findByTelegramId(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user businesses
    const businesses = await UserService.getUserBusinesses(user.id);
    const userBusiness = businesses.find(b => b.business_id === businessId);

    if (!userBusiness) {
      return res.status(400).json({ error: 'Business not owned' });
    }

    // Calculate income based on time elapsed
    const now = new Date();
    const lastCollected = new Date(userBusiness.last_collected);
    const hoursElapsed = Math.min((now - lastCollected) / (1000 * 60 * 60), 24); // Max 24 hours

    const businessConfig = BUSINESS_CONFIG[businessId];
    const income = Math.floor(businessConfig.baseIncome * userBusiness.level * hoursElapsed);

    if (income <= 0) {
      return res.status(400).json({ error: 'No income to collect' });
    }

    // Update user points and business
    await UserService.updatePoints(user.id, income);

    // Update business last collected time
    await UserService.updateBusinessLevel(user.id, businessId, userBusiness.level);

    // Get updated data
    const updatedUser = await UserService.findByTelegramId(req.user.id);

    res.json({
      points: updatedUser.points,
      collected: income,
      business: {
        id: businessId,
        level: userBusiness.level,
        lastCollected: now
      }
    });

  } catch (error) {
    logger.error('Error collecting business income:', error);
    res.status(500).json({ error: 'Failed to collect income' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    // Try to get from cache first
    const cacheKey = `leaderboard:${limit}`;
    let leaderboard = await redisUtils.get(cacheKey);

    if (!leaderboard) {
      leaderboard = await UserService.getLeaderboard(parseInt(limit));
      // Cache for 5 minutes
      await redisUtils.setex(cacheKey, 300, leaderboard);
    }

    res.json({ leaderboard });
  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get daily stats
router.get('/stats/daily', async (req, res) => {
  try {
    const user = await UserService.findByTelegramId(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const dailyStats = await UserService.getDailyStats(user.id);

    res.json({
      stats: dailyStats,
      limits: DAILY_LIMITS
    });
  } catch (error) {
    logger.error('Error fetching daily stats:', error);
    res.status(500).json({ error: 'Failed to fetch daily stats' });
  }
});

module.exports = router; 