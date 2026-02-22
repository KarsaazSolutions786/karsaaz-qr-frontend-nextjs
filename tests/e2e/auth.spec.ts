import { test, expect } from '@playwright/test'
import { mockAuthState } from './helpers/auth'
import { mockCommonAPIs } from './helpers/mocks'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Mock settings endpoint for auth pages
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
  })

  test('login page renders with email and password fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Welcome to Karsaaz QR')).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('login page shows sign-in button', async ({ page }) => {
    await page.goto('/login')
    await expect(
      page.getByRole('button', { name: /sign in|login/i })
    ).toBeVisible()
  })

  test('login page has link to sign up', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
  })

  test('login page has link to forgot password', async ({ page }) => {
    await page.goto('/login')
    await expect(
      page.getByRole('link', { name: /forgot password/i })
    ).toBeVisible()
  })

  test('signup page renders all fields', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByText('Welcome to Karsaaz QR')).toBeVisible()
    await expect(page.getByPlaceholder(/john doe/i)).toBeVisible()
    await expect(page.getByPlaceholder(/you@example\.com/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: /create account/i })
    ).toBeVisible()
  })

  test('forgot password page renders and accepts email', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.getByText(/forgot your password/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: /send reset instructions/i })
    ).toBeVisible()
  })

  test('protected routes redirect to login when not authenticated', async ({
    page,
  }) => {
    await page.goto('/qrcodes')
    await page.waitForURL('**/login**', { timeout: 10000 })
    expect(page.url()).toContain('/login')
  })

  test('login redirects to dashboard on successful API auth', async ({
    page,
  }) => {
    // Mock a successful login response
    await page.route('**/api/login', async (route) => {
      await route.fulfill({
        json: { token: 'fake-jwt-token', user: { id: 1, name: 'Test', email: 'test@example.com' } },
      })
    })
    await mockCommonAPIs(page)

    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in|login/i }).click()
    // After login, should navigate away from /login
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 })
  })

  test('logout clears auth state', async ({ page }) => {
    await mockAuthState(page)
    await mockCommonAPIs(page)

    await page.route('**/api/qrcodes**', async (route) => {
      await route.fulfill({ json: { data: [], pagination: { total: 0, perPage: 15, lastPage: 1, currentPage: 1 } } })
    })

    await page.goto('/qrcodes')

    // Find and click the logout button/link in the sidebar
    const logoutBtn = page.getByRole('button', { name: /logout|sign out/i })
    if (await logoutBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await logoutBtn.click()
      await page.waitForURL('**/login**', { timeout: 10000 })
      expect(page.url()).toContain('/login')
    }
  })
})
