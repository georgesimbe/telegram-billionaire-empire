export const HOUSING_TYPES = {
  HOMELESS: {
    id: 'homeless',
    name: 'Homeless',
    icon: '🏚️',
    description: 'Living on the streets or in shelters.',
    monthlyCost: 0,
    downPayment: 0,
    requirements: { income: 0, creditScore: 0 },
    happiness: -20,
    health: -15,
    energy: -10,
    capacity: 1,
    amenities: [],
    unlockLevel: 0
  },

  SHARED_ROOM: {
    id: 'shared_room',
    name: 'Shared Room',
    icon: '🛏️',
    description: 'A bed in a shared room with roommates.',
    monthlyCost: 400,
    downPayment: 800,
    requirements: { income: 1200, creditScore: 300 },
    happiness: -5,
    health: 0,
    energy: -5,
    capacity: 1,
    amenities: ['shared_bathroom', 'shared_kitchen'],
    unlockLevel: 0
  },

  STUDIO_APARTMENT: {
    id: 'studio_apartment',
    name: 'Studio Apartment',
    icon: '🏠',
    description: 'A small studio apartment with basic amenities.',
    monthlyCost: 800,
    downPayment: 1600,
    requirements: { income: 2400, creditScore: 500 },
    happiness: 5,
    health: 5,
    energy: 0,
    capacity: 1,
    amenities: ['private_bathroom', 'kitchenette'],
    unlockLevel: 0
  },

  ONE_BEDROOM: {
    id: 'one_bedroom',
    name: 'One Bedroom Apartment',
    icon: '🏡',
    description: 'A comfortable one-bedroom apartment.',
    monthlyCost: 1200,
    downPayment: 2400,
    requirements: { income: 3600, creditScore: 600 },
    happiness: 10,
    health: 10,
    energy: 5,
    capacity: 2,
    amenities: ['private_bathroom', 'full_kitchen', 'living_room'],
    unlockLevel: 0
  },

  TWO_BEDROOM: {
    id: 'two_bedroom',
    name: 'Two Bedroom Apartment',
    icon: '🏘️',
    description: 'A spacious two-bedroom apartment perfect for families.',
    monthlyCost: 1800,
    downPayment: 3600,
    requirements: { income: 5400, creditScore: 650 },
    happiness: 15,
    health: 15,
    energy: 10,
    capacity: 4,
    amenities: ['private_bathroom', 'full_kitchen', 'living_room', 'dining_room'],
    unlockLevel: 0
  },

  TOWNHOUSE: {
    id: 'townhouse',
    name: 'Townhouse',
    icon: '🏘️',
    description: 'A multi-level townhouse with yard space.',
    monthlyCost: 2500,
    downPayment: 5000,
    requirements: { income: 7500, creditScore: 700 },
    happiness: 20,
    health: 20,
    energy: 15,
    capacity: 6,
    amenities: ['private_bathroom', 'full_kitchen', 'living_room', 'dining_room', 'yard', 'garage'],
    unlockLevel: 0
  },

  SMALL_HOUSE: {
    id: 'small_house',
    name: 'Small House',
    icon: '🏠',
    description: 'A cozy single-family home with a yard.',
    monthlyCost: 3200,
    downPayment: 40000,
    requirements: { income: 9600, creditScore: 720 },
    happiness: 25,
    health: 25,
    energy: 20,
    capacity: 6,
    amenities: ['private_bathroom', 'full_kitchen', 'living_room', 'dining_room', 'yard', 'garage', 'basement'],
    unlockLevel: 0,
    canBuy: true,
    purchasePrice: 200000
  },

  FAMILY_HOME: {
    id: 'family_home',
    name: 'Family Home',
    icon: '🏡',
    description: 'A large family home with multiple bedrooms.',
    monthlyCost: 4500,
    downPayment: 60000,
    requirements: { income: 13500, creditScore: 750 },
    happiness: 30,
    health: 30,
    energy: 25,
    capacity: 8,
    amenities: ['multiple_bathrooms', 'full_kitchen', 'living_room', 'dining_room', 'yard', 'garage', 'basement', 'office'],
    unlockLevel: 0,
    canBuy: true,
    purchasePrice: 300000
  },

  LUXURY_CONDO: {
    id: 'luxury_condo',
    name: 'Luxury Condominium',
    icon: '🏢',
    description: 'A high-end condo with premium amenities.',
    monthlyCost: 6000,
    downPayment: 80000,
    requirements: { income: 18000, creditScore: 780 },
    happiness: 35,
    health: 35,
    energy: 30,
    capacity: 4,
    amenities: ['luxury_bathroom', 'gourmet_kitchen', 'living_room', 'dining_room', 'balcony', 'gym', 'pool', 'concierge'],
    unlockLevel: 0,
    canBuy: true,
    purchasePrice: 400000
  },

  MANSION: {
    id: 'mansion',
    name: 'Mansion',
    icon: '🏰',
    description: 'A grand mansion with extensive grounds and luxury amenities.',
    monthlyCost: 12000,
    downPayment: 200000,
    requirements: { income: 36000, creditScore: 800 },
    happiness: 50,
    health: 50,
    energy: 40,
    capacity: 12,
    amenities: ['multiple_bathrooms', 'gourmet_kitchen', 'living_room', 'dining_room', 'library', 'gym', 'pool', 'tennis_court', 'wine_cellar', 'guest_house'],
    unlockLevel: 0,
    canBuy: true,
    purchasePrice: 1000000
  },

  PENTHOUSE: {
    id: 'penthouse',
    name: 'Penthouse Suite',
    icon: '🌆',
    description: 'The ultimate luxury living experience at the top of the city.',
    monthlyCost: 20000,
    downPayment: 400000,
    requirements: { income: 60000, creditScore: 850 },
    happiness: 60,
    health: 60,
    energy: 50,
    capacity: 8,
    amenities: ['luxury_bathroom', 'gourmet_kitchen', 'living_room', 'dining_room', 'office', 'gym', 'pool', 'rooftop_terrace', 'city_view', 'private_elevator'],
    unlockLevel: 0,
    canBuy: true,
    purchasePrice: 2000000
  }
};

