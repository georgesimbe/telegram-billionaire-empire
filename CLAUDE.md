# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Telegram Billionaire Simulation** is a sophisticated economic simulation game built as a Telegram Mini App. Players build business empires while managing careers, housing, banking, and relationships - progressing from working class to ultra-rich status with complex economic mechanics.

## Development Commands

### Setup and Installation

```bash
# Install all dependencies
npm install && cd server && npm install && cd ..

# Environment setup
cp server/env.example server/.env
# Configure Supabase, Redis, and Telegram Bot credentials

# Start local development
npm run dev:all  # Concurrent: services + backend + frontend
```

### Individual Services

```bash
# Frontend (React + Vite, port 5173)
npm run dev
npm run build
npm run preview

# Backend (Node.js + Express, port 3000)
cd server
npm run dev      # Development with nodemon
npm start        # Production server

# Database
supabase start   # Local Supabase instance
supabase db reset --db-url postgresql://... # Reset with migrations
```

### Testing

```bash
# Frontend testing
npm run test           # Vitest unit tests
npm run test:watch     # Watch mode
npm run test:e2e       # Playwright E2E tests

# Backend testing
cd server
npm test              # Jest unit tests
npm run test:watch    # Watch mode

# Full test suite
npm run test:all      # Runs all tests across frontend/backend
```

### Code Quality

```bash
# Linting and formatting
npm run lint          # ESLint check
npm run lint:fix      # Auto-fix linting issues

# Type checking (if applicable)
npm run type-check    # Check TypeScript types
```

## Architecture Overview

### Technology Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Zustand + Framer Motion
- **Backend**: Node.js + Express + Supabase (PostgreSQL) + Redis + Winston
- **Integration**: Telegram Web App SDK + TON Connect for crypto wallet
- **Testing**: Vitest (frontend) + Jest (backend) + Playwright (E2E)

### Core Application Structure

```text
src/
├── components/          # Domain-organized React components
│   ├── ui/             # Reusable UI primitives (Button, Card, etc.)
│   ├── business/       # Business management components
│   ├── career/         # Career/education components
│   ├── economy/        # Economic dashboard components
│   └── layout/         # Navigation and layout components
├── pages/              # Main application pages
├── config/             # Game configuration by domain
│   ├── core/           # Core game mechanics and constants
│   ├── business/       # Business types, operations, supply chains
│   ├── career/         # Jobs, education, skill progression
│   └── economy/        # Economic simulation parameters
├── store/              # Zustand state management
│   ├── integratedGameStore.js  # Main store (use this, not gameStore.js)
│   └── modules/        # 13 specialized store modules
└── services/           # API integration and external services

server/
├── routes/             # Express route handlers
├── services/           # Business logic services
├── middleware/         # Auth, anti-cheat, rate limiting
└── config/             # Server configuration files
```

## Key Development Patterns

### State Management with Zustand

- **Primary Store**: Use `integratedGameStore.js` (NOT `gameStore.js`)
- **Modular Architecture**: 13 specialized modules (player, business, banking, career, housing, relationships, staking, governance, economics, achievements, gameTime, security, settings)
- **Selective Subscriptions**: Use specific selectors for performance

```javascript
// ✅ Good - selective subscription
const cash = useIntegratedGameStore(state => state.player.cash);

// ❌ Avoid - subscribes to entire store
const state = useIntegratedGameStore();
```

### Configuration System

- **Domain-based**: Import configs from appropriate domain folders
- **Centralized Constants**: Use `GAME_CONSTANTS` from core config

```javascript
import { BUSINESSES_CONFIG } from '../config/business/unifiedBusinessConfig';
import { GAME_CONSTANTS } from '../config/core/gameConfig';
```

### Component Architecture

- **Domain Organization**: Group components by business domain, not technical type
- **Reusable UI**: Use components from `components/ui/` for consistency
- **Page Composition**: Main pages combine domain-specific components

### API Integration

- **Service Layer**: Use services in `src/services/` for API calls
- **Error Handling**: Implement proper error boundaries and user feedback
- **Authentication**: All API calls use Telegram Web App authentication

## Game Systems Architecture

### Business Empire System

- **12 Industry Categories**: Each with unique mechanics and supply chains
- **Tier Progression**: Micro → Small → Medium → Large businesses
- **Staff Management**: 4 employee types with skill progression
- **Complex Dependencies**: Businesses have supply chain relationships

### Economic Simulation

- **Economic Cycles**: Boom/Normal/Recession affecting all game systems
- **Market Dynamics**: Real supply/demand with inflation modeling
- **Cross-Player Effects**: Individual actions affect the broader economy

### Anti-Cheat & Security

- **Server-side Validation**: All calculations must be verified server-side
- **Rate Limiting**: Implement rate limits for user actions
- **Behavioral Analysis**: Monitor for suspicious patterns
- **Data Integrity**: Use cryptographic validation for critical game state

## Testing Guidelines

### Frontend Testing

- **Unit Tests**: Test component logic with Vitest
- **Integration Tests**: Test store interactions and API integration
- **E2E Tests**: Use Playwright for complete user workflows

### Backend Testing

- **Unit Tests**: Test individual service functions with Jest
- **Integration Tests**: Test database interactions and API endpoints
- **Performance Tests**: Test under load for scalability

## Performance Considerations

### Frontend

- **Selective Subscriptions**: Only subscribe to needed store slices
- **Component Memoization**: Use React.memo for expensive components
- **Lazy Loading**: Implement code splitting for heavy components

### Backend

- **Database Optimization**: Use proper indexes and query optimization
- **Redis Caching**: Cache frequently accessed data
- **Rate Limiting**: Prevent abuse with Redis-backed rate limiting

## Development Workflow

1. **Feature Development**: Start with store module, then components, then pages
2. **Configuration**: Add new game mechanics to appropriate config files
3. **Testing**: Write tests alongside feature development
4. **Anti-Cheat**: Ensure server-side validation for all game mechanics
5. **Performance**: Test with realistic data loads and user behaviors

## Common Gotchas

- **Store Migration**: Always use `integratedGameStore.js`, not the legacy `gameStore.js`
- **Config Imports**: Import from domain-specific config folders, not deprecated root configs
- **Component Organization**: Follow domain-based structure, not technical grouping
- **Authentication**: All API calls require Telegram Web App auth validation
- **Rate Limiting**: Implement and test rate limits for all user actions
