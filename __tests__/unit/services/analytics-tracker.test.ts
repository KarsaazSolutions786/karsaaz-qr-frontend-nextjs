import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/api/client', () => ({
  default: {
    post: vi.fn().mockResolvedValue({}),
  },
}))

import apiClient from '@/lib/api/client'

let AnalyticsTracker: typeof import('@/lib/services/analytics-tracker').AnalyticsTracker

describe('analytics-tracker', () => {
  beforeEach(async () => {
    vi.resetModules()
    vi.mocked(apiClient.post).mockReset().mockResolvedValue({})
    sessionStorage.clear()

    // Re-mock after resetModules
    vi.doMock('@/lib/api/client', () => ({
      default: {
        post: vi.fn().mockResolvedValue({}),
      },
    }))

    const mod = await import('@/lib/services/analytics-tracker')
    AnalyticsTracker = mod.AnalyticsTracker
  })

  it('getSessionId returns a consistent session ID', () => {
    const tracker = AnalyticsTracker.getInstance()
    const id1 = tracker.getSessionId()
    const id2 = tracker.getSessionId()
    expect(id1).toBe(id2)
    expect(id1).toBeTruthy()
  })

  it('getSessionId stores ID in sessionStorage', () => {
    const tracker = AnalyticsTracker.getInstance()
    tracker.getSessionId()
    expect(sessionStorage.getItem('analytics_session_id')).toBeTruthy()
  })

  it('init is idempotent', () => {
    const tracker = AnalyticsTracker.getInstance()
    tracker.init()
    tracker.init() // second call should be no-op
    expect(sessionStorage.getItem('analytics_session_id')).toBeTruthy()
  })

  it('trackPageView sends page_view event', async () => {
    const mod = await import('@/lib/services/analytics-tracker')
    const client = (await import('@/lib/api/client')).default
    await mod.analyticsTracker.trackPageView('/home')
    expect(client.post).toHaveBeenCalledWith(
      '/analytics/track',
      expect.objectContaining({ event: 'page_view', path: '/home' })
    )
  })

  it('trackEvent sends custom event', async () => {
    const mod = await import('@/lib/services/analytics-tracker')
    const client = (await import('@/lib/api/client')).default
    await mod.analyticsTracker.trackEvent('click', { button: 'signup' })
    expect(client.post).toHaveBeenCalledWith(
      '/analytics/track',
      expect.objectContaining({ event: 'click', button: 'signup' })
    )
  })

  it('does not throw on API failure', async () => {
    const mod = await import('@/lib/services/analytics-tracker')
    const client = (await import('@/lib/api/client')).default
    vi.mocked(client.post).mockRejectedValue(new Error('Network'))
    await expect(mod.analyticsTracker.trackPageView('/fail')).resolves.toBeUndefined()
  })
})
