# 🔌 Telegram Billionaire Empire API Documentation

This document provides comprehensive documentation for the Telegram Billionaire Empire API. The API is built with Node.js/Express and provides endpoints for game functionality, TON integration, and social features.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Game API](#game-api)
- [TON Integration API](#ton-integration-api)
- [Social API](#social-api)
- [Admin API](#admin-api)
- [WebSocket Events](#websocket-events)
- [SDK Usage](#sdk-usage)

## 🔐 Authentication

All API requests require authentication via Telegram Web App init data.

### Headers Required

```http
x-telegram-init-data: <telegram_web_app_init_data>
Content-Type: application/json
```

### Example Request

```javascript
const response = await fetch('/api/game/profile', {
  headers: {
    'x-telegram-init-data': window.Telegram.WebApp.initData,
    'Content-Type': 'application/json'
  }
});
```

## 🌐 Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://api.billionaire-empire.com`

## 📊 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "timestamp": "2025-05-25T15:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "timestamp": "2025-05-25T15:30:00.000Z"
}
```

## ⚠️ Error Handling

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Codes

| Code | Description |
|------|-------------|
| `INVALID_AUTH` | Invalid Telegram authentication |
| `USER_NOT_FOUND` | User profile not found |
| `INSUFFICIENT_POINTS` | Not enough points for action |
| `RATE_LIMITED` | Too many requests |
| `BUSINESS_NOT_FOUND` | Business doesn't exist |
| `INVALID_TRANSACTION` | TON transaction invalid |
| `MAINTENANCE_MODE` | Server under maintenance |

## 🚦 Rate Limiting

Rate limits are applied per user:

- **Tap Actions**: 10 requests per second
- **General API**: 100 requests per minute
- **TON Operations**: 5 requests per minute

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🎮 Game API

### Get User Profile

Retrieve user's game profile and statistics.

```http
GET /api/game/profile
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 12345,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "points": 15000,
      "level": 5,
      "experience": 1250,
      "clickPower": 3,
      "totalEarned": 50000,
      "businesses": [
        {
          "id": "lemonade_stand",
          "level": 2,
          "income": 10,
          "lastCollected": "2025-05-25T15:00:00.000Z"
        }
      ],
      "referralCode": "ABC123",
      "referralCount": 2,
      "createdAt": "2025-05-20T10:00:00.000Z"
    },
    "dailyStats": {
      "clicks": 150,
      "pointsEarned": 3000,
      "businessesUpgraded": 1
    }
  }
}
```

### Record Tap Action

Record user tap and update points.

```http
POST /api/game/tap
```

**Request Body:**

```json
{
  "taps": 1,
  "timestamp": 1640995200000
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "points": 15003,
    "pointsEarned": 3,
    "level": 5,
    "experience": 1253,
    "clickPower": 3,
    "leveledUp": false,
    "achievements": []
  }
}
```

### Get Available Businesses

Retrieve list of all available businesses.

```http
GET /api/game/businesses
```

**Query Parameters:**

- `category` (optional) - Filter by business category
- `affordable` (optional) - Only show affordable businesses

**Response:**

```json
{
  "success": true,
  "data": {
    "businesses": [
      {
        "id": "lemonade_stand",
        "name": "Lemonade Stand",
        "description": "A simple lemonade stand",
        "category": "food_beverage",
        "baseCost": 100,
        "baseIncome": 1,
        "unlockLevel": 1,
        "maxLevel": 100,
        "icon": "🍋",
        "owned": false,
        "affordable": true
      }
    ],
    "categories": [
      {
        "id": "food_beverage",
        "name": "Food & Beverage",
        "icon": "🍕"
      }
    ]
  }
}
```

### Purchase Business

Buy a new business or upgrade existing one.

```http
POST /api/game/business/buy
```

**Request Body:**

```json
{
  "businessId": "lemonade_stand",
  "quantity": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "business": {
      "id": "lemonade_stand",
      "level": 1,
      "income": 1,
      "totalCost": 100,
      "nextUpgradeCost": 150
    },
    "user": {
      "points": 14900,
      "businesses": [...]
    }
  }
}
```

### Upgrade Business

Upgrade an owned business.

```http
POST /api/game/business/upgrade
```

**Request Body:**

```json
{
  "businessId": "lemonade_stand",
  "levels": 1
}
```

### Collect Business Income

Collect accumulated income from businesses.

```http
POST /api/game/business/collect
```

**Request Body:**

```json
{
  "businessId": "lemonade_stand"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "pointsEarned": 50,
    "newPoints": 15050,
    "business": {
      "id": "lemonade_stand",
      "lastCollected": "2025-05-25T15:30:00.000Z"
    }
  }
}
```

## 🔗 TON Integration API

### Connect Wallet

Connect user's TON wallet.

```http
POST /api/ton/connect
```

**Request Body:**

```json
{
  "walletAddress": "EQD...",
  "proof": {
    "timestamp": 1640995200,
    "domain": "billionaire-empire.com",
    "signature": "...",
    "payload": "..."
  }
}
```

### Get Wallet Info

Get connected wallet information.

```http
GET /api/ton/wallet
```

**Response:**

```json
{
  "success": true,
  "data": {
    "address": "EQD...",
    "balance": "1.5000",
    "connected": true,
    "verified": true,
    "connectedAt": "2025-05-25T15:00:00.000Z"
  }
}
```

### Convert Points to TON

Convert game points to TON tokens.

```http
POST /api/ton/withdraw
```

**Request Body:**

```json
{
  "points": 50000,
  "walletAddress": "EQD..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "tx_123",
      "points": 50000,
      "tonAmount": "5.0000",
      "fee": "0.2500",
      "netAmount": "4.7500",
      "status": "pending",
      "txHash": null,
      "createdAt": "2025-05-25T15:30:00.000Z"
    },
    "user": {
      "points": 0,
      "totalWithdrawn": 50000
    }
  }
}
```

### Get Transaction History

Get user's TON transaction history.

```http
GET /api/ton/transactions
```

**Query Parameters:**

- `limit` (optional) - Number of transactions (default: 10, max: 100)
- `offset` (optional) - Pagination offset
- `status` (optional) - Filter by status (pending, completed, failed)

**Response:**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx_123",
        "type": "withdrawal",
        "points": 50000,
        "tonAmount": "5.0000",
        "fee": "0.2500",
        "status": "completed",
        "txHash": "abc123...",
        "createdAt": "2025-05-25T15:30:00.000Z",
        "completedAt": "2025-05-25T15:35:00.000Z"
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 10,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

## 👥 Social API

### Get Leaderboard

Get global or friend leaderboard.

```http
GET /api/social/leaderboard
```

**Query Parameters:**

- `type` - `global` or `friends`
- `timeframe` - `daily`, `weekly`, `monthly`, `alltime`
- `limit` (optional) - Number of entries (default: 50, max: 100)

**Response:**

```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "id": 12345,
          "firstName": "John",
          "username": "johndoe",
          "level": 25
        },
        "points": 1000000,
        "change": 5
      }
    ],
    "userRank": {
      "rank": 156,
      "points": 15000
    },
    "timeframe": "weekly",
    "updatedAt": "2025-05-25T15:30:00.000Z"
  }
}
```

### Process Referral

Process a referral when user joins via referral link.

```http
POST /api/social/refer
```

**Request Body:**

```json
{
  "referralCode": "ABC123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "bonus": 1000,
    "referrer": {
      "firstName": "Jane",
      "bonus": 500
    },
    "user": {
      "points": 16000,
      "referredBy": 67890
    }
  }
}
```

### Get Social Stats

Get user's social statistics.

```http
GET /api/social/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "referrals": {
      "count": 5,
      "totalEarned": 2500,
      "activeReferrals": 3
    },
    "achievements": {
      "total": 15,
      "recent": [
        {
          "id": "first_business",
          "name": "First Business",
          "description": "Purchase your first business",
          "unlockedAt": "2025-05-25T15:00:00.000Z"
        }
      ]
    },
    "dailyReward": {
      "available": true,
      "streak": 3,
      "nextReward": 500
    }
  }
}
```

### Claim Daily Reward

Claim daily login reward.

```http
POST /api/social/daily-reward
```

**Response:**

```json
{
  "success": true,
  "data": {
    "reward": 500,
    "streak": 4,
    "nextReward": 750,
    "user": {
      "points": 15500
    }
  }
}
```

## 🔧 Admin API

### Get System Stats

Get system-wide statistics (admin only).

```http
GET /api/admin/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 10000,
      "active": 2500,
      "newToday": 150
    },
    "economy": {
      "totalPoints": 50000000,
      "totalWithdrawn": 5000000,
      "averageLevel": 12.5
    },
    "system": {
      "uptime": 86400,
      "version": "1.0.0",
      "environment": "production"
    }
  }
}
```

## 🔌 WebSocket Events

Real-time updates via WebSocket connection.

### Connection

```javascript
const ws = new WebSocket('wss://api.billionaire-empire.com/ws');
ws.send(JSON.stringify({
  type: 'auth',
  data: { initData: window.Telegram.WebApp.initData }
}));
```

### Events

#### Income Update

```json
{
  "type": "income_update",
  "data": {
    "businessId": "lemonade_stand",
    "income": 50,
    "totalPoints": 15050
  }
}
```

#### Level Up

```json
{
  "type": "level_up",
  "data": {
    "newLevel": 6,
    "experience": 1500,
    "rewards": {
      "points": 1000,
      "unlocks": ["new_business_category"]
    }
  }
}
```

#### Achievement Unlocked

```json
{
  "type": "achievement",
  "data": {
    "id": "tap_master",
    "name": "Tap Master",
    "description": "Reach 1000 total taps",
    "reward": 500
  }
}
```

## 📚 SDK Usage

### JavaScript SDK

```javascript
import { BillionaireEmpireAPI } from '@billionaire-empire/sdk';

