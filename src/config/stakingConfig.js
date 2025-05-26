// 🎯 ECONOMIC STAKING SIMULATION CONFIG
// Strategic transformation from dynasty to economic staking system

export const STAKING_POOLS = {
  ECONOMIC_STABILITY: {
    id: 'economic_stability',
    name: 'Economic Stability Pool',
    icon: '🏦',
    description: 'Secure, low-risk staking for market stability',
    apy: 12, // 12% APY
    lockPeriod: 30, // 30 days
    minStake: 100, // Minimum 100 TON
    maxStake: 50000, // Maximum 50,000 TON
    color: 'blue',
    benefits: {
      marketStability: 0.15,
      economicInfluence: 0.10,
      governanceWeight: 0.05,
      businessProtection: 0.12
    },
    risks: {
      liquidityLock: 'medium',
      marketExposure: 'low'
    },
    features: [
      'Market crash protection',
      'Stable returns',
      'Governance voting rights',
      'Economic policy influence'
    ]
  },
  
  INNOVATION_FUND: {
    id: 'innovation_fund',
    name: 'Innovation Fund',
    icon: '🚀',
    description: 'High-yield pool funding technological advancement',
    apy: 18, // 18% APY
    lockPeriod: 90, // 90 days
    minStake: 500, // Minimum 500 TON
    maxStake: 100000, // Maximum 100,000 TON
    color: 'purple',
    benefits: {
      technologyAccess: 0.25,
      innovationBonus: 0.20,
      researchSpeed: 0.30,
      earlyAdoption: 0.40
    },
    risks: {
      liquidityLock: 'high',
      marketExposure: 'medium'
    },
    features: [
      'Early access to new industries',
      'Technology research bonuses',
      'Innovation breakthrough rewards',
      'Patent revenue sharing'
    ]
  },

  INFRASTRUCTURE_DEVELOPMENT: {
    id: 'infrastructure_development',
    name: 'Infrastructure Development',
    icon: '🏗️',
    description: 'Medium-term investment in economic infrastructure',
    apy: 10, // 10% APY
    lockPeriod: 60, // 60 days
    minStake: 250, // Minimum 250 TON
    maxStake: 75000, // Maximum 75,000 TON
    color: 'orange',
    benefits: {
      constructionBonus: 0.20,
      infrastructureAccess: 0.25,
      urbanInfluence: 0.15,
      contractPriority: 0.30
    },
    risks: {
      liquidityLock: 'medium',
      marketExposure: 'low'
    },
    features: [
      'Infrastructure project access',
      'Construction cost reductions',
      'Urban development bonuses',
      'Government contract priority'
    ]
  },

  MARKET_MAKER: {
    id: 'market_maker',
    name: 'Market Maker Pool',
    icon: '📈',
    description: 'Variable returns based on market activity',
    apy: 25, // 25% variable APY
    lockPeriod: 7, // 7 days
    minStake: 50, // Minimum 50 TON
    maxStake: 25000, // Maximum 25,000 TON
    color: 'green',
    benefits: {
      tradingAdvantage: 0.35,
      marketInformation: 0.40,
      priceInfluence: 0.20,
      liquidityRewards: 0.25
    },
    risks: {
      liquidityLock: 'low',
      marketExposure: 'high'
    },
    features: [
      'Market trading advantages',
      'Real-time market data',
      'Price influence capabilities',
      'Trading fee revenue share'
    ]
  },

  SOCIAL_IMPACT: {
    id: 'social_impact',
    name: 'Social Impact Fund',
    icon: '🌍',
    description: 'Long-term investment in social good',
    apy: 8, // 8% APY
    lockPeriod: 180, // 180 days
    minStake: 100, // Minimum 100 TON
    maxStake: 200000, // Maximum 200,000 TON
    color: 'emerald',
    benefits: {
      socialLicense: 0.30,
      brandLoyalty: 0.25,
      communitySupport: 0.35,
      sustainabilityBonus: 0.20
    },
    risks: {
      liquidityLock: 'very high',
      marketExposure: 'very low'
    },
    features: [
      'Social project funding',
      'Community goodwill bonuses',
      'Brand reputation enhancement',
      'Tax incentives and benefits'
    ]
  }
};

