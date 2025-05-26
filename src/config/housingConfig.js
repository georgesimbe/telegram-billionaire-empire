// Housing System Configuration - From Homeless to Space Stations
// Implements the complete housing progression described in the wiki

export const HOUSING_TYPES = {
  homeless: {
    id: 'homeless',
    name: 'Homeless',
    description: 'Living on the streets with no permanent shelter',
    icon: '🏚️',
    cost: 0,
    monthlyMaintenance: 0,
    unlockLevel: 1,
    happiness: -20,
    health: -15,
    energy: -10,
    stress: 25,
    socialStatus: 0,
    capacity: 1,
    features: [],
    requirements: {
      cash: 0,
      creditScore: 0
    }
  },

  shelter: {
    id: 'shelter',
    name: 'Emergency Shelter',
    description: 'Basic temporary housing with shared facilities',
    icon: '🏠',
    cost: 500,
    monthlyMaintenance: 200,
    unlockLevel: 1,
    happiness: -10,
    health: -5,
    energy: 0,
    stress: 15,
    socialStatus: 5,
    capacity: 1,
    features: ['basic_bed', 'shared_bathroom', 'meal_service'],
    requirements: {
      cash: 500,
      creditScore: 0
    }
  },

  studio_apartment: {
    id: 'studio_apartment',
    name: 'Studio Apartment',
    description: 'Small but private living space with basic amenities',
    icon: '🏢',
    cost: 2000,
    monthlyMaintenance: 800,
    unlockLevel: 5,
    happiness: 5,
    health: 5,
    energy: 5,
    stress: 5,
    socialStatus: 15,
    capacity: 1,
    features: ['private_bathroom', 'kitchenette', 'internet', 'security'],
    requirements: {
      cash: 2000,
      creditScore: 600,
      monthlyIncome: 2400
    }
  },

  apartment: {
    id: 'apartment',
    name: 'One-Bedroom Apartment',
    description: 'Comfortable apartment with separate bedroom and living area',
    icon: '🏠',
    cost: 5000,
    monthlyMaintenance: 1500,
    unlockLevel: 10,
    happiness: 15,
    health: 10,
    energy: 10,
    stress: 0,
    socialStatus: 25,
    capacity: 2,
    features: ['full_kitchen', 'private_bathroom', 'living_room', 'balcony', 'parking'],
    requirements: {
      cash: 5000,
      creditScore: 650,
      monthlyIncome: 4500
    }
  },

  house: {
    id: 'house',
    name: 'Suburban House',
    description: 'Traditional family home with yard and multiple rooms',
    icon: '🏡',
    cost: 25000,
    monthlyMaintenance: 3000,
    unlockLevel: 20,
    happiness: 25,
    health: 15,
    energy: 15,
    stress: -10,
    socialStatus: 40,
    capacity: 4,
    features: ['multiple_bedrooms', 'full_kitchen', 'living_room', 'dining_room', 'yard', 'garage', 'home_office'],
    requirements: {
      cash: 25000,
      creditScore: 700,
      monthlyIncome: 9000
    }
  },

  luxury_condo: {
    id: 'luxury_condo',
    name: 'Luxury Condominium',
    description: 'High-end condo with premium amenities and city views',
    icon: '🏙️',
    cost: 75000,
    monthlyMaintenance: 5000,
    unlockLevel: 30,
    happiness: 35,
    health: 20,
    energy: 20,
    stress: -15,
    socialStatus: 60,
    capacity: 3,
    features: ['luxury_finishes', 'city_views', 'concierge', 'gym', 'pool', 'rooftop_access', 'smart_home'],
    requirements: {
      cash: 75000,
      creditScore: 750,
      monthlyIncome: 15000
    }
  },

  mansion: {
    id: 'mansion',
    name: 'Luxury Mansion',
    description: 'Sprawling estate with extensive grounds and luxury amenities',
    icon: '🏰',
    cost: 250000,
    monthlyMaintenance: 12000,
    unlockLevel: 40,
    happiness: 50,
    health: 25,
    energy: 25,
    stress: -25,
    socialStatus: 80,
    capacity: 8,
    features: ['multiple_wings', 'guest_houses', 'pool', 'tennis_court', 'wine_cellar', 'home_theater', 'staff_quarters'],
    requirements: {
      cash: 250000,
      creditScore: 800,
      monthlyIncome: 36000
    }
  },

  penthouse: {
    id: 'penthouse',
    name: 'Penthouse Suite',
    description: 'Ultra-luxury penthouse with panoramic views and exclusive access',
    icon: '🌆',
    cost: 500000,
    monthlyMaintenance: 20000,
    unlockLevel: 50,
    happiness: 65,
    health: 30,
    energy: 30,
    stress: -30,
    socialStatus: 90,
    capacity: 6,
    features: ['panoramic_views', 'private_elevator', 'rooftop_terrace', 'infinity_pool', 'helipad', 'butler_service'],
    requirements: {
      cash: 500000,
      creditScore: 850,
      monthlyIncome: 60000
    }
  },

  private_island: {
    id: 'private_island',
    name: 'Private Island',
    description: 'Exclusive island paradise with complete privacy and luxury',
    icon: '🏝️',
    cost: 2000000,
    monthlyMaintenance: 50000,
    unlockLevel: 65,
    happiness: 80,
    health: 35,
    energy: 35,
    stress: -40,
    socialStatus: 95,
    capacity: 12,
    features: ['private_beaches', 'yacht_dock', 'airstrip', 'resort_facilities', 'staff_village', 'renewable_energy'],
    requirements: {
      cash: 2000000,
      creditScore: 900,
      monthlyIncome: 150000
    }
  },

  space_station: {
    id: 'space_station',
    name: 'Orbital Space Station',
    description: 'Ultimate luxury living in Earth orbit with zero-gravity amenities',
    icon: '🛸',
    cost: 10000000,
    monthlyMaintenance: 200000,
    unlockLevel: 80,
    happiness: 100,
    health: 40,
    energy: 40,
    stress: -50,
    socialStatus: 100,
    capacity: 20,
    features: ['zero_gravity_recreation', 'earth_observation_deck', 'space_garden', 'research_lab', 'shuttle_bay', 'artificial_gravity_zones'],
    requirements: {
      cash: 10000000,
      creditScore: 950,
      monthlyIncome: 600000,
      specialRequirement: 'space_program_access'
    }
  }
};

