import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GAME_CONFIG } from '../config/gameConfig.js';
import { INDUSTRIES_CONFIG, calculateBusinessCost, calculateBusinessIncome } from '../config/industriesConfig.js';
import { SECURITY_CONFIG, SecurityCalculator } from '../config/securityConfig.js';
import { antiCheatDetector } from '../utils/antiCheatDetector.js';

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

      // Game Progress
      dynasty: {
        tier: 'startup',
        legacyPoints: 0,
        traits: [],
        focus: null,
        generation: 'first_generation',
        age: 0,
        activeProjects: [],
        completedProjects: []
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

      // Time Management
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

      // Dynasty Management
      updateDynasty: (updates) => set((state) => ({
        dynasty: { ...state.dynasty, ...updates }
      })),

      addLegacyPoints: (amount) => set((state) => ({
        dynasty: {
          ...state.dynasty,
          legacyPoints: (state.dynasty.legacyPoints || 0) + amount
        }
      })),

      spendLegacyPoints: (amount) => set((state) => {
        if ((state.dynasty.legacyPoints || 0) >= amount) {
          return {
            dynasty: {
              ...state.dynasty,
              legacyPoints: (state.dynasty.legacyPoints || 0) - amount
            }
          };
        }
        return state;
      }),

      // Reset Game
      resetGame: () => set(() => ({
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
        },
        career: {
          currentJob: null,
          education: 'high_school',
          skills: [],
          workExperience: 0,
          jobApplications: [],
          certifications: [],
        },
        housing: {
          currentHousing: 'homeless',
          ownedProperties: [],
          mortgages: [],
          utilities: [],
          monthlyHousingCost: 0,
        },
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
        relationships: [],
        businesses: [],
        businessStats: {
          totalBusinesses: 0,
          monthlyBusinessIncome: 0,
          totalBusinessValue: 0,
        },

        // Dynasty Management
        dynasty: {
          tier: 'startup',
          legacyPoints: 0,
          traits: [],
          focus: null,
          generation: 'first_generation',
          age: 0,
          activeProjects: [],
          completedProjects: []
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
        gameTime: {
          currentDate: new Date(),
          daysPassed: 0,
          monthsPassed: 0,
          yearsPassed: 0,
        },
      })),
    }),
    {
      name: 'billionaire-empire-game',
      version: 2,
    }
  )
);

export default useGameStore;