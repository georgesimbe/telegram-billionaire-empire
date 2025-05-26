import {
  STAKING_POOLS,
  STAKING_CALCULATIONS,
  calculateTotalDailyRewards,
  calculateTotalStaked
} from '../../config/stakingConfig.js';

export const createStakingStore = (set, get) => ({
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

  // Staking Actions
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

  // Process daily staking rewards
  processStakingRewards: (days) => set((state) => {
    const dailyRewards = calculateTotalDailyRewards(state.staking.activeStakes);
    const totalRewards = dailyRewards * days;

    // Update staking tenure
    const updatedTenure = { ...state.staking.stakingTenure };
    Object.keys(state.staking.activeStakes).forEach(poolId => {
      updatedTenure[poolId] = (updatedTenure[poolId] || 0) + days;
    });

    // Calculate voting power
    const votingPower = STAKING_CALCULATIONS.calculateVotingPower(
      state.staking.activeStakes,
      updatedTenure
    );

    return {
      staking: {
        ...state.staking,
        pendingRewards: state.staking.pendingRewards + totalRewards,
        stakingTenure: updatedTenure,
        votingPower
      },
      governance: {
        ...state.governance,
        votingPower
      }
    };
  }),

  // Get staking pool info
  getStakingPoolInfo: (poolId) => {
    const state = get();
    const pool = STAKING_POOLS[poolId.toUpperCase()];
    const activeStake = state.staking.activeStakes[poolId];

    if (!pool) return null;

    return {
      ...pool,
      userStake: activeStake?.amount || 0,
      userAPY: activeStake?.apy || pool.baseAPY,
      tenure: state.staking.stakingTenure[poolId] || 0,
      pendingRewards: activeStake ?
        STAKING_CALCULATIONS.calculatePendingRewards(activeStake, 1) : 0
    };
  },

  // Check if can unstake
  canUnstake: (poolId) => {
    const state = get();
    const stake = state.staking.activeStakes[poolId];
    if (!stake) return false;

    const pool = STAKING_POOLS[poolId.toUpperCase()];
    const lockEndDate = new Date(stake.startDate);
    lockEndDate.setDate(lockEndDate.getDate() + pool.lockPeriod);

    return new Date() >= lockEndDate;
  },

  // Get unstaking penalty
  getUnstakingPenalty: (poolId) => {
    const state = get();
    const stake = state.staking.activeStakes[poolId];
    if (!stake) return 0;

    const pool = STAKING_POOLS[poolId.toUpperCase()];
    const lockEndDate = new Date(stake.startDate);
    lockEndDate.setDate(lockEndDate.getDate() + pool.lockPeriod);
    const timeRemaining = Math.max(0, lockEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);

    return STAKING_CALCULATIONS.calculateUnstakingPenalty(poolId.toUpperCase(), timeRemaining);
  },
});
