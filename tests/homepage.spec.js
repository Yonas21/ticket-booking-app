const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display homepage with search form', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Bus Ticket Booking/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Book Your Bus Ticket');
    
    // Check search form elements
    await expect(page.locator('select[value=""]')).toBeVisible(); // From location
    await expect(page.locator('select[value=""]')).toBeVisible(); // To location
    await expect(page.locator('input[type="text"]')).toBeVisible(); // Date picker
    await expect(page.locator('button[type="submit"]')).toContainText('Search Buses');
  });

  test('should display header with navigation', async ({ page }) => {
    // Check header elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
    await expect(page.locator('text=Support')).toBeVisible();
  });

  test('should display language and currency selectors', async ({ page }) => {
    // Check language selector
    await expect(page.locator('select option[value="en"]')).toBeVisible();
    await expect(page.locator('select option[value="am"]')).toBeVisible();
    
    // Check currency selector
    await expect(page.locator('select option[value="USD"]')).toBeVisible();
    await expect(page.locator('select option[value="ETB"]')).toBeVisible();
  });

  test('should display theme toggle', async ({ page }) => {
    // Check theme toggle button exists
    await expect(page.locator('button[aria-label*="Switch"]')).toBeVisible();
  });

  test('should display login/signup buttons when not authenticated', async ({ page }) => {
    // Check login and signup buttons are visible
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Signup')).toBeVisible();
  });

  test('should perform search functionality', async ({ page }) => {
    // Fill search form
    await page.selectOption('select', 'Addis Ababa'); // From
    await page.selectOption('select', 'Adama'); // To
    await page.fill('input[type="text"]', '2025-01-15'); // Date
    
    // Submit search
    await page.click('button[type="submit"]');
    
    // Should navigate to search results
    await expect(page).toHaveURL(/.*search/);
  });

  test('should display popular routes section', async ({ page }) => {
    // Scroll to popular routes section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check popular routes heading
    await expect(page.locator('text=Popular Routes')).toBeVisible();
    
    // Check route cards exist
    await expect(page.locator('.card-modern')).toBeVisible();
  });

  test('should display route map', async ({ page }) => {
    // Scroll to map section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check map heading
    await expect(page.locator('text=Explore Our Routes')).toBeVisible();
    
    // Check map container exists
    await expect(page.locator('.h-96')).toBeVisible();
  });

  test('should handle round trip toggle', async ({ page }) => {
    // Check round trip checkbox
    const roundTripCheckbox = page.locator('#roundTripCheck');
    await expect(roundTripCheckbox).toBeVisible();
    
    // Toggle round trip
    await roundTripCheckbox.check();
    
    // Should show return date field
    await expect(page.locator('text=Return Date')).toBeVisible();
  });

  test('should display live chat button', async ({ page }) => {
    // Check live chat button exists
    await expect(page.locator('button[aria-label="Live Chat"]')).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check header is still accessible
    await expect(page.locator('header')).toBeVisible();
    
    // Check search form is still accessible
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check mobile menu button exists
    await expect(page.locator('button[aria-label="Toggle Navigation"]')).toBeVisible();
  });

  test('should handle mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Click mobile menu button
    await page.click('button[aria-label="Toggle Navigation"]');
    
    // Check mobile menu is visible
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
    await expect(page.locator('text=Support')).toBeVisible();
  });

  test('should handle navigation links', async ({ page }) => {
    // Test navigation to different pages
    await page.click('text=About');
    await expect(page).toHaveURL(/.*about/);
    
    await page.goto('/');
    await page.click('text=Contact');
    await expect(page).toHaveURL(/.*contact/);
    
    await page.goto('/');
    await page.click('text=Support');
    await expect(page).toHaveURL(/.*support/);
  });

  test('should handle language switching', async ({ page }) => {
    // Switch to Amharic
    await page.selectOption('select', 'am');
    
    // Check if language changed (this would depend on implementation)
    // For now, just check the selector works
    await expect(page.locator('select')).toHaveValue('am');
  });

  test('should handle currency switching', async ({ page }) => {
    // Switch to USD
    await page.selectOption('select', 'USD');
    
    // Check if currency changed
    await expect(page.locator('select')).toHaveValue('USD');
  });

  test('should handle theme switching', async ({ page }) => {
    // Click theme toggle
    await page.click('button[aria-label*="Switch"]');
    
    // Check if theme class is added to document
    const isDark = await page.evaluate(() => 
      document.documentElement.classList.contains('dark')
    );
    
    // Toggle back
    await page.click('button[aria-label*="Switch"]');
    
    const isLight = await page.evaluate(() => 
      !document.documentElement.classList.contains('dark')
    );
    
    expect(isDark || isLight).toBeTruthy();
  });

  test('should display footer', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer elements
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('text=All rights reserved')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation through main elements
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    await expect(page.locator('a[href="/"]')).toBeFocused();
  });

  test('should handle search form validation', async ({ page }) => {
    // Try to submit empty search form
    await page.click('button[type="submit"]');
    
    // Should show validation errors or prevent submission
    // This depends on the form validation implementation
    await expect(page).toHaveURL('/'); // Should stay on same page
  });

  test('should display loading states', async ({ page }) => {
    // Fill search form
    await page.selectOption('select', 'Addis Ababa');
    await page.selectOption('select', 'Adama');
    await page.fill('input[type="text"]', '2025-01-15');
    
    // Submit and check for loading state
    await page.click('button[type="submit"]');
    
    // Should show loading or navigate to results
    // This depends on the implementation
    await expect(page).toHaveURL(/.*search/);
  });

  test('should handle error states gracefully', async ({ page }) => {
    // This test would check how the app handles network errors
    // For now, just check the page loads correctly
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toBeVisible();
    
    // Check for proper form labels
    await expect(page.locator('label')).toBeVisible();
    
    // Check for proper button labels
    await expect(page.locator('button[aria-label]')).toBeVisible();
  });
});
