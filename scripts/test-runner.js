#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${message}`, 'bright');
  log('='.repeat(60), 'cyan');
}

function logStep(message) {
  log(`\n▶ ${message}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Check if required files exist
function checkPrerequisites() {
  logStep('Checking prerequisites...');
  
  const requiredFiles = [
    'package.json',
    'playwright.config.js',
    'tests/signup.spec.js',
    'tests/login.spec.js',
    'tests/homepage.spec.js'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      logError(`Required file not found: ${file}`);
      return false;
    }
  }
  
  logSuccess('All required files found');
  return true;
}

// Install dependencies if needed
function installDependencies() {
  logStep('Checking dependencies...');
  
  try {
    // Check if node_modules exists
    if (!fs.existsSync('node_modules')) {
      logInfo('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      logSuccess('Dependencies installed');
    } else {
      logSuccess('Dependencies already installed');
    }
    
    // Check if Playwright is installed
    const playwrightPath = path.join('node_modules', '@playwright', 'test');
    if (!fs.existsSync(playwrightPath)) {
      logInfo('Installing Playwright...');
      execSync('npm install -D @playwright/test', { stdio: 'inherit' });
      logSuccess('Playwright installed');
    }
    
    return true;
  } catch (error) {
    logError('Failed to install dependencies');
    logError(error.message);
    return false;
  }
}

// Install Playwright browsers
function installBrowsers() {
  logStep('Installing Playwright browsers...');
  
  try {
    execSync('npx playwright install --with-deps', { stdio: 'inherit' });
    logSuccess('Browsers installed');
    return true;
  } catch (error) {
    logError('Failed to install browsers');
    logError(error.message);
    return false;
  }
}

// Run tests
function runTests(options = {}) {
  const { 
    headed = false, 
    debug = false, 
    ui = false, 
    browser = 'chromium',
    grep = null 
  } = options;
  
  logStep('Running tests...');
  
  try {
    let command = 'npx playwright test';
    
    if (headed) command += ' --headed';
    if (debug) command += ' --debug';
    if (ui) command += ' --ui';
    if (browser !== 'all') command += ` --project=${browser}`;
    if (grep) command += ` --grep="${grep}"`;
    
    logInfo(`Command: ${command}`);
    execSync(command, { stdio: 'inherit' });
    
    logSuccess('Tests completed successfully');
    return true;
  } catch (error) {
    logError('Tests failed');
    return false;
  }
}

// Show test report
function showReport() {
  logStep('Opening test report...');
  
  try {
    execSync('npx playwright show-report', { stdio: 'inherit' });
    logSuccess('Report opened');
    return true;
  } catch (error) {
    logError('Failed to open report');
    logError(error.message);
    return false;
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  logHeader('Bus Ticket Booking - Test Runner');
  
  switch (command) {
    case 'setup':
      logHeader('Setting up test environment');
      if (!checkPrerequisites()) process.exit(1);
      if (!installDependencies()) process.exit(1);
      if (!installBrowsers()) process.exit(1);
      logSuccess('Test environment setup complete');
      break;
      
    case 'test':
      logHeader('Running all tests');
      if (!checkPrerequisites()) process.exit(1);
      if (!runTests()) process.exit(1);
      break;
      
    case 'test:headed':
      logHeader('Running tests in headed mode');
      if (!checkPrerequisites()) process.exit(1);
      if (!runTests({ headed: true })) process.exit(1);
      break;
      
    case 'test:debug':
      logHeader('Running tests in debug mode');
      if (!checkPrerequisites()) process.exit(1);
      if (!runTests({ debug: true })) process.exit(1);
      break;
      
    case 'test:ui':
      logHeader('Running tests in UI mode');
      if (!checkPrerequisites()) process.exit(1);
      if (!runTests({ ui: true })) process.exit(1);
      break;
      
    case 'test:browser':
      const browser = args[1] || 'chromium';
      logHeader(`Running tests in ${browser}`);
      if (!checkPrerequisites()) process.exit(1);
      if (!runTests({ browser })) process.exit(1);
      break;
      
    case 'test:grep':
      const pattern = args[1];
      if (!pattern) {
        logError('Please provide a grep pattern');
        process.exit(1);
      }
      logHeader(`Running tests matching: ${pattern}`);
      if (!checkPrerequisites()) process.exit(1);
      if (!runTests({ grep: pattern })) process.exit(1);
      break;
      
    case 'report':
      logHeader('Opening test report');
      if (!showReport()) process.exit(1);
      break;
      
    case 'help':
    default:
      logHeader('Test Runner Commands');
      log('\nAvailable commands:', 'bright');
      log('  setup                    Set up test environment');
      log('  test                     Run all tests');
      log('  test:headed              Run tests in headed mode');
      log('  test:debug               Run tests in debug mode');
      log('  test:ui                  Run tests in UI mode');
      log('  test:browser <browser>   Run tests in specific browser');
      log('  test:grep <pattern>      Run tests matching pattern');
      log('  report                   Open test report');
      log('  help                     Show this help');
      
      log('\nBrowser options:', 'bright');
      log('  chromium, firefox, webkit, "Mobile Chrome", "Mobile Safari"');
      
      log('\nExamples:', 'bright');
      log('  node scripts/test-runner.js setup');
      log('  node scripts/test-runner.js test');
      log('  node scripts/test-runner.js test:headed');
      log('  node scripts/test-runner.js test:browser firefox');
      log('  node scripts/test-runner.js test:grep "should validate"');
      log('  node scripts/test-runner.js report');
      break;
  }
}

// Run main function
if (require.main === module) {
  main();
}

module.exports = {
  checkPrerequisites,
  installDependencies,
  installBrowsers,
  runTests,
  showReport
};
