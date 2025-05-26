import { BUSINESSES_CONFIG, BUSINESS_CATEGORIES } from '../../config/businessConfig.js';

// Simple business types mapping for compatibility
const BUSINESS_TYPES = {
  'lemonade_stand': {
    cost: 500,
    baseRevenue: 50,
    baseExpenses: 20,
    defaultName: 'Lemonade Stand',
    baseEmployees: 1,
    initialMarketShare: 1
  },
  'pizza_shop': {
    cost: 2000,
    baseRevenue: 150,
    baseExpenses: 80,
    defaultName: 'Pizza Shop',
    baseEmployees: 3,
    initialMarketShare: 2
  },
  'coffee_chain': {
    cost: 5000,
    baseRevenue: 300,
    baseExpenses: 150,
    defaultName: 'Coffee Chain',
    baseEmployees: 5,
    initialMarketShare: 3
  },
  'tech_startup': {
    cost: 25000,
    baseRevenue: 1000,
    baseExpenses: 600,
    defaultName: 'Tech Startup',
    baseEmployees: 10,
    initialMarketShare: 5
  },
  'retail_store': {
    cost: 10000,
    baseRevenue: 500,
    baseExpenses: 250,
    defaultName: 'Retail Store',
    baseEmployees: 6,
    initialMarketShare: 3
  }
};

/**
 * Business Store Module
 * Manages business ownership, operations, and empire management
 */
