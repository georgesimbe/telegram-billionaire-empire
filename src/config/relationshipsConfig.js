export const RELATIONSHIP_TYPES = {
  FAMILY: {
    id: 'family',
    name: 'Family',
    icon: '👨‍👩‍👧‍👦',
    description: 'Blood relatives and adopted family members',
    maxRelationships: 10,
    defaultRelationshipLevel: 50,
    canMarry: false,
    canHaveChildren: false,
    effects: {
      happiness: 5,
      support: 10,
      financialHelp: true
    }
  },
  FRIENDS: {
    id: 'friends',
    name: 'Friends',
    icon: '👥',
    description: 'Close personal friendships',
    maxRelationships: 20,
    defaultRelationshipLevel: 30,
    canMarry: false,
    canHaveChildren: false,
    effects: {
      happiness: 3,
      support: 5,
      networkingBonus: 5
    }
  },
  ROMANTIC: {
    id: 'romantic',
    name: 'Romantic',
    icon: '💕',
    description: 'Dating and romantic relationships',
    maxRelationships: 1,
    defaultRelationshipLevel: 20,
    canMarry: true,
    canHaveChildren: true,
    effects: {
      happiness: 10,
      support: 8,
      motivation: 5
    }
  },
  SPOUSE: {
    id: 'spouse',
    name: 'Spouse',
    icon: '💍',
    description: 'Married partner',
    maxRelationships: 1,
    defaultRelationshipLevel: 80,
    canMarry: false,
    canHaveChildren: true,
    effects: {
      happiness: 15,
      support: 15,
      financialSharing: true,
      taxBenefits: true
    }
  },
  CHILDREN: {
    id: 'children',
    name: 'Children',
    icon: '👶',
    description: 'Your children',
    maxRelationships: 10,
    defaultRelationshipLevel: 90,
    canMarry: false,
    canHaveChildren: false,
    effects: {
      happiness: 20,
      responsibility: 10,
      expenses: 500
    }
  },
  COLLEAGUES: {
    id: 'colleagues',
    name: 'Colleagues',
    icon: '👔',
    description: 'Work relationships and professional contacts',
    maxRelationships: 50,
    defaultRelationshipLevel: 25,
    canMarry: false,
    canHaveChildren: false,
    effects: {
      careerBonus: 5,
      networkingBonus: 3,
      jobOpportunities: true
    }
  },
  MENTORS: {
    id: 'mentors',
    name: 'Mentors',
    icon: '🎓',
    description: 'Professional and personal mentors',
    maxRelationships: 5,
    defaultRelationshipLevel: 40,
    canMarry: false,
    canHaveChildren: false,
    effects: {
      skillGrowth: 10,
      careerAdvancement: 8,
      wisdom: 5
    }
  }
};

export const RELATIONSHIP_LEVELS = {
  ENEMY: { min: 0, max: 10, name: 'Enemy', color: '#dc2626', effects: { stress: 10, happiness: -5 } },
  HOSTILE: { min: 11, max: 20, name: 'Hostile', color: '#ea580c', effects: { stress: 5, happiness: -2 } },
  STRANGER: { min: 21, max: 30, name: 'Stranger', color: '#6b7280', effects: {} },
  ACQUAINTANCE: { min: 31, max: 50, name: 'Acquaintance', color: '#0891b2', effects: { networkingBonus: 1 } },
  FRIEND: { min: 51, max: 70, name: 'Friend', color: '#059669', effects: { happiness: 3, support: 2 } },
  CLOSE_FRIEND: { min: 71, max: 85, name: 'Close Friend', color: '#7c3aed', effects: { happiness: 5, support: 5 } },
  BEST_FRIEND: { min: 86, max: 95, name: 'Best Friend', color: '#c026d3', effects: { happiness: 8, support: 8 } },
  SOULMATE: { min: 96, max: 100, name: 'Soulmate', color: '#e11d48', effects: { happiness: 15, support: 15 } }
};

