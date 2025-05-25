export const DYNASTY_TIERS = {
  STARTUP: {
    id: 'startup',
    name: 'Startup Dynasty',
    icon: '🌱',
    minNetWorth: 0,
    maxNetWorth: 100000,
    legacyPointsPerMonth: 1,
    traitSlots: 1,
    description: 'A budding entrepreneurial family just starting their journey'
  },
  EMERGING: {
    id: 'emerging',
    name: 'Emerging Empire',
    icon: '🏢',
    minNetWorth: 100000,
    maxNetWorth: 1000000,
    legacyPointsPerMonth: 3,
    traitSlots: 2,
    description: 'Growing business family with expanding influence'
  },
  ESTABLISHED: {
    id: 'established',
    name: 'Established Dynasty',
    icon: '🏛️',
    minNetWorth: 1000000,
    maxNetWorth: 10000000,
    legacyPointsPerMonth: 5,
    traitSlots: 3,
    description: 'Well-established business dynasty with significant market presence'
  },
  POWERHOUSE: {
    id: 'powerhouse',
    name: 'Business Powerhouse',
    icon: '👑',
    minNetWorth: 10000000,
    maxNetWorth: 100000000,
    legacyPointsPerMonth: 8,
    traitSlots: 4,
    description: 'Dominant force in multiple industries with global reach'
  },
  LEGENDARY: {
    id: 'legendary',
    name: 'Legendary Empire',
    icon: '⭐',
    minNetWorth: 100000000,
    maxNetWorth: Infinity,
    legacyPointsPerMonth: 12,
    traitSlots: 5,
    description: 'Legendary business empire that shapes entire economies'
  }
};

