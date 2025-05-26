/**
 * Relationships Store Module
 * Manages social connections, interactions, and relationship effects
 */
export const createRelationshipsStore = (set, get) => ({
  // Relationships State
  relationships: {
    connections: [],
    socialCircles: [],
    networkingEvents: [],
    socialStats: {
      totalConnections: 0,
      networkingLevel: 1,
      socialInfluence: 0,
      reputationScore: 50
    },
    recentInteractions: [],
    socialGoals: []
  },

  // Relationships Actions
  updateRelationships: (updates) => set((state) => ({
    relationships: { ...state.relationships, ...updates }
  })),

  /**
   * Add a new relationship/connection
   */
  addRelationship: (person) => set((state) => {
    // Check if relationship already exists
    const existingConnection = state.relationships.connections.find(
      conn => conn.id === person.id || conn.name === person.name
    );

    if (existingConnection) return state;

    const newConnection = {
      id: person.id || Date.now(),
      name: person.name,
      type: person.type || 'acquaintance', // acquaintance, friend, business, mentor, family
      industry: person.industry || 'general',
      relationshipLevel: 1,
      trustLevel: 50,
      influence: person.influence || 10,
      lastInteraction: new Date(),
      metAt: person.metAt || 'unknown',
      connectionDate: new Date(),
      interactions: [],
      benefits: person.benefits || [],
      status: 'active'
    };

    const updatedStats = {
      ...state.relationships.socialStats,
      totalConnections: state.relationships.socialStats.totalConnections + 1,
      socialInfluence: state.relationships.socialStats.socialInfluence + newConnection.influence
    };

    return {
      relationships: {
        ...state.relationships,
        connections: [...state.relationships.connections, newConnection],
        socialStats: updatedStats
      },
      player: {
        ...state.player,
        lifetimeStats: {
          ...state.player.lifetimeStats,
          totalRelationshipsFormed: state.player.lifetimeStats.totalRelationshipsFormed + 1
        }
      }
    };
  }),

  /**
   * Update an existing relationship
   */
  updateRelationship: (connectionId, updates) => set((state) => {
    const updatedConnections = state.relationships.connections.map(conn => {
      if (conn.id === connectionId) {
        return { ...conn, ...updates, lastInteraction: new Date() };
      }
      return conn;
    });

    return {
      relationships: {
        ...state.relationships,
        connections: updatedConnections
      }
    };
  }),

  /**
   * Interact with a connection (strengthen relationship)
   */
  interactWithConnection: (connectionId, interactionType) => set((state) => {
    const connection = state.relationships.connections.find(conn => conn.id === connectionId);
    if (!connection) return state;

    const interactionEffects = {
      'casual_chat': { relationshipLevel: 1, trustLevel: 2, cost: 0, time: 30 },
      'business_meeting': { relationshipLevel: 2, trustLevel: 3, cost: 50, time: 60 },
      'social_event': { relationshipLevel: 3, trustLevel: 4, cost: 100, time: 120 },
      'favor_request': { relationshipLevel: -1, trustLevel: -2, cost: 0, time: 15 },
      'gift_giving': { relationshipLevel: 4, trustLevel: 5, cost: 200, time: 30 },
      'collaboration': { relationshipLevel: 5, trustLevel: 6, cost: 0, time: 180 }
    };

    const effects = interactionEffects[interactionType];
    if (!effects) return state;

    // Check if player can afford the interaction
    if (state.player.cash < effects.cost) return state;

    const interaction = {
      id: Date.now(),
      type: interactionType,
      timestamp: new Date(),
      effects,
      outcome: 'positive' // Could be randomized based on relationship level
    };

    const updatedConnections = state.relationships.connections.map(conn => {
      if (conn.id === connectionId) {
        return {
          ...conn,
          relationshipLevel: Math.max(1, Math.min(10, conn.relationshipLevel + effects.relationshipLevel)),
          trustLevel: Math.max(0, Math.min(100, conn.trustLevel + effects.trustLevel)),
          lastInteraction: new Date(),
          interactions: [...(conn.interactions || []), interaction]
        };
      }
      return conn;
    });

    const recentInteraction = {
      id: Date.now(),
      connectionId,
      connectionName: connection.name,
      type: interactionType,
      timestamp: new Date(),
      outcome: 'positive'
    };

    return {
      player: {
        ...state.player,
        cash: state.player.cash - effects.cost,
        energy: Math.max(0, state.player.energy - (effects.time / 10)),
        happiness: Math.min(100, state.player.happiness + 2)
      },
      relationships: {
        ...state.relationships,
        connections: updatedConnections,
        recentInteractions: [recentInteraction, ...state.relationships.recentInteractions.slice(0, 9)]
      }
    };
  }),

  /**
   * Join a social circle or professional network
   */
  joinSocialCircle: (circleType, membershipFee = 0) => set((state) => {
    if (state.player.cash < membershipFee) return state;

    // Check if already a member
    if (state.relationships.socialCircles.some(circle => circle.type === circleType)) {
      return state;
    }

    const socialCircleTypes = {
      'country_club': {
        influence: 50,
        networkingBonus: 20,
        monthlyFee: 500,
        benefits: ['exclusive_events', 'high_net_worth_connections']
      },
      'professional_association': {
        influence: 30,
        networkingBonus: 15,
        monthlyFee: 100,
        benefits: ['industry_connections', 'career_opportunities']
      },
      'alumni_network': {
        influence: 25,
        networkingBonus: 10,
        monthlyFee: 50,
        benefits: ['mentorship', 'job_referrals']
      },
      'business_club': {
        influence: 40,
        networkingBonus: 25,
        monthlyFee: 300,
        benefits: ['business_partnerships', 'investment_opportunities']
      },
      'charity_organization': {
        influence: 20,
        networkingBonus: 8,
        monthlyFee: 25,
        benefits: ['community_impact', 'reputation_boost']
      }
    };

    const circleConfig = socialCircleTypes[circleType];
    if (!circleConfig) return state;

    const newCircle = {
      id: Date.now(),
      type: circleType,
      joinDate: new Date(),
      membershipFee,
      monthlyFee: circleConfig.monthlyFee,
      influence: circleConfig.influence,
      networkingBonus: circleConfig.networkingBonus,
      benefits: circleConfig.benefits,
      status: 'active',
      eventsAttended: 0
    };

    const updatedStats = {
      ...state.relationships.socialStats,
      socialInfluence: state.relationships.socialStats.socialInfluence + circleConfig.influence,
      networkingLevel: Math.min(10, state.relationships.socialStats.networkingLevel + 1)
    };

    return {
      player: {
        ...state.player,
        cash: state.player.cash - membershipFee
      },
      relationships: {
        ...state.relationships,
        socialCircles: [...state.relationships.socialCircles, newCircle],
        socialStats: updatedStats
      }
    };
  }),

  /**
   * Attend a networking event
   */
  attendNetworkingEvent: (eventType, cost = 0) => set((state) => {
    if (state.player.cash < cost) return state;

    const eventTypes = {
      'conference': {
        connectionChance: 0.8,
        connectionCount: 3,
        influenceGain: 10,
        duration: 480 // 8 hours
      },
      'meetup': {
        connectionChance: 0.6,
        connectionCount: 2,
        influenceGain: 5,
        duration: 180 // 3 hours
      },
      'gala': {
        connectionChance: 0.9,
        connectionCount: 4,
        influenceGain: 15,
        duration: 300 // 5 hours
      },
      'workshop': {
        connectionChance: 0.7,
        connectionCount: 2,
        influenceGain: 8,
        duration: 240 // 4 hours
      }
    };

    const eventConfig = eventTypes[eventType];
    if (!eventConfig) return state;

    const event = {
      id: Date.now(),
      type: eventType,
      date: new Date(),
      cost,
      connectionsGained: 0,
      influenceGained: 0
    };

    // Simulate meeting new connections
    const newConnections = [];
    for (let i = 0; i < eventConfig.connectionCount; i++) {
      if (Math.random() < eventConfig.connectionChance) {
        const connection = generateRandomConnection(eventType);
        newConnections.push(connection);
        event.connectionsGained++;
      }
    }

    const influenceGained = eventConfig.influenceGain + (newConnections.length * 2);
    event.influenceGained = influenceGained;

    const updatedStats = {
      ...state.relationships.socialStats,
      socialInfluence: state.relationships.socialStats.socialInfluence + influenceGained,
      totalConnections: state.relationships.socialStats.totalConnections + newConnections.length
    };

    return {
      player: {
        ...state.player,
        cash: state.player.cash - cost,
        energy: Math.max(0, state.player.energy - (eventConfig.duration / 60)),
        happiness: Math.min(100, state.player.happiness + 5)
      },
      relationships: {
        ...state.relationships,
        connections: [...state.relationships.connections, ...newConnections],
        networkingEvents: [...state.relationships.networkingEvents, event],
        socialStats: updatedStats
      }
    };
  }),

  /**
   * Request a favor from a connection
   */
  requestFavor: (connectionId, favorType) => {
    const state = get();
    const connection = state.relationships.connections.find(conn => conn.id === connectionId);

    if (!connection) return { success: false, error: 'Connection not found' };

    const favorTypes = {
      'job_referral': {
        trustRequired: 60,
        relationshipRequired: 5,
        benefit: 'job_opportunity',
        trustCost: 10
      },
      'business_introduction': {
        trustRequired: 50,
        relationshipRequired: 4,
        benefit: 'business_connection',
        trustCost: 8
      },
      'investment_advice': {
        trustRequired: 70,
        relationshipRequired: 6,
        benefit: 'financial_insight',
        trustCost: 5
      },
      'loan_cosign': {
        trustRequired: 80,
        relationshipRequired: 8,
        benefit: 'credit_boost',
        trustCost: 15
      }
    };

    const favorConfig = favorTypes[favorType];
    if (!favorConfig) return { success: false, error: 'Invalid favor type' };

    if (connection.trustLevel < favorConfig.trustRequired) {
      return { success: false, error: 'Insufficient trust level' };
    }

    if (connection.relationshipLevel < favorConfig.relationshipRequired) {
      return { success: false, error: 'Relationship not strong enough' };
    }

    // Process the favor
    set((state) => {
      const updatedConnections = state.relationships.connections.map(conn => {
        if (conn.id === connectionId) {
          return {
            ...conn,
            trustLevel: Math.max(0, conn.trustLevel - favorConfig.trustCost),
            lastInteraction: new Date()
          };
        }
        return conn;
      });

      return {
        relationships: {
          ...state.relationships,
          connections: updatedConnections
        }
      };
    });

    return { success: true, benefit: favorConfig.benefit };
  },

  /**
   * Get relationship statistics and networking info
   */
  getRelationshipStats: () => {
    const state = get();
    const { relationships } = state;

    const connectionsByType = relationships.connections.reduce((acc, conn) => {
      acc[conn.type] = (acc[conn.type] || 0) + 1;
      return acc;
    }, {});

    const averageRelationshipLevel = relationships.connections.length > 0
      ? relationships.connections.reduce((sum, conn) => sum + conn.relationshipLevel, 0) / relationships.connections.length
      : 0;

    const averageTrustLevel = relationships.connections.length > 0
      ? relationships.connections.reduce((sum, conn) => sum + conn.trustLevel, 0) / relationships.connections.length
      : 0;

    const strongConnections = relationships.connections.filter(conn =>
      conn.relationshipLevel >= 7 && conn.trustLevel >= 70
    ).length;

    const networkingPower = calculateNetworkingPower(relationships);

    return {
      totalConnections: relationships.socialStats.totalConnections,
      connectionsByType,
      averageRelationshipLevel: Math.round(averageRelationshipLevel),
      averageTrustLevel: Math.round(averageTrustLevel),
      strongConnections,
      socialInfluence: relationships.socialStats.socialInfluence,
      networkingLevel: relationships.socialStats.networkingLevel,
      reputationScore: relationships.socialStats.reputationScore,
      networkingPower,
      socialCirclesCount: relationships.socialCircles.length,
      eventsAttended: relationships.networkingEvents.length,
      monthlyNetworkingCosts: relationships.socialCircles.reduce((sum, circle) => sum + circle.monthlyFee, 0)
    };
  },

  /**
   * Process monthly relationship maintenance
   */
  processMonthlyRelationships: () => set((state) => {
    // Decay relationships that haven't been maintained
    const updatedConnections = state.relationships.connections.map(conn => {
      const daysSinceLastInteraction = (new Date() - new Date(conn.lastInteraction)) / (1000 * 60 * 60 * 24);

      let relationshipDecay = 0;
      let trustDecay = 0;

      if (daysSinceLastInteraction > 90) { // 3 months
        relationshipDecay = 1;
        trustDecay = 3;
      } else if (daysSinceLastInteraction > 60) { // 2 months
        relationshipDecay = 0;
        trustDecay = 1;
      }

      return {
        ...conn,
        relationshipLevel: Math.max(1, conn.relationshipLevel - relationshipDecay),
        trustLevel: Math.max(0, conn.trustLevel - trustDecay)
      };
    });

    // Calculate monthly social circle fees
    const monthlyFees = state.relationships.socialCircles.reduce((sum, circle) => sum + circle.monthlyFee, 0);

    return {
      player: {
        ...state.player,
        cash: Math.max(0, state.player.cash - monthlyFees)
      },
      relationships: {
        ...state.relationships,
        connections: updatedConnections
      }
    };
  })
});

