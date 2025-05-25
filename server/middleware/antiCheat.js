const Redis = require('ioredis');
const logger = require('../utils/logger');
const { GAME_CONFIG } = require('../../src/config/gameConfig');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

const antiCheat = async (req, res, next) => {
  const userId = req.user.id;
  const action = req.body.action || req.path;
  const timestamp = Date.now();
  
  try {
    // Check if user is banned
    const banKey = `ban:${userId}`;
    const isBanned = await redis.get(banKey);
    if (isBanned) {
      return res.status(403).json({ 
        error: 'Account suspended for suspicious activity',
        banExpires: isBanned
      });
    }

    // Track action frequency
    const actionKey = `actions:${userId}:${action}`;
    const actionCount = await redis.incr(actionKey);
    await redis.expire(actionKey, 60); // Reset every minute

    // Check for rapid actions
    if (actionCount > GAME_CONFIG.SECURITY.SUSPICIOUS_ACTIVITY_THRESHOLD) {
      // Ban user for suspicious activity
      await redis.setex(banKey, GAME_CONFIG.SECURITY.BAN_DURATION / 1000, timestamp + GAME_CONFIG.SECURITY.BAN_DURATION);
      
      logger.warn(`User ${userId} banned for suspicious activity: ${action}`);
      
      return res.status(403).json({ 
        error: 'Suspicious activity detected. Account temporarily suspended.' 
      });
    }

    // Check cooldowns
    const cooldownKey = `cooldown:${userId}:${action}`;
    const lastAction = await redis.get(cooldownKey);
    
    if (lastAction) {
      const cooldown = GAME_CONFIG.COOLDOWNS[action] || 0;
      const timePassed = timestamp - parseInt(lastAction);
      
      if (timePassed < cooldown) {
        return res.status(429).json({ 
          error: 'Action on cooldown',
          remainingTime: cooldown - timePassed
        });
      }
    }

    // Set cooldown
    await redis.set(cooldownKey, timestamp);
    await redis.expire(cooldownKey, 3600); // Expire after 1 hour

    // Check for pattern-based cheating
    const patterns = await detectCheatingPatterns(userId);
    if (patterns.suspicious) {
      logger.warn(`Suspicious patterns detected for user ${userId}:`, patterns);
      
      // Increase suspicion level
      await redis.incr(`suspicion:${userId}`);
      
      // Add CAPTCHA requirement if needed
      if (patterns.score > 50) {
        req.requireCaptcha = true;
      }
    }

    // Validate game state consistency
    if (req.body.gameState) {
      const isValid = await validateGameState(userId, req.body.gameState);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid game state' });
      }
    }

    next();
  } catch (error) {
    logger.error('Anti-cheat error:', error);
    next(error);
  }
};

async function detectCheatingPatterns(userId) {
  const patterns = {
    suspicious: false,
    score: 0,
    reasons: []
  };

  // Check click patterns
  const clickPattern = await redis.lrange(`clicks:${userId}`, 0, -1);
  if (clickPattern.length > 10) {
    const intervals = [];
    for (let i = 1; i < clickPattern.length; i++) {
      intervals.push(parseInt(clickPattern[i]) - parseInt(clickPattern[i-1]));
    }
    
    // Check for inhuman consistency
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
    
    if (variance < 10) { // Too consistent
      patterns.suspicious = true;
      patterns.score += 30;
      patterns.reasons.push('Inhuman click consistency');
    }
  }

  // Check for impossible earnings
  const earningsKey = `earnings:${userId}:${new Date().toDateString()}`;
  const dailyEarnings = await redis.get(earningsKey) || 0;
  
  if (dailyEarnings > 1000000) { // Suspicious daily earnings
    patterns.suspicious = true;
    patterns.score += 40;
    patterns.reasons.push('Impossible earnings rate');
  }

  // Check for time manipulation
  const lastActive = await redis.get(`lastActive:${userId}`);
  if (lastActive) {
    const timeDiff = Date.now() - parseInt(lastActive);
    if (timeDiff < 0) { // Time went backwards
      patterns.suspicious = true;
      patterns.score += 50;
      patterns.reasons.push('Time manipulation detected');
    }
  }

  return patterns;
}

async function validateGameState(userId, gameState) {
  // Retrieve server-side state
  const serverState = await redis.get(`gameState:${userId}`);
  if (!serverState) return true; // First time

  const server = JSON.parse(serverState);
  
  // Validate points haven't increased suspiciously
  if (gameState.points > server.points + 10000) {
    return false;
  }

  // Validate cash hasn't increased without valid transaction
  if (gameState.cash > server.cash + 10000) {
    return false;
  }

  // Update server state
  await redis.set(`gameState:${userId}`, JSON.stringify(gameState));
  
  return true;
}

module.exports = antiCheat;