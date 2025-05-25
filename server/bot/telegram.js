const TelegramBot = require('node-telegram-bot-api');
const { OpenAI } = require('openai');
const User = require('../models/User');
const logger = require('../utils/logger');
const { GAME_TIPS, STRATEGIES } = require('./knowledge');

// Initialize bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Initialize OpenAI (for advanced responses)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Game knowledge base
const GAME_KNOWLEDGE = {
  basics: {
    'how to play': 'Tap to earn points, buy businesses for passive income, invest wisely, and convert points to TON! Start with the lemonade stand and work your way up.',
    'what is ton': 'TON is The Open Network cryptocurrency. You can convert your game points to real TON tokens at a rate of 10,000 points = 1 TON.',
    'how to earn': 'There are many ways to earn: 1) Tap the coin 2) Collect from businesses 3) Watch ads 4) Invite friends 5) Smart investments 6) Daily bonuses',
    'businesses': 'Businesses generate passive income. Start small with a lemonade stand, then upgrade to food trucks, online stores, and eventually tech startups!',
    'investments': 'Invest in stocks (medium risk), crypto (high risk), or real estate (low risk). Buy low, sell high! Market prices update every 5 seconds.',
  },
  
  strategies: {
    'early game': 'Focus on tapping and buying your first business. Save up for the food truck - it has great ROI. Watch ads for bonus points!',
    'mid game': 'Diversify with 3-4 businesses. Start investing small amounts. Join a clan for 10% bonus on all earnings.',
    'late game': 'Focus on high-level businesses and market timing. Convert points to TON when you have 50k+ points.',
    'best business': 'Each business has its purpose. Lemonade stands are great for beginners, but tech startups have the highest revenue at max level.',
    'investment tips': 'Never invest more than 30% in one asset. Crypto is volatile but profitable. Real estate is stable. Stocks are balanced.',
  },
  
  secrets: {
    'hidden features': "I shouldn't tell you everything... but have you tried tapping exactly at midnight? 😉",
    'max earnings': 'The theoretical max is around 1M points/day with all businesses maxed and perfect investment timing. But that takes months!',
    'clan benefits': 'Clans give 10% bonus, but the real benefit is clan wars coming next update... prepare your empire!',
  },
  
  warnings: {
    'cheating': "Don't even think about it! Our anti-cheat system is watching. Suspicious activity = banned account = lost points.",
    'scams': 'NEVER share your wallet seed phrase! Official withdrawals only happen through the app. Report scammers immediately.',
  }
};

// Response templates with personality
const RESPONSES = {
  greeting: [
    "Welcome to Billionaire Empire! 🏰 Ready to build your fortune?",
    "Hey there, future tycoon! 💰 What can I help you with?",
    "Another entrepreneur! 🚀 Let me share some wisdom...",
  ],
  
  help: [
    "I can help with strategies, tips, and answer questions! But I won't make it too easy... 😏",
    "Need guidance? I know all the secrets... well, most of them! What do you want to know?",
    "Lost? Don't worry, every billionaire started somewhere. What's confusing you?",
  ],
  
  vague: [
    "Hmm, I could tell you more... but where's the fun in that? Try it yourself first! 🤔",
    "That's a good question! I'll give you a hint: think like a real businessman...",
    "Interesting... I know the answer, but discovering it yourself is half the fun! Here's a clue:",
  ],
  
  encouragement: [
    "Keep going! Rome wasn't built in a day, and neither are billion-dollar empires! 💪",
    "You're doing great! Remember, every tap counts towards your fortune! 🎯",
    "That's the spirit! Smart investors always ask questions. 🧠",
  ]
};

