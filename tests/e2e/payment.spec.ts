import { test, expect } from '@playwright/test'
import { mockAuthState } from './helpers/auth'
import { mockCommonAPIs } from './helpers/mocks'

const MOCK_PLANS = {
  data: [
    {
      id: 1, name: 'Free', price: '0.00', frequency: 'monthly',
      numberOfDynamicQrcodes: 5, isHidden: false, isTrial: false, sortOrder: 1,
    },
    {
      id: 2, name: 'Pro', price: '9.99', frequency: 'monthly',
      numberOfDynamicQrcodes: 100, isHidden: false, isTrial: false, sortOrder: 2,
    },
    {
      id: 3, name: 'Enterprise', price: '49.99', frequency: 'monthly',
      numberOfDynamicQrcodes: 1000, isHidden: false, isTrial: false, sortOrder: 3,
    },
  ],
  pagination: { total: 3, perPage: 15, lastPage: 1, currentPage: 1 },
}

test.describe('Payment & Plans', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthState(page)
    await mockCommonAPIs(page)

    await page.route('**/api/plans**', async (route) => {
      await route.fulfill({ json: MOCK_PLANS })
    })

    await page.route('**/api/account-credits**', async (route) => {
      await route.fulfill({
        json: {
          data: { balance: '25.00', transactions: [] },
        },
      })
    })
  })

  test('plans page renders heading', async ({ page }) => {
    await page.goto('/plans')
    await expect(
      page.getByRole('heading', { name: /subscription plans/i })
    ).toBeVisible()
  })

  test('plans page shows plan data in table', async ({ page }) => {
    await page.goto('/plans')
    // Table headers
    await expect(page.getByText('Name')).toBeVisible()
    await expect(page.getByText('Price')).toBeVisible()
    await expect(page.getByText('Frequency')).toBeVisible()
  })

  test('plans page displays mock plan names', async ({ page }) => {
    await page.goto('/plans')
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
    await expect(page.getByText('Enterprise')).toBeVisible()
  })

  test('plans page has Create Plan button', async ({ page }) => {
    await page.goto('/plans')
    await expect(
      page.getByRole('link', { name: /create plan/i })
    ).toBeVisible()
  })

  test('plans page has search input', async ({ page }) => {
    await page.goto('/plans')
    await expect(
      page.getByPlaceholder(/search plans/i)
    ).toBeVisible()
  })

  test('public pricing page renders', async ({ page }) => {
    await page.route('**/api/plans**', async (route) => {
      await route.fulfill({ json: MOCK_PLANS })
    })
    await page.goto('/pricing')
    await expect(
      page.getByText(/simple, transparent pricing/i)
    ).toBeVisible()
  })

  test('pricing page shows FAQ section', async ({ page }) => {
    await page.route('**/api/plans**', async (route) => {
      await route.fulfill({ json: MOCK_PLANS })
    })
    await page.goto('/pricing')
    await expect(
      page.getByText(/frequently asked questions/i)
    ).toBeVisible()
  })

  test('checkout page renders for a plan', async ({ page }) => {
    await page.route('**/api/plans/**', async (route) => {
      await route.fulfill({
        json: {
          data: { id: 2, name: 'Pro', price: '9.99', frequency: 'monthly' },
        },
      })
    })
    await page.route('**/api/payment-gateways**', async (route) => {
      await route.fulfill({ json: { data: [] } })
    })

    await page.goto('/checkout?plan_id=2')
    await expect(
      page.getByText(/complete your purchase/i)
    ).toBeVisible()
  })

  test('checkout page shows order summary', async ({ page }) => {
    await page.route('**/api/plans/**', async (route) => {
      await route.fulfill({
        json: {
          data: { id: 2, name: 'Pro', price: '9.99', frequency: 'monthly' },
        },
      })
    })
    await page.route('**/api/payment-gateways**', async (route) => {
      await route.fulfill({ json: { data: [] } })
    })

    await page.goto('/checkout?plan_id=2')
    await expect(page.getByText(/order summary/i)).toBeVisible()
  })

  test('account credits page renders balance', async ({ page }) => {
    await page.goto('/account-credits')
    await expect(
      page.getByRole('heading', { name: /account credits/i })
    ).toBeVisible()
  })
})
