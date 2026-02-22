import { test, expect } from '@playwright/test'
import { mockAuthState } from './helpers/auth'
import { mockCommonAPIs } from './helpers/mocks'

const MOCK_ANALYTICS = {
  totalScans: 5000,
  uniqueUsers: 3200,
  activeQRCodes: 42,
  totalQRCodes: 50,
  scanGrowth: 12.5,
  activeGrowth: 5.0,
  scansOverTime: [
    { date: '2026-01-01', count: 120 },
    { date: '2026-01-02', count: 145 },
    { date: '2026-01-03', count: 98 },
  ],
  deviceBreakdown: [
    { label: 'Mobile', value: 3250 },
    { label: 'Desktop', value: 1420 },
    { label: 'Tablet', value: 330 },
  ],
  locationBreakdown: [
    { label: 'US', value: 1245 },
    { label: 'CA', value: 856 },
    { label: 'UK', value: 734 },
  ],
  recentActivity: [],
}

const MOCK_TOP_QR = [
  { id: '1', name: 'Landing Page', totalScans: 1200 },
  { id: '2', name: 'Product Card', totalScans: 800 },
]

test.describe('Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthState(page)
    await mockCommonAPIs(page)

    await page.route('**/api/analytics/overview**', async (route) => {
      await route.fulfill({ json: { data: MOCK_ANALYTICS } })
    })

    await page.route('**/api/analytics/top-qrcodes**', async (route) => {
      await route.fulfill({ json: { data: MOCK_TOP_QR } })
    })

    await page.route('**/api/analytics/realtime**', async (route) => {
      await route.fulfill({
        json: { data: { activeVisitors: 12, scansLastHour: 34, recentScans: [] } },
      })
    })

    await page.route('**/api/analytics/funnels**', async (route) => {
      await route.fulfill({ json: { data: [] } })
    })

    await page.route('**/api/analytics/ab-tests**', async (route) => {
      await route.fulfill({ json: { data: [] } })
    })
  })

  test('analytics dashboard renders heading', async ({ page }) => {
    await page.goto('/analytics')
    await expect(
      page.getByRole('heading', { name: /analytics/i })
    ).toBeVisible()
  })

  test('analytics dashboard shows description text', async ({ page }) => {
    await page.goto('/analytics')
    await expect(
      page.getByText(/track your qr code performance/i)
    ).toBeVisible()
  })

  test('date range picker is visible', async ({ page }) => {
    await page.goto('/analytics')
    // DateRangePicker should render a button or input for selecting date range
    const picker = page.locator('button:has-text("days"), button:has-text("Last"), [data-testid="date-range-picker"]').first()
    const isVisible = await picker.isVisible({ timeout: 10000 }).catch(() => false)
    // Even if the specific selector doesn't match, the component should render something
    expect(isVisible || (await page.getByText(/last \d+ days/i).isVisible().catch(() => false))).toBeTruthy()
  })

  test('metric cards display key stats', async ({ page }) => {
    await page.goto('/analytics')
    await expect(page.getByText('Total Scans')).toBeVisible()
    await expect(page.getByText('Unique Users')).toBeVisible()
    await expect(page.getByText('Active QR Codes')).toBeVisible()
    await expect(page.getByText('Total QR Codes')).toBeVisible()
  })

  test('chart sections render', async ({ page }) => {
    await page.goto('/analytics')
    await expect(page.getByText('Scans Over Time')).toBeVisible()
    await expect(page.getByText('Top Performing QR Codes')).toBeVisible()
  })

  test('device and location breakdown charts render', async ({ page }) => {
    await page.goto('/analytics')
    await expect(page.getByText('Scans by Device')).toBeVisible()
    await expect(page.getByText('Scans by Location')).toBeVisible()
  })

  test('advanced analytics page renders', async ({ page }) => {
    await page.goto('/analytics/advanced')
    await expect(
      page.getByRole('heading', { name: /advanced analytics/i })
    ).toBeVisible()
    await expect(
      page.getByText(/conversion funnels and a\/b test/i)
    ).toBeVisible()
  })

  test('advanced analytics has funnel and A/B test tabs', async ({ page }) => {
    await page.goto('/analytics/advanced')
    await expect(
      page.getByRole('tab', { name: /funnel/i }).or(page.getByText(/conversion funnel/i))
    ).toBeVisible()
    await expect(
      page.getByRole('tab', { name: /a\/b test/i }).or(page.getByText(/a\/b test/i))
    ).toBeVisible()
  })
})