export const GOVERNANCE_SYSTEM = {
  VOTING_POWER_CALCULATION: {
    baseWeight: 1.0,
    stakingMultiplier: {
      ECONOMIC_STABILITY: 1.0,
      INNOVATION_FUND: 1.2,
      INFRASTRUCTURE_DEVELOPMENT: 0.8,
      MARKET_MAKER: 0.6,
      SOCIAL_IMPACT: 1.1
    },
    tenureBonus: {
      30: 0.05,   // 30 days: +5%
      90: 0.10,   // 90 days: +10%
      180: 0.20,  // 180 days: +20%
      365: 0.35   // 365 days: +35%
    }
  },

  PROPOSAL_TYPES: {
    NEW_INDUSTRY: {
      id: 'new_industry',
      name: 'New Industry Addition',
      icon: '🏭',
      requiredVotes: 1000,
      votingPeriod: 7, // days
      implementationTime: 14, // days
      description: 'Add a new industry to the economic simulation'
    },
    ECONOMIC_POLICY: {
      id: 'economic_policy',
      name: 'Economic Policy Change',
      icon: '📊',
      requiredVotes: 750,
      votingPeriod: 5, // days
      implementationTime: 7, // days
      description: 'Modify inflation rates, interest rates, or economic parameters'
    },
    INFRASTRUCTURE_PROJECT: {
      id: 'infrastructure_project',
      name: 'Infrastructure Project',
      icon: '🌉',
      requiredVotes: 500,
      votingPeriod: 10, // days
      implementationTime: 30, // days
      description: 'Fund major infrastructure developments'
    },
    REWARD_ADJUSTMENT: {
      id: 'reward_adjustment',
      name: 'Staking Reward Adjustment',
      icon: '💰',
      requiredVotes: 1500,
      votingPeriod: 14, // days
      implementationTime: 21, // days
      description: 'Adjust APY rates and staking pool parameters'
    }
  }
};

export const ECONOMIC_EVENTS = {
  MARKET_CRASH: {
    id: 'market_crash',
    name: 'Market Crash',
    icon: '📉',
    probability: 0.05, // 5% chance per month
    duration: 7, // days
    effects: {
      unstaked: {
        businessIncome: -0.30,
        assetValue: -0.25,
        newOpportunities: -0.40
      },
      staked: {
        ECONOMIC_STABILITY: {
          businessIncome: -0.10,
          assetValue: -0.05,
          newOpportunities: -0.15
        },
        INNOVATION_FUND: {
          businessIncome: -0.20,
          assetValue: -0.15,
          newOpportunities: 0.10
        }
      }
    },
    description: 'Economic downturn affecting all players'
  },

  INNOVATION_BOOM: {
    id: 'innovation_boom',
    name: 'Innovation Boom',
    icon: '🚀',
    probability: 0.03, // 3% chance per month
    duration: 14, // days
    effects: {
      unstaked: {
        technologyBusinesses: 0.20,
        researchSpeed: 0.15
      },
      staked: {
        INNOVATION_FUND: {
          technologyBusinesses: 0.50,
          researchSpeed: 0.40,
          bonusRewards: 0.25
        }
      }
    },
    description: 'Technology sector experiences massive growth'
  },

  INFRASTRUCTURE_CRISIS: {
    id: 'infrastructure_crisis',
    name: 'Infrastructure Crisis',
    icon: '🚧',
    probability: 0.04, // 4% chance per month
    duration: 21, // days
    effects: {
      unstaked: {
        operationalCosts: 0.25,
        constructionCosts: 0.35
      },
      staked: {
        INFRASTRUCTURE_DEVELOPMENT: {
          operationalCosts: -0.10,
          constructionCosts: -0.15,
          contractOpportunities: 0.30
        }
      }
    },
    description: 'Infrastructure breakdown affects operations'
  }
};

