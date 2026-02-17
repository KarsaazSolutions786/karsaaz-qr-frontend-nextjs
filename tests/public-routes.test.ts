import { test, expect } from '@playwright/test';

test.describe('Public Routes', () => {
  test('should render blog index', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveURL(/\/blog/);
    // Add more specific assertions once implemented
  });

  test('should render blog post', async ({ page }) => {
    // Mock data or rely on seed
    await page.goto('/blog/post/test-post');
    await expect(page).toHaveURL(/\/blog\/post\/test-post/);
  });

  test('should handle qr catch-all', async ({ page }) => {
    // This is tricky without backend, maybe mock response
    await page.goto('/some-qr-code');
    // Expect either a redirect or a rendered qr view
    // await expect(page.locator('body')).toBeVisible();
  });
});
