import { calculateTotalDailyRewards } from '../../config/stakingConfig.js';
import { EconomicSimulator } from '../../config/economicSimulationConfig.js';

/**
 * Game Time Store Module
 * Manages time progression, daily/monthly cycles, and time-based events
 */
export const createGameTimeStore = (set, get) => ({
  // Game Time State
  gameTime: {
    currentDate: new Date(),
    daysPassed: 0,
    monthsPassed: 0,
    yearsPassed: 0,
    gameStartDate: new Date(),
    lastDailyReset: new Date(),
    lastMonthlyReset: new Date(),
    timeMultiplier: 1, // For fast-forward functionality
    isPaused: false,
    autoAdvance: true, // Automatically advance time
    dailyEventsProcessed: false,
    monthlyEventsProcessed: false,
  },

  // Time Management Actions
  updateGameTime: (updates) => set((state) => ({
    gameTime: { ...state.gameTime, ...updates }
  })),

  /**
   * Advance time by specified number of days
   */
  advanceTime: (days = 1) => {
    const state = get();

    if (state.gameTime.isPaused) {
      return { success: false, message: 'Game is paused' };
    }

    const newDate = new Date(state.gameTime.currentDate);
    newDate.setDate(newDate.getDate() + days);

    const daysPassed = state.gameTime.daysPassed + days;
    const monthsPassed = Math.floor(daysPassed / 30);
    const yearsPassed = Math.floor(daysPassed / 365);

    // Check if we've crossed into a new month
    const crossedMonth = Math.floor(daysPassed / 30) > Math.floor((daysPassed - days) / 30);

    // Calculate income and expenses
    const { monthlyIncome, monthlyExpenses, stakingRewards } = calculateTimeBasedRewards(state, days);

    // Update staking tenure
    const updatedStakingTenure = updateStakingTenure(state, days);

    // Process economic events
    const activeEvents = getActiveEconomicEvents(state);

    // Build the state update
    let stateUpdate = {
      gameTime: {
        ...state.gameTime,
        currentDate: newDate,
        daysPassed,
        monthsPassed,
        yearsPassed,
        dailyEventsProcessed: false,
        monthlyEventsProcessed: !crossedMonth
      },
      staking: {
        ...state.staking,
        pendingRewards: (state.staking?.pendingRewards || 0) + stakingRewards,
        stakingTenure: updatedStakingTenure,
      },
      economics: {
        ...state.economics,
        activeEvents
      },
      statistics: {
        ...state.statistics,
        totalDaysPlayed: daysPassed,
      }
    };

    // If a month has passed, process monthly transactions
    if (crossedMonth) {
      const netIncome = monthlyIncome - monthlyExpenses;

      stateUpdate.player = {
        ...state.player,
        cash: Math.max(0, (state.player?.cash || 0) + netIncome),
        totalEarned: (state.player?.totalEarned || 0) + Math.max(0, netIncome),
      };

      stateUpdate.gameTime.lastMonthlyReset = newDate;
      stateUpdate.gameTime.monthlyEventsProcessed = false;
    }

    set((state) => ({ ...state, ...stateUpdate }));

    // Trigger time-based events
    if (crossedMonth) {
      get().processMonthlyEvents();
    }

    get().processDailyEvents();

    return {
      success: true,
      daysPassed,
      monthsPassed,
      crossedMonth,
      netIncome: crossedMonth ? monthlyIncome - monthlyExpenses : 0
    };
  },

  /**
   * Process daily events and resets
   */
  processDailyEvents: () => {
    const state = get();

    if (state.gameTime.dailyEventsProcessed) return;

    // Reset daily actions
    const dailyActionsRemaining = 10; // From game config

    // Calculate daily login rewards
    const dailyReward = EconomicSimulator.calculateDailyLoginReward(
      state.businesses || [],
      state.staking || {}
    );

    // Check for achievements
    const achievementResults = get().checkAndAwardAchievements?.() || { newAchievements: [], tonRewards: 0 };

    set((state) => ({
      player: {
        ...state.player,
        dailyActionsRemaining,
        lastDailyReset: state.gameTime.currentDate
      },
      staking: {
        ...state.staking,
        tonBalance: (state.staking?.tonBalance || 0) + dailyReward
      },
      gameTime: {
        ...state.gameTime,
        dailyEventsProcessed: true
      }
    }));

    return {
      dailyReward,
      achievementsUnlocked: achievementResults.newAchievements.length,
      tonFromAchievements: achievementResults.tonRewards
    };
  },

  /**
   * Process monthly events and economic updates
   */
  processMonthlyEvents: () => {
    const state = get();

    if (state.gameTime.monthlyEventsProcessed) return;

    // Process monthly economics
    const economicsResults = get().processMonthlyEconomics?.() || {};

    // Update business performance
    const businessUpdates = processMonthlyBusinessUpdates(state);

    // Process loan payments
    const loanUpdates = processMonthlyLoanPayments(state);

    // Update credit score
    const creditScoreUpdate = calculateCreditScoreUpdate(state);

    // Update housing costs
    const housingUpdates = processMonthlyHousingCosts(state);

    set((state) => ({
      businesses: businessUpdates.businesses,
      banking: {
        ...state.banking,
        ...loanUpdates.banking
      },
      player: {
        ...state.player,
        creditScore: creditScoreUpdate.newCreditScore,
        cash: Math.max(0, (state.player?.cash || 0) - loanUpdates.totalPayments - housingUpdates.totalCosts)
      },
      housing: {
        ...state.housing,
        ...housingUpdates.housing
      },
      gameTime: {
        ...state.gameTime,
        monthlyEventsProcessed: true
      }
    }));

    return {
      economicsResults,
      businessUpdates,
      loanUpdates,
      creditScoreUpdate,
      housingUpdates
    };
  },

  /**
   * Fast forward time (for testing or premium features)
   */
  fastForward: (days) => {
    const state = get();

    if (days > 30) {
      return { success: false, message: 'Cannot fast forward more than 30 days at once' };
    }

    // Process in chunks to avoid overwhelming calculations
    const chunkSize = 7; // Process week by week
    let totalDays = 0;
    const results = [];

    while (totalDays < days) {
      const daysToProcess = Math.min(chunkSize, days - totalDays);
      const result = get().advanceTime(daysToProcess);
      results.push(result);
      totalDays += daysToProcess;
    }

    return {
      success: true,
      totalDaysProcessed: totalDays,
      results
    };
  },

  /**
   * Pause/unpause game time
   */
  togglePause: () => set((state) => ({
    gameTime: {
      ...state.gameTime,
      isPaused: !state.gameTime.isPaused
    }
  })),

  /**
   * Set time multiplier for faster/slower progression
   */
  setTimeMultiplier: (multiplier) => set((state) => ({
    gameTime: {
      ...state.gameTime,
      timeMultiplier: Math.max(0.1, Math.min(10, multiplier)) // Clamp between 0.1x and 10x
    }
  })),

  /**
   * Get time statistics and information
   */
  getTimeStats: () => {
    const state = get();
    const { gameTime } = state;

    const totalPlayTime = gameTime.daysPassed;
    const averageSessionLength = totalPlayTime > 0 ? totalPlayTime / (gameTime.monthsPassed || 1) : 0;

    const timeUntilNextMonth = 30 - (gameTime.daysPassed % 30);
    const timeUntilNextYear = 365 - (gameTime.daysPassed % 365);

    const gameAge = {
      days: gameTime.daysPassed % 30,
      months: gameTime.monthsPassed % 12,
      years: gameTime.yearsPassed
    };

    return {
      currentDate: gameTime.currentDate,
      totalPlayTime,
      gameAge,
      timeUntilNextMonth,
      timeUntilNextYear,
      averageSessionLength: Math.round(averageSessionLength),
      isPaused: gameTime.isPaused,
      timeMultiplier: gameTime.timeMultiplier,
      dailyEventsProcessed: gameTime.dailyEventsProcessed,
      monthlyEventsProcessed: gameTime.monthlyEventsProcessed
    };
  },

  /**
   * Reset daily events flag (for manual triggering)
   */
  resetDailyEvents: () => set((state) => ({
    gameTime: {
      ...state.gameTime,
      dailyEventsProcessed: false
    }
  })),

  /**
   * Reset monthly events flag (for manual triggering)
   */
  resetMonthlyEvents: () => set((state) => ({
    gameTime: {
      ...state.gameTime,
      monthlyEventsProcessed: false
    }
  })),

  /**
   * Get upcoming events and milestones
   */
  getUpcomingEvents: () => {
    const state = get();
    const events = [];

    // Next daily reset
    events.push({
      type: 'daily_reset',
      description: 'Daily actions reset',
      daysUntil: 1,
      priority: 'low'
    });

    // Next monthly reset
    const daysUntilMonth = 30 - (state.gameTime.daysPassed % 30);
    events.push({
      type: 'monthly_reset',
      description: 'Monthly income and expenses processed',
      daysUntil: daysUntilMonth,
      priority: 'medium'
    });

    // Loan payments
    if (state.banking?.loans?.length > 0) {
      events.push({
        type: 'loan_payment',
        description: 'Monthly loan payments due',
        daysUntil: daysUntilMonth,
        priority: 'high'
      });
    }

    // Staking rewards
    if (state.staking?.activeStakes && Object.keys(state.staking.activeStakes).length > 0) {
      events.push({
        type: 'staking_rewards',
        description: 'Daily staking rewards',
        daysUntil: 1,
        priority: 'medium'
      });
    }

    return events.sort((a, b) => a.daysUntil - b.daysUntil);
  }
});