export const DYNASTY_TRAITS = {
  // Economic Traits
  FINANCIAL_GENIUS: {
    id: 'financial_genius',
    name: 'Financial Genius',
    category: 'economic',
    icon: '💰',
    cost: 10,
    effects: {
      investmentReturns: 0.15,
      bankingBonuses: 0.20,
      riskReduction: 10
    },
    description: 'Exceptional financial acumen runs in the family',
    requirements: { totalRevenue: 1000000 }
  },
  MARKET_MANIPULATOR: {
    id: 'market_manipulator',
    name: 'Market Manipulator',
    category: 'economic',
    icon: '📈',
    cost: 15,
    effects: {
      marketInfluence: 0.25,
      competitorWeakening: 0.10,
      priceControl: 0.15
    },
    description: 'Ability to influence market conditions and competitor performance',
    requirements: { marketShare: 0.3, businesses: 10 }
  },
  RESOURCE_MONOPOLIST: {
    id: 'resource_monopolist',
    name: 'Resource Monopolist',
    category: 'economic',
    icon: '⛏️',
    cost: 20,
    effects: {
      resourceCostReduction: 0.30,
      supplyChainControl: 0.40,
      exclusiveDeals: 3
    },
    description: 'Dominance over key resource supply chains',
    requirements: { supplyChainEfficiency: 0.9, resourceBusinesses: 5 }
  },

  // Innovation Traits
  TECH_PIONEER: {
    id: 'tech_pioneer',
    name: 'Technology Pioneer',
    category: 'innovation',
    icon: '🚀',
    cost: 12,
    effects: {
      researchSpeed: 0.50,
      innovationBonus: 0.30,
      techAdoptionAdvantage: 0.25
    },
    description: 'Always at the forefront of technological advancement',
    requirements: { techLevel: 8, technologyBusinesses: 3 }
  },
  DISRUPTOR: {
    id: 'disruptor',
    name: 'Industry Disruptor',
    category: 'innovation',
    icon: '💥',
    cost: 18,
    effects: {
      newIndustryBonus: 0.40,
      competitorDisruption: 0.20,
      marketCreation: 2
    },
    description: 'Ability to create entirely new markets and disrupt existing ones',
    requirements: { industriesEntered: 8, disruptiveInnovations: 3 }
  },
  PATENT_KING: {
    id: 'patent_king',
    name: 'Patent Royalty',
    category: 'innovation',
    icon: '📜',
    cost: 14,
    effects: {
      patentIncome: 0.25,
      intellectualPropertyValue: 0.35,
      licensingDeals: 5
    },
    description: 'Extensive patent portfolio generating passive income',
    requirements: { patents: 10, licensingRevenue: 500000 }
  },

  // Social Traits
  POLITICAL_INFLUENCE: {
    id: 'political_influence',
    name: 'Political Influence',
    category: 'social',
    icon: '🏛️',
    cost: 16,
    effects: {
      regulatoryAdvantage: 0.30,
      governmentContracts: 0.40,
      policyInfluence: 0.20
    },
    description: 'Significant influence over government policies and regulations',
    requirements: { politicalConnections: 50, lobbyingSpent: 1000000 }
  },
  MEDIA_MOGUL: {
    id: 'media_mogul',
    name: 'Media Empire',
    category: 'social',
    icon: '📺',
    cost: 13,
    effects: {
      brandInfluence: 0.35,
      publicOpinionControl: 0.25,
      crisisManagement: 0.40
    },
    description: 'Control over media narrative and public perception',
    requirements: { mediaBusinesses: 3, brandValue: 0.8 }
  },
  SOCIAL_ARCHITECT: {
    id: 'social_architect',
    name: 'Social Architect',
    category: 'social',
    icon: '🌐',
    cost: 11,
    effects: {
      communityEngagement: 0.30,
      socialMovements: 0.20,
      culturalImpact: 0.25
    },
    description: 'Ability to shape social trends and cultural movements',
    requirements: { socialFollowers: 100000, communityProjects: 5 }
  },

  // Operational Traits
  EFFICIENCY_MASTER: {
    id: 'efficiency_master',
    name: 'Efficiency Master',
    category: 'operational',
    icon: '⚙️',
    cost: 9,
    effects: {
      operationalEfficiency: 0.25,
      costReduction: 0.20,
      automationBonus: 0.30
    },
    description: 'Unparalleled operational efficiency across all businesses',
    requirements: { averageEfficiency: 0.85, automationLevel: 0.6 }
  },
  GLOBAL_NETWORK: {
    id: 'global_network',
    name: 'Global Network',
    category: 'operational',
    icon: '🌍',
    cost: 17,
    effects: {
      internationalExpansion: 0.40,
      crossBorderSynergies: 0.25,
      globalSupplyChain: 0.35
    },
    description: 'Extensive global business network and operations',
    requirements: { internationalBusinesses: 10, globalPresence: 0.7 }
  },
  TALENT_MAGNET: {
    id: 'talent_magnet',
    name: 'Talent Magnet',
    category: 'operational',
    icon: '🧲',
    cost: 12,
    effects: {
      staffQuality: 0.30,
      retentionBonus: 0.40,
      recruitmentAdvantage: 0.25
    },
    description: 'Attracts and retains the best talent in every industry',
    requirements: { topTierStaff: 20, staffSatisfaction: 0.9 }
  },

  // Legacy Traits
  GENERATIONAL_WEALTH: {
    id: 'generational_wealth',
    name: 'Generational Wealth',
    category: 'legacy',
    icon: '💎',
    cost: 25,
    effects: {
      wealthPreservation: 0.50,
      inheritanceBonus: 0.30,
      familyTrustFund: 0.40
    },
    description: 'Wealth that grows and preserves across generations',
    requirements: { netWorth: 50000000, generations: 2 }
  },
  DYNASTY_BUILDER: {
    id: 'dynasty_builder',
    name: 'Dynasty Builder',
    category: 'legacy',
    icon: '🏰',
    cost: 30,
    effects: {
      legacyProjectBonus: 0.50,
      dynastyInfluence: 0.40,
      historicalImpact: 0.35
    },
    description: 'Master of building lasting business dynasties',
    requirements: { legacyProjects: 5, dynastyAge: 10 }
  },
  IMMORTAL_BRAND: {
    id: 'immortal_brand',
    name: 'Immortal Brand',
    category: 'legacy',
    icon: '♾️',
    cost: 35,
    effects: {
      brandImmortality: 0.60,
      culturalLegacy: 0.45,
      timelessValue: 0.50
    },
    description: 'Brand that transcends time and becomes part of culture',
    requirements: { brandAge: 20, culturalImpact: 0.8, brandRecognition: 0.95 }
  }
};

