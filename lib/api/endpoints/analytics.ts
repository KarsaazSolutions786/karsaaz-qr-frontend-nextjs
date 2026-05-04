import apiClient from '../client'
import type {
  AnalyticsOverview,
  BreakdownItem,
  CountryBreakdownItem,
  CityBreakdownItem,
  QRCodeStats,
  ScanEvent,
  ComparisonData,
  TopQRCode,
  DateRange,
  ScanListParams,
  ExportParams,
} from '@/types/entities/analytics'
import { dateRangeToQueryParams } from '@/lib/utils/date-range'
import { PaginatedResponse } from '@/types/api'

// --- Advanced Analytics Types ---

export interface FunnelStep {
  name: string
  count: number
  percentage: number
}

export interface FunnelData {
  id: string
  name: string
  steps: FunnelStep[]
  total_entered: number
  total_converted: number
  conversion_rate: number
  period: string
}

export interface ABTestVariant {
  id: string
  name: string
  visitors: number
  conversions: number
  conversion_rate: number
  is_control: boolean
  confidence_level?: number
}

export interface ABTestData {
  id: string
  name: string
  status: 'running' | 'completed' | 'paused'
  start_date: string
  end_date?: string
  variants: ABTestVariant[]
  winner?: string
}

// --- Advanced Analytics API ---

export const advancedAnalyticsAPI = {
  getFunnels: async (params?: { period?: string }): Promise<FunnelData[]> => {
    try {
      const response = await apiClient.get<{ data: FunnelData[] }>('/analytics/funnels', { params, _silent: true } as any)
      return response.data?.data ?? []
    } catch {
      return []
    }
  },

  getFunnelById: async (id: string): Promise<FunnelData | null> => {
    try {
      const response = await apiClient.get<{ data: FunnelData }>(`/analytics/funnels/${id}`, { _silent: true } as any)
      return response.data?.data ?? null
    } catch {
      return null
    }
  },

  getABTests: async (params?: { status?: string }): Promise<ABTestData[]> => {
    try {
      const response = await apiClient.get<{ data: ABTestData[] }>('/analytics/ab-tests', { params, _silent: true } as any)
      return response.data?.data ?? []
    } catch {
      return []
    }
  },

  getABTestById: async (id: string): Promise<ABTestData | null> => {
    try {
      const response = await apiClient.get<{ data: ABTestData }>(`/analytics/ab-tests/${id}`, { _silent: true } as any)
      return response.data?.data ?? null
    } catch {
      return null
    }
  },
}

// Helper to fetch a single report from the backend
async function fetchReport(qrcodeId: number, slug: string, dateRange?: DateRange) {
  const params: Record<string, string> = {}
  if (dateRange) {
    const range = dateRangeToQueryParams(dateRange)
    if (range.start_date) params.from = range.start_date
    if (range.end_date) params.to = range.end_date
  }
  const response = await apiClient.get(`/qrcodes/${qrcodeId}/reports/${slug}`, { params })
  return response.data
}

