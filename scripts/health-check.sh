#!/bin/bash

# Health check script for Labubu Collectibles

FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001/api"

echo "🔍 Checking Labubu Collectibles health..."

# Check frontend
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

# Check backend
if curl -f -s "$BACKEND_URL" > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding"
    exit 1
fi

# Check database
if [ -f "backend/database.sqlite" ]; then
    echo "✅ Database file exists"
else
    echo "❌ Database file not found"
    exit 1
fi

echo "🎉 All systems are healthy!" 