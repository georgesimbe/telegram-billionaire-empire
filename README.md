# 🏆 Telegram Billionaire Empire

A sophisticated Telegram Mini App that combines comprehensive life simulation mechanics with real TON blockchain integration. Build your life from the ground up - get a job, find housing, manage relationships, and grow your business empire!

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Telegram-blue.svg)
![Blockchain](https://img.shields.io/badge/blockchain-TON-orange.svg)

## 🎮 Game Overview

Telegram Billionaire Empire is a comprehensive life simulation game where players:

- **🏠 Life Management**: Start from nothing and build your life with housing, career, and relationships
- **💼 Career Development**: Find jobs, get education, develop skills, and climb the career ladder
- **🏦 Financial Management**: Manage bank accounts, apply for loans, build credit, and make investments
- **👥 Social Life**: Build relationships with family, friends, and romantic partners
- **🏢 Business Empire**: Start and manage multiple businesses across various industries
- **👑 Dynasty Building**: Plan for multiple generations and build a lasting legacy
- **💰 Earn TON**: Convert in-game achievements to real TON cryptocurrency

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Telegram Bot Token (for production)
- TON Wallet (for blockchain features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/telegram-billionaire-sim.git
   cd telegram-billionaire-sim
   ```

2. **Install dependencies**

   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd server && npm install && cd ..
   ```

3. **Set up environment variables**

   ```bash
   # Copy environment templates
   cp server/env.example server/.env
   
   # Edit server/.env with your credentials:
   # - SUPABASE_URL
   # - SUPABASE_ANON_KEY
   # - SUPABASE_SERVICE_ROLE_KEY
   ```

4. **Set up database**

   ```bash
   # Link to your Supabase project
   supabase link --project-ref YOUR_PROJECT_ID
   
   # Apply database schema
   supabase db push --linked
   ```

5. **Start development servers**

   ```bash
   # Start backend (port 3000)
   cd server && npm run dev &
   
   # Start frontend (port 5173)
   npm run dev
   ```

6. **Access the application**
   - Frontend: <http://localhost:5173>
   - Backend API: <http://localhost:3000>
   - Health Check: <http://localhost:3000/health>

## 🏗️ Architecture

### Frontend (React + Vite)

```
src/
├── components/          # Reusable UI components
│   ├── EnhancedPointsDisplay.jsx
│   ├── ParticleBackground.jsx
│   ├── TapButton.jsx
│   └── ...
├── pages/              # Main application pages
│   ├── HomePage.jsx    # Life dashboard
│   ├── CareerPage.jsx  # Job and education management
│   ├── BusinessPage.jsx # Business empire management
│   ├── SocialPage.jsx  # Housing, banking, relationships
│   └── DynastyPage.jsx # Multi-generational planning
├── store/              # Zustand state management
├── config/             # Game configuration systems
│   ├── housingConfig.js
│   ├── bankingConfig.js
│   ├── jobsConfig.js
│   ├── businessConfig.js
│   └── ...
├── services/           # API communication
├── utils/              # Helper functions
└── styles/             # CSS and styling
```

### Backend (Node.js + Express)

```
server/
├── routes/             # API route handlers
├── middleware/         # Express middleware
├── config/             # Database and service configs
├── utils/              # Backend utilities
├── database/           # Database schema and migrations
└── logs/               # Application logs
```

### Database (Supabase/PostgreSQL)

- **users**: Player profiles and life progress
- **careers**: Job history and education records
- **housing**: Property ownership and mortgages
- **banking**: Accounts, loans, and credit history
- **relationships**: Social connections and interactions
- **businesses**: Business ownership and management
- **dynasty**: Multi-generational progress and legacy
- **transactions**: TON blockchain transactions

## 🎯 Core Features

### Life Management System

- ✅ **Housing**: 8 property types from homeless to luxury mansion
- ✅ **Career**: 50+ jobs across 6 categories with progression
- ✅ **Education**: High school through advanced degrees
- ✅ **Banking**: Multiple account types, loans, credit cards
- ✅ **Credit System**: Dynamic credit scoring affecting opportunities

### Social & Relationship System

- ✅ **Relationships**: Family, friends, romantic, professional
- ✅ **Social Activities**: Dates, parties, networking events
- ✅ **Happiness System**: Relationship and lifestyle bonuses
- ✅ **Network Effects**: Relationships impact career and business

### Business Empire

- ✅ **15+ Business Types**: Restaurants, tech, real estate, etc.
- ✅ **Staff Management**: Hire, train, and manage employees
- ✅ **Supply Chain**: Resource management and optimization
- ✅ **Market Events**: News events affecting business performance

### Dynasty & Legacy

- ✅ **Multi-Generational**: Plan across multiple lifetimes
- ✅ **Legacy Points**: Inherit advantages for future generations
- ✅ **Dynasty Tiers**: Progress from startup to global empire
- ✅ **Trait System**: Pass down beneficial traits

### Blockchain Integration

- ✅ **TON Wallet Connection**: TonConnect integration
- ✅ **Achievement Rewards**: Convert milestones to TON tokens
- ✅ **Transaction Verification**: Blockchain validation
- ✅ **Secure Withdrawals**: Anti-fraud protection

## 🔧 Development

### Available Scripts

```bash
# Frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Backend
cd server
npm run dev              # Start with nodemon
npm run start            # Start production server
npm run test             # Run tests

# Database
supabase db reset        # Reset database
supabase db push         # Apply migrations
supabase gen types       # Generate TypeScript types
```

### Environment Variables

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_TELEGRAM_BOT_NAME=your_bot_name
```

#### Backend (server/.env)

```env
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Security
JWT_SECRET=your_jwt_secret
TELEGRAM_BOT_TOKEN=your_bot_token

# TON Blockchain
TON_NETWORK=testnet
TON_API_KEY=your_ton_api_key
```

## 🔐 Security

### Authentication

- Telegram Web App authentication
- JWT token validation
- Rate limiting on all endpoints
- CORS protection

### Anti-Cheat Measures

- Server-side validation of all actions
- Behavioral analysis for suspicious activity
- Rate limiting on tap actions
- Transaction verification

### Data Protection

- Environment variables for sensitive data
- Encrypted database connections
- Secure API endpoints
- Input validation and sanitization

## 📊 Monitoring

### Logging

- Structured logging with Winston
- Request/response logging
- Error tracking
- Performance metrics

### Health Checks

- `/health` endpoint for server status
- Database connection monitoring
- Redis connection status
- Supabase integration status

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend (Railway/Heroku)

1. Set up environment variables
2. Deploy from Git repository
3. Run database migrations
4. Configure custom domain (optional)

### Database (Supabase)

1. Create new project
2. Apply schema from `database/schema.sql`
3. Configure Row Level Security (RLS)
4. Set up API keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use ESLint and Prettier for formatting
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features

## 📝 API Documentation

### Authentication

All API requests require a valid Telegram Web App init data header:

```
x-telegram-init-data: <telegram_web_app_init_data>
```

### Endpoints

#### Game API

- `GET /api/game/profile` - Get user profile
- `POST /api/game/tap` - Record tap action
- `GET /api/game/businesses` - Get available businesses
- `POST /api/game/business/buy` - Purchase business
- `POST /api/game/business/upgrade` - Upgrade business

#### TON Integration

- `POST /api/ton/connect` - Connect TON wallet
- `POST /api/ton/withdraw` - Withdraw points as TON
- `GET /api/ton/transactions` - Get transaction history

#### Social Features

- `GET /api/social/leaderboard` - Get leaderboard
- `POST /api/social/refer` - Process referral
- `GET /api/social/stats` - Get social statistics

## 🐛 Troubleshooting

### Common Issues

**Buffer is not defined**

- Solution: Polyfills are included in `src/polyfills.js`
- Ensure polyfills are imported first in `main.jsx`

**Supabase connection failed**

- Check environment variables in `server/.env`
- Verify Supabase project is active
- Ensure database schema is applied

**TON wallet connection issues**

- Verify TonConnect configuration
- Check network settings (mainnet/testnet)
- Ensure wallet app is installed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Telegram Web Apps](https://core.telegram.org/bots/webapps) - Platform foundation
- [TON Blockchain](https://ton.org/) - Cryptocurrency integration
- [Supabase](https://supabase.com/) - Backend infrastructure
- [React](https://reactjs.org/) - Frontend framework
- [Framer Motion](https://www.framer.com/motion/) - Animations

## 📞 Support

- 📧 Email: <support@billionaire-empire.com>
- 💬 Telegram: @BillionaireEmpireBot
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/telegram-billionaire-sim/issues)
- 📖 Wiki: [Project Wiki](https://github.com/yourusername/telegram-billionaire-sim/wiki)

---

**Made with ❤️ for the Telegram and TON communities**
