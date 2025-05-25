const Redis = require('ioredis');
const logger = require('../utils/logger');

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Use Redis URL if provided (for production)
if (process.env.REDIS_URL) {
  const redis = new Redis(process.env.REDIS_URL, {
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  module.exports = redis;
} else {
  // Create Redis client
  const redis = new Redis(redisConfig);
}

// Create Redis client
const redis = new Redis(process.env.REDIS_URL || redisConfig);

// Redis event handlers
redis.on('connect', () => {
  logger.info('✅ Redis connected successfully');
});

redis.on('ready', () => {
  logger.info('✅ Redis ready for operations');
});

redis.on('error', (error) => {
  logger.error('❌ Redis connection error:', error.message);
});

redis.on('close', () => {
  logger.warn('⚠️ Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('🔄 Redis reconnecting...');
});

// Test Redis connection
const testRedisConnection = async () => {
  try {
    await redis.ping();
    logger.info('✅ Redis ping successful');
    return true;
  } catch (error) {
    logger.error('❌ Redis ping failed:', error.message);
    return false;
  }
};

// Redis utility functions
const redisUtils = {
  // Set with expiration
  setex: async (key, seconds, value) => {
    try {
      return await redis.setex(key, seconds, JSON.stringify(value));
    } catch (error) {
      logger.error('Redis setex error:', error);
      return null;
    }
  },

  // Get and parse JSON
  get: async (key) => {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  },

  // Delete key
  del: async (key) => {
    try {
      return await redis.del(key);
    } catch (error) {
      logger.error('Redis del error:', error);
      return 0;
    }
  },

  // Increment counter
  incr: async (key) => {
    try {
      return await redis.incr(key);
    } catch (error) {
      logger.error('Redis incr error:', error);
      return 0;
    }
  },

  // Set expiration
  expire: async (key, seconds) => {
    try {
      return await redis.expire(key, seconds);
    } catch (error) {
      logger.error('Redis expire error:', error);
      return 0;
    }
  }
};

module.exports = {
  redis,
  redisUtils,
  testRedisConnection
}; 