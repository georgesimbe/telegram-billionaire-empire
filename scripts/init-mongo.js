// MongoDB initialization script for local development
db = db.getSiblingDB('billionaire-sim-beta');

// Create collections with initial indexes
db.createCollection('users');

// Add indexes for performance
db.users.createIndex({ telegramId: 1 }, { unique: true });
db.users.createIndex({ referralCode: 1 }, { unique: true, sparse: true });
db.users.createIndex({ points: -1 });
db.users.createIndex({ level: -1 });
db.users.createIndex({ lastActive: -1 });

// Insert test user for development
db.users.insertOne({
  telegramId: 12345,
  firstName: "Test",
  lastName: "User",
  username: "testuser",
  languageCode: "en",
  isPremium: false,
  points: 1000,
  level: 1,
  experience: 0,
  totalEarned: 1000,
  clickPower: 1,
  businesses: [],
  investments: [],
  dailyStats: [],
  lastDailyReset: new Date(),
  referralCode: "REF12345TEST",
  referralCount: 0,
  referralEarnings: 0,
  suspiciousActivity: {
    clickViolations: 0,
    rapidActions: 0,
    isBanned: false
  },
  tonWallet: {
    isConnected: false,
    totalWithdrawn: 0
  },
  vipStatus: {
    isActive: false
  },
  achievements: [],
  settings: {
    notifications: true,
    soundEffects: true,
    autoCollect: false,
    language: "en"
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  lastActive: new Date()
});

print('Database initialized with test data for local development'); 