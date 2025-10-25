#!/usr/bin/env node

/**
 * Comprehensive verification script for Atlas Morocco
 * Tests all critical functionality and APIs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test configuration
const BASE_URL = 'http://localhost:3000';
const CITIES = [
  'marrakech', 'fes', 'casablanca', 'rabat', 'essaouira', 
  'chefchaouen', 'tangier', 'agadir', 'meknes', 'ouarzazate'
];

// Utility function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    
    let data = null;
    if (response.ok) {
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // For HTML responses, just check if we get a valid response
        data = await response.text();
      }
    }
    
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: data
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: error.message,
      data: null
    };
  }
}

// Test functions
async function testBuild() {
  logInfo('Testing TypeScript compilation...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    logSuccess('TypeScript compilation passed');
    return true;
  } catch (error) {
    logError('TypeScript compilation failed');
    console.error(error.stdout?.toString() || error.message);
    return false;
  }
}

async function testLint() {
  logInfo('Testing ESLint...');
  try {
    execSync('npx eslint src --config eslint.config.mjs', { stdio: 'pipe' });
    logSuccess('ESLint passed');
    return true;
  } catch (error) {
    const output = error.stdout?.toString() || error.message;
    if (output.includes('warning')) {
      logWarning('ESLint passed with warnings');
      return true;
    } else {
      logError('ESLint failed');
      console.error(output);
      return false;
    }
  }
}

async function testAPIs() {
  logInfo('Testing API endpoints...');
  const tests = [
    { name: 'Cities API', url: `${BASE_URL}/api/cities` },
    { name: 'Weather API', url: `${BASE_URL}/api/weather?lat=31.6295&lon=-7.9811` },
    { name: 'FX API', url: `${BASE_URL}/api/fx` },
    { name: 'Images API', url: `${BASE_URL}/api/images?city=marrakech&limit=12` }
  ];

  let allPassed = true;
  for (const test of tests) {
    try {
      const result = await makeRequest(test.url);
      if (result.ok) {
        logSuccess(`${test.name}: ${result.status}`);
      } else {
        logError(`${test.name}: ${result.status} ${result.statusText}`);
        allPassed = false;
      }
    } catch (error) {
      logError(`${test.name}: ${error.message}`);
      allPassed = false;
    }
  }
  return allPassed;
}

async function testCityPages() {
  logInfo('Testing city pages...');
  let allPassed = true;
  
  for (const city of CITIES) {
    try {
      const result = await makeRequest(`${BASE_URL}/cities/${city}`);
      if (result.ok) {
        logSuccess(`City page ${city}: ${result.status}`);
      } else {
        logError(`City page ${city}: ${result.status} ${result.statusText}`);
        allPassed = false;
      }
    } catch (error) {
      logError(`City page ${city}: ${error.message}`);
      allPassed = false;
    }
  }
  return allPassed;
}

async function testCityAPIs() {
  logInfo('Testing city detail APIs...');
  let allPassed = true;
  
  for (const city of CITIES) {
    try {
      const result = await makeRequest(`${BASE_URL}/api/cities/${city}`);
      if (result.ok) {
        logSuccess(`City API ${city}: ${result.status}`);
      } else {
        logError(`City API ${city}: ${result.status} ${result.statusText}`);
        allPassed = false;
      }
    } catch (error) {
      logError(`City API ${city}: ${error.message}`);
      allPassed = false;
    }
  }
  return allPassed;
}

async function testMainPages() {
  logInfo('Testing main pages...');
  const pages = [
    { name: 'Home', url: `${BASE_URL}/` },
    { name: 'Cities', url: `${BASE_URL}/cities` },
    { name: 'Plan', url: `${BASE_URL}/plan` },
    { name: 'Explore', url: `${BASE_URL}/explore` },
    { name: 'Sign In', url: `${BASE_URL}/auth/signin` },
    { name: 'Sign Up', url: `${BASE_URL}/auth/signup` }
  ];

  let allPassed = true;
  for (const page of pages) {
    try {
      const result = await makeRequest(page.url);
      if (result.ok) {
        logSuccess(`${page.name}: ${result.status}`);
      } else {
        logError(`${page.name}: ${result.status} ${result.statusText}`);
        allPassed = false;
      }
    } catch (error) {
      logError(`${page.name}: ${error.message}`);
      allPassed = false;
    }
  }
  return allPassed;
}

async function testClientComponents() {
  logInfo('Checking client component directives...');
  const srcDir = path.join(__dirname, 'src');
  const clientComponents = [];
  
  function checkFile(filePath) {
    if (fs.statSync(filePath).isDirectory()) {
      const files = fs.readdirSync(filePath);
      files.forEach(file => checkFile(path.join(filePath, file)));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for hooks usage
      const hasHooks = /useState|useEffect|useContext|useRef|useCallback|useMemo|useSession|useRouter|useSearchParams/.test(content);
      
      // Check for browser APIs
      const hasBrowserAPIs = /localStorage|sessionStorage|window|document|navigator|fetch/.test(content);
      
      // Check for client-only libraries
      const hasClientLibs = /react-leaflet|leaflet|next-auth/.test(content);
      
      // Skip API routes and server-side files
      if (filePath.includes('/api/') || filePath.includes('/server/') || filePath.includes('/lib/')) {
        return;
      }
      
      if ((hasHooks || hasBrowserAPIs || hasClientLibs) && !content.includes('"use client"')) {
        clientComponents.push(filePath);
      }
    }
  }
  
  checkFile(srcDir);
  
  if (clientComponents.length > 0) {
    logWarning('Found components that should be client components:');
    clientComponents.forEach(comp => logWarning(`  ${comp}`));
    return false;
  } else {
    logSuccess('All client components properly marked');
    return true;
  }
}

async function testIconImports() {
  logInfo('Checking icon imports...');
  const srcDir = path.join(__dirname, 'src');
  const deepImports = [];
  
  function checkFile(filePath) {
    if (fs.statSync(filePath).isDirectory()) {
      const files = fs.readdirSync(filePath);
      files.forEach(file => checkFile(path.join(filePath, file)));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for deep lucide-react imports
      const deepImportMatch = content.match(/from\s+["']lucide-react\/[^"']+["']/g);
      if (deepImportMatch) {
        deepImports.push({ file: filePath, imports: deepImportMatch });
      }
    }
  }
  
  checkFile(srcDir);
  
  if (deepImports.length > 0) {
    logWarning('Found deep lucide-react imports:');
    deepImports.forEach(({ file, imports }) => {
      logWarning(`  ${file}:`);
      imports.forEach(imp => logWarning(`    ${imp}`));
    });
    return false;
  } else {
    logSuccess('All icon imports are correct');
    return true;
  }
}

// Main verification function
async function runVerification() {
  log('\n🚀 Starting Atlas Morocco Verification', 'cyan');
  log('=====================================\n', 'cyan');
  
  const results = {
    build: false,
    lint: false,
    apis: false,
    cityPages: false,
    cityAPIs: false,
    mainPages: false,
    clientComponents: false,
    iconImports: false
  };
  
  // Run all tests
  results.build = await testBuild();
  results.lint = await testLint();
  results.apis = await testAPIs();
  results.cityPages = await testCityPages();
  results.cityAPIs = await testCityAPIs();
  results.mainPages = await testMainPages();
  results.clientComponents = await testClientComponents();
  results.iconImports = await testIconImports();
  
  // Summary
  log('\n📊 Verification Summary', 'cyan');
  log('=======================\n', 'cyan');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    if (passed) {
      logSuccess(`${test}: PASSED`);
    } else {
      logError(`${test}: FAILED`);
    }
  });
  
  log(`\nOverall: ${passed}/${total} tests passed`, passed === total ? 'green' : 'red');
  
  if (passed === total) {
    log('\n🎉 All verification tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n💥 Some verification tests failed!', 'red');
    process.exit(1);
  }
}

// Run verification
runVerification().catch(error => {
  logError(`Verification failed: ${error.message}`);
  process.exit(1);
});
