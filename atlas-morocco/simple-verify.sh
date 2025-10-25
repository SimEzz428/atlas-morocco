#!/bin/bash

# Simple Atlas Morocco Deployment Verification
echo "🚀 Atlas Morocco - Deployment Verification"
echo "=========================================="

BACKEND_URL="http://localhost:8001"
FRONTEND_URL="http://localhost:3000"

echo -e "\n🔍 Testing Backend API..."
echo "=========================="

# Health check
echo -n "Health Check... "
if curl -s $BACKEND_URL/health | jq -r '.ok' | grep -q 'true'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

# Cities endpoint
echo -n "Cities List... "
if curl -s $BACKEND_URL/cities | jq -r '.cities | length' | grep -q '[0-9]'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

# City detail
echo -n "City Detail (Marrakech)... "
if curl -s $BACKEND_URL/cities/marrakech | jq -r '.city.slug' | grep -q 'marrakech'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

# Trips endpoint
echo -n "Trips List... "
if curl -s $BACKEND_URL/trips | jq -r '.trips' | grep -q 'id'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

# Weather API
echo -n "Weather API... "
if curl -s "$BACKEND_URL/signals/weather?lat=31.6295&lon=-7.9811" | jq -r '.current_weather' | grep -q 'temperature'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

# FX API
echo -n "FX API... "
if curl -s "$BACKEND_URL/signals/fx?base=USD&quote=MAD" | jq -r '.rate' | grep -q '[0-9]'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

echo -e "\n🌐 Testing Frontend..."
echo "====================="

# Frontend pages
echo -n "Home Page... "
if curl -s $FRONTEND_URL | grep -q 'Atlas Morocco'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

echo -n "Signup Page... "
if curl -s $FRONTEND_URL/auth/signup | grep -q 'Create Account'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

echo -n "Profile Page... "
if curl -s $FRONTEND_URL/profile | grep -q 'Loading\|Profile'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

echo -n "Marrakech City Page... "
if curl -s $FRONTEND_URL/cities/marrakech | grep -q 'Marrakech'; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
    exit 1
fi

echo -e "\n🎉 All tests passed! Ready for deployment."