const api = new BillionaireEmpireAPI({
  baseURL: 'https://api.billionaire-empire.com',
  initData: window.Telegram.WebApp.initData
});

// Get user profile
const profile = await api.game.getProfile();

// Record tap
const tapResult = await api.game.tap(1);

// Buy business
const purchase = await api.game.buyBusiness('lemonade_stand', 1);
```

### Error Handling

```javascript
try {
  const result = await api.game.tap(1);
} catch (error) {
  if (error.code === 'RATE_LIMITED') {
    console.log('Too many taps, slow down!');
  } else if (error.code === 'INVALID_AUTH') {
    console.log('Authentication failed');
  }
}
```

## 🧪 Testing

### Test Environment

- **Base URL**: `https://test-api.billionaire-empire.com`
- **Test Users**: Available with pre-configured data
- **Mock Payments**: TON transactions are simulated

### Example Test

```javascript
describe('Game API', () => {
  test('should record tap and update points', async () => {
    const response = await fetch('/api/game/tap', {
      method: 'POST',
      headers: {
        'x-telegram-init-data': 'test_init_data',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ taps: 1 })
    });
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.pointsEarned).toBeGreaterThan(0);
  });
});
```

## 📞 Support

For API support and questions:

- **Documentation**: This guide and inline code comments
- **GitHub Issues**: Report bugs and request features
- **Discord**: Real-time developer chat
- **Email**: <api-support@billionaire-empire.com>

---

*Last Updated: May 25, 2025*
*API Version: 1.0.0*