// Helper functions
function calculateTimeBasedRewards(state, days) {
  // Calculate monthly income from job
  let monthlyIncome = state.player?.monthlyIncome || 0;

  // Add business income
  const businessIncome = (state.businesses || []).reduce((sum, business) => {
    return sum + (business.monthlyIncome || 0);
  }, 0);

  monthlyIncome += businessIncome;

  // Calculate monthly expenses
  const monthlyExpenses = (state.housing?.monthlyHousingCost || 0) +
    (state.banking?.monthlyDebtPayments || 0);

  // Calculate staking rewards
  const dailyStakingRewards = calculateTotalDailyRewards(state.staking?.activeStakes || {});
  const stakingRewards = dailyStakingRewards * days;

  return { monthlyIncome, monthlyExpenses, stakingRewards };
}

function updateStakingTenure(state, days) {
  const updatedTenure = { ...(state.staking?.stakingTenure || {}) };

  Object.keys(state.staking?.activeStakes || {}).forEach(poolId => {
    updatedTenure[poolId] = (updatedTenure[poolId] || 0) + days;
  });

  return updatedTenure;
}

function getActiveEconomicEvents(state) {
  // This would integrate with the economics store
  return state.economics?.activeEvents || [];
}

function processMonthlyBusinessUpdates(state) {
  const businesses = (state.businesses || []).map(business => {
    // Apply random market fluctuations
    const marketVariation = 0.95 + (Math.random() * 0.1); // ±5% variation
    const adjustedIncome = (business.monthlyIncome || 0) * marketVariation;

    return {
      ...business,
      monthlyIncome: adjustedIncome,
      lastUpdate: new Date()
    };
  });

  return { businesses };
}

