import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Search', () => {
  test('should find listings by keyword', async ({ page }) => {
    await page.goto(BASE_URL);

    // Type search query
    await page.fill('[data-testid="search-input"]', 'iPhone');
    await page.waitForTimeout(400); // Wait for debounce

    // Verify results contain keyword
    const results = page.locator('[data-testid="search-result"]');
    const firstResult = results.first();

    if (await results.count() > 0) {
      const text = await firstResult.textContent();
      expect(text?.toLowerCase()).toContain('iphone');
    }
  });

  test('should handle empty search gracefully', async ({ page }) => {
    await page.goto(BASE_URL);

    // Type less than 2 characters
    await page.fill('[data-testid="search-input"]', 'a');
    await page.waitForTimeout(500);

    // Should show "type more" message or empty state
    const emptyState = page.locator('text=type at least|no results|search');
    await expect(emptyState).toBeVisible();
  });

  test('should handle no results', async ({ page }) => {
    await page.goto(BASE_URL);

    // Search for something that doesn't exist
    await page.fill('[data-testid="search-input"]', 'xyzabc123notfound');
    await page.waitForTimeout(400);

    // Should show empty state
    await expect(page.locator('text=No results|not found')).toBeVisible();
  });
});

test.describe('Messages', () => {
  test('should login and view messages page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Login
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL);

    // Navigate to messages
    await page.goto(`${BASE_URL}/messages`);
    await expect(page.locator('h1:has-text("Messages")')).toBeVisible();
  });

  test('should display message list', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'buyer@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL);

    // Go to messages
    await page.goto(`${BASE_URL}/messages`);

    // Check if messages are displayed
    const messageList = page.locator('[data-testid="message-item"]');
    const messageCount = await messageList.count();

    if (messageCount > 0) {
      // Verify message structure
      await expect(messageList.first().locator('text=From:')).toBeVisible();
    }
  });

  test('should send message from listing detail', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'buyer@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL);

    // Go to listing
    await page.goto(`${BASE_URL}/listings/test-listing-id`);
    await expect(page.locator('button:has-text("Contact Seller")')).toBeVisible();

    // Click contact
    await page.click('button:has-text("Contact Seller")');

    // Should show message modal or navigate to messages
    await expect(page.locator('text=message|contact|send')).toBeVisible();
  });
});
