import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// NOTE: There is currently no "Buy Now" entry point anywhere in the UI
// (the listing detail page only has a non-functional "Contact Seller" button).
// The checkout page itself is real and reachable directly via
// /checkout?listingId=<id>, so these tests exercise it that way.
async function getFirstListingId(request: import('@playwright/test').APIRequestContext) {
  const res = await request.get(`${BASE_URL}/api/listings?limit=1`);
  const data = await res.json();
  return data.data[0].id as string;
}

test.describe('Checkout & Payments', () => {
  test('should display checkout page with price breakdown', async ({ page, request }) => {
    const listingId = await getFirstListingId(request);
    await page.goto(`${BASE_URL}/checkout?listingId=${listingId}`);

    await expect(page.locator('h2:has-text("Checkout")')).toBeVisible();
    await expect(page.locator('text=Price Breakdown')).toBeVisible();
    await expect(page.locator('text=Item price')).toBeVisible();
    await expect(page.locator('text=Shipping')).toBeVisible();
    await expect(page.locator('text=Total')).toBeVisible();
  });

  test('should show error for missing buyer info', async ({ page, request }) => {
    const listingId = await getFirstListingId(request);
    await page.goto(`${BASE_URL}/checkout?listingId=${listingId}`);

    // Submit without filling buyer info (validated client-side, no network call)
    await page.click('button:has-text("Complete Purchase")');

    await expect(page.locator('text=Please fill in all fields')).toBeVisible();
  });

  // The tests below exercise the real payment endpoints, which require
  // Stripe/Wave credentials (currently placeholder dev keys — see item #2
  // of the pre-launch audit). Skipped until real keys are configured, since
  // their outcome depends on an external provider rather than app logic.
  test.skip('should complete checkout flow with Stripe', async ({ page, request }) => {
    const listingId = await getFirstListingId(request);
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL + '/');

    await page.goto(`${BASE_URL}/checkout?listingId=${listingId}`);
    await page.fill('input[type="text"]', 'John Doe');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('input[type="tel"]', '+221771234567');
    await page.click('input[value="stripe"]');
    await page.click('button:has-text("Complete Purchase")');

    await expect(page).toHaveURL(/\/order-confirmation/);
  });

  test.skip('should complete checkout flow with Wave', async ({ page, request }) => {
    const listingId = await getFirstListingId(request);
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'seller@example.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(BASE_URL + '/');

    await page.goto(`${BASE_URL}/checkout?listingId=${listingId}`);
    await page.fill('input[type="text"]', 'Fatou Sow');
    await page.fill('input[type="email"]', 'fatou@example.com');
    await page.fill('input[type="tel"]', '+221775555555');
    await page.click('input[value="wave"]');
    await page.click('button:has-text("Complete Purchase")');

    await expect(page).toHaveURL(/\/order-confirmation/);
  });
});