function processMonthlyLoanPayments(state) {
  const loans = state.banking?.loans || [];
  let totalPayments = 0;

  const updatedLoans = loans.map(loan => {
    const payment = loan.monthlyPayment || 0;
    totalPayments += payment;

    const newBalance = Math.max(0, (loan.remainingBalance || loan.amount) - payment);

    return {
      ...loan,
      remainingBalance: newBalance,
      lastPayment: new Date()
    };
  }).filter(loan => loan.remainingBalance > 0);

  return {
    banking: {
      loans: updatedLoans,
      monthlyDebtPayments: updatedLoans.reduce((sum, loan) => sum + (loan.monthlyPayment || 0), 0)
    },
    totalPayments
  };
}

function calculateCreditScoreUpdate(state) {
  const currentScore = state.player?.creditScore || 650;
  let scoreChange = 0;

  // Positive factors
  if ((state.banking?.loans || []).length > 0) {
    scoreChange += 2; // Making loan payments
  }

  if ((state.player?.cash || 0) > 10000) {
    scoreChange += 1; // Having savings
  }

  // Negative factors
  if ((state.player?.cash || 0) < 0) {
    scoreChange -= 10; // Being in debt
  }

  const newCreditScore = Math.max(300, Math.min(850, currentScore + scoreChange));

  return { newCreditScore, scoreChange };
}

function processMonthlyHousingCosts(state) {
  const monthlyCost = state.housing?.monthlyHousingCost || 0;
  const utilityCosts = (state.housing?.utilities || []).reduce((sum, utility) =>
    sum + (utility.monthlyCost || 0), 0
  );

  const totalCosts = monthlyCost + utilityCosts;

  return {
    housing: {
      lastPayment: new Date(),
      totalMonthlyCost: totalCosts
    },
    totalCosts
  };
} 