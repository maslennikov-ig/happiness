#!/bin/bash

# Script for building Архитектура Счастья Next.js app with memory optimization
echo "🏗️  Starting optimized build process..."

# Set memory limits for build process
export NODE_OPTIONS="--max-old-space-size=2048"
export NEXT_TELEMETRY_DISABLED=1

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

# Build with optimized settings
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "⚠️  Build failed. Trying with reduced memory settings..."
    export NODE_OPTIONS="--max-old-space-size=1536"
    npm run build
fi

echo "🎉 Build process finished."
