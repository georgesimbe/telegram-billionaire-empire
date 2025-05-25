// Game tips and strategies for the bot to share
const GAME_TIPS = [
  // Beginner tips
  "Start with the lemonade stand - it has the best ROI for beginners!",
  "Don't forget to claim your daily bonus every day. The streak multiplier is powerful!",
  "Watch ads during 2x bonus events for maximum rewards.",
  "Join a clan as soon as possible for the 10% earning bonus.",
  "Save up 1000 points before making your first investment.",
  
  // Intermediate tips
  "Diversify your businesses - don't put all eggs in one basket.",
  "Crypto investments are volatile but can 10x during bull runs.",
  "Upgrade businesses to level 5 before buying new ones.",
  "Time your withdrawals - gas fees are lower during weekends.",
  "Complete daily quests for bonus XP and exclusive rewards.",
  
  // Advanced tips
  "The tech startup becomes profitable at level 15+ with good employees.",
  "Real estate provides stable passive income during market crashes.",
  "Stack multiple bonuses: clan + ad watch + daily streak = mega earnings!",
  "Tournament winners are usually active between 10 PM - 2 AM.",
  "The secret midnight bonus activates at exactly 00:00 your local time.",
  
  // Social tips
  "Active clan members share 5% of tournament winnings.",
  "Refer 10 friends to unlock the exclusive Gold Tier businesses.",
  "Top referrers get monthly TON airdrops!",
  "Form alliances in clan wars for strategic advantages.",
];

const STRATEGIES = {
  early_game: {
    day_1_3: "Focus on tapping and watching ads. Buy lemonade stand ASAP.",
    day_4_7: "Get food truck, start small investments in stocks.",
    week_2: "Join active clan, complete all daily quests, aim for level 10.",
  },
  
  mid_game: {
    businesses: "Maintain 3-4 businesses at level 10+. Quality over quantity.",
    investments: "30% stocks, 20% crypto, 50% cash reserve for opportunities.",
    social: "Be active in clan chat. Help newbies for karma points.",
  },
  
  late_game: {
    optimization: "Max out tech startup and crypto exchange for passive millions.",
    tournaments: "Save points during week, spend strategically on weekends.",
    withdrawals: "Convert at 100k+ points for better rates and lower fees.",
  },
  
  pro_tips: {
    hidden_mechanics: "Business synergies exist - tech startup + crypto exchange = 15% bonus.",
    market_timing: "Crypto pumps every Tuesday. Stocks dip on Mondays.",
    exploit_prevention: "Never use auto-clickers. AI detection = permanent ban.",
  }
};

const EASTER_EGGS = [
  "Tap exactly 777 times in one session for a surprise...",
  "Name your business 'TON MOON' for a hidden achievement.",
  "The dev team hides bonus codes in the Telegram channel weekly.",
  "Check the game at 4:20 for... interesting market movements.",
];

const FAQ = {
  "can't withdraw": "You need minimum 50,000 points and a connected TON wallet.",
  "lost progress": "Progress saves automatically. Check you're using the same Telegram account.",
  "business not earning": "Businesses have cooldowns. Upgrade to reduce wait time.",
  "banned account": "Contact support with your Telegram ID. Don't cheat next time!",
  "referral not working": "Friend must complete tutorial and reach level 5.",
  "clan full": "Clans have 50 member limit. Join a different one or create your own.",
  "market crash": "Markets are volatile! It's part of the game. Buy the dip!",
  "ton price": "Real TON price doesn't affect in-game conversion rate.",
};

module.exports = {
  GAME_TIPS,
  STRATEGIES,
  EASTER_EGGS,
  FAQ
};