export const LEGACY_PROJECTS = {
  BUSINESS_UNIVERSITY: {
    id: 'business_university',
    name: 'Dynasty Business University',
    category: 'education',
    icon: '🎓',
    cost: 5000000,
    legacyPointCost: 50,
    duration: 2160, // 90 days
    requirements: {
      netWorth: 10000000,
      educationLevel: 'masters',
      businesses: 15
    },
    effects: {
      staffQualityBonus: 0.40,
      researchSpeed: 0.30,
      innovationRate: 0.25,
      industryInfluence: 0.20
    },
    ongoingBenefits: {
      monthlyLegacyPoints: 5,
      talentPipeline: 10,
      researchGrants: 100000
    },
    description: 'Establish a world-class business university to train future leaders'
  },

  INNOVATION_FOUNDATION: {
    id: 'innovation_foundation',
    name: 'Innovation Research Foundation',
    category: 'research',
    icon: '🔬',
    cost: 8000000,
    legacyPointCost: 75,
    duration: 2880, // 120 days
    requirements: {
      techLevel: 10,
      patents: 25,
      researchSpending: 5000000
    },
    effects: {
      technologyAdvancement: 0.50,
      patentGeneration: 0.60,
      industryDisruption: 0.35,
      futureProofing: 0.40
    },
    ongoingBenefits: {
      monthlyPatents: 3,
      researchBreakthroughs: 2,
      techLicensing: 200000
    },
    description: 'Create a foundation dedicated to breakthrough innovations'
  },

  GLOBAL_CHARITY: {
    id: 'global_charity',
    name: 'Global Humanitarian Foundation',
    category: 'philanthropy',
    icon: '🌍',
    cost: 15000000,
    legacyPointCost: 100,
    duration: 4320, // 180 days
    requirements: {
      netWorth: 50000000,
      socialImpact: 0.7,
      globalPresence: 0.8
    },
    effects: {
      globalReputation: 0.60,
      socialLicense: 0.50,
      governmentRelations: 0.40,
      brandLoyalty: 0.35
    },
    ongoingBenefits: {
      monthlyReputation: 10,
      taxBenefits: 500000,
      socialCapital: 15
    },
    description: 'Establish a global foundation addressing major humanitarian challenges'
  },

  SPACE_PROGRAM: {
    id: 'space_program',
    name: 'Private Space Program',
    category: 'exploration',
    icon: '🚀',
    cost: 50000000,
    legacyPointCost: 200,
    duration: 8760, // 365 days
    requirements: {
      netWorth: 100000000,
      aerospaceBusinesses: 3,
      techLevel: 15
    },
    effects: {
      technologicalLeadership: 0.80,
      futureIndustries: 0.70,
      globalPrestige: 0.90,
      scientificAdvancement: 0.60
    },
    ongoingBenefits: {
      monthlyTechAdvancement: 20,
      spaceCommerce: 1000000,
      scientificBreakthroughs: 5
    },
    description: 'Launch a private space exploration and commercialization program'
  },

  SUSTAINABLE_CITIES: {
    id: 'sustainable_cities',
    name: 'Sustainable Smart Cities Initiative',
    category: 'infrastructure',
    icon: '🏙️',
    cost: 25000000,
    legacyPointCost: 150,
    duration: 5760, // 240 days
    requirements: {
      realEstateBusinesses: 5,
      sustainabilityRating: 0.8,
      urbanPlanningExperience: 3
    },
    effects: {
      urbanInfluence: 0.70,
      sustainabilityLeadership: 0.60,
      infrastructureControl: 0.50,
      futureProofing: 0.45
    },
    ongoingBenefits: {
      monthlyUrbanContracts: 2000000,
      sustainabilityCredits: 100000,
      smartCityRoyalties: 500000
    },
    description: 'Develop sustainable smart cities as models for the future'
  },

  ECONOMIC_THINK_TANK: {
    id: 'economic_think_tank',
    name: 'Global Economic Policy Institute',
    category: 'policy',
    icon: '📊',
    cost: 12000000,
    legacyPointCost: 80,
    duration: 3600, // 150 days
    requirements: {
      economicInfluence: 0.6,
      policyConnections: 30,
      academicPartnerships: 5
    },
    effects: {
      economicInfluence: 0.50,
      policyShaping: 0.60,
      marketPrediction: 0.40,
      regulatoryAdvantage: 0.35
    },
    ongoingBenefits: {
      monthlyPolicyInfluence: 8,
      economicForecasts: 3,
      regulatoryInsights: 5
    },
    description: 'Establish an influential economic policy research institute'
  }
};