// Housing feature descriptions
export const HOUSING_FEATURES = {
  basic_bed: { name: 'Basic Bed', description: 'Simple sleeping arrangement' },
  shared_bathroom: { name: 'Shared Bathroom', description: 'Communal bathroom facilities' },
  meal_service: { name: 'Meal Service', description: 'Basic meals provided' },
  private_bathroom: { name: 'Private Bathroom', description: 'Your own bathroom' },
  kitchenette: { name: 'Kitchenette', description: 'Small cooking area' },
  internet: { name: 'Internet Access', description: 'High-speed internet connection' },
  security: { name: 'Security', description: 'Basic security measures' },
  full_kitchen: { name: 'Full Kitchen', description: 'Complete cooking facilities' },
  living_room: { name: 'Living Room', description: 'Comfortable living space' },
  balcony: { name: 'Balcony', description: 'Outdoor space with views' },
  parking: { name: 'Parking Space', description: 'Dedicated parking spot' },
  multiple_bedrooms: { name: 'Multiple Bedrooms', description: 'Several private bedrooms' },
  dining_room: { name: 'Dining Room', description: 'Formal dining area' },
  yard: { name: 'Private Yard', description: 'Outdoor space for recreation' },
  garage: { name: 'Garage', description: 'Covered parking and storage' },
  home_office: { name: 'Home Office', description: 'Dedicated workspace' },
  luxury_finishes: { name: 'Luxury Finishes', description: 'High-end materials and fixtures' },
  city_views: { name: 'City Views', description: 'Panoramic city skyline views' },
  concierge: { name: 'Concierge Service', description: '24/7 concierge assistance' },
  gym: { name: 'Private Gym', description: 'Fitness facilities' },
  pool: { name: 'Swimming Pool', description: 'Private or shared pool' },
  rooftop_access: { name: 'Rooftop Access', description: 'Access to building rooftop' },
  smart_home: { name: 'Smart Home Technology', description: 'Automated home systems' },
  multiple_wings: { name: 'Multiple Wings', description: 'Separate living areas' },
  guest_houses: { name: 'Guest Houses', description: 'Separate accommodations for guests' },
  tennis_court: { name: 'Tennis Court', description: 'Private tennis facilities' },
  wine_cellar: { name: 'Wine Cellar', description: 'Climate-controlled wine storage' },
  home_theater: { name: 'Home Theater', description: 'Private cinema room' },
  staff_quarters: { name: 'Staff Quarters', description: 'Accommodations for household staff' },
  panoramic_views: { name: 'Panoramic Views', description: '360-degree city views' },
  private_elevator: { name: 'Private Elevator', description: 'Exclusive elevator access' },
  rooftop_terrace: { name: 'Rooftop Terrace', description: 'Private outdoor terrace' },
  infinity_pool: { name: 'Infinity Pool', description: 'Edge-less swimming pool' },
  helipad: { name: 'Helipad', description: 'Private helicopter landing pad' },
  butler_service: { name: 'Butler Service', description: 'Personal butler assistance' },
  private_beaches: { name: 'Private Beaches', description: 'Exclusive beach access' },
  yacht_dock: { name: 'Yacht Dock', description: 'Private marina facilities' },
  airstrip: { name: 'Private Airstrip', description: 'Personal aircraft runway' },
  resort_facilities: { name: 'Resort Facilities', description: 'Full resort amenities' },
  staff_village: { name: 'Staff Village', description: 'Complete staff accommodations' },
  renewable_energy: { name: 'Renewable Energy', description: 'Sustainable power systems' },
  zero_gravity_recreation: { name: 'Zero-G Recreation', description: 'Weightless entertainment areas' },
  earth_observation_deck: { name: 'Earth Observation Deck', description: 'Views of Earth from space' },
  space_garden: { name: 'Space Garden', description: 'Hydroponic growing facilities' },
  research_lab: { name: 'Research Laboratory', description: 'Scientific research facilities' },
  shuttle_bay: { name: 'Shuttle Bay', description: 'Spacecraft docking facilities' },
  artificial_gravity_zones: { name: 'Artificial Gravity Zones', description: 'Simulated gravity areas' }
};

