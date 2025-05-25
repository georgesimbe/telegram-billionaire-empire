#!/bin/bash

echo "🚀 Setting up Billionaire Empire Beta Environment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        echo "Visit: https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Redis will need to be installed manually."
        echo "Visit: https://docs.docker.com/get-docker/"
    fi
    
    print_status "Dependencies check completed"
}

# Install project dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    
    # Install frontend dependencies
    print_info "Installing frontend dependencies..."
    npm install
    
    # Install backend dependencies
    print_info "Installing backend dependencies..."
    cd server && npm install && cd ..
    
    print_status "Dependencies installed successfully"
}

# Setup environment files
setup_environment() {
    print_info "Setting up environment files..."
    
    # Frontend environment
    if [ ! -f .env ]; then
        cp env.example .env
        print_status "Frontend .env file created"
    else
        print_warning "Frontend .env file already exists"
    fi
    
    # Backend environment
    if [ ! -f server/.env ]; then
        cp server/env.example server/.env
        print_status "Backend .env file created"
    else
        print_warning "Backend .env file already exists"
    fi
    
    print_warning "Please update the .env files with your actual configuration:"
    echo "  - Frontend: .env"
    echo "  - Backend: server/.env"
    echo ""
    echo "Required configurations:"
    echo "  🔹 SUPABASE_URL and SUPABASE_ANON_KEY (from Supabase dashboard)"
    echo "  🔹 SUPABASE_SERVICE_ROLE_KEY (from Supabase dashboard)"
    echo "  🔹 TELEGRAM_BOT_TOKEN (from @BotFather)"
    echo "  🔹 REDIS_URL (if using external Redis)"
}

# Start Redis with Docker
start_redis() {
    if command -v docker &> /dev/null; then
        print_info "Starting Redis with Docker..."
        
        # Check if Redis container is already running
        if docker ps | grep -q "billionaire-redis"; then
            print_warning "Redis container is already running"
        else
            # Start Redis container
            docker run -d \
                --name billionaire-redis \
                -p 6379:6379 \
                redis:alpine \
                redis-server --appendonly yes
            
            if [ $? -eq 0 ]; then
                print_status "Redis started successfully on port 6379"
            else
                print_error "Failed to start Redis container"
                exit 1
            fi
        fi
    else
        print_warning "Docker not available. Please install Redis manually:"
        echo "  - macOS: brew install redis && brew services start redis"
        echo "  - Ubuntu: sudo apt-get install redis-server"
        echo "  - Or use a cloud Redis service like Upstash"
    fi
}

# Create Supabase setup instructions
create_supabase_instructions() {
    cat > SUPABASE_SETUP.md << 'EOF'
# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready (2-3 minutes)

## 2. Get Your Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values to your `server/.env` file:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_ANON_KEY`: Your anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep this secret!)

## 3. Run Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `server/database/schema.sql`
3. Paste and run the SQL to create all tables

## 4. Test Connection

Run the backend server and check the logs for successful connection:
```bash
cd server && npm run dev
```

You should see: "✅ Supabase connection successful"

## 5. Optional: Enable Row Level Security

For production, you may want to customize the RLS policies in the schema.
The current setup allows the service role to access all data.
EOF

    print_status "Created SUPABASE_SETUP.md with detailed instructions"
}

# Create development scripts
create_dev_scripts() {
    print_info "Creating development scripts..."
    
    # Update package.json with new scripts
    if command -v jq &> /dev/null; then
        # Use jq if available for JSON manipulation
        jq '.scripts += {
            "dev:all": "concurrently \"npm run dev:services\" \"npm run dev:backend\" \"npm run dev:frontend\"",
            "dev:services": "docker start billionaire-redis || docker run -d --name billionaire-redis -p 6379:6379 redis:alpine",
            "dev:backend": "cd server && npm run dev",
            "dev:frontend": "vite",
            "stop:services": "docker stop billionaire-redis",
            "reset:db": "echo \"Please run the schema.sql in your Supabase dashboard\"",
            "logs:backend": "tail -f server/logs/combined.log",
            "test:api": "node scripts/test-api.js",
            "beta:start": "npm run dev:all"
        }' package.json > package.json.tmp && mv package.json.tmp package.json
        
        print_status "Updated package.json with development scripts"
    else
        print_warning "jq not found. Please manually add the scripts to package.json"
    fi
}

# Create a simple test script
create_test_script() {
    cat > scripts/test-beta.js << 'EOF'
#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function testBetaEnvironment() {
    console.log('🧪 Testing Beta Environment...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${API_BASE}/health`);
        console.log('✅ Health check passed:', healthResponse.data.status);

        // Test API endpoints (these will fail without proper auth, but should return 401)
        console.log('\n2. Testing API authentication...');
        try {
            await axios.get(`${API_BASE}/api/game/profile`);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Authentication working (401 as expected)');
            } else {
                console.log('❌ Unexpected error:', error.message);
            }
        }

        console.log('\n🎉 Beta environment is ready for testing!');
        console.log('\nNext steps:');
        console.log('1. Update your .env files with Supabase credentials');
        console.log('2. Run the database schema in Supabase');
        console.log('3. Start the full development environment: npm run beta:start');

    } catch (error) {
        console.log('❌ Test failed:', error.message);
        console.log('\nMake sure the backend server is running: cd server && npm run dev');
    }
}

testBetaEnvironment();
EOF

    chmod +x scripts/test-beta.js
    print_status "Created beta testing script"
}

# Main setup function
main() {
    echo "🎮 Billionaire Empire - Beta Setup"
    echo "=================================="
    echo ""
    
    check_dependencies
    echo ""
    
    install_dependencies
    echo ""
    
    setup_environment
    echo ""
    
    start_redis
    echo ""
    
    create_supabase_instructions
    echo ""
    
    create_dev_scripts
    echo ""
    
    create_test_script
    echo ""
    
    print_status "Beta environment setup completed!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. 📝 Follow instructions in SUPABASE_SETUP.md"
    echo "2. ⚙️  Update .env files with your credentials"
    echo "3. 🗄️  Run the database schema in Supabase"
    echo "4. 🧪 Test the setup: node scripts/test-beta.js"
    echo "5. 🚀 Start development: npm run beta:start"
    echo ""
    echo "🔗 Useful URLs:"
    echo "   - Supabase Dashboard: https://supabase.com/dashboard"
    echo "   - Local API: http://localhost:3000"
    echo "   - Local Frontend: http://localhost:5173"
    echo ""
    print_info "Happy coding! 🎉"
}

# Run main function
main 