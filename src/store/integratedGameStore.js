import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createPlayerStore,
  createBusinessStore,
  createBankingStore,
  createCareerStore,
  createHousingStore,
  createRelationshipsStore,
  createSecurityStore,
  createSettingsStore,
  createGameTimeStore,
  createAchievementsStore,
  createEconomicsStore,
  createGovernanceStore,
  createStakingStore
} from './modules/index.js';

/**
 * Integrated Game Store
 * Combines all store modules into a single, cohesive state management system
 */
const useIntegratedGameStore = create(
  persist(
    (set, get) => {
      // Create all store modules with shared set/get functions
      const playerStore = createPlayerStore(set, get);
      const businessStore = createBusinessStore(set, get);
      const bankingStore = createBankingStore(set, get);
      const careerStore = createCareerStore(set, get);
      const housingStore = createHousingStore(set, get);
      const relationshipsStore = createRelationshipsStore(set, get);
      const securityStore = createSecurityStore(set, get);
      const settingsStore = createSettingsStore(set, get);
      const gameTimeStore = createGameTimeStore(set, get);
      const achievementsStore = createAchievementsStore(set, get);
      const economicsStore = createEconomicsStore(set, get);
      const governanceStore = createGovernanceStore(set, get);
      const stakingStore = createStakingStore(set, get);

      return {
        // Combine all state from modules
        ...playerStore,
        ...businessStore,
        ...bankingStore,
        ...careerStore,
        ...housingStore,
        ...relationshipsStore,
        ...securityStore,
        ...settingsStore,
        ...gameTimeStore,
        ...achievementsStore,
        ...economicsStore,
        ...governanceStore,
        ...stakingStore,

        // Global game actions that coordinate between modules
        initializeGame: (playerData = {}) => {
          const state = get();

          // Initialize player
          state.initializePlayer(playerData);

          // Initialize security
          if (typeof window !== 'undefined') {
            const deviceData = {
              userAgent: navigator.userAgent,
              language: navigator.language,
              platform: navigator.platform,
              screenResolution: `${screen.width}x${screen.height}`,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
            state.initializeSecurity(deviceData);
          }

          // Reset daily actions if needed
          state.resetDailyActions();

          // Calculate initial economic status
          state.calculateEconomicStatus();

          // Check for achievements
          state.checkAndAwardAchievements();

          return { success: true, message: 'Game initialized successfully' };
        },

        // Save game state
        saveGame: () => {
          const state = get();
          const saveData = {
            player: state.player,
            businesses: state.businesses,
            banking: state.banking,
            career: state.career,
            housing: state.housing,
            relationships: state.relationships,
            staking: state.staking,
            governance: state.governance,
            economics: state.economics,
            achievements: state.achievements,
            gameTime: state.gameTime,
            settings: state.settings,
            savedAt: new Date()
          };

          // In a real implementation, this would save to a backend
          localStorage.setItem('billionaire-sim-save', JSON.stringify(saveData));

          return { success: true, message: 'Game saved successfully' };
        },

        // Load game state
        loadGame: () => {
          try {
            const saveData = localStorage.getItem('billionaire-sim-save');
            if (!saveData) {
              return { success: false, message: 'No save data found' };
            }

            const parsedData = JSON.parse(saveData);

            // Update all relevant state
            set((state) => ({
              ...state,
              ...parsedData,
              loadedAt: new Date()
            }));

            return { success: true, message: 'Game loaded successfully' };
          } catch (error) {
            return { success: false, message: `Failed to load game: ${error.message}` };
          }
        },

        // Reset entire game
        resetGame: () => {
          // Clear localStorage
          localStorage.removeItem('billionaire-sim-save');

          // Reset to initial state
          set((state) => {
            const initialState = useIntegratedGameStore.getState();
            return {
              ...initialState,
              player: {
                ...initialState.player,
                initialized: false,
                cash: 5000,
                totalEarned: 0,
                level: 1,
                experience: 0
              },
              businesses: [],
              banking: {
                ...initialState.banking,
                accounts: [
                  {
                    id: 1,
                    type: 'checking',
                    balance: 5000,
                    interestRate: 0.001,
                    accountNumber: 'CHK-001',
                    openedDate: new Date(),
                    monthlyFee: 0
                  }
                ],
                loans: [],
                creditCards: [],
                investments: []
              },
              achievements: [],
              gameTime: {
                ...initialState.gameTime,
                currentDate: new Date(),
                daysPassed: 0,
                monthsPassed: 0,
                yearsPassed: 0
              }
            };
          });

          return { success: true, message: 'Game reset successfully' };
        },

        // Get comprehensive game status
        getGameStatus: () => {
          const state = get();

          return {
            player: state.getPlayerStatus(),
            financial: state.getPlayerFinancialSummary(),
            business: state.getBusinessSummary(),
            economic: state.getEconomicStats(),
            time: state.getTimeStats(),
            achievements: {
              total: state.achievements.length,
              recent: state.achievements.slice(-5)
            },
            staking: {
              totalStaked: state.staking.totalStaked,
              pendingRewards: state.staking.pendingRewards,
              votingPower: state.staking.votingPower
            }
          };
        },

        // Process end of day/month cycles
        processGameCycle: (type = 'daily') => {
          const state = get();

          if (type === 'daily') {
            // Advance time by 1 day
            const timeResult = state.advanceTime(1);

            // Process daily events
            state.processDailyEvents();

            // Update player stats
            state.processDailyStatChanges();

            // Check achievements
            state.checkAndAwardAchievements();

            return {
              success: true,
              type: 'daily',
              timeResult,
              message: 'Daily cycle processed'
            };
          } else if (type === 'monthly') {
            // Process monthly economics
            state.processMonthlyEconomics();

            // Process monthly events
            state.processMonthlyEvents();

            return {
              success: true,
              type: 'monthly',
              message: 'Monthly cycle processed'
            };
          }

          return { success: false, message: 'Invalid cycle type' };
        },

        // Emergency actions
        emergencyReset: () => {
          // Clear all localStorage
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('billionaire-sim')) {
              localStorage.removeItem(key);
            }
          });

          // Force reload
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }
      };
    },
    {
      name: 'billionaire-sim-storage',
      version: 2,
      // Only persist essential data
      partialize: (state) => ({
        player: state.player,
        businesses: state.businesses,
        banking: state.banking,
        career: state.career,
        housing: state.housing,
        relationships: state.relationships,
        staking: state.staking,
        governance: state.governance,
        economics: state.economics,
        achievements: state.achievements,
        gameTime: state.gameTime,
        settings: state.settings
      }),
      // Handle version migrations
      migrate: (persistedState, version) => {
        if (version < 2) {
          // Migration logic for version 2
          return {
            ...persistedState,
            // Add any new required fields
          };
        }
        return persistedState;
      }
    }
  )
);

export default useIntegratedGameStore; 