'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'

export type QRGenerationStatus = 'pending' | 'processing' | 'ready' | 'failed'

export interface QRGenerationStatusResponse {
  status: QRGenerationStatus
  svg_url?: string
  error?: string
  progress?: number // 0–100, optional server-side progress hint
}

export interface UseQRGenerationStatusResult {
  /** Current generation status reported by the server */
  status: QRGenerationStatus | undefined
  /** URL to the generated SVG once status === 'ready' */
  svgUrl: string | undefined
  /** True when status === 'ready' */
  isReady: boolean
  /** True while the hook is actively polling */
  isPolling: boolean
  /** Error message when status === 'failed' or a network error occurred */
  error: string | undefined
  /** Raw query loading state (true on the very first fetch) */
  isLoading: boolean
}
const POLL_INTERVAL_MS = 2_000
const MAX_POLLS = 30
const TERMINAL_STATUSES: QRGenerationStatus[] = ['ready', 'failed']

async function fetchGenerationStatus(id: string): Promise<QRGenerationStatusResponse> {
  const { data } = await apiClient.get<QRGenerationStatusResponse>(
    `/qrcodes/${id}/generation-status`
  )
  return data
}

export function useQRGenerationStatus(
  id: string | null | undefined
): UseQRGenerationStatusResult {
  const query = useQuery<QRGenerationStatusResponse, Error>({
    queryKey: ['qrcode', 'generation-status', id],

    queryFn: () => fetchGenerationStatus(id!),

    enabled: Boolean(id),

    placeholderData: (prev) => prev,

    staleTime: 0,

    retry: false,

    refetchInterval: (query) => {
      const data = query.state.data

      // Stop if the status has reached a terminal state
      if (data && TERMINAL_STATUSES.includes(data.status)) {
        return false
      }

      // Stop after MAX_POLLS fetches to enforce the 60-second hard timeout
      const fetchCount = query.state.dataUpdateCount + query.state.errorUpdateCount
      if (fetchCount >= MAX_POLLS) {
        return false
      }

      return POLL_INTERVAL_MS
    },
    refetchOnWindowFocus: false,
  })

  const data = query.data
  const status = data?.status
  const isReady = status === 'ready'
  const isFailed = status === 'failed'
  const isPolling =
    Boolean(id) &&
    !isReady &&
    !isFailed &&
    (query.isFetching || query.fetchStatus !== 'idle' || (!data && !query.isError))
  let error: string | undefined
  if (isFailed) {
    error = data?.error ?? 'QR code generation failed.'
  } else if (query.isError) {
    error = query.error?.message ?? 'Failed to fetch generation status.'
  }

  return {
    status,
    svgUrl: data?.svg_url,
    isReady,
    isPolling,
    error,
    isLoading: query.isLoading,
  }
}