export const createBusinessStore = (set, get) => ({
  // Business State
  businesses: [],
  businessStats: {
    totalBusinesses: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalEmployees: 0,
    businessEmpireValue: 0,
    monthlyBusinessIncome: 0
  },
  businessHistory: [],
  supplyChainDeals: [],
  businessGoals: [],

  // Business Actions
  updateBusinesses: (updates) => set((state) => ({
    businesses: updates
  })),

  /**
   * Purchase a new business
   */
  addBusiness: (businessType, customName = null) => {
    const state = get();
    const businessConfig = BUSINESS_TYPES[businessType];

    if (!businessConfig) {
      return { success: false, error: 'Invalid business type' };
    }

    // Check if player can afford the business
    if (state.player.cash < businessConfig.cost) {
      return { success: false, error: 'Insufficient funds' };
    }

    const newBusiness = {
      id: Date.now(),
      type: businessType,
      name: customName || businessConfig.defaultName,
      level: 1,
      purchasePrice: businessConfig.cost,
      currentValue: businessConfig.cost,
      monthlyRevenue: businessConfig.baseRevenue,
      monthlyExpenses: businessConfig.baseExpenses,
      monthlyProfit: businessConfig.baseRevenue - businessConfig.baseExpenses,
      employees: businessConfig.baseEmployees,
      efficiency: 100,
      reputation: 50,
      marketShare: businessConfig.initialMarketShare || 1,
      purchaseDate: new Date(),
      lastUpgrade: null,
      upgrades: [],
      supplyChainDeals: [],
      businessMetrics: {
        totalRevenue: 0,
        totalProfit: 0,
        monthsOwned: 0,
        customerSatisfaction: 75,
        employeeSatisfaction: 70
      },
      status: 'active'
    };

    set((state) => {
      const updatedBusinessStats = {
        ...state.businessStats,
        totalBusinesses: state.businessStats.totalBusinesses + 1,
        businessEmpireValue: state.businessStats.businessEmpireValue + businessConfig.cost,
        monthlyBusinessIncome: state.businessStats.monthlyBusinessIncome + newBusiness.monthlyProfit,
        totalEmployees: state.businessStats.totalEmployees + newBusiness.employees
      };

      return {
        player: {
          ...state.player,
          cash: state.player.cash - businessConfig.cost,
          monthlyIncome: state.player.monthlyIncome + newBusiness.monthlyProfit,
          lifetimeStats: {
            ...state.player.lifetimeStats,
            totalBusinessesBought: state.player.lifetimeStats.totalBusinessesBought + 1
          }
        },
        businesses: [...state.businesses, newBusiness],
        businessStats: updatedBusinessStats,
        businessHistory: [...state.businessHistory, {
          id: Date.now(),
          type: 'purchase',
          businessType,
          businessName: newBusiness.name,
          amount: businessConfig.cost,
          timestamp: new Date()
        }]
      };
    });

    return { success: true, business: newBusiness };
  },

  /**
   * Upgrade an existing business
   */
  upgradeBusiness: (businessId, upgradeType) => {
    const state = get();
    const business = state.businesses.find(b => b.id === businessId);

    if (!business) {
      return { success: false, error: 'Business not found' };
    }

    const upgradeTypes = {
      'efficiency': {
        cost: business.currentValue * 0.2,
        effects: { efficiency: 10, monthlyProfit: business.monthlyRevenue * 0.1 }
      },
      'expansion': {
        cost: business.currentValue * 0.3,
        effects: { monthlyRevenue: business.monthlyRevenue * 0.15, employees: Math.ceil(business.employees * 0.2) }
      },
      'technology': {
        cost: business.currentValue * 0.25,
        effects: { efficiency: 15, monthlyExpenses: -business.monthlyExpenses * 0.1 }
      },
      'marketing': {
        cost: business.currentValue * 0.15,
        effects: { reputation: 10, monthlyRevenue: business.monthlyRevenue * 0.12 }
      },
      'automation': {
        cost: business.currentValue * 0.4,
        effects: { efficiency: 20, employees: -Math.ceil(business.employees * 0.3), monthlyExpenses: -business.monthlyExpenses * 0.15 }
      }
    };

    const upgrade = upgradeTypes[upgradeType];
    if (!upgrade) {
      return { success: false, error: 'Invalid upgrade type' };
    }

    if (state.player.cash < upgrade.cost) {
      return { success: false, error: 'Insufficient funds for upgrade' };
    }

    set((state) => {
      const updatedBusinesses = state.businesses.map(b => {
        if (b.id === businessId) {
          const updatedBusiness = {
            ...b,
            efficiency: Math.min(200, b.efficiency + (upgrade.effects.efficiency || 0)),
            reputation: Math.min(100, b.reputation + (upgrade.effects.reputation || 0)),
            monthlyRevenue: b.monthlyRevenue + (upgrade.effects.monthlyRevenue || 0),
            monthlyExpenses: Math.max(0, b.monthlyExpenses + (upgrade.effects.monthlyExpenses || 0)),
            employees: Math.max(1, b.employees + (upgrade.effects.employees || 0)),
            currentValue: b.currentValue + upgrade.cost * 0.7, // Upgrades add value
            lastUpgrade: new Date(),
            upgrades: [...b.upgrades, {
              id: Date.now(),
              type: upgradeType,
              cost: upgrade.cost,
              effects: upgrade.effects,
              date: new Date()
            }]
          };

          // Recalculate monthly profit
          updatedBusiness.monthlyProfit = updatedBusiness.monthlyRevenue - updatedBusiness.monthlyExpenses;

          return updatedBusiness;
        }
        return b;
      });

      // Recalculate business stats
      const newMonthlyBusinessIncome = updatedBusinesses.reduce((sum, b) => sum + b.monthlyProfit, 0);
      const oldMonthlyBusinessIncome = state.businessStats.monthlyBusinessIncome;
      const incomeChange = newMonthlyBusinessIncome - oldMonthlyBusinessIncome;

      return {
        player: {
          ...state.player,
          cash: state.player.cash - upgrade.cost,
          monthlyIncome: state.player.monthlyIncome + incomeChange
        },
        businesses: updatedBusinesses,
        businessStats: {
          ...state.businessStats,
          monthlyBusinessIncome: newMonthlyBusinessIncome,
          businessEmpireValue: state.businessStats.businessEmpireValue + upgrade.cost * 0.7,
          totalEmployees: updatedBusinesses.reduce((sum, b) => sum + b.employees, 0)
        }
      };
    });

    return { success: true, upgrade };
  },

  /**
   * Sell a business
   */
  sellBusiness: (businessId) => {
    const state = get();
    const business = state.businesses.find(b => b.id === businessId);

    if (!business) {
      return { success: false, error: 'Business not found' };
    }

    // Calculate sale price (current value with some depreciation)
    const salePrice = Math.floor(business.currentValue * 0.8);

    set((state) => {
      const updatedBusinesses = state.businesses.filter(b => b.id !== businessId);

      const updatedBusinessStats = {
        ...state.businessStats,
        totalBusinesses: state.businessStats.totalBusinesses - 1,
        businessEmpireValue: state.businessStats.businessEmpireValue - business.currentValue,
        monthlyBusinessIncome: state.businessStats.monthlyBusinessIncome - business.monthlyProfit,
        totalEmployees: state.businessStats.totalEmployees - business.employees
      };

      return {
        player: {
          ...state.player,
          cash: state.player.cash + salePrice,
          monthlyIncome: state.player.monthlyIncome - business.monthlyProfit
        },
        businesses: updatedBusinesses,
        businessStats: updatedBusinessStats,
        businessHistory: [...state.businessHistory, {
          id: Date.now(),
          type: 'sale',
          businessType: business.type,
          businessName: business.name,
          amount: salePrice,
          timestamp: new Date()
        }]
      };
    });

    return { success: true, salePrice };
  },

  /**
   * Negotiate supply chain deal
   */
  negotiateSupplyChainDeal: (businessId, dealType) => {
    const state = get();
    const business = state.businesses.find(b => b.id === businessId);

    if (!business) {
      return { success: false, error: 'Business not found' };
    }

    const dealTypes = {
      'bulk_discount': {
        cost: 5000,
        effects: { monthlyExpenses: -business.monthlyExpenses * 0.1 },
        duration: 12, // months
        description: 'Negotiate bulk purchasing discounts'
      },
      'premium_suppliers': {
        cost: 8000,
        effects: { reputation: 5, monthlyRevenue: business.monthlyRevenue * 0.08 },
        duration: 6,
        description: 'Partner with premium suppliers'
      },
      'exclusive_contract': {
        cost: 12000,
        effects: { marketShare: 2, monthlyRevenue: business.monthlyRevenue * 0.15 },
        duration: 18,
        description: 'Secure exclusive supplier contracts'
      },
      'automation_partnership': {
        cost: 15000,
        effects: { efficiency: 25, monthlyExpenses: -business.monthlyExpenses * 0.15 },
        duration: 24,
        description: 'Partner for supply chain automation'
      }
    };

    const deal = dealTypes[dealType];
    if (!deal) {
      return { success: false, error: 'Invalid deal type' };
    }

    if (state.player.cash < deal.cost) {
      return { success: false, error: 'Insufficient funds for deal' };
    }

    // Check if business already has this type of deal
    if (business.supplyChainDeals.some(d => d.type === dealType && d.status === 'active')) {
      return { success: false, error: 'Already have this type of deal' };
    }

    const newDeal = {
      id: Date.now(),
      type: dealType,
      cost: deal.cost,
      effects: deal.effects,
      duration: deal.duration,
      startDate: new Date(),
      endDate: new Date(Date.now() + deal.duration * 30 * 24 * 60 * 60 * 1000), // months to milliseconds
      status: 'active',
      description: deal.description
    };

    set((state) => {
      const updatedBusinesses = state.businesses.map(b => {
        if (b.id === businessId) {
          const updatedBusiness = {
            ...b,
            efficiency: Math.min(200, b.efficiency + (deal.effects.efficiency || 0)),
            reputation: Math.min(100, b.reputation + (deal.effects.reputation || 0)),
            marketShare: Math.min(50, b.marketShare + (deal.effects.marketShare || 0)),
            monthlyRevenue: b.monthlyRevenue + (deal.effects.monthlyRevenue || 0),
            monthlyExpenses: Math.max(0, b.monthlyExpenses + (deal.effects.monthlyExpenses || 0)),
            supplyChainDeals: [...b.supplyChainDeals, newDeal]
          };

          // Recalculate monthly profit
          updatedBusiness.monthlyProfit = updatedBusiness.monthlyRevenue - updatedBusiness.monthlyExpenses;

          return updatedBusiness;
        }
        return b;
      });

      // Recalculate total monthly business income
      const newMonthlyBusinessIncome = updatedBusinesses.reduce((sum, b) => sum + b.monthlyProfit, 0);
      const incomeChange = newMonthlyBusinessIncome - state.businessStats.monthlyBusinessIncome;

      return {
        player: {
          ...state.player,
          cash: state.player.cash - deal.cost,
          monthlyIncome: state.player.monthlyIncome + incomeChange
        },
        businesses: updatedBusinesses,
        businessStats: {
          ...state.businessStats,
          monthlyBusinessIncome: newMonthlyBusinessIncome
        },
        supplyChainDeals: [...state.supplyChainDeals, newDeal]
      };
    });

    return { success: true, deal: newDeal };
  },

  /**
   * Get business statistics and empire overview
   */
  getBusinessStats: () => {
    const state = get();
    const { businesses, businessStats } = state;

    const businessesByType = businesses.reduce((acc, business) => {
      acc[business.type] = (acc[business.type] || 0) + 1;
      return acc;
    }, {});

    const averageBusinessValue = businesses.length > 0
      ? businesses.reduce((sum, b) => sum + b.currentValue, 0) / businesses.length
      : 0;

    const averageEfficiency = businesses.length > 0
      ? businesses.reduce((sum, b) => sum + b.efficiency, 0) / businesses.length
      : 0;

    const averageReputation = businesses.length > 0
      ? businesses.reduce((sum, b) => sum + b.reputation, 0) / businesses.length
      : 0;

    const totalMarketShare = businesses.reduce((sum, b) => sum + b.marketShare, 0);
    const activeSupplyChainDeals = businesses.reduce((sum, b) =>
      sum + b.supplyChainDeals.filter(d => d.status === 'active').length, 0
    );

    const businessEmpireLevel = calculateBusinessEmpireLevel(businessStats);

    return {
      totalBusinesses: businessStats.totalBusinesses,
      businessesByType,
      totalRevenue: businessStats.totalRevenue,
      totalProfit: businessStats.totalProfit,
      monthlyBusinessIncome: businessStats.monthlyBusinessIncome,
      totalEmployees: businessStats.totalEmployees,
      businessEmpireValue: businessStats.businessEmpireValue,
      averageBusinessValue: Math.round(averageBusinessValue),
      averageEfficiency: Math.round(averageEfficiency),
      averageReputation: Math.round(averageReputation),
      totalMarketShare,
      activeSupplyChainDeals,
      businessEmpireLevel,
      nextEmpireMilestone: getNextEmpireMilestone(businessStats)
    };
  },

  /**
   * Process monthly business operations
   */
  processMonthlyBusinessOperations: () => set((state) => {
    const updatedBusinesses = state.businesses.map(business => {
      // Apply market fluctuations
      const marketFluctuation = (Math.random() - 0.5) * 0.1; // ±5% fluctuation
      const fluctuationMultiplier = 1 + marketFluctuation;

      // Calculate efficiency impact
      const efficiencyMultiplier = business.efficiency / 100;

      // Calculate monthly revenue with fluctuations and efficiency
      const monthlyRevenue = business.monthlyRevenue * fluctuationMultiplier * efficiencyMultiplier;
      const monthlyProfit = monthlyRevenue - business.monthlyExpenses;

      // Update business metrics
      const updatedMetrics = {
        ...business.businessMetrics,
        totalRevenue: business.businessMetrics.totalRevenue + monthlyRevenue,
        totalProfit: business.businessMetrics.totalProfit + monthlyProfit,
        monthsOwned: business.businessMetrics.monthsOwned + 1,
        customerSatisfaction: Math.max(0, Math.min(100,
          business.businessMetrics.customerSatisfaction + (Math.random() - 0.5) * 10
        )),
        employeeSatisfaction: Math.max(0, Math.min(100,
          business.businessMetrics.employeeSatisfaction + (Math.random() - 0.5) * 8
        ))
      };

      // Check for expired supply chain deals
      const activeDeals = business.supplyChainDeals.map(deal => {
        if (deal.status === 'active' && new Date() > new Date(deal.endDate)) {
          return { ...deal, status: 'expired' };
        }
        return deal;
      });

      return {
        ...business,
        businessMetrics: updatedMetrics,
        supplyChainDeals: activeDeals,
        // Slight value appreciation over time
        currentValue: business.currentValue * 1.002
      };
    });

    // Recalculate business stats
    const totalRevenue = updatedBusinesses.reduce((sum, b) => sum + b.businessMetrics.totalRevenue, 0);
    const totalProfit = updatedBusinesses.reduce((sum, b) => sum + b.businessMetrics.totalProfit, 0);
    const businessEmpireValue = updatedBusinesses.reduce((sum, b) => sum + b.currentValue, 0);
    const monthlyBusinessIncome = updatedBusinesses.reduce((sum, b) => sum + b.monthlyProfit, 0);

    const updatedBusinessStats = {
      ...state.businessStats,
      totalRevenue,
      totalProfit,
      businessEmpireValue,
      monthlyBusinessIncome
    };

    return {
      businesses: updatedBusinesses,
      businessStats: updatedBusinessStats
    };
  }),

  /**
   * Get available business types based on player's wealth and experience
   */
  getAvailableBusinessTypes: () => {
    const state = get();
    const availableTypes = [];

    Object.entries(BUSINESS_TYPES).forEach(([businessType, config]) => {
      const canAfford = state.player.cash >= config.cost;
      const meetsRequirements = checkBusinessRequirements(businessType, state);

      availableTypes.push({
        type: businessType,
        config,
        canAfford,
        meetsRequirements,
        available: canAfford && meetsRequirements
      });
    });

    return availableTypes.sort((a, b) => a.config.cost - b.config.cost);
  },

  /**
   * Get business summary for dashboard
   */
  getBusinessSummary: () => {
    const state = get();
    const { businesses, businessStats } = state;

    if (businesses.length === 0) {
      return {
        totalBusinesses: 0,
        totalValue: 0,
        monthlyIncome: 0,
        totalEmployees: 0,
        averageEfficiency: 0,
        topPerformer: null,
        recentActivity: []
      };
    }

    const totalValue = businesses.reduce((sum, b) => sum + b.currentValue, 0);
    const monthlyIncome = businesses.reduce((sum, b) => sum + b.monthlyProfit, 0);
    const totalEmployees = businesses.reduce((sum, b) => sum + b.employees, 0);
    const averageEfficiency = businesses.reduce((sum, b) => sum + b.efficiency, 0) / businesses.length;

    // Find top performing business
    const topPerformer = businesses.reduce((top, current) => {
      return current.monthlyProfit > (top?.monthlyProfit || 0) ? current : top;
    }, null);

    // Get recent business activity
    const recentActivity = state.businessHistory?.slice(-5) || [];

    return {
      totalBusinesses: businesses.length,
      totalValue: Math.round(totalValue),
      monthlyIncome: Math.round(monthlyIncome),
      totalEmployees,
      averageEfficiency: Math.round(averageEfficiency),
      topPerformer: topPerformer ? {
        name: topPerformer.name,
        type: topPerformer.type,
        monthlyProfit: topPerformer.monthlyProfit
      } : null,
      recentActivity
    };
  }
});

