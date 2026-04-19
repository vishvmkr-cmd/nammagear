#!/bin/bash

echo "🎯 Student Gear Shop Local Setup - Step by Step"
echo "========================================"
echo ""

# Step 1: Check if Postgres.app is installed
if [ -d "/Applications/Postgres.app" ]; then
    echo "✅ Postgres.app is installed!"
    
    # Add to PATH
    export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
    
    # Test connection
    if pg_isready -q; then
        echo "✅ PostgreSQL is running!"
        
        # Create database
        echo ""
        echo "📊 Creating database..."
        createdb student-gear-shop 2>/dev/null && echo "✅ Database created!" || echo "ℹ️  Database already exists"
        
        # Get username
        USERNAME=$(whoami)
        
        # Update .env
        echo ""
        echo "📝 Updating configuration..."
        cd "$(dirname "$0")"
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$USERNAME@localhost:5432/student-gear-shop\"|" apps/api/.env
        echo "✅ Configuration updated!"
        
        # Setup Prisma
        echo ""
        echo "🔧 Setting up database schema..."
        cd apps/api
        npx prisma generate
        echo ""
        npx prisma db push
        echo ""
        echo "🌱 Seeding initial data..."
        npx prisma db seed
        cd ../..
        
        echo ""
        echo "✅✅✅ SETUP COMPLETE! ✅✅✅"
        echo ""
        echo "🚀 To start your application, run:"
        echo ""
        echo "    pnpm dev"
        echo ""
        echo "Then open: http://localhost:3000"
        echo ""
        
    else
        echo "❌ PostgreSQL is not running"
        echo ""
        echo "Please:"
        echo "1. Open Postgres.app"
        echo "2. Click 'Initialize' if needed"
        echo "3. Run this script again"
    fi
else
    echo "❌ Postgres.app not found"
    echo ""
    echo "📥 Please install Postgres.app:"
    echo ""
    echo "1. Visit: https://postgresapp.com/downloads.html"
    echo "2. Download 'Postgres.app with PostgreSQL 16'"
    echo "3. Open the downloaded .dmg file"
    echo "4. Drag Postgres.app to your Applications folder"
    echo "5. Open Postgres.app from Applications"
    echo "6. Click 'Initialize'"
    echo "7. Run this script again: ./setup-local.sh"
    echo ""
    
    # Try to open the download page
    open "https://postgresapp.com/downloads.html" 2>/dev/null || echo "Opening browser..."
fi
