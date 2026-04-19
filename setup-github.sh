#!/bin/bash

# Student Gear Shop - GitHub Quick Setup Script
# This script helps you connect your local repository to GitHub

set -e

echo "🚀 Student Gear Shop GitHub Setup"
echo "=========================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository. Run 'git init' first."
    exit 1
fi

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

# Construct repository URL
REPO_URL="https://github.com/$GITHUB_USERNAME/student-gear-shop.git"

echo ""
echo "📋 Repository URL: $REPO_URL"
echo ""

# Check if remote already exists
if git remote | grep -q "^origin$"; then
    echo "⚠️  Remote 'origin' already exists"
    read -p "Do you want to update it? (y/n): " UPDATE_REMOTE
    if [ "$UPDATE_REMOTE" = "y" ]; then
        git remote set-url origin "$REPO_URL"
        echo "✅ Remote 'origin' updated"
    else
        echo "❌ Aborted"
        exit 1
    fi
else
    git remote add origin "$REPO_URL"
    echo "✅ Remote 'origin' added"
fi

echo ""
echo "📊 Current remotes:"
git remote -v
echo ""

# Ask about git config
read -p "Do you want to configure your git user info? (y/n): " CONFIG_USER
if [ "$CONFIG_USER" = "y" ]; then
    read -p "Enter your name: " GIT_NAME
    read -p "Enter your email: " GIT_EMAIL
    
    git config --global user.name "$GIT_NAME"
    git config --global user.email "$GIT_EMAIL"
    
    echo "✅ Git user configured globally"
    echo ""
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Ask to push
read -p "Do you want to push to GitHub now? (y/n): " PUSH_NOW
if [ "$PUSH_NOW" = "y" ]; then
    echo ""
    echo "🔄 Pushing to GitHub..."
    echo "Note: You may be prompted for your GitHub credentials"
    echo "Tip: Use a Personal Access Token as your password"
    echo ""
    
    if git push -u origin "$CURRENT_BRANCH"; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "🎉 Setup complete! Visit your repository:"
        echo "   $REPO_URL"
    else
        echo ""
        echo "❌ Push failed. Common issues:"
        echo "   1. Repository doesn't exist on GitHub - create it first at https://github.com/new"
        echo "   2. Authentication failed - use a Personal Access Token"
        echo "   3. Branch name mismatch - make sure the repository is empty"
        echo ""
        echo "See GITHUB-SETUP.md for detailed troubleshooting"
    fi
else
    echo ""
    echo "✅ Remote configured but not pushed"
    echo ""
    echo "To push later, run:"
    echo "   git push -u origin $CURRENT_BRANCH"
fi

echo ""
echo "📖 For more information, see GITHUB-SETUP.md"