export const HOUSING_AMENITIES = {
  SHARED_BATHROOM: { id: 'shared_bathroom', name: 'Shared Bathroom', happiness: -2 },
  PRIVATE_BATHROOM: { id: 'private_bathroom', name: 'Private Bathroom', happiness: 2 },
  LUXURY_BATHROOM: { id: 'luxury_bathroom', name: 'Luxury Bathroom', happiness: 5 },
  MULTIPLE_BATHROOMS: { id: 'multiple_bathrooms', name: 'Multiple Bathrooms', happiness: 3 },

  SHARED_KITCHEN: { id: 'shared_kitchen', name: 'Shared Kitchen', happiness: -1 },
  KITCHENETTE: { id: 'kitchenette', name: 'Kitchenette', happiness: 1 },
  FULL_KITCHEN: { id: 'full_kitchen', name: 'Full Kitchen', happiness: 3 },
  GOURMET_KITCHEN: { id: 'gourmet_kitchen', name: 'Gourmet Kitchen', happiness: 8 },

  LIVING_ROOM: { id: 'living_room', name: 'Living Room', happiness: 3 },
  DINING_ROOM: { id: 'dining_room', name: 'Dining Room', happiness: 2 },
  OFFICE: { id: 'office', name: 'Home Office', happiness: 4, workBonus: 5 },
  LIBRARY: { id: 'library', name: 'Library', happiness: 5, skillBonus: 2 },

  YARD: { id: 'yard', name: 'Yard', happiness: 5, health: 3 },
  BALCONY: { id: 'balcony', name: 'Balcony', happiness: 3 },
  ROOFTOP_TERRACE: { id: 'rooftop_terrace', name: 'Rooftop Terrace', happiness: 8 },

  GARAGE: { id: 'garage', name: 'Garage', happiness: 2 },
  BASEMENT: { id: 'basement', name: 'Basement', happiness: 1 },

  GYM: { id: 'gym', name: 'Gym Access', happiness: 5, health: 8 },
  POOL: { id: 'pool', name: 'Swimming Pool', happiness: 8, health: 5 },
  TENNIS_COURT: { id: 'tennis_court', name: 'Tennis Court', happiness: 10, health: 8 },

  CONCIERGE: { id: 'concierge', name: 'Concierge Service', happiness: 5 },
  CITY_VIEW: { id: 'city_view', name: 'City View', happiness: 8 },
  PRIVATE_ELEVATOR: { id: 'private_elevator', name: 'Private Elevator', happiness: 10 },

  WINE_CELLAR: { id: 'wine_cellar', name: 'Wine Cellar', happiness: 6 },
  GUEST_HOUSE: { id: 'guest_house', name: 'Guest House', happiness: 8 }
};

