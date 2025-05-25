// Business configuration for the backend
const BUSINESS_CONFIG = {
  lemonade: {
    id: 'lemonade',
    name: 'Lemonade Stand',
    baseCost: 100,
    baseIncome: 10,
    requiredLevel: 1,
    category: 'food',
    description: 'A simple lemonade stand to get you started',
    icon: '🍋'
  },
  foodTruck: {
    id: 'foodTruck',
    name: 'Food Truck',
    baseCost: 1000,
    baseIncome: 100,
    requiredLevel: 5,
    category: 'food',
    description: 'Mobile food business with higher profits',
    icon: '🚚'
  },
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant',
    baseCost: 10000,
    baseIncome: 1000,
    requiredLevel: 10,
    category: 'food',
    description: 'Full-service restaurant with steady income',
    icon: '🍽️'
  },
  techStartup: {
    id: 'techStartup',
    name: 'Tech Startup',
    baseCost: 100000,
    baseIncome: 10000,
    requiredLevel: 20,
    category: 'tech',
    description: 'High-risk, high-reward technology company',
    icon: '💻'
  },
  realEstate: {
    id: 'realEstate',
    name: 'Real Estate',
    baseCost: 500000,
    baseIncome: 50000,
    requiredLevel: 30,
    category: 'property',
    description: 'Property investment with passive income',
    icon: '🏢'
  },
  bank: {
    id: 'bank',
    name: 'Bank',
    baseCost: 1000000,
    baseIncome: 100000,
    requiredLevel: 40,
    category: 'finance',
    description: 'Financial institution with massive returns',
    icon: '🏦'
  }
};

// Calculate upgrade cost for a business
const calculateUpgradeCost = (baseCost, currentLevel) => {
  return Math.floor(baseCost * Math.pow(1.15, currentLevel));
};

// Calculate income for a business level
const calculateIncome = (baseIncome, level) => {
  return Math.floor(baseIncome * Math.pow(1.1, level - 1));
};

// Get business by ID
const getBusinessById = (businessId) => {
  return BUSINESS_CONFIG[businessId] || null;
};

// Get all businesses
const getAllBusinesses = () => {
  return Object.values(BUSINESS_CONFIG);
};

// Get businesses available at a certain level
const getAvailableBusinesses = (userLevel) => {
  return Object.values(BUSINESS_CONFIG).filter(
    business => business.requiredLevel <= userLevel
  );
};

module.exports = {
  BUSINESS_CONFIG,
  calculateUpgradeCost,
  calculateIncome,
  getBusinessById,
  getAllBusinesses,
  getAvailableBusinesses
}; 