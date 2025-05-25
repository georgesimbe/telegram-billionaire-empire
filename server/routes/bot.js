const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

// Webhook endpoint for Telegram bot
router.post('/webhook', (req, res) => {
  try {
    const update = req.body;

    // Telegram sends updates to this endpoint
    // For MVP, we'll just log them and respond OK
    logger.info('Telegram webhook received:', JSON.stringify(update, null, 2));

    // Handle different types of updates
    if (update.message) {
      handleMessage(update.message);
    } else if (update.callback_query) {
      handleCallbackQuery(update.callback_query);
    } else if (update.inline_query) {
      handleInlineQuery(update.inline_query);
    }

    res.status(200).json({ ok: true });

  } catch (error) {
    logger.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Health check for bot
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    bot: 'active',
    timestamp: new Date().toISOString()
  });
});

// Set webhook URL (for deployment setup)
router.post('/set-webhook', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Webhook URL required' });
    }

    // This would typically call Telegram API to set webhook
    // For MVP, we'll just return success
    logger.info(`Webhook URL set to: ${url}`);

    res.json({
      success: true,
      webhook_url: url
    });

  } catch (error) {
    logger.error('Error setting webhook:', error);
    res.status(500).json({ error: 'Failed to set webhook' });
  }
});

// Handle text messages
function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;
  const user = message.from;

  logger.info(`Message from ${user.first_name} (${user.id}): ${text}`);

  // Handle commands
  if (text?.startsWith('/')) {
    handleCommand(chatId, text, user);
  }
}

// Handle bot commands
function handleCommand(chatId, command, user) {
  switch (command) {
    case '/start':
      handleStartCommand(chatId, user);
      break;
    case '/help':
      handleHelpCommand(chatId);
      break;
    case '/stats':
      handleStatsCommand(chatId, user);
      break;
    default:
      logger.info(`Unknown command: ${command}`);
  }
}

// Handle /start command
function handleStartCommand(chatId, user) {
  logger.info(`Start command from user ${user.id}`);

  // In a real implementation, this would:
  // 1. Send welcome message with game button
  // 2. Check for referral parameters
  // 3. Create user record if new
}

// Handle /help command
function handleHelpCommand(chatId) {
  logger.info(`Help command for chat ${chatId}`);

  // Send help message with game instructions
}

// Handle /stats command
function handleStatsCommand(chatId, user) {
  logger.info(`Stats command from user ${user.id}`);

  // Fetch and send user stats
}

// Handle callback queries (button presses)
function handleCallbackQuery(callbackQuery) {
  const data = callbackQuery.data;
  const user = callbackQuery.from;

  logger.info(`Callback query from ${user.first_name}: ${data}`);

  // Handle different callback data
  switch (data) {
    case 'play_game':
      // Open mini app
      break;
    case 'invite_friends':
      // Show referral info
      break;
    default:
      logger.info(`Unknown callback query: ${data}`);
  }
}

// Handle inline queries
function handleInlineQuery(inlineQuery) {
  const query = inlineQuery.query;
  const user = inlineQuery.from;

  logger.info(`Inline query from ${user.first_name}: ${query}`);

  // Handle inline queries for sharing/inviting
}

module.exports = router; 