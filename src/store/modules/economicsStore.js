import {
  ECONOMIC_CONFIG,
  INDUSTRY_CLUSTERS,
  SUPPLY_CHAIN_DEPENDENCIES,
  ECONOMIC_EVENTS,
  COMMUNITY_PROJECTS,
  EconomicSimulator
} from '../../config/economicSimulationConfig.js';

/**
 * Economics Store Module
 * Manages economic simulation, market events, inflation, and economic status
 */
export const createEconomicsStore = (set, get) => ({
  // Economics State
  economics: {
    marketInfluence: 0,
    industryPositions: {}, // { industryId: marketShare }
    activeEvents: [],
    resourceInventory: {},
    supplyChainConnections: [],
    economicReputation: 50,
    economicClass: { class: 'working', tier: 1, description: 'Working Class' },
    politicalInfluence: 0,
    totalWealth: 0,
    currentInflationRate: 0.02, // 2% base inflation
    lastEconomicUpdate: new Date(),
    marketSentiment: 'neutral', // bullish, bearish, neutral
    globalEconomicHealth: 75,
  },

  // Economics Actions
  updateEconomics: (updates) => set((state) => ({
    economics: { ...state.economics, ...updates }
  })),

  /**
   * Calculate and update economic status based on wealth and achievements
   */
  calculateEconomicStatus: () => {
    const state = get();

    // Calculate total wealth from all sources
    const playerCash = state.player?.cash || 0;
    const playerEarnings = state.player?.totalEarned || 0;
    const businessValue = (state.businesses || []).reduce((sum, b) => sum + (b.value || 0), 0);
    const stakingValue = state.staking?.totalStaked || 0;
    const bankingAssets = (state.banking?.accounts || []).reduce((sum, acc) => sum + acc.balance, 0);

    const totalWealth = playerCash + playerEarnings + businessValue + stakingValue + bankingAssets;

    // Determine economic class
    const economicClass = EconomicSimulator.getEconomicClass(totalWealth);

    // Calculate political influence
    const politicalInfluence = EconomicSimulator.calculatePoliticalInfluence(
      economicClass.class,
      stakingValue,
      state.achievements || []
    );

    set((state) => ({
      economics: {
        ...state.economics,
        economicClass,
        politicalInfluence,
        totalWealth
      }
    }));

    return { economicClass, politicalInfluence, totalWealth };
  },

  /**
   * Process monthly economic updates including inflation and market changes
   */
  processMonthlyEconomics: () => {
    const state = get();

    // Calculate current inflation rate based on community staking
    const totalCommunityStaked = state.staking?.totalStaked || 0;
    const inflationRate = EconomicSimulator.calculateInflationRate(totalCommunityStaked);
    const inflationMultiplier = 1 + inflationRate;

    // Update housing costs with inflation
    const updatedHousingCost = (state.housing?.monthlyHousingCost || 0) * inflationMultiplier;

    // Apply supply chain effects to businesses
    const updatedBusinesses = (state.businesses || []).map(business => {
      const supplyChainImpact = EconomicSimulator.calculateSupplyChainImpact(
        business,
        state.economics.resourceInventory,
        { globalMarketData: state.economics } // Pass current economic state
      );

      const baseIncome = business.monthlyIncome || 0;
      const adjustedIncome = baseIncome * supplyChainImpact * inflationMultiplier;

      return {
        ...business,
        monthlyIncome: adjustedIncome,
        supplyChainHealth: supplyChainImpact,
        lastEconomicUpdate: new Date()
      };
    });

    // Update market sentiment based on various factors
    const marketSentiment = calculateMarketSentiment(state);

    set((state) => ({
      housing: {
        ...state.housing,
        monthlyHousingCost: updatedHousingCost
      },
      businesses: updatedBusinesses,
      economics: {
        ...state.economics,
        currentInflationRate: inflationRate,
        lastEconomicUpdate: new Date(),
        marketSentiment,
        globalEconomicHealth: calculateGlobalEconomicHealth(state)
      }
    }));

    return {
      inflationRate,
      marketSentiment,
      businessesAffected: updatedBusinesses.length
    };
  },

  /**
   * Trigger an economic event
   */
  triggerEconomicEvent: (eventType) => {
    const state = get();
    const eventConfig = ECONOMIC_EVENTS[eventType];

    if (!eventConfig) {
      return { success: false, error: 'Unknown economic event type' };
    }

    const processedEvent = EconomicSimulator.processEconomicEvent(eventConfig, state);

    // Apply immediate effects based on event type
    let stateChanges = {
      economics: {
        ...state.economics,
        activeEvents: [...state.economics.activeEvents, processedEvent]
      }
    };

    // Event-specific effects
    switch (eventType) {
      case 'MARKET_CRASH':
        stateChanges = applyMarketCrashEffects(state, processedEvent, stateChanges);
        break;

      case 'INNOVATION_BOOM':
        stateChanges = applyInnovationBoomEffects(state, processedEvent, stateChanges);
        break;

      case 'SUPPLY_SHORTAGE':
        stateChanges = applySupplyShortageEffects(state, processedEvent, stateChanges);
        break;

      case 'REGULATORY_CHANGE':
        stateChanges = applyRegulatoryChangeEffects(state, processedEvent, stateChanges);
        break;
    }

    set((state) => ({ ...state, ...stateChanges }));

    return { success: true, event: processedEvent };
  },

  /**
   * Get active economic events and their effects
   */
  getActiveEconomicEvents: () => {
    const state = get();
    const now = new Date();

    // Filter out expired events
    const activeEvents = state.economics.activeEvents.filter(event => {
      const endDate = new Date(event.startDate);
      endDate.setDate(endDate.getDate() + event.duration);
      return now < endDate;
    });

    // Update state if events have expired
    if (activeEvents.length !== state.economics.activeEvents.length) {
      set((state) => ({
        economics: {
          ...state.economics,
          activeEvents
        }
      }));
    }

    return activeEvents;
  },

  /**
   * Calculate market influence based on business portfolio
   */
  calculateMarketInfluence: () => {
    const state = get();
    const businesses = state.businesses || [];

    // Calculate influence by industry
    const industryPositions = {};
    let totalMarketInfluence = 0;

    businesses.forEach(business => {
      const industry = business.industry || 'other';
      const businessValue = business.value || 0;

      if (!industryPositions[industry]) {
        industryPositions[industry] = 0;
      }

      industryPositions[industry] += businessValue;
      totalMarketInfluence += businessValue * 0.001; // Convert to influence points
    });

    set((state) => ({
      economics: {
        ...state.economics,
        marketInfluence: totalMarketInfluence,
        industryPositions
      }
    }));

    return { marketInfluence: totalMarketInfluence, industryPositions };
  },

  /**
   * Get economic statistics and insights
   */
  getEconomicStats: () => {
    const state = get();
    const { economics } = state;

    const activeEventsCount = economics.activeEvents.length;
    const totalIndustries = Object.keys(economics.industryPositions).length;
    const strongestIndustry = Object.entries(economics.industryPositions)
      .sort(([, a], [, b]) => b - a)[0];

    const economicGrowthRate = calculateEconomicGrowthRate(state);
    const riskLevel = calculateEconomicRiskLevel(state);

    return {
      economicClass: economics.economicClass,
      totalWealth: economics.totalWealth,
      politicalInfluence: economics.politicalInfluence,
      marketInfluence: economics.marketInfluence,
      currentInflationRate: economics.currentInflationRate,
      marketSentiment: economics.marketSentiment,
      globalEconomicHealth: economics.globalEconomicHealth,
      activeEventsCount,
      totalIndustries,
      strongestIndustry: strongestIndustry ? {
        industry: strongestIndustry[0],
        value: strongestIndustry[1]
      } : null,
      economicGrowthRate,
      riskLevel,
      economicReputation: economics.economicReputation
    };
  },

  /**
   * Update economic reputation based on actions
   */
  updateEconomicReputation: (change, reason) => {
    const state = get();
    const newReputation = Math.max(0, Math.min(100, state.economics.economicReputation + change));

    set((state) => ({
      economics: {
        ...state.economics,
        economicReputation: newReputation
      }
    }));

    return { newReputation, change, reason };
  }
});

