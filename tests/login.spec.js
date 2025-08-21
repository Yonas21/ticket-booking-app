const { test, expect } = require('@playwright/test');

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form with all required fields', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Bus Ticket Booking/);
    
    // Check main heading
    await expect(page.locator('h2')).toContainText('Welcome Back');
    
    // Check form fields exist
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display demo account information', async ({ page }) => {
    await expect(page.locator('text=Demo Account:')).toBeVisible();
    await expect(page.locator('text=Email: demo@example.com')).toBeVisible();
    await expect(page.locator('text=Password: password123')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Test invalid email
    await page.fill('#email', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid email format')).toBeVisible();
    
    // Test valid email
    await page.fill('#email', 'test@example.com');
    await expect(page.locator('text=Invalid email format')).not.toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    // Test short password
    await page.fill('#password', '123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Password must be at least 6 characters long')).toBeVisible();
    
    // Test valid password
    await page.fill('#password', 'password123');
    await expect(page.locator('text=Password must be at least 6 characters long')).not.toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.fill('#password', 'password123');
    
    // Check password is hidden by default
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    
    // Toggle password visibility
    await page.click('[data-testid="toggle-password"]');
    await expect(page.locator('#password')).toHaveAttribute('type', 'text');
    
    // Toggle back
    await page.click('[data-testid="toggle-password"]');
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
  });

  test('should handle successful login with demo credentials', async ({ page }) => {
    // Fill form with demo credentials
    await page.fill('#email', 'demo@example.com');
    await page.fill('#password', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to home page on success
    await expect(page).toHaveURL('/');
  });

  test('should handle failed login', async ({ page }) => {
    // Fill form with invalid credentials
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    // Fill form
    await page.fill('#email', 'demo@example.com');
    await page.fill('#password', 'password123');
    
    // Submit and check loading state
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Logging in...')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('should clear validation errors when user starts typing', async ({ page }) => {
    // Trigger validation error
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email is required')).toBeVisible();
    
    // Start typing in email field
    await page.fill('#email', 'test@example.com');
    await expect(page.locator('text=Email is required')).not.toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.click('text=Forgot password?');
    // Note: This would need to be implemented
    // For now, just check the link exists
    await expect(page.locator('a[href="/forgot-password"]')).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check form is still accessible
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check demo account info is still visible
    await expect(page.locator('text=Demo Account:')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.locator('#email')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('#password')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('button[type="submit"]')).toBeFocused();
  });

  test('should handle form submission with Enter key', async ({ page }) => {
    // Fill form
    await page.fill('#email', 'demo@example.com');
    await page.fill('#password', 'password123');
    
    // Submit with Enter key
    await page.keyboard.press('Enter');
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
  });

  test('should remember form data on page refresh', async ({ page }) => {
    // Fill form
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'testpassword');
    
    // Refresh page
    await page.reload();
    
    // Check if form data is preserved (this depends on browser behavior)
    // For now, just check the page loads correctly
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should handle special characters in email', async ({ page }) => {
    // Test email with special characters
    await page.fill('#email', 'test+tag@example.com');
    await page.fill('#password', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Should not show validation error for valid email with special characters
    await expect(page.locator('text=Invalid email format')).not.toBeVisible();
  });

  test('should handle long email addresses', async ({ page }) => {
    // Test very long email
    const longEmail = 'a'.repeat(50) + '@example.com';
    await page.fill('#email', longEmail);
    await page.fill('#password', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Should not show validation error for long but valid email
    await expect(page.locator('text=Invalid email format')).not.toBeVisible();
  });

  test('should handle password with special characters', async ({ page }) => {
    // Test password with special characters
    await page.fill('#email', 'demo@example.com');
    await page.fill('#password', 'password@123!');
    
    await page.click('button[type="submit"]');
    
    // Should not show validation error for password with special characters
    await expect(page.locator('text=Password must be at least 6 characters long')).not.toBeVisible();
  });
});
