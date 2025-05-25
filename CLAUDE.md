# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Telegram Billionaire Empire** is a Telegram Mini App that gamifies business empire building with real TON cryptocurrency rewards. Players tap to earn points, build businesses, invest in assets, and convert virtual earnings into actual TON tokens.

## Development Commands

### Frontend Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server (Vite)
npm run build       # Build for production
npm run preview     # Preview production build
```

### Backend Development
```bash
cd server
npm install         # Install server dependencies
npm run dev         # Start development server with nodemon
npm start          # Start production server
```

### Smart Contract Deployment
```bash
func -o contracts/GameWallet.boc contracts/GameWallet.fc
node scripts/deploy-contracts.js
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **State**: Zustand with persistence
- **Backend**: Node.js + Express + MongoDB + Redis
- **Blockchain**: TON Network with FunC smart contracts
- **Telegram**: Mini Apps SDK + Bot API integration

### Key Architectural Patterns

#### State Management (Zustand)
- `gameStore.js`: Core game state, points, businesses, levels
- `societyStore.js`: Guild/clan mechanics, governance, warfare
- All state changes go through anti-cheat validation

#### Anti-Cheat System (Multi-Layer)
- **Client**: `AntiCheatWrapper.jsx` monitors user behavior, click rates, DevTools
- **Server**: `antiCheat.js` middleware validates all actions with Redis tracking
- **Patterns**: Rate limiting, temporal analysis, game state validation

#### Economic Model
- 10,000 points = 1 TON with 5% withdrawal fee
- Daily limits: ads (20), trades (100), upgrades (50)
- Minimum withdrawal: 50,000 points

### Core Game Mechanics

#### Business Empire System
- 8-tier progression from lemonade stands to space stations
- Each tier unlocked by level requirements
- Exponential cost scaling with idle income generation

#### Society System (Advanced Social Features)
- Telegram group integration with bot validation
- Proposal-based governance and voting
- Tax collection and treasury management
- Inter-society warfare and trade agreements

#### Investment System
- Real estate: `realEstateService.js` handles property trading
- Stocks and crypto with market simulation
- Portfolio management with risk/reward mechanics

## Security Considerations

### Environment Requirements
- MongoDB connection string
- Redis for rate limiting and session management
- Telegram Bot Token from @BotFather
- TON wallet mnemonic for contract deployment
- HTTPS domain for production (required by Telegram)

### Anti-Cheat Implementation
Every user action flows through:
1. Client-side behavior monitoring
2. Server-side rate limiting and pattern analysis  
3. Redis-based action tracking
4. Automatic banning for detected cheating

### Production Security
- JWT authentication for API endpoints
- Telegram WebApp data validation
- CORS, Helmet, and rate limiting middleware
- Smart contract validation for all TON withdrawals

## Data Flow

1. User action in React component
2. Zustand state update with client-side validation
3. API call with Telegram authentication
4. Anti-cheat middleware validation
5. Business logic execution
6. Database persistence
7. State synchronization

## Configuration Files

- `gameConfig.js`: Core game balance, costs, rewards
- `businessMaterials.js`: Business tier definitions
- `societyConfig.js`: Guild mechanics and governance rules
- `gachaConfig.js`: Reward box probabilities
- `lifestyleConfig.js`: Luxury purchases and VIP benefits

## Development Notes

### Local Development Setup
1. Install MongoDB and Redis locally
2. Create `.env` files with Telegram Bot token and database URLs
3. Deploy smart contracts to TON testnet for development
4. Use ngrok or similar for HTTPS tunnel (Telegram requirement)

### Testing Considerations
- Anti-cheat system requires careful testing of rate limits
- Society features need multiple test accounts
- TON integration requires testnet tokens for testing
- Telegram Mini App testing requires real Telegram environment

### Performance Considerations
- Redis caching for frequently accessed game data
- MongoDB indexing on user ID and action timestamps
- Debounced state updates for rapid user actions
- Lazy loading for business and investment components