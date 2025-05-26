import { ACHIEVEMENT_REWARDS, EconomicSimulator } from '../../config/economicSimulationConfig.js';

/**
 * Achievements Store Module
 * Manages achievements, statistics, and reward systems
 */
export const createAchievementsStore = (set, get) => ({
  // Achievements State
  achievements: [],
  statistics: {
    totalDaysPlayed: 0,
    totalMoneyEarned: 0,
    businessesOwned: 0,
    relationshipsFormed: 0,
    jobsHeld: 0,
    educationCompleted: [],
    stakingDays: 0,
    proposalsVoted: 0,
    achievementsUnlocked: 0,
    totalTONEarned: 0,
    highestNetWorth: 0,
    businessesSold: 0,
    loansRepaid: 0,
    skillsLearned: 0,
    housesOwned: 0,
    lastUpdated: new Date(),
  },

  // Achievement Actions
  addAchievement: (achievement) => set((state) => ({
    achievements: [...state.achievements, { ...achievement, unlockedAt: new Date() }],
    statistics: {
      ...state.statistics,
      achievementsUnlocked: state.statistics.achievementsUnlocked + 1
    }
  })),

  updateStatistics: (updates) => set((state) => ({
    statistics: {
      ...state.statistics,
      ...updates,
      lastUpdated: new Date()
    }
  })),

  /**
   * Check and award achievements based on current game state
   */
  checkAndAwardAchievements: () => {
    const state = get();
    const newAchievements = [];
    let tonRewards = 0;

    // Business Achievements
    if (state.businesses?.length >= 1 && !hasAchievement(state, 'FIRST_BUSINESS')) {
      const achievement = createAchievement('FIRST_BUSINESS', ACHIEVEMENT_REWARDS.FIRST_BUSINESS);
      newAchievements.push(achievement);
      tonRewards += ACHIEVEMENT_REWARDS.FIRST_BUSINESS.ton_reward;
    }

    if (state.businesses?.length >= 5 && !hasAchievement(state, 'BUSINESS_PORTFOLIO')) {
      const achievement = createAchievement('BUSINESS_PORTFOLIO', {
        title: 'Business Portfolio',
        description: 'Own 5 different businesses',
        ton_reward: 50,
        category: 'business'
      });
      newAchievements.push(achievement);
      tonRewards += 50;
    }

    if (state.businesses?.length >= 10 && !hasAchievement(state, 'BUSINESS_EMPIRE')) {
      const achievement = createAchievement('BUSINESS_EMPIRE', ACHIEVEMENT_REWARDS.BUSINESS_EMPIRE);
      newAchievements.push(achievement);
      tonRewards += ACHIEVEMENT_REWARDS.BUSINESS_EMPIRE.ton_reward;
    }

    // Wealth Achievements
    const totalWealth = calculateTotalWealth(state);

    if (totalWealth >= 100000 && !hasAchievement(state, 'HUNDRED_K')) {
      const achievement = createAchievement('HUNDRED_K', {
        title: 'Six Figures',
        description: 'Reach $100,000 net worth',
        ton_reward: 25,
        category: 'wealth'
      });
      newAchievements.push(achievement);
      tonRewards += 25;
    }

    if (totalWealth >= 1000000 && !hasAchievement(state, 'MILLIONAIRE')) {
      const achievement = createAchievement('MILLIONAIRE', ACHIEVEMENT_REWARDS.MILLIONAIRE);
      newAchievements.push(achievement);
      tonRewards += ACHIEVEMENT_REWARDS.MILLIONAIRE.ton_reward;
    }

    if (totalWealth >= 10000000 && !hasAchievement(state, 'MULTI_MILLIONAIRE')) {
      const achievement = createAchievement('MULTI_MILLIONAIRE', {
        title: 'Multi-Millionaire',
        description: 'Reach $10 million net worth',
        ton_reward: 500,
        category: 'wealth'
      });
      newAchievements.push(achievement);
      tonRewards += 500;
    }

    // Staking Achievements
    const totalStakingDays = Object.values(state.staking?.stakingTenure || {}).reduce((sum, days) => sum + days, 0);

    if (totalStakingDays >= 30 && !hasAchievement(state, 'STAKING_MONTH')) {
      const achievement = createAchievement('STAKING_MONTH', {
        title: 'Staking Commitment',
        description: 'Stake tokens for 30 days total',
        ton_reward: 20,
        category: 'staking'
      });
      newAchievements.push(achievement);
      tonRewards += 20;
    }

    if (totalStakingDays >= 100 && !hasAchievement(state, 'STAKING_VETERAN')) {
      const achievement = createAchievement('STAKING_VETERAN', ACHIEVEMENT_REWARDS.STAKING_VETERAN);
      newAchievements.push(achievement);
      tonRewards += ACHIEVEMENT_REWARDS.STAKING_VETERAN.ton_reward;
    }

    // Career Achievements
    if (state.statistics?.jobsHeld >= 5 && !hasAchievement(state, 'JOB_HOPPER')) {
      const achievement = createAchievement('JOB_HOPPER', {
        title: 'Job Hopper',
        description: 'Hold 5 different jobs',
        ton_reward: 30,
        category: 'career'
      });
      newAchievements.push(achievement);
      tonRewards += 30;
    }

    // Education Achievements
    if (state.career?.education === 'university' && !hasAchievement(state, 'COLLEGE_GRADUATE')) {
      const achievement = createAchievement('COLLEGE_GRADUATE', {
        title: 'College Graduate',
        description: 'Complete university education',
        ton_reward: 40,
        category: 'education'
      });
      newAchievements.push(achievement);
      tonRewards += 40;
    }

    // Social Achievements
    if (state.relationships?.length >= 10 && !hasAchievement(state, 'SOCIAL_BUTTERFLY')) {
      const achievement = createAchievement('SOCIAL_BUTTERFLY', {
        title: 'Social Butterfly',
        description: 'Build 10 relationships',
        ton_reward: 35,
        category: 'social'
      });
      newAchievements.push(achievement);
      tonRewards += 35;
    }

    // Housing Achievements
    if (state.housing?.currentHousing === 'mansion' && !hasAchievement(state, 'MANSION_OWNER')) {
      const achievement = createAchievement('MANSION_OWNER', {
        title: 'Mansion Owner',
        description: 'Own a luxury mansion',
        ton_reward: 100,
        category: 'housing'
      });
      newAchievements.push(achievement);
      tonRewards += 100;
    }

    // Governance Achievements
    if (state.statistics?.proposalsVoted >= 10 && !hasAchievement(state, 'ACTIVE_VOTER')) {
      const achievement = createAchievement('ACTIVE_VOTER', {
        title: 'Active Voter',
        description: 'Vote on 10 governance proposals',
        ton_reward: 25,
        category: 'governance'
      });
      newAchievements.push(achievement);
      tonRewards += 25;
    }

    // Time-based Achievements
    if (state.statistics?.totalDaysPlayed >= 30 && !hasAchievement(state, 'MONTH_PLAYER')) {
      const achievement = createAchievement('MONTH_PLAYER', {
        title: 'Dedicated Player',
        description: 'Play for 30 days',
        ton_reward: 50,
        category: 'time'
      });
      newAchievements.push(achievement);
      tonRewards += 50;
    }

    // Apply achievements and rewards
    if (newAchievements.length > 0) {
      set((state) => ({
        achievements: [...state.achievements, ...newAchievements],
        staking: {
          ...state.staking,
          tonBalance: (state.staking?.tonBalance || 0) + tonRewards
        },
        statistics: {
          ...state.statistics,
          achievementsUnlocked: state.statistics.achievementsUnlocked + newAchievements.length,
          totalTONEarned: state.statistics.totalTONEarned + tonRewards
        }
      }));

      return { newAchievements, tonRewards };
    }

    return { newAchievements: [], tonRewards: 0 };
  },

  /**
   * Get achievement statistics and progress
   */
  getAchievementStats: () => {
    const state = get();
    const totalAchievements = Object.keys(ACHIEVEMENT_REWARDS).length + 15; // Estimated total
    const unlockedAchievements = state.achievements.length;
    const completionRate = (unlockedAchievements / totalAchievements) * 100;

    const achievementsByCategory = state.achievements.reduce((acc, achievement) => {
      const category = achievement.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const totalTONFromAchievements = state.achievements.reduce((sum, achievement) =>
      sum + (achievement.ton_reward || 0), 0
    );

    const recentAchievements = state.achievements
      .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
      .slice(0, 5);

    return {
      totalAchievements,
      unlockedAchievements,
      completionRate: Math.round(completionRate),
      achievementsByCategory,
      totalTONFromAchievements,
      recentAchievements,
      nextMilestones: getNextMilestones(state)
    };
  },

  /**
   * Get detailed statistics
   */
  getDetailedStatistics: () => {
    const state = get();
    const { statistics } = state;

    // Calculate derived statistics
    const averageDailyEarnings = statistics.totalDaysPlayed > 0
      ? statistics.totalMoneyEarned / statistics.totalDaysPlayed
      : 0;

    const businessSuccessRate = statistics.businessesOwned > 0
      ? ((statistics.businessesOwned - statistics.businessesSold) / statistics.businessesOwned) * 100
      : 0;

    const currentNetWorth = calculateTotalWealth(state);
    const wealthGrowthRate = statistics.totalDaysPlayed > 0
      ? (currentNetWorth / statistics.totalDaysPlayed)
      : 0;

    return {
      ...statistics,
      derived: {
        averageDailyEarnings: Math.round(averageDailyEarnings),
        businessSuccessRate: Math.round(businessSuccessRate),
        currentNetWorth,
        wealthGrowthRate: Math.round(wealthGrowthRate),
        stakingEfficiency: calculateStakingEfficiency(state),
        socialNetworkSize: state.relationships?.length || 0,
        careerProgression: calculateCareerProgression(state),
        educationLevel: getEducationLevel(state)
      }
    };
  },

  /**
   * Update specific statistic counters
   */
  incrementStatistic: (statName, amount = 1) => set((state) => ({
    statistics: {
      ...state.statistics,
      [statName]: (state.statistics[statName] || 0) + amount,
      lastUpdated: new Date()
    }
  })),

  /**
   * Record a major milestone
   */
  recordMilestone: (milestone) => set((state) => ({
    statistics: {
      ...state.statistics,
      milestones: [
        ...(state.statistics.milestones || []),
        {
          ...milestone,
          timestamp: new Date(),
          id: Date.now()
        }
      ]
    }
  })),

  /**
   * Get achievement progress for specific categories
   */
  getAchievementProgress: (category) => {
    const state = get();
    const categoryAchievements = state.achievements.filter(a => a.category === category);

    // Define progress thresholds for different categories
    const progressThresholds = {
      business: [1, 5, 10, 25, 50],
      wealth: [10000, 100000, 1000000, 10000000, 100000000],
      staking: [7, 30, 100, 365, 1000],
      career: [1, 3, 5, 10, 20],
      social: [3, 10, 25, 50, 100]
    };

    const thresholds = progressThresholds[category] || [];
    const currentValue = getCurrentValueForCategory(state, category);

    return {
      category,
      currentValue,
      thresholds,
      completed: categoryAchievements.length,
      nextThreshold: thresholds.find(t => t > currentValue),
      progress: calculateCategoryProgress(currentValue, thresholds)
    };
  }
});

// Helper functions
function hasAchievement(state, achievementId) {
  return state.achievements?.some(a => a.id === achievementId) || false;
}

function createAchievement(id, config) {
  return {
    id,
    title: config.title,
    description: config.description,
    ton_reward: config.ton_reward || 0,
    category: config.category || 'general',
    unlockedAt: new Date(),
    rarity: config.rarity || 'common'
  };
}

function calculateTotalWealth(state) {
  const playerCash = state.player?.cash || 0;
  const businessValue = (state.businesses || []).reduce((sum, b) => sum + (b.value || 0), 0);
  const stakingValue = state.staking?.totalStaked || 0;
  const bankingAssets = (state.banking?.accounts || []).reduce((sum, acc) => sum + acc.balance, 0);

  return playerCash + businessValue + stakingValue + bankingAssets;
}

function getNextMilestones(state) {
  const milestones = [];

  // Business milestones
  const businessCount = state.businesses?.length || 0;
  if (businessCount < 5) milestones.push({ type: 'business', target: 5, current: businessCount });
  else if (businessCount < 10) milestones.push({ type: 'business', target: 10, current: businessCount });

  // Wealth milestones
  const wealth = calculateTotalWealth(state);
  if (wealth < 100000) milestones.push({ type: 'wealth', target: 100000, current: wealth });
  else if (wealth < 1000000) milestones.push({ type: 'wealth', target: 1000000, current: wealth });

  // Staking milestones
  const stakingDays = Object.values(state.staking?.stakingTenure || {}).reduce((sum, days) => sum + days, 0);
  if (stakingDays < 30) milestones.push({ type: 'staking', target: 30, current: stakingDays });
  else if (stakingDays < 100) milestones.push({ type: 'staking', target: 100, current: stakingDays });

  return milestones.slice(0, 3); // Return top 3 next milestones
}

function calculateStakingEfficiency(state) {
  const totalStaked = state.staking?.totalStaked || 0;
  const totalRewards = state.staking?.claimedRewards || 0;

  return totalStaked > 0 ? (totalRewards / totalStaked) * 100 : 0;
}

function calculateCareerProgression(state) {
  const jobLevels = {
    'retail_worker': 1,
    'office_assistant': 2,
    'sales_representative': 3,
    'project_manager': 4,
    'senior_manager': 5,
    'director': 6,
    'vice_president': 7,
    'ceo': 8
  };

  const currentJob = state.career?.currentJob?.id || 'retail_worker';
  return jobLevels[currentJob] || 1;
}

function getEducationLevel(state) {
  const educationLevels = {
    'high_school': 1,
    'community_college': 2,
    'university': 3,
    'masters': 4,
    'phd': 5
  };

  const education = state.career?.education || 'high_school';
  return educationLevels[education] || 1;
}

function getCurrentValueForCategory(state, category) {
  switch (category) {
    case 'business':
      return state.businesses?.length || 0;
    case 'wealth':
      return calculateTotalWealth(state);
    case 'staking':
      return Object.values(state.staking?.stakingTenure || {}).reduce((sum, days) => sum + days, 0);
    case 'career':
      return state.statistics?.jobsHeld || 0;
    case 'social':
      return state.relationships?.length || 0;
    default:
      return 0;
  }
}

function calculateCategoryProgress(currentValue, thresholds) {
  if (thresholds.length === 0) return 0;

  const completedThresholds = thresholds.filter(t => currentValue >= t).length;
  return (completedThresholds / thresholds.length) * 100;
} 