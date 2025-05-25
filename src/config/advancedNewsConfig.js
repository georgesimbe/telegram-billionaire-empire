export const ADVANCED_NEWS_EVENTS = {
  CYBER_SECURITY_BREACH: {
    id: 'cyber_security_breach',
    name: 'Cyber Security Breach Affects Tech Sector',
    description: 'A major cyber attack has compromised several technology companies. How do you respond?',
    category: 'technology',
    severity: 'high',
    probability: 0.03,
    duration: 72, // hours
    affectedIndustries: ['technology', 'finance', 'healthcare'],
    baseEffect: { incomeMultiplier: 0.6 }, // -40% income
    choices: [
      {
        id: 'invest_security',
        text: 'Invest heavily in cybersecurity (Cost: 25,000 points)',
        cost: 25000,
        effects: {
          incomeMultiplier: 0.9, // Only -10% income
          securityRating: 20,
          customerTrust: 15,
          futureRiskReduction: 0.3
        },
        requirements: { points: 25000 }
      },
      {
        id: 'basic_protection',
        text: 'Implement basic security measures (Cost: 10,000 points)',
        cost: 10000,
        effects: {
          incomeMultiplier: 0.75, // -25% income
          securityRating: 10,
          futureRiskReduction: 0.15
        },
        requirements: { points: 10000 }
      },
      {
        id: 'ignore_threat',
        text: 'Continue operations without changes',
        cost: 0,
        effects: {
          incomeMultiplier: 0.5, // -50% income
          securityRating: -10,
          customerTrust: -20,
          futureRiskIncrease: 0.2
        }
      }
    ],
    communityVoting: {
      enabled: true,
      votingPeriod: 24, // hours
      options: ['invest_security', 'basic_protection', 'ignore_threat'],
      influenceWeight: 0.3 // 30% influence on final outcome
    }
  },

  ECONOMIC_RECESSION: {
    id: 'economic_recession',
    name: 'Economic Recession Looms',
    description: 'Economic indicators suggest a potential recession. Consumer spending is declining.',
    category: 'economy',
    severity: 'high',
    probability: 0.02,
    duration: 168, // 1 week
    affectedIndustries: ['retail', 'entertainment', 'real_estate', 'automotive'],
    baseEffect: { incomeMultiplier: 0.7 },
    choices: [
      {
        id: 'diversify_portfolio',
        text: 'Diversify into recession-proof industries (Cost: 50,000 points)',
        cost: 50000,
        effects: {
          incomeMultiplier: 0.85,
          portfolioStability: 25,
          newBusinessOpportunities: 3
        },
        requirements: { points: 50000, businesses: 5 }
      },
      {
        id: 'cost_cutting',
        text: 'Implement aggressive cost-cutting measures',
        cost: 0,
        effects: {
          incomeMultiplier: 0.8,
          staffMorale: -15,
          operationalEfficiency: 10
        }
      },
      {
        id: 'maintain_course',
        text: 'Maintain current operations and wait it out',
        cost: 0,
        effects: {
          incomeMultiplier: 0.65,
          staffMorale: -5,
          marketShare: -10
        }
      }
    ]
  },

  SUPPLY_CHAIN_CRISIS: {
    id: 'supply_chain_crisis',
    name: 'Global Supply Chain Disruption',
    description: 'International shipping delays and material shortages affect production worldwide.',
    category: 'logistics',
    severity: 'medium',
    probability: 0.05,
    duration: 96,
    affectedIndustries: ['manufacturing', 'retail', 'food_service'],
    baseEffect: {
      incomeMultiplier: 0.8,
      productionEfficiency: 0.7
    },
    choices: [
      {
        id: 'local_suppliers',
        text: 'Switch to local suppliers (Higher costs but reliable)',
        cost: 15000,
        effects: {
          incomeMultiplier: 0.9,
          productionEfficiency: 0.95,
          supplierReliability: 20,
          operatingCosts: 1.1
        },
        requirements: { points: 15000 }
      },
      {
        id: 'stockpile_resources',
        text: 'Build strategic resource reserves (Cost: 30,000 points)',
        cost: 30000,
        effects: {
          incomeMultiplier: 0.95,
          resourceSecurity: 30,
          futureSupplyProtection: 0.4
        },
        requirements: { points: 30000 }
      },
      {
        id: 'accept_delays',
        text: 'Accept delays and reduce production',
        cost: 0,
        effects: {
          incomeMultiplier: 0.7,
          customerSatisfaction: -15,
          competitivePosition: -10
        }
      }
    ]
  },

  ENVIRONMENTAL_REGULATION: {
    id: 'environmental_regulation',
    name: 'New Environmental Regulations',
    description: 'Government introduces strict environmental compliance requirements.',
    category: 'regulation',
    severity: 'medium',
    probability: 0.04,
    duration: 120,
    affectedIndustries: ['manufacturing', 'energy', 'automotive'],
    baseEffect: {
      incomeMultiplier: 0.85,
      complianceCosts: 1.2
    },
    choices: [
      {
        id: 'green_technology',
        text: 'Invest in green technology and become industry leader',
        cost: 40000,
        effects: {
          incomeMultiplier: 1.1, // Bonus for early adoption
          brandValue: 25,
          sustainabilityRating: 40,
          governmentIncentives: 10000
        },
        requirements: { points: 40000 }
      },
      {
        id: 'minimum_compliance',
        text: 'Meet minimum compliance requirements',
        cost: 20000,
        effects: {
          incomeMultiplier: 0.9,
          complianceRating: 10,
          operatingCosts: 1.1
        },
        requirements: { points: 20000 }
      },
      {
        id: 'lobby_against',
        text: 'Lobby against regulations (Risky but potentially profitable)',
        cost: 35000,
        effects: {
          incomeMultiplier: 0.95,
          publicReputation: -20,
          regulatoryRisk: 30,
          potentialFines: 50000
        },
        requirements: { points: 35000, influence: 50 }
      }
    ]
  },

  TECHNOLOGICAL_BREAKTHROUGH: {
    id: 'technological_breakthrough',
    name: 'Revolutionary Technology Emerges',
    description: 'A breakthrough technology threatens to disrupt traditional business models.',
    category: 'innovation',
    severity: 'high',
    probability: 0.025,
    duration: 240, // 10 days
    affectedIndustries: ['technology', 'manufacturing', 'transportation'],
    baseEffect: {
      incomeMultiplier: 0.9,
      innovationPressure: 20
    },
    choices: [
      {
        id: 'early_adoption',
        text: 'Be an early adopter and integrate the technology',
        cost: 60000,
        effects: {
          incomeMultiplier: 1.3,
          technologyLeadership: 35,
          competitiveAdvantage: 25,
          researchBonus: 0.2
        },
        requirements: { points: 60000, techLevel: 5 }
      },
      {
        id: 'wait_and_see',
        text: 'Wait for technology to mature before adopting',
        cost: 0,
        effects: {
          incomeMultiplier: 0.95,
          technologyGap: 10,
          marketPosition: -5
        }
      },
      {
        id: 'develop_alternative',
        text: 'Develop competing technology (High risk, high reward)',
        cost: 80000,
        effects: {
          incomeMultiplier: 0.8, // Short-term loss
          researchInvestment: 80000,
          innovationPotential: 50,
          patentOpportunities: 3
        },
        requirements: { points: 80000, researchFacilities: 1 }
      }
    ]
  },

  PANDEMIC_OUTBREAK: {
    id: 'pandemic_outbreak',
    name: 'Global Health Crisis',
    description: 'A pandemic affects global business operations and consumer behavior.',
    category: 'health',
    severity: 'extreme',
    probability: 0.01,
    duration: 336, // 2 weeks
    affectedIndustries: ['entertainment', 'travel', 'retail', 'food_service'],
    baseEffect: {
      incomeMultiplier: 0.4,
      operationalRestrictions: 0.6
    },
    choices: [
      {
        id: 'digital_transformation',
        text: 'Rapidly digitize operations and go online',
        cost: 45000,
        effects: {
          incomeMultiplier: 0.7,
          digitalCapabilities: 40,
          futureResilience: 30,
          customerReach: 25
        },
        requirements: { points: 45000 }
      },
      {
        id: 'essential_services',
        text: 'Pivot to essential services and products',
        cost: 25000,
        effects: {
          incomeMultiplier: 0.8,
          socialImpact: 20,
          governmentSupport: 15000,
          brandLoyalty: 15
        },
        requirements: { points: 25000 }
      },
      {
        id: 'hibernate_business',
        text: 'Minimize operations and preserve cash',
        cost: 0,
        effects: {
          incomeMultiplier: 0.3,
          cashPreservation: 20,
          staffRetention: -25,
          marketShare: -20
        }
      }
    ]
  }
};

