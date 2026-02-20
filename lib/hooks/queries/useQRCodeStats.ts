'use client'

import { useQuery } from '@tanstack/react-query'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { queryKeys } from '@/lib/query/keys'

export interface QRCodeStats {
  total_scans: number
  scans_this_month: number
  scans_today: number
  unique_scans: number
  unique_scans_this_month: number
  unique_scans_today: number
  top_countries: { country: string; count: number }[]
  top_cities: { city: string; count: number }[]
  scan_trend: { date: string; count: number }[]
}

export function useQRCodeStats(id: string) {
  return useQuery<QRCodeStats>({
    queryKey: queryKeys.qrcodes.stats(id),
    queryFn: () => qrcodesAPI.getStats(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  })
}
