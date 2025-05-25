export const ENHANCED_STAFF_TYPES = {
  BASIC_WORKER: {
    id: 'basic_worker',
    name: 'Basic Worker',
    icon: '👷',
    baseCost: 1000,
    baseProductivity: 1.0,
    baseMorale: 0.8,
    skills: ['basic_operations'],
    maxLevel: 10,
    experienceGain: 1,
    trainingCost: 500,
    description: 'Entry-level worker with basic skills'
  },
  SKILLED_WORKER: {
    id: 'skilled_worker',
    name: 'Skilled Worker',
    icon: '🔧',
    baseCost: 2500,
    baseProductivity: 1.5,
    baseMorale: 0.9,
    skills: ['advanced_operations', 'quality_control'],
    maxLevel: 15,
    experienceGain: 2,
    trainingCost: 1200,
    description: 'Experienced worker with specialized skills'
  },
  SPECIALIST: {
    id: 'specialist',
    name: 'Specialist',
    icon: '🎓',
    baseCost: 5000,
    baseProductivity: 2.0,
    baseMorale: 0.95,
    skills: ['expertise', 'training', 'innovation'],
    maxLevel: 20,
    experienceGain: 3,
    trainingCost: 2500,
    description: 'Expert with deep knowledge in specific areas'
  },
  MANAGER: {
    id: 'manager',
    name: 'Manager',
    icon: '👔',
    baseCost: 10000,
    baseProductivity: 1.2,
    baseMorale: 1.0,
    skills: ['leadership', 'optimization', 'automation'],
    maxLevel: 25,
    experienceGain: 4,
    trainingCost: 5000,
    managesOthers: true,
    managementBonus: 0.15,
    description: 'Leader who improves team performance'
  },
  RISK_ANALYST: {
    id: 'risk_analyst',
    name: 'Risk Analyst',
    icon: '📊',
    baseCost: 7500,
    baseProductivity: 1.1,
    baseMorale: 0.9,
    skills: ['risk_assessment', 'data_analysis', 'forecasting'],
    maxLevel: 20,
    experienceGain: 3,
    trainingCost: 3000,
    riskReduction: 10,
    description: 'Specialist in identifying and mitigating business risks'
  }
};

export const EXECUTIVE_TYPES = {
  CGO: {
    id: 'cgo',
    name: 'Chief Growth Officer',
    icon: '📈',
    baseCost: 50000,
    monthlySalary: 15000,
    industryBonuses: {
      'food_service': 0.05,
      'retail': 0.05,
      'real_estate': 0.08
    },
    skills: ['growth_strategy', 'market_expansion', 'revenue_optimization'],
    maxLevel: 10,
    description: 'Drives business growth and expansion strategies'
  },
  CCO: {
    id: 'cco',
    name: 'Chief Community Officer',
    icon: '👥',
    baseCost: 45000,
    monthlySalary: 12000,
    socialBonuses: {
      'telegram_rewards': 0.15,
      'community_engagement': 0.20,
      'brand_loyalty': 0.10
    },
    skills: ['community_building', 'social_media', 'brand_management'],
    maxLevel: 10,
    description: 'Manages community relations and social engagement'
  },
  CIO: {
    id: 'cio',
    name: 'Chief Innovation Officer',
    icon: '💡',
    baseCost: 60000,
    monthlySalary: 18000,
    industryBonuses: {
      'technology': 0.12,
      'manufacturing': 0.08,
      'aerospace': 0.10
    },
    skills: ['innovation_management', 'technology_strategy', 'r_and_d'],
    maxLevel: 10,
    description: 'Leads innovation and technological advancement'
  },
  CRO: {
    id: 'cro',
    name: 'Chief Risk Officer',
    icon: '🛡️',
    baseCost: 55000,
    monthlySalary: 16000,
    riskReduction: 25,
    insuranceBonuses: {
      'business_insurance': 0.20,
      'liability_protection': 0.15,
      'crisis_management': 0.25
    },
    skills: ['risk_management', 'compliance', 'crisis_response'],
    maxLevel: 10,
    description: 'Manages enterprise risk and compliance'
  },
  CFO: {
    id: 'cfo',
    name: 'Chief Financial Officer',
    icon: '💰',
    baseCost: 65000,
    monthlySalary: 20000,
    financialBonuses: {
      'cost_optimization': 0.10,
      'investment_returns': 0.15,
      'tax_efficiency': 0.12
    },
    skills: ['financial_strategy', 'investment_management', 'cost_control'],
    maxLevel: 10,
    description: 'Oversees financial strategy and operations'
  }
};

