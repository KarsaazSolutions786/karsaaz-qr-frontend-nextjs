/**
 * Unit Tests for useQRCodes hook
 * @file tests/unit/hooks/useQRCodes.test.ts
 *
 * Tests the React Query wrapper hook that:
 * - Fetches QR codes with pagination
 * - Uses keepPreviousData to prevent flicker on page change
 * - Builds query keys from params
 * - Supports analytics and link settings hooks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ---- Mock the API module ----

const mockList = vi.fn()
const mockGetAnalytics = vi.fn()
const mockGetLinkSettings = vi.fn()
const mockUpdateLinkSettings = vi.fn()

vi.mock('@/lib/api/endpoints/qrcodes', () => ({
  qrcodesAPI: {
    list: (...args: unknown[]) => mockList(...args),
    getAnalytics: (...args: unknown[]) => mockGetAnalytics(...args),
    getLinkSettings: (...args: unknown[]) => mockGetLinkSettings(...args),
    updateLinkSettings: (...args: unknown[]) => mockUpdateLinkSettings(...args),
  },
}))

vi.mock('@/lib/query/keys', () => ({
  queryKeys: {
    qrcodes: {
      list: (filters?: Record<string, unknown>) => ['qrcodes', 'list', filters],
      detail: (id: string) => ['qrcodes', id],
      analytics: (id: string) => ['qrcodes', id, 'analytics'],
      linkSettings: (id: string) => ['qrcodes', id, 'link-settings'],
    },
  },
}))

vi.mock('@/lib/hooks/useGuest', () => ({
  useGuest: () => ({
    isGuest: false,
    isGuestLoading: false,
  }),
}))

import { useQRCodes, useQRCodeAnalytics, useQRLinkSettings } from '@/lib/hooks/queries/useQRCodes'

// ---- Helpers ----

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockQRCodesResponse = {
  data: [
    { id: '1', name: 'QR Code 1', type: 'url', status: 'active' },
    { id: '2', name: 'QR Code 2', type: 'vcard', status: 'active' },
  ],
  current_page: 1,
  last_page: 3,
  per_page: 10,
  total: 25,
}

// ---- Tests ----

describe('useQRCodes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'test-token')
  })

  it('should fetch QR codes with default params', async () => {
    mockList.mockResolvedValueOnce(mockQRCodesResponse)

    const { result } = renderHook(() => useQRCodes(), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockList).toHaveBeenCalledWith({}, expect.any(AbortSignal))
    expect(result.current.data).toEqual(mockQRCodesResponse)
  })

  it('should pass pagination params to API', async () => {
    mockList.mockResolvedValueOnce(mockQRCodesResponse)

    const params = { page: 2, perPage: 20 }
    const { result } = renderHook(() => useQRCodes(params), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockList).toHaveBeenCalledWith({ page: 2, perPage: 20 }, expect.any(AbortSignal))
  })

  it('should pass search filter to API', async () => {
    mockList.mockResolvedValueOnce(mockQRCodesResponse)

    const params = { search: 'test-query', page: 1 }
    const { result } = renderHook(() => useQRCodes(params), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockList).toHaveBeenCalledWith(
      { search: 'test-query', page: 1 },
      expect.any(AbortSignal)
    )
  })

  it('should pass sort params to API', async () => {
    mockList.mockResolvedValueOnce(mockQRCodesResponse)

    const params = { sortBy: 'createdAt' as const, sortOrder: 'desc' as const }
    const { result } = renderHook(() => useQRCodes(params), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockList).toHaveBeenCalledWith(
      { sortBy: 'createdAt', sortOrder: 'desc' },
      expect.any(AbortSignal)
    )
  })

  it('should pass folder filter to API', async () => {
    mockList.mockResolvedValueOnce(mockQRCodesResponse)

    const params = { folderId: 'folder-123' }
    const { result } = renderHook(() => useQRCodes(params), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockList).toHaveBeenCalledWith({ folderId: 'folder-123' }, expect.any(AbortSignal))
  })

  it('should use placeholderData: keepPreviousData for smooth pagination', async () => {
    // This test validates that the hook is configured correctly.
    // We verify by inspecting the source hook configuration indirectly:
    // If keepPreviousData is used, changing params should not reset data to undefined.
    const wrapper = createQueryWrapper()

    mockList.mockResolvedValue(mockQRCodesResponse)

    const { result, rerender } = renderHook(({ page }) => useQRCodes({ page }), {
      wrapper,
      initialProps: { page: 1 },
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    result.current.data

    // Change to page 2 — with keepPreviousData the old data stays visible
    mockList.mockResolvedValue({
      ...mockQRCodesResponse,
      current_page: 2,
    })

    rerender({ page: 2 })

    // isPlaceholderData should be true while page 2 loads (data stays non-undefined)
    // The key insight: data is NOT undefined during the transition
    expect(result.current.data).toBeDefined()
  })

  it('should handle API error gracefully', async () => {
    mockList.mockRejectedValueOnce(
      Object.assign(new Error('Server Error'), { response: { status: 400 } })
    )

    const { result } = renderHook(() => useQRCodes(), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect((result.current.error as Error).message).toBe('Server Error')
  })

  it('should generate distinct query keys for different params', async () => {
    // Different params should produce different query keys so they cache separately
    mockList.mockResolvedValue(mockQRCodesResponse)

    const wrapper = createQueryWrapper()

    const { result: result1 } = renderHook(() => useQRCodes({ page: 1 }), { wrapper })

    const { result: result2 } = renderHook(() => useQRCodes({ page: 2 }), { wrapper })

    await waitFor(() => expect(result1.current.isSuccess).toBe(true))
    await waitFor(() => expect(result2.current.isSuccess).toBe(true))

    // Both should have called the API (separate cache entries)
    expect(mockList).toHaveBeenCalledTimes(2)
  })
})

describe('useQRCodeAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch analytics when qrCodeId is provided', async () => {
    const analyticsData = { totalScans: 150, uniqueScans: 80 }
    mockGetAnalytics.mockResolvedValueOnce(analyticsData)

    const { result } = renderHook(() => useQRCodeAnalytics('qr-123'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetAnalytics).toHaveBeenCalledWith('qr-123')
    expect(result.current.data).toEqual(analyticsData)
  })

  it('should not fetch when qrCodeId is undefined', async () => {
    const { result } = renderHook(() => useQRCodeAnalytics(undefined), {
      wrapper: createQueryWrapper(),
    })

    // Should stay in idle/pending state, never calling the API
    expect(mockGetAnalytics).not.toHaveBeenCalled()
    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useQRLinkSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'test-token')
  })

  it('should fetch link settings for a given QR code', async () => {
    const linkSettings = { slug: 'my-qr', redirectEnabled: true }
    mockGetLinkSettings.mockResolvedValueOnce(linkSettings)

    const { result } = renderHook(() => useQRLinkSettings('qr-456'), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetLinkSettings).toHaveBeenCalledWith('qr-456')
    expect(result.current.data).toEqual(linkSettings)
  })

  it('should not fetch when disabled via options', async () => {
    const { result } = renderHook(() => useQRLinkSettings('qr-789', { enabled: false }), {
      wrapper: createQueryWrapper(),
    })

    expect(mockGetLinkSettings).not.toHaveBeenCalled()
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('should not fetch when qrCodeId is undefined', async () => {
    const { result } = renderHook(() => useQRLinkSettings(undefined), {
      wrapper: createQueryWrapper(),
    })

    expect(mockGetLinkSettings).not.toHaveBeenCalled()
    expect(result.current.fetchStatus).toBe('idle')
  })
})
