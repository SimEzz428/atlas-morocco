// Test script to check localStorage and plan functionality
const { execSync } = require('child_process');

console.log('🧪 Testing Plan functionality...\n');

// Test 1: Check if the plan page loads correctly
console.log('1. Testing plan page...');
try {
  const response = execSync('curl -s "http://localhost:3000/plan"', { encoding: 'utf8' });
  if (response.includes('Trip Planner')) {
    console.log('✅ Plan page loads correctly');
  } else {
    console.log('❌ Plan page does not load correctly');
  }
} catch (error) {
  console.log('❌ Plan page test failed:', error.message);
}

// Test 2: Check if the API returns city data correctly
console.log('\n2. Testing city API...');
try {
  const response = execSync('curl -s "http://localhost:3000/api/cities/marrakech"', { encoding: 'utf8' });
  const data = JSON.parse(response);
  
  if (data.places && data.places.length > 0) {
    const firstPlace = data.places[0];
    console.log('✅ City API returns correct data');
    console.log(`   Place: ${firstPlace.name}`);
    console.log(`   Category: ${firstPlace.category}`);
    console.log(`   Description: ${firstPlace.description ? 'Yes' : 'No'}`);
    console.log(`   Coordinates: ${firstPlace.lat}, ${firstPlace.lon}`);
  } else {
    console.log('❌ City API does not return places data');
  }
} catch (error) {
  console.log('❌ City API test failed:', error.message);
}

console.log('\n🎯 Manual debugging steps:');
console.log('1. Open http://localhost:3000/cities/marrakech');
console.log('2. Open browser console (F12)');
console.log('3. Click an "Add to Plan" button');
console.log('4. Check console for these debug messages:');
console.log('   - "Adding place to plan: [place object]"');
console.log('   - "usePlanContext called, context: [context object]"');
console.log('   - "usePlan addPlace called with: [place object]"');
console.log('   - "New plan state: [plan object]"');
console.log('5. Check localStorage:');
console.log('   - Open DevTools > Application > Local Storage');
console.log('   - Look for key "atlas.plan.v1"');
console.log('   - Check if it contains the added place');
console.log('6. Visit http://localhost:3000/plan');
console.log('   - Check if the place appears in the trip timeline');
console.log('   - Check console for any errors');

console.log('\n🔍 If the issue persists:');
console.log('- Check if there are any JavaScript errors in the console');
console.log('- Verify that the PlanProvider is wrapping the app correctly');
console.log('- Check if the usePlanContext hook is being called');
console.log('- Verify that the addPlace function is being called');
console.log('- Check if the plan state is being updated');
console.log('- Verify that localStorage is working correctly');
