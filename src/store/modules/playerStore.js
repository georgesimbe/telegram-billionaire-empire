import { GAME_CONFIG } from '../../config/gameConfig.js';

/**
 * Player Store Module
 * Manages core player stats, financial operations, and progression
 */
export const createPlayerStore = (set, get) => ({
  // Player State
  player: {
    id: null,
    username: '',
    cash: 5000,
    monthlyIncome: 0,
    creditScore: 650,
    happiness: 70,
    health: 80,
    energy: 80,
    stress: 20,
    experience: 0,
    level: 1,
    totalEarned: 0,
    lastLogin: new Date(),
    createdAt: new Date(),
    initialized: false,
    dailyActionsRemaining: 10,
    lastDailyReset: new Date(),
    lifetimeStats: {
      totalMoneySpent: 0,
      totalBusinessesBought: 0,
      totalJobsHeld: 0,
      totalEducationCompleted: 0,
      totalRelationshipsFormed: 0,
      totalAchievementsUnlocked: 0
    }
  },

  // Player Actions
  updatePlayer: (updates) => set((state) => ({
    player: { ...state.player, ...updates }
  })),

  /**
   * Initialize player with starting data
   */
  initializePlayer: (playerData = {}) => set((state) => ({
    player: {
      ...state.player,
      ...playerData,
      initialized: true,
      lastLogin: new Date(),
      id: playerData.id || Date.now().toString()
    }
  })),

  /**
   * Reset daily actions and apply daily bonuses
   */
  resetDailyActions: () => set((state) => {
    const now = new Date();
    const lastReset = new Date(state.player.lastDailyReset);
    const timeDiff = now.getTime() - lastReset.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysDiff >= 1) {
      return {
        player: {
          ...state.player,
          dailyActionsRemaining: GAME_CONFIG?.dailyActions || 10,
          lastDailyReset: now,
          // Daily stat recovery
          energy: Math.min(100, state.player.energy + 20),
          happiness: Math.min(100, state.player.happiness + 5),
          stress: Math.max(0, state.player.stress - 10)
        }
      };
    }

    return state;
  }),

  /**
   * Add income to player's cash and track earnings
   */
  addIncome: (amount, source = 'unknown') => set((state) => {
    const newCash = state.player.cash + amount;
    const newTotalEarned = state.player.totalEarned + amount;

    // Calculate experience gain (1 XP per $100 earned)
    const experienceGain = Math.floor(amount / 100);
    const newExperience = state.player.experience + experienceGain;

    // Level up calculation (every 1000 XP = 1 level)
    const newLevel = Math.floor(newExperience / 1000) + 1;
    const leveledUp = newLevel > state.player.level;

    return {
      player: {
        ...state.player,
        cash: newCash,
        totalEarned: newTotalEarned,
        experience: newExperience,
        level: newLevel,
        // Bonus stats on level up
        ...(leveledUp && {
          happiness: Math.min(100, state.player.happiness + 10),
          energy: Math.min(100, state.player.energy + 15)
        })
      }
    };
  }),

  /**
   * Spend money if player has enough cash
   */
  spendMoney: (amount, category = 'unknown') => set((state) => {
    if (state.player.cash >= amount) {
      return {
        player: {
          ...state.player,
          cash: state.player.cash - amount,
          lifetimeStats: {
            ...state.player.lifetimeStats,
            totalMoneySpent: state.player.lifetimeStats.totalMoneySpent + amount
          }
        }
      };
    }
    return state; // Not enough money
  }),

  /**
   * Update player stats (happiness, health, energy, stress)
   */
  updatePlayerStats: (statChanges) => set((state) => {
    const updatedStats = {};

    Object.entries(statChanges).forEach(([stat, change]) => {
      const currentValue = state.player[stat] || 0;
      const newValue = Math.max(0, Math.min(100, currentValue + change));
      updatedStats[stat] = newValue;
    });

    return {
      player: {
        ...state.player,
        ...updatedStats
      }
    };
  }),

  /**
   * Update monthly income (called when job or business income changes)
   */
  updateMonthlyIncome: (newIncome) => set((state) => ({
    player: {
      ...state.player,
      monthlyIncome: newIncome
    }
  })),

  /**
   * Update credit score based on financial behavior
   */
  updateCreditScore: (change, reason) => set((state) => {
    const newScore = Math.max(300, Math.min(850, state.player.creditScore + change));

    return {
      player: {
        ...state.player,
        creditScore: newScore
      }
    };
  }),

  /**
   * Process daily stat changes (aging, natural recovery, etc.)
   */
  processDailyStatChanges: () => set((state) => {
    // Natural stat changes over time
    const statChanges = {
      energy: -5, // Energy decreases daily
      stress: Math.random() > 0.7 ? 2 : 0, // Random stress events
      happiness: state.player.cash > 1000 ? 1 : -1, // Money affects happiness
      health: state.player.stress > 80 ? -1 : 0 // High stress affects health
    };

    const updatedStats = {};
    Object.entries(statChanges).forEach(([stat, change]) => {
      const currentValue = state.player[stat] || 0;
      const newValue = Math.max(0, Math.min(100, currentValue + change));
      updatedStats[stat] = newValue;
    });

    return {
      player: {
        ...state.player,
        ...updatedStats
      }
    };
  }),

  /**
   * Get player financial summary
   */
  getPlayerFinancialSummary: () => {
    const state = get();
    const { player } = state;

    // Calculate net worth from all sources
    const businessValue = (state.businesses || []).reduce((sum, b) => sum + (b.value || 0), 0);
    const stakingValue = state.staking?.totalStaked || 0;
    const bankingAssets = (state.banking?.accounts || []).reduce((sum, acc) => sum + acc.balance, 0);
    const bankingDebts = (state.banking?.loans || []).reduce((sum, loan) => sum + (loan.remainingBalance || loan.amount), 0);

    const netWorth = player.cash + businessValue + stakingValue + bankingAssets - bankingDebts;

    return {
      cash: player.cash,
      monthlyIncome: player.monthlyIncome,
      totalEarned: player.totalEarned,
      netWorth,
      creditScore: player.creditScore,
      businessValue,
      stakingValue,
      bankingAssets,
      bankingDebts
    };
  },

  /**
   * Get player status and progression info
   */
  getPlayerStatus: () => {
    const state = get();
    const { player } = state;

    const experienceToNextLevel = 1000 - (player.experience % 1000);
    const levelProgress = ((player.experience % 1000) / 1000) * 100;

    // Determine player's life stage based on stats and achievements
    let lifeStage = 'struggling';
    if (player.cash > 100000) lifeStage = 'comfortable';
    if (player.cash > 1000000) lifeStage = 'wealthy';
    if (player.cash > 10000000) lifeStage = 'rich';
    if (player.cash > 100000000) lifeStage = 'ultra_rich';

    // Calculate overall wellbeing score
    const wellbeingScore = Math.round(
      (player.happiness + player.health + player.energy + (100 - player.stress)) / 4
    );

    return {
      level: player.level,
      experience: player.experience,
      experienceToNextLevel,
      levelProgress: Math.round(levelProgress),
      lifeStage,
      wellbeingScore,
      stats: {
        happiness: player.happiness,
        health: player.health,
        energy: player.energy,
        stress: player.stress
      },
      dailyActionsRemaining: player.dailyActionsRemaining,
      lastLogin: player.lastLogin,
      accountAge: Math.floor((new Date() - new Date(player.createdAt)) / (1000 * 60 * 60 * 24))
    };
  },

  /**
   * Update lifetime statistics
   */
  updateLifetimeStats: (statUpdates) => set((state) => ({
    player: {
      ...state.player,
      lifetimeStats: {
        ...state.player.lifetimeStats,
        ...statUpdates
      }
    }
  })),

  /**
   * Check if player can afford a purchase
   */
  canAfford: (amount) => {
    const state = get();
    return state.player.cash >= amount;
  },

  /**
   * Get player's economic class based on wealth
   */
  getEconomicClass: () => {
    const state = get();
    const financialSummary = get().getPlayerFinancialSummary();
    const netWorth = financialSummary.netWorth;

    if (netWorth < 0) return { class: 'debt', tier: 1, description: 'In Debt' };
    if (netWorth < 10000) return { class: 'working', tier: 1, description: 'Working Class' };
    if (netWorth < 50000) return { class: 'working', tier: 2, description: 'Stable Working Class' };
    if (netWorth < 100000) return { class: 'middle', tier: 1, description: 'Lower Middle Class' };
    if (netWorth < 500000) return { class: 'middle', tier: 2, description: 'Middle Class' };
    if (netWorth < 1000000) return { class: 'middle', tier: 3, description: 'Upper Middle Class' };
    if (netWorth < 5000000) return { class: 'upper', tier: 1, description: 'Affluent' };
    if (netWorth < 10000000) return { class: 'upper', tier: 2, description: 'Wealthy' };
    if (netWorth < 50000000) return { class: 'upper', tier: 3, description: 'Very Wealthy' };
    if (netWorth < 100000000) return { class: 'elite', tier: 1, description: 'Ultra Wealthy' };
    return { class: 'elite', tier: 2, description: 'Billionaire' };
  }
});
