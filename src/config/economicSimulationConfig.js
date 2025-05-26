// Economic Simulation Configuration
// Implements real-time market dynamics, inflation, and interconnected business systems

export const ECONOMIC_CONFIG = {
  // Base inflation rate (monthly)
  BASE_INFLATION: 0.02, // 2%
  STAKING_INFLATION_REDUCTION: 0.0005, // 0.05% per 1000 TON staked
  
  // Market dynamics
  MARKET_VOLATILITY: 0.15, // 15% price fluctuation range
  SUPPLY_SHORTAGE_THRESHOLD: 0.3, // When supply drops below 30%
  DEMAND_SURGE_THRESHOLD: 1.5, // When demand exceeds 150% of supply
  
  // Economic classes and thresholds
  ECONOMIC_CLASSES: {
    POOR: { min: 0, max: 50000, label: 'Working Class', color: '#8B5A2B' },
    MIDDLE: { min: 50001, max: 250000, label: 'Middle Class', color: '#4A90E2' },
    UPPER_MIDDLE: { min: 250001, max: 1000000, label: 'Upper Middle Class', color: '#7ED321' },
    WEALTHY: { min: 1000001, max: 10000000, label: 'Wealthy', color: '#F5A623' },
    ULTRA_RICH: { min: 10000001, max: Infinity, label: 'Ultra Rich', color: '#BD10E0' }
  },
  
  // Daily login rewards (TON)
  DAILY_LOGIN_REWARDS: {
    NO_BUSINESS: 0,
    SMALL_BUSINESS: 0.005, // 1-3 businesses
    MEDIUM_BUSINESS: 0.01, // 4-10 businesses
    LARGE_BUSINESS: 0.02, // 11+ businesses
    EMPIRE: 0.05 // 25+ businesses + high staking
  }
};

export const INDUSTRY_CLUSTERS = {
  TECHNOLOGY: {
    id: 'tech_cluster',
    name: 'Technology Hub',
    industries: ['software', 'hardware', 'ai', 'blockchain'],
    synergies: {
      innovation_speed: 1.25,
      research_sharing: 0.15,
      talent_pool: 1.3
    },
    requirements: {
      min_businesses: 3,
      min_players: 2
    }
  },
  
  AGRICULTURE: {
    id: 'agri_cluster',
    name: 'Agricultural Valley',
    industries: ['farming', 'livestock', 'food_processing'],
    synergies: {
      supply_efficiency: 1.2,
      cost_reduction: 0.1,
      seasonal_stability: 1.15
    },
    requirements: {
      min_businesses: 2,
      min_players: 2
    }
  },
  
  FINANCE: {
    id: 'finance_cluster',
    name: 'Financial District',
    industries: ['banking', 'insurance', 'investment'],
    synergies: {
      capital_access: 1.4,
      risk_reduction: 0.15,
      market_influence: 1.25
    },
    requirements: {
      min_businesses: 4,
      min_players: 3
    }
  },
  
  MANUFACTURING: {
    id: 'manufacturing_cluster',
    name: 'Industrial Zone',
    industries: ['manufacturing', 'automotive', 'aerospace'],
    synergies: {
      production_efficiency: 1.3,
      supply_chain: 1.2,
      bulk_discounts: 0.12
    },
    requirements: {
      min_businesses: 3,
      min_players: 2
    }
  }
};

export const SUPPLY_CHAIN_DEPENDENCIES = {
  restaurant: {
    requires: ['farming', 'food_processing'],
    impact_multiplier: 1.5,
    shortage_penalty: 0.3
  },
  tech_company: {
    requires: ['manufacturing', 'rare_metals'],
    impact_multiplier: 1.3,
    shortage_penalty: 0.25
  },
  real_estate: {
    requires: ['construction', 'materials'],
    impact_multiplier: 1.4,
    shortage_penalty: 0.35
  },
  manufacturing: {
    requires: ['raw_materials', 'energy'],
    impact_multiplier: 1.6,
    shortage_penalty: 0.4
  },
  retail: {
    requires: ['manufacturing', 'logistics'],
    impact_multiplier: 1.2,
    shortage_penalty: 0.2
  }
};