export const DYNASTY_FOCUSES = {
  TECHNOLOGICAL_SUPREMACY: {
    id: 'technological_supremacy',
    name: 'Technological Supremacy',
    icon: '🔬',
    description: 'Focus on becoming the leading technological innovator',
    bonuses: {
      technologyBusinesses: 0.40,
      researchSpeed: 0.30,
      patentValue: 0.25
    },
    penalties: {
      traditionalBusinesses: -0.10
    },
    requirements: {
      techLevel: 5,
      technologyBusinesses: 3
    }
  },
  FINANCIAL_DOMINANCE: {
    id: 'financial_dominance',
    name: 'Financial Dominance',
    icon: '💰',
    description: 'Focus on controlling financial markets and institutions',
    bonuses: {
      financeBusinesses: 0.35,
      investmentReturns: 0.30,
      bankingInfluence: 0.40
    },
    penalties: {
      manufacturingBusinesses: -0.15
    },
    requirements: {
      financeBusinesses: 3,
      netWorth: 5000000
    }
  },
  GLOBAL_EXPANSION: {
    id: 'global_expansion',
    name: 'Global Expansion',
    icon: '🌍',
    description: 'Focus on international growth and global presence',
    bonuses: {
      internationalBusinesses: 0.50,
      crossBorderSynergies: 0.25,
      culturalAdaptation: 0.30
    },
    penalties: {
      localMarketShare: -0.10
    },
    requirements: {
      internationalBusinesses: 5,
      globalPresence: 0.4
    }
  },
  SOCIAL_IMPACT: {
    id: 'social_impact',
    name: 'Social Impact',
    icon: '🤝',
    description: 'Focus on creating positive social and environmental change',
    bonuses: {
      sustainabilityRating: 0.40,
      socialLicense: 0.35,
      brandLoyalty: 0.25
    },
    penalties: {
      shortTermProfits: -0.15
    },
    requirements: {
      socialImpact: 0.5,
      sustainabilityRating: 0.6
    }
  },
  MARKET_MANIPULATION: {
    id: 'market_manipulation',
    name: 'Market Control',
    icon: '🎯',
    description: 'Focus on controlling and manipulating market conditions',
    bonuses: {
      marketInfluence: 0.45,
      competitorWeakening: 0.30,
      priceControl: 0.25
    },
    penalties: {
      publicReputation: -0.20,
      regulatoryScrutiny: 0.30
    },
    requirements: {
      marketShare: 0.25,
      marketInfluence: 0.3
    }
  }
};