export const MORTGAGE_TYPES = {
  CONVENTIONAL: {
    id: 'conventional',
    name: 'Conventional Mortgage',
    downPaymentPercent: 20,
    interestRate: 0.065,
    term: 360, // months
    requirements: { creditScore: 620, income: 0 }
  },
  FHA: {
    id: 'fha',
    name: 'FHA Loan',
    downPaymentPercent: 3.5,
    interestRate: 0.055,
    term: 360,
    requirements: { creditScore: 580, income: 0 }
  },
  VA: {
    id: 'va',
    name: 'VA Loan',
    downPaymentPercent: 0,
    interestRate: 0.05,
    term: 360,
    requirements: { creditScore: 620, income: 0, veteran: true }
  },
  JUMBO: {
    id: 'jumbo',
    name: 'Jumbo Loan',
    downPaymentPercent: 25,
    interestRate: 0.07,
    term: 360,
    requirements: { creditScore: 740, income: 100000 }
  }
};

export const UTILITIES = {
  ELECTRICITY: { id: 'electricity', name: 'Electricity', baseCost: 120, perSquareFoot: 0.1 },
  GAS: { id: 'gas', name: 'Gas', baseCost: 80, perSquareFoot: 0.05 },
  WATER: { id: 'water', name: 'Water & Sewer', baseCost: 60, perSquareFoot: 0.03 },
  INTERNET: { id: 'internet', name: 'Internet', baseCost: 70, perSquareFoot: 0 },
  CABLE: { id: 'cable', name: 'Cable TV', baseCost: 90, perSquareFoot: 0 },
  INSURANCE: { id: 'insurance', name: 'Renters/Home Insurance', baseCost: 100, perSquareFoot: 0.2 }
};

// Helper functions
export const getAvailableHousing = (income, creditScore) => {
  return Object.values(HOUSING_TYPES).filter(housing => {
    return income >= housing.requirements.income && creditScore >= housing.requirements.creditScore;
  });
};

export const calculateMortgagePayment = (principal, interestRate, termMonths) => {
  const monthlyRate = interestRate / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.round(payment);
};

export const calculateUtilityCosts = (housing, squareFeet = 1000) => {
  let totalCost = 0;
  Object.values(UTILITIES).forEach(utility => {
    totalCost += utility.baseCost + (utility.perSquareFoot * squareFeet);
  });
  return Math.round(totalCost);
};

export const calculateHousingAffordability = (income, creditScore, debts = 0) => {
  const maxMonthlyPayment = (income * 0.28) - debts; // 28% rule minus existing debts
  const availableHousing = getAvailableHousing(income, creditScore);

  return availableHousing.filter(housing => {
    const totalMonthlyCost = housing.monthlyCost + calculateUtilityCosts(housing);
    return totalMonthlyCost <= maxMonthlyPayment;
  });
};

export const getHousingBonuses = (housing) => {
  let bonuses = {
    happiness: housing.happiness,
    health: housing.health,
    energy: housing.energy,
    workBonus: 0,
    skillBonus: 0
  };

  housing.amenities.forEach(amenityId => {
    const amenity = HOUSING_AMENITIES[amenityId.toUpperCase()];
    if (amenity) {
      bonuses.happiness += amenity.happiness || 0;
      bonuses.health += amenity.health || 0;
      bonuses.workBonus += amenity.workBonus || 0;
      bonuses.skillBonus += amenity.skillBonus || 0;
    }
  });

  return bonuses;
}; 