export const ECONOMIC_EVENTS = {
  MARKET_CRASH: {
    id: 'market_crash',
    name: 'Market Crash',
    description: 'Global economic downturn affects all businesses',
    probability: 0.05, // 5% chance per month
    duration: { min: 30, max: 90 }, // days
    effects: {
      business_income: -0.4,
      property_values: -0.25,
      unemployment: 0.3,
      staker_protection: 0.5 // 50% protection for stakers
    },
    triggers: ['high_inflation', 'political_instability']
  },
  
  INNOVATION_BOOM: {
    id: 'innovation_boom',
    name: 'Innovation Boom',
    description: 'Technological breakthrough drives economic growth',
    probability: 0.03, // 3% chance per month
    duration: { min: 60, max: 120 },
    effects: {
      tech_income: 0.8,
      research_speed: 1.5,
      innovation_fund_bonus: 2.0,
      market_growth: 0.3
    },
    triggers: ['high_research_investment', 'tech_cluster_active']
  },
  
  INFRASTRUCTURE_CRISIS: {
    id: 'infrastructure_crisis',
    name: 'Infrastructure Crisis',
    description: 'Critical infrastructure failures disrupt economy',
    probability: 0.04, // 4% chance per month
    duration: { min: 45, max: 75 },
    effects: {
      logistics_cost: 0.5,
      manufacturing_penalty: -0.3,
      infrastructure_staker_bonus: 1.5,
      repair_opportunities: 0.4
    },
    triggers: ['low_infrastructure_investment', 'aging_systems']
  },
  
  RESOURCE_SHORTAGE: {
    id: 'resource_shortage',
    name: 'Resource Shortage',
    description: 'Critical resource becomes scarce',
    probability: 0.06, // 6% chance per month
    duration: { min: 20, max: 60 },
    effects: {
      supply_chain_disruption: 0.6,
      price_inflation: 0.25,
      alternative_innovation: 0.3
    },
    affected_industries: ['manufacturing', 'construction', 'energy']
  },
  
  REGULATORY_CHANGE: {
    id: 'regulatory_change',
    name: 'Regulatory Change',
    description: 'New government policies affect business environment',
    probability: 0.08, // 8% chance per month
    duration: { min: 90, max: 180 },
    effects: {
      compliance_costs: 0.15,
      market_opportunities: 0.2,
      political_influence_factor: 1.3
    },
    voting_influence: true // Can be influenced by governance votes
  }
};

export const COMMUNITY_PROJECTS = {
  RESEARCH_CENTER: {
    id: 'research_center',
    name: 'Community Research Center',
    description: 'Accelerates innovation for all participants',
    cost: 50000, // TON
    duration: 90, // days to complete
    benefits: {
      research_speed: 1.4,
      innovation_sharing: 0.2,
      tech_cluster_bonus: 1.15
    },
    requirements: {
      min_participants: 10,
      min_voting_power: 5000
    }
  },
  
  INFRASTRUCTURE_UPGRADE: {
    id: 'infrastructure_upgrade',
    name: 'Smart Infrastructure Network',
    description: 'Improves efficiency and reduces crisis probability',
    cost: 100000,
    duration: 120,
    benefits: {
      logistics_efficiency: 1.3,
      crisis_resistance: 0.4,
      energy_savings: 0.15
    },
    requirements: {
      min_participants: 20,
      min_voting_power: 10000
    }
  },
  
  EDUCATION_INITIATIVE: {
    id: 'education_initiative',
    name: 'Global Education Initiative',
    description: 'Improves workforce quality and reduces inequality',
    cost: 75000,
    duration: 150,
    benefits: {
      skill_development: 1.5,
      income_equality: 0.2,
      social_mobility: 1.25
    },
    requirements: {
      min_participants: 15,
      min_voting_power: 7500
    }
  }
};

export const ACHIEVEMENT_REWARDS = {
  // Major milestone achievements that convert to TON
  FIRST_BUSINESS: { ton_reward: 0.1, title: 'Entrepreneur' },
  MILLIONAIRE: { ton_reward: 1.0, title: 'Millionaire' },
  BUSINESS_EMPIRE: { ton_reward: 5.0, title: 'Business Mogul', requirement: '10+ businesses' },
  STAKING_VETERAN: { ton_reward: 2.0, title: 'Staking Expert', requirement: '100+ days staked' },
  GOVERNANCE_LEADER: { ton_reward: 3.0, title: 'Community Leader', requirement: '10+ proposals' },
  MARKET_INFLUENCER: { ton_reward: 4.0, title: 'Market Maker', requirement: 'Top 1% wealth' },
  INNOVATION_PIONEER: { ton_reward: 2.5, title: 'Tech Innovator', requirement: 'Lead 3+ tech businesses' },
  SOCIAL_CHAMPION: { ton_reward: 1.5, title: 'Social Impact', requirement: 'Fund 5+ community projects' }
};

// Economic Calculation Functions
export class EconomicSimulator {
  static calculateInflationRate(totalStaked, baseRate = ECONOMIC_CONFIG.BASE_INFLATION) {
    const stakingReduction = (totalStaked / 1000) * ECONOMIC_CONFIG.STAKING_INFLATION_REDUCTION;
    return Math.max(0.005, baseRate - stakingReduction); // Minimum 0.5% inflation
  }
  
  static calculateMarketPrice(basePrice, supplyLevel, demandLevel, volatility = ECONOMIC_CONFIG.MARKET_VOLATILITY) {
    const supplyDemandRatio = demandLevel / Math.max(supplyLevel, 0.1);
    const priceMultiplier = 1 + (supplyDemandRatio - 1) * 0.5;
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    return basePrice * priceMultiplier * randomFactor;
  }
  
