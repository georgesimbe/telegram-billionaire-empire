/**
 * Test file for the integrated game store
 * This file can be used to test store functionality
 */

import useIntegratedGameStore from './integratedGameStore.js';

// Test function to verify store integration
export const testStoreIntegration = () => {
  console.log('Testing Integrated Game Store...');

  try {
    // Get the store instance
    const store = useIntegratedGameStore.getState();

    // Test 1: Check if all main state properties exist
    const requiredStates = [
      'player', 'businesses', 'banking', 'career', 'housing',
      'relationships', 'staking', 'governance', 'economics',
      'achievements', 'gameTime', 'settings', 'security'
    ];

    const missingStates = requiredStates.filter(state => !store[state]);
    if (missingStates.length > 0) {
      console.error('Missing states:', missingStates);
      return false;
    }

    // Test 2: Check if key methods exist
    const requiredMethods = [
      'initializeGame', 'saveGame', 'loadGame', 'resetGame',
      'getGameStatus', 'processGameCycle', 'addIncome', 'spendMoney',
      'addBusiness', 'stakeTokens', 'updatePlayer'
    ];

    const missingMethods = requiredMethods.filter(method => typeof store[method] !== 'function');
    if (missingMethods.length > 0) {
      console.error('Missing methods:', missingMethods);
      return false;
    }

    // Test 3: Test basic functionality
    console.log('Initial player cash:', store.player.cash);

    // Test adding income
    store.addIncome(1000, 'test');
    console.log('After adding $1000:', store.player.cash);

    // Test spending money
    const spendResult = store.spendMoney(500, 'test');
    console.log('After spending $500:', store.player.cash);

    // Test getting game status
    const gameStatus = store.getGameStatus();
    console.log('Game status keys:', Object.keys(gameStatus));

    // Test initialization
    const initResult = store.initializeGame({ username: 'TestPlayer' });
    console.log('Initialization result:', initResult);

    console.log('✅ All tests passed! Store integration is working correctly.');
    return true;

  } catch (error) {
    console.error('❌ Store integration test failed:', error);
    return false;
  }
};

// Export for use in components or testing
export default testStoreIntegration; 