export const GENERATIONAL_PROGRESSION = {
  FIRST_GENERATION: {
    id: 'first_generation',
    name: 'Founding Generation',
    icon: '🌱',
    bonuses: {
      entrepreneurialSpirit: 0.30,
      riskTolerance: 0.25,
      innovationDrive: 0.20
    },
    challenges: {
      resourceLimitations: 0.20,
      networkLimitations: 0.15,
      experienceGap: 0.25
    }
  },
  SECOND_GENERATION: {
    id: 'second_generation',
    name: 'Expansion Generation',
    icon: '🏢',
    bonuses: {
      inheritedWealth: 0.25,
      establishedNetworks: 0.20,
      businessAcumen: 0.15
    },
    challenges: {
      expectationPressure: 0.15,
      complacencyRisk: 0.10,
      innovationStagnation: 0.20
    }
  },
  THIRD_GENERATION: {
    id: 'third_generation',
    name: 'Consolidation Generation',
    icon: '👑',
    bonuses: {
      institutionalKnowledge: 0.30,
      establishedBrand: 0.25,
      politicalConnections: 0.20
    },
    challenges: {
      bureaucraticInertia: 0.25,
      familyConflicts: 0.20,
      marketDisconnection: 0.15
    }
  },
  FOURTH_GENERATION_PLUS: {
    id: 'fourth_generation_plus',
    name: 'Legacy Generation',
    icon: '⭐',
    bonuses: {
      dynasticPower: 0.40,
      culturalInfluence: 0.35,
      institutionalControl: 0.30
    },
    challenges: {
      wealthDilution: 0.30,
      purposeLoss: 0.25,
      adaptationStruggles: 0.35
    }
  }
};

// Helper functions
export const calculateDynastyTier = (netWorth) => {
  return Object.values(DYNASTY_TIERS).find(tier =>
    netWorth >= tier.minNetWorth && netWorth < tier.maxNetWorth
  ) || DYNASTY_TIERS.LEGENDARY;
};

export const getAvailableTraits = (dynasty, playerStats) => {
  const currentTier = calculateDynastyTier(playerStats.netWorth);
  const availableSlots = currentTier.traitSlots - (dynasty.traits?.length || 0);

  if (availableSlots <= 0) return [];

  return Object.values(DYNASTY_TRAITS).filter(trait => {
    // Check if already owned
    if (dynasty.traits?.includes(trait.id)) return false;

    // Check requirements
    if (trait.requirements) {
      const reqs = trait.requirements;

      if (reqs.totalRevenue && playerStats.totalRevenue < reqs.totalRevenue) return false;
      if (reqs.netWorth && playerStats.netWorth < reqs.netWorth) return false;
      if (reqs.businesses && playerStats.businesses.length < reqs.businesses) return false;
      if (reqs.techLevel && (playerStats.techLevel || 0) < reqs.techLevel) return false;
      if (reqs.marketShare && (playerStats.marketShare || 0) < reqs.marketShare) return false;
    }

    // Check if player can afford
    return dynasty.legacyPoints >= trait.cost;
  });
};

export const getAvailableLegacyProjects = (dynasty, playerStats) => {
  return Object.values(LEGACY_PROJECTS).filter(project => {
    // Check if already completed
    if (dynasty.completedProjects?.includes(project.id)) return false;

    // Check requirements
    if (project.requirements) {
      const reqs = project.requirements;

      if (reqs.netWorth && playerStats.netWorth < reqs.netWorth) return false;
      if (reqs.businesses && playerStats.businesses.length < reqs.businesses) return false;
      if (reqs.techLevel && (playerStats.techLevel || 0) < reqs.techLevel) return false;
    }

    // Check if player can afford
    return playerStats.points >= project.cost && dynasty.legacyPoints >= project.legacyPointCost;
  });
};