// Helper functions
function calculateBusinessEmpireLevel(businessStats) {
  const { totalBusinesses, businessEmpireValue, totalEmployees } = businessStats;

  let level = 1;
  let score = 0;

  // Points for number of businesses
  score += totalBusinesses * 10;

  // Points for empire value
  score += Math.floor(businessEmpireValue / 10000);

  // Points for employees
  score += totalEmployees * 2;

  // Determine level based on score
  if (score >= 1000) level = 10; // Business Mogul
  else if (score >= 750) level = 9; // Empire Builder
  else if (score >= 500) level = 8; // Industry Leader
  else if (score >= 350) level = 7; // Business Tycoon
  else if (score >= 250) level = 6; // Corporate Executive
  else if (score >= 150) level = 5; // Business Owner
  else if (score >= 100) level = 4; // Entrepreneur
  else if (score >= 60) level = 3; // Small Business Owner
  else if (score >= 30) level = 2; // Startup Founder
  else level = 1; // Aspiring Entrepreneur

  return { level, score };
}

function getNextEmpireMilestone(businessStats) {
  const currentLevel = calculateBusinessEmpireLevel(businessStats).level;

  const milestones = {
    1: { businesses: 1, value: 50000, description: 'Own your first business' },
    2: { businesses: 2, value: 100000, description: 'Build a small business portfolio' },
    3: { businesses: 3, value: 250000, description: 'Establish multiple revenue streams' },
    4: { businesses: 5, value: 500000, description: 'Become a serial entrepreneur' },
    5: { businesses: 8, value: 1000000, description: 'Build a business empire' },
    6: { businesses: 12, value: 2500000, description: 'Achieve corporate executive status' },
    7: { businesses: 15, value: 5000000, description: 'Become a business tycoon' },
    8: { businesses: 20, value: 10000000, description: 'Lead your industry' },
    9: { businesses: 25, value: 25000000, description: 'Build a business empire' },
    10: { businesses: 30, value: 50000000, description: 'Become a business mogul' }
  };

  return milestones[currentLevel + 1] || null;
}

function checkBusinessRequirements(businessType, state) {
  const requirements = {
    'lemonade_stand': { minCash: 0, minBusinesses: 0, minLevel: 1 },
    'food_truck': { minCash: 10000, minBusinesses: 1, minLevel: 2 },
    'retail_store': { minCash: 25000, minBusinesses: 2, minLevel: 3 },
    'restaurant': { minCash: 50000, minBusinesses: 3, minLevel: 4 },
    'tech_startup': { minCash: 100000, minBusinesses: 5, minLevel: 5 },
    'manufacturing': { minCash: 250000, minBusinesses: 8, minLevel: 6 },
    'real_estate_firm': { minCash: 500000, minBusinesses: 10, minLevel: 7 },
    'investment_bank': { minCash: 1000000, minBusinesses: 15, minLevel: 8 }
  };

  const requirement = requirements[businessType];
  if (!requirement) return true;

  return (
    state.player.cash >= requirement.minCash &&
    state.businessStats.totalBusinesses >= requirement.minBusinesses &&
    state.player.level >= requirement.minLevel
  );
}
