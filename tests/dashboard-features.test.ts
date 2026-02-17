import { test, expect } from '@playwright/test';

test.describe('Dashboard Features', () => {
  test.use({ storageState: 'playwright/.auth/user.json' }); // Assuming auth state setup

  test('should render bulk operations', async ({ page }) => {
    await page.goto('/dashboard/bulk-operations');
    await expect(page).toHaveURL(/\/dashboard\/bulk-operations/);
  });

  test('should render support tickets', async ({ page }) => {
    await page.goto('/account/support-tickets');
    await expect(page).toHaveURL(/\/account\/support-tickets/);
  });

  test('should render folder management', async ({ page }) => {
    await page.goto('/dashboard/folders');
    await expect(page).toHaveURL(/\/dashboard\/folders/);
  });
});
