import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GAME_CONFIG } from '../config/gameConfig.js';
import { INDUSTRIES_CONFIG, calculateBusinessCost, calculateBusinessIncome } from '../config/industriesConfig.js';
import { SECURITY_CONFIG, SecurityCalculator } from '../config/securityConfig.js';
import { antiCheatDetector } from '../utils/antiCheatDetector.js';

const useGameStore = create(
  persist(
    (set, get) => ({
      // Player data
      player: {
        id: null,
        username: null,
        points: GAME_CONFIG.STARTING_POINTS,
        level: 1,
        xp: 0,
        totalEarned: 0,
        lastActive: Date.now(),
        accountCreated: Date.now(),
        premiumTier: null,
        societyTier: 'NONE'
      },

      // Businesses owned by player
      businesses: {},

      // Security and anti-cheat
      securityMetrics: {
        deviceFingerprint: null,
        violations: [],
        riskScore: 0,
        lastSecurityCheck: Date.now()
      },

      // Daily limits tracking
      dailyActions: {
        adWatches: 0,
        trades: 0,
        businessClaims: 0,
        lastReset: Date.now()
      },

      // Action logging for security
      actionLog: [],

      // === CORE GAME ACTIONS ===

      addPoints: (amount) => {
        set((state) => ({
          player: {
            ...state.player,
            points: state.player.points + amount,
            totalEarned: state.player.totalEarned + amount,
            lastActive: Date.now()
          }
        }));
      },

      spendPoints: (amount) => {
        const state = get();
        if (state.player.points >= amount) {
          set((state) => ({
            player: {
              ...state.player,
              points: state.player.points - amount,
              lastActive: Date.now()
            }
          }));
          return true;
        }
        return false;
      },

      // === BUSINESS MANAGEMENT ===

      buyBusiness: (businessId) => {
        const state = get();
        const business = INDUSTRIES_CONFIG[businessId];
        if (!business) return false;

        const currentLevel = state.businesses[businessId] || 0;
        const cost = calculateBusinessCost(business, currentLevel);

        if (state.player.points >= cost) {
          set((state) => ({
            player: {
              ...state.player,
              points: state.player.points - cost,
              lastActive: Date.now()
            },
            businesses: {
              ...state.businesses,
              [businessId]: currentLevel + 1
            }
          }));

          // Add XP for business purchase
          get().addXP(10);
          return true;
        }
        return false;
      },

      // Calculate total passive income
      calculatePassiveIncome: () => {
        const state = get();
        let totalIncome = 0;

        Object.entries(state.businesses).forEach(([businessId, level]) => {
          if (level > 0) {
            const business = INDUSTRIES_CONFIG[businessId];
            if (business) {
              totalIncome += calculateBusinessIncome(business, level - 1);
            }
          }
        });

        return totalIncome;
      },

      // Collect passive income
      collectPassiveIncome: () => {
        const state = get();
        const now = Date.now();
        const timeDiff = now - state.player.lastActive;
        const hoursOffline = timeDiff / (1000 * 60 * 60);

        if (hoursOffline > 0.1) { // Minimum 6 minutes offline
          const hourlyIncome = state.calculatePassiveIncome();
          const offlineEarnings = Math.floor(hourlyIncome * Math.min(hoursOffline, 24)); // Max 24 hours

          if (offlineEarnings > 0) {
            state.addPoints(offlineEarnings);
            return offlineEarnings;
          }
        }
        return 0;
      },

      // === LEVEL SYSTEM ===

      addXP: (amount) => {
        const state = get();
        const newXP = state.player.xp + amount;
        const xpForNextLevel = GAME_CONFIG.XP_PER_LEVEL * state.player.level;

        if (newXP >= xpForNextLevel) {
          set((state) => ({
            player: {
              ...state.player,
              xp: newXP - xpForNextLevel,
              level: state.player.level + 1
            }
          }));
        } else {
          set((state) => ({
            player: {
              ...state.player,
              xp: newXP
            }
          }));
        }
      },

      // === SECURITY SYSTEM ===

      initializeSecurity: async (deviceData) => {
        await antiCheatDetector.initialize();

        set((state) => ({
          securityMetrics: {
            ...state.securityMetrics,
            deviceFingerprint: antiCheatDetector.deviceFingerprint,
            lastSecurityCheck: Date.now()
          }
        }));
      },

      logAction: (actionType, metadata = {}) => {
        const state = get();
        const now = Date.now();

        // Basic rate limiting
        if (!antiCheatDetector.checkClickRate()) {
          return { allowed: false, reason: 'Rate limit exceeded' };
        }

        // Check daily limits
        const dailyLimit = SecurityCalculator.calculateDailyLimit(
          SECURITY_CONFIG.RATE_LIMITS.DAILY_ACTIONS[actionType] || 1000,
          state.player.level,
          state.player.societyTier
        );

        const currentCount = state.dailyActions[actionType.toLowerCase()] || 0;
        if (currentCount >= dailyLimit) {
          return { allowed: false, reason: 'Daily limit reached' };
        }

        // Log the action
        const logEntry = {
          type: actionType,
          timestamp: now,
          metadata,
          playerId: state.player.id
        };

        set((state) => ({
          actionLog: [...state.actionLog.slice(-99), logEntry], // Keep last 100 actions
          securityMetrics: {
            ...state.securityMetrics,
            riskScore: antiCheatDetector.getRiskScore()
          }
        }));

        return { allowed: true };
      },

      // === DAILY LIMITS ===

      checkDailyLimits: (actionType) => {
        const state = get();
        const limit = SecurityCalculator.calculateDailyLimit(
          SECURITY_CONFIG.RATE_LIMITS.DAILY_ACTIONS[actionType] || 1000,
          state.player.level,
          state.player.societyTier
        );

        const currentCount = state.dailyActions[actionType.toLowerCase()] || 0;

        return {
          allowed: currentCount < limit,
          current: currentCount,
          limit,
          remaining: Math.max(0, limit - currentCount)
        };
      },

      resetDailyActions: () => {
        const now = Date.now();
        const state = get();
        const lastReset = state.dailyActions.lastReset;
        const daysPassed = (now - lastReset) / (1000 * 60 * 60 * 24);

        if (daysPassed >= 1) {
          set((state) => ({
            dailyActions: {
              adWatches: 0,
              trades: 0,
              businessClaims: 0,
              lastReset: now
            }
          }));
        }
      },

      // === UTILITY FUNCTIONS ===

      initializePlayer: (userData) => {
        set((state) => ({
          player: {
            ...state.player,
            id: userData.id,
            username: userData.username,
            lastActive: Date.now()
          }
        }));
      },

      setPlayer: (playerData) => {
        set((state) => ({
          player: {
            ...state.player,
            ...playerData,
            lastActive: Date.now()
          }
        }));
      },

      earnPoints: (amount) => {
        set((state) => ({
          player: {
            ...state.player,
            points: state.player.points + amount,
            totalEarned: state.player.totalEarned + amount,
            lastActive: Date.now()
          }
        }));
      },

      // Get security status
      getSecurityStatus: () => {
        const state = get();
        return {
          riskScore: state.securityMetrics.riskScore,
          violations: state.securityMetrics.violations.length,
          shouldBan: antiCheatDetector.shouldBan(),
          deviceFingerprint: state.securityMetrics.deviceFingerprint
        };
      },

      // Reset security (for testing)
      resetSecurity: () => {
        antiCheatDetector.reset();
        set((state) => ({
          securityMetrics: {
            ...state.securityMetrics,
            violations: [],
            riskScore: 0
          }
        }));
      }
    }),
    {
      name: 'telegram-billionaire-game',
      version: 2 // Increment version for migration
    }
  )
);

export default useGameStore;