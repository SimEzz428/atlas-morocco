#!/bin/bash

# Comprehensive Test Script for Atlas Morocco
# Tests all buttons and plan synchronization

echo "🧪 Atlas Morocco - Comprehensive Functionality Test"
echo "=================================================="
echo ""

# Test 1: Check if pages load
echo "📄 Testing Page Loading..."
echo "-------------------------"

echo -n "Home page... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Cities page... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cities | grep -q "200"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Marrakech city page... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cities/marrakech | grep -q "200"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Trip planner page... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/plan | grep -q "200"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo ""

# Test 2: Check if tab buttons are present
echo "🔘 Testing Tab Buttons..."
echo "------------------------"

echo -n "Tab buttons present... "
if curl -s http://localhost:3000/cities/marrakech | grep -q "Places ("; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Itineraries tab... "
if curl -s http://localhost:3000/cities/marrakech | grep -q "Itineraries"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Gallery tab... "
if curl -s http://localhost:3000/cities/marrakech | grep -q "Gallery"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo ""

# Test 3: Check if Add to Plan buttons are present
echo "➕ Testing Add to Plan Buttons..."
echo "--------------------------------"

echo -n "Add to Plan buttons present... "
if curl -s http://localhost:3000/cities/marrakech | grep -q "Add to Plan"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Jemaa el-Fnaa button... "
if curl -s http://localhost:3000/cities/marrakech | grep -q "Jemaa el-Fnaa"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo ""

# Test 4: Check backend APIs
echo "🔌 Testing Backend APIs..."
echo "-------------------------"

echo -n "Health check... "
if curl -s http://localhost:8000/health | grep -q "ok"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Cities API... "
if curl -s http://localhost:8000/cities | grep -q "marrakech"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Weather API... "
if curl -s "http://localhost:8000/signals/weather?lat=31.6295&lon=-7.9811" | grep -q "temperature"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "FX API... "
if curl -s "http://localhost:8000/signals/fx?base=USD&quote=MAD" | grep -q "rate"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo ""

# Test 5: Check authentication pages
echo "🔐 Testing Authentication..."
echo "----------------------------"

echo -n "Signin page... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/auth/signin | grep -q "200"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Signup page... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/auth/signup | grep -q "200"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo -n "Profile page... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/profile | grep -q "200"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo ""

# Test 6: Check plan API
echo "📋 Testing Plan API..."
echo "---------------------"

echo -n "Plan API endpoint... "
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/plan | grep -q "200"; then
    echo "✅ PASSED"
else
    echo "❌ FAILED"
fi

echo ""

echo "🎯 Manual Testing Instructions:"
echo "==============================="
echo ""
echo "1. Open http://localhost:3000/cities/marrakech"
echo "2. Click on different tabs (Places, Itineraries, Gallery)"
echo "3. Click 'Add to Plan' on any attraction"
echo "4. Navigate to http://localhost:3000/plan"
echo "5. Verify the place appears in your trip plan"
echo "6. Check browser console for any JavaScript errors"
echo ""
echo "Expected behavior:"
echo "- Tab buttons should switch content"
echo "- Add to Plan buttons should work"
echo "- Places should sync to trip planner"
echo "- No JavaScript errors in console"
echo ""
echo "If any issues are found, check the browser console for debug logs."