export const CROSS_PLAYER_MECHANICS = {
  MARKET_SHARE_LIMITS: {
    // Maximum market share per industry per player
    TECHNOLOGY: 0.15,
    FINANCE: 0.12,
    REAL_ESTATE: 0.20,
    MANUFACTURING: 0.18,
    ENERGY: 0.10,
    RETAIL: 0.25,
    HEALTHCARE: 0.08,
    ENTERTAINMENT: 0.30
  },

  RESOURCE_TRADING: {
    MATERIALS: {
      steel: { basePrice: 100, volatility: 0.15 },
      concrete: { basePrice: 50, volatility: 0.10 },
      electronics: { basePrice: 200, volatility: 0.25 },
      energy: { basePrice: 75, volatility: 0.30 }
    },
    TALENT: {
      engineers: { basePrice: 5000, volatility: 0.20 },
      managers: { basePrice: 8000, volatility: 0.15 },
      researchers: { basePrice: 12000, volatility: 0.25 },
      specialists: { basePrice: 15000, volatility: 0.30 }
    }
  },

  SUPPLY_CHAIN_EFFECTS: {
    // How player actions affect others
    MATERIAL_SHORTAGE: {
      trigger: 'high_demand',
      effect: 'increased_costs',
      magnitude: 0.20
    },
    TALENT_DRAIN: {
      trigger: 'aggressive_hiring',
      effect: 'reduced_availability',
      magnitude: 0.15
    },
    MARKET_SATURATION: {
      trigger: 'industry_overcrowding',
      effect: 'reduced_profitability',
      magnitude: 0.25
    }
  }
};

export const PLAY_TO_EARN_MECHANICS = {
  DAILY_REWARDS: {
    BASE_LOGIN: 0.01, // 0.01 TON for logging in (if you own businesses)
    BUSINESS_OWNER: 0.005, // Additional 0.005 TON per business owned
    STAKING_BONUS: 0.002 // Additional 0.002 TON per active staking pool
  },

  ACHIEVEMENT_REWARDS: {
    FIRST_BUSINESS: 0.1, // 0.1 TON
    NET_WORTH_1M: 0.5, // 0.5 TON
    NET_WORTH_10M: 2.0, // 2 TON
    NET_WORTH_100M: 10.0, // 10 TON
    INDUSTRY_LEADER: 1.0, // 1 TON for becoming #1 in industry
    STAKING_MILESTONE: 0.25 // 0.25 TON for various staking milestones
  },

  GOVERNANCE_REWARDS: {
    PROPOSAL_CREATION: 0.05, // 0.05 TON for submitting a proposal
    VOTING_PARTICIPATION: 0.01, // 0.01 TON for voting on proposals
    SUCCESSFUL_PROPOSAL: 0.5 // 0.5 TON if your proposal passes
  },

  COMMUNITY_CONTRIBUTIONS: {
    BUG_REPORT: 0.1, // 0.1 TON for verified bug reports
    FEATURE_SUGGESTION: 0.05, // 0.05 TON for implemented suggestions
    COMMUNITY_HELP: 0.02 // 0.02 TON for helping other players
  }
};

