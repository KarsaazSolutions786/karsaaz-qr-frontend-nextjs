import apiClient from '../client'
import type {
  AnalyticsOverview,
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
    const response = await apiClient.get<{ data: FunnelData[] }>('/analytics/funnels', { params })
    return response.data.data
  },

  getFunnelById: async (id: string): Promise<FunnelData> => {
    const response = await apiClient.get<{ data: FunnelData }>(`/analytics/funnels/${id}`)
    return response.data.data
  },

  getABTests: async (params?: { status?: string }): Promise<ABTestData[]> => {
    const response = await apiClient.get<{ data: ABTestData[] }>('/analytics/ab-tests', { params })
    return response.data.data
  },

  getABTestById: async (id: string): Promise<ABTestData> => {
    const response = await apiClient.get<{ data: ABTestData }>(`/analytics/ab-tests/${id}`)
    return response.data.data
  },
}

export const analyticsAPI = {
  // Get analytics overview
  getOverview: async (dateRange: DateRange): Promise<AnalyticsOverview> => {
    const params = dateRangeToQueryParams(dateRange)
    const response = await apiClient.get<{ data: AnalyticsOverview }>('/analytics/overview', {
      params,
    })
    return response.data.data
  },

  // Get QR code specific stats
  getQRCodeStats: async (qrcodeId: number, dateRange: DateRange): Promise<QRCodeStats> => {
    const params = dateRangeToQueryParams(dateRange)
    const response = await apiClient.get<{ data: QRCodeStats }>(
      `/analytics/qrcodes/${qrcodeId}/stats`,
      { params }
    )
    return response.data.data
  },

  // Get scan events for a QR code
  getQRCodeScans: async (
    qrcodeId: number,
    params: ScanListParams
  ): Promise<PaginatedResponse<ScanEvent>> => {
    const queryParams: any = {
      page: params.page,
      per_page: params.perPage,
    }

    if (params.dateRange) {
      const range = dateRangeToQueryParams(params.dateRange)
      queryParams.start_date = range.start_date
      queryParams.end_date = range.end_date
    }

    if (params.deviceType) queryParams.device_type = params.deviceType
    if (params.country) queryParams.country = params.country

    const response = await apiClient.get<any>(
      `/analytics/qrcodes/${qrcodeId}/scans`,
      { params: queryParams }
    )

    // Transform response if needed
    return {
      data: response.data.data || [],
      pagination: response.data.pagination
        ? {
            currentPage: response.data.pagination.current_page,
            perPage: response.data.pagination.per_page,
            total: response.data.pagination.total,
            lastPage: response.data.pagination.last_page,
          }
        : { currentPage: 1, perPage: 20, total: 0, lastPage: 1 },
    }
  },

  // Get top performing QR codes
  getTopQRCodes: async (
    dateRange: DateRange,
    limit: number = 10
  ): Promise<TopQRCode[]> => {
    const params = {
      ...dateRangeToQueryParams(dateRange),
      limit,
    }
    const response = await apiClient.get<{ data: TopQRCode[] }>(
      '/analytics/top-qrcodes',
      { params }
    )
    return response.data.data
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
    return response.data.data
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
