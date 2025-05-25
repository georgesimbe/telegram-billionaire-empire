# Local Development Guide - Beta Testing Setup

This guide will help you set up the Telegram Billionaire Empire app locally for beta testing new features.

## 🚀 Quick Start (5 minutes)

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Docker)
- Redis (local or Docker)

### 1. Clone and Install

```bash
# Install all dependencies
npm install
cd server && npm install && cd ..
```

### 2. Setup Environment Files

```bash
# Frontend environment
cp env.example .env

# Backend environment  
cp server/env.example server/.env
```

### 3. Start Services with Docker (Recommended)

```bash
# Start MongoDB and Redis with Docker
docker-compose up -d

# Or manually:
# docker run -d -p 27017:27017 --name mongo mongo:latest
# docker run -d -p 6379:6379 --name redis redis:latest
```

### 4. Start Development Servers

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend  
npm run dev
```

**🎉 Ready!** Open <http://localhost:5173> to test the app.

---

## 📝 Detailed Setup

### Environment Configuration

**Frontend (.env):**

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api

# TON Network (Testnet for beta)
VITE_TON_ENDPOINT=https://testnet.toncenter.com/api/v2/jsonRPC
VITE_TON_MANIFEST_URL=https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json

# App Configuration
VITE_APP_NAME="Billionaire Empire - Beta"
VITE_APP_VERSION=1.0.0-beta

# Development
VITE_DEBUG=true
```

**Backend (server/.env):**

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/billionaire-sim-beta
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Telegram Bot (Optional for local testing)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=

# TON Blockchain (Testnet)
TON_ENDPOINT=https://testnet.toncenter.com/api/v2/jsonRPC
DEPLOYER_MNEMONIC=
GAME_WALLET_ADDRESS=
REWARD_POOL_ADDRESS=

# Security
JWT_SECRET=your_super_secret_jwt_key_for_development_32_chars
ENCRYPTION_KEY=your_32_char_encryption_key_here

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Game Configuration
POINTS_TO_TON_RATE=10000
WITHDRAWAL_FEE_PERCENT=5
MIN_WITHDRAWAL_POINTS=50000
```

### Database Setup

**Option 1: Docker (Recommended)**

```bash
# Start MongoDB and Redis
docker-compose up -d

# Check if running
docker ps
```

**Option 2: Local Installation**

```bash
# macOS with Homebrew
brew install mongodb-community redis
brew services start mongodb-community
brew services start redis

# Ubuntu/Debian
sudo apt install mongodb redis-server
sudo systemctl start mongod redis-server

# Windows - Download and install manually
```

### Development Workflow

**Starting Development:**

```bash
# Start all services
npm run dev:all
```

**Or start individually:**

```bash
# Terminal 1: Backend API
cd server
npm run dev

# Terminal 2: Frontend  
npm run dev

# Terminal 3: Watch logs
tail -f server/logs/combined.log
```

---

## 🧪 Beta Testing Features

### 1. Test User Authentication

```bash
# Test the API without Telegram
curl -X GET "http://localhost:3000/api/game/profile" \
  -H "Content-Type: application/json"
```

The app automatically creates a test user in development mode.

### 2. Game Mechanics Testing

**Points and Tapping:**

- Open <http://localhost:5173>
- Click the tap button to earn points
- Verify points increase in real-time

**Business System:**

- Navigate to Business tab
- Test purchasing/upgrading businesses
- Verify earnings calculation

**Leaderboard:**

- Create multiple test users
- Verify ranking system works

### 3. TON Integration Testing

**Wallet Connection:**

```javascript
// Test wallet connection in browser console
window.tonConnectUI.connectWallet()
```

**Withdrawal Flow:**

- Connect a testnet wallet
- Test withdrawal with small amounts
- Verify transaction completion

### 4. Social Features Testing

**Referral System:**

- Generate referral codes
- Test referral bonus mechanics
- Verify friend tracking

---

## 🔧 Development Tools

### Database Management

**MongoDB:**

```bash
# Connect to database
mongosh billionaire-sim-beta

# View collections
show collections

# Query users
db.users.find().pretty()

# Reset test data
db.users.deleteMany({})
```

**Redis:**

```bash
# Connect to Redis
redis-cli

# View all keys
KEYS *

# Clear cache
FLUSHALL
```

### API Testing

**Useful cURL commands:**

```bash
# Get user profile
curl http://localhost:3000/api/game/profile

