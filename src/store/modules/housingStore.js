import {
  HOUSING_TYPES,
  MORTGAGE_OPTIONS,
  getHousingEffects,
  canAffordHousing,
  calculateMortgagePayment,
  calculateUtilityCosts
} from '../../config/housingConfig.js';

/**
 * Housing Store Module
 * Manages housing types, mortgages, utilities, and housing effects
 */
export const createHousingStore = (set, get) => ({
  // Housing State
  housing: {
    currentHousing: 'homeless',
    ownedProperties: [],
    mortgages: [],
    utilities: [],
    monthlyHousingCost: 0,
    housingHistory: [],
    totalHousingSpent: 0,
    maintenanceSchedule: [],
    housingUpgrades: []
  },

  // Housing Actions
  updateHousing: (updates) => set((state) => ({
    housing: { ...state.housing, ...updates }
  })),

  /**
   * Move to new housing (rent or buy)
   */
  moveToHousing: (housingType, purchaseType = 'rent', mortgageOption = null) => {
    const state = get();
    const housingConfig = HOUSING_TYPES[housingType];

    if (!housingConfig) {
      return { success: false, error: 'Invalid housing type' };
    }

    // Check affordability
    const affordabilityCheck = canAffordHousing(
      housingType,
      state.player.cash,
      state.player.monthlyIncome,
      state.player.creditScore,
      purchaseType,
      mortgageOption
    );

    if (!affordabilityCheck.canAfford) {
      return { success: false, error: affordabilityCheck.reason };
    }

    let upfrontCost = 0;
    let monthlyCost = 0;
    let newMortgage = null;

    if (purchaseType === 'rent') {
      monthlyCost = housingConfig.rentCost;
    } else if (purchaseType === 'buy') {
      if (mortgageOption) {
        const mortgage = MORTGAGE_OPTIONS[mortgageOption];
        const downPayment = housingConfig.purchasePrice * mortgage.downPaymentPercent;
        const loanAmount = housingConfig.purchasePrice - downPayment;

        upfrontCost = downPayment + mortgage.closingCosts;
        monthlyCost = calculateMortgagePayment(loanAmount, mortgage.interestRate, mortgage.termYears);

        newMortgage = {
          id: Date.now(),
          housingType,
          loanAmount,
          monthlyPayment: monthlyCost,
          interestRate: mortgage.interestRate,
          termYears: mortgage.termYears,
          remainingBalance: loanAmount,
          startDate: new Date(),
          mortgageType: mortgageOption
        };
      } else {
        upfrontCost = housingConfig.purchasePrice;
        monthlyCost = 0; // Owned outright
      }
    }

    // Check if player can afford upfront cost
    if (state.player.cash < upfrontCost) {
      return { success: false, error: 'Insufficient funds for upfront cost' };
    }

    set((state) => {
      // Add previous housing to history
      const housingHistory = state.housing.currentHousing !== 'homeless'
        ? [...state.housing.housingHistory, {
          housingType: state.housing.currentHousing,
          startDate: state.housing.moveInDate || new Date(),
          endDate: new Date(),
          totalCost: state.housing.totalHousingSpent
        }]
        : state.housing.housingHistory;

      // Add to owned properties if purchased
      const ownedProperties = purchaseType === 'buy'
        ? [...state.housing.ownedProperties, {
          id: Date.now(),
          housingType,
          purchaseDate: new Date(),
          purchasePrice: housingConfig.purchasePrice,
          currentValue: housingConfig.purchasePrice,
          mortgageId: newMortgage?.id || null
        }]
        : state.housing.ownedProperties;

      // Add mortgage if applicable
      const mortgages = newMortgage
        ? [...state.housing.mortgages, newMortgage]
        : state.housing.mortgages;

      return {
        player: {
          ...state.player,
          cash: state.player.cash - upfrontCost
        },
        housing: {
          ...state.housing,
          currentHousing: housingType,
          monthlyHousingCost: monthlyCost,
          ownedProperties,
          mortgages,
          housingHistory,
          moveInDate: new Date(),
          totalHousingSpent: state.housing.totalHousingSpent + upfrontCost
        }
      };
    });

    // Apply housing effects to player stats
    get().applyHousingEffects();

    return { success: true, upfrontCost, monthlyCost };
  },

  /**
   * Add utility service
   */
  addUtility: (utilityType) => set((state) => {
    const utilityCost = calculateUtilityCosts(utilityType, state.housing.currentHousing);

    // Check if utility already exists
    if (state.housing.utilities.some(u => u.type === utilityType)) {
      return state;
    }

    const newUtility = {
      id: Date.now(),
      type: utilityType,
      monthlyCost: utilityCost,
      connectedDate: new Date(),
      status: 'active'
    };

    return {
      housing: {
        ...state.housing,
        utilities: [...state.housing.utilities, newUtility],
        monthlyHousingCost: state.housing.monthlyHousingCost + utilityCost
      }
    };
  }),

  /**
   * Remove utility service
   */
  removeUtility: (utilityId) => set((state) => {
    const utility = state.housing.utilities.find(u => u.id === utilityId);
    if (!utility) return state;

    return {
      housing: {
        ...state.housing,
        utilities: state.housing.utilities.filter(u => u.id !== utilityId),
        monthlyHousingCost: state.housing.monthlyHousingCost - utility.monthlyCost
      }
    };
  }),

  /**
   * Apply housing effects to player stats
   */
  applyHousingEffects: () => set((state) => {
    const effects = getHousingEffects(state.housing.currentHousing);

    return {
      player: {
        ...state.player,
        happiness: Math.max(0, Math.min(100, state.player.happiness + effects.happiness)),
        health: Math.max(0, Math.min(100, state.player.health + effects.health)),
        energy: Math.max(0, Math.min(100, state.player.energy + effects.energy)),
        stress: Math.max(0, Math.min(100, state.player.stress + effects.stress))
      }
    };
  }),

  /**
   * Pay mortgage payment
   */
  payMortgage: (mortgageId, amount) => set((state) => {
    const mortgage = state.housing.mortgages.find(m => m.id === mortgageId);
    if (!mortgage || state.player.cash < amount) return state;

    const updatedMortgages = state.housing.mortgages.map(m => {
      if (m.id === mortgageId) {
        const newBalance = Math.max(0, m.remainingBalance - amount);
        return { ...m, remainingBalance: newBalance, lastPayment: new Date() };
      }
      return m;
    }).filter(m => m.remainingBalance > 0);

    return {
      player: {
        ...state.player,
        cash: state.player.cash - amount
      },
      housing: {
        ...state.housing,
        mortgages: updatedMortgages
      }
    };
  }),

  /**
   * Upgrade housing (renovations, improvements)
   */
  upgradeHousing: (upgradeType, cost) => set((state) => {
    if (state.player.cash < cost) return state;

    const upgrade = {
      id: Date.now(),
      type: upgradeType,
      cost,
      completedDate: new Date(),
      effects: getUpgradeEffects(upgradeType)
    };

    return {
      player: {
        ...state.player,
        cash: state.player.cash - cost
      },
      housing: {
        ...state.housing,
        housingUpgrades: [...state.housing.housingUpgrades, upgrade],
        totalHousingSpent: state.housing.totalHousingSpent + cost
      }
    };
  }),

  /**
   * Schedule maintenance
   */
  scheduleMaintenance: (maintenanceType, cost, scheduledDate) => set((state) => {
    const maintenance = {
      id: Date.now(),
      type: maintenanceType,
      cost,
      scheduledDate: new Date(scheduledDate),
      status: 'scheduled'
    };

    return {
      housing: {
        ...state.housing,
        maintenanceSchedule: [...state.housing.maintenanceSchedule, maintenance]
      }
    };
  }),

  /**
   * Complete scheduled maintenance
   */
  completeMaintenance: (maintenanceId) => set((state) => {
    const maintenance = state.housing.maintenanceSchedule.find(m => m.id === maintenanceId);
    if (!maintenance || state.player.cash < maintenance.cost) return state;

    const updatedSchedule = state.housing.maintenanceSchedule.map(m =>
      m.id === maintenanceId
        ? { ...m, status: 'completed', completedDate: new Date() }
        : m
    );

    return {
      player: {
        ...state.player,
        cash: state.player.cash - maintenance.cost
      },
      housing: {
        ...state.housing,
        maintenanceSchedule: updatedSchedule,
        totalHousingSpent: state.housing.totalHousingSpent + maintenance.cost
      }
    };
  }),

  /**
   * Get housing statistics and information
   */
  getHousingStats: () => {
    const state = get();
    const { housing } = state;

    const currentHousingConfig = HOUSING_TYPES[housing.currentHousing];
    const totalUtilityCost = housing.utilities.reduce((sum, utility) => sum + utility.monthlyCost, 0);
    const totalMortgagePayments = housing.mortgages.reduce((sum, mortgage) => sum + mortgage.monthlyPayment, 0);
    const totalMonthlyHousingCost = housing.monthlyHousingCost + totalUtilityCost;

    const propertyValue = housing.ownedProperties.reduce((sum, property) => sum + property.currentValue, 0);
    const mortgageDebt = housing.mortgages.reduce((sum, mortgage) => sum + mortgage.remainingBalance, 0);
    const housingEquity = propertyValue - mortgageDebt;

    const housingEffects = getHousingEffects(housing.currentHousing);

    return {
      currentHousing: housing.currentHousing,
      housingLevel: currentHousingConfig?.level || 0,
      monthlyHousingCost: housing.monthlyHousingCost,
      totalUtilityCost,
      totalMortgagePayments,
      totalMonthlyHousingCost,
      propertyValue,
      mortgageDebt,
      housingEquity,
      totalHousingSpent: housing.totalHousingSpent,
      utilitiesCount: housing.utilities.length,
      upgradesCount: housing.housingUpgrades.length,
      housingEffects,
      canUpgrade: getAvailableUpgrades(housing.currentHousing),
      maintenanceNeeded: housing.maintenanceSchedule.filter(m => m.status === 'scheduled').length
    };
  },

  /**
   * Get available housing options based on player's financial situation
   */
  getAvailableHousing: () => {
    const state = get();
    const availableHousing = [];

    Object.entries(HOUSING_TYPES).forEach(([housingType, config]) => {
      // Check rent affordability
      const rentAffordability = canAffordHousing(
        housingType,
        state.player.cash,
        state.player.monthlyIncome,
        state.player.creditScore,
        'rent'
      );

      // Check purchase affordability with different mortgage options
      const purchaseOptions = [];
      Object.entries(MORTGAGE_OPTIONS).forEach(([mortgageType, mortgageConfig]) => {
        const purchaseAffordability = canAffordHousing(
          housingType,
          state.player.cash,
          state.player.monthlyIncome,
          state.player.creditScore,
          'buy',
          mortgageType
        );

        if (purchaseAffordability.canAfford) {
          purchaseOptions.push({
            mortgageType,
            ...purchaseAffordability
          });
        }
      });

      // Check cash purchase
      const cashPurchaseAffordability = canAffordHousing(
        housingType,
        state.player.cash,
        state.player.monthlyIncome,
        state.player.creditScore,
        'buy'
      );

      availableHousing.push({
        housingType,
        config,
        rentOption: rentAffordability,
        purchaseOptions,
        cashPurchase: cashPurchaseAffordability
      });
    });

    return availableHousing;
  },

  /**
   * Process monthly housing costs and maintenance
   */
  processMonthlyHousing: () => set((state) => {
    const totalMonthlyCost = state.housing.monthlyHousingCost +
      state.housing.utilities.reduce((sum, utility) => sum + utility.monthlyCost, 0);

    // Check for overdue maintenance
    const overdueMaintenanceCount = state.housing.maintenanceSchedule.filter(m =>
      m.status === 'scheduled' && new Date(m.scheduledDate) < new Date()
    ).length;

    // Apply maintenance penalties
    let maintenancePenalty = 0;
    if (overdueMaintenanceCount > 0) {
      maintenancePenalty = overdueMaintenanceCount * 50; // $50 per overdue maintenance
    }

    return {
      player: {
        ...state.player,
        cash: Math.max(0, state.player.cash - totalMonthlyCost - maintenancePenalty),
        stress: overdueMaintenanceCount > 0
          ? Math.min(100, state.player.stress + (overdueMaintenanceCount * 5))
          : state.player.stress
      },
      housing: {
        ...state.housing,
        totalHousingSpent: state.housing.totalHousingSpent + totalMonthlyCost + maintenancePenalty
      }
    };
  })
});

// Helper functions
function getUpgradeEffects(upgradeType) {
  const upgradeEffects = {
    'security_system': { safety: 10, stress: -5 },
    'solar_panels': { monthlyCost: -100, happiness: 5 },
    'smart_home': { energy: 5, happiness: 10 },
    'garden': { happiness: 15, health: 5 },
    'home_gym': { health: 20, energy: 10 },
    'home_office': { productivity: 15, stress: -10 }
  };

  return upgradeEffects[upgradeType] || {};
}

function getAvailableUpgrades(housingType) {
  const housingConfig = HOUSING_TYPES[housingType];
  if (!housingConfig) return [];

  // Different housing types support different upgrades
  const upgradesByHousingLevel = {
    1: ['security_system'], // Homeless, emergency shelter
    2: ['security_system'], // Studio, apartment
    3: ['security_system', 'smart_home'], // House
    4: ['security_system', 'smart_home', 'solar_panels', 'garden'], // Luxury condo, mansion
    5: ['security_system', 'smart_home', 'solar_panels', 'garden', 'home_gym', 'home_office'] // Penthouse, private island, space station
  };

  return upgradesByHousingLevel[housingConfig.level] || [];
}