export const STAKING_CALCULATIONS = {
  calculateAPY: (pool, amount, duration) => {
    const baseAPY = STAKING_POOLS[pool].apy;
    const lockPeriod = STAKING_POOLS[pool].lockPeriod;
    
    // Bonus for longer lock periods
    const durationBonus = duration > lockPeriod ? 
      Math.min(0.05, (duration - lockPeriod) / 365 * 0.10) : 0;
    
    // Bonus for larger amounts
    const amountBonus = amount > 10000 ? 
      Math.min(0.03, Math.log10(amount / 10000) * 0.01) : 0;
    
    return baseAPY + (durationBonus * 100) + (amountBonus * 100);
  },

  calculateDailyRewards: (stakedAmount, apy) => {
    return (stakedAmount * (apy / 100)) / 365;
  },

  calculateUnstakingPenalty: (pool, timeRemaining) => {
    if (timeRemaining <= 0) return 0;
    
    const lockPeriod = STAKING_POOLS[pool].lockPeriod;
    const penaltyRate = timeRemaining / lockPeriod;
    
    // Different penalty structures per pool
    switch (pool) {
      case 'MARKET_MAKER':
        return penaltyRate * 0.02; // 2% max penalty
      case 'ECONOMIC_STABILITY':
        return penaltyRate * 0.05; // 5% max penalty
      case 'INNOVATION_FUND':
        return penaltyRate * 0.08; // 8% max penalty
      case 'INFRASTRUCTURE_DEVELOPMENT':
        return penaltyRate * 0.06; // 6% max penalty
      case 'SOCIAL_IMPACT':
        return penaltyRate * 0.10; // 10% max penalty
      default:
        return penaltyRate * 0.05;
    }
  },

  calculateVotingPower: (stakes, tenure) => {
    let totalPower = 0;
    
    Object.entries(stakes).forEach(([poolId, stake]) => {
      const pool = STAKING_POOLS[poolId];
      if (!pool) return;
      
      const baseWeight = GOVERNANCE_SYSTEM.VOTING_POWER_CALCULATION.baseWeight;
      const poolMultiplier = GOVERNANCE_SYSTEM.VOTING_POWER_CALCULATION.stakingMultiplier[poolId] || 1.0;
      
      // Calculate tenure bonus
      const tenureDays = tenure[poolId] || 0;
      let tenureBonus = 0;
      const bonusThresholds = Object.keys(GOVERNANCE_SYSTEM.VOTING_POWER_CALCULATION.tenureBonus)
        .map(Number)
        .sort((a, b) => b - a);
      
      for (const threshold of bonusThresholds) {
        if (tenureDays >= threshold) {
          tenureBonus = GOVERNANCE_SYSTEM.VOTING_POWER_CALCULATION.tenureBonus[threshold];
          break;
        }
      }
      
      const stakePower = stake.amount * baseWeight * poolMultiplier * (1 + tenureBonus);
      totalPower += stakePower;
    });
    
    return totalPower;
  }
};

// Helper functions
export const getAvailableStakingPools = (playerStats, currentStakes) => {
  return Object.values(STAKING_POOLS).filter(pool => {
    // Check if player has minimum amount to stake
    const currentStake = currentStakes[pool.id]?.amount || 0;
    const availableFunds = playerStats.tonBalance || 0;
    
    return availableFunds >= pool.minStake && 
           (currentStake + pool.minStake) <= pool.maxStake;
  });
};

export const calculateTotalStaked = (stakes) => {
  return Object.values(stakes).reduce((total, stake) => total + (stake.amount || 0), 0);
};

export const calculateTotalDailyRewards = (stakes) => {
  return Object.entries(stakes).reduce((total, [poolId, stake]) => {
    const pool = STAKING_POOLS[poolId];
    if (!pool || !stake.amount) return total;
    
    const dailyReward = STAKING_CALCULATIONS.calculateDailyRewards(stake.amount, pool.apy);
    return total + dailyReward;
  }, 0);
};

export const getActiveEconomicEvents = (gameState) => {
  // Check which economic events should be active based on game state
  const activeEvents = [];
  const currentTime = Date.now();
  
  Object.values(ECONOMIC_EVENTS).forEach(event => {
    // Simple probability check - in real implementation, this would be more sophisticated
    if (Math.random() < event.probability / 30) { // Monthly probability converted to daily
      activeEvents.push({
        ...event,
        startTime: currentTime,
        endTime: currentTime + (event.duration * 24 * 60 * 60 * 1000)
      });
    }
  });
  
  return activeEvents;
};

export const calculateEventEffects = (event, playerStakes, playerStats) => {
  const effects = { ...event.effects.unstaked };
  
  // Apply staking bonuses/protections
  Object.entries(playerStakes).forEach(([poolId, stake]) => {
    if (stake.amount > 0 && event.effects.staked[poolId]) {
      const stakingEffects = event.effects.staked[poolId];
      Object.entries(stakingEffects).forEach(([effectType, value]) => {
        if (effects[effectType] !== undefined) {
          // Staking effects override or modify base effects
          effects[effectType] = value;
        } else {
          effects[effectType] = value;
        }
      });
    }
  });
  
  return effects;
};

export default {
  STAKING_POOLS,
  GOVERNANCE_SYSTEM,
  ECONOMIC_EVENTS,
  CROSS_PLAYER_MECHANICS,
  PLAY_TO_EARN_MECHANICS,
  STAKING_CALCULATIONS
};