export const STAFF_SKILLS = {
  // Basic Skills
  BASIC_OPERATIONS: {
    id: 'basic_operations',
    name: 'Basic Operations',
    category: 'operational',
    productivityBonus: 0.05,
    trainingTime: 24, // hours
    trainingCost: 200
  },
  QUALITY_CONTROL: {
    id: 'quality_control',
    name: 'Quality Control',
    category: 'operational',
    productivityBonus: 0.08,
    qualityBonus: 0.10,
    trainingTime: 48,
    trainingCost: 500
  },
  ADVANCED_OPERATIONS: {
    id: 'advanced_operations',
    name: 'Advanced Operations',
    category: 'operational',
    productivityBonus: 0.12,
    trainingTime: 72,
    trainingCost: 800
  },

  // Management Skills
  LEADERSHIP: {
    id: 'leadership',
    name: 'Leadership',
    category: 'management',
    teamBonus: 0.15,
    moraleBonus: 0.10,
    trainingTime: 96,
    trainingCost: 1500
  },
  OPTIMIZATION: {
    id: 'optimization',
    name: 'Process Optimization',
    category: 'management',
    efficiencyBonus: 0.20,
    costReduction: 0.08,
    trainingTime: 120,
    trainingCost: 2000
  },
  AUTOMATION: {
    id: 'automation',
    name: 'Automation Management',
    category: 'management',
    productivityBonus: 0.25,
    laborCostReduction: 0.15,
    trainingTime: 144,
    trainingCost: 3000
  },

  // Specialized Skills
  INNOVATION: {
    id: 'innovation',
    name: 'Innovation',
    category: 'specialized',
    researchBonus: 0.30,
    newProductChance: 0.05,
    trainingTime: 168,
    trainingCost: 4000
  },
  RISK_ASSESSMENT: {
    id: 'risk_assessment',
    name: 'Risk Assessment',
    category: 'specialized',
    riskReduction: 15,
    insuranceSavings: 0.12,
    trainingTime: 120,
    trainingCost: 2500
  },
  DATA_ANALYSIS: {
    id: 'data_analysis',
    name: 'Data Analysis',
    category: 'specialized',
    decisionAccuracy: 0.20,
    marketInsights: 0.15,
    trainingTime: 96,
    trainingCost: 1800
  }
};

export const MORALE_FACTORS = {
  SALARY: {
    id: 'salary',
    name: 'Competitive Salary',
    impact: (staffSalary, marketRate) => {
      const ratio = staffSalary / marketRate;
      if (ratio >= 1.2) return 15; // 20% above market
      if (ratio >= 1.1) return 10; // 10% above market
      if (ratio >= 0.9) return 0;  // Market rate
      if (ratio >= 0.8) return -10; // 20% below market
      return -20; // More than 20% below market
    }
  },
  WORK_ENVIRONMENT: {
    id: 'work_environment',
    name: 'Work Environment',
    upgrades: {
      'basic_facilities': 0,
      'comfortable_workspace': 5,
      'modern_equipment': 10,
      'luxury_amenities': 15
    }
  },
  TRAINING_OPPORTUNITIES: {
    id: 'training_opportunities',
    name: 'Training & Development',
    impact: (trainingsCompleted) => Math.min(20, trainingsCompleted * 2)
  },
  WORKLOAD: {
    id: 'workload',
    name: 'Workload Balance',
    impact: (hoursPerWeek) => {
      if (hoursPerWeek <= 40) return 10;
      if (hoursPerWeek <= 50) return 0;
      if (hoursPerWeek <= 60) return -10;
      return -20;
    }
  },
  JOB_SECURITY: {
    id: 'job_security',
    name: 'Job Security',
    impact: (businessStability) => {
      if (businessStability >= 0.9) return 15;
      if (businessStability >= 0.7) return 5;
      if (businessStability >= 0.5) return 0;
      return -15;
    }
  }
};