export const RISK_CATEGORIES = {
  OPERATIONAL: {
    id: 'operational',
    name: 'Operational Risk',
    icon: '⚙️',
    description: 'Risks related to day-to-day business operations',
    factors: [
      'staff_turnover',
      'equipment_failure',
      'supply_chain_disruption',
      'quality_control_issues'
    ]
  },
  FINANCIAL: {
    id: 'financial',
    name: 'Financial Risk',
    icon: '💰',
    description: 'Risks affecting financial stability and cash flow',
    factors: [
      'market_volatility',
      'credit_risk',
      'currency_fluctuation',
      'interest_rate_changes'
    ]
  },
  STRATEGIC: {
    id: 'strategic',
    name: 'Strategic Risk',
    icon: '🎯',
    description: 'Risks related to business strategy and market position',
    factors: [
      'competitive_pressure',
      'technology_disruption',
      'market_changes',
      'regulatory_changes'
    ]
  },
  REPUTATIONAL: {
    id: 'reputational',
    name: 'Reputational Risk',
    icon: '🏆',
    description: 'Risks affecting brand image and public perception',
    factors: [
      'public_relations_crisis',
      'social_media_backlash',
      'ethical_concerns',
      'customer_complaints'
    ]
  },
  CYBERSECURITY: {
    id: 'cybersecurity',
    name: 'Cybersecurity Risk',
    icon: '🔒',
    description: 'Risks related to digital security and data protection',
    factors: [
      'data_breaches',
      'system_vulnerabilities',
      'cyber_attacks',
      'privacy_violations'
    ]
  }
};

