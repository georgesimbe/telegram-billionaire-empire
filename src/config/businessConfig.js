export const BUSINESS_CATEGORIES = {
  FOOD_SERVICE: {
    id: 'food_service',
    name: 'Food & Beverage',
    icon: '🍕',
    description: 'Restaurants, cafes, and food delivery services',
    minCapital: 5000
  },
  RETAIL: {
    id: 'retail',
    name: 'Retail & Commerce',
    icon: '🛍️',
    description: 'Stores, shops, and e-commerce platforms',
    minCapital: 10000
  },
  TECHNOLOGY: {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Software, apps, and tech services',
    minCapital: 25000
  },
  REAL_ESTATE: {
    id: 'real_estate',
    name: 'Real Estate',
    icon: '🏢',
    description: 'Property development and management',
    minCapital: 100000
  },
  MANUFACTURING: {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    description: 'Production and industrial businesses',
    minCapital: 200000
  },
  FINANCE: {
    id: 'finance',
    name: 'Financial Services',
    icon: '💰',
    description: 'Banks, investment firms, and fintech',
    minCapital: 500000
  },
  ENTERTAINMENT: {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    description: 'Media, gaming, and entertainment venues',
    minCapital: 150000
  },
  HEALTHCARE: {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical services and health tech',
    minCapital: 300000
  },
  ENERGY: {
    id: 'energy',
    name: 'Energy & Utilities',
    icon: '⚡',
    description: 'Power generation and utility services',
    minCapital: 1000000
  },
  AEROSPACE: {
    id: 'aerospace',
    name: 'Aerospace',
    icon: '🚀',
    description: 'Space exploration and aviation',
    minCapital: 10000000
  }
};