export const EXECUTIVE_PROJECTS = {
  // CGO Projects
  GREEN_FARMING_INITIATIVE: {
    id: 'green_farming_initiative',
    name: 'Green Farming Initiative',
    executive: 'cgo',
    cost: 10000,
    duration: 48, // hours
    requirements: {
      industries: ['food_service'],
      minBusinesses: 3
    },
    effects: {
      industryBonus: { 'food_service': 0.10 },
      brandValue: 0.05,
      sustainability: 0.15
    },
    description: 'Implement sustainable farming practices across food businesses'
  },
  MARKET_EXPANSION: {
    id: 'market_expansion',
    name: 'Market Expansion Strategy',
    executive: 'cgo',
    cost: 25000,
    duration: 72,
    requirements: {
      revenue: 100000,
      marketShare: 0.1
    },
    effects: {
      globalReach: 0.20,
      customerBase: 0.25,
      revenueBonus: 0.15
    },
    description: 'Expand into new markets and customer segments'
  },

  // CCO Projects
  COMMUNITY_ENGAGEMENT: {
    id: 'community_engagement',
    name: 'Community Engagement Program',
    executive: 'cco',
    cost: 8000,
    duration: 36,
    requirements: {
      socialFollowers: 1000
    },
    effects: {
      brandLoyalty: 0.20,
      telegramRewards: 0.15,
      customerRetention: 0.12
    },
    description: 'Build stronger community connections and engagement'
  },
  INFLUENCER_PARTNERSHIPS: {
    id: 'influencer_partnerships',
    name: 'Influencer Partnership Campaign',
    executive: 'cco',
    cost: 15000,
    duration: 24,
    requirements: {
      brandValue: 0.3
    },
    effects: {
      marketingEfficiency: 0.30,
      brandAwareness: 0.25,
      customerAcquisition: 0.20
    },
    description: 'Partner with influencers to boost brand visibility'
  },

  // CIO Projects
  AI_INTEGRATION: {
    id: 'ai_integration',
    name: 'AI Integration Initiative',
    executive: 'cio',
    cost: 50000,
    duration: 120,
    requirements: {
      industries: ['technology'],
      techLevel: 5
    },
    effects: {
      automationLevel: 0.40,
      productivityBonus: 0.25,
      costReduction: 0.15
    },
    description: 'Integrate AI systems across business operations'
  },
  DIGITAL_TRANSFORMATION: {
    id: 'digital_transformation',
    name: 'Digital Transformation',
    executive: 'cio',
    cost: 35000,
    duration: 96,
    requirements: {
      businesses: 5
    },
    effects: {
      digitalEfficiency: 0.30,
      dataInsights: 0.20,
      customerExperience: 0.18
    },
    description: 'Modernize business processes with digital solutions'
  },

  // CRO Projects
  RISK_ASSESSMENT_OVERHAUL: {
    id: 'risk_assessment_overhaul',
    name: 'Enterprise Risk Assessment',
    executive: 'cro',
    cost: 20000,
    duration: 60,
    requirements: {
      businesses: 3,
      riskScore: 50
    },
    effects: {
      riskReduction: 30,
      insuranceSavings: 0.25,
      complianceScore: 0.20
    },
    description: 'Comprehensive risk assessment and mitigation strategy'
  },
  CRISIS_MANAGEMENT: {
    id: 'crisis_management',
    name: 'Crisis Management Protocol',
    executive: 'cro',
    cost: 15000,
    duration: 48,
    requirements: {
      previousCrises: 1
    },
    effects: {
      crisisResistance: 0.40,
      recoverySpeed: 0.30,
      stakeholderConfidence: 0.15
    },
    description: 'Develop robust crisis management and response protocols'
  }
};

export const STAFF_TRAINING_PROGRAMS = {
  PRODUCTIVITY_BOOTCAMP: {
    id: 'productivity_bootcamp',
    name: 'Productivity Bootcamp',
    duration: 72, // hours
    cost: 2000,
    requirements: {
      staffLevel: 3
    },
    effects: {
      productivityBonus: 0.15,
      moraleBonus: 0.10
    },
    description: 'Intensive training to boost worker productivity'
  },
  LEADERSHIP_DEVELOPMENT: {
    id: 'leadership_development',
    name: 'Leadership Development Program',
    duration: 120,
    cost: 5000,
    requirements: {
      staffType: 'manager',
      experience: 100
    },
    effects: {
      teamBonus: 0.20,
      moraleBonus: 0.15,
      retentionBonus: 0.25
    },
    description: 'Advanced leadership training for managers'
  },
  TECHNICAL_CERTIFICATION: {
    id: 'technical_certification',
    name: 'Technical Certification',
    duration: 96,
    cost: 3500,
    requirements: {
      industry: 'technology'
    },
    effects: {
      skillBonus: 0.25,
      innovationBonus: 0.15,
      qualityBonus: 0.20
    },
    description: 'Industry-specific technical certification program'
  }
};

