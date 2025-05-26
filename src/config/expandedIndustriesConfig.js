// Expanded Industries Configuration - 10 Industries with 20+ Business Types
// Implements the complete business ecosystem described in the wiki

export const EXPANDED_INDUSTRIES_CONFIG = {
  // FOOD & BEVERAGE INDUSTRY
  lemonade_stand: {
    id: 'lemonade_stand',
    name: 'Lemonade Stand',
    description: 'Start small with a classic lemonade stand',
    icon: '🍋',
    sector: 'Food & Beverage',
    baseCost: 100,
    baseIncome: 1,
    level: 1,
    unlockLevel: 1,
    maxLevel: 50,
    supplyChain: {
      requires: [],
      provides: ['local_refreshments'],
      synergy_bonus: 0.05
    }
  },

  food_truck: {
    id: 'food_truck',
    name: 'Food Truck',
    description: 'Mobile food service business',
    icon: '🚚',
    sector: 'Food & Beverage',
    baseCost: 1000,
    baseIncome: 10,
    level: 1,
    unlockLevel: 5,
    maxLevel: 75,
    supplyChain: {
      requires: ['farm', 'food_processing'],
      provides: ['mobile_food_service'],
      synergy_bonus: 0.15,
      shortage_penalty: 0.20
    }
  },

  restaurant: {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Full-service dining establishment',
    icon: '🍽️',
    sector: 'Food & Beverage',
    baseCost: 25000,
    baseIncome: 250,
    level: 1,
    unlockLevel: 15,
    maxLevel: 100,
    supplyChain: {
      requires: ['farm', 'food_processing', 'logistics_company'],
      provides: ['dining_experience', 'employment'],
      synergy_bonus: 0.25,
      shortage_penalty: 0.30
    }
  },

  brewery: {
    id: 'brewery',
    name: 'Craft Brewery',
    description: 'Artisanal beer production facility',
    icon: '🍺',
    sector: 'Food & Beverage',
    baseCost: 100000,
    baseIncome: 1000,
    level: 1,
    unlockLevel: 25,
    maxLevel: 100,
    supplyChain: {
      requires: ['farm', 'water_treatment'],
      provides: ['alcoholic_beverages'],
      synergy_bonus: 0.20,
      shortage_penalty: 0.25
    }
  },

  // TECHNOLOGY INDUSTRY
  online_store: {
    id: 'online_store',
    name: 'Online Store',
    description: 'E-commerce business with global reach',
    icon: '🛒',
    sector: 'Technology',
    baseCost: 10000,
    baseIncome: 100,
    level: 1,
    unlockLevel: 10,
    maxLevel: 100,
    supplyChain: {
      requires: ['logistics_company', 'manufacturing'],
      provides: ['e_commerce_platform'],
      synergy_bonus: 0.20,
      shortage_penalty: 0.15
    }
  },

  tech_startup: {
    id: 'tech_startup',
    name: 'Tech Startup',
    description: 'Innovative technology company',
    icon: '💻',
    sector: 'Technology',
    baseCost: 100000,
    baseIncome: 1000,
    level: 1,
    unlockLevel: 20,
    maxLevel: 100,
    supplyChain: {
      requires: ['university', 'manufacturing'],
      provides: ['innovation', 'high_skilled_jobs'],
      synergy_bonus: 0.30,
      shortage_penalty: 0.25
    }
  },

  software_company: {
    id: 'software_company',
    name: 'Software Company',
    description: 'Enterprise software development',
    icon: '⚡',
    sector: 'Technology',
    baseCost: 500000,
    baseIncome: 5000,
    level: 1,
    unlockLevel: 35,
    maxLevel: 100,
    supplyChain: {
      requires: ['university', 'research_institute'],
      provides: ['software_solutions', 'digital_services'],
      synergy_bonus: 0.35,
      shortage_penalty: 0.20
    }
  },

  ai_research_lab: {
    id: 'ai_research_lab',
    name: 'AI Research Lab',
    description: 'Cutting-edge artificial intelligence research',
    icon: '🤖',
    sector: 'Technology',
    baseCost: 2000000,
    baseIncome: 20000,
    level: 1,
    unlockLevel: 50,
    maxLevel: 100,
    supplyChain: {
      requires: ['university', 'research_institute', 'tech_startup'],
      provides: ['ai_technology', 'research_breakthroughs'],
      synergy_bonus: 0.40,
      shortage_penalty: 0.35
    }
  },

  // FINANCE INDUSTRY
  crypto_exchange: {
    id: 'crypto_exchange',
    name: 'Crypto Exchange',
    description: 'Digital asset trading platform',
    icon: '₿',
    sector: 'Finance',
    baseCost: 1000000,
    baseIncome: 10000,
    level: 1,
    unlockLevel: 30,
    maxLevel: 100,
    supplyChain: {
      requires: ['software_company', 'bank'],
      provides: ['crypto_trading', 'digital_finance'],
      synergy_bonus: 0.25,
      shortage_penalty: 0.30
    }
  },

  bank: {
    id: 'bank',
    name: 'International Bank',
    description: 'Global financial institution',
    icon: '🏦',
    sector: 'Finance',
    baseCost: 10000000,
    baseIncome: 100000,
    level: 1,
    unlockLevel: 45,
    maxLevel: 100,
    supplyChain: {
      requires: ['insurance_company'],
      provides: ['banking_services', 'capital_access'],
      synergy_bonus: 0.30,
      shortage_penalty: 0.40
    }
  },

  investment_firm: {
    id: 'investment_firm',
    name: 'Investment Firm',
    description: 'Professional investment management',
    icon: '📈',
    sector: 'Finance',
    baseCost: 5000000,
    baseIncome: 50000,
    level: 1,
    unlockLevel: 40,
    maxLevel: 100,
    supplyChain: {
      requires: ['bank', 'research_institute'],
      provides: ['investment_services', 'market_analysis'],
      synergy_bonus: 0.35,
      shortage_penalty: 0.25
    }
  },

  insurance_company: {
    id: 'insurance_company',
    name: 'Insurance Company',
    description: 'Risk management and insurance services',
    icon: '🛡️',
    sector: 'Finance',
    baseCost: 3000000,
    baseIncome: 30000,
    level: 1,
    unlockLevel: 35,
    maxLevel: 100,
    supplyChain: {
      requires: ['research_institute'],
      provides: ['risk_management', 'financial_protection'],
      synergy_bonus: 0.20,
      shortage_penalty: 0.15
    }
  },

  // ENERGY INDUSTRY
  solar_farm: {
    id: 'solar_farm',
    name: 'Solar Farm',
    description: 'Renewable solar energy generation',
    icon: '☀️',
    sector: 'Energy',
    baseCost: 2000000,
    baseIncome: 15000,
    level: 1,
    unlockLevel: 30,
    maxLevel: 100,
    supplyChain: {
      requires: ['manufacturing', 'property_development'],
      provides: ['renewable_energy', 'clean_power'],
      synergy_bonus: 0.25,
      shortage_penalty: 0.20
    }
  },

  oil_empire: {
    id: 'oil_empire',
    name: 'Oil Empire',
    description: 'Global energy corporation',
    icon: '🛢️',
    sector: 'Energy',
    baseCost: 50000000,
    baseIncome: 500000,
    level: 1,
    unlockLevel: 55,
    maxLevel: 100,
    supplyChain: {
      requires: ['logistics_company', 'manufacturing'],
      provides: ['fossil_fuels', 'energy_infrastructure'],
      synergy_bonus: 0.35,
      shortage_penalty: 0.45
    }
  },

  wind_energy: {
    id: 'wind_energy',
    name: 'Wind Energy',
    description: 'Wind turbine energy generation',
    icon: '💨',
    sector: 'Energy',
    baseCost: 3000000,
    baseIncome: 25000,
    level: 1,
    unlockLevel: 35,
    maxLevel: 100,
    supplyChain: {
      requires: ['manufacturing', 'property_development'],
      provides: ['wind_power', 'sustainable_energy'],
      synergy_bonus: 0.30,
      shortage_penalty: 0.25
    }
  },

  // HEALTHCARE INDUSTRY
  clinic: {
    id: 'clinic',
    name: 'Medical Clinic',
    description: 'Primary healthcare services',
    icon: '🏥',
    sector: 'Healthcare',
    baseCost: 500000,
    baseIncome: 4000,
    level: 1,
    unlockLevel: 25,
    maxLevel: 100,
    supplyChain: {
      requires: ['pharmaceutical_company', 'university'],
      provides: ['healthcare_services', 'medical_care'],
      synergy_bonus: 0.20,
      shortage_penalty: 0.35
    }
  },

  hospital: {
    id: 'hospital',
    name: 'Hospital',
    description: 'Comprehensive medical facility',
    icon: '🏨',
    sector: 'Healthcare',
    baseCost: 5000000,
    baseIncome: 40000,
    level: 1,
    unlockLevel: 40,
    maxLevel: 100,
    supplyChain: {
      requires: ['pharmaceutical_company', 'university', 'research_institute'],
      provides: ['advanced_healthcare', 'emergency_services'],
      synergy_bonus: 0.30,
      shortage_penalty: 0.40
    }
  },

  pharmaceutical_company: {
    id: 'pharmaceutical_company',
    name: 'Pharmaceutical Company',
    description: 'Drug development and manufacturing',
    icon: '💊',
    sector: 'Healthcare',
    baseCost: 10000000,
    baseIncome: 80000,
    level: 1,
    unlockLevel: 45,
    maxLevel: 100,
    supplyChain: {
      requires: ['research_institute', 'manufacturing'],
      provides: ['pharmaceuticals', 'medical_research'],
      synergy_bonus: 0.35,
      shortage_penalty: 0.50
    }
  },

  // AGRICULTURE INDUSTRY
  farm: {
    id: 'farm',
    name: 'Agricultural Farm',
    description: 'Crop and livestock production',
    icon: '🚜',
    sector: 'Agriculture',
    baseCost: 200000,
    baseIncome: 1500,
    level: 1,
    unlockLevel: 15,
    maxLevel: 100,
    supplyChain: {
      requires: [],
      provides: ['raw_food', 'agricultural_products'],
      synergy_bonus: 0.15,
      shortage_penalty: 0.10
    }
  },

  food_processing: {
    id: 'food_processing',
    name: 'Food Processing Plant',
    description: 'Agricultural product processing',
    icon: '🏭',
    sector: 'Agriculture',
    baseCost: 1000000,
    baseIncome: 8000,
    level: 1,
    unlockLevel: 25,
    maxLevel: 100,
    supplyChain: {
      requires: ['farm', 'manufacturing'],
      provides: ['processed_food', 'food_distribution'],
      synergy_bonus: 0.25,
      shortage_penalty: 0.30
    }
  },

  // ENTERTAINMENT INDUSTRY
  gaming_studio: {
    id: 'gaming_studio',
    name: 'Gaming Studio',
    description: 'Video game development',
    icon: '🎮',
    sector: 'Entertainment',
    baseCost: 750000,
    baseIncome: 6000,
    level: 1,
    unlockLevel: 30,
    maxLevel: 100,
    supplyChain: {
      requires: ['software_company', 'university'],
      provides: ['entertainment_content', 'digital_media'],
      synergy_bonus: 0.25,
      shortage_penalty: 0.20
    }
  },

  streaming_service: {
    id: 'streaming_service',
    name: 'Streaming Service',
    description: 'Digital content streaming platform',
    icon: '📺',
    sector: 'Entertainment',
    baseCost: 2000000,
    baseIncome: 18000,
    level: 1,
    unlockLevel: 40,
    maxLevel: 100,
    supplyChain: {
      requires: ['software_company', 'gaming_studio'],
      provides: ['streaming_content', 'digital_entertainment'],
      synergy_bonus: 0.30,
      shortage_penalty: 0.25
    }
  },

  // EDUCATION INDUSTRY
  university: {
    id: 'university',
    name: 'University',
    description: 'Higher education institution',
    icon: '🎓',
    sector: 'Education',
    baseCost: 5000000,
    baseIncome: 35000,
    level: 1,
    unlockLevel: 35,
    maxLevel: 100,
    supplyChain: {
      requires: ['research_institute'],
      provides: ['education_services', 'skilled_workforce'],
      synergy_bonus: 0.25,
      shortage_penalty: 0.30
    }
  },

  research_institute: {
    id: 'research_institute',
    name: 'Research Institute',
    description: 'Scientific research and development',
    icon: '🔬',
    sector: 'Education',
    baseCost: 3000000,
    baseIncome: 22000,
    level: 1,
    unlockLevel: 30,
    maxLevel: 100,
    supplyChain: {
      requires: ['university'],
      provides: ['research_services', 'innovation_support'],
      synergy_bonus: 0.35,
      shortage_penalty: 0.25
    }
  },

  // TRANSPORTATION INDUSTRY
  logistics_company: {
    id: 'logistics_company',
    name: 'Logistics Company',
    description: 'Supply chain and delivery services',
    icon: '🚛',
    sector: 'Transportation',
    baseCost: 1500000,
    baseIncome: 12000,
    level: 1,
    unlockLevel: 20,
    maxLevel: 100,
    supplyChain: {
      requires: ['manufacturing'],
      provides: ['logistics_services', 'supply_chain_support'],
      synergy_bonus: 0.20,
      shortage_penalty: 0.35
    }
  },

  airline: {
    id: 'airline',
    name: 'Airline',
    description: 'Commercial aviation services',
    icon: '✈️',
    sector: 'Transportation',
    baseCost: 20000000,
    baseIncome: 150000,
    level: 1,
    unlockLevel: 50,
    maxLevel: 100,
    supplyChain: {
      requires: ['oil_empire', 'manufacturing'],
      provides: ['air_transportation', 'global_connectivity'],
      synergy_bonus: 0.30,
      shortage_penalty: 0.40
    }
  },

  // REAL ESTATE INDUSTRY
  property_development: {
    id: 'property_development',
    name: 'Property Development',
    description: 'Real estate development and construction',
    icon: '🏗️',
    sector: 'Real Estate',
    baseCost: 3000000,
    baseIncome: 25000,
    level: 1,
    unlockLevel: 35,
    maxLevel: 100,
    supplyChain: {
      requires: ['manufacturing', 'bank'],
      provides: ['real_estate_development', 'construction_services'],
      synergy_bonus: 0.25,
      shortage_penalty: 0.35
    }
  },

  // MANUFACTURING INDUSTRY
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing Plant',
    description: 'Industrial production facility',
    icon: '🏭',
    sector: 'Manufacturing',
    baseCost: 2500000,
    baseIncome: 20000,
    level: 1,
    unlockLevel: 25,
    maxLevel: 100,
    supplyChain: {
      requires: ['farm', 'logistics_company'],
      provides: ['manufactured_goods', 'industrial_products'],
      synergy_bonus: 0.30,
      shortage_penalty: 0.40
    }
  },

  // AEROSPACE INDUSTRY
  space_station: {
    id: 'space_station',
    name: 'Space Station',
    description: 'Ultimate space-based empire',
    icon: '🛸',
    sector: 'Aerospace',
    baseCost: 100000000,
    baseIncome: 1000000,
    level: 1,
    unlockLevel: 75,
    maxLevel: 100,
    supplyChain: {
      requires: ['ai_research_lab', 'manufacturing', 'university'],
      provides: ['space_technology', 'orbital_services'],
      synergy_bonus: 0.50,
      shortage_penalty: 0.60
    }
  }
};