// Helper functions
function calculateMarketSentiment(state) {
  const factors = [];

  // Business performance
  const businessGrowth = (state.businesses || []).reduce((sum, b) => sum + (b.monthlyIncome || 0), 0);
  if (businessGrowth > 10000) factors.push('bullish');
  else if (businessGrowth < 1000) factors.push('bearish');

  // Staking activity
  if ((state.staking?.totalStaked || 0) > 5000) factors.push('bullish');

  // Active negative events
  const negativeEvents = (state.economics?.activeEvents || []).filter(e =>
    e.type === 'MARKET_CRASH' || e.type === 'SUPPLY_SHORTAGE'
  );
  if (negativeEvents.length > 0) factors.push('bearish');

  // Determine overall sentiment
  const bullishCount = factors.filter(f => f === 'bullish').length;
  const bearishCount = factors.filter(f => f === 'bearish').length;

  if (bullishCount > bearishCount) return 'bullish';
  if (bearishCount > bullishCount) return 'bearish';
  return 'neutral';
}

function calculateGlobalEconomicHealth(state) {
  let health = 75; // Base health

  // Adjust based on active events
  (state.economics?.activeEvents || []).forEach(event => {
    if (event.type === 'MARKET_CRASH') health -= 20;
    if (event.type === 'INNOVATION_BOOM') health += 10;
    if (event.type === 'SUPPLY_SHORTAGE') health -= 10;
  });

  // Adjust based on inflation
  const inflation = state.economics?.currentInflationRate || 0.02;
  if (inflation > 0.05) health -= 15; // High inflation
  if (inflation < 0.01) health += 5; // Low inflation

  return Math.max(0, Math.min(100, health));
}

