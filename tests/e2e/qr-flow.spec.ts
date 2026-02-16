import { test, expect } from '@playwright/test';

test.describe('QR Code Flow', () => {
  test('should display QR type selection page', async ({ page }) => {
    await page.goto('/dashboard/qrcodes/new');
    await expect(page.locator('h1')).toContainText('Create QR Code');
    await expect(page.locator('text=URL / LINK')).toBeVisible();
  });

  test('should navigate to specific QR type content page', async ({ page }) => {
    await page.goto('/dashboard/qrcodes/new/url');
    await expect(page.locator('h1')).toContainText('Dynamic URL');
    await expect(page.locator('text=QR Source Data')).toBeVisible();
  });
});