export const BUSINESSES_CONFIG = {
  // Food Service
  LEMONADE_STAND: {
    id: 'LEMONADE_STAND',
    name: 'Lemonade Stand',
    description: 'A simple roadside lemonade stand. Your first step into entrepreneurship.',
    icon: '🍋',
    category: 'food_service',
    sizes: {
      small: { cost: 500, income: 50, employees: 1 },
      medium: { cost: 2000, income: 150, employees: 3 },
      large: { cost: 8000, income: 400, employees: 8 },
      multi: { cost: 25000, income: 1000, employees: 20 }
    },
    requirements: { capital: 500, creditScore: 300 },
    franchiseRequirement: { businesses: 3, capital: 15000 },
    newsEvents: ['weather', 'local_events'],
    upgrades: ['better_lemons', 'fancy_stand', 'marketing_signs']
  },

  PIZZA_SHOP: {
    id: 'PIZZA_SHOP',
    name: 'Pizza Shop',
    description: 'A cozy neighborhood pizza place serving fresh, hot pizzas.',
    icon: '🍕',
    category: 'food_service',
    baseCost: 500,
    baseIncome: 25,
    costMultiplier: 1.4,
    incomeMultiplier: 1.3,
    unlockLevel: 2,
    maxLevel: 80,
    franchiseLevel: 12,
    staffRequired: 8,
    managerLevel: 18,
    newsEvents: ['food_trends', 'health_regulations', 'ingredient_prices'],
    upgrades: ['wood_fired_oven', 'delivery_service', 'premium_ingredients']
  },

  COFFEE_CHAIN: {
    id: 'COFFEE_CHAIN',
    name: 'Coffee Chain',
    description: 'A trendy coffee shop chain serving artisanal coffee and pastries.',
    icon: '☕',
    category: 'food_service',
    baseCost: 2000,
    baseIncome: 80,
    costMultiplier: 1.5,
    incomeMultiplier: 1.4,
    unlockLevel: 4,
    maxLevel: 60,
    franchiseLevel: 15,
    staffRequired: 12,
    managerLevel: 20,
    newsEvents: ['coffee_prices', 'health_trends', 'competition'],
    upgrades: ['espresso_machines', 'loyalty_program', 'mobile_app']
  },

  // Retail
  CONVENIENCE_STORE: {
    id: 'CONVENIENCE_STORE',
    name: 'Convenience Store',
    description: 'A 24/7 convenience store serving the local community.',
    icon: '🏪',
    category: 'retail',
    baseCost: 1000,
    baseIncome: 40,
    costMultiplier: 1.4,
    incomeMultiplier: 1.25,
    unlockLevel: 3,
    maxLevel: 70,
    franchiseLevel: 12,
    staffRequired: 6,
    managerLevel: 16,
    newsEvents: ['local_economy', 'crime_rates', 'supplier_issues'],
    upgrades: ['security_system', 'self_checkout', 'expanded_inventory']
  },

  FASHION_BOUTIQUE: {
    id: 'FASHION_BOUTIQUE',
    name: 'Fashion Boutique',
    description: 'An upscale fashion store featuring the latest trends.',
    icon: '👗',
    category: 'retail',
    baseCost: 5000,
    baseIncome: 150,
    costMultiplier: 1.6,
    incomeMultiplier: 1.5,
    unlockLevel: 6,
    maxLevel: 50,
    franchiseLevel: 18,
    staffRequired: 10,
    managerLevel: 22,
    newsEvents: ['fashion_trends', 'economic_conditions', 'celebrity_endorsements'],
    upgrades: ['designer_collections', 'personal_styling', 'online_store']
  },

  // Technology
  APP_DEVELOPMENT: {
    id: 'APP_DEVELOPMENT',
    name: 'App Development Studio',
    description: 'A software development company creating mobile applications.',
    icon: '📱',
    category: 'technology',
    baseCost: 10000,
    baseIncome: 300,
    costMultiplier: 1.8,
    incomeMultiplier: 1.6,
    unlockLevel: 5,
    maxLevel: 40,
    franchiseLevel: 20,
    staffRequired: 15,
    managerLevel: 25,
    newsEvents: ['tech_trends', 'platform_updates', 'funding_rounds'],
    upgrades: ['ai_integration', 'cloud_infrastructure', 'security_features']
  },

  GAMING_STUDIO: {
    id: 'GAMING_STUDIO',
    name: 'Gaming Studio',
    description: 'An indie game development studio creating hit mobile games.',
    icon: '🎮',
    category: 'technology',
    baseCost: 25000,
    baseIncome: 600,
    costMultiplier: 2.0,
    incomeMultiplier: 1.8,
    unlockLevel: 8,
    maxLevel: 30,
    franchiseLevel: 25,
    staffRequired: 20,
    managerLevel: 30,
    newsEvents: ['gaming_trends', 'platform_policies', 'esports_growth'],
    upgrades: ['vr_development', 'multiplayer_servers', 'monetization_systems']
  },

  // Real Estate
  APARTMENT_COMPLEX: {
    id: 'APARTMENT_COMPLEX',
    name: 'Apartment Complex',
    description: 'A residential apartment building generating rental income.',
    icon: '🏠',
    category: 'real_estate',
    baseCost: 50000,
    baseIncome: 1000,
    costMultiplier: 1.7,
    incomeMultiplier: 1.4,
    unlockLevel: 8,
    maxLevel: 25,
    franchiseLevel: 15,
    staffRequired: 8,
    managerLevel: 20,
    newsEvents: ['housing_market', 'interest_rates', 'local_development'],
    upgrades: ['smart_home_tech', 'amenities_upgrade', 'energy_efficiency']
  },

  OFFICE_TOWER: {
    id: 'OFFICE_TOWER',
    name: 'Office Tower',
    description: 'A modern office building leased to corporate tenants.',
    icon: '🏢',
    category: 'real_estate',
    baseCost: 200000,
    baseIncome: 3000,
    costMultiplier: 2.2,
    incomeMultiplier: 1.6,
    unlockLevel: 15,
    maxLevel: 15,
    franchiseLevel: 10,
    staffRequired: 25,
    managerLevel: 35,
    newsEvents: ['commercial_real_estate', 'remote_work_trends', 'urban_planning'],
    upgrades: ['green_building_cert', 'high_speed_internet', 'conference_facilities']
  },

  // Manufacturing
  ELECTRONICS_FACTORY: {
    id: 'ELECTRONICS_FACTORY',
    name: 'Electronics Factory',
    description: 'A manufacturing facility producing consumer electronics.',
    icon: '🔌',
    category: 'manufacturing',
    baseCost: 100000,
    baseIncome: 2000,
    costMultiplier: 1.9,
    incomeMultiplier: 1.5,
    unlockLevel: 10,
    maxLevel: 20,
    franchiseLevel: 12,
    staffRequired: 50,
    managerLevel: 30,
    newsEvents: ['supply_chain', 'trade_policies', 'technology_advances'],
    upgrades: ['automation_systems', 'quality_control', 'lean_manufacturing']
  },

  // Finance
  INVESTMENT_FIRM: {
    id: 'INVESTMENT_FIRM',
    name: 'Investment Firm',
    description: 'A financial services company managing investment portfolios.',
    icon: '📈',
    category: 'finance',
    baseCost: 500000,
    baseIncome: 8000,
    costMultiplier: 2.5,
    incomeMultiplier: 2.0,
    unlockLevel: 15,
    maxLevel: 12,
    franchiseLevel: 8,
    staffRequired: 30,
    managerLevel: 40,
    newsEvents: ['market_volatility', 'regulatory_changes', 'economic_indicators'],
    upgrades: ['algorithmic_trading', 'risk_management', 'client_portal']
  },

  // Entertainment
  MOVIE_THEATER: {
    id: 'MOVIE_THEATER',
    name: 'Movie Theater',
    description: 'A cinema complex showing the latest blockbuster films.',
    icon: '🎬',
    category: 'entertainment',
    baseCost: 75000,
    baseIncome: 1500,
    costMultiplier: 1.8,
    incomeMultiplier: 1.4,
    unlockLevel: 12,
    maxLevel: 18,
    franchiseLevel: 12,
    staffRequired: 20,
    managerLevel: 25,
    newsEvents: ['movie_releases', 'streaming_competition', 'entertainment_trends'],
    upgrades: ['imax_screens', 'luxury_seating', 'concession_upgrades']
  },

  // Healthcare
  MEDICAL_CLINIC: {
    id: 'MEDICAL_CLINIC',
    name: 'Medical Clinic',
    description: 'A healthcare facility providing medical services to the community.',
    icon: '🏥',
    category: 'healthcare',
    baseCost: 300000,
    baseIncome: 5000,
    costMultiplier: 2.0,
    incomeMultiplier: 1.7,
    unlockLevel: 20,
    maxLevel: 15,
    franchiseLevel: 10,
    staffRequired: 40,
    managerLevel: 45,
    newsEvents: ['healthcare_policy', 'medical_advances', 'insurance_changes'],
    upgrades: ['telemedicine', 'advanced_equipment', 'specialist_services']
  },

  // Energy
  SOLAR_FARM: {
    id: 'SOLAR_FARM',
    name: 'Solar Farm',
    description: 'A renewable energy facility generating clean electricity.',
    icon: '☀️',
    category: 'energy',
    baseCost: 1000000,
    baseIncome: 15000,
    costMultiplier: 2.3,
    incomeMultiplier: 1.8,
    unlockLevel: 25,
    maxLevel: 10,
    franchiseLevel: 6,
    staffRequired: 15,
    managerLevel: 35,
    newsEvents: ['energy_policy', 'climate_change', 'technology_advances'],
    upgrades: ['battery_storage', 'smart_grid', 'efficiency_improvements']
  },

  // Aerospace
  SPACE_TOURISM: {
    id: 'SPACE_TOURISM',
    name: 'Space Tourism Company',
    description: 'A cutting-edge company offering commercial space flights.',
    icon: '🚀',
    category: 'aerospace',
    baseCost: 10000000,
    baseIncome: 100000,
    costMultiplier: 3.0,
    incomeMultiplier: 2.5,
    unlockLevel: 50,
    maxLevel: 5,
    franchiseLevel: 3,
    staffRequired: 100,
    managerLevel: 60,
    newsEvents: ['space_policy', 'technology_breakthroughs', 'safety_regulations'],
    upgrades: ['reusable_rockets', 'space_stations', 'mars_missions']
  }
};

