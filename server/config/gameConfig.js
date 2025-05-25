// Game configuration for the backend
const GAME_CONFIG = {
  // Level progression
  EXPERIENCE_PER_LEVEL: 1000,
  MAX_LEVEL: 100,

  // Click mechanics
  BASE_CLICK_POWER: 1,
  CLICK_POWER_PER_LEVEL: 0.5,

  // Daily limits
  DAILY_LIMITS: {
    clicks: 10000,
    businessUpgrades: 50,
    adsWatched: 20,
    trades: 100
  },

  // VIP bonuses
  VIP_MULTIPLIERS: {
    points: 2,
    income: 1.5,
    clickPower: 2
  },

  // Referral system
  REFERRAL: {
    BONUS_PERCENTAGE: 0.1, // 10% of referred user's earnings
    SIGNUP_BONUS: 1000,
    MAX_REFERRALS_PER_DAY: 10
  },

  // Society system
  SOCIETY: {
    MIN_MEMBERS: 5,
    MAX_MEMBERS: 50,
    CREATION_COST: 10000,
    DAILY_BONUS_PERCENTAGE: 0.05
  },

  // Investment system
  INVESTMENTS: {
    MIN_AMOUNT: 100,
    MAX_AMOUNT: 1000000,
    RISK_LEVELS: {
      low: { minReturn: -0.05, maxReturn: 0.15 },
      medium: { minReturn: -0.15, maxReturn: 0.30 },
      high: { minReturn: -0.30, maxReturn: 0.60 }
    }
  },

  // Achievement thresholds
  ACHIEVEMENTS: {
    FIRST_BUSINESS: { type: 'business_count', threshold: 1 },
    BUSINESS_MOGUL: { type: 'business_count', threshold: 10 },
    MILLIONAIRE: { type: 'total_points', threshold: 1000000 },
    LEVEL_10: { type: 'level', threshold: 10 },
    LEVEL_50: { type: 'level', threshold: 50 },
    TAP_MASTER: { type: 'total_taps', threshold: 100000 },
    REFERRAL_KING: { type: 'referral_count', threshold: 100 }
  },

  // Cache settings
  CACHE_TTL: {
    USER_DATA: 300, // 5 minutes
    LEADERBOARD: 60, // 1 minute
    BUSINESS_DATA: 3600 // 1 hour
  },

  // Rate limiting
  RATE_LIMITS: {
    GENERAL: { windowMs: 15 * 60 * 1000, max: 1000 }, // 1000 requests per 15 minutes
    TAP: { windowMs: 60 * 1000, max: 100 }, // 100 taps per minute
    BUSINESS: { windowMs: 60 * 1000, max: 20 } // 20 business actions per minute
  }
};

// Calculate level from experience
const calculateLevel = (experience) => {
  return Math.min(
    Math.floor(experience / GAME_CONFIG.EXPERIENCE_PER_LEVEL) + 1,
    GAME_CONFIG.MAX_LEVEL
  );
};

// Calculate click power based on level
const calculateClickPower = (level) => {
  return Math.floor(GAME_CONFIG.BASE_CLICK_POWER + (level - 1) * GAME_CONFIG.CLICK_POWER_PER_LEVEL);
};

// Calculate experience needed for next level
const experienceToNextLevel = (currentExperience) => {
  const currentLevel = calculateLevel(currentExperience);
  const nextLevelExp = currentLevel * GAME_CONFIG.EXPERIENCE_PER_LEVEL;
  return nextLevelExp - currentExperience;
};

// Check if user can perform action based on daily limits
const canPerformAction = (actionType, currentCount) => {
  const limit = GAME_CONFIG.DAILY_LIMITS[actionType];
  return limit ? currentCount < limit : true;
};

module.exports = {
  GAME_CONFIG,
  calculateLevel,
  calculateClickPower,
  experienceToNextLevel,
  canPerformAction
}; 