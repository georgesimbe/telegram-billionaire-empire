# 🚀 Beta Testing Guide - Billionaire Empire

## Current Status: ✅ Ready for Testing

### What's Implemented

- ✅ **Backend API** with Supabase + Redis
- ✅ **User Management** (registration, profiles, caching)
- ✅ **Game Mechanics** (tap-to-earn, daily limits, leveling)
- ✅ **Business System** (purchase, upgrade, collect income)
- ✅ **Leaderboard** with Redis caching
- ✅ **Daily Stats** tracking
- ✅ **Rate Limiting** with Redis
- ✅ **Authentication** middleware
- ✅ **Frontend** React app with animations

### What's Ready to Test

1. **User Registration & Profile**
2. **Tap-to-Earn Mechanics**
3. **Business Management**
4. **Daily Limits System**
5. **Leaderboard**
6. **API Performance**

---

## 🏃‍♂️ Quick Start (5 minutes)

### 1. Prerequisites Check

```bash
# ✅ Node.js 18+ installed
node --version

# ✅ Redis running
redis-cli ping  # Should return PONG

# ✅ Dependencies installed
npm list --depth=0
```

### 2. Environment Setup

**Option A: Use Development Mode (No Supabase needed)**

```bash
# Backend will use development mode with test user
cd server
NODE_ENV=development npm run dev
```

**Option B: Full Supabase Setup**

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Update `server/.env` with your credentials:

   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

3. Run the schema in Supabase SQL Editor:

   ```sql
   -- Copy contents of server/database/schema.sql
   ```

### 3. Start the App

**Terminal 1: Backend**

```bash
cd server
npm run dev
```

**Terminal 2: Frontend**

```bash
npm run dev
```

**Terminal 3: Test API**

```bash
node scripts/test-beta.js
```

---

## 🧪 Testing Scenarios

### 1. Basic API Testing

```bash
# Health check
curl http://localhost:3000/health

# User profile (development mode)
curl -H "x-telegram-init-data: test" http://localhost:3000/api/game/profile
```

### 2. Game Mechanics Testing

**Tap-to-Earn:**

```bash
curl -X POST http://localhost:3000/api/game/tap \
  -H "Content-Type: application/json" \
  -H "x-telegram-init-data: test" \
  -d '{"taps": 5}'
```

**Business Purchase:**

```bash
curl -X POST http://localhost:3000/api/game/business/purchase \
  -H "Content-Type: application/json" \
  -H "x-telegram-init-data: test" \
  -d '{"businessId": "lemonade"}'
```

**Leaderboard:**

```bash
curl -H "x-telegram-init-data: test" http://localhost:3000/api/game/leaderboard
```

### 3. Frontend Testing

1. Open <http://localhost:5173>
2. Test tap button functionality
3. Check business management
4. Verify animations and UI responsiveness

### 4. Performance Testing

```bash
# Load test with multiple requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/game/tap \
    -H "Content-Type: application/json" \
    -H "x-telegram-init-data: test" \
    -d '{"taps": 1}' &
done
```

---

## 🔍 What to Test

### Core Functionality

- [ ] User registration and profile creation
- [ ] Tap-to-earn with point accumulation
- [ ] Level progression (1000 XP = 1 level)
- [ ] Business purchase and upgrades
- [ ] Income collection from businesses
- [ ] Daily limits enforcement
- [ ] Leaderboard updates

### Performance

- [ ] API response times (<200ms)
- [ ] Redis caching effectiveness
- [ ] Rate limiting behavior
- [ ] Concurrent user handling

### Edge Cases

- [ ] Daily limit reached scenarios
- [ ] Insufficient points for purchases
- [ ] Invalid business IDs
- [ ] Rapid clicking/tapping
- [ ] Network interruptions

### UI/UX

- [ ] Smooth animations
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Notification system

---

## 📊 Expected Behavior

### Game Progression

- **Starting**: 0 points, Level 1, 1 click power
- **Level 2**: 1000 XP (points earned)
- **Level 5**: Can buy Food Truck (1000 points)
- **Level 10**: Can buy Restaurant (10,000 points)

### Daily Limits

- **Taps**: 10,000 per day
- **Business Upgrades**: 50 per day
- **Ads**: 20 per day (not implemented yet)
- **Trades**: 100 per day (not implemented yet)

### Business Economics

- **Lemonade Stand**: 100 points → 10 points/hour
- **Food Truck**: 1,000 points → 100 points/hour
- **Restaurant**: 10,000 points → 1,000 points/hour
- **Tech Startup**: 100,000 points → 10,000 points/hour

---

## 🐛 Known Issues & Limitations

### Current Limitations

- TON wallet integration not fully implemented
- Social features (referrals) basic implementation
- Investment system placeholder
- No real Telegram Mini App integration yet

### Development Notes

- Using test user (ID: 12345) in development mode
- Redis cache TTL: 5 minutes for user data
- Rate limiting: 1000 requests per 15 minutes
- Supabase RLS policies allow service role access

---

## 📈 Performance Benchmarks

### Target Metrics

- API Response Time: <200ms
- Database Query Time: <50ms
- Redis Cache Hit Rate: >80%
- Concurrent Users: 100+

### Monitoring

```bash
# Check Redis stats
redis-cli info stats

# Monitor API logs
tail -f server/logs/combined.log

# Check memory usage
node -e "console.log(process.memoryUsage())"
```

---

## 🚨 Troubleshooting

### Common Issues

**"Supabase connection failed"**

- Check your environment variables
- Verify Supabase project is active
- Run the database schema

**"Redis connection error"**

- Start Redis: `redis-server`
- Check port 6379 is available

**"Invalid Telegram data"**

- Use development mode: `NODE_ENV=development`
- Or provide valid Telegram init data

**Frontend not loading**

- Check if Vite dev server is running on port 5173
- Verify CORS settings in backend

### Debug Commands

```bash
# Check all services
npm run test:api

# Restart Redis
redis-cli shutdown && redis-server --daemonize yes

# Clear Redis cache
redis-cli flushall

# Check logs
tail -f server/logs/combined.log
```

---

## 🎯 Next Steps After Beta

1. **Telegram Integration**: Real Mini App setup
2. **TON Blockchain**: Wallet connection and withdrawals
3. **Social Features**: Enhanced referral system
4. **Investment System**: Stock/crypto trading
5. **Society System**: Guilds and competitions
6. **Mobile Optimization**: PWA features
7. **Production Deployment**: Scaling and monitoring

---

## 📞 Feedback & Issues

Please test thoroughly and report:

- Performance issues
- UI/UX problems
- Game balance concerns
- Feature requests
- Bug reports

**Happy Testing! 🎮**
