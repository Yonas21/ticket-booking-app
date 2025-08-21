const { test, expect } = require('@playwright/test');

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display signup form with all required fields', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Bus Ticket Booking/);
    
    // Check main heading
    await expect(page.locator('h2')).toContainText('Create Account');
    
    // Check form fields exist
    await expect(page.locator('[data-testid="signup-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-confirm-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-phone"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-terms"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-submit"]')).toBeVisible();
  });

  test('should display social login options', async ({ page }) => {
    await expect(page.locator('[data-testid="google-signup"]')).toBeVisible();
    await expect(page.locator('[data-testid="facebook-signup"]')).toBeVisible();
    await expect(page.locator('[data-testid="github-signup"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('[data-testid="signup-submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Full Name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
    await expect(page.locator('text=Please confirm your password')).toBeVisible();
    await expect(page.locator('text=You must accept the terms and conditions')).toBeVisible();
  });

  test('should validate name field', async ({ page }) => {
    // Test short name
    await page.fill('[data-testid="signup-name"]', 'A');
    await page.click('[data-testid="signup-submit"]');
    await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible();
    
    // Test valid name
    await page.fill('[data-testid="signup-name"]', 'John Doe');
    await expect(page.locator('text=Name must be at least 2 characters')).not.toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Test invalid email
    await page.fill('[data-testid="signup-email"]', 'invalid-email');
    await page.click('[data-testid="signup-submit"]');
    await expect(page.locator('text=Invalid email format')).toBeVisible();
    
    // Test valid email
    await page.fill('[data-testid="signup-email"]', 'test@example.com');
    await expect(page.locator('text=Invalid email format')).not.toBeVisible();
  });

  test('should validate phone number format', async ({ page }) => {
    // Test invalid phone
    await page.fill('[data-testid="signup-phone"]', '123');
    await page.click('[data-testid="signup-submit"]');
    await expect(page.locator('text=Please enter a valid phone number')).toBeVisible();
    
    // Test valid phone
    await page.fill('[data-testid="signup-phone"]', '+1234567890');
    await expect(page.locator('text=Please enter a valid phone number')).not.toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    // Test weak password
    await page.fill('[data-testid="signup-password"]', '123');
    await expect(page.locator('text=Weak')).toBeVisible();
    await expect(page.locator('text=At least 8 characters')).toBeVisible();
    
    // Test strong password
    await page.fill('[data-testid="signup-password"]', 'StrongPass123!');
    await expect(page.locator('text=Strong')).toBeVisible();
    await expect(page.locator('text=At least 8 characters')).not.toBeVisible();
  });

  test('should validate password confirmation', async ({ page }) => {
    await page.fill('[data-testid="signup-password"]', 'password123');
    await page.fill('[data-testid="signup-confirm-password"]', 'different');
    
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    
    await page.fill('[data-testid="signup-confirm-password"]', 'password123');
    await expect(page.locator('text=Passwords match')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.fill('[data-testid="signup-password"]', 'password123');
    
    // Check password is hidden by default
    await expect(page.locator('[data-testid="signup-password"]')).toHaveAttribute('type', 'password');
    
    // Toggle password visibility
    await page.click('[data-testid="toggle-password"]');
    await expect(page.locator('[data-testid="signup-password"]')).toHaveAttribute('type', 'text');
    
    // Toggle back
    await page.click('[data-testid="toggle-password"]');
    await expect(page.locator('[data-testid="signup-password"]')).toHaveAttribute('type', 'password');
  });

  test('should toggle confirm password visibility', async ({ page }) => {
    await page.fill('[data-testid="signup-confirm-password"]', 'password123');
    
    // Check password is hidden by default
    await expect(page.locator('[data-testid="signup-confirm-password"]')).toHaveAttribute('type', 'password');
    
    // Toggle password visibility
    await page.click('[data-testid="toggle-confirm-password"]');
    await expect(page.locator('[data-testid="signup-confirm-password"]')).toHaveAttribute('type', 'text');
    
    // Toggle back
    await page.click('[data-testid="toggle-confirm-password"]');
    await expect(page.locator('[data-testid="signup-confirm-password"]')).toHaveAttribute('type', 'password');
  });

  test('should require terms acceptance', async ({ page }) => {
    // Fill all required fields
    await page.fill('[data-testid="signup-name"]', 'John Doe');
    await page.fill('[data-testid="signup-email"]', 'test@example.com');
    await page.fill('[data-testid="signup-password"]', 'StrongPass123!');
    await page.fill('[data-testid="signup-confirm-password"]', 'StrongPass123!');
    
    // Try to submit without accepting terms
    await page.click('[data-testid="signup-submit"]');
    await expect(page.locator('text=You must accept the terms and conditions')).toBeVisible();
    
    // Accept terms and submit
    await page.check('[data-testid="signup-terms"]');
    await page.click('[data-testid="signup-submit"]');
    
    // Should redirect to login page on success
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle social login clicks', async ({ page }) => {
    // Test Google signup
    await page.click('[data-testid="google-signup"]');
    await expect(page.locator('text=Social login not implemented yet for Google')).toBeVisible();
    
    // Test Facebook signup
    await page.click('[data-testid="facebook-signup"]');
    await expect(page.locator('text=Social login not implemented yet for Facebook')).toBeVisible();
    
    // Test GitHub signup
    await page.click('[data-testid="github-signup"]');
    await expect(page.locator('text=Social login not implemented yet for GitHub')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should open terms and privacy links in new tab', async ({ page }) => {
    // Check terms link
    const termsLink = page.locator('a[href="/terms"]');
    await expect(termsLink).toHaveAttribute('target', '_blank');
    await expect(termsLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check privacy link
    const privacyLink = page.locator('a[href="/privacy"]');
    await expect(privacyLink).toHaveAttribute('target', '_blank');
    await expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should show loading state during submission', async ({ page }) => {
    // Fill form
    await page.fill('[data-testid="signup-name"]', 'John Doe');
    await page.fill('[data-testid="signup-email"]', 'test@example.com');
    await page.fill('[data-testid="signup-password"]', 'StrongPass123!');
    await page.fill('[data-testid="signup-confirm-password"]', 'StrongPass123!');
    await page.check('[data-testid="signup-terms"]');
    
    // Submit and check loading state
    await page.click('[data-testid="signup-submit"]');
    await expect(page.locator('text=Creating account...')).toBeVisible();
    await expect(page.locator('[data-testid="signup-submit"]')).toBeDisabled();
  });

  test('should clear validation errors when user starts typing', async ({ page }) => {
    // Trigger validation error
    await page.click('[data-testid="signup-submit"]');
    await expect(page.locator('text=Full Name is required')).toBeVisible();
    
    // Start typing in name field
    await page.fill('[data-testid="signup-name"]', 'John');
    await expect(page.locator('text=Full Name is required')).not.toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check form is still accessible
    await expect(page.locator('[data-testid="signup-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-password"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-confirm-password"]')).toBeVisible();
    
    // Check social buttons are still visible
    await expect(page.locator('[data-testid="google-signup"]')).toBeVisible();
    await expect(page.locator('[data-testid="facebook-signup"]')).toBeVisible();
    await expect(page.locator('[data-testid="github-signup"]')).toBeVisible();
  });
});
