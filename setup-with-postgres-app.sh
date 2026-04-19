#!/bin/bash

echo "📥 Download Postgres.app:"
echo "Visit: https://postgresapp.com/downloads.html"
echo ""
echo "After downloading and installing Postgres.app:"
echo ""
echo "1. Open Postgres.app and click 'Initialize'"
echo "2. Click the elephant icon in the menu bar"
echo "3. It should say 'Running on port 5432'"
echo ""
echo "Then run this script again to complete setup!"
echo ""

read -p "Have you installed and started Postgres.app? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "✅ Great! Setting up the database..."
    
    # Add postgres to PATH
    export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
    
    # Create database
    echo "🗄️ Creating database..."
    createdb student-gear-shop 2>/dev/null || echo "Database already exists"
    
    # Update .env with correct DATABASE_URL
    echo "📝 Updating database connection..."
    cd "$(dirname "$0")"
    
    # Update apps/api/.env
    if [ -f "apps/api/.env" ]; then
        # Get the current username
        USERNAME=$(whoami)
        sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$USERNAME@localhost:5432/student-gear-shop\"|" apps/api/.env
        echo "✅ Updated DATABASE_URL"
    fi
    
    # Setup Prisma
    echo "🔧 Setting up Prisma..."
    cd apps/api
    export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
    npx prisma generate
    npx prisma db push
    npx prisma db seed
    cd ../..
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 Start your application with:"
    echo "   pnpm dev"
    echo ""
    echo "Then open: http://localhost:3000"
else
    echo ""
    echo "No problem! Here's what to do:"
    echo ""
    echo "1. Download: https://postgresapp.com/downloads.html"
    echo "2. Install the app"
    echo "3. Open it and click 'Initialize'"
    echo "4. Run this script again: ./setup-with-postgres-app.sh"
fi
