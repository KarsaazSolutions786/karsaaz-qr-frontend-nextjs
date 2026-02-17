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
