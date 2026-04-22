#!/bin/bash
# Deployment script for Student Gear Shop on Hostinger VPS

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="$HOME/nammagear"
BACKUP_DIR="$HOME/backups"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo -e "${YELLOW}📦 Pulling latest code...${NC}"
cd $APP_DIR
git pull origin main

echo -e "${YELLOW}📚 Installing dependencies...${NC}"
pnpm install

echo -e "${YELLOW}🔨 Building applications...${NC}"
pnpm build

echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
pnpm db:migrate

echo -e "${YELLOW}🔄 Restarting PM2 processes...${NC}"
pm2 restart all

echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 5

echo -e "${YELLOW}✅ Checking process status...${NC}"
pm2 status

echo -e "${GREEN}✨ Deployment complete!${NC}"
echo ""
echo "📊 Check logs with: pm2 logs"
echo "📈 Monitor status: pm2 monit"
echo ""

# Test endpoints
echo -e "${YELLOW}🧪 Testing endpoints...${NC}"

# Test API
if curl -f -s http://localhost:4000/health > /dev/null; then
    echo -e "${GREEN}✓ API is running${NC}"
else
    echo -e "${RED}✗ API health check failed${NC}"
fi

# Test Web
if curl -f -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Web app is running${NC}"
else
    echo -e "${RED}✗ Web app health check failed${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment finished successfully!${NC}"
