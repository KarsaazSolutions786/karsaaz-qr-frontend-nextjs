import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/account/login');
    await expect(page.locator('h3')).toContainText('Sign In');
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/account/register');
    await expect(page.locator('h3')).toContainText('Create an account');
  });
});
