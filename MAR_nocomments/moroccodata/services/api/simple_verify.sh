#!/bin/bash

# Simple verification script for Atlas Morocco Backend

BASE_URL="http://localhost:8001"

echo "🚀 Atlas Morocco Backend Verification"
echo "====================================="

# Test 1: Health check
echo "1. Testing health endpoint..."
if curl -s "$BASE_URL/health" | grep -q "ok"; then
    echo "   ✅ Health check passed"
else
    echo "   ❌ Health check failed"
    exit 1
fi

# Test 2: Cities list
echo "2. Testing cities endpoint..."
CITIES_COUNT=$(curl -s "$BASE_URL/cities" | jq '.cities | length')
if [ "$CITIES_COUNT" -gt 0 ]; then
    echo "   ✅ Cities endpoint returned $CITIES_COUNT cities"
else
    echo "   ❌ Cities endpoint failed"
    exit 1
fi

# Test 3: City search
echo "3. Testing city search..."
if curl -s "$BASE_URL/cities?q=marrakech" | jq -e '.cities[0].name == "Marrakech"' > /dev/null; then
    echo "   ✅ City search works"
else
    echo "   ❌ City search failed"
    exit 1
fi

# Test 4: Create trip
echo "4. Testing trip creation..."
TRIP_RESPONSE=$(curl -s -X POST "$BASE_URL/trips" \
    -H "Content-Type: application/json" \
    -d '{"title": "Test Trip", "city_slug": "marrakech"}')
TRIP_ID=$(echo "$TRIP_RESPONSE" | jq -r '.id')

if [ "$TRIP_ID" != "null" ] && [ -n "$TRIP_ID" ]; then
    echo "   ✅ Trip created with ID: $TRIP_ID"
else
    echo "   ❌ Trip creation failed"
    exit 1
fi

# Test 5: Add trip item
echo "5. Testing trip item addition..."
ITEM_RESPONSE=$(curl -s -X POST "$BASE_URL/trips/$TRIP_ID/items" \
    -H "Content-Type: application/json" \
    -d '{"name": "Jemaa el-Fnaa", "category": "market", "lat": 31.625, "lon": -7.989}')
ITEM_ID=$(echo "$ITEM_RESPONSE" | jq -r '.id')

if [ "$ITEM_ID" != "null" ] && [ -n "$ITEM_ID" ]; then
    echo "   ✅ Trip item added with ID: $ITEM_ID"
else
    echo "   ❌ Trip item addition failed"
    exit 1
fi

# Test 6: Weather API
echo "6. Testing weather API..."
if curl -s "$BASE_URL/signals/weather?lat=31.6295&lon=-7.9811" | jq -e '.current_weather != null' > /dev/null; then
    echo "   ✅ Weather API works"
else
    echo "   ❌ Weather API failed"
    exit 1
fi

# Test 7: FX API
echo "7. Testing FX API..."
if curl -s "$BASE_URL/signals/fx?base=USD&quote=MAD" | jq -e '.rate > 0' > /dev/null; then
    echo "   ✅ FX API works"
else
    echo "   ❌ FX API failed"
    exit 1
fi

# Cleanup
echo "8. Cleaning up test data..."
curl -s -X DELETE "$BASE_URL/trips/$TRIP_ID" > /dev/null
echo "   ✅ Test trip deleted"

echo ""
echo "🎉 All tests passed! Backend is working correctly."
