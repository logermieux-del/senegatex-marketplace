import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should signup with valid credentials', async ({ page }) => {
    // Navigate to signup
    await page.click('a:has-text("Sign Up")');
    await expect(page).toHaveURL(/\/signup/);

    // Fill form
    const email = `user${Date.now()}@test.com`;
    await page.fill('input[type="email"]', email);
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');

    // Submit
    await page.click('button:has-text("Create Account")');

    // Should redirect to home
    await expect(page).toHaveURL(BASE_URL);
  });

  test('should show error for duplicate email', async ({ page }) => {
    const email = 'seller@example.com'; // From seed

    await page.click('a:has-text("Sign Up")');
    await page.fill('input[type="email"]', email);
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');
    await page.click('button:has-text("Create Account")');

    // Should show error
    await expect(page.locator('text=already exists')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.click('a:has-text("Login")');
    await expect(page).toHaveURL(/\/login/);

    // Fill form
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'Password123');

    // Submit
    await page.click('button:has-text("Sign In")');

    // Should redirect to home
    await expect(page).toHaveURL(BASE_URL);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('a:has-text("Login")');
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'WrongPassword');
    await page.click('button:has-text("Sign In")');

    // Should show error
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
