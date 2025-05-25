const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Validates Telegram Mini App init data
 * @param {string} initData - The init data from Telegram
 * @param {string} botToken - Bot token for validation
 * @returns {boolean} - True if valid
 */
function validateTelegramData(initData, botToken) {
  if (!initData || !botToken) return false;

  try {
    const encoded = decodeURIComponent(initData);
    const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken);
    const arr = encoded.split('&');
    const hashIndex = arr.findIndex(str => str.startsWith('hash='));

    if (hashIndex === -1) return false;

    const hash = arr[hashIndex].split('=')[1];
    arr.splice(hashIndex, 1);
    const dataCheckString = arr.sort().join('\n');

    const secretKey = secret.digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return hmac === hash;
  } catch (error) {
    logger.error('Telegram data validation error:', error);
    return false;
  }
}

/**
 * Extract user data from Telegram init data
 */
function extractUserData(initData) {
  try {
    const params = new URLSearchParams(initData);
    const userParam = params.get('user');

    if (!userParam) return null;

    const user = JSON.parse(userParam);
    const authDate = params.get('auth_date');
    const startParam = params.get('start_param');

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      languageCode: user.language_code,
      authDate: authDate ? parseInt(authDate) : null,
      startParam,
      isPremium: user.is_premium || false
    };
  } catch (error) {
    logger.error('User data extraction error:', error);
    return null;
  }
}

/**
 * Middleware to validate Telegram data and extract user info
 */
const validateTelegramDataMiddleware = async (req, res, next) => {
  const initData = req.headers['x-telegram-init-data'] || req.body.initData;

  if (!initData) {
    return res.status(401).json({ error: 'Missing Telegram init data' });
  }

  // For development, skip validation if NODE_ENV is development
  if (process.env.NODE_ENV === 'development') {
    logger.warn('Skipping Telegram validation in development mode');
    req.user = {
      id: 12345,
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      languageCode: 'en'
    };
    return next();
  }

  const isValid = validateTelegramData(initData, process.env.TELEGRAM_BOT_TOKEN);

  if (!isValid) {
    logger.warn('Invalid Telegram data received');
    return res.status(401).json({ error: 'Invalid Telegram data' });
  }

  // Check auth date (data should not be older than 24 hours)
  const userData = extractUserData(initData);
  if (!userData) {
    return res.status(401).json({ error: 'Failed to extract user data' });
  }

  const now = Math.floor(Date.now() / 1000);
  const authAge = now - (userData.authDate || 0);

  if (authAge > 86400) { // 24 hours
    return res.status(401).json({ error: 'Authentication data expired' });
  }

  req.user = userData;
  next();
};

/**
 * Generate JWT token for user
 */
function generateUserToken(userData) {
  return jwt.sign(
    {
      userId: userData.id,
      username: userData.username,
      firstName: userData.firstName
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify JWT token
 */
function verifyUserToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error('JWT verification error:', error);
    return null;
  }
}

module.exports = {
  validateTelegramData: validateTelegramDataMiddleware,
  extractUserData,
  generateUserToken,
  verifyUserToken
}; 