// Essential Security Configuration - Optimized for MVP
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMITS: {
    CLICKS_PER_SECOND: 10,
    DAILY_ACTIONS: {
      AD_WATCHES: 20,
      TRADES: 100, 
      BUSINESS_CLAIMS: 500
    }
  },

  // Basic anti-cheat thresholds
  ANTI_CHEAT: {
    MAX_CLICK_RATE: 15, // clicks per second
    SUSPICIOUS_THRESHOLD: 5, // violations before flag
    BAN_THRESHOLD: 10 // violations before ban
  },

  // Device tracking
  DEVICE_TRACKING: {
    FINGERPRINT_ENABLED: true,
    TRACK_PATTERNS: true,
    STORE_DURATION: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};

// Security calculator utilities
export class SecurityCalculator {
  static calculateDailyLimit(baseLimit, playerLevel, societyTier = 'NONE') {
    let multiplier = 1;
    
    // Level scaling
    if (playerLevel >= 50) multiplier += 0.5;
    else if (playerLevel >= 25) multiplier += 0.3;
    else if (playerLevel >= 10) multiplier += 0.2;
    
    // Society bonuses
    const societyMultipliers = {
      BRONZE: 1.1,
      SILVER: 1.2, 
      GOLD: 1.3,
      PLATINUM: 1.5
    };
    
    if (societyMultipliers[societyTier]) {
      multiplier *= societyMultipliers[societyTier];
    }
    
    return Math.floor(baseLimit * multiplier);
  }

  static calculateRiskScore(violations) {
    return violations.reduce((score, violation) => {
      const weights = {
        CLICK_SPAM: 3,
        DEV_TOOLS: 5,
        AUTOMATION: 8,
        MULTI_ACCOUNT: 10
      };
      return score + (weights[violation.type] || 1);
    }, 0);
  }
}

export default SECURITY_CONFIG;