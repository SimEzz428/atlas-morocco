// Test script to verify Add to Plan functionality
const { execSync } = require('child_process');

console.log('🧪 Testing Add to Plan functionality...\n');

// Test 1: Check if the API returns place data with description
console.log('1. Testing API response...');
try {
  const response = execSync('curl -s "http://localhost:3000/api/cities/marrakech"', { encoding: 'utf8' });
  const data = JSON.parse(response);
  
  if (data.places && data.places.length > 0) {
    const firstPlace = data.places[0];
    console.log('✅ API returns places data');
    console.log(`   First place: ${firstPlace.name}`);
    console.log(`   Has description: ${!!firstPlace.description}`);
    console.log(`   Has lat/lon: ${!!firstPlace.lat && !!firstPlace.lon}`);
    console.log(`   Has category: ${!!firstPlace.category}`);
  } else {
    console.log('❌ API does not return places data');
  }
} catch (error) {
  console.log('❌ API test failed:', error.message);
}

// Test 2: Check if the city page loads
console.log('\n2. Testing city page...');
try {
  const response = execSync('curl -s "http://localhost:3000/cities/marrakech"', { encoding: 'utf8' });
  if (response.includes('Add to Plan')) {
    console.log('✅ City page contains "Add to Plan" buttons');
  } else {
    console.log('❌ City page does not contain "Add to Plan" buttons');
  }
} catch (error) {
  console.log('❌ City page test failed:', error.message);
}

console.log('\n🎯 Manual test required:');
console.log('1. Open http://localhost:3000/cities/marrakech');
console.log('2. Open browser console (F12)');
console.log('3. Click an "Add to Plan" button');
console.log('4. Check console for debug messages');
console.log('5. Check if place appears in plan at http://localhost:3000/plan');
