const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
require('dotenv').config();

const logger = require('./utils/logger');
const { validateTelegramData } = require('./middleware/auth');
const { testConnection } = require('./config/supabase');
const { redis, testRedisConnection } = require('./config/redis');

// Import routes
const gameRoutes = require('./routes/game');
// Temporarily disable routes that use Mongoose models
// const walletRoutes = require('./routes/wallet');
// const socialRoutes = require('./routes/social');
// const botRoutes = require('./routes/bot');

const app = express();
const PORT = process.env.PORT || 3000;

// Test database and cache connections
const initializeConnections = async () => {
  try {
    // Test Supabase connection (skip in development if not configured)
    const supabaseConnected = await testConnection();
    if (!supabaseConnected && process.env.NODE_ENV !== 'development') {
      logger.error('Failed to connect to Supabase');
      process.exit(1);
    }

    // Test Redis connection
    const redisConnected = await testRedisConnection();
    if (!redisConnected) {
      logger.warn('Redis connection failed - rate limiting will use memory store');
    }

    logger.info('✅ All connections initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize connections:', error);
    if (process.env.NODE_ENV !== 'development') {
      process.exit(1);
    }
  }
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable for development
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-telegram-init-data']
}));

// Rate limiting with Redis store (fallback to memory if Redis unavailable)
const createRateLimiter = () => {
  const baseConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Generous limit for development
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health'
  };

  try {
    // Try to use Redis store
    return rateLimit({
      ...baseConfig,
      store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
      })
    });
  } catch (error) {
    logger.warn('Using memory store for rate limiting (Redis unavailable)');
    return rateLimit(baseConfig);
  }
};

const limiter = createRateLimiter();

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes with authentication middleware
app.use('/api/game', validateTelegramData, gameRoutes);
// Temporarily disable routes that use Mongoose models
// app.use('/api/wallet', validateTelegramData, walletRoutes);
// app.use('/api/social', validateTelegramData, socialRoutes);
// app.use('/api/bot', botRoutes); // Bot routes don't need user auth

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Billionaire Empire API',
    version: '1.0.0',
    status: 'running',
    docs: '/health'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  try {
    await redis.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  try {
    await redis.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
  }
  process.exit(0);
});

// Start server
const startServer = async () => {
  await initializeConnections();

  app.listen(PORT, () => {
    logger.info(`🚀 Billionaire Empire API server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
  });
};

startServer().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});