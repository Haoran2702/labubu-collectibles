#!/bin/bash

# Railway deployment script for backend
echo "🚀 Starting Railway deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Start the application
echo "🚀 Starting application..."
npm start 