// Mortgage and financing options
export const MORTGAGE_OPTIONS = {
  cash_purchase: {
    name: 'Cash Purchase',
    description: 'Buy outright with no financing',
    downPayment: 1.0,
    interestRate: 0,
    termYears: 0,
    creditScoreRequired: 0
  },
  conventional_mortgage: {
    name: 'Conventional Mortgage',
    description: 'Standard home loan with good terms',
    downPayment: 0.20,
    interestRate: 0.035,
    termYears: 30,
    creditScoreRequired: 700
  },
  fha_loan: {
    name: 'FHA Loan',
    description: 'Government-backed loan with lower down payment',
    downPayment: 0.035,
    interestRate: 0.045,
    termYears: 30,
    creditScoreRequired: 580
  },
  luxury_financing: {
    name: 'Luxury Financing',
    description: 'Specialized financing for high-end properties',
    downPayment: 0.30,
    interestRate: 0.025,
    termYears: 15,
    creditScoreRequired: 800
  },
  private_banking: {
    name: 'Private Banking',
    description: 'Exclusive financing for ultra-high net worth individuals',
    downPayment: 0.40,
    interestRate: 0.015,
    termYears: 10,
    creditScoreRequired: 850
  }
};

// Utility costs and services
export const UTILITY_SERVICES = {
  electricity: {
    name: 'Electricity',
    baseCost: 100,
    scalingFactor: 1.5, // Multiplier based on housing size
    required: true
  },
  water: {
    name: 'Water & Sewer',
    baseCost: 50,
    scalingFactor: 1.2,
    required: true
  },
  gas: {
    name: 'Natural Gas',
    baseCost: 75,
    scalingFactor: 1.3,
    required: false
  },
  internet: {
    name: 'Internet',
    baseCost: 80,
    scalingFactor: 1.1,
    required: false
  },
  cable: {
    name: 'Cable TV',
    baseCost: 120,
    scalingFactor: 1.0,
    required: false
  },
  security: {
    name: 'Security System',
    baseCost: 200,
    scalingFactor: 2.0,
    required: false
  },
  housekeeping: {
    name: 'Housekeeping Service',
    baseCost: 500,
    scalingFactor: 3.0,
    required: false
  },
  landscaping: {
    name: 'Landscaping',
    baseCost: 300,
    scalingFactor: 2.5,
    required: false
  }
};