// Helper functions
export const calculateStaffProductivity = (staff) => {
  let productivity = staff.baseProductivity;

  // Level bonus
  productivity += staff.level * 0.02;

  // Skill bonuses
  staff.skills.forEach(skillId => {
    const skill = STAFF_SKILLS[skillId.toUpperCase()];
    if (skill) {
      productivity += skill.productivityBonus || 0;
    }
  });

  // Morale impact
  const moraleMultiplier = 0.5 + (staff.morale / 100);
  productivity *= moraleMultiplier;

  return productivity;
};

export const calculateStaffMorale = (staff, business, conditions = {}) => {
  let morale = staff.baseMorale * 100;

  // Salary factor
  const salaryImpact = MORALE_FACTORS.SALARY.impact(
    staff.salary,
    ENHANCED_STAFF_TYPES[staff.type.toUpperCase()].baseCost
  );
  morale += salaryImpact;

  // Work environment
  const environmentLevel = conditions.workEnvironment || 'basic_facilities';
  morale += MORALE_FACTORS.WORK_ENVIRONMENT.upgrades[environmentLevel];

  // Training opportunities
  const trainingImpact = MORALE_FACTORS.TRAINING_OPPORTUNITIES.impact(
    staff.trainingsCompleted || 0
  );
  morale += trainingImpact;

  // Workload
  const workloadImpact = MORALE_FACTORS.WORKLOAD.impact(
    conditions.hoursPerWeek || 40
  );
  morale += workloadImpact;

  // Job security
  const securityImpact = MORALE_FACTORS.JOB_SECURITY.impact(
    business.stability || 0.8
  );
  morale += securityImpact;

  return Math.max(0, Math.min(100, morale));
};

export const calculateExecutiveBonus = (executive, businesses) => {
  const execType = EXECUTIVE_TYPES[executive.type.toUpperCase()];
  if (!execType) return 0;

  let totalBonus = 0;

  businesses.forEach(business => {
    if (execType.industryBonuses && execType.industryBonuses[business.category]) {
      const bonus = execType.industryBonuses[business.category];
      const levelMultiplier = 1 + (executive.level * 0.1);
      totalBonus += business.income * bonus * levelMultiplier;
    }
  });

  return totalBonus;
};

export const getAvailableProjects = (executive, playerStats) => {
  return Object.values(EXECUTIVE_PROJECTS).filter(project => {
    if (project.executive !== executive.type) return false;

    // Check requirements
    if (project.requirements.industries) {
      const hasRequiredIndustries = project.requirements.industries.some(industry =>
        playerStats.businesses.some(business => business.category === industry)
      );
      if (!hasRequiredIndustries) return false;
    }

    if (project.requirements.minBusinesses) {
      if (playerStats.businesses.length < project.requirements.minBusinesses) return false;
    }

    if (project.requirements.revenue) {
      if (playerStats.totalRevenue < project.requirements.revenue) return false;
    }

    return true;
  });
};

export const simulateStaffDevelopment = (staff, hoursElapsed) => {
  const updatedStaff = { ...staff };

  // Gain experience
  const experienceGain = Math.floor(hoursElapsed / 24) * (staff.experienceGain || 1);
  updatedStaff.experience = (updatedStaff.experience || 0) + experienceGain;

  // Level up if enough experience
  const staffType = ENHANCED_STAFF_TYPES[staff.type.toUpperCase()];
  if (staffType) {
    const requiredExp = updatedStaff.level * 100;
    if (updatedStaff.experience >= requiredExp && updatedStaff.level < staffType.maxLevel) {
      updatedStaff.level++;
      updatedStaff.experience -= requiredExp;
    }
  }

  return updatedStaff;
};

export const calculateTeamSynergy = (staffMembers) => {
  let synergy = 1.0;

  // Manager bonus
  const managers = staffMembers.filter(staff => staff.type === 'manager');
  const workers = staffMembers.filter(staff => staff.type !== 'manager');

  managers.forEach(manager => {
    const managedWorkers = Math.min(workers.length, 10); // Max 10 workers per manager
    synergy += managedWorkers * 0.02; // 2% bonus per managed worker
  });

  // Skill diversity bonus
  const uniqueSkills = new Set();
  staffMembers.forEach(staff => {
    staff.skills.forEach(skill => uniqueSkills.add(skill));
  });
  synergy += uniqueSkills.size * 0.01; // 1% bonus per unique skill

  // Team size efficiency
  if (staffMembers.length >= 5) synergy += 0.05; // 5% bonus for teams of 5+
  if (staffMembers.length >= 10) synergy += 0.05; // Additional 5% for teams of 10+

  return Math.min(2.0, synergy); // Cap at 200% efficiency
}; 