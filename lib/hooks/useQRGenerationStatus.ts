'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Constants ───────────────────────────────────────────────────────────────

/** Poll every 2 seconds */
const POLL_INTERVAL_MS = 2_000

/** Maximum number of polls before giving up (30 polls × 2s = 60s timeout) */
const MAX_POLLS = 30

/** Terminal statuses — polling stops when one of these is received */
const TERMINAL_STATUSES: QRGenerationStatus[] = ['ready', 'failed']

// ─── API fetch ───────────────────────────────────────────────────────────────

/**
 * Purpose: Executes fetchGenerationStatus functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: May 2026
 */
async function fetchGenerationStatus(id: string): Promise<QRGenerationStatusResponse> {
  const { data } = await apiClient.get<QRGenerationStatusResponse>(
    `/qrcodes/${id}/generation-status`
  )
  return data
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Purpose: Poll `GET /api/qrcodes/{id}/generation-status` every 2 seconds until the QR code generation is complete or has failed. Polling stops automatically when: - status === 'ready' or 'failed'  (terminal state) - 30 polls have been made (60-second timeout) - id is falsy (hook is disabled) const { isReady, svgUrl, isPolling, error } = useQRGenerationStatus(qrId) if (isPolling) return <Spinner /> if (isReady)   return <img src={svgUrl} /> if (error)     return <ErrorMessage message={error} />
 * Owner/Author: Syed Ashhad
 * Created/Updated: May 2026
 */

export function useQRGenerationStatus(
  id: string | null | undefined
): UseQRGenerationStatusResult {
  const query = useQuery<QRGenerationStatusResponse, Error>({
    queryKey: ['qrcode', 'generation-status', id],

    queryFn: () => fetchGenerationStatus(id!),

    // Disable the query entirely when no ID is provided
    enabled: Boolean(id),

    // Keep previous data visible while the next poll is in-flight so the UI
    // does not flash back to a loading state between polls.
    placeholderData: (prev) => prev,

    // No stale time — we always want fresh data for a generation status poll
    staleTime: 0,

    // Do not retry on network errors during polling; the refetchInterval will
    // naturally retry on the next tick, preventing cascading retry bursts.
    retry: false,

    // refetchInterval receives the most recent data so we can stop when done.
    // Returning false stops polling; returning a number sets the next interval.
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

    // Do not refetch when the window regains focus — the interval already handles
    // keeping the data fresh and focus-refetch would double-fetch unnecessarily.
    refetchOnWindowFocus: false,
  })

  const data = query.data
  const status = data?.status
  const isReady = status === 'ready'
  const isFailed = status === 'failed'

  // The hook is actively polling when:
  //   - we have an id, AND
  //   - the status has not yet reached a terminal state, AND
  //   - we have not hit the poll limit
  const isPolling =
    Boolean(id) &&
    !isReady &&
    !isFailed &&
    (query.isFetching || query.fetchStatus !== 'idle' || (!data && !query.isError))

  // Surface the server-reported error message or a timeout notice
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
