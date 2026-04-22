#!/bin/bash
# Deploy Student Gear Shop to Hostinger VPS
# Usage: ./deploy-remote.sh

set -e

VPS="root@147.79.66.164"
APP_DIR="/home/deploy/nammagear"

echo "🚀 Deploying Student Gear Shop to microlynk.shop..."
echo ""

# Step 1: Push local changes to GitHub
echo "📤 Pushing to GitHub..."
git push origin main 2>/dev/null || echo "⚠ Push failed or nothing to push (using github.com-nammagear remote)"
git push github.com-nammagear:vishvmkr-cmd/nammagear.git main 2>/dev/null || true

# Step 2: Pull, build, and restart on VPS
echo "📥 Pulling on server..."
ssh $VPS "cd $APP_DIR && sudo -u deploy git pull origin main"

echo "📦 Installing dependencies..."
ssh $VPS "cd $APP_DIR && sudo -u deploy pnpm install"

echo "🗄️  Running migrations..."
ssh $VPS "cd $APP_DIR && sudo -u deploy pnpm db:generate && sudo -u deploy pnpm db:migrate"

echo "🔨 Building..."
ssh $VPS "cd $APP_DIR && sudo -u deploy pnpm build"

echo "🔄 Restarting..."
ssh $VPS "cd $APP_DIR && sudo -u deploy pm2 restart all"

echo ""
echo "✅ Deployed! Checking status..."
ssh $VPS "sudo -u deploy pm2 status"

echo ""
echo "🌐 Live at: https://microlynk.shop"
echo "📊 Logs:    ssh $VPS 'sudo -u deploy pm2 logs'"
