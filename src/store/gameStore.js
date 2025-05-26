import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GAME_CONFIG } from '../config/gameConfig.js';
import { EXPANDED_INDUSTRIES_CONFIG, calculateBusinessCost, calculateBusinessIncome, calculateSupplyChainBonus } from '../config/expandedIndustriesConfig.js';
import { SECURITY_CONFIG, SecurityCalculator } from '../config/securityConfig.js';
import { antiCheatDetector } from '../utils/antiCheatDetector.js';
import {
  STAKING_POOLS,
  STAKING_CALCULATIONS,
  calculateTotalDailyRewards,
  calculateTotalStaked,
  getActiveEconomicEvents
} from '../config/stakingConfig.js';
import {
  ECONOMIC_CONFIG,
  INDUSTRY_CLUSTERS,
  SUPPLY_CHAIN_DEPENDENCIES,
  ECONOMIC_EVENTS,
  COMMUNITY_PROJECTS,
  ACHIEVEMENT_REWARDS,
  EconomicSimulator
} from '../config/economicSimulationConfig.js';
import {
  HOUSING_TYPES,
  MORTGAGE_OPTIONS,
  getHousingEffects,
  canAffordHousing,
  calculateMortgagePayment,
  calculateUtilityCosts
} from '../config/housingConfig.js';
import {
  EDUCATION_LEVELS,
  CERTIFICATIONS,
  JOB_CATEGORIES,
  getAvailableEducation,
  getAvailableJobs,
  calculateJobSalary,
  getEducationProgress
} from '../config/educationConfig.js';

