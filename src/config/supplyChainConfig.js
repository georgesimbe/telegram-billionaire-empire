export const RESOURCE_TYPES = {
  // Raw Materials
  WATER: {
    id: 'water',
    name: 'Water',
    icon: '💧',
    category: 'raw_material',
    basePrice: 5,
    volatility: 0.1,
    description: 'Essential resource for most production processes'
  },
  GRAPES: {
    id: 'grapes',
    name: 'Grapes',
    icon: '🍇',
    category: 'raw_material',
    basePrice: 15,
    volatility: 0.2,
    description: 'Agricultural product used in food and beverage production'
  },
  METAL: {
    id: 'metal',
    name: 'Metal',
    icon: '⚙️',
    category: 'raw_material',
    basePrice: 25,
    volatility: 0.15,
    description: 'Industrial metal for manufacturing'
  },
  SILICON: {
    id: 'silicon',
    name: 'Silicon',
    icon: '🔬',
    category: 'raw_material',
    basePrice: 40,
    volatility: 0.25,
    description: 'High-tech material for electronics'
  },
  ENERGY: {
    id: 'energy',
    name: 'Energy',
    icon: '⚡',
    category: 'raw_material',
    basePrice: 20,
    volatility: 0.3,
    description: 'Power source for all operations'
  },
  LUMBER: {
    id: 'lumber',
    name: 'Lumber',
    icon: '🪵',
    category: 'raw_material',
    basePrice: 18,
    volatility: 0.12,
    description: 'Wood material for construction'
  },
  COTTON: {
    id: 'cotton',
    name: 'Cotton',
    icon: '🌾',
    category: 'raw_material',
    basePrice: 12,
    volatility: 0.18,
    description: 'Natural fiber for textile production'
  },

  // Intermediate Goods
  COMPONENTS: {
    id: 'components',
    name: 'Electronic Components',
    icon: '🔧',
    category: 'intermediate',
    basePrice: 80,
    volatility: 0.2,
    description: 'Processed parts for electronics manufacturing'
  },
  FABRIC: {
    id: 'fabric',
    name: 'Fabric',
    icon: '🧵',
    category: 'intermediate',
    basePrice: 35,
    volatility: 0.15,
    description: 'Processed textile material'
  },
  PROCESSED_FOOD: {
    id: 'processed_food',
    name: 'Processed Food',
    icon: '🥫',
    category: 'intermediate',
    basePrice: 45,
    volatility: 0.12,
    description: 'Prepared food ingredients'
  },
  STEEL: {
    id: 'steel',
    name: 'Steel',
    icon: '🏗️',
    category: 'intermediate',
    basePrice: 60,
    volatility: 0.18,
    description: 'Refined metal for construction'
  },
  CHEMICALS: {
    id: 'chemicals',
    name: 'Chemicals',
    icon: '🧪',
    category: 'intermediate',
    basePrice: 70,
    volatility: 0.22,
    description: 'Industrial chemicals for various processes'
  },

  // Finished Products
  MEALS: {
    id: 'meals',
    name: 'Meals',
    icon: '🍽️',
    category: 'finished',
    basePrice: 120,
    volatility: 0.1,
    description: 'Ready-to-serve food products'
  },
  ELECTRONICS: {
    id: 'electronics',
    name: 'Consumer Electronics',
    icon: '📱',
    category: 'finished',
    basePrice: 300,
    volatility: 0.25,
    description: 'Finished electronic devices'
  },
  CLOTHING: {
    id: 'clothing',
    name: 'Clothing',
    icon: '👕',
    category: 'finished',
    basePrice: 85,
    volatility: 0.15,
    description: 'Fashion and apparel products'
  },
  VEHICLES: {
    id: 'vehicles',
    name: 'Vehicles',
    icon: '🚗',
    category: 'finished',
    basePrice: 25000,
    volatility: 0.2,
    description: 'Automotive products'
  },
  ROCKETS: {
    id: 'rockets',
    name: 'Rockets',
    icon: '🚀',
    category: 'finished',
    basePrice: 100000,
    volatility: 0.3,
    description: 'Aerospace vehicles'
  }
};

