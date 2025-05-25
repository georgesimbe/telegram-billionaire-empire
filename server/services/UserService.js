const { supabaseAdmin } = require('../config/supabase');
const { redisUtils } = require('../config/redis');
const logger = require('../utils/logger');

class UserService {
  constructor() {
    this.tableName = 'users';
  }

  // Generate unique referral code
  generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Find user by Telegram ID
  async findByTelegramId(telegramId) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error finding user by Telegram ID:', error);
      return null;
    }
  }

  // Create new user
  async createUser(userData) {
    try {
      const referralCode = this.generateReferralCode();

      const newUser = {
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

      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .insert([newUser])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Handle referral bonus
      if (userData.referredBy) {
        await this.processReferralBonus(userData.referredBy, data.id);
      }

      logger.info(`New user created: ${userData.firstName} (${userData.id})`);
      return data;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  // Process referral bonus
  async processReferralBonus(referrerTelegramId, newUserId) {
    try {
      const referrer = await this.findByTelegramId(referrerTelegramId);
      if (!referrer) return;

      const bonusPoints = 500;

      const { error } = await supabaseAdmin
        .from(this.tableName)
        .update({
          referral_count: referrer.referral_count + 1,
          referral_earnings: referrer.referral_earnings + bonusPoints,
          points: referrer.points + bonusPoints,
          total_earned: referrer.total_earned + bonusPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', referrer.id);

      if (error) {
        throw error;
      }

      logger.info(`Referral bonus processed: ${bonusPoints} points to user ${referrerTelegramId}`);
    } catch (error) {
      logger.error('Error processing referral bonus:', error);
    }
  }

  // Update user points
  async updatePoints(userId, pointsToAdd) {
    try {
      // Get current user data
      const { data: user, error: fetchError } = await supabaseAdmin
        .from(this.tableName)
        .select('points, total_earned, level, experience')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const newPoints = user.points + pointsToAdd;
      const newTotalEarned = user.total_earned + pointsToAdd;
      const newExperience = user.experience + pointsToAdd;

      // Calculate new level (every 1000 XP = 1 level)
      const newLevel = Math.floor(newExperience / 1000) + 1;

      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .update({
          points: newPoints,
          total_earned: newTotalEarned,
          experience: newExperience,
          level: newLevel,
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error updating user points:', error);
      throw error;
    }
  }

  // Get user's daily stats
  async getDailyStats(userId, date = null) {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];

      const { data, error } = await supabaseAdmin
        .from('daily_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('date', targetDate)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {
        user_id: userId,
        date: targetDate,
        clicks: 0,
        ads_watched: 0,
        business_upgrades: 0,
        trades: 0,
        points_earned: 0
      };
    } catch (error) {
      logger.error('Error getting daily stats:', error);
      return null;
    }
  }

  // Record user action for daily limits
  async recordAction(userId, actionType, count = 1) {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Try to update existing record
      const { data: existing } = await supabaseAdmin
        .from('daily_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (existing) {
        // Update existing record
        const updateData = {
          [actionType]: existing[actionType] + count,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabaseAdmin
          .from('daily_stats')
          .update(updateData)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new record
        const newRecord = {
          user_id: userId,
          date: today,
          clicks: actionType === 'clicks' ? count : 0,
          ads_watched: actionType === 'ads_watched' ? count : 0,
          business_upgrades: actionType === 'business_upgrades' ? count : 0,
          trades: actionType === 'trades' ? count : 0,
          points_earned: actionType === 'points_earned' ? count : 0
        };

        const { error } = await supabaseAdmin
          .from('daily_stats')
          .insert([newRecord]);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      logger.error('Error recording action:', error);
      return false;
    }
  }

  // Check if user can perform action (daily limits)
  async canPerformAction(userId, actionType, limit) {
    try {
      const dailyStats = await this.getDailyStats(userId);
      const currentCount = dailyStats[actionType] || 0;

      return currentCount < limit;
    } catch (error) {
      logger.error('Error checking action limit:', error);
      return false;
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 100) {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select('first_name, username, points, level')
        .order('points', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // Update user's last active timestamp
  async updateLastActive(userId) {
    try {
      const { error } = await supabaseAdmin
        .from(this.tableName)
        .update({
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      logger.error('Error updating last active:', error);
      return false;
    }
  }

  // Get user businesses
  async getUserBusinesses(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('businesses')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting user businesses:', error);
      return [];
    }
  }

  // Update business level
  async updateBusinessLevel(userId, businessId, newLevel) {
    try {
      // Check if business exists
      const { data: existing } = await supabaseAdmin
        .from('businesses')
        .select('*')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .single();

      if (existing) {
        // Update existing business
        const { data, error } = await supabaseAdmin
          .from('businesses')
          .update({
            level: newLevel,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new business
        const { data, error } = await supabaseAdmin
          .from('businesses')
          .insert([{
            user_id: userId,
            business_id: businessId,
            level: newLevel
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      logger.error('Error updating business level:', error);
      throw error;
    }
  }

  // Cache user data in Redis
  async cacheUser(user) {
    try {
      const cacheKey = `user:${user.telegram_id}`;
      await redisUtils.setex(cacheKey, 300, user); // Cache for 5 minutes
    } catch (error) {
      logger.error('Error caching user:', error);
    }
  }

  // Get user from cache
  async getCachedUser(telegramId) {
    try {
      const cacheKey = `user:${telegramId}`;
      return await redisUtils.get(cacheKey);
    } catch (error) {
      logger.error('Error getting cached user:', error);
      return null;
    }
  }
}

module.exports = new UserService(); 