const useGameStore = create(
  persist(
    (set, get) => ({
      // Player Life Stats
      player: {
        id: null,
        username: '',
        cash: 5000,
        monthlyIncome: 0,
        creditScore: 650,
        happiness: 70,
        health: 80,
        energy: 80,
        stress: 20,
        experience: 0,
        level: 1,
        totalEarned: 0,
        lastLogin: new Date(),
        createdAt: new Date(),
        initialized: false,
        dailyActionsRemaining: 10,
        lastDailyReset: new Date(),
      },

      // Career & Education
      career: {
        currentJob: null,
        education: 'high_school',
        skills: [],
        workExperience: 0,
        jobApplications: [],
        certifications: [],
      },

      // Housing & Living
      housing: {
        currentHousing: 'homeless',
        ownedProperties: [],
        mortgages: [],
        utilities: [],
        monthlyHousingCost: 0,
      },

      // Banking & Finance
      banking: {
        accounts: [
          { type: 'checking', balance: 5000, interestRate: 0.001 }
        ],
        loans: [],
        creditCards: [],
        investments: [],
        creditHistory: [],
        monthlyDebtPayments: 0,
      },

      // Relationships & Social
      relationships: [
        { id: 1, name: 'Sarah Johnson', type: 'family', points: 75, lastInteraction: new Date() },
        { id: 2, name: 'Mike Chen', type: 'friends', points: 60, lastInteraction: new Date() },
      ],

      // Business Empire
      businesses: [],
      businessStats: {
        totalBusinesses: 0,
        monthlyBusinessIncome: 0,
        totalBusinessValue: 0,
      },

      // Economic Staking System
      staking: {
        tonBalance: 1000, // Starting TON balance for testing
        totalStaked: 0,
        activeStakes: {}, // { poolId: { amount, startDate, lockPeriod, apy } }
        stakingHistory: [],
        pendingRewards: 0,
        claimedRewards: 0,
        votingPower: 0,
        stakingTenure: {} // { poolId: daysStaked }
      },

      // Community Governance
      governance: {
        votingPower: 0,
        activeProposals: [],
        votingHistory: [],
        submittedProposals: [],
        governanceTokens: 0
      },

      // Economic System
      economics: {
        marketInfluence: 0,
        industryPositions: {}, // { industryId: marketShare }
        activeEvents: [],
        resourceInventory: {},
        supplyChainConnections: [],
        economicReputation: 50
      },

      achievements: [],
      statistics: {
        totalDaysPlayed: 0,
        totalMoneyEarned: 0,
        businessesOwned: 0,
        relationshipsFormed: 0,
        jobsHeld: 0,
        educationCompleted: [],
      },

      // Daily/Time Management
      gameTime: {
        currentDate: new Date(),
        daysPassed: 0,
        monthsPassed: 0,
        yearsPassed: 0,
      },

      // Settings & Preferences
      settings: {
        notifications: true,
        autoSave: true,
        difficulty: 'normal',
        currency: 'USD',
      },

      // Security System
      security: {
        initialized: false,
        deviceData: null,
        sessionId: null,
        startTime: null,
        actionLog: [],
        recentClicks: []
      },

      // Security Actions
      initializeSecurity: (deviceData) => set((state) => ({
        security: {
          ...state.security,
          deviceData,
          initialized: true,
          sessionId: Date.now().toString(),
          startTime: new Date()
        }
      })),

      logAction: (actionType, data = {}) => {
        const state = get();
        const now = Date.now();
        const security = state.security || {};
        
        // Simple rate limiting for clicks
        if (actionType === 'CLICK') {
          const recentClicks = security.recentClicks || [];
          const oneSecondAgo = now - 1000;
          const filteredClicks = recentClicks.filter(time => time > oneSecondAgo);
          
          if (filteredClicks.length > 10) {
            return { allowed: false, reason: 'Too many clicks' };
          }
          
          set((state) => ({
            security: {
              ...state.security,
              recentClicks: [...filteredClicks, now]
            }
          }));
        }
        
        // Log the action
        set((state) => ({
          security: {
            ...state.security,
            actionLog: [
              ...(state.security?.actionLog || []).slice(-100), // Keep only last 100 actions
              {
                type: actionType,
                data,
                timestamp: now,
                sessionId: security.sessionId
              }
            ]
          }
        }));
        
        return { allowed: true };
      },

      getSecurityStatus: () => {
        const state = get();
        const security = state.security || {};
        
        // Simple security check - would be more sophisticated in production
        const suspiciousActions = (security.actionLog || []).filter(action => 
          action.type === 'DEV_TOOLS_DETECTED' || 
          action.type === 'AUTOMATION_DETECTED'
        );
        
        return {
          shouldBan: suspiciousActions.length > 5,
          warningLevel: Math.min(3, Math.floor(suspiciousActions.length / 2)),
          totalActions: (security.actionLog || []).length
        };
      },

      // Daily Actions Reset
      resetDailyActions: () => set((state) => ({
        player: {
          ...state.player,
          dailyActionsRemaining: GAME_CONFIG?.dailyActions || 10,
          lastDailyReset: new Date()
        }
      })),

      // Initialize Player
      initializePlayer: (playerData = {}) => set((state) => ({
        player: {
          ...state.player,
          ...playerData,
          initialized: true,
          lastLogin: new Date()
        }
      })),

      // Actions
      updatePlayer: (updates) => set((state) => ({
        player: { ...state.player, ...updates }
      })),

      updateCareer: (updates) => set((state) => ({
        career: { ...state.career, ...updates }
      })),

      updateHousing: (updates) => set((state) => ({
        housing: { ...state.housing, ...updates }
      })),

      updateBanking: (updates) => set((state) => ({
        banking: { ...state.banking, ...updates }
      })),

      addRelationship: (relationship) => set((state) => ({
        relationships: [...state.relationships, { ...relationship, id: Date.now() }]
      })),

      updateRelationship: (id, updates) => set((state) => ({
        relationships: state.relationships.map(rel =>
          rel.id === id ? { ...rel, ...updates } : rel
        )
      })),

      addBusiness: (business) => set((state) => ({
        businesses: [...state.businesses, { ...business, id: Date.now(), purchaseDate: new Date() }],
        businessStats: {
          ...state.businessStats,
          totalBusinesses: state.businesses.length + 1,
        }
      })),

      updateBusiness: (id, updates) => set((state) => ({
        businesses: state.businesses.map(biz =>
          biz.id === id ? { ...biz, ...updates } : biz
        )
      })),

      // Financial Actions
      addIncome: (amount, source = 'unknown') => set((state) => {
        const newCash = state.player.cash + amount;
        const newTotalEarned = state.player.totalEarned + amount;

        return {
          player: {
            ...state.player,
            cash: newCash,
            totalEarned: newTotalEarned,
          },
          statistics: {
            ...state.statistics,
            totalMoneyEarned: newTotalEarned,
          }
        };
      }),

      spendMoney: (amount, category = 'unknown') => set((state) => {
        if (state.player.cash >= amount) {
          return {
            player: {
              ...state.player,
              cash: state.player.cash - amount,
            }
          };
        }
        return state; // Not enough money
      }),

      // Loan Management
      addLoan: (loan) => set((state) => ({
        banking: {
          ...state.banking,
          loans: [...state.banking.loans, { ...loan, id: Date.now(), startDate: new Date() }],
          monthlyDebtPayments: state.banking.monthlyDebtPayments + loan.monthlyPayment,
        },
        player: {
          ...state.player,
          cash: state.player.cash + loan.amount,
        }
      })),

      payLoan: (loanId, amount) => set((state) => {
        const loan = state.banking.loans.find(l => l.id === loanId);
        if (!loan || state.player.cash < amount) return state;

        const updatedLoans = state.banking.loans.map(l => {
          if (l.id === loanId) {
            const newBalance = Math.max(0, l.remainingBalance - amount);
            return { ...l, remainingBalance: newBalance };
          }
          return l;
        }).filter(l => l.remainingBalance > 0);

        return {
          banking: {
            ...state.banking,
            loans: updatedLoans,
            monthlyDebtPayments: updatedLoans.reduce((sum, l) => sum + l.monthlyPayment, 0),
          },
          player: {
            ...state.player,
            cash: state.player.cash - amount,
          }
        };
      }),

      // Time Management with Staking Integration
      advanceTime: (days = 1) => set((state) => {
        const newDate = new Date(state.gameTime.currentDate);
        newDate.setDate(newDate.getDate() + days);

        const daysPassed = state.gameTime.daysPassed + days;
        const monthsPassed = Math.floor(daysPassed / 30);
        const yearsPassed = Math.floor(daysPassed / 365);

        // Calculate monthly income/expenses
        let monthlyIncome = state.player.monthlyIncome;
        let monthlyExpenses = state.housing.monthlyHousingCost + state.banking.monthlyDebtPayments;

        // Add business income
        const businessIncome = state.businesses.reduce((sum, business) => {
          return sum + (business.monthlyIncome || 0);
        }, 0);

        monthlyIncome += businessIncome;

        // Calculate staking rewards
        const dailyStakingRewards = calculateTotalDailyRewards(state.staking.activeStakes);
        const stakingRewards = dailyStakingRewards * days;

        // Update staking tenure
        const updatedTenure = { ...state.staking.stakingTenure };
        Object.keys(state.staking.activeStakes).forEach(poolId => {
          updatedTenure[poolId] = (updatedTenure[poolId] || 0) + days;
        });

        // Calculate voting power
        const votingPower = STAKING_CALCULATIONS.calculateVotingPower(state.staking.activeStakes, updatedTenure);

        // Process economic events
        const activeEvents = getActiveEconomicEvents(state);

        // If a month has passed, process monthly transactions
        if (Math.floor(daysPassed / 30) > Math.floor((daysPassed - days) / 30)) {
          const netIncome = monthlyIncome - monthlyExpenses;

          return {
            ...state,
            player: {
              ...state.player,
              cash: Math.max(0, state.player.cash + netIncome),
              totalEarned: state.player.totalEarned + Math.max(0, netIncome),
            },
            staking: {
              ...state.staking,
              pendingRewards: state.staking.pendingRewards + stakingRewards,
              stakingTenure: updatedTenure,
              votingPower
            },
            governance: {
              ...state.governance,
              votingPower
            },
            economics: {
              ...state.economics,
              activeEvents
            },
            gameTime: {
              currentDate: newDate,
              daysPassed,
              monthsPassed,
              yearsPassed,
            },
            statistics: {
              ...state.statistics,
              totalDaysPlayed: daysPassed,
            }
          };
        }

        return {
          ...state,
          staking: {
            ...state.staking,
            pendingRewards: state.staking.pendingRewards + stakingRewards,
            stakingTenure: updatedTenure,
            votingPower
          },
          governance: {
            ...state.governance,
            votingPower
          },
          economics: {
            ...state.economics,
            activeEvents
          },
          gameTime: {
            currentDate: newDate,
            daysPassed,
            monthsPassed,
            yearsPassed,
          },
          statistics: {
            ...state.statistics,
            totalDaysPlayed: daysPassed,
          }
        };
      }),

      // Job Management
      applyForJob: (job) => set((state) => ({
        career: {
          ...state.career,
          jobApplications: [...state.career.jobApplications, {
            id: Date.now(),
            job,
            status: 'pending',
            appliedDate: new Date(),
          }]
        }
      })),

      acceptJob: (job) => set((state) => ({
        career: {
          ...state.career,
          currentJob: job,
          jobApplications: state.career.jobApplications.filter(app => app.job.id !== job.id),
        },
        player: {
          ...state.player,
          monthlyIncome: job.salary,
        },
        statistics: {
          ...state.statistics,
          jobsHeld: state.statistics.jobsHeld + 1,
        }
      })),

      quitJob: () => set((state) => ({
        career: {
          ...state.career,
          currentJob: null,
        },
        player: {
          ...state.player,
          monthlyIncome: 0,
        }
      })),

      // Housing Management
      moveToHousing: (housingType, cost) => set((state) => {
        if (state.player.cash >= cost) {
          return {
            player: {
              ...state.player,
              cash: state.player.cash - cost,
            },
            housing: {
              ...state.housing,
              currentHousing: housingType,
              monthlyHousingCost: cost,
            }
          };
        }
        return state;
      }),

      // Achievement System
      addAchievement: (achievement) => set((state) => ({
        achievements: [...state.achievements, { ...achievement, unlockedAt: new Date() }]
      })),

      // Staking Management
      updateStaking: (updates) => set((state) => ({
        staking: { ...state.staking, ...updates }
      })),

      stakeTokens: (poolId, amount) => set((state) => {
        const pool = STAKING_POOLS[poolId.toUpperCase()];
        if (!pool || state.staking.tonBalance < amount || amount < pool.minStake) {
          return state;
        }

        const existingStake = state.staking.activeStakes[poolId] || { amount: 0 };
        if (existingStake.amount + amount > pool.maxStake) {
          return state;
        }

        const apy = STAKING_CALCULATIONS.calculateAPY(poolId.toUpperCase(), amount, pool.lockPeriod);
        const newStake = {
          amount: existingStake.amount + amount,
          startDate: existingStake.startDate || new Date(),
          lockPeriod: pool.lockPeriod,
          apy: apy,
          poolId: poolId
        };

        const newActiveStakes = {
          ...state.staking.activeStakes,
          [poolId]: newStake
        };

        const newTotalStaked = calculateTotalStaked(newActiveStakes);

        return {
          staking: {
            ...state.staking,
            tonBalance: state.staking.tonBalance - amount,
            totalStaked: newTotalStaked,
            activeStakes: newActiveStakes,
            stakingHistory: [...state.staking.stakingHistory, {
              id: Date.now(),
              type: 'stake',
              poolId,
              amount,
              timestamp: new Date(),
              apy
            }]
          }
        };
      }),

      unstakeTokens: (poolId, amount) => set((state) => {
        const stake = state.staking.activeStakes[poolId];
        if (!stake || amount > stake.amount) {
          return state;
        }

        const pool = STAKING_POOLS[poolId.toUpperCase()];
        const lockEndDate = new Date(stake.startDate);
        lockEndDate.setDate(lockEndDate.getDate() + pool.lockPeriod);
        const timeRemaining = Math.max(0, lockEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);

        const penalty = STAKING_CALCULATIONS.calculateUnstakingPenalty(poolId.toUpperCase(), timeRemaining);
        const penaltyAmount = amount * penalty;
        const netAmount = amount - penaltyAmount;

        const updatedStake = {
          ...stake,
          amount: stake.amount - amount
        };

        const newActiveStakes = { ...state.staking.activeStakes };
        if (updatedStake.amount <= 0) {
          delete newActiveStakes[poolId];
        } else {
          newActiveStakes[poolId] = updatedStake;
        }

        const newTotalStaked = calculateTotalStaked(newActiveStakes);

        return {
          staking: {
            ...state.staking,
            tonBalance: state.staking.tonBalance + netAmount,
            totalStaked: newTotalStaked,
            activeStakes: newActiveStakes,
            stakingHistory: [...state.staking.stakingHistory, {
              id: Date.now(),
              type: 'unstake',
              poolId,
              amount,
              penalty: penaltyAmount,
              netAmount,
              timestamp: new Date()
            }]
          }
        };
      }),

      claimStakingRewards: () => set((state) => {
        if (state.staking.pendingRewards <= 0) return state;

        return {
          staking: {
            ...state.staking,
            tonBalance: state.staking.tonBalance + state.staking.pendingRewards,
            claimedRewards: state.staking.claimedRewards + state.staking.pendingRewards,
            pendingRewards: 0,
            stakingHistory: [...state.staking.stakingHistory, {
              id: Date.now(),
              type: 'claim_rewards',
              amount: state.staking.pendingRewards,
              timestamp: new Date()
            }]
          }
        };
      }),

      // Governance Management
      updateGovernance: (updates) => set((state) => ({
        governance: { ...state.governance, ...updates }
      })),

      submitProposal: (proposal) => set((state) => {
        if (state.governance.votingPower < 100) return state; // Minimum voting power required

        const newProposal = {
          ...proposal,
          id: Date.now(),
          submittedBy: state.player.id,
          submittedAt: new Date(),
          votesFor: 0,
          votesAgainst: 0,
          status: 'active'
        };

        return {
          governance: {
            ...state.governance,
            activeProposals: [...state.governance.activeProposals, newProposal],
            submittedProposals: [...state.governance.submittedProposals, newProposal.id]
          }
        };
      }),

      voteOnProposal: (proposalId, vote) => set((state) => {
        const proposal = state.governance.activeProposals.find(p => p.id === proposalId);
        if (!proposal || state.governance.votingPower <= 0) return state;

        // Check if already voted
        const alreadyVoted = state.governance.votingHistory.some(v => v.proposalId === proposalId);
        if (alreadyVoted) return state;

        const updatedProposals = state.governance.activeProposals.map(p => {
          if (p.id === proposalId) {
            return {
              ...p,
              [vote === 'for' ? 'votesFor' : 'votesAgainst']: p[vote === 'for' ? 'votesFor' : 'votesAgainst'] + state.governance.votingPower
            };
          }
          return p;
        });

        return {
          governance: {
            ...state.governance,
            activeProposals: updatedProposals,
            votingHistory: [...state.governance.votingHistory, {
              id: Date.now(),
              proposalId,
              vote,
              votingPower: state.governance.votingPower,
              timestamp: new Date()
            }]
          }
        };
      }),

      // Economics Management
      updateEconomics: (updates) => set((state) => ({
        economics: { ...state.economics, ...updates }
      })),

      // Advanced Economic Simulation Features

      // Daily Login Rewards (Play-to-Earn)
      claimDailyLoginReward: () => set((state) => {
        const lastLogin = new Date(state.player.lastLogin);
        const today = new Date();
        const timeDiff = today.getTime() - lastLogin.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

        if (daysDiff < 1) return state; // Already claimed today

        const reward = EconomicSimulator.calculateDailyLoginReward(state.businesses, state.staking);

        if (reward > 0) {
          return {
            player: {
              ...state.player,
              lastLogin: today
            },
            staking: {
              ...state.staking,
              tonBalance: state.staking.tonBalance + reward
            }
          };
        }

        return {
          player: {
            ...state.player,
            lastLogin: today
          }
        };
      }),

      // Achievement System with TON Rewards
      checkAndAwardAchievements: () => set((state) => {
        const newAchievements = [];
        let tonRewards = 0;

        // Check for various achievements
        if (state.businesses.length >= 1 && !state.achievements.some(a => a.id === 'FIRST_BUSINESS')) {
          newAchievements.push({
            id: 'FIRST_BUSINESS',
            ...ACHIEVEMENT_REWARDS.FIRST_BUSINESS,
            unlockedAt: new Date()
          });
          tonRewards += ACHIEVEMENT_REWARDS.FIRST_BUSINESS.ton_reward;
        }

        if (state.player.totalEarned >= 1000000 && !state.achievements.some(a => a.id === 'MILLIONAIRE')) {
          newAchievements.push({
            id: 'MILLIONAIRE',
            ...ACHIEVEMENT_REWARDS.MILLIONAIRE,
            unlockedAt: new Date()
          });
          tonRewards += ACHIEVEMENT_REWARDS.MILLIONAIRE.ton_reward;
        }

        if (state.businesses.length >= 10 && !state.achievements.some(a => a.id === 'BUSINESS_EMPIRE')) {
          newAchievements.push({
            id: 'BUSINESS_EMPIRE',
            ...ACHIEVEMENT_REWARDS.BUSINESS_EMPIRE,
            unlockedAt: new Date()
          });
          tonRewards += ACHIEVEMENT_REWARDS.BUSINESS_EMPIRE.ton_reward;
        }

        const totalStakingDays = Object.values(state.staking.stakingTenure).reduce((sum, days) => sum + days, 0);
        if (totalStakingDays >= 100 && !state.achievements.some(a => a.id === 'STAKING_VETERAN')) {
          newAchievements.push({
            id: 'STAKING_VETERAN',
            ...ACHIEVEMENT_REWARDS.STAKING_VETERAN,
            unlockedAt: new Date()
          });
          tonRewards += ACHIEVEMENT_REWARDS.STAKING_VETERAN.ton_reward;
        }

        if (newAchievements.length > 0) {
          return {
            achievements: [...state.achievements, ...newAchievements],
            staking: {
              ...state.staking,
              tonBalance: state.staking.tonBalance + tonRewards
            }
          };
        }

        return state;
      }),

      // Economic Class and Political Influence
      calculateEconomicStatus: () => set((state) => {
        const totalWealth = state.player.cash + state.player.totalEarned +
          state.businesses.reduce((sum, b) => sum + (b.value || 0), 0);

        const economicClass = EconomicSimulator.getEconomicClass(totalWealth);
        const politicalInfluence = EconomicSimulator.calculatePoliticalInfluence(
          economicClass.class,
          state.staking.totalStaked,
          state.achievements
        );

        return {
          economics: {
            ...state.economics,
            economicClass,
            politicalInfluence,
            totalWealth
          }
        };
      }),

      // Market Dynamics and Inflation
      processMonthlyEconomics: () => set((state) => {
        // Calculate current inflation rate
        const totalCommunityStaked = state.staking.totalStaked; // In multiplayer, this would be global
        const inflationRate = EconomicSimulator.calculateInflationRate(totalCommunityStaked);

        // Apply inflation to costs and prices
        const inflationMultiplier = 1 + inflationRate;

        // Update housing costs
        const updatedHousing = {
          ...state.housing,
          monthlyHousingCost: state.housing.monthlyHousingCost * inflationMultiplier
        };

        // Apply supply chain effects to businesses
        const updatedBusinesses = state.businesses.map(business => {
          const supplyChainImpact = EconomicSimulator.calculateSupplyChainImpact(
            business,
            state.economics.resourceInventory,
            {} // Global market data would go here
          );

          const baseIncome = business.monthlyIncome || 0;
          const adjustedIncome = baseIncome * supplyChainImpact * inflationMultiplier;

          return {
            ...business,
            monthlyIncome: adjustedIncome,
            supplyChainHealth: supplyChainImpact
          };
        });

        return {
          housing: updatedHousing,
          businesses: updatedBusinesses,
          economics: {
            ...state.economics,
            currentInflationRate: inflationRate,
            lastEconomicUpdate: new Date()
          }
        };
      }),

      // Economic Events System
      triggerEconomicEvent: (eventType) => set((state) => {
        const eventConfig = ECONOMIC_EVENTS[eventType];
        if (!eventConfig) return state;

        const processedEvent = EconomicSimulator.processEconomicEvent(eventConfig, state);

        // Apply immediate effects based on event type
        let stateChanges = {
          economics: {
            ...state.economics,
            activeEvents: [...state.economics.activeEvents, processedEvent]
          }
        };

        // Event-specific effects
        if (eventType === 'MARKET_CRASH') {
          const isStaker = state.staking.totalStaked > 0;
          const protection = isStaker ? processedEvent.effects.staker_protection : 0;
          const businessImpact = processedEvent.effects.business_income * (1 - protection);

          stateChanges.businesses = state.businesses.map(business => ({
            ...business,
            monthlyIncome: (business.monthlyIncome || 0) * (1 + businessImpact)
          }));
        }

        if (eventType === 'INNOVATION_BOOM') {
          const hasInnovationStake = state.staking.activeStakes.innovation_fund;
          if (hasInnovationStake) {
            const bonus = processedEvent.effects.innovation_fund_bonus;
            stateChanges.staking = {
              ...state.staking,
              pendingRewards: state.staking.pendingRewards + (hasInnovationStake.amount * bonus * 0.1)
            };
          } 
        }

        return { ...state, ...stateChanges };
