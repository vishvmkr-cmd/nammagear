#!/bin/bash

# NammaGear - Create GitHub Repository via API

set -e

echo "🚀 NammaGear - Create GitHub Repository"
echo "========================================"

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

echo ""
read -s -p "Paste your Personal Access Token: " GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: Token is required"
    exit 1
fi

echo ""
echo "🔨 Creating repository on GitHub..."

# Create repository
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user/repos \
  -d '{"name":"nammagear","description":"Peer-to-peer marketplace for Bangalore students","private":false}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "422" ]; then
    REPO_URL="https://github.com/$GITHUB_USERNAME/nammagear.git"
    
    if [ "$HTTP_CODE" = "422" ]; then
        echo "⚠️  Repository already exists, using it..."
    else
        echo "✅ Repository created!"
    fi
    
    # Configure remote
    git remote remove origin 2>/dev/null || true
    git remote add origin "$REPO_URL"
    
    # Push with token
    git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/nammagear.git"
    git push -u origin main
    
    # Reset URL
    git remote set-url origin "$REPO_URL"
    
    echo ""
    echo "🎉 Success! https://github.com/$GITHUB_USERNAME/nammagear"
else
    echo "❌ Failed (HTTP $HTTP_CODE)"
    exit 1
fi
