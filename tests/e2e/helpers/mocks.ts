import { Page } from '@playwright/test'
import { MOCK_USER, MOCK_SUBSCRIPTION } from './auth'

/**
 * Intercept common API endpoints with mock data so tests run without a real backend.
 */
export async function mockCommonAPIs(page: Page) {
  await page.route('**/api/myself', async (route) => {
    await route.fulfill({ json: { data: MOCK_USER } })
  })

  await page.route('**/api/subscription**', async (route) => {
    await route.fulfill({ json: { data: MOCK_SUBSCRIPTION } })
  })

  await page.route('**/api/settings**', async (route) => {
    await route.fulfill({
      json: {
        data: {
          registration_is_enabled: true,
          social_logins: { google: false, facebook: false, twitter: false },
          passwordless_is_enabled: false,
        },
      },
    })
  })

  await page.route('**/api/folders**', async (route) => {
    await route.fulfill({ json: { data: [] } })
  })

  await page.route('**/api/template-categories**', async (route) => {
    await route.fulfill({ json: { data: [] } })
  })
}