// Industry sector definitions
export const INDUSTRY_SECTORS = {
  'Food & Beverage': {
    color: '#F59E0B',
    icon: '🍽️',
    description: 'Food production, processing, and service businesses'
  },
  'Technology': {
    color: '#3B82F6',
    icon: '💻',
    description: 'Software, hardware, and digital innovation companies'
  },
  'Finance': {
    color: '#10B981',
    icon: '💰',
    description: 'Banking, investment, and financial services'
  },
  'Energy': {
    color: '#EF4444',
    icon: '⚡',
    description: 'Power generation and energy infrastructure'
  },
  'Healthcare': {
    color: '#EC4899',
    icon: '🏥',
    description: 'Medical services and pharmaceutical companies'
  },
  'Agriculture': {
    color: '#84CC16',
    icon: '🌾',
    description: 'Farming, livestock, and food production'
  },
  'Entertainment': {
    color: '#8B5CF6',
    icon: '🎭',
    description: 'Media, gaming, and entertainment content'
  },
  'Education': {
    color: '#F97316',
    icon: '📚',
    description: 'Educational institutions and research facilities'
  },
  'Transportation': {
    color: '#06B6D4',
    icon: '🚛',
    description: 'Logistics, shipping, and transportation services'
  },
  'Real Estate': {
    color: '#64748B',
    icon: '🏢',
    description: 'Property development and construction'
  },
  'Manufacturing': {
    color: '#71717A',
    icon: '🏭',
    description: 'Industrial production and manufacturing'
  },
  'Aerospace': {
    color: '#7C3AED',
    icon: '🚀',
    description: 'Space technology and orbital services'
  }
};