  static getEconomicClass(totalWealth) {
    for (const [className, range] of Object.entries(ECONOMIC_CONFIG.ECONOMIC_CLASSES)) {
      if (totalWealth >= range.min && totalWealth <= range.max) {
        return { class: className, ...range };
      }
    }
    return ECONOMIC_CONFIG.ECONOMIC_CLASSES.POOR;
  }
  
  static calculatePoliticalInfluence(economicClass, stakingPower, achievements) {
    const classMultiplier = {
      POOR: 1,
      MIDDLE: 1.2,
      UPPER_MIDDLE: 1.5,
      WEALTHY: 2.0,
      ULTRA_RICH: 3.0
    };
    
    const baseInfluence = classMultiplier[economicClass] || 1;
    const stakingBonus = Math.log10(stakingPower + 1) * 0.1;
    const achievementBonus = achievements.length * 0.05;
    
    return baseInfluence + stakingBonus + achievementBonus;
  }
  
  static calculateDailyLoginReward(businesses, stakingTier) {
    const businessCount = businesses.length;
    const totalStaked = stakingTier.totalStaked || 0;
    
    if (businessCount === 0) return ECONOMIC_CONFIG.DAILY_LOGIN_REWARDS.NO_BUSINESS;
    
    if (businessCount >= 25 && totalStaked >= 10000) {
      return ECONOMIC_CONFIG.DAILY_LOGIN_REWARDS.EMPIRE;
    } else if (businessCount >= 11) {
      return ECONOMIC_CONFIG.DAILY_LOGIN_REWARDS.LARGE_BUSINESS;
    } else if (businessCount >= 4) {
      return ECONOMIC_CONFIG.DAILY_LOGIN_REWARDS.MEDIUM_BUSINESS;
    } else {
      return ECONOMIC_CONFIG.DAILY_LOGIN_REWARDS.SMALL_BUSINESS;
    }
  }
  
  static processEconomicEvent(event, gameState) {
    const effects = { ...event.effects };
    const affectedPlayers = [];
    
    // Apply event effects based on staking status
    if (event.id === 'market_crash' && effects.staker_protection) {
      // Stakers get protection from market crash
      const stakingProtection = effects.staker_protection;
      effects.business_income_stakers = effects.business_income * (1 - stakingProtection);
    }
    
    if (event.id === 'innovation_boom' && effects.innovation_fund_bonus) {
      // Innovation Fund stakers get massive bonuses
      effects.innovation_staker_bonus = effects.innovation_fund_bonus;
    }
    
    if (event.id === 'infrastructure_crisis' && effects.infrastructure_staker_bonus) {
      // Infrastructure stakers provide stability
      effects.infrastructure_protection = effects.infrastructure_staker_bonus;
    }
    
    return {
      ...event,
      effects,
      startDate: new Date(),
      endDate: new Date(Date.now() + (event.duration.min + Math.random() * (event.duration.max - event.duration.min)) * 24 * 60 * 60 * 1000)
    };
  }
  
  static calculateSupplyChainImpact(business, availableSupplies, globalMarket) {
    const dependencies = SUPPLY_CHAIN_DEPENDENCIES[business.type];
    if (!dependencies) return 1.0; // No dependencies
    
    let impactMultiplier = 1.0;
    let totalShortage = 0;
    
    dependencies.requires.forEach(resource => {
      const supply = availableSupplies[resource] || globalMarket[resource] || 1.0;
      if (supply < 1.0) {
        totalShortage += (1.0 - supply);
      }
    });
    
    if (totalShortage > 0) {
      const penalty = Math.min(totalShortage * dependencies.shortage_penalty, 0.8);
      impactMultiplier = 1.0 - penalty;
    }
    
    return Math.max(0.2, impactMultiplier * dependencies.impact_multiplier);
  }
  
  static calculateClusterBonus(playerBusinesses, industryCluster, communityStats) {
    const playerIndustries = playerBusinesses.map(b => b.type);
    const clusterIndustries = industryCluster.industries;
    
    const matchingIndustries = playerIndustries.filter(industry => 
      clusterIndustries.includes(industry)
    ).length;
    
    if (matchingIndustries < industryCluster.requirements.min_businesses) {
      return 1.0; // No bonus
    }
    
    if (communityStats.playersInCluster < industryCluster.requirements.min_players) {
      return 1.0; // Not enough players
    }
    
    // Calculate bonus based on cluster synergies
    const bonusMultiplier = Object.values(industryCluster.synergies)
      .reduce((total, bonus) => total + (typeof bonus === 'number' ? bonus : 0), 0) / 
      Object.keys(industryCluster.synergies).length;
    
    return Math.min(2.0, 1 + (bonusMultiplier - 1) * (matchingIndustries / clusterIndustries.length));
  }
}

export default {
  ECONOMIC_CONFIG,
  INDUSTRY_CLUSTERS,
  SUPPLY_CHAIN_DEPENDENCIES,
  ECONOMIC_EVENTS,
  COMMUNITY_PROJECTS,
  ACHIEVEMENT_REWARDS,
  EconomicSimulator
};
