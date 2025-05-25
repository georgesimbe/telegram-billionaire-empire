const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  id: { type: String, required: true },
  level: { type: Number, default: 0 },
  lastCollected: { type: Date, default: Date.now },
  totalEarned: { type: Number, default: 0 }
});

const investmentSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'stock', 'crypto', 'realEstate'
  symbol: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  totalInvested: { type: Number, default: 0 },
  purchaseDate: { type: Date, default: Date.now }
});

const societyMembershipSchema = new mongoose.Schema({
  societyId: { type: String, required: true },
  role: { type: String, enum: ['member', 'officer', 'leader'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
  contributions: { type: Number, default: 0 }
});

const dailyStatsSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD format
  clicks: { type: Number, default: 0 },
  adsWatched: { type: Number, default: 0 },
  businessUpgrades: { type: Number, default: 0 },
  trades: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  // Telegram user data
  telegramId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  username: { type: String },
  languageCode: { type: String, default: 'en' },
  isPremium: { type: Boolean, default: false },

  // Game progress
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  clickPower: { type: Number, default: 1 },

  // Businesses owned
  businesses: [businessSchema],

  // Investments portfolio
  investments: [investmentSchema],

  // Society/clan membership
  society: societyMembershipSchema,

  // Daily activity tracking
  dailyStats: [dailyStatsSchema],
  lastDailyReset: { type: Date, default: Date.now },

  // Referral system
  referredBy: { type: Number }, // Telegram ID of referrer
  referralCode: { type: String, unique: true, sparse: true },
  referralCount: { type: Number, default: 0 },
  referralEarnings: { type: Number, default: 0 },

  // Anti-cheat tracking
  suspiciousActivity: {
    clickViolations: { type: Number, default: 0 },
    rapidActions: { type: Number, default: 0 },
    lastViolation: { type: Date },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String },
    banExpires: { type: Date }
  },

  // TON wallet integration
  tonWallet: {
    address: { type: String },
    isConnected: { type: Boolean, default: false },
    totalWithdrawn: { type: Number, default: 0 },
    lastWithdrawal: { type: Date }
  },

  // Premium features
  vipStatus: {
    isActive: { type: Boolean, default: false },
    expiresAt: { type: Date },
    type: { type: String, enum: ['basic', 'premium', 'elite'] }
  },

  // Achievements and milestones
  achievements: [{
    id: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }
  }],

  // Settings and preferences
  settings: {
    notifications: { type: Boolean, default: true },
    soundEffects: { type: Boolean, default: true },
    autoCollect: { type: Boolean, default: false },
    language: { type: String, default: 'en' }
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

// Indexes for performance
userSchema.index({ telegramId: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ 'society.societyId': 1 });
userSchema.index({ level: -1 });
userSchema.index({ points: -1 });
userSchema.index({ lastActive: -1 });

// Update timestamps on save
userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for current day stats
userSchema.virtual('todayStats').get(function () {
  const today = new Date().toISOString().split('T')[0];
  return this.dailyStats.find(stat => stat.date === today) || {
    date: today,
    clicks: 0,
    adsWatched: 0,
    businessUpgrades: 0,
    trades: 0,
    pointsEarned: 0
  };
});

// Method to check if user can perform action (anti-cheat)
userSchema.methods.canPerformAction = function (actionType, limit = null) {
  if (this.suspiciousActivity.isBanned) {
    if (this.suspiciousActivity.banExpires && this.suspiciousActivity.banExpires > new Date()) {
      return false;
    } else {
      // Unban user if ban has expired
      this.suspiciousActivity.isBanned = false;
      this.suspiciousActivity.banExpires = null;
    }
  }

  if (!limit) return true;

  const todayStats = this.todayStats;
  const currentCount = todayStats[actionType] || 0;

  return currentCount < limit;
};

// Method to record action for daily limits
userSchema.methods.recordAction = function (actionType, count = 1) {
  const today = new Date().toISOString().split('T')[0];
  let todayStats = this.dailyStats.find(stat => stat.date === today);

  if (!todayStats) {
    todayStats = { date: today, clicks: 0, adsWatched: 0, businessUpgrades: 0, trades: 0, pointsEarned: 0 };
    this.dailyStats.push(todayStats);
  }

  todayStats[actionType] = (todayStats[actionType] || 0) + count;

  // Keep only last 30 days of stats
  this.dailyStats = this.dailyStats
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);
};

module.exports = mongoose.model('User', userSchema); 