export const calculateDynastyBonuses = (dynasty) => {
  const bonuses = {
    income: 1.0,
    efficiency: 1.0,
    innovation: 1.0,
    influence: 1.0,
    risk: 1.0
  };

  // Apply trait bonuses
  dynasty.traits?.forEach(traitId => {
    const trait = DYNASTY_TRAITS[traitId.toUpperCase()];
    if (trait) {
      Object.entries(trait.effects).forEach(([effect, value]) => {
        if (bonuses[effect] !== undefined) {
          bonuses[effect] += value;
        }
      });
    }
  });

  // Apply focus bonuses
  if (dynasty.focus) {
    const focus = DYNASTY_FOCUSES[dynasty.focus.toUpperCase()];
    if (focus) {
      Object.entries(focus.bonuses).forEach(([bonus, value]) => {
        if (bonuses[bonus] !== undefined) {
          bonuses[bonus] += value;
        }
      });
    }
  }

  // Apply generational bonuses/penalties
  const generation = GENERATIONAL_PROGRESSION[dynasty.generation?.toUpperCase()];
  if (generation) {
    Object.entries(generation.bonuses).forEach(([bonus, value]) => {
      if (bonuses[bonus] !== undefined) {
        bonuses[bonus] += value;
      }
    });
  }

  return bonuses;
};

export const simulateDynastyProgression = (dynasty, monthsElapsed) => {
  const updatedDynasty = { ...dynasty };

  // Gain legacy points
  const tier = calculateDynastyTier(dynasty.netWorth || 0);
  updatedDynasty.legacyPoints = (updatedDynasty.legacyPoints || 0) +
    (tier.legacyPointsPerMonth * monthsElapsed);

  // Age the dynasty
  updatedDynasty.age = (updatedDynasty.age || 0) + monthsElapsed;

  // Check for generational progression
  const yearsElapsed = updatedDynasty.age / 12;
  if (yearsElapsed >= 25 && !updatedDynasty.generation) {
    updatedDynasty.generation = 'second_generation';
  } else if (yearsElapsed >= 50 && updatedDynasty.generation === 'second_generation') {
    updatedDynasty.generation = 'third_generation';
  } else if (yearsElapsed >= 75 && updatedDynasty.generation === 'third_generation') {
    updatedDynasty.generation = 'fourth_generation_plus';
  }

  return updatedDynasty;
};

export const calculateLegacyScore = (dynasty, playerStats) => {
  let score = 0;

  // Base score from net worth
  score += Math.log10(playerStats.netWorth || 1) * 100;

  // Bonus from traits
  score += (dynasty.traits?.length || 0) * 500;

  // Bonus from completed legacy projects
  score += (dynasty.completedProjects?.length || 0) * 1000;

  // Bonus from dynasty age
  score += (dynasty.age || 0) * 10;

  // Bonus from businesses
  score += playerStats.businesses.length * 50;

  // Bonus from social impact
  score += (playerStats.socialImpact || 0) * 1000;

  return Math.round(score);
};

export const getDynastyInsights = (dynasty, playerStats) => {
  const insights = [];
  const tier = calculateDynastyTier(playerStats.netWorth);
  const legacyScore = calculateLegacyScore(dynasty, playerStats);

  // Tier progression insights
  const nextTier = Object.values(DYNASTY_TIERS).find(t => t.minNetWorth > tier.minNetWorth);
  if (nextTier) {
    const remaining = nextTier.minNetWorth - playerStats.netWorth;
    insights.push({
      type: 'progression',
      message: `${remaining.toLocaleString()} points needed to reach ${nextTier.name}`,
      priority: 'high'
    });
  }

  // Trait recommendations
  const availableTraits = getAvailableTraits(dynasty, playerStats);
  if (availableTraits.length > 0) {
    insights.push({
      type: 'traits',
      message: `${availableTraits.length} dynasty traits available for purchase`,
      priority: 'medium'
    });
  }

  // Legacy project opportunities
  const availableProjects = getAvailableLegacyProjects(dynasty, playerStats);
  if (availableProjects.length > 0) {
    insights.push({
      type: 'projects',
      message: `${availableProjects.length} legacy projects ready to launch`,
      priority: 'high'
    });
  }

  // Generational progression
  const yearsElapsed = (dynasty.age || 0) / 12;
  if (yearsElapsed >= 24 && !dynasty.generation) {
    insights.push({
      type: 'generation',
      message: 'Dynasty approaching second generation transition',
      priority: 'high'
    });
  }

  return insights;
}; 