// Helper functions
export const getAvailableHousing = (playerLevel, creditScore, monthlyIncome) => {
  return Object.values(HOUSING_TYPES).filter(housing => {
    if (housing.unlockLevel > playerLevel) return false;
    if (housing.requirements.creditScore > creditScore) return false;
    if (housing.requirements.monthlyIncome && housing.requirements.monthlyIncome > monthlyIncome) return false;
    return true;
  });
};

export const calculateMortgagePayment = (housingCost, mortgageOption) => {
  if (mortgageOption.termYears === 0) return 0; // Cash purchase

  const principal = housingCost * (1 - mortgageOption.downPayment);
  const monthlyRate = mortgageOption.interestRate / 12;
  const numPayments = mortgageOption.termYears * 12;

  if (monthlyRate === 0) return principal / numPayments;

  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
};

export const calculateUtilityCosts = (housingType, selectedUtilities = []) => {
  const housing = HOUSING_TYPES[housingType];
  if (!housing) return 0;

  const sizeMultiplier = Math.log10(housing.cost + 1) / 2; // Larger homes cost more

  return selectedUtilities.reduce((total, utilityId) => {
    const utility = UTILITY_SERVICES[utilityId];
    if (!utility) return total;

    return total + (utility.baseCost * utility.scalingFactor * sizeMultiplier);
  }, 0);
};

export const getHousingEffects = (housingType) => {
  const housing = HOUSING_TYPES[housingType];
  if (!housing) return {};

  return {
    happiness: housing.happiness,
    health: housing.health,
    energy: housing.energy,
    stress: housing.stress,
    socialStatus: housing.socialStatus
  };
};

export const canAffordHousing = (housingType, playerCash, creditScore, monthlyIncome, mortgageType = 'cash_purchase') => {
  const housing = HOUSING_TYPES[housingType];
  const mortgage = MORTGAGE_OPTIONS[mortgageType];

  if (!housing || !mortgage) return false;

  // Check basic requirements
  if (housing.requirements.creditScore > creditScore) return false;
  if (housing.requirements.monthlyIncome && housing.requirements.monthlyIncome > monthlyIncome) return false;

  // Check down payment
  const downPayment = housing.cost * mortgage.downPayment;
  if (downPayment > playerCash) return false;

  // Check monthly payment affordability (should be < 30% of income)
  const monthlyPayment = calculateMortgagePayment(housing.cost, mortgage);
  const totalMonthlyHousingCost = monthlyPayment + housing.monthlyMaintenance;

  return totalMonthlyHousingCost <= monthlyIncome * 0.3;
};

export const getHousingUpgradePath = (currentHousing) => {
  const housingOrder = [
    'homeless', 'shelter', 'studio_apartment', 'apartment', 'house',
    'luxury_condo', 'mansion', 'penthouse', 'private_island', 'space_station'
  ];

  const currentIndex = housingOrder.indexOf(currentHousing);
  if (currentIndex === -1 || currentIndex === housingOrder.length - 1) return null;

  return HOUSING_TYPES[housingOrder[currentIndex + 1]];
};

export default HOUSING_TYPES; 