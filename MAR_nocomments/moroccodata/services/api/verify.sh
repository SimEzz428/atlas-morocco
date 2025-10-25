#!/bin/bash

# verify.sh - Acceptance testing script for Atlas Morocco Backend
# Tests all endpoints and functionality end-to-end

set -e

BASE_URL="http://localhost:8001"
FRONTEND_URL="http://localhost:3000"

echo "🚀 Starting Atlas Morocco Backend Acceptance Tests"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run tests
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_status="$3"
    
    echo -n "Testing $test_name... "
    
    if response=$(eval "$command" 2>/dev/null); then
        if [ "$expected_status" = "200" ] || [ -z "$expected_status" ]; then
            echo -e "${GREEN}✓ PASSED${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}✗ FAILED (unexpected success)${NC}"
            ((TESTS_FAILED++))
        fi
    else
        if [ "$expected_status" = "error" ]; then
            echo -e "${GREEN}✓ PASSED (expected error)${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}✗ FAILED${NC}"
            ((TESTS_FAILED++))
        fi
    fi
}

# Check if backend is running
echo "🔍 Checking backend availability..."
if ! curl -s "$BASE_URL/health" > /dev/null; then
    echo -e "${RED}❌ Backend not running at $BASE_URL${NC}"
    echo "Please start the backend with: cd services/api && source venv/bin/activate && USE_SQLITE=true python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001"
    exit 1
fi
echo -e "${GREEN}✅ Backend is running${NC}"

echo ""
echo "📋 Testing Core Endpoints"
echo "========================"

# Health check
run_test "Health Check" "curl -s -w '%{http_code}' -o /dev/null '$BASE_URL/health'" "200"

# Cities endpoints
run_test "Cities List" "curl -s '$BASE_URL/cities' | jq -e '.cities | length > 0'"
run_test "Cities Search" "curl -s '$BASE_URL/cities?q=marrakech' | jq -e '.cities[0].name == \"Marrakech\"'"
run_test "Cities Filter by Category" "curl -s '$BASE_URL/cities?category=museum' | jq -e '.cities | length > 0'"
run_test "Cities Sort by Popularity" "curl -s '$BASE_URL/cities?sort=popularity' | jq -e '.cities | length > 0'"

# City detail
run_test "City Detail - Marrakech" "curl -s '$BASE_URL/cities/marrakech' | jq -e '.city.name == \"Marrakech\"'"
run_test "City Places" "curl -s '$BASE_URL/cities/marrakech/places' | jq -e '.places | length > 0'"

echo ""
echo "🎯 Testing Trips Functionality"
echo "=============================="

# Create a trip
TRIP_RESPONSE=$(curl -s -X POST "$BASE_URL/trips" \
    -H "Content-Type: application/json" \
    -d '{"title": "Test Morocco Trip", "city_slug": "marrakech"}')
TRIP_ID=$(echo "$TRIP_RESPONSE" | jq -r '.id')

run_test "Create Trip" "echo '$TRIP_RESPONSE' | jq -e '.id != null'"

# Add items to trip
ITEM_RESPONSE=$(curl -s -X POST "$BASE_URL/trips/$TRIP_ID/items" \
    -H "Content-Type: application/json" \
    -d '{"name": "Jemaa el-Fnaa", "category": "market", "lat": 31.625, "lon": -7.989}')
ITEM_ID=$(echo "$ITEM_RESPONSE" | jq -r '.id')

run_test "Add Trip Item" "echo '$ITEM_RESPONSE' | jq -e '.id != null'"

# Add more items
curl -s -X POST "$BASE_URL/trips/$TRIP_ID/items" \
    -H "Content-Type: application/json" \
    -d '{"name": "Jardin Majorelle", "category": "garden", "lat": 31.641, "lon": -8.003}' > /dev/null

curl -s -X POST "$BASE_URL/trips/$TRIP_ID/items" \
    -H "Content-Type: application/json" \
    -d '{"name": "Bahia Palace", "category": "palace", "lat": 31.625, "lon": -7.988}' > /dev/null

# Test trip operations
run_test "Get Trip with Items" "curl -s '$BASE_URL/trips/$TRIP_ID' | jq -e '.items | length >= 3'"
run_test "List Trips" "curl -s '$BASE_URL/trips' | jq -e '.trips | length > 0'"

# Test trip optimization
run_test "Optimize Trip Route" "curl -s -X POST '$BASE_URL/trips/$TRIP_ID/optimize' -H 'Content-Type: application/json' -d '{}' | jq -e '.items | length >= 3'"

# Test plan resolve endpoint
run_test "Resolve Plan Items" "curl -s '$BASE_URL/trips/resolve?ids=$ITEM_ID' | jq -e '.items | length > 0'"

echo ""
echo "🌐 Testing Real APIs"
echo "==================="

# Weather API
run_test "Weather API" "curl -s '$BASE_URL/signals/weather?lat=31.6295&lon=-7.9811' | jq -e '.current_weather != null'"

# FX API
run_test "FX API" "curl -s '$BASE_URL/signals/fx?base=USD&quote=MAD' | jq -e '.rate > 0'"

# Google Maps (should return unavailable without API key)
run_test "Google Maps Directions (no key)" "curl -s '$BASE_URL/maps/directions?origin=31.625,-7.989&destination=31.641,-8.003' | jq -e '.available == false'"

run_test "Google Maps Static (no key)" "curl -s '$BASE_URL/maps/static?center=31.6295,-7.9811' | jq -e '.available == false'"

echo ""
echo "🔧 Testing Admin Endpoints"
echo "========================="

# Test admin seed (should be idempotent)
run_test "Admin Seed" "curl -s -X POST '$BASE_URL/cities/admin/seed' | jq -e '.seeded == true'"

# Test plan endpoint (frontend compatibility)
run_test "Plan Endpoint" "curl -s '$BASE_URL/plan' | jq -e '.tripPlans != null'"

echo ""
echo "🧹 Cleanup"
echo "=========="

# Clean up test trip
curl -s -X DELETE "$BASE_URL/trips/$TRIP_ID" > /dev/null
echo -e "${GREEN}✅ Test trip cleaned up${NC}"

echo ""
echo "📊 Test Results"
echo "==============="
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Backend is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check the implementation.${NC}"
    exit 1
fi
