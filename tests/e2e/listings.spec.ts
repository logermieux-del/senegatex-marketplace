import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Listings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display listings on homepage', async ({ page }) => {
    // Check if listings grid exists
    const listingsGrid = page.locator('[data-testid="listings-grid"]');
    await expect(listingsGrid).toBeVisible();

    // Check if at least one listing is visible
    const listingCards = page.locator('[data-testid="listing-card"]');
    await expect(listingCards.first()).toBeVisible();
  });

  test('should view listing detail', async ({ page }) => {
    // Click first listing
    await page.click('[data-testid="listing-card"]');

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/listings\/.+/);

    // Verify detail content
    await expect(page.locator('h1')).toBeVisible(); // Title
    await expect(page.locator('text=/\\d+k XOF/')).toBeVisible(); // Price
  });

  test('should search listings', async ({ page }) => {
    // Type in search
    await page.fill('[data-testid="search-input"]', 'iPhone');

    // Wait for results
    await page.waitForTimeout(400); // Debounce delay

    // Should show filtered results
    const results = page.locator('[data-testid="search-result"]');
    await expect(results).toHaveCount(1); // Only iPhone in seed
  });

  test('should filter by city', async ({ page }) => {
    // Open filter (if exists)
    const filterButton = page.locator('button:has-text("Filter")');
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.selectOption('select[name="city"]', 'Dakar');
      await page.click('button:has-text("Apply")');
    }

    // Verify results are filtered
    await expect(page).toHaveURL(/city=Dakar/);
  });

  test('should create new listing (logged in)', async ({ page, _context }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL);

    // Navigate to create
    await page.click('button:has-text("Start Selling")');
    await expect(page).toHaveURL(/\/create|\/new/);

    // Fill form
    await page.fill('input[name="title"]', 'MacBook Pro 2023');
    await page.fill('textarea[name="description"]', 'Barely used, mint condition');
    await page.selectOption('select[name="category"]', 'Electronics');
    await page.fill('input[name="price"]', '1200000');
    await page.selectOption('select[name="city"]', 'Dakar');

    // Submit
    await page.click('button:has-text("Publish Listing")');

    // Should show success
    await expect(page.locator('text=Listing published')).toBeVisible();
  });
});