// Staff management system
export const STAFF_TYPES = {
  BASIC_WORKER: {
    id: 'basic_worker',
    name: 'Basic Worker',
    cost: 1000,
    productivity: 1.0,
    happiness: 0.8,
    skills: ['basic_operations']
  },
  SKILLED_WORKER: {
    id: 'skilled_worker',
    name: 'Skilled Worker',
    cost: 2500,
    productivity: 1.5,
    happiness: 0.9,
    skills: ['advanced_operations', 'quality_control']
  },
  SPECIALIST: {
    id: 'specialist',
    name: 'Specialist',
    cost: 5000,
    productivity: 2.0,
    happiness: 0.95,
    skills: ['expertise', 'training', 'innovation']
  },
  MANAGER: {
    id: 'manager',
    name: 'Manager',
    cost: 10000,
    productivity: 1.2,
    happiness: 1.0,
    skills: ['leadership', 'optimization', 'automation'],
    managesOthers: true
  }
};

// News events that affect businesses
export const NEWS_EVENTS = {
  WEATHER: {
    id: 'weather',
    name: 'Weather Events',
    events: [
      {
        title: 'Perfect Weather Boosts Outdoor Businesses',
        effect: { type: 'income_multiplier', value: 1.2, duration: 24 },
        probability: 0.1,
        affectedCategories: ['food_service']
      },
      {
        title: 'Storm Reduces Foot Traffic',
        effect: { type: 'income_multiplier', value: 0.8, duration: 12 },
        probability: 0.05,
        affectedCategories: ['retail', 'food_service']
      }
    ]
  },
  ECONOMIC: {
    id: 'economic',
    name: 'Economic News',
    events: [
      {
        title: 'Economic Boom Increases Consumer Spending',
        effect: { type: 'income_multiplier', value: 1.3, duration: 48 },
        probability: 0.03,
        affectedCategories: ['retail', 'entertainment']
      },
      {
        title: 'Recession Fears Dampen Business Activity',
        effect: { type: 'income_multiplier', value: 0.7, duration: 72 },
        probability: 0.02,
        affectedCategories: ['all']
      }
    ]
  },
  TECHNOLOGY: {
    id: 'technology',
    name: 'Technology News',
    events: [
      {
        title: 'New Tech Breakthrough Boosts Innovation',
        effect: { type: 'income_multiplier', value: 1.5, duration: 36 },
        probability: 0.05,
        affectedCategories: ['technology']
      },
      {
        title: 'Cyber Security Breach Affects Tech Sector',
        effect: { type: 'income_multiplier', value: 0.6, duration: 24 },
        probability: 0.02,
        affectedCategories: ['technology']
      }
    ]
  }
};

// Helper functions
export const calculateBusinessCost = (business, currentLevel) => {
  const baseCost = business.baseCost;
  const multiplier = business.costMultiplier;
  const levelScaling = 1 + (currentLevel * 0.1);
  return Math.floor(baseCost * Math.pow(multiplier, currentLevel) * levelScaling);
};

export const calculateBusinessIncome = (business, level, staffBonus = 1, newsBonus = 1) => {
  const baseIncome = business.baseIncome;
  const multiplier = business.incomeMultiplier;
  const levelIncome = baseIncome * Math.pow(multiplier, level - 1);
  return Math.floor(levelIncome * staffBonus * newsBonus);
};

export const getBusinessesByCategory = (category) => {
  return Object.values(BUSINESSES_CONFIG).filter(business => business.category === category);
};

export const getUnlockedBusinesses = (playerLevel) => {
  return Object.values(BUSINESSES_CONFIG).filter(business => business.unlockLevel <= playerLevel);
};

export const canHireFranchise = (business, level) => {
  return level >= business.franchiseLevel;
};

export const requiresStaff = (business, level) => {
  return level >= business.staffRequired;
};

export const canHireManager = (business, level) => {
  return level >= business.managerLevel;
}; 