export const RISK_MITIGATION_STRATEGIES = {
  INSURANCE_COVERAGE: {
    id: 'insurance_coverage',
    name: 'Comprehensive Insurance',
    category: 'financial',
    cost: 5000,
    monthlyCost: 1000,
    riskReduction: {
      operational: 20,
      financial: 25
    },
    description: 'Broad insurance coverage for various business risks'
  },
  CYBERSECURITY_SUITE: {
    id: 'cybersecurity_suite',
    name: 'Advanced Cybersecurity',
    category: 'cybersecurity',
    cost: 15000,
    monthlyCost: 2000,
    riskReduction: {
      cybersecurity: 40,
      reputational: 10
    },
    description: 'Comprehensive cybersecurity protection and monitoring'
  },
  CRISIS_MANAGEMENT_TEAM: {
    id: 'crisis_management_team',
    name: 'Crisis Management Team',
    category: 'strategic',
    cost: 25000,
    monthlyCost: 3000,
    riskReduction: {
      reputational: 30,
      strategic: 20,
      operational: 15
    },
    description: 'Dedicated team for crisis prevention and response'
  },
  DIVERSIFICATION_STRATEGY: {
    id: 'diversification_strategy',
    name: 'Business Diversification',
    category: 'strategic',
    cost: 50000,
    riskReduction: {
      strategic: 35,
      financial: 20
    },
    description: 'Diversify business portfolio to reduce concentration risk'
  },
  QUALITY_ASSURANCE: {
    id: 'quality_assurance',
    name: 'Quality Assurance Program',
    category: 'operational',
    cost: 20000,
    monthlyCost: 1500,
    riskReduction: {
      operational: 30,
      reputational: 15
    },
    description: 'Comprehensive quality control and assurance processes'
  }
};

export const COMMUNITY_VOTING_SYSTEM = {
  VOTING_POWER: {
    BASIC_MEMBER: 1,
    PREMIUM_MEMBER: 2,
    VIP_MEMBER: 3,
    WHALE: 5,
    MODERATOR: 10
  },
  VOTING_REQUIREMENTS: {
    MIN_PARTICIPANTS: 10,
    MIN_VOTING_PERIOD: 12, // hours
    MAX_VOTING_PERIOD: 48,
    QUORUM_PERCENTAGE: 0.3 // 30% of eligible voters
  },
  INFLUENCE_FACTORS: {
    COMMUNITY_SIZE: 0.2,
    VOTING_PARTICIPATION: 0.3,
    CONSENSUS_STRENGTH: 0.5
  }
};

// Helper functions
export const calculateRiskScore = (business, mitigationStrategies = []) => {
  let totalRisk = 0;
  const riskFactors = {
    operational: 20,
    financial: 15,
    strategic: 25,
    reputational: 10,
    cybersecurity: 30
  };

  // Base risk calculation
  Object.entries(riskFactors).forEach(([category, baseRisk]) => {
    let categoryRisk = baseRisk;

    // Apply business-specific factors
    if (business.category === 'technology' && category === 'cybersecurity') {
      categoryRisk *= 1.5;
    }
    if (business.category === 'finance' && category === 'financial') {
      categoryRisk *= 1.3;
    }

    // Apply mitigation strategies
    mitigationStrategies.forEach(strategy => {
      const mitigation = RISK_MITIGATION_STRATEGIES[strategy.toUpperCase()];
      if (mitigation && mitigation.riskReduction[category]) {
        categoryRisk *= (1 - mitigation.riskReduction[category] / 100);
      }
    });

    totalRisk += categoryRisk;
  });

  return Math.min(100, Math.max(0, totalRisk));
};

