import axios from 'axios';

// Configure base URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add Telegram init data
api.interceptors.request.use(
  (config) => {
    // Get Telegram init data from window.Telegram
    if (window.Telegram?.WebApp?.initData) {
      config.headers['x-telegram-init-data'] = window.Telegram.WebApp.initData;
    } else {
      // Development mode - use test data
      config.headers['x-telegram-init-data'] = 'test';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.warn('Authentication failed');
      // Could trigger logout or re-authentication
    }

    return Promise.reject(error);
  }
);

// Game API functions
export const gameApi = {
  // Get user profile and game state
  getProfile: () => api.get('/game/profile'),

  // Tap action
  tap: (taps = 1) => api.post('/game/tap', { taps }),

  // Business operations
  purchaseBusiness: (businessId) => api.post('/game/business/purchase', { businessId }),
  upgradeBusiness: (businessId) => api.post('/game/business/upgrade', { businessId }),
  collectEarnings: () => api.post('/game/business/collect'),

  // Leaderboard
  getLeaderboard: (type = 'points', limit = 100) =>
    api.get('/game/leaderboard', { params: { type, limit } })
};

// Wallet API functions
export const walletApi = {
  // Connect TON wallet
  connect: (address, proof = null) => api.post('/wallet/connect', { address, proof }),

  // Disconnect wallet
  disconnect: () => api.post('/wallet/disconnect'),

  // Get withdrawal information
  getWithdrawalInfo: () => api.get('/wallet/withdrawal-info'),

  // Request withdrawal
  withdraw: (pointsToWithdraw) => api.post('/wallet/withdraw', { pointsToWithdraw }),

  // Get withdrawal history
  getHistory: () => api.get('/wallet/history'),

  // Verify transaction
  verifyTransaction: (hash) => api.get(`/wallet/verify/${hash}`)
};

// Social API functions
export const socialApi = {
  // Get referral information
  getReferral: () => api.get('/social/referral'),

  // Apply referral code
  applyReferral: (referralCode) => api.post('/social/referral/apply', { referralCode }),

  // Get social stats
  getStats: () => api.get('/social/stats'),

  // Share achievement
  shareAchievement: (achievementId, platform) =>
    api.post('/social/share', { achievementId, platform }),

  // Get friends list
  getFriends: () => api.get('/social/friends')
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return error.message || 'An unexpected error occurred';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!window.Telegram?.WebApp?.initData;
  },

  // Format points for display
  formatPoints: (points) => {
    if (points >= 1000000) {
      return `${(points / 1000000).toFixed(1)}M`;
    }
    if (points >= 1000) {
      return `${(points / 1000).toFixed(1)}K`;
    }
    return points.toString();
  }
};

export default api; 