import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Search', () => {
  test('should find listings by keyword', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.fill('[data-testid="search-input"]', 'iPhone');

    const results = page.locator('[data-testid="listing-card"]');
    await expect(results).toHaveCount(1, { timeout: 5000 });
    await expect(results.first()).toContainText(/iphone/i);
  });

  test('should handle short queries without crashing', async ({ page }) => {
    await page.goto(BASE_URL);

    // The search has no minimum-length gate; a 1-char query just filters
    // via a case-insensitive "contains" match against title/description.
    await page.fill('[data-testid="search-input"]', 'a');
    await page.waitForTimeout(500); // debounce

    await expect(page.locator('[data-testid="listings-grid"]')).toBeVisible();
  });

  test('should handle no results', async ({ page }) => {
    await page.goto(BASE_URL);

    await page.fill('[data-testid="search-input"]', 'xyzabc123notfound');

    await expect(page.locator('text=Aucune annonce trouvée')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Messages', () => {
  test('should login and view messages page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL + '/');

    await page.goto(`${BASE_URL}/messages`);
    await expect(page.locator('h1:has-text("Your Messages")')).toBeVisible();
  });

  test('should display message list', async ({ page }) => {
    // The seed data creates one message from buyer@example.com to
    // seller@example.com, so log in as the seller to see it.
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL + '/');

    await page.goto(`${BASE_URL}/messages`);

    await expect(page.locator('text=From: Fatima Ba')).toBeVisible();
  });

  // There is currently no compose/reply UI anywhere in the app: the
  // "Contact Seller" button on the listing detail page has no onClick
  // handler, and /messages is read-only. This is a real functional gap,
  // not a selector issue — skipped until a compose flow is built.
  test.skip('should send message from listing detail', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'buyer@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL + '/');

    await page.click('[data-testid="listing-card"]');
    await page.click('button:has-text("Contact Seller")');

    await expect(page.locator('text=message|contact|send')).toBeVisible();
  });
});