export const PRODUCTION_RECIPES = {
  // Food Service Recipes
  LEMONADE_STAND: {
    inputs: [
      { resource: 'water', quantity: 2 },
      { resource: 'grapes', quantity: 1 }
    ],
    outputs: [
      { resource: 'meals', quantity: 1 }
    ],
    productionTime: 1, // hours
    energyCost: 5
  },
  PIZZA_SHOP: {
    inputs: [
      { resource: 'processed_food', quantity: 3 },
      { resource: 'water', quantity: 1 },
      { resource: 'energy', quantity: 2 }
    ],
    outputs: [
      { resource: 'meals', quantity: 4 }
    ],
    productionTime: 2,
    energyCost: 15
  },
  COFFEE_CHAIN: {
    inputs: [
      { resource: 'grapes', quantity: 2 },
      { resource: 'water', quantity: 3 },
      { resource: 'energy', quantity: 1 }
    ],
    outputs: [
      { resource: 'meals', quantity: 3 }
    ],
    productionTime: 1,
    energyCost: 10
  },

  // Technology Recipes
  APP_DEVELOPMENT: {
    inputs: [
      { resource: 'energy', quantity: 5 },
      { resource: 'components', quantity: 2 }
    ],
    outputs: [
      { resource: 'electronics', quantity: 1 }
    ],
    productionTime: 8,
    energyCost: 25
  },
  GAMING_STUDIO: {
    inputs: [
      { resource: 'energy', quantity: 8 },
      { resource: 'components', quantity: 4 }
    ],
    outputs: [
      { resource: 'electronics', quantity: 2 }
    ],
    productionTime: 12,
    energyCost: 40
  },

  // Manufacturing Recipes
  ELECTRONICS_FACTORY: {
    inputs: [
      { resource: 'metal', quantity: 5 },
      { resource: 'silicon', quantity: 3 },
      { resource: 'energy', quantity: 10 }
    ],
    outputs: [
      { resource: 'components', quantity: 8 },
      { resource: 'electronics', quantity: 3 }
    ],
    productionTime: 6,
    energyCost: 50
  },

  // Retail Recipes
  FASHION_BOUTIQUE: {
    inputs: [
      { resource: 'fabric', quantity: 4 },
      { resource: 'energy', quantity: 2 }
    ],
    outputs: [
      { resource: 'clothing', quantity: 6 }
    ],
    productionTime: 4,
    energyCost: 20
  },

  // Aerospace Recipes
  SPACE_TOURISM: {
    inputs: [
      { resource: 'steel', quantity: 50 },
      { resource: 'components', quantity: 30 },
      { resource: 'chemicals', quantity: 20 },
      { resource: 'energy', quantity: 100 }
    ],
    outputs: [
      { resource: 'rockets', quantity: 1 }
    ],
    productionTime: 168, // 1 week
    energyCost: 500
  }
};

export const SUPPLY_CHAIN_EVENTS = {
  RESOURCE_SHORTAGE: {
    id: 'resource_shortage',
    name: 'Resource Shortage',
    description: 'Global shortage affects resource availability',
    effects: {
      priceIncrease: 0.5, // 50% price increase
      availabilityDecrease: 0.3 // 30% less available
    },
    duration: 72, // hours
    probability: 0.05
  },
  TRADE_DISRUPTION: {
    id: 'trade_disruption',
    name: 'Trade Route Disruption',
    description: 'Supply chain delays affect production',
    effects: {
      productionSlowdown: 0.4, // 40% slower production
      costIncrease: 0.2 // 20% higher costs
    },
    duration: 48,
    probability: 0.03
  },
  TECHNOLOGY_BREAKTHROUGH: {
    id: 'tech_breakthrough',
    name: 'Technology Breakthrough',
    description: 'New technology improves efficiency',
    effects: {
      efficiencyBoost: 0.3, // 30% more efficient
      costReduction: 0.15 // 15% cost reduction
    },
    duration: 120,
    probability: 0.02
  }
};

export const MARKET_DYNAMICS = {
  DEMAND_FACTORS: {
    POPULATION_GROWTH: { multiplier: 1.02, description: 'Growing population increases demand' },
    ECONOMIC_BOOM: { multiplier: 1.15, description: 'Strong economy boosts consumption' },
    RECESSION: { multiplier: 0.85, description: 'Economic downturn reduces demand' },
    SEASONAL_PEAK: { multiplier: 1.25, description: 'Peak season increases demand' },
    SEASONAL_LOW: { multiplier: 0.75, description: 'Off-season reduces demand' }
  },
  SUPPLY_FACTORS: {
    OVERPRODUCTION: { multiplier: 0.8, description: 'Excess supply lowers prices' },
    UNDERPRODUCTION: { multiplier: 1.3, description: 'Supply shortage raises prices' },
    NEW_COMPETITORS: { multiplier: 0.9, description: 'More suppliers increase competition' },
    MONOPOLY_FORMATION: { multiplier: 1.4, description: 'Market consolidation raises prices' }
  }
};

