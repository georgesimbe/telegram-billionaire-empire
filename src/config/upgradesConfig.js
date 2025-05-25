export const UPGRADES_CONFIG = {
  // Click Power Upgrades
  BETTER_FINGER: {
    id: 'BETTER_FINGER',
    name: 'Better Finger',
    description: 'Increase your clicking power by training your finger muscles.',
    icon: '👆',
    baseCost: 100,
    costMultiplier: 1.5,
    effect: '+1 Click Power',
    category: 'click',
    maxLevel: 50,
    bonus: {
      type: 'clickPower',
      value: 1
    }
  },

  GOLDEN_TOUCH: {
    id: 'GOLDEN_TOUCH',
    name: 'Golden Touch',
    description: 'Everything you touch turns to gold, multiplying your earnings.',
    icon: '✨',
    baseCost: 500,
    costMultiplier: 2.0,
    effect: '+2 Click Power',
    category: 'click',
    maxLevel: 25,
    bonus: {
      type: 'clickPower',
      value: 2
    }
  },

  DIAMOND_HANDS: {
    id: 'DIAMOND_HANDS',
    name: 'Diamond Hands',
    description: 'Your hands are now made of diamonds, increasing click power significantly.',
    icon: '💎',
    baseCost: 2500,
    costMultiplier: 2.5,
    effect: '+5 Click Power',
    category: 'click',
    maxLevel: 20,
    bonus: {
      type: 'clickPower',
      value: 5
    }
  },

  // Passive Income Upgrades
  BUSINESS_MANAGER: {
    id: 'BUSINESS_MANAGER',
    name: 'Business Manager',
    description: 'Hire a manager to increase all business income by 10%.',
    icon: '👔',
    baseCost: 1000,
    costMultiplier: 3.0,
    effect: '+10% Business Income',
    category: 'passive',
    maxLevel: 10,
    bonus: {
      type: 'passiveMultiplier',
      value: 0.1
    }
  },

  EFFICIENCY_EXPERT: {
    id: 'EFFICIENCY_EXPERT',
    name: 'Efficiency Expert',
    description: 'Optimize your operations to boost passive income generation.',
    icon: '⚡',
    baseCost: 5000,
    costMultiplier: 4.0,
    effect: '+25% Business Income',
    category: 'passive',
    maxLevel: 5,
    bonus: {
      type: 'passiveMultiplier',
      value: 0.25
    }
  },

  // XP and Level Upgrades
  MENTOR: {
    id: 'MENTOR',
    name: 'Business Mentor',
    description: 'Learn from the best to gain experience faster.',
    icon: '🎓',
    baseCost: 750,
    costMultiplier: 2.2,
    effect: '+1 XP per tap',
    category: 'xp',
    maxLevel: 15,
    bonus: {
      type: 'xpMultiplier',
      value: 1
    }
  },

  WISDOM_SCROLL: {
    id: 'WISDOM_SCROLL',
    name: 'Wisdom Scroll',
    description: 'Ancient knowledge that accelerates your learning.',
    icon: '📜',
    baseCost: 3000,
    costMultiplier: 3.5,
    effect: '+50% XP gain',
    category: 'xp',
    maxLevel: 8,
    bonus: {
      type: 'xpMultiplier',
      value: 0.5
    }
  },

  // Special Upgrades
  LUCKY_CHARM: {
    id: 'LUCKY_CHARM',
    name: 'Lucky Charm',
    description: 'Increases your chance of getting bonus rewards.',
    icon: '🍀',
    baseCost: 2000,
    costMultiplier: 5.0,
    effect: '+5% Bonus Chance',
    category: 'special',
    maxLevel: 10,
    bonus: {
      type: 'bonusChance',
      value: 0.05
    }
  },

  TIME_MACHINE: {
    id: 'TIME_MACHINE',
    name: 'Time Machine',
    description: 'Collect offline earnings for longer periods.',
    icon: '⏰',
    baseCost: 10000,
    costMultiplier: 10.0,
    effect: '+4 hours offline time',
    category: 'special',
    maxLevel: 6,
    bonus: {
      type: 'offlineTime',
      value: 4 // hours
    }
  },

  ENERGY_DRINK: {
    id: 'ENERGY_DRINK',
    name: 'Energy Drink',
    description: 'Reduces the cooldown between actions.',
    icon: '⚡',
    baseCost: 1500,
    costMultiplier: 3.0,
    effect: '-10% Action Cooldown',
    category: 'special',
    maxLevel: 10,
    bonus: {
      type: 'cooldownReduction',
      value: 0.1
    }
  }
};

// Helper function to get upgrades by category
export const getUpgradesByCategory = (category) => {
  return Object.values(UPGRADES_CONFIG).filter(upgrade => upgrade.category === category);
};

// Helper function to calculate upgrade cost
export const calculateUpgradeCost = (upgrade, currentLevel) => {
  const baseCost = upgrade.baseCost;
  const multiplier = upgrade.costMultiplier;
  // Add level-based scaling to make it progressively harder
  const levelScaling = 1 + (currentLevel * 0.15); // 15% increase per level
  // Add exponential scaling for higher levels
  const exponentialScaling = currentLevel >= 10 ? Math.pow(1.1, currentLevel - 10) : 1;

  return Math.floor(baseCost * Math.pow(multiplier, currentLevel) * levelScaling * exponentialScaling);
};

// Helper function to get total bonus from upgrades
export const calculateUpgradeBonus = (upgrades, bonusType) => {
  let totalBonus = 0;

  Object.entries(upgrades).forEach(([upgradeId, level]) => {
    const upgrade = UPGRADES_CONFIG[upgradeId];
    if (upgrade && upgrade.bonus.type === bonusType) {
      totalBonus += upgrade.bonus.value * level;
    }
  });

  return totalBonus;
};

// Categories for organizing upgrades
export const UPGRADE_CATEGORIES = {
  CLICK: {
    id: 'click',
    name: 'Click Power',
    icon: '👆',
    description: 'Increase your clicking power'
  },
  PASSIVE: {
    id: 'passive',
    name: 'Passive Income',
    icon: '💰',
    description: 'Boost your business earnings'
  },
  XP: {
    id: 'xp',
    name: 'Experience',
    icon: '⭐',
    description: 'Level up faster'
  },
  SPECIAL: {
    id: 'special',
    name: 'Special',
    icon: '🎁',
    description: 'Unique bonuses and effects'
  }
}; 