export const analyticsAPI = {
  // Get analytics overview — endpoint may not exist yet; return empty on 404
  getOverview: async (dateRange: DateRange): Promise<AnalyticsOverview | null> => {
    try {
      const params = dateRangeToQueryParams(dateRange)
      const response = await apiClient.get<{ data: AnalyticsOverview }>('/analytics/overview', {
        params,
        _silent: true,
      } as any)
      return response.data?.data ?? null
    } catch {
      return null
    }
  },

  // Get QR code specific stats — aggregated from backend report endpoints
  getQRCodeStats: async (qrcodeId: number, dateRange: DateRange): Promise<QRCodeStats> => {
    // Fetch all reports in parallel (including city data)
    const [mainReport, scansPerDay, scansPerCountry, scansPerCity, scansPerBrowser, scansPerOS, scansPerDevice] =
      await Promise.allSettled([
        fetchReport(qrcodeId, 'main', dateRange),
        fetchReport(qrcodeId, 'scans-per-day', dateRange),
        fetchReport(qrcodeId, 'scans-per-country', dateRange),
        fetchReport(qrcodeId, 'scans-per-city', dateRange),
        fetchReport(qrcodeId, 'scans-per-browser', dateRange),
        fetchReport(qrcodeId, 'scans-per-operating-system', dateRange),
        fetchReport(qrcodeId, 'scans-per-device-brand', dateRange),
      ])

    const mainData = mainReport.status === 'fulfilled' ? mainReport.value : null
    const dayData = scansPerDay.status === 'fulfilled' ? (scansPerDay.value || []) : []
    const countryData = scansPerCountry.status === 'fulfilled' ? (scansPerCountry.value || []) : []
    const cityData = scansPerCity.status === 'fulfilled' ? (scansPerCity.value || []) : []
    const browserData = scansPerBrowser.status === 'fulfilled' ? (scansPerBrowser.value || []) : []
    const osData = scansPerOS.status === 'fulfilled' ? (scansPerOS.value || []) : []
    const deviceData = scansPerDevice.status === 'fulfilled' ? (scansPerDevice.value || []) : []

    type RawScanRow = { scans?: number; date?: string; country?: string; city?: string; iso_code?: string; total_scans?: number; unique_scans?: number; [key: string]: unknown }

    // Use main report for accurate totals; fallback to summing daily data
    const totalScans: number = (mainData as RawScanRow | null)?.total_scans
      ?? (Array.isArray(dayData)
        ? (dayData as RawScanRow[]).reduce((sum: number, d) => sum + (d.scans ?? 0), 0)
        : 0)
    const uniqueScans: number = (mainData as RawScanRow | null)?.unique_scans ?? totalScans

    // Helper to convert raw breakdown array to BreakdownItem[] with percentages
    function toBreakdown(arr: RawScanRow[], labelField: string): BreakdownItem[] {
      if (!Array.isArray(arr) || arr.length === 0) return []
      const total = arr.reduce((s: number, d) => s + (d.scans ?? 0), 0)
      return arr
        .filter((d) => d[labelField])
        .map((d) => ({
          label: String(d[labelField]) || 'Unknown',
          value: d.scans ?? 0,
          percentage: total > 0 ? Math.round(((d.scans ?? 0) / total) * 100) : 0,
        }))
    }

    // Convert country data with ISO codes
    function toCountryBreakdown(arr: RawScanRow[]): CountryBreakdownItem[] {
      if (!Array.isArray(arr) || arr.length === 0) return []
      const total = arr.reduce((s: number, d) => s + (d.scans ?? 0), 0)
      return arr
        .filter((d) => d.country)
        .map((d) => ({
          label: d.country || 'Unknown',
          value: d.scans ?? 0,
          percentage: total > 0 ? Math.round(((d.scans ?? 0) / total) * 100) : 0,
          countryCode: d.iso_code || '',
        }))
        .sort((a, b) => b.value - a.value)
    }

    // Convert city data
    function toCityBreakdown(arr: RawScanRow[]): CityBreakdownItem[] {
      if (!Array.isArray(arr) || arr.length === 0) return []
      const total = arr.reduce((s: number, d) => s + (d.scans ?? 0), 0)
      return arr
        .filter((d) => d.city)
        .map((d) => ({
          label: d.city || 'Unknown',
          value: d.scans ?? 0,
          percentage: total > 0 ? Math.round(((d.scans ?? 0) / total) * 100) : 0,
          country: d.country,
        }))
        .sort((a, b) => b.value - a.value)
    }

    // Find last scan date — find the last day with scans > 0
    let lastScan: string | undefined
    if (Array.isArray(dayData) && dayData.length > 0) {
      const lastWithScans = [...(dayData as RawScanRow[])].reverse().find((d) => (d.scans ?? 0) > 0)
      if (lastWithScans?.date) lastScan = lastWithScans.date
    }

    return {
      qrcodeId,
      qrcodeName: '',
      totalScans,
      uniqueScans,
      lastScan,
      scansByDay: Array.isArray(dayData)
        ? (dayData as RawScanRow[]).map((d) => ({ date: d.date ?? '', count: d.scans ?? 0 }))
        : [],
      deviceBreakdown: toBreakdown(deviceData, 'device_brand'),
      locationBreakdown: toBreakdown(countryData, 'country'),
      countryBreakdown: toCountryBreakdown(countryData),
      cityBreakdown: toCityBreakdown(cityData),
      browserBreakdown: toBreakdown(browserData, 'browser'),
      osBreakdown: toBreakdown(osData, 'os_name'),
      topReferrers: [],
    }
  },

  // Get recent scan events for a QR code from the scans endpoint
  getQRCodeScans: async (
    qrcodeId: number,
    params: ScanListParams
  ): Promise<PaginatedResponse<ScanEvent>> => {
    try {
      const limit = params.perPage ?? 20
      const response = await apiClient.get(`/qrcodes/${qrcodeId}/scans`, {
        params: { limit },
      })
      type RawScan = { id?: unknown; created_at?: string; country?: string; iso_code?: string; city?: string; os_name?: string; device_brand?: string; device_name?: string; browser?: string; [key: string]: unknown }
      const rawScans: RawScan[] = Array.isArray(response.data) ? response.data : []

      const events: ScanEvent[] = rawScans.map((s) => ({
        id: s.id as number,
        qrcodeId,
        qrcodeName: '',
        timestamp: s.created_at ?? '',
        location: s.country
          ? { country: s.country, countryCode: s.iso_code ?? '', city: s.city }
          : undefined,
        device: {
          type: (s.os_name === 'Android' || s.os_name === 'iOS') ? 'mobile' as const : 'desktop' as const,
          brand: s.device_brand ?? '',
          model: s.device_name ?? '',
        },
        browser: s.browser ?? '',
        os: s.os_name ?? '',
        ipAddress: '',
        isUnique: false,
      }))

      return {
        data: events,
        pagination: { currentPage: 1, perPage: limit, total: events.length, lastPage: 1 },
      }
    } catch {
      return {
        data: [],
        pagination: { currentPage: 1, perPage: 20, total: 0, lastPage: 1 },
      }
    }
  },

  // Get top performing QR codes — endpoint may not exist yet; return empty on 404
  getTopQRCodes: async (
    dateRange: DateRange,
    limit: number = 10
  ): Promise<TopQRCode[]> => {
    try {
      const params = {
        ...dateRangeToQueryParams(dateRange),
        limit,
      }
      const response = await apiClient.get<{ data: TopQRCode[] }>(
        '/analytics/top-qrcodes',
        { params, _silent: true } as any
      )
      return response.data?.data ?? []
    } catch {
      return []
    }
  },

  // Compare multiple QR codes
  compareQRCodes: async (
    qrcodeIds: number[],
    dateRange: DateRange
  ): Promise<ComparisonData> => {
    const params = {
      ...dateRangeToQueryParams(dateRange),
      qrcode_ids: qrcodeIds.join(','),
    }
    const response = await apiClient.get<{ data: ComparisonData }>(
      '/analytics/compare',
      { params }
    )
    return response.data?.data ?? null
  },

  // Export data
  exportCSV: async (params: ExportParams): Promise<Blob> => {
    const queryParams = {
      ...dateRangeToQueryParams(params.dateRange),
      qrcode_ids: params.qrcodeIds?.join(','),
    }
    const response = await apiClient.get('/analytics/export/csv', {
      params: queryParams,
      responseType: 'blob',
    })
    return response.data
  },

  exportPDF: async (params: ExportParams): Promise<Blob> => {
    const queryParams = {
      ...dateRangeToQueryParams(params.dateRange),
      qrcode_ids: params.qrcodeIds?.join(','),
      include_charts: params.includeCharts,
    }
    const response = await apiClient.get('/analytics/export/pdf', {
      params: queryParams,
      responseType: 'blob',
    })
    return response.data
  },
}
