#!/bin/bash

echo "🚀 Setting up Billionaire Empire for local development..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Node.js are installed${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install
cd server && npm install && cd ..

# Setup environment files
echo -e "${YELLOW}⚙️  Setting up environment files...${NC}"
if [ ! -f .env ]; then
    cp env.example .env
    echo -e "${GREEN}✅ Created frontend .env file${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env already exists${NC}"
fi

if [ ! -f server/.env ]; then
    cp server/env.example server/.env
    echo -e "${GREEN}✅ Created backend .env file${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env already exists${NC}"
fi

# Create logs directory
mkdir -p server/logs
echo -e "${GREEN}✅ Created logs directory${NC}"

# Start Docker services
echo -e "${YELLOW}🐳 Starting Docker services (MongoDB & Redis)...${NC}"
docker-compose up -d mongodb redis

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Test database connection
echo -e "${YELLOW}🔍 Testing database connection...${NC}"
if docker exec billionaire-mongo mongosh --eval "db.adminCommand('ismaster')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is ready${NC}"
else
    echo -e "${RED}❌ MongoDB connection failed${NC}"
fi

if docker exec billionaire-redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is ready${NC}"
else
    echo -e "${RED}❌ Redis connection failed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete! You can now start development:${NC}"
echo ""
echo "1. Start the backend server:"
echo -e "${YELLOW}   cd server && npm run dev${NC}"
echo ""
echo "2. In another terminal, start the frontend:"
echo -e "${YELLOW}   npm run dev${NC}"
echo ""
echo "3. Or start everything at once:"
echo -e "${YELLOW}   npm run dev:all${NC}"
echo ""
echo -e "${GREEN}📱 The app will be available at: http://localhost:5173${NC}"
echo -e "${GREEN}🔧 API will be available at: http://localhost:3000${NC}"
echo -e "${GREEN}📊 MongoDB GUI: http://localhost:8082 (admin/admin123)${NC}"
echo -e "${GREEN}📈 Redis GUI: http://localhost:8081${NC}"
echo ""
echo -e "${YELLOW}Need help? Check the LOCAL_DEVELOPMENT.md guide!${NC}" 