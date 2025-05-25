const logger = require('../utils/logger');

// In-memory storage for development
const users = new Map();
const businesses = new Map();
const dailyStats = new Map();

class DevUserService {
  constructor() {
    this.tableName = 'users';
    // Create a default test user
    this.initTestUser();
  }

  initTestUser() {
    const testUser = {
      id: 'dev-user-12345',
      telegram_id: 12345,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      language_code: 'en',
      is_premium: false,
      points: 1000,
      level: 1,
      experience: 0,
      total_earned: 1000,
      click_power: 1,
      referral_code: 'TEST123',
      referral_count: 0,
      referral_earnings: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    };

    users.set(12345, testUser);
    logger.info('✅ Test user initialized for development');
  }

  generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async findByTelegramId(telegramId) {
    return users.get(telegramId) || null;
  }

  async createUser(userData) {
    const referralCode = this.generateReferralCode();

    const newUser = {
      id: `dev-user-${userData.id}`,
      telegram_id: userData.id,
      first_name: userData.firstName,
      last_name: userData.lastName || null,
      username: userData.username || null,
      language_code: userData.languageCode || 'en',
      is_premium: userData.isPremium || false,
      referral_code: referralCode,
      referred_by: userData.referredBy || null,
      points: 0,
      level: 1,
      experience: 0,
      total_earned: 0,
      click_power: 1,
      referral_count: 0,
      referral_earnings: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    };

    users.set(userData.id, newUser);
    logger.info(`New user created: ${userData.firstName} (${userData.id})`);
    return newUser;
  }

  async updatePoints(userId, pointsToAdd) {
    const user = Array.from(users.values()).find(u => u.id === userId || u.telegram_id === userId);
    if (!user) throw new Error('User not found');

    user.points += pointsToAdd;
    user.total_earned += pointsToAdd;
    user.experience += pointsToAdd;
    user.level = Math.floor(user.experience / 1000) + 1;
    user.click_power = Math.floor(user.level / 2) + 1;
    user.updated_at = new Date().toISOString();
    user.last_active = new Date().toISOString();

    return user;
  }

  async getDailyStats(userId, date = null) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const key = `${userId}-${targetDate}`;

    return dailyStats.get(key) || {
      user_id: userId,
      date: targetDate,
      clicks: 0,
      ads_watched: 0,
      business_upgrades: 0,
      trades: 0,
      points_earned: 0
    };
  }

  async recordAction(userId, actionType, count = 1) {
    const today = new Date().toISOString().split('T')[0];
    const key = `${userId}-${today}`;

    let stats = dailyStats.get(key) || {
      user_id: userId,
      date: today,
      clicks: 0,
      ads_watched: 0,
      business_upgrades: 0,
      trades: 0,
      points_earned: 0
    };

    stats[actionType] = (stats[actionType] || 0) + count;
    dailyStats.set(key, stats);
    return true;
  }

  async canPerformAction(userId, actionType, limit) {
    const dailyStats = await this.getDailyStats(userId);
    const currentCount = dailyStats[actionType] || 0;
    return currentCount < limit;
  }

  async getLeaderboard(limit = 100) {
    return Array.from(users.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map(user => ({
        first_name: user.first_name,
        username: user.username,
        points: user.points,
        level: user.level
      }));
  }

  async updateLastActive(userId) {
    const user = Array.from(users.values()).find(u => u.id === userId || u.telegram_id === userId);
    if (user) {
      user.last_active = new Date().toISOString();
      user.updated_at = new Date().toISOString();
    }
    return true;
  }

  async getUserBusinesses(userId) {
    return businesses.get(userId) || [];
  }

  async updateBusinessLevel(userId, businessId, newLevel) {
    let userBusinesses = businesses.get(userId) || [];

    const existingIndex = userBusinesses.findIndex(b => b.business_id === businessId);

    if (existingIndex >= 0) {
      userBusinesses[existingIndex].level = newLevel;
      userBusinesses[existingIndex].updated_at = new Date().toISOString();
    } else {
      userBusinesses.push({
        id: `biz-${Date.now()}`,
        user_id: userId,
        business_id: businessId,
        level: newLevel,
        last_collected: new Date().toISOString(),
        total_earned: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    businesses.set(userId, userBusinesses);
    return userBusinesses[existingIndex] || userBusinesses[userBusinesses.length - 1];
  }

  async cacheUser(user) {
    // In development, we don't need Redis caching
    return true;
  }

  async getCachedUser(telegramId) {
    // Return null to force database lookup
    return null;
  }
}

module.exports = new DevUserService(); 