// Helper functions for business calculations
export const calculateBusinessCost = (business, currentLevel) => {
  return Math.floor(business.baseCost * Math.pow(1.15, currentLevel));
};

export const calculateBusinessIncome = (business, currentLevel, supplyChainBonus = 0) => {
  const baseIncome = Math.floor(business.baseIncome * Math.pow(1.1, currentLevel));
  return Math.floor(baseIncome * (1 + supplyChainBonus));
};

export const getUnlockedBusinesses = (playerLevel) => {
  return Object.values(EXPANDED_INDUSTRIES_CONFIG).filter(
    business => business.unlockLevel <= playerLevel
  );
};

export const getBusinessesBySector = (sector) => {
  return Object.values(EXPANDED_INDUSTRIES_CONFIG).filter(
    business => business.sector === sector
  );
};

export const getBusinessById = (businessId) => {
  return EXPANDED_INDUSTRIES_CONFIG[businessId];
};

export const calculateSupplyChainBonus = (playerBusinesses, targetBusiness) => {
  if (!targetBusiness.supplyChain?.requires) return 0;

  const ownedSuppliers = targetBusiness.supplyChain.requires.filter(
    requiredBusiness => playerBusinesses.some(owned => owned.id === requiredBusiness)
  );

  const supplyRatio = ownedSuppliers.length / targetBusiness.supplyChain.requires.length;
  return supplyRatio * (targetBusiness.supplyChain.synergy_bonus || 0);
};

export const calculateSupplyChainPenalty = (playerBusinesses, targetBusiness, globalSupply) => {
  if (!targetBusiness.supplyChain?.requires) return 0;

  const missingSuppliers = targetBusiness.supplyChain.requires.filter(
    requiredBusiness => !playerBusinesses.some(owned => owned.id === requiredBusiness) &&
      (globalSupply[requiredBusiness] || 1) < 0.7 // Global shortage
  );

  const shortageRatio = missingSuppliers.length / targetBusiness.supplyChain.requires.length;
  return shortageRatio * (targetBusiness.supplyChain.shortage_penalty || 0);
};

export default EXPANDED_INDUSTRIES_CONFIG; 