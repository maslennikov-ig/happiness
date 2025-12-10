#!/bin/bash
# Deploy script for Архитектура Счастья

set -e

echo "🚀 Starting deployment process for Архитектура Счастья..."

# Navigate to project directory
cd "$(dirname "$0")/.."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin 001-happiness-landing

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🏗️  Building application..."
npm run build

# Restart PM2 process (if using PM2)
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting PM2 process..."
    pm2 restart architecture-happiness --update-env || pm2 start npm --name "architecture-happiness" -- start
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Site available at: https://ah.aidevteam.ru"
