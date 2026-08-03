import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Listings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display listings on homepage', async ({ page }) => {
    const listingsGrid = page.locator('[data-testid="listings-grid"]');
    await expect(listingsGrid).toBeVisible();

    const listingCards = page.locator('[data-testid="listing-card"]');
    await expect(listingCards.first()).toBeVisible();
  });

  test('should view listing detail', async ({ page }) => {
    await page.click('[data-testid="listing-card"]');

    await expect(page).toHaveURL(/\/listings\/.+/);

    await expect(page.locator('h1')).toBeVisible(); // Title
    await expect(page.locator('text=/\\d+k XOF/')).toBeVisible(); // Price
  });

  test('should search listings', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'iPhone');

    // Debounce (300ms) + network round trip
    await expect(page.locator('[data-testid="listing-card"]')).toHaveCount(1, {
      timeout: 5000,
    });
    await expect(page.locator('[data-testid="listing-card"]')).toContainText('iPhone');
  });

  test('should filter by city', async ({ page }) => {
    const cards = page.locator('[data-testid="listing-card"]');
    await expect(cards.first()).toBeVisible();
    const totalCount = await cards.count();

    await page.selectOption('[data-testid="city-select"]', 'Thiès');

    await page.waitForTimeout(500); // Debounce delay
    const filteredCount = await cards.count();
    expect(filteredCount).toBeLessThan(totalCount);
    expect(filteredCount).toBeGreaterThan(0);
    await expect(cards.first()).toContainText('Thiès');
  });

  test('should create new listing (logged in)', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL + '/');

    // Navigate to create via the header "Vendre" link
    await page.click('a[href="/listings/create"]');
    await expect(page).toHaveURL(/\/listings\/create/);

    // Fill form
    await page.fill('input[name="title"]', 'MacBook Pro 2023 Test');
    await page.fill('textarea[name="description"]', 'Barely used, mint condition');
    await page.selectOption('select[name="category"]', 'electronics');
    await page.fill('input[name="price"]', '1200000');
    await page.selectOption('select[name="city"]', 'Dakar');

    await page.click('button:has-text("Publish Listing")');

    await expect(page.locator('text=Listing published')).toBeVisible();
  });
});