// Helper functions
function generateRandomConnection(eventType) {
  const names = ['Alex Johnson', 'Sarah Chen', 'Michael Rodriguez', 'Emily Davis', 'David Kim', 'Lisa Thompson'];
  const industries = ['technology', 'finance', 'healthcare', 'real_estate', 'consulting', 'media'];
  const types = ['business', 'acquaintance', 'mentor'];

  return {
    id: Date.now() + Math.random(),
    name: names[Math.floor(Math.random() * names.length)],
    type: types[Math.floor(Math.random() * types.length)],
    industry: industries[Math.floor(Math.random() * industries.length)],
    relationshipLevel: Math.floor(Math.random() * 3) + 1,
    trustLevel: Math.floor(Math.random() * 30) + 20,
    influence: Math.floor(Math.random() * 20) + 5,
    lastInteraction: new Date(),
    metAt: eventType,
    connectionDate: new Date(),
    interactions: [],
    benefits: [],
    status: 'active'
  };
}

function calculateNetworkingPower(relationships) {
  const { connections, socialCircles, socialStats } = relationships;

  const connectionPower = connections.reduce((sum, conn) => {
    return sum + (conn.relationshipLevel * conn.trustLevel * conn.influence) / 100;
  }, 0);

  const circlePower = socialCircles.reduce((sum, circle) => sum + circle.influence, 0);

  const influencePower = socialStats.socialInfluence;

  return Math.round(connectionPower + circlePower + influencePower);
}
