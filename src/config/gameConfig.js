export const GAME_CONFIG = {
  // Starting values
  STARTING_POINTS: 100,
  STARTING_CASH: 1000,
  
  // Token economics
  POINTS_TO_TON_RATE: 10000, // 10,000 points = 1 TON
  MIN_WITHDRAWAL: 50000, // Minimum 50k points to withdraw
  WITHDRAWAL_FEE: 0.05, // 5% withdrawal fee
  
  // Anti-spam mechanisms
  COOLDOWNS: {
    DAILY_BONUS: 24 * 60 * 60 * 1000, // 24 hours
    AD_WATCH: 5 * 60 * 1000, // 5 minutes
    BUSINESS_CLAIM: 60 * 1000, // 1 minute
    INVESTMENT_ACTION: 30 * 1000, // 30 seconds
  },
  
  // Daily limits to prevent abuse
  DAILY_LIMITS: {
    AD_WATCHES: 20,
    FRIEND_INVITES: 10,
    BUSINESS_UPGRADES: 50,
    TRADES: 100,
  },
  
  // Progression system
  LEVELS: {
    XP_PER_LEVEL: 1000,
    XP_SCALING: 1.2, // Each level requires 20% more XP
  },
  
  // Business types adapted for mobile/casual play
  BUSINESSES: [
    {
      id: 'lemonade_stand',
      name: 'Lemonade Stand',
      cost: 100,
      baseRevenue: 10,
      cooldown: 60, // 1 minute
      maxLevel: 10,
      requiredSociety: null,
    },
    {
      id: 'food_truck',
      name: 'Food Truck',
      cost: 1000,
      baseRevenue: 50,
      cooldown: 300, // 5 minutes
      maxLevel: 15,
      unlockLevel: 5,
      requiredSociety: null,
    },
    {
      id: 'online_store',
      name: 'Online Store',
      cost: 5000,
      baseRevenue: 200,
      cooldown: 600, // 10 minutes
      maxLevel: 20,
      unlockLevel: 10,
      requiredSociety: 'BRONZE',
    },
    {
      id: 'tech_startup',
      name: 'Tech Startup',
      cost: 25000,
      baseRevenue: 1000,
      cooldown: 1800, // 30 minutes
      maxLevel: 25,
      unlockLevel: 20,
      requiredSociety: 'SILVER',
    },
    {
      id: 'crypto_exchange',
      name: 'Crypto Exchange',
      cost: 100000,
      baseRevenue: 5000,
      cooldown: 3600, // 1 hour
      maxLevel: 30,
      unlockLevel: 30,
      requiredSociety: 'GOLD',
    },
    {
      id: 'oil_empire',
      name: 'Oil Empire',
      cost: 10000000,
      baseRevenue: 50000,
      cooldown: 7200, // 2 hours
      maxLevel: 50,
      unlockLevel: 50,
      requiredSociety: 'PLATINUM',
      requiredAssets: {
        realEstate: 5,
        businesses: 10,
      }
    },
    {
      id: 'bank',
      name: 'International Bank',
      cost: 50000000,
      baseRevenue: 200000,
      cooldown: 10800, // 3 hours
      maxLevel: 75,
      unlockLevel: 75,
      requiredSociety: 'PLATINUM',
      requiredAssets: {
        cash: 100000000,
        creditScore: 800,
      }
    },
    {
      id: 'space_station',
      name: 'Space Station',
      cost: 100000000, // 100M points = ~$100k real value at scale
      baseRevenue: 1000000,
      cooldown: 14400, // 4 hours
      maxLevel: 100,
      unlockLevel: 100,
      requiredSociety: 'DIAMOND',
      requiredAssets: {
        techStartup: true,
        businesses: 20,
        totalNetWorth: 1000000000,
      }
    }
  ],
  
  // Social features
  SOCIAL: {
    REFERRAL_BONUS: 500, // Points for inviting a friend
    REFERRAL_PERCENTAGE: 0.05, // 5% of friend's earnings
    CLAN_BONUS: 0.1, // 10% bonus when in a clan
    CLAN_SIZE_LIMIT: 50,
  },
  
  // Ad rewards
  AD_REWARDS: {
    BASE_REWARD: 50,
    BONUS_MULTIPLIER: 2, // 2x rewards for watching full ad
    JACKPOT_CHANCE: 0.01, // 1% chance for jackpot (10x reward)
  },
  
  // Security measures
  SECURITY: {
    MAX_CLICKS_PER_SECOND: 10,
    SUSPICIOUS_ACTIVITY_THRESHOLD: 100, // Actions per minute
    BAN_DURATION: 24 * 60 * 60 * 1000, // 24 hour ban
    REQUIRE_CAPTCHA_AFTER: 50, // Actions
  },
  
  // TON integration
  TON: {
    NETWORK: 'mainnet',
    MIN_STARS_PURCHASE: 10,
    STARS_TO_POINTS: 100, // 1 Star = 100 points
    TRANSACTION_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  }
};