function calculateEconomicGrowthRate(state) {
  // Simplified growth rate calculation
  const currentIncome = (state.businesses || []).reduce((sum, b) => sum + (b.monthlyIncome || 0), 0);
  const stakingRewards = state.staking?.pendingRewards || 0;

  return Math.min(15, (currentIncome + stakingRewards) / 1000); // Cap at 15%
}

function calculateEconomicRiskLevel(state) {
  let risk = 'low';

  const activeEvents = state.economics?.activeEvents || [];
  const negativeEvents = activeEvents.filter(e =>
    e.type === 'MARKET_CRASH' || e.type === 'SUPPLY_SHORTAGE'
  );

  if (negativeEvents.length > 1) risk = 'high';
  else if (negativeEvents.length === 1) risk = 'medium';

  return risk;
}

function applyMarketCrashEffects(state, event, stateChanges) {
  const isStaker = (state.staking?.totalStaked || 0) > 0;
  const protection = isStaker ? event.effects.staker_protection : 0;
  const businessImpact = event.effects.business_income * (1 - protection);

  stateChanges.businesses = (state.businesses || []).map(business => ({
    ...business,
    monthlyIncome: (business.monthlyIncome || 0) * (1 + businessImpact)
  }));

  return stateChanges;
}

function applyInnovationBoomEffects(state, event, stateChanges) {
  const hasInnovationStake = state.staking?.activeStakes?.innovation_fund;
  if (hasInnovationStake) {
    const bonus = event.effects.innovation_fund_bonus;
    stateChanges.staking = {
      ...state.staking,
      pendingRewards: (state.staking.pendingRewards || 0) + (hasInnovationStake.amount * bonus * 0.1)
    };
  }

  return stateChanges;
}

function applySupplyShortageEffects(state, event, stateChanges) {
  // Increase costs for affected industries
  const affectedIndustries = event.effects.affected_industries || [];

  stateChanges.businesses = (state.businesses || []).map(business => {
    if (affectedIndustries.includes(business.industry)) {
      return {
        ...business,
        monthlyIncome: (business.monthlyIncome || 0) * 0.85 // 15% reduction
      };
    }
    return business;
  });

  return stateChanges;
}

function applyRegulatoryChangeEffects(state, event, stateChanges) {
  // Apply regulatory effects based on business compliance
  stateChanges.businesses = (state.businesses || []).map(business => {
    const complianceLevel = business.complianceLevel || 0.5;
    const impact = event.effects.compliance_bonus * complianceLevel;

    return {
      ...business,
      monthlyIncome: (business.monthlyIncome || 0) * (1 + impact)
    };
  });

  return stateChanges;
} 