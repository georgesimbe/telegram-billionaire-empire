# Billionaire Empire - Setup Guide

## Prerequisites

- Node.js 18+
- MongoDB
- Redis
- Telegram Bot Token
- TON Wallet for deployment

## Step 1: Create Telegram Bot

1. Open [@BotFather](https://t.me/botfather) in Telegram
2. Send `/newbot` and follow instructions
3. Save your bot token
4. Send `/newapp` to create a Web App
5. Set Web App URL to your domain

## Step 2: Clone and Install

```bash
git clone <your-repo>
cd telegram-billionaire-sim

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Step 3: Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

Required values:
- `TELEGRAM_BOT_TOKEN` - From BotFather
- `MONGODB_URI` - Your MongoDB connection string
- `MINI_APP_URL` - Your frontend URL (https required)
- `DEPLOYER_MNEMONIC` - TON wallet mnemonic for contracts

## Step 4: Deploy Smart Contracts

```bash
# Compile contracts (requires func compiler)
func -o contracts/GameWallet.boc contracts/GameWallet.fc
func -o contracts/RewardPool.boc contracts/RewardPool.fc

# Deploy to TON
node scripts/deploy-contracts.js
```

## Step 5: Start Services

```bash
# Start MongoDB
mongod

# Start Redis
redis-server

# Start backend (in server directory)
cd server
npm run dev

# Start frontend (in root directory)
cd ..
npm run dev
```

## Step 6: Configure Telegram Mini App

1. Open [@BotFather](https://t.me/botfather)
2. Select your bot
3. Edit Web App
4. Set URL to: `https://yourdomain.com`
5. Set name to: "Play Billionaire Empire"

## Step 7: Test the Bot

1. Open your bot in Telegram
2. Send `/start`
3. Click "Play Game" button
4. Test all features

## Production Deployment

### Frontend (Vercel/Netlify)

```bash
# Build frontend
npm run build

# Deploy dist folder to your host
```

### Backend (VPS/Cloud)

```bash
# Use PM2 for process management
npm install -g pm2

# Start backend
cd server
pm2 start index.js --name billionaire-api

# Save PM2 config
pm2 save
pm2 startup
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        root /var/www/billionaire-sim/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Checklist

- [ ] Enable HTTPS on all endpoints
- [ ] Set strong JWT secret
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Regular database backups
- [ ] Audit smart contracts
- [ ] Test anti-cheat systems

## Monitoring

### Backend Logs
```bash
pm2 logs billionaire-api
```

### Database Monitoring
```bash
# MongoDB stats
mongo --eval "db.stats()"

# Redis monitoring
redis-cli monitor
```

### Smart Contract Monitoring
- Use [Tonscan](https://tonscan.org) to monitor contracts
- Set up alerts for large withdrawals

## Troubleshooting

### Bot not responding
1. Check bot token is correct
2. Verify webhook URL
3. Check server logs

### Mini App not loading
1. Ensure HTTPS is enabled
2. Check CORS settings
3. Verify Telegram Web App SDK is loaded

### Withdrawals failing
1. Check smart contract balance
2. Verify TON node connection
3. Check gas settings

## Support

- GitHub Issues: [your-repo/issues]
- Telegram Support: [@BillionaireEmpireSupport]
- Email: support@billionaireempire.com