# Testing Documentation

This document provides comprehensive information about the testing setup and practices for the Bus Ticket Booking application.

## 🧪 Testing Overview

The application uses **Playwright** for end-to-end testing, providing comprehensive coverage of user interactions, form validations, and application functionality across multiple browsers and devices.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# View test report
npm run test:report
```

## 📁 Test Structure

```
tests/
├── signup.spec.js          # Signup page tests
├── login.spec.js           # Login page tests
├── homepage.spec.js        # Homepage tests
└── utils/
    └── test-helpers.js     # Test utility functions
```

## 🧩 Test Categories

### 1. Signup Page Tests (`signup.spec.js`)
- **Form Display**: All required fields are visible
- **Validation**: Email, password, name, phone validation
- **Password Strength**: Real-time password strength indicator
- **Social Login**: Social login button interactions
- **Accessibility**: Keyboard navigation and screen reader support
- **Mobile Responsiveness**: Mobile viewport testing
- **Error Handling**: Form validation and error messages
- **Loading States**: Loading indicators during submission

### 2. Login Page Tests (`login.spec.js`)
- **Form Display**: Login form elements
- **Demo Credentials**: Demo account information display
- **Validation**: Email and password validation
- **Authentication**: Successful and failed login scenarios
- **Password Visibility**: Toggle password visibility
- **Loading States**: Loading indicators during login
- **Navigation**: Links to signup and forgot password
- **Mobile Testing**: Mobile viewport compatibility

### 3. Homepage Tests (`homepage.spec.js`)
- **Page Display**: Main page elements and navigation
- **Search Functionality**: Trip search form
- **Responsive Design**: Mobile and desktop layouts
- **Theme Switching**: Dark/light mode toggle
- **Language Switching**: Internationalization support
- **Navigation**: Header and footer links
- **Interactive Elements**: Live chat, social buttons
- **Accessibility**: Keyboard navigation and ARIA labels

## 🛠️ Test Utilities

### Helper Functions (`tests/utils/test-helpers.js`)

#### Authentication Helpers
```javascript
// Login with demo credentials
await loginWithDemoCredentials(page);

// Fill signup form with test data
await fillSignupForm(page, {
  name: 'Test User',
  email: 'test@example.com',
  password: 'StrongPass123!'
});
```

#### Form Helpers
```javascript
// Fill search form
await fillSearchForm(page, {
  from: 'Addis Ababa',
  to: 'Adama',
  date: '2025-01-15'
});
```

#### Validation Helpers
```javascript
// Check field error
await expectFieldError(page, 'signup-email', 'Invalid email format');

// Check field is valid
await expectFieldValid(page, 'signup-email');
```

#### Utility Functions
```javascript
// Generate random test data
const email = generateRandomEmail();
const phone = generateRandomPhone();

// Take screenshots
await takeScreenshot(page, 'signup-form');

// Wait for toast notifications
await waitForToast(page, 'Account created successfully!');
```

## 🔧 Configuration

### Playwright Config (`playwright.config.js`)
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Parallel Execution**: Tests run in parallel for faster execution
- **Retry Logic**: Failed tests retry on CI
- **Reporting**: HTML, JSON, and JUnit reports
- **Screenshots**: Automatic screenshots on failure
- **Videos**: Video recording on failure
- **Traces**: Trace collection for debugging

### Production Config (`playwright.config.prod.js`)
- **Deployed Site Testing**: Tests against production URLs
- **No Local Server**: Tests run against live sites
- **Environment Variables**: Configurable base URLs

## 🚀 CI/CD Integration

### GitHub Actions (`.github/workflows/test.yml`)
- **Triggers**: Push to main/develop, pull requests
- **Environment**: Ubuntu latest with Node.js 18
- **Artifacts**: Test reports and screenshots
- **Parallel Jobs**: Local and production testing

### Workflow Steps
1. **Setup**: Node.js and dependencies
2. **Install**: Playwright browsers
3. **Test**: Run test suite
4. **Artifacts**: Upload test results

## 📊 Test Reports

### HTML Report
```bash
npm run test:report
```
- Interactive test results
- Screenshots and videos
- Trace viewer for debugging
- Test timeline and performance

### JSON Report
- Machine-readable test results
- Integration with CI/CD tools
- Custom reporting scripts

### JUnit Report
- Standard XML format
- Integration with test runners
- CI/CD compatibility

## 🎯 Best Practices

### Test Organization
- **Descriptive Names**: Clear test descriptions
- **Grouped Tests**: Related tests in describe blocks
- **Setup/Teardown**: Proper test isolation
- **Data Test IDs**: Consistent element selection

### Test Data
- **Random Data**: Generate unique test data
- **Cleanup**: Remove test data after tests
- **Isolation**: Tests don't depend on each other
- **Mocking**: Mock external dependencies

### Assertions
- **Specific Checks**: Test exact behavior
- **User Perspective**: Test from user's point of view
- **Error Cases**: Test error scenarios
- **Edge Cases**: Test boundary conditions

### Performance
- **Parallel Execution**: Run tests in parallel
- **Efficient Selectors**: Use stable selectors
- **Minimal Waits**: Use built-in waiting mechanisms
- **Resource Management**: Clean up resources

## 🔍 Debugging Tests

### Debug Mode
```bash
npm run test:debug
```
- Step-through debugging
- Browser inspection
- Real-time test execution

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```
- Detailed test execution
- Network requests
- DOM changes
- Screenshots and videos

