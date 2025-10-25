#!/bin/bash

# Atlas Morocco - Deployment Verification Script
# This script verifies all backend and frontend features are working for deployment

set -e

echo "🚀 Atlas Morocco - Deployment Verification"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:8001"
FRONTEND_URL="http://localhost:3000"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_status="${3:-200}"
    
    echo -n "Testing $test_name... "
    
    if eval "$test_command" 2>/dev/null; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to check JSON response
check_json() {
    local url="$1"
    local jq_filter="$2"
    local expected_value="$3"
    
    local result=$(curl -s "$url" | jq -r "$jq_filter" 2>/dev/null)
    if [ "$result" = "$expected_value" ]; then
        return 0
    else
        return 1
    fi
}

echo -e "\n${BLUE}Backend API Tests${NC}"
echo "=================="

# Health check
run_test "Health Check" "curl -s $BACKEND_URL/health | jq -r '.ok' | grep -q 'true'"

# Cities endpoint
run_test "Cities List" "curl -s $BACKEND_URL/cities | jq -r '.cities | length' | grep -q '[0-9]'"

# City detail
run_test "City Detail (Marrakech)" "curl -s $BACKEND_URL/cities/marrakech | jq -r '.city.slug' | grep -q 'marrakech'"

# City places
run_test "City Places" "curl -s $BACKEND_URL/cities/marrakech/places | jq -r '.places | length' | grep -q '[0-9]'"

# City search
run_test "City Search" "curl -s '$BACKEND_URL/cities?q=marrakech' | jq -r '.cities | length' | grep -q '[0-9]'"

# Trips endpoint
run_test "Trips List" "curl -s $BACKEND_URL/trips | jq -r '.trips' | grep -q 'id'"

# Create a test trip
TRIP_RESPONSE=$(curl -s -X POST "$BACKEND_URL/trips" \
    -H "Content-Type: application/json" \
    -d '{"title": "Deployment Test Trip", "city_slug": "marrakech"}')

TRIP_ID=$(echo "$TRIP_RESPONSE" | jq -r '.id')

if [ "$TRIP_ID" != "null" ] && [ "$TRIP_ID" != "" ]; then
    echo -e "Testing Trip Creation... ${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
    
    # Test trip item creation
    ITEM_RESPONSE=$(curl -s -X POST "$BACKEND_URL/trips/$TRIP_ID/items" \
        -H "Content-Type: application/json" \
        -d '{"name": "Test Place", "category": "test", "lat": 31.6295, "lon": -7.9811}')
    
    ITEM_ID=$(echo "$ITEM_RESPONSE" | jq -r '.id')
    
    if [ "$ITEM_ID" != "null" ] && [ "$ITEM_ID" != "" ]; then
        echo -e "Testing Trip Item Creation... ${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
        
        # Test trip optimization
        run_test "Trip Optimization" "curl -s -X POST '$BACKEND_URL/trips/$TRIP_ID/optimize' | jq -r '.items' | grep -q 'id'"
        
        # Clean up test trip
        curl -s -X DELETE "$BACKEND_URL/trips/$TRIP_ID" > /dev/null
    else
        echo -e "Testing Trip Item Creation... ${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "Testing Trip Creation... ${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

# Weather API
run_test "Weather API" "curl -s '$BACKEND_URL/signals/weather?lat=31.6295&lon=-7.9811' | jq -r '.current_weather' | grep -q 'temperature'"

# FX API
run_test "FX API" "curl -s '$BACKEND_URL/signals/fx?base=USD&quote=MAD' | jq -r '.rate' | grep -q '[0-9]'"

# Google Maps (should return unavailable)
run_test "Google Maps Directions" "curl -s '$BACKEND_URL/maps/directions?origin=31.6295,-7.9811&destination=31.6295,-7.9811' | jq -r '.available' | grep -q 'false'"

# Plan resolve endpoint
run_test "Plan Resolve" "curl -s '$BACKEND_URL/trips/resolve?ids=1,2,3' | jq -r '.items' | grep -q 'id'"

echo -e "\n${BLUE}Frontend Tests${NC}"
echo "==============="

# Frontend pages
run_test "Home Page" "curl -s $FRONTEND_URL | grep -q 'Atlas Morocco'"

run_test "Cities Page" "curl -s $FRONTEND_URL/cities | grep -q 'Cities'"

run_test "Signup Page" "curl -s $FRONTEND_URL/auth/signup | grep -q 'Create Account'"

run_test "Signin Page" "curl -s $FRONTEND_URL/auth/signin | grep -q 'Sign in'"

run_test "Profile Page" "curl -s $FRONTEND_URL/profile | grep -q 'Profile'"

run_test "Marrakech City Page" "curl -s $FRONTEND_URL/cities/marrakech | grep -q 'Marrakech'"

echo -e "\n${BLUE}Database Tests${NC}"
echo "==============="

# Test database seeding
run_test "Database Seeding" "curl -s -X POST $BACKEND_URL/admin/seed | jq -r '.seeded' | grep -q 'true'"

echo -e "\n${BLUE}Summary${NC}"
echo "========"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Ready for deployment.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please fix issues before deployment.${NC}"
    exit 1
fi
