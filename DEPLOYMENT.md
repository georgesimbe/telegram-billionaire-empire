# Deployment Guide - Telegram Billionaire Empire MVP

This guide will help you deploy the Telegram Billionaire Empire app from development to production.

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)
- Redis server (local or Redis Cloud)
- TON wallet with testnet/mainnet TON
- HTTPS domain for production
- Telegram Bot Token from [@BotFather](https://t.me/botfather)

## 🔧 Local Development Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration

**Frontend (.env):**

```bash
cp env.example .env
# Edit .env with your values
```

**Backend (server/.env):**

```bash
cp server/env.example server/.env
# Edit server/.env with your values
```

Required backend environment variables:

```
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
MONGODB_URI=mongodb://localhost:27017/billionaire-sim
REDIS_HOST=localhost
JWT_SECRET=your_secure_random_string_32_chars
```

### 3. Start Development Services

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start Redis (if local)
redis-server

# Terminal 3: Start backend
cd server
npm run dev

# Terminal 4: Start frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## 🚀 Production Deployment

### Phase 1: Database Setup

**Option A: MongoDB Atlas (Recommended)**

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI`

**Option B: Self-hosted MongoDB**

1. Install MongoDB on your server
2. Configure authentication and firewall rules
3. Create database: `billionaire-sim`

**Redis Setup:**

1. Use Redis Cloud or install Redis on server
2. Update `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`

### Phase 2: Smart Contract Deployment

```bash
# Install TON development tools
npm install -g @ton/cli

# Deploy contracts to testnet first
node scripts/deploy-contracts.js

# Update environment with deployed contract addresses
```

### Phase 3: Backend Deployment

**Option A: VPS/Cloud Server**

```bash
# Install PM2 for process management
npm install -g pm2

# Build and start backend
cd server
npm install --production
pm2 start index.js --name billionaire-api

# Save PM2 configuration
pm2 save
pm2 startup
```

**Option B: Railway/Heroku**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy to Railway
railway login
railway init
railway up
```

### Phase 4: Frontend Deployment

**Option A: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

**Option B: Netlify**

```bash
# Build frontend
npm run build

# Upload dist folder to Netlify
# Or connect GitHub repo for auto-deployment
```

### Phase 5: Telegram Bot Configuration

1. **Get your deployed URLs:**
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-api.railway.app`

2. **Configure Bot with BotFather:**

   ```
   /setmenubutton
   Select your bot
   Menu Button Text: 🎮 Play Game
   Menu Button URL: https://your-app.vercel.app
   ```

3. **Set Webhook (optional for notifications):**

   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
   -H "Content-Type: application/json" \
   -d '{"url": "https://your-api.railway.app/api/bot/webhook"}'
   ```

### Phase 6: Domain and SSL

**Custom Domain (Optional):**

1. Purchase domain from registrar
2. Point to your deployed app
3. Configure SSL certificate

**Nginx Configuration (if using VPS):**

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🧪 Testing the Deployment

### 1. Smoke Tests

```bash
# Test backend health
curl https://your-api.railway.app/health

# Test frontend loading
curl https://your-app.vercel.app

# Test Telegram bot
Send /start to your bot in Telegram
```

### 2. Functional Tests

1. **Game Mechanics:**
   - Open mini app in Telegram
   - Test tap functionality
   - Verify points increase
   - Test business purchases

2. **TON Integration:**
   - Connect TON wallet
   - Test withdrawal flow (with small amounts)
   - Verify transaction completion

3. **Social Features:**
   - Test referral system
   - Verify leaderboards
   - Test achievement notifications

## 🔍 Monitoring and Maintenance

### Logging

**Backend Logs:**

```bash
# PM2 logs
pm2 logs billionaire-api

# Application logs
tail -f server/logs/combined.log
```

**Frontend Monitoring:**

- Set up error tracking (Sentry, LogRocket)
- Monitor Core Web Vitals
- Track user engagement

### Database Monitoring

```bash
# MongoDB stats
mongo --eval "db.stats()"

# Redis monitoring
redis-cli monitor
```

### Performance Optimization

1. **Backend:**
   - Add database indexing
   - Implement response caching
   - Monitor memory usage

2. **Frontend:**
   - Optimize bundle size
   - Implement code splitting
   - Use service worker for caching

## 🚨 Troubleshooting

### Common Issues

**Mini App not loading:**

1. Check HTTPS requirement
2. Verify CORS settings
3. Check Telegram WebApp SDK

**Database connection errors:**

1. Verify connection string
2. Check firewall rules
3. Ensure database is running

**TON transactions failing:**

1. Check wallet connection
2. Verify smart contract addresses
3. Ensure sufficient gas

**Authentication failures:**

1. Verify bot token
2. Check Telegram data validation
3. Review JWT configuration

### Health Checks

```bash
# Backend health
curl https://your-api.railway.app/health

# Database connectivity
curl https://your-api.railway.app/api/game/profile

# Redis connectivity
redis-cli ping
```

## 📊 Production Checklist

- [ ] All environment variables configured
- [ ] Database connected and populated
- [ ] Redis configured for rate limiting
- [ ] Smart contracts deployed and verified
- [ ] Telegram bot configured with menu button
- [ ] HTTPS enabled on all endpoints
- [ ] Error monitoring set up
- [ ] Backup strategy implemented
- [ ] Performance monitoring active
- [ ] Security headers configured

## 🔄 Updates and Maintenance

### Deploying Updates

```bash
# Backend updates
git pull origin main
cd server
npm install
pm2 reload billionaire-api

# Frontend updates
git pull origin main
npm install
npm run build
vercel --prod
```

### Database Migrations

```bash
# Run any database migrations
node scripts/migrate.js
```

### Monitoring Performance

1. Track key metrics:
   - Active users
   - Transaction volume
   - Error rates
   - Response times

2. Set up alerts for:
   - Server downtime
   - High error rates
   - Database connection issues
   - Failed transactions

## 📈 Scaling Considerations

As your user base grows, consider:

1. **Database scaling:** Sharding, read replicas
2. **API scaling:** Load balancers, multiple instances
3. **Caching:** CDN for static assets, Redis for sessions
4. **Monitoring:** Advanced APM tools, real-time dashboards

---

**Need help?** Join our development Telegram group: [@BillionaireEmpireDev](https://t.me/billionaireempiredev)
