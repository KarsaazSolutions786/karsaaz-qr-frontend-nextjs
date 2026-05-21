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

/**
 * Purpose: Fetches QR code stats using scans-per-day report. The backend does not have a /stats endpoint — uses /reports/scans-per-day instead.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useQRCodeStats(id: string) {
  return useQuery<QRCodeStats>({
    queryKey: queryKeys.qrcodes.stats(id),
    queryFn: async () => {
      const data = await qrcodesAPI.getReport(id, 'scans-per-day')
      const days = Array.isArray(data) ? data : []
      const totalScans = days.reduce((sum: number, d: any) => sum + (d.count || d.value || 0), 0)
      return {
        total_scans: totalScans,
        scans_this_month: 0,
        scans_today: 0,
        unique_scans: totalScans,
        unique_scans_this_month: 0,
        unique_scans_today: 0,
        top_countries: [],
        top_cities: [],
        scan_trend: days.map((d: any) => ({ date: d.date || d.label || '', count: d.count || d.value || 0 })),
      }
    },
    enabled: !!id,
    staleTime: 60 * 1000,
  })
}
