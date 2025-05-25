-- Billionaire Empire Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  username VARCHAR(255),
  language_code VARCHAR(10) DEFAULT 'en',
  is_premium BOOLEAN DEFAULT FALSE,
  
  -- Game progress
  points BIGINT DEFAULT 0,
  level INTEGER DEFAULT 1,
  experience BIGINT DEFAULT 0,
  total_earned BIGINT DEFAULT 0,
  click_power INTEGER DEFAULT 1,
  
  -- Referral system
  referred_by BIGINT,
  referral_code VARCHAR(50) UNIQUE,
  referral_count INTEGER DEFAULT 0,
  referral_earnings BIGINT DEFAULT 0,
  
  -- Anti-cheat tracking
  suspicious_activity JSONB DEFAULT '{
    "clickViolations": 0,
    "rapidActions": 0,
    "lastViolation": null,
    "isBanned": false,
    "banReason": null,
    "banExpires": null
  }'::jsonb,
  
  -- TON wallet integration
  ton_wallet JSONB DEFAULT '{
    "address": null,
    "isConnected": false,
    "totalWithdrawn": 0,
    "lastWithdrawal": null
  }'::jsonb,
  
  -- Premium features
  vip_status JSONB DEFAULT '{
    "isActive": false,
    "expiresAt": null,
    "type": null
  }'::jsonb,
  
  -- Settings and preferences
  settings JSONB DEFAULT '{
    "notifications": true,
    "soundEffects": true,
    "autoCollect": false,
    "language": "en"
  }'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_id VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 0,
  last_collected TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_earned BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments table
CREATE TABLE investments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'stock', 'crypto', 'realEstate'
  symbol VARCHAR(20) NOT NULL,
  quantity DECIMAL(20, 8) DEFAULT 0,
  total_invested BIGINT DEFAULT 0,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily stats table
CREATE TABLE daily_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  clicks INTEGER DEFAULT 0,
  ads_watched INTEGER DEFAULT 0,
  business_upgrades INTEGER DEFAULT 0,
  trades INTEGER DEFAULT 0,
  points_earned BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Achievements table
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(100) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- Society memberships table
CREATE TABLE society_memberships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  society_id VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'member', -- 'member', 'officer', 'leader'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contributions BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table for TON withdrawals
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'withdrawal', 'deposit', 'reward'
  amount BIGINT NOT NULL,
  ton_amount DECIMAL(20, 8),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  transaction_hash VARCHAR(255),
  wallet_address VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_points ON users(points DESC);
CREATE INDEX idx_users_level ON users(level DESC);
CREATE INDEX idx_users_last_active ON users(last_active DESC);

CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_business_id ON businesses(business_id);

CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_type ON investments(type);

CREATE INDEX idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX idx_daily_stats_date ON daily_stats(date DESC);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_society_memberships_user_id ON society_memberships(user_id);
CREATE INDEX idx_society_memberships_society_id ON society_memberships(society_id);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_society_memberships_updated_at BEFORE UPDATE ON society_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE society_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be customized based on your needs)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- For now, allow service role to access all data
CREATE POLICY "Service role can access all users" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all businesses" ON businesses FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all investments" ON investments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all daily_stats" ON daily_stats FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all achievements" ON achievements FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all society_memberships" ON society_memberships FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can access all transactions" ON transactions FOR ALL USING (auth.role() = 'service_role'); 