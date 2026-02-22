import { Page } from '@playwright/test'

export async function login(page: Page, email = 'test@example.com', password = 'password123') {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /sign in|login/i }).click()
  await page.waitForURL('**/qrcodes**', { timeout: 10000 })
}

export async function mockAuthState(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'test-token-123')
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      email_verified_at: '2026-01-01',
      role: 'admin',
    }))
  })
}

export const MOCK_USER = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  email_verified_at: '2026-01-01',
  role: 'admin',
  plan: { name: 'pro', qr_codes_limit: 100 },
}

export const MOCK_SUBSCRIPTION = {
  plan: { name: 'pro', qr_codes_limit: 100 },
  on_trial: false,
  trial_ends_at: null,
}