### Screenshots and Videos
- **Automatic**: Captured on test failure
- **Manual**: Use `takeScreenshot()` helper
- **Storage**: Saved in `test-results/` directory

## 📱 Cross-Browser Testing

### Supported Browsers
- **Chrome**: Latest stable version
- **Firefox**: Latest stable version
- **Safari**: Latest stable version
- **Mobile Chrome**: Pixel 5 viewport
- **Mobile Safari**: iPhone 12 viewport

### Browser-Specific Tests
```javascript
test('should work in Firefox', async ({ page }) => {
  // Firefox-specific test logic
});

test('should work on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  // Mobile-specific test logic
});
```

## ♿ Accessibility Testing

### Basic Accessibility Checks
```javascript
// Test keyboard navigation
await testKeyboardNavigation(page, [
  '#email',
  '#password',
  'button[type="submit"]'
]);

// Test basic accessibility
await testBasicAccessibility(page);
```

### Accessibility Features Tested
- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader Support**: Proper ARIA labels
- **Color Contrast**: Sufficient contrast ratios
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading structure

## 📱 Responsive Testing

### Viewport Testing
```javascript
// Test mobile viewport
await testResponsiveDesign(page, { width: 375, height: 667 });

// Test tablet viewport
await testResponsiveDesign(page, { width: 768, height: 1024 });
```

### Responsive Features Tested
- **Mobile Menu**: Collapsible navigation
- **Touch Targets**: Adequate button sizes
- **Text Scaling**: Readable text at all sizes
- **Layout Adaptation**: Proper element positioning

## 🚨 Error Handling

### Network Error Testing
```javascript
// Mock API errors
await mockApiError(page, '**/api/auth/login', 500);

// Test error handling
await page.click('button[type="submit"]');
await expect(page.locator('text=Login failed')).toBeVisible();
```

### Form Validation Testing
```javascript
// Test required field validation
await page.click('button[type="submit"]');
await expect(page.locator('text=Email is required')).toBeVisible();

// Test format validation
await page.fill('#email', 'invalid-email');
await expect(page.locator('text=Invalid email format')).toBeVisible();
```

## 📈 Performance Testing

### Load Time Testing
```javascript
test('should load within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(3000); // 3 seconds
});
```

### Memory Usage Testing
```javascript
test('should not have memory leaks', async ({ page }) => {
  const initialMemory = await page.evaluate(() => performance.memory.usedJSHeapSize);
  
  // Perform actions that might cause memory leaks
  for (let i = 0; i < 10; i++) {
    await page.goto('/');
  }
  
  const finalMemory = await page.evaluate(() => performance.memory.usedJSHeapSize);
  const memoryIncrease = finalMemory - initialMemory;
  
  expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
});
```

## 🔄 Continuous Testing

### Pre-commit Hooks
```bash
# Run tests before commit
npm run test

# Run linting
npm run lint
```

### Pull Request Checks
- **Automated Testing**: All tests run on PR
- **Code Coverage**: Coverage reports generated
- **Performance Checks**: Performance regression testing
- **Security Scanning**: Security vulnerability checks

## 📚 Additional Resources

### Playwright Documentation
- [Playwright Getting Started](https://playwright.dev/docs/intro)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

### Testing Patterns
- [Page Object Model](https://playwright.dev/docs/pom)
- [Test Data Management](https://playwright.dev/docs/test-data)
- [API Testing](https://playwright.dev/docs/api-testing)

### CI/CD Integration
- [GitHub Actions](https://docs.github.com/en/actions)
- [Playwright CI](https://playwright.dev/docs/ci)
- [Test Reporting](https://playwright.dev/docs/test-reporters)

## 🎯 Next Steps

### Planned Improvements
1. **API Testing**: Add comprehensive API endpoint testing
2. **Visual Regression**: Implement visual regression testing
3. **Performance Testing**: Add performance benchmarks
4. **Security Testing**: Add security vulnerability tests
5. **Accessibility Testing**: Add comprehensive a11y testing
6. **Internationalization**: Add multi-language testing
7. **Offline Testing**: Add offline functionality testing
8. **Progressive Web App**: Add PWA testing

### Test Coverage Goals
- **Unit Tests**: 90% code coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: All user journeys
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **Performance Tests**: Core Web Vitals
- **Security Tests**: OWASP Top 10

This comprehensive testing setup ensures the Bus Ticket Booking application is robust, reliable, and provides an excellent user experience across all platforms and browsers.
