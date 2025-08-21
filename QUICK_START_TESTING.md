# Quick Start Testing Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npm run test:install
```

### 3. Run Tests
```bash
# Run all tests
npm test

# Or use the test runner
node scripts/test-runner.js test
```

## 🎯 Quick Test Commands

### Basic Testing
```bash
# Run all tests
npm test

# Run tests with UI (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug
```

### Specific Test Files
```bash
# Run only signup tests
npx playwright test tests/signup.spec.js

# Run only login tests
npx playwright test tests/login.spec.js

# Run only homepage tests
npx playwright test tests/homepage.spec.js
```

### Specific Browsers
```bash
# Run tests in Chrome only
npx playwright test --project=chromium

# Run tests in Firefox only
npx playwright test --project=firefox

# Run tests in Safari only
npx playwright test --project=webkit

# Run tests on mobile
npx playwright test --project="Mobile Chrome"
```

### Test Runner Script
```bash
# Setup test environment
node scripts/test-runner.js setup

# Run all tests
node scripts/test-runner.js test

# Run tests in headed mode
node scripts/test-runner.js test:headed

# Run tests in specific browser
node scripts/test-runner.js test:browser firefox

# Run tests matching pattern
node scripts/test-runner.js test:grep "should validate"

# Open test report
node scripts/test-runner.js report
```

## 📊 View Test Results

### HTML Report
```bash
npm run test:report
```
- Interactive test results
- Screenshots and videos
- Trace viewer for debugging

### Test Results Location
```
test-results/
├── screenshots/          # Screenshots on failure
├── videos/              # Video recordings
├── traces/              # Trace files for debugging
└── results.json         # JSON test results
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Browsers Not Installed
```bash
npm run test:install
```

#### 2. Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

#### 3. Tests Failing
```bash
# Run in debug mode to see what's happening
npm run test:debug
```

#### 4. Slow Tests
```bash
# Run tests in parallel (faster)
npx playwright test --workers=4
```

### Debug Mode
```bash
# Run in debug mode
npm run test:debug

# This will:
# - Open browser in headed mode
# - Pause on each step
# - Allow manual inspection
```

## 📱 Test Coverage

### What's Tested
- ✅ **Signup Page**: 18 comprehensive tests
- ✅ **Login Page**: 15 comprehensive tests  
- ✅ **Homepage**: 20 comprehensive tests
- ✅ **Cross-browser**: Chrome, Firefox, Safari, Mobile
- ✅ **Responsive**: Mobile and desktop layouts
- ✅ **Accessibility**: Keyboard navigation, ARIA
- ✅ **Form Validation**: Real-time validation
- ✅ **Error Handling**: Network errors, validation errors

### Test Categories
- **Form Validation**: Email, password, name validation
- **User Interactions**: Clicks, typing, navigation
- **Responsive Design**: Mobile and desktop layouts
- **Accessibility**: Keyboard navigation, screen readers
- **Error Scenarios**: Network failures, validation errors
- **Loading States**: Spinners, loading indicators
- **Success Flows**: Complete user journeys

## 🚀 CI/CD Integration

### GitHub Actions
Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Manual workflow triggers

### Local CI
```bash
# Run tests like CI
npx playwright test --reporter=html,json,junit
```

## 📚 Next Steps

### 1. Explore Test Files
- `tests/signup.spec.js` - Signup page tests
- `tests/login.spec.js` - Login page tests
- `tests/homepage.spec.js` - Homepage tests
- `tests/utils/test-helpers.js` - Utility functions

### 2. Read Documentation
- `TESTING.md` - Comprehensive testing guide
- `SIGNUP_AND_TESTING_IMPROVEMENTS.md` - Improvement summary

### 3. Add New Tests
```bash
# Generate test file
npx playwright codegen http://localhost:5173

# This opens Playwright Inspector
# Record your actions to generate test code
```

### 4. Customize Configuration
- `playwright.config.js` - Main configuration
- `playwright.config.prod.js` - Production testing

## 🎯 Best Practices

### Writing Tests
1. **Use descriptive names**: `should validate email format`
2. **Test user perspective**: Focus on user actions
3. **Use data-testid**: Stable element selection
4. **Test error cases**: Don't just test happy path
5. **Keep tests independent**: Each test should be standalone

### Running Tests
1. **Start with UI mode**: `npm run test:ui` for development
2. **Use debug mode**: `npm run test:debug` for troubleshooting
3. **Run specific tests**: Use `--grep` for focused testing
4. **Check reports**: Always review test results

### Debugging
1. **Use trace viewer**: `npx playwright show-trace`
2. **Check screenshots**: Look at failure screenshots
3. **Review videos**: Watch test execution videos
4. **Use debug mode**: Step through test execution

## 📞 Support

### Documentation
- [Playwright Docs](https://playwright.dev/docs/intro)
- [Testing Guide](TESTING.md)
- [Improvements Summary](SIGNUP_AND_TESTING_IMPROVEMENTS.md)

### Common Commands Reference
```bash
# Setup
npm install
npm run test:install

# Run Tests
npm test                    # All tests
npm run test:ui            # Interactive UI
npm run test:headed        # See browser
npm run test:debug         # Debug mode

# Reports
npm run test:report        # Open HTML report

# Specific Tests
npx playwright test tests/signup.spec.js
npx playwright test --grep "validation"
npx playwright test --project=firefox

# Test Runner
node scripts/test-runner.js setup
node scripts/test-runner.js test
node scripts/test-runner.js test:headed
```

Happy Testing! 🎉
