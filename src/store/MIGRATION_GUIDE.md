# Migration Guide: gameStore → integratedGameStore

## Overview

This guide helps you migrate from the legacy `gameStore.js` to the new modular `integratedGameStore.js`.

## Key Changes

### 1. Import Statement

```javascript
// OLD
import useGameStore from './store/gameStore.js';

// NEW
import useIntegratedGameStore from './store/integratedGameStore.js';
```

### 2. Store Structure

The new store maintains the same state structure but with better organization:

```javascript
// Both old and new have the same state properties
const { player, businesses, banking, career, housing } = useIntegratedGameStore();
```

### 3. Method Names

Most methods remain the same, but some have been improved:

#### Unchanged Methods

- `addIncome(amount, source)`
- `spendMoney(amount, category)`
- `addBusiness(type, name)`
- `updatePlayer(updates)`
- `stakeTokens(poolId, amount)`
- `unstakeTokens(poolId, amount)`

#### New/Improved Methods

```javascript
// NEW: Comprehensive game initialization
initializeGame({ username: 'Player' });

// NEW: Better game status
const status = getGameStatus();

// NEW: Unified game cycles
processGameCycle('daily');
processGameCycle('monthly');

// NEW: Enhanced business summary
const businessSummary = getBusinessSummary();
```

## Component Migration Examples

### Basic Component

```javascript
// OLD
import useGameStore from './store/gameStore.js';

const PlayerStats = () => {
  const { player, addIncome } = useGameStore();
  
  return (
    <div>
      <p>Cash: ${player.cash}</p>
      <button onClick={() => addIncome(100)}>Earn Money</button>
    </div>
  );
};

// NEW (no changes needed!)
import useIntegratedGameStore from './store/integratedGameStore.js';

const PlayerStats = () => {
  const { player, addIncome } = useIntegratedGameStore();
  
  return (
    <div>
      <p>Cash: ${player.cash}</p>
      <button onClick={() => addIncome(100)}>Earn Money</button>
    </div>
  );
};
```

### Business Component

```javascript
// OLD
const BusinessDashboard = () => {
  const { businesses, businessStats } = useGameStore();
  
  // Manual calculation
  const totalValue = businesses.reduce((sum, b) => sum + b.value, 0);
  
  return <div>Total Value: ${totalValue}</div>;
};

// NEW (use built-in summary)
const BusinessDashboard = () => {
  const { getBusinessSummary } = useIntegratedGameStore();
  
  const summary = getBusinessSummary();
  
  return <div>Total Value: ${summary.totalValue}</div>;
};
```

### Game Initialization

```javascript
// OLD
const GameSetup = () => {
  const { 
    initializePlayer, 
    initializeSecurity, 
    resetDailyActions 
  } = useGameStore();
  
  const startGame = () => {
    initializePlayer({ username: 'Player' });
    initializeSecurity(deviceData);
    resetDailyActions();
  };
  
  return <button onClick={startGame}>Start Game</button>;
};

// NEW (simplified)
const GameSetup = () => {
  const { initializeGame } = useIntegratedGameStore();
  
  const startGame = () => {
    initializeGame({ username: 'Player' });
  };
  
  return <button onClick={startGame}>Start Game</button>;
};
```

## Breaking Changes

### 1. Removed Methods

These methods were consolidated or renamed:

```javascript
// REMOVED: Use initializeGame() instead
// initializePlayer()
// initializeSecurity()

// REMOVED: Use processGameCycle() instead
// processDailyEvents()
// processMonthlyEvents()
```

### 2. State Structure Changes

Minor changes to nested state:

```javascript
// OLD: Some inconsistent nesting
state.businessStats.monthlyBusinessIncome

// NEW: Consistent structure maintained
state.businessStats.monthlyBusinessIncome // Same!
```

## Step-by-Step Migration

### Step 1: Update Imports

Replace all `gameStore` imports with `integratedGameStore`:

```bash
# Find and replace in your editor
find: import.*gameStore
replace: import useIntegratedGameStore from './store/integratedGameStore.js'
```

### Step 2: Update Hook Usage

```javascript
// Change the hook name
const store = useIntegratedGameStore();
```

### Step 3: Update Initialization Code

```javascript
// Replace manual initialization
const initGame = () => {
  initializeGame({ username: playerName });
};
```

### Step 4: Use New Summary Methods

```javascript
// Replace manual calculations with built-in summaries
const businessSummary = getBusinessSummary();
const playerStatus = getPlayerStatus();
const gameStatus = getGameStatus();
```

### Step 5: Test Everything

```javascript
import { testStoreIntegration } from './store/testIntegratedStore.js';

// Run in console or component
testStoreIntegration();
```

## Benefits of Migration

### 1. Better Performance

- Modular architecture reduces bundle size
- Selective subscriptions prevent unnecessary re-renders
- Optimized state updates

### 2. Improved Developer Experience

- Better TypeScript support
- Clearer method organization
- Comprehensive documentation

### 3. Enhanced Features

- Unified game lifecycle management
- Better error handling
- Improved persistence
- Advanced debugging tools

### 4. Future-Proof

- Easier to add new features
- Better testing capabilities
- Modular updates possible

## Troubleshooting

### Common Issues

#### 1. Import Errors

```javascript
// Make sure the path is correct
import useIntegratedGameStore from './store/integratedGameStore.js';
```

#### 2. Missing Methods

```javascript
// Check if method was renamed or consolidated
// Old: processDailyEvents()
// New: processGameCycle('daily')
```

#### 3. State Not Updating

```javascript
// Ensure you're using the store correctly
const { player, addIncome } = useIntegratedGameStore();

// Not: const store = useIntegratedGameStore(); store.addIncome()
```

#### 4. Persistence Issues

```javascript
// Clear old storage if needed
localStorage.removeItem('game-storage'); // Old key
// New key: 'billionaire-sim-storage'
```

## Testing Your Migration

### 1. Basic Functionality Test

```javascript
const TestComponent = () => {
  const { player, addIncome, getGameStatus } = useIntegratedGameStore();
  
  const test = () => {
    console.log('Initial cash:', player.cash);
    addIncome(1000);
    console.log('After income:', player.cash);
    console.log('Game status:', getGameStatus());
  };
  
  return <button onClick={test}>Test Store</button>;
};
```

### 2. Full Integration Test

```javascript
import { testStoreIntegration } from './store/testIntegratedStore.js';

// Run this in your app initialization
useEffect(() => {
  testStoreIntegration();
}, []);
```

## Need Help?

If you encounter issues during migration:

1. Check the console for error messages
2. Verify all imports are correct
3. Run the integration test
4. Check the store documentation
5. Compare with the examples in this guide

The new integrated store is designed to be backward compatible, so most existing code should work with minimal changes.