# Test tap endpoint
curl -X POST http://localhost:3000/api/game/tap \
  -H "Content-Type: application/json" \
  -d '{"taps": 5}'

# Get leaderboard
curl http://localhost:3000/api/game/leaderboard
```

### Frontend Development

**Hot Reloading:**

- Frontend auto-reloads on file changes
- API changes require backend restart

**Component Testing:**

```bash
# Test individual components
npm run storybook  # If you add Storybook later
```

---

## 🎯 Beta Testing Scenarios

### Scenario 1: New User Flow

1. Open app in incognito browser
2. Verify welcome experience
3. Test initial tap mechanics
4. Check first business purchase

### Scenario 2: Power User Flow  

1. Create user with high points
2. Test all business types
3. Verify complex calculations
4. Test withdrawal limits

### Scenario 3: Social Features

1. Create multiple test accounts
2. Test referral system end-to-end
3. Verify leaderboard accuracy
4. Test achievement unlocking

### Scenario 4: Performance Testing

1. Rapid-fire tapping (test rate limits)
2. Multiple concurrent users
3. Large point calculations
4. Database query performance

---

## 🐛 Debugging

### Common Issues

**"User not found" errors:**

```bash
# Check if test user was created
mongosh billionaire-sim-beta
db.users.find({telegramId: 12345})
```

**CORS errors:**

```bash
# Verify ALLOWED_ORIGINS in server/.env
# Should include: http://localhost:5173
```

**Database connection issues:**

```bash
# Check MongoDB is running
mongosh
# or
docker ps | grep mongo
```

**Redis connection issues:**

```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

### Debug Logs

**Enable verbose logging:**

```bash
# In server/.env
LOG_LEVEL=debug

# View live logs
tail -f server/logs/combined.log
```

**Frontend debugging:**

```bash
# Enable debug mode in .env
VITE_DEBUG=true

# Check browser console for detailed logs
```

---

## 🚀 Feature Development Workflow

### Adding New Features

1. **Backend Changes:**

   ```bash
   cd server
   # Add new routes in routes/
   # Update models in models/
   # Restart: npm run dev
   ```

2. **Frontend Changes:**

   ```bash
   # Add components in src/components/
   # Update API service in src/services/api.js
   # Hot reload handles the rest
   ```

3. **Testing:**

   ```bash
   # Test API endpoint
   curl -X POST http://localhost:3000/api/your-new-endpoint
   
   # Test frontend integration
   # Check browser network tab
   ```

### Database Schema Changes

```bash
# Create migration script
node scripts/migrate-add-new-field.js

# Or manually update in MongoDB
mongosh billionaire-sim-beta
db.users.updateMany({}, {$set: {newField: defaultValue}})
```

---

## 📊 Monitoring During Development

### Performance Metrics

```bash
# Monitor API response times
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:3000/api/game/profile

# Monitor memory usage
ps aux | grep node

# Monitor database queries
# Enable MongoDB profiling in development
```

### Error Tracking

```bash
# Watch error logs
tail -f server/logs/error.log

# Frontend errors in browser console
# Check Network tab for failed requests
```

---

## 🔄 Beta Testing Checklist

**Before Testing:**

- [ ] All services running (MongoDB, Redis, Backend, Frontend)
- [ ] Environment variables configured
- [ ] Test data populated (optional)

**Core Features:**

- [ ] User registration/login flow
- [ ] Tap mechanics and point earning
- [ ] Business purchase and upgrade
- [ ] Earnings collection
- [ ] Level progression

**Advanced Features:**

- [ ] TON wallet connection
- [ ] Withdrawal flow (testnet)
- [ ] Referral system
- [ ] Leaderboard accuracy
- [ ] Achievement system

**Performance:**

- [ ] Fast tapping doesn't break app
- [ ] Multiple users can play simultaneously
- [ ] Database queries are efficient
- [ ] No memory leaks during extended play

**Error Handling:**

- [ ] Graceful network failures
- [ ] Invalid input handling
- [ ] Proper error messages to users

---

## 🎮 Ready to Test

Your local development environment is now ready for beta testing. Start with the basic tap mechanics and work your way up to more complex features like TON integration and social systems.

**Quick Test Commands:**

```bash
# Start everything
npm run dev:all

# Reset test data
npm run reset:testdata

# Run API tests  
npm run test:api
```

Happy beta testing! 🚀