// Helper functions
export const calculateSupplyChainEfficiency = (business, availableResources) => {
  const recipe = PRODUCTION_RECIPES[business.type];
  if (!recipe) return 1.0;

  let efficiency = 1.0;
  let missingInputs = 0;

  recipe.inputs.forEach(input => {
    const available = availableResources[input.resource] || 0;
    const needed = input.quantity;

    if (available < needed) {
      missingInputs++;
      const shortage = (needed - available) / needed;
      efficiency *= (1 - shortage * 0.2); // 20% efficiency loss per missing input
    }
  });

  return Math.max(0.1, efficiency); // Minimum 10% efficiency
};

export const calculateResourcePrice = (resourceId, marketConditions = {}) => {
  const resource = RESOURCE_TYPES[resourceId];
  if (!resource) return 0;

  let price = resource.basePrice;

  // Apply market volatility
  const volatilityFactor = 1 + (Math.random() - 0.5) * resource.volatility;
  price *= volatilityFactor;

  // Apply market conditions
  Object.values(marketConditions).forEach(condition => {
    price *= condition.multiplier;
  });

  return Math.round(price);
};

export const calculateProductionOutput = (business, efficiency, staffBonus = 1) => {
  const recipe = PRODUCTION_RECIPES[business.type];
  if (!recipe) return {};

  const outputs = {};
  recipe.outputs.forEach(output => {
    const baseQuantity = output.quantity;
    const actualQuantity = Math.floor(baseQuantity * efficiency * staffBonus);
    outputs[output.resource] = actualQuantity;
  });

  return outputs;
};

export const getResourcesByCategory = (category) => {
  return Object.values(RESOURCE_TYPES).filter(resource => resource.category === category);
};

export const calculateSupplyChainCost = (business, resourcePrices) => {
  const recipe = PRODUCTION_RECIPES[business.type];
  if (!recipe) return 0;

  let totalCost = 0;
  recipe.inputs.forEach(input => {
    const price = resourcePrices[input.resource] || RESOURCE_TYPES[input.resource]?.basePrice || 0;
    totalCost += price * input.quantity;
  });

  return totalCost;
};

export const simulateMarketFluctuation = (currentPrices) => {
  const newPrices = { ...currentPrices };

  Object.keys(RESOURCE_TYPES).forEach(resourceId => {
    const resource = RESOURCE_TYPES[resourceId];
    const currentPrice = currentPrices[resourceId] || resource.basePrice;

    // Random market movement
    const change = (Math.random() - 0.5) * resource.volatility * 0.1;
    newPrices[resourceId] = Math.max(
      resource.basePrice * 0.5, // Minimum 50% of base price
      Math.min(
        resource.basePrice * 2, // Maximum 200% of base price
        currentPrice * (1 + change)
      )
    );
  });

  return newPrices;
};

export const getSupplyChainDashboard = (businesses, resources, prices) => {
  const dashboard = {
    totalEfficiency: 0,
    bottlenecks: [],
    recommendations: [],
    resourceNeeds: {},
    surpluses: {}
  };

  let totalBusinesses = 0;
  let totalEfficiencySum = 0;

  businesses.forEach(business => {
    const recipe = PRODUCTION_RECIPES[business.type];
    if (!recipe) return;

    totalBusinesses++;
    const efficiency = calculateSupplyChainEfficiency(business, resources);
    totalEfficiencySum += efficiency;

    if (efficiency < 0.8) {
      dashboard.bottlenecks.push({
        business: business.name,
        efficiency: efficiency,
        missingResources: recipe.inputs.filter(input =>
          (resources[input.resource] || 0) < input.quantity
        )
      });
    }

    // Track resource needs
    recipe.inputs.forEach(input => {
      dashboard.resourceNeeds[input.resource] =
        (dashboard.resourceNeeds[input.resource] || 0) + input.quantity;
    });
  });

  dashboard.totalEfficiency = totalBusinesses > 0 ? totalEfficiencySum / totalBusinesses : 1;

  // Generate recommendations
  if (dashboard.totalEfficiency < 0.7) {
    dashboard.recommendations.push('Consider diversifying your resource production');
  }
  if (dashboard.bottlenecks.length > 3) {
    dashboard.recommendations.push('Focus on securing key resources for bottlenecked businesses');
  }

  return dashboard;
}; 