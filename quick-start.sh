#!/bin/bash

echo "🚀 Student Gear Shop Quick Start Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}📦 Homebrew not found. Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}📊 Installing PostgreSQL...${NC}"
    brew install postgresql@16
    brew services start postgresql@16
    
    # Wait for PostgreSQL to start
    echo "⏳ Waiting for PostgreSQL to start..."
    sleep 5
else
    echo -e "${GREEN}✓ PostgreSQL already installed${NC}"
    
    # Start PostgreSQL if not running
    if ! pg_isready &> /dev/null; then
        echo "🔄 Starting PostgreSQL..."
        brew services start postgresql@16 || brew services start postgresql
        sleep 3
    fi
fi

# Create database
echo -e "${YELLOW}🗄️  Creating database...${NC}"
createdb student-gear-shop 2>/dev/null || echo "Database 'student-gear-shop' already exists"

# Update DATABASE_URL in .env if needed
if grep -q "localhost:5432" apps/api/.env; then
    echo -e "${GREEN}✓ Database URL already configured${NC}"
else
    echo -e "${YELLOW}📝 Updating DATABASE_URL in apps/api/.env...${NC}"
    sed -i '' 's|DATABASE_URL=.*|DATABASE_URL="postgresql://$(whoami)@localhost:5432/student-gear-shop"|' apps/api/.env
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pnpm install

# Setup Prisma
echo -e "${YELLOW}🔧 Setting up database schema...${NC}"
cd apps/api
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed
cd ../..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "To start the application, run:"
echo -e "${YELLOW}  pnpm dev${NC}"
echo ""
echo "Then open:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo ""