export const SOCIAL_ACTIVITIES = {
  HANG_OUT: {
    id: 'hang_out',
    name: 'Hang Out',
    icon: '🎉',
    description: 'Spend casual time together',
    cost: 50,
    duration: 3, // hours
    relationshipGain: 2,
    happinessGain: 3,
    energyCost: 10,
    applicableTypes: ['friends', 'romantic', 'colleagues']
  },
  DINNER_DATE: {
    id: 'dinner_date',
    name: 'Dinner Date',
    icon: '🍽️',
    description: 'Romantic dinner at a nice restaurant',
    cost: 150,
    duration: 4,
    relationshipGain: 5,
    happinessGain: 8,
    energyCost: 15,
    applicableTypes: ['romantic', 'spouse']
  },
  FAMILY_GATHERING: {
    id: 'family_gathering',
    name: 'Family Gathering',
    icon: '🏠',
    description: 'Spend time with family members',
    cost: 100,
    duration: 6,
    relationshipGain: 3,
    happinessGain: 10,
    energyCost: 20,
    applicableTypes: ['family', 'spouse', 'children']
  },
  NETWORKING_EVENT: {
    id: 'networking_event',
    name: 'Networking Event',
    icon: '🤝',
    description: 'Professional networking opportunity',
    cost: 75,
    duration: 4,
    relationshipGain: 2,
    careerBonus: 5,
    energyCost: 25,
    applicableTypes: ['colleagues', 'mentors']
  },
  VACATION: {
    id: 'vacation',
    name: 'Vacation Together',
    icon: '✈️',
    description: 'Take a vacation with loved ones',
    cost: 2000,
    duration: 72, // 3 days
    relationshipGain: 15,
    happinessGain: 25,
    energyCost: -20, // Restores energy
    applicableTypes: ['romantic', 'spouse', 'family', 'friends']
  },
  WORKOUT_TOGETHER: {
    id: 'workout_together',
    name: 'Workout Together',
    icon: '💪',
    description: 'Exercise and stay healthy together',
    cost: 25,
    duration: 2,
    relationshipGain: 2,
    healthGain: 5,
    energyCost: 15,
    applicableTypes: ['friends', 'romantic', 'spouse']
  },
  STUDY_SESSION: {
    id: 'study_session',
    name: 'Study Session',
    icon: '📚',
    description: 'Learn and grow together',
    cost: 20,
    duration: 3,
    relationshipGain: 2,
    skillGain: 3,
    energyCost: 20,
    applicableTypes: ['mentors', 'colleagues', 'friends']
  }
};

export const RELATIONSHIP_EVENTS = {
  BIRTHDAY: {
    id: 'birthday',
    name: 'Birthday',
    icon: '🎂',
    description: 'Celebrate someone\'s birthday',
    frequency: 365, // days
    relationshipGain: 5,
    happinessGain: 8,
    giftCost: 100
  },
  ANNIVERSARY: {
    id: 'anniversary',
    name: 'Anniversary',
    icon: '💝',
    description: 'Celebrate relationship milestone',
    frequency: 365,
    relationshipGain: 10,
    happinessGain: 15,
    giftCost: 200,
    applicableTypes: ['romantic', 'spouse']
  },
  GRADUATION: {
    id: 'graduation',
    name: 'Graduation',
    icon: '🎓',
    description: 'Celebrate educational achievement',
    frequency: 0, // Event-based
    relationshipGain: 8,
    happinessGain: 12,
    giftCost: 150
  },
  PROMOTION: {
    id: 'promotion',
    name: 'Job Promotion',
    icon: '📈',
    description: 'Celebrate career advancement',
    frequency: 0,
    relationshipGain: 5,
    happinessGain: 10,
    celebrationCost: 200
  },
  WEDDING: {
    id: 'wedding',
    name: 'Wedding',
    icon: '💒',
    description: 'Marriage ceremony',
    frequency: 0,
    relationshipGain: 50,
    happinessGain: 30,
    cost: 15000,
    applicableTypes: ['romantic']
  },
  BABY_BIRTH: {
    id: 'baby_birth',
    name: 'Baby Birth',
    icon: '👶',
    description: 'Welcome a new child',
    frequency: 0,
    relationshipGain: 30,
    happinessGain: 25,
    cost: 5000,
    applicableTypes: ['spouse']
  }
};

export const CONFLICT_TYPES = {
  MINOR_DISAGREEMENT: {
    id: 'minor_disagreement',
    name: 'Minor Disagreement',
    icon: '😐',
    description: 'Small argument or misunderstanding',
    relationshipLoss: 2,
    stressGain: 5,
    resolutionCost: 25,
    resolutionTime: 1 // days
  },
  MAJOR_ARGUMENT: {
    id: 'major_argument',
    name: 'Major Argument',
    icon: '😠',
    description: 'Serious disagreement or fight',
    relationshipLoss: 8,
    stressGain: 15,
    resolutionCost: 100,
    resolutionTime: 7
  },
  BETRAYAL: {
    id: 'betrayal',
    name: 'Betrayal',
    icon: '💔',
    description: 'Serious breach of trust',
    relationshipLoss: 25,
    stressGain: 30,
    resolutionCost: 500,
    resolutionTime: 30
  },
  NEGLECT: {
    id: 'neglect',
    name: 'Neglect',
    icon: '😔',
    description: 'Not spending enough time together',
    relationshipLoss: 1,
    stressGain: 2,
    resolutionCost: 50,
    resolutionTime: 3
  }
};