export const getApplicableEvents = (playerState) => {
  return Object.values(ADVANCED_NEWS_EVENTS).filter(event => {
    // Check if player has businesses in affected industries
    const hasAffectedBusiness = event.affectedIndustries.some(industry =>
      playerState.businesses.some(business => business.category === industry)
    );

    return hasAffectedBusiness && Math.random() < event.probability;
  });
};

export const processEventChoice = (event, choice, playerState) => {
  const selectedChoice = event.choices.find(c => c.id === choice);
  if (!selectedChoice) return null;

  const results = {
    costs: selectedChoice.cost || 0,
    effects: { ...selectedChoice.effects },
    requirements_met: true,
    messages: []
  };

  // Check requirements
  if (selectedChoice.requirements) {
    const reqs = selectedChoice.requirements;

    if (reqs.points && playerState.points < reqs.points) {
      results.requirements_met = false;
      results.messages.push(`Insufficient points. Need ${reqs.points}, have ${playerState.points}`);
    }

    if (reqs.businesses && playerState.businesses.length < reqs.businesses) {
      results.requirements_met = false;
      results.messages.push(`Need at least ${reqs.businesses} businesses`);
    }

    if (reqs.techLevel && (playerState.techLevel || 0) < reqs.techLevel) {
      results.requirements_met = false;
      results.messages.push(`Technology level too low. Need level ${reqs.techLevel}`);
    }
  }

  return results;
};

export const simulateCommunityVoting = (event, communityStats) => {
  if (!event.communityVoting || !event.communityVoting.enabled) {
    return null;
  }

  const voting = event.communityVoting;
  const totalVoters = Math.floor(communityStats.activeMembers * 0.4); // 40% participation

  const votes = {};
  voting.options.forEach(option => {
    votes[option] = Math.floor(Math.random() * totalVoters);
  });

  // Normalize votes
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
  const votePercentages = {};

  Object.entries(votes).forEach(([option, count]) => {
    votePercentages[option] = totalVotes > 0 ? count / totalVotes : 0;
  });

  const winningOption = Object.entries(votePercentages)
    .sort(([, a], [, b]) => b - a)[0][0];

  return {
    votes,
    votePercentages,
    winningOption,
    totalParticipation: totalVotes,
    influence: voting.influenceWeight
  };
};

export const calculateEventImpact = (event, choice, business) => {
  const selectedChoice = event.choices.find(c => c.id === choice);
  if (!selectedChoice) return { incomeMultiplier: event.baseEffect.incomeMultiplier || 1 };

  let impact = { ...event.baseEffect };

  // Apply choice effects
  Object.entries(selectedChoice.effects).forEach(([key, value]) => {
    if (typeof value === 'number') {
      impact[key] = value;
    }
  });

  // Industry-specific modifications
  if (event.affectedIndustries.includes(business.category)) {
    // Business is directly affected
    return impact;
  } else {
    // Indirect effects (reduced impact)
    const indirectImpact = { ...impact };
    if (indirectImpact.incomeMultiplier) {
      indirectImpact.incomeMultiplier = 1 - ((1 - indirectImpact.incomeMultiplier) * 0.3);
    }
    return indirectImpact;
  }
};

export const generateRiskReport = (businesses, mitigationStrategies) => {
  const report = {
    overallRisk: 0,
    categoryRisks: {},
    recommendations: [],
    criticalIssues: []
  };

  let totalRisk = 0;
  const categoryTotals = {};

  businesses.forEach(business => {
    const businessRisk = calculateRiskScore(business, mitigationStrategies);
    totalRisk += businessRisk;

    // Calculate category-specific risks
    Object.keys(RISK_CATEGORIES).forEach(category => {
      if (!categoryTotals[category]) categoryTotals[category] = 0;
      categoryTotals[category] += businessRisk * 0.2; // Distribute risk across categories
    });
  });

  report.overallRisk = businesses.length > 0 ? totalRisk / businesses.length : 0;

  Object.entries(categoryTotals).forEach(([category, total]) => {
    report.categoryRisks[category] = businesses.length > 0 ? total / businesses.length : 0;
  });

  // Generate recommendations
  Object.entries(report.categoryRisks).forEach(([category, risk]) => {
    if (risk > 30) {
      report.criticalIssues.push({
        category,
        risk,
        severity: 'high'
      });

      const relevantStrategies = Object.values(RISK_MITIGATION_STRATEGIES)
        .filter(strategy => strategy.riskReduction[category])
        .sort((a, b) => (b.riskReduction[category] || 0) - (a.riskReduction[category] || 0));

      if (relevantStrategies.length > 0) {
        report.recommendations.push({
          category,
          strategy: relevantStrategies[0],
          expectedReduction: relevantStrategies[0].riskReduction[category]
        });
      }
    }
  });

  return report;
}; 