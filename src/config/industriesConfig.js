// MVP Industries Configuration - 8 Core Businesses Only
export const INDUSTRIES_CONFIG = {
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
    maxLevel: 100
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
    maxLevel: 100
  },
  
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
    maxLevel: 100
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
    maxLevel: 100
  },
  
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
    maxLevel: 100
  },
  
  oil_empire: {
    id: 'oil_empire',
    name: 'Oil Empire',
    description: 'Global energy corporation',
    icon: '🛢️',
    sector: 'Energy',
    baseCost: 10000000,
    baseIncome: 100000,
    level: 1,
    unlockLevel: 40,
    maxLevel: 100
  },
  
  bank: {
    id: 'bank',
    name: 'International Bank',
    description: 'Global financial institution',
    icon: '🏦',
    sector: 'Finance',
    baseCost: 100000000,
    baseIncome: 1000000,
    level: 1,
    unlockLevel: 50,
    maxLevel: 100
  },
  
  space_station: {
    id: 'space_station',
    name: 'Space Station',
    description: 'Ultimate space-based empire',
    icon: '🛸',
    sector: 'Aerospace',
    baseCost: 1000000000,
    baseIncome: 10000000,
    level: 1,
    unlockLevel: 60,
    maxLevel: 100
  }
};

// Helper functions for business calculations
export const calculateBusinessCost = (business, currentLevel) => {
  return Math.floor(business.baseCost * Math.pow(1.15, currentLevel));
};

export const calculateBusinessIncome = (business, currentLevel) => {
  return Math.floor(business.baseIncome * Math.pow(1.1, currentLevel));
};

export const getUnlockedBusinesses = (playerLevel) => {
  return Object.values(INDUSTRIES_CONFIG).filter(
    business => business.unlockLevel <= playerLevel
  );
};

export const getBusinessById = (businessId) => {
  return INDUSTRIES_CONFIG[businessId];
};

export default INDUSTRIES_CONFIG;