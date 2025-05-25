const express = require('express');
const User = require('../models/User');
const logger = require('../utils/logger');

const router = express.Router();

// Get referral information
router.get('/referral', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get referred users
    const referredUsers = await User.find({ referredBy: req.user.id })
      .select('firstName username createdAt points level')
      .sort({ createdAt: -1 })
      .limit(50);

    const referralStats = {
      code: user.referralCode,
      count: user.referralCount,
      earnings: user.referralEarnings,
      referredUsers: referredUsers.map(refUser => ({
        name: refUser.firstName,
        username: refUser.username,
        joinedAt: refUser.createdAt,
        points: refUser.points,
        level: refUser.level
      }))
    };

    res.json(referralStats);

  } catch (error) {
    logger.error('Error fetching referral info:', error);
    res.status(500).json({ error: 'Failed to fetch referral information' });
  }
});

// Apply referral code
router.post('/referral/apply', async (req, res) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({ error: 'Referral code required' });
    }

    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user already used a referral code
    if (user.referredBy) {
      return res.status(400).json({ error: 'Referral code already applied' });
    }

    // Find referrer by code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(400).json({ error: 'Invalid referral code' });
    }

    // Can't refer yourself
    if (referrer.telegramId === req.user.id) {
      return res.status(400).json({ error: 'Cannot use your own referral code' });
    }

    // Apply referral
    const referralBonus = 1000; // Bonus points for both referrer and referee

    user.referredBy = referrer.telegramId;
    user.points += referralBonus;

    referrer.referralCount += 1;
    referrer.referralEarnings += referralBonus;
    referrer.points += referralBonus;

    await user.save();
    await referrer.save();

    logger.info(`Referral applied: ${req.user.id} referred by ${referrer.telegramId}`);

    res.json({
      success: true,
      bonus: referralBonus,
      referrer: {
        name: referrer.firstName,
        username: referrer.username
      },
      newPoints: user.points
    });

  } catch (error) {
    logger.error('Error applying referral code:', error);
    res.status(500).json({ error: 'Failed to apply referral code' });
  }
});

// Get social stats
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's rank
    const higherRankedCount = await User.countDocuments({
      points: { $gt: user.points }
    });
    const userRank = higherRankedCount + 1;

    // Get total active users (logged in within 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsersCount = await User.countDocuments({
      lastActive: { $gte: weekAgo }
    });

    // Get achievement progress
    const achievements = calculateAchievements(user);

    res.json({
      rank: userRank,
      totalUsers: activeUsersCount,
      achievements,
      socialStats: {
        referrals: user.referralCount,
        referralEarnings: user.referralEarnings,
        societyMember: !!user.society,
        societyRole: user.society?.role
      }
    });

  } catch (error) {
    logger.error('Error fetching social stats:', error);
    res.status(500).json({ error: 'Failed to fetch social stats' });
  }
});

// Share achievement
router.post('/share', async (req, res) => {
  try {
    const { achievementId, platform } = req.body;

    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify user has this achievement
    const hasAchievement = user.achievements.some(a => a.id === achievementId);
    if (!hasAchievement) {
      return res.status(400).json({ error: 'Achievement not unlocked' });
    }

    // Generate share content
    const shareContent = generateShareContent(user, achievementId);

    // Award bonus points for sharing
    const shareBonus = 100;
    user.points += shareBonus;
    await user.save();

    res.json({
      success: true,
      shareContent,
      bonus: shareBonus,
      newPoints: user.points
    });

  } catch (error) {
    logger.error('Error sharing achievement:', error);
    res.status(500).json({ error: 'Failed to share achievement' });
  }
});

// Get friends list (users who joined via referral)
router.get('/friends', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const friends = await User.find({ referredBy: req.user.id })
      .select('firstName username points level lastActive createdAt')
      .sort({ lastActive: -1 });

    const friendsData = friends.map(friend => ({
      name: friend.firstName,
      username: friend.username,
      points: friend.points,
      level: friend.level,
      isOnline: (Date.now() - friend.lastActive) < 5 * 60 * 1000, // Online within 5 minutes
      joinedAt: friend.createdAt
    }));

    res.json(friendsData);

  } catch (error) {
    logger.error('Error fetching friends list:', error);
    res.status(500).json({ error: 'Failed to fetch friends list' });
  }
});

// Helper function to calculate achievements
function calculateAchievements(user) {
  const achievements = [
    {
      id: 'first_click',
      name: 'First Click',
      description: 'Make your first tap',
      unlocked: user.totalEarned > 0,
      progress: user.totalEarned > 0 ? 1 : 0,
      target: 1
    },
    {
      id: 'points_1k',
      name: 'Thousandaire',
      description: 'Earn 1,000 points',
      unlocked: user.totalEarned >= 1000,
      progress: Math.min(user.totalEarned, 1000),
      target: 1000
    },
    {
      id: 'points_10k',
      name: 'Ten Thousandaire',
      description: 'Earn 10,000 points',
      unlocked: user.totalEarned >= 10000,
      progress: Math.min(user.totalEarned, 10000),
      target: 10000
    },
    {
      id: 'level_5',
      name: 'Rising Star',
      description: 'Reach level 5',
      unlocked: user.level >= 5,
      progress: Math.min(user.level, 5),
      target: 5
    },
    {
      id: 'business_owner',
      name: 'Business Owner',
      description: 'Own your first business',
      unlocked: user.businesses.length > 0,
      progress: user.businesses.length > 0 ? 1 : 0,
      target: 1
    },
    {
      id: 'referral_master',
      name: 'Referral Master',
      description: 'Refer 10 friends',
      unlocked: user.referralCount >= 10,
      progress: Math.min(user.referralCount, 10),
      target: 10
    }
  ];

  return achievements;
}

// Helper function to generate share content
function generateShareContent(user, achievementId) {
  const achievementNames = {
    'first_click': 'made their first click',
    'points_1k': 'became a Thousandaire',
    'points_10k': 'became a Ten Thousandaire',
    'level_5': 'reached level 5',
    'business_owner': 'became a business owner',
    'referral_master': 'became a referral master'
  };

  const achievement = achievementNames[achievementId] || 'unlocked an achievement';

  return {
    text: `🎉 ${user.firstName} just ${achievement} in Billionaire Empire! 💰\n\nJoin me and start your empire: ${process.env.MINI_APP_URL}?ref=${user.referralCode}`,
    url: `${process.env.MINI_APP_URL}?ref=${user.referralCode}`,
    hashtags: ['BillionaireEmpire', 'TON', 'TelegramGame']
  };
}

module.exports = router; 