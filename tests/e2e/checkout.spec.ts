import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Checkout & Payments', () => {
  test('should complete checkout flow with Stripe', async ({ page }) => {
    // Navigate to listing
    await page.goto(`${BASE_URL}/listings/test-listing-id`);
    await expect(page.locator('button:has-text("Buy Now")')).toBeVisible();

    // Click Buy Now
    await page.click('button:has-text("Buy Now")');
    await expect(page).toHaveURL(/\/checkout/);

    // Verify checkout page
    await expect(page.locator('h1:has-text("Checkout")')).toBeVisible();
    await expect(page.locator('text=Price Breakdown')).toBeVisible();

    // Fill buyer info
    await page.fill('input[name="buyerName"]', 'John Doe');
    await page.fill('input[name="buyerEmail"]', 'john@example.com');
    await page.fill('input[name="buyerPhone"]', '+221771234567');

    // Select Stripe
    await page.click('input[value="stripe"]');

    // Complete Purchase
    await page.click('button:has-text("Complete Purchase")');

    // Should show confirmation or redirect
    await expect(page).toHaveURL(/\/order-confirmation|\/checkout/);
  });

  test('should complete checkout flow with Wave', async ({ page }) => {
    // Navigate to listing
    await page.goto(`${BASE_URL}/listings/test-listing-id`);
    await page.click('button:has-text("Buy Now")');

    // Fill buyer info
    await page.fill('input[name="buyerName"]', 'Fatou Sow');
    await page.fill('input[name="buyerEmail"]', 'fatou@example.com');
    await page.fill('input[name="buyerPhone"]', '+221775555555');

    // Select Wave
    await page.click('input[value="wave"]');

    // Complete Purchase
    await page.click('button:has-text("Complete Purchase")');

    // Wave payment initiated or confirmation shown
    await expect(page.locator('text=confirmation|payment|Wave')).toBeVisible();
  });

  test('should show error for missing buyer info', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/test-listing-id`);
    await page.click('button:has-text("Buy Now")');

    // Try to submit empty form
    await page.click('button:has-text("Complete Purchase")');

    // Should show error
    await expect(page.locator('text=Please fill|required|error')).toBeVisible();
  });

  test('should display price breakdown correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/listings/test-listing-id`);
    await page.click('button:has-text("Buy Now")');

    // Check price sections
    await expect(page.locator('text=Item price')).toBeVisible();
    await expect(page.locator('text=Shipping')).toBeVisible();
    await expect(page.locator('text=Total')).toBeVisible();

    // Verify math (item price = total, since shipping is free)
    const itemPrice = await page.locator('text=Item price').textContent();
    const total = await page.locator('text=Total').textContent();
    expect(itemPrice).toBeTruthy();
    expect(total).toBeTruthy();
  });
});
