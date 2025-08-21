/**
 * Test utility functions for Playwright tests
 */



/**
 * Wait for page to be fully loaded
 * @param {import('@playwright/test').Page} page 
 */
const { expect } = require('@playwright/test');

export async function waitForPageLoad(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Fill login form with demo credentials
 * @param {import('@playwright/test').Page} page 
 */
export async function loginWithDemoCredentials(page) {
  await page.fill('#email', 'demo@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

/**
 * Fill signup form with test data
 * @param {import('@playwright/test').Page} page 
 * @param {Object} data - Form data
 */
export async function fillSignupForm(page, data = {}) {
  const defaultData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
    ...data
  };

  await page.fill('[data-testid="signup-name"]', defaultData.name);
  await page.fill('[data-testid="signup-email"]', defaultData.email);
  await page.fill('[data-testid="signup-phone"]', defaultData.phone);
  await page.fill('[data-testid="signup-password"]', defaultData.password);
  await page.fill('[data-testid="signup-confirm-password"]', defaultData.confirmPassword);
  await page.check('[data-testid="signup-terms"]');
}

/**
 * Fill search form with test data
 * @param {import('@playwright/test').Page} page 
 * @param {Object} data - Search data
 */
export async function fillSearchForm(page, data = {}) {
  const defaultData = {
    from: 'Addis Ababa',
    to: 'Adama',
    date: '2025-01-15',
    ...data
  };

  await page.selectOption('select', defaultData.from);
  await page.selectOption('select', defaultData.to);
  await page.fill('input[type="text"]', defaultData.date);
}

/**
 * Take screenshot with timestamp
 * @param {import('@playwright/test').Page} page 
 * @param {string} name - Screenshot name
 */
export async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}

/**
 * Generate random email
 * @returns {string} Random email
 */
export function generateRandomEmail() {
  const timestamp = Date.now();
  return `test-${timestamp}@example.com`;
}

/**
 * Generate random phone number
 * @returns {string} Random phone number
 */
export function generateRandomPhone() {
  const timestamp = Date.now().toString().slice(-10);
  return `+1${timestamp}`;
}

/**
 * Wait for toast notification
 * @param {import('@playwright/test').Page} page 
 * @param {string} message - Expected toast message
 */
export async function waitForToast(page, message) {
  await page.waitForSelector(`text=${message}`, { timeout: 5000 });
}

/**
 * Check if element is visible and enabled
 * @param {import('@playwright/test').Locator} locator 
 */
export async function expectElementToBeVisibleAndEnabled(locator) {
  await expect(locator).toBeVisible();
  await expect(locator).toBeEnabled();
}

/**
 * Check if form field has error
 * @param {import('@playwright/test').Page} page 
 * @param {string} fieldName - Field name
 * @param {string} errorMessage - Expected error message
 */
export async function expectFieldError(page, fieldName, errorMessage) {
  await expect(page.locator(`text=${errorMessage}`)).toBeVisible();
  await expect(page.locator(`[data-testid="${fieldName}"]`)).toHaveClass(/border-red-500/);
}

/**
 * Check if form field is valid
 * @param {import('@playwright/test').Page} page 
 * @param {string} fieldName - Field name
 */
export async function expectFieldValid(page, fieldName) {
  await expect(page.locator(`[data-testid="${fieldName}"]`)).not.toHaveClass(/border-red-500/);
}

/**
 * Mock API response
 * @param {import('@playwright/test').Page} page 
 * @param {string} url - API URL pattern
 * @param {Object} response - Mock response
 */
export async function mockApiResponse(page, url, response) {
  await page.route(url, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
}

/**
 * Mock API error
 * @param {import('@playwright/test').Page} page 
 * @param {string} url - API URL pattern
 * @param {number} status - HTTP status code
 */
export async function mockApiError(page, url, status = 500) {
  await page.route(url, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Mock error' })
    });
  });
}

/**
 * Test accessibility with basic checks
 * @param {import('@playwright/test').Page} page 
 */
export async function testBasicAccessibility(page) {
  // Check for proper heading structure
  await expect(page.locator('h1')).toBeVisible();
  
  // Check for proper form labels
  await expect(page.locator('label')).toBeVisible();
  
  // Check for proper button labels
  await expect(page.locator('button[aria-label]')).toBeVisible();
  
  // Check for proper link text
  await expect(page.locator('a')).not.toHaveText('');
}

/**
 * Test responsive design
 * @param {import('@playwright/test').Page} page 
 * @param {Object} viewport - Viewport size
 */
export async function testResponsiveDesign(page, viewport = { width: 375, height: 667 }) {
  await page.setViewportSize(viewport);
  
  // Check if main elements are still accessible
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
}

/**
 * Test keyboard navigation
 * @param {import('@playwright/test').Page} page 
 * @param {string[]} selectors - Array of selectors to test
 */
export async function testKeyboardNavigation(page, selectors) {
  for (const selector of selectors) {
    await page.keyboard.press('Tab');
    await expect(page.locator(selector)).toBeFocused();
  }
}

/**
 * Wait for loading state to complete
 * @param {import('@playwright/test').Page} page 
 */
export async function waitForLoadingComplete(page) {
  await page.waitForSelector('.loading-spinner', { state: 'hidden', timeout: 10000 });
}

/**
 * Check if user is logged in
 * @param {import('@playwright/test').Page} page 
 */
export async function isUserLoggedIn(page) {
  try {
    await page.waitForSelector('text=Welcome', { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Logout user if logged in
 * @param {import('@playwright/test').Page} page 
 */
export async function logoutIfLoggedIn(page) {
  if (await isUserLoggedIn(page)) {
    await page.click('text=Logout');
    await page.waitForURL('/');
  }
}
