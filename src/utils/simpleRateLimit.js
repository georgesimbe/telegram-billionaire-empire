// Simple Rate Limiting for MVP - Replace Complex Anti-Cheat
class SimpleRateLimit {
  constructor() {
    this.clickCounts = new Map(); // userId -> { count, lastReset }
    this.maxClicksPerSecond = 10;
    this.resetInterval = 1000; // 1 second
  }

  checkClickRate(userId = 'default') {
    const now = Date.now();
    const userStats = this.clickCounts.get(userId) || { count: 0, lastReset: now };

    // Reset counter if interval passed
    if (now - userStats.lastReset >= this.resetInterval) {
      userStats.count = 0;
      userStats.lastReset = now;
    }

    // Check if under limit
    if (userStats.count >= this.maxClicksPerSecond) {
      return { allowed: false, reason: 'Too many clicks per second' };
    }

    // Increment counter
    userStats.count++;
    this.clickCounts.set(userId, userStats);

    return { allowed: true };
  }

  // Simple daily limits
  checkDailyLimit(userId = 'default', actionType) {
    const dailyLimits = {
      AD_WATCHES: 20,
      TRADES: 100,
      BUSINESS_CLAIMS: 500
    };

    const limit = dailyLimits[actionType];
    if (!limit) return { allowed: true };

    // In MVP, we'll use localStorage for simplicity
    const today = new Date().toDateString();
    const key = `${userId}_${actionType}_${today}`;
    const currentCount = parseInt(localStorage.getItem(key) || '0');

    if (currentCount >= limit) {
      return { allowed: false, reason: `Daily limit reached for ${actionType}` };
    }

    localStorage.setItem(key, (currentCount + 1).toString());
    return { allowed: true };
  }

  // Basic logging for debugging
  logAction(actionType, metadata = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[RateLimit] ${actionType}:`, metadata);
    }
  }
}

export const simpleRateLimit = new SimpleRateLimit();
export default simpleRateLimit;