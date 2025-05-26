# Telegram Billionaire Simulator - Store System

## Overview

The game uses a modular store architecture built with Zustand for state management. The store is divided into specialized modules that handle different aspects of the game, all integrated into a single cohesive store.

## Store Architecture

### Main Store

- **`integratedGameStore.js`** - The main store that combines all modules
- **`gameStore.js`** - Legacy store (deprecated, use integratedGameStore instead)

### Store Modules

#### Core Modules

1. **`playerStore.js`** - Player stats, progression, and financial operations
2. **`businessStore.js`** - Business ownership, operations, and empire management
3. **`bankingStore.js`** - Bank accounts, loans, credit cards, and investments
4. **`careerStore.js`** - Jobs, education, skills, and career progression

#### Lifestyle Modules

5. **`housingStore.js`** - Housing, real estate, and property management
6. **`relationshipsStore.js`** - Social connections and relationship management

#### Economic Modules

7. **`stakingStore.js`** - TON staking, rewards, and DeFi features
8. **`governanceStore.js`** - Community governance and voting
9. **`economicsStore.js`** - Economic simulation and market dynamics

#### System Modules

10. **`gameTimeStore.js`** - Time progression and event scheduling
11. **`achievementsStore.js`** - Achievement system and rewards
12. **`securityStore.js`** - Anti-cheat and security monitoring
13. **`settingsStore.js`** - User preferences and game settings

## Usage

### Basic Usage

```javascript
import useIntegratedGameStore from './store/integratedGameStore.js';

// In a React component
const MyComponent = () => {
  const { 
    player, 
    addIncome, 
    spendMoney, 
    getGameStatus 
  } = useIntegratedGameStore();

  const handleEarnMoney = () => {
    addIncome(1000, 'job');
  };

  return (
    <div>
      <p>Cash: ${player.cash}</p>
      <button onClick={handleEarnMoney}>Earn Money</button>
    </div>
  );
};
```

### Selective State Subscription

```javascript
// Only subscribe to specific state changes
const cash = useIntegratedGameStore(state => state.player.cash);
const businesses = useIntegratedGameStore(state => state.businesses);
```

### Actions and Methods

```javascript
const {
  // Player actions
  addIncome,
  spendMoney,
  updatePlayer,
  
  // Business actions
  addBusiness,
  upgradeBusiness,
  sellBusiness,
  
  // Banking actions
  openAccount,
  depositMoney,
  applyForLoan,
  
  // Game management
  initializeGame,
  saveGame,
  loadGame,
  resetGame,
  processGameCycle
} = useIntegratedGameStore();
```

## Store Module Details

### Player Store

**State:**

- `player` - Core player data (cash, stats, level, experience)

**Key Methods:**

- `addIncome(amount, source)` - Add money to player
- `spendMoney(amount, category)` - Spend player money
- `updatePlayerStats(changes)` - Update happiness, health, energy, stress
- `getPlayerStatus()` - Get comprehensive player info
- `getPlayerFinancialSummary()` - Get financial overview

### Business Store

**State:**

- `businesses` - Array of owned businesses
- `businessStats` - Aggregate business statistics

**Key Methods:**

- `addBusiness(type, name)` - Purchase a new business
- `upgradeBusiness(id, upgradeType)` - Upgrade existing business
- `sellBusiness(id)` - Sell a business
- `getBusinessSummary()` - Get business overview
- `negotiateSupplyChainDeal(id, dealType)` - Make supply chain deals

### Banking Store

**State:**

- `banking` - Bank accounts, loans, credit cards, investments

**Key Methods:**

- `openAccount(type, deposit)` - Open new bank account
- `depositMoney(accountId, amount)` - Deposit to account
- `withdrawMoney(accountId, amount)` - Withdraw from account
- `applyForLoan(type, amount, purpose)` - Apply for loans
- `applyCreditCard(type)` - Apply for credit cards

### Staking Store

**State:**

- `staking` - TON balance, active stakes, rewards, voting power

**Key Methods:**

- `stakeTokens(poolId, amount)` - Stake TON tokens
- `unstakeTokens(poolId, amount)` - Unstake tokens
- `claimStakingRewards()` - Claim pending rewards
- `getStakingPoolInfo(poolId)` - Get pool information

### Game Time Store

**State:**

- `gameTime` - Current date, days passed, time settings

**Key Methods:**

- `advanceTime(days)` - Progress game time
- `processDailyEvents()` - Handle daily events
- `processMonthlyEvents()` - Handle monthly events
- `getTimeStats()` - Get time information

## Global Game Actions

### Game Lifecycle

```javascript
// Initialize new game
const result = initializeGame({ username: 'Player' });

// Save current state
const saveResult = saveGame();

// Load saved state
const loadResult = loadGame();

// Reset everything
const resetResult = resetGame();
```

### Game Status

```javascript
const status = getGameStatus();
// Returns:
// {
//   player: { level, experience, stats... },
//   financial: { cash, netWorth, income... },
//   business: { totalBusinesses, value... },
//   economic: { class, influence... },
//   time: { currentDate, daysPassed... },
//   achievements: { total, recent... },
//   staking: { totalStaked, rewards... }
// }
```

### Game Cycles

```javascript
// Process daily cycle
const dailyResult = processGameCycle('daily');

// Process monthly cycle
const monthlyResult = processGameCycle('monthly');
```

## Data Persistence

The store automatically persists data using Zustand's persist middleware:

- **Storage Key:** `billionaire-sim-storage`
- **Version:** 2 (with migration support)
- **Persisted Data:** All game state except temporary/security data

### Manual Save/Load

```javascript
// Manual save to localStorage
saveGame();

// Manual load from localStorage
loadGame();
```

## Testing

Use the test utility to verify store integration:

```javascript
import { testStoreIntegration } from './store/testIntegratedStore.js';

// Run tests
const success = testStoreIntegration();
```

## Migration and Versioning

The store supports version migrations for backward compatibility:

```javascript
// Version 2 migration example
migrate: (persistedState, version) => {
  if (version < 2) {
    return {
      ...persistedState,
      // Add new required fields
      newFeature: defaultValue
    };
  }
  return persistedState;
}
```

## Best Practices

1. **Use Selective Subscriptions** - Only subscribe to state you need
2. **Batch Updates** - Group related state changes together
3. **Immutable Updates** - Always return new objects/arrays
4. **Error Handling** - Check return values from actions
5. **Type Safety** - Use TypeScript for better development experience

## Debugging

Enable debug mode in settings:

```javascript
updateSettings({ debugMode: true });
```

This will:

- Log all state changes
- Show performance metrics
- Enable additional debugging tools

## Performance Considerations

- Store modules are lazy-loaded
- State is normalized to prevent deep nesting
- Computed values are memoized
- Large arrays use pagination
- Persistence is throttled to prevent excessive writes

## Security Features

The security store monitors for:

- Unusual clicking patterns
- Developer tools usage
- Automated behavior
- State manipulation attempts

Security violations can result in temporary restrictions or account flags.
