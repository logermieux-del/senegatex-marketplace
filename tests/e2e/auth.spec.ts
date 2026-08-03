import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should signup with valid credentials', async ({ page }) => {
    await page.click('a:has-text("S\'inscrire")');
    // Next.js dev-mode on-demand compilation can make the first navigation
    // to a not-yet-compiled route slow, especially under parallel workers.
    await expect(page).toHaveURL(/\/signup/, { timeout: 15000 });

    const email = `user${Date.now()}@test.com`;
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');
    await page.click('button:has-text("Create Account")');

    // Signup redirects to login (not home), with a registered flag
    await expect(page).toHaveURL(/\/login\?registered=true/);
  });

  test('should show error for duplicate email', async ({ page }) => {
    await page.click('a:has-text("S\'inscrire")');
    await page.fill('input[name="email"]', 'seller@example.com'); // From seed
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');
    await page.click('button:has-text("Create Account")');

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.click('a:has-text("Connexion")');
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });

    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');

    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.click('a:has-text("Connexion")');
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'WrongPassword');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
