#!/bin/bash
# Production Setup Script for Hostinger VPS
# Run this ONCE on the VPS to set up environment variables

set -e

echo "🔧 Setting up production environment for microlynk.shop..."

# Check if running on VPS
if [ ! -d "/home/deploy/nammagear" ]; then
  echo "❌ Error: This script must be run on the VPS in /home/deploy/nammagear"
  exit 1
fi

cd /home/deploy/nammagear

# Create API environment file
echo "📝 Creating API .env file..."
cat > apps/api/.env << 'EOF'
# Database
DATABASE_URL="postgresql://sgshop:CHANGE_DB_PASSWORD@localhost:5432/student_gear_shop"

# JWT Secret (REPLACE THIS!)
JWT_SECRET="GENERATE_WITH_openssl_rand_base64_64"

# Cloudinary (get from cloudinary.com dashboard)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Server
PORT=4000
NODE_ENV=production

# Production URLs
CORS_ORIGIN="https://microlynk.shop"
COOKIE_DOMAIN="microlynk.shop"
EOF

# Create Web environment file
echo "📝 Creating Web .env.local file..."
cat > apps/web/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://api.microlynk.shop
NODE_ENV=production
EOF

echo ""
echo "✅ Environment files created!"
echo ""
echo "⚠️  IMPORTANT: Edit these files and update:"
echo "   1. Database password in apps/api/.env"
echo "   2. JWT_SECRET (generate with: openssl rand -base64 64)"
echo "   3. Cloudinary credentials"
echo ""
echo "Edit with:"
echo "   nano apps/api/.env"
echo "   nano apps/web/.env.local"
echo ""
echo "After updating, run: ./deploy.sh"
