import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { analyticsAPI } from '@/lib/api/endpoints/analytics'
import type {
  AnalyticsOverview,
  QRCodeStats,
  ScanEvent,
  TopQRCode,
  DateRange,
  ScanListParams,
} from '@/types/entities/analytics'
import { PaginatedResponse } from '@/types/api'

// Analytics overview
export function useAnalyticsOverview(
  dateRange: DateRange,
  options?: Omit<UseQueryOptions<AnalyticsOverview>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['analytics', 'overview', dateRange],
    queryFn: () => analyticsAPI.getOverview(dateRange),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  })
}

// QR Code specific stats
export function useQRCodeStats(
  qrcodeId: number,
  dateRange: DateRange,
  options?: Omit<UseQueryOptions<QRCodeStats>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['analytics', 'qrcode', qrcodeId, 'stats', dateRange],
    queryFn: () => analyticsAPI.getQRCodeStats(qrcodeId, dateRange),
    enabled: !!qrcodeId,
    staleTime: 60 * 1000,
    ...options,
  })
}

// QR Code scans list
export function useQRCodeScans(
  qrcodeId: number,
  params: ScanListParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<ScanEvent>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['analytics', 'qrcode', qrcodeId, 'scans', params],
    queryFn: () => analyticsAPI.getQRCodeScans(qrcodeId, params),
    enabled: !!qrcodeId,
    staleTime: 30 * 1000,
    ...options,
  })
}

// Top QR codes
export function useTopQRCodes(
  dateRange: DateRange,
  limit?: number,
  options?: Omit<UseQueryOptions<TopQRCode[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['analytics', 'top-qrcodes', dateRange, limit],
    queryFn: () => analyticsAPI.getTopQRCodes(dateRange, limit),
    staleTime: 60 * 1000,
    ...options,
  })
}