// AI-powered response generator for complex questions
async function generateSmartResponse(question, userId) {
  try {
    // First, check if we have a pre-defined answer
    const lowerQuestion = question.toLowerCase();
    
    // Check exact matches in knowledge base
    for (const [category, answers] of Object.entries(GAME_KNOWLEDGE)) {
      for (const [key, answer] of Object.entries(answers)) {
        if (lowerQuestion.includes(key)) {
          return answer;
        }
      }
    }
    
    // For complex questions, use AI but with constraints
    if (process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful but slightly mysterious game assistant for Billionaire Empire, a Telegram mini-game. 
            Give helpful tips but don't reveal everything. Be encouraging but make players work for success. 
            Keep responses under 100 words. Don't give exact formulas or exploits.
            If asked about cheating or hacks, firmly discourage it.`
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });
      
      return completion.choices[0].message.content;
    }
    
    // Fallback to template response
    return RESPONSES.vague[Math.floor(Math.random() * RESPONSES.vague.length)] + 
           " Try exploring the game more!";
           
  } catch (error) {
    logger.error('AI response error:', error);
    return "I'm having trouble thinking right now... Try asking something simpler!";
  }
}

// Command handlers
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const referralCode = match[1];
  
  try {
    // Check if user exists
    let user = await User.findOne({ telegramId: userId });
    
    if (!user) {
      // Create new user
      user = new User({
        telegramId: userId,
        username: msg.from.username || msg.from.first_name,
        referredBy: referralCode
      });
      await user.save();
      
      // Credit referrer
      if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer) {
          referrer.referrals.push(userId);
          referrer.points += 500; // Referral bonus
          await referrer.save();
        }
      }
    }
    
    const greeting = RESPONSES.greeting[Math.floor(Math.random() * RESPONSES.greeting.length)];
    
    const keyboard = {
      inline_keyboard: [
        [{ text: '🎮 Play Game', web_app: { url: process.env.MINI_APP_URL } }],
        [{ text: '❓ How to Play', callback_data: 'help' }],
        [{ text: '💡 Get Tips', callback_data: 'tips' }]
      ]
    };
    
    bot.sendMessage(chatId, `${greeting}\n\nYour referral code: ${user.referralCode}`, {
      reply_markup: keyboard
    });
    
  } catch (error) {
    logger.error('Start command error:', error);
    bot.sendMessage(chatId, 'Oops! Something went wrong. Try again later.');
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `
🎮 **Billionaire Empire - Quick Guide**

**Basic Commands:**
/start - Start the bot
/help - Show this help
/tips - Get gameplay tips
/stats - Your statistics
/leaderboard - Top players

**How to Play:**
1. Tap to earn points
2. Buy businesses for passive income
3. Make smart investments
4. Convert points to TON

**Ask me anything about the game!**
Example: "How do I earn more points?"
  `;
  
  bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

bot.onText(/\/tips/, (msg) => {
  const chatId = msg.chat.id;
  const tips = [
    "💡 **Today's Tip:** Always claim your daily bonus! It increases with consecutive days.",
    "💡 **Business Tip:** The food truck has the best ROI for beginners.",
    "💡 **Investment Tip:** Diversify! Never put all your money in one asset.",
    "💡 **Social Tip:** Join a clan for 10% bonus on ALL earnings!",
    "💡 **Secret Tip:** Some say tapping at certain times gives bonus points... 🤫"
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  bot.sendMessage(chatId, randomTip, { parse_mode: 'Markdown' });
});

bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  try {
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      bot.sendMessage(chatId, 'Please /start the game first!');
      return;
    }
    
    const stats = `
📊 **Your Statistics**

💰 Points: ${user.points.toLocaleString()}
📈 Level: ${user.level}
🏢 Businesses: ${user.businesses.length}
👥 Referrals: ${user.referrals.length}
🏆 Rank: ${user.rank || 'Unranked'}

Keep grinding! 💪
    `;
    
    bot.sendMessage(chatId, stats, { parse_mode: 'Markdown' });
  } catch (error) {
    logger.error('Stats error:', error);
    bot.sendMessage(chatId, 'Could not fetch stats. Try again later!');
  }
});

// Handle inline button callbacks
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;
  
  if (data === 'help') {
    bot.sendMessage(msg.chat.id, RESPONSES.help[Math.floor(Math.random() * RESPONSES.help.length)]);
  } else if (data === 'tips') {
    const tip = GAME_TIPS[Math.floor(Math.random() * GAME_TIPS.length)];
    bot.sendMessage(msg.chat.id, `💡 ${tip}`);
  }
  
  bot.answerCallbackQuery(callbackQuery.id);
});

// Handle regular messages (questions)
bot.on('message', async (msg) => {
  // Skip if it's a command
  if (msg.text?.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const question = msg.text;
  
  if (!question) return;
  
  try {
    // Generate response
    const response = await generateSmartResponse(question, userId);
    
    // Add some personality
    const encouragement = Math.random() > 0.7 
      ? '\n\n' + RESPONSES.encouragement[Math.floor(Math.random() * RESPONSES.encouragement.length)]
      : '';
    
    bot.sendMessage(chatId, response + encouragement);
    
    // Log for analytics
    logger.info(`Question from ${userId}: ${question}`);
    
  } catch (error) {
    logger.error('Message handling error:', error);
    bot.sendMessage(chatId, "That's a tough one! Try asking something else or check /help");
  }
});

// Error handling
bot.on('polling_error', (error) => {
  logger.error('Polling error:', error);
});

function startBot() {
  logger.info('Telegram bot started successfully');
}

module.exports = { bot, startBot };