export const PERSONALITY_TRAITS = {
  EXTROVERTED: {
    id: 'extroverted',
    name: 'Extroverted',
    description: 'Gains energy from social interactions',
    socialBonus: 5,
    energyFromSocial: 5,
    maxRelationships: 1.5
  },
  INTROVERTED: {
    id: 'introverted',
    name: 'Introverted',
    description: 'Prefers smaller social circles',
    socialBonus: -2,
    energyFromSocial: -3,
    maxRelationships: 0.7,
    deepRelationshipBonus: 3
  },
  CHARISMATIC: {
    id: 'charismatic',
    name: 'Charismatic',
    description: 'Naturally attracts people',
    relationshipGainBonus: 2,
    networkingBonus: 10,
    careerBonus: 5
  },
  LOYAL: {
    id: 'loyal',
    name: 'Loyal',
    description: 'Forms deep, lasting relationships',
    relationshipDecayResistance: 0.5,
    familyBonus: 5,
    trustBonus: 10
  },
  AMBITIOUS: {
    id: 'ambitious',
    name: 'Ambitious',
    description: 'Focused on career and success',
    careerBonus: 10,
    relationshipTimeReduction: 0.8,
    workLifeBalance: -5
  }
};

// Helper functions
export const getRelationshipLevel = (points) => {
  return Object.values(RELATIONSHIP_LEVELS).find(level =>
    points >= level.min && points <= level.max
  );
};

export const calculateRelationshipEffects = (relationships) => {
  let totalEffects = {
    happiness: 0,
    support: 0,
    stress: 0,
    careerBonus: 0,
    networkingBonus: 0,
    monthlyExpenses: 0
  };

  if (!Array.isArray(relationships)) {
    return totalEffects;
  }

  relationships.forEach(relationship => {
    const level = getRelationshipLevel(relationship.points);
    const type = RELATIONSHIP_TYPES[relationship.type?.toUpperCase()];

    if (level && type) {
      // Add level effects
      Object.keys(level.effects).forEach(effect => {
        if (totalEffects.hasOwnProperty(effect)) {
          totalEffects[effect] += level.effects[effect];
        }
      });

      // Add type effects
      Object.keys(type.effects).forEach(effect => {
        if (totalEffects.hasOwnProperty(effect)) {
          totalEffects[effect] += type.effects[effect];
        }
      });

      // Special handling for expenses (children, etc.)
      if (type.effects.expenses) {
        totalEffects.monthlyExpenses += type.effects.expenses;
      }
    }
  });

  return totalEffects;
};

export const getAvailableActivities = (relationshipType) => {
  return Object.values(SOCIAL_ACTIVITIES).filter(activity =>
    activity.applicableTypes.includes(relationshipType)
  );
};

export const calculateActivityCost = (activity, relationshipLevel) => {
  const levelMultiplier = Math.max(0.5, relationshipLevel / 100);
  return Math.round(activity.cost * levelMultiplier);
};

export const simulateRelationshipDecay = (relationships, daysElapsed) => {
  return relationships.map(relationship => {
    const type = RELATIONSHIP_TYPES[relationship.type.toUpperCase()];
    let decayRate = 0.1; // Base decay per day

    // Family relationships decay slower
    if (relationship.type === 'family') decayRate = 0.05;

    // Spouse relationships decay slower
    if (relationship.type === 'spouse') decayRate = 0.03;

    // Children relationships don't decay much
    if (relationship.type === 'children') decayRate = 0.01;

    const decay = decayRate * daysElapsed;
    const newPoints = Math.max(0, relationship.points - decay);

    return {
      ...relationship,
      points: newPoints
    };
  });
};

export const generateRandomEvent = (relationships) => {
  const events = Object.values(RELATIONSHIP_EVENTS);
  const conflicts = Object.values(CONFLICT_TYPES);

  // 70% chance of positive event, 30% chance of conflict
  const isPositive = Math.random() > 0.3;

  if (isPositive) {
    const event = events[Math.floor(Math.random() * events.length)];
    const applicableRelationships = relationships.filter(rel =>
      !event.applicableTypes || event.applicableTypes.includes(rel.type)
    );

    if (applicableRelationships.length > 0) {
      const targetRelationship = applicableRelationships[Math.floor(Math.random() * applicableRelationships.length)];
      return {
        type: 'positive',
        event,
        targetRelationship,
        cost: event.cost || event.giftCost || event.celebrationCost || 0
      };
    }
  } else {
    const conflict = conflicts[Math.floor(Math.random() * conflicts.length)];
    const targetRelationship = relationships[Math.floor(Math.random() * relationships.length)];

    return {
      type: 'conflict',
      event: conflict,
      targetRelationship,
      cost: conflict.resolutionCost
    };
  }

  return null;
}; 