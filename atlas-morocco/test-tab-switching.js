// Simple test script to verify tab switching works
const puppeteer = require('puppeteer');

async function testTabSwitching() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the Marrakech city page
    await page.goto('http://localhost:3000/cities/marrakech');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="tab-places"]');
    
    // Click on the Places tab
    await page.click('[data-testid="tab-places"]');
    
    // Wait for the AttractionsGrid to load
    await page.waitForSelector('.attractions-grid', { timeout: 5000 });
    
    // Check if attractions are displayed
    const attractions = await page.$$('.attraction-card');
    console.log(`Found ${attractions.length} attractions`);
    
    if (attractions.length > 0) {
      console.log('✅ Tab switching works! Attractions are displayed.');
    } else {
      console.log('❌ Tab switching failed! No attractions found.');
    }
    
  } catch (error) {
    console.error('Error testing tab switching:', error);
  } finally {
    await browser.close();
  }
}

testTabSwitching();
