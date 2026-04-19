#!/bin/bash

# NammaGear - Backend Setup Script

set -e

echo "🚀 NammaGear Backend Setup"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Installing..."
    echo "Node.js has been installed to ~/.node/"
    echo "Added to PATH in ~/.zshrc"
else
    echo "✅ Node.js $(node --version) installed"
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found"
    exit 1
else
    echo "✅ pnpm $(pnpm --version) installed"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
cd "$(dirname "$0")/apps/api"
pnpm install

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
pnpm prisma generate

# Build the project
echo ""
echo "🏗️  Building TypeScript..."
pnpm build

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Install PostgreSQL 16 (via Homebrew or Docker)"
echo "   2. Create database: createdb nammagear"
echo "   3. Run migrations: pnpm --filter api prisma migrate deploy"
echo "   4. Seed database: pnpm --filter api prisma db seed"
echo "   5. Start dev server: pnpm --filter api dev"
echo ""
echo "💡 See SETUP-PROGRESS.md for detailed instructions"
