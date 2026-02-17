// Analytics Entity Types

// Date range
export interface DateRange {
  startDate: Date
  endDate: Date
  preset?: DateRangePreset
}

export type DateRangePreset = 
  | 'last7days'
  | 'last30days'
  | 'last90days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom'

// Geographic location
export interface GeoLocation {
  country: string
  countryCode: string
  city?: string
  region?: string
  latitude?: number
  longitude?: number
}

// Device information
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown'
  brand?: string
  model?: string
}

// Scan event
export interface ScanEvent {
  id: number
  qrcodeId: number
  qrcodeName: string
  timestamp: string
  location?: GeoLocation
  device: DeviceInfo
  browser: string
  os: string
  referrer?: string
  ipAddress: string
  isUnique: boolean
}

// Time series data point
export interface TimeSeriesPoint {
  date: string
  count: number
}

// Breakdown item
export interface BreakdownItem {
  label: string
  value: number
  percentage: number
}

// QR Code statistics
export interface QRCodeStats {
  qrcodeId: number
  qrcodeName: string
  totalScans: number
  uniqueScans: number
  lastScan?: string
  scansByDay: TimeSeriesPoint[]
  deviceBreakdown: BreakdownItem[]
  browserBreakdown: BreakdownItem[]
  osBreakdown: BreakdownItem[]
  locationBreakdown: BreakdownItem[]
  topReferrers: BreakdownItem[]
}

// Top performing QR code
export interface TopQRCode {
  id: number
  name: string
  totalScans: number
  uniqueScans: number
  growth: number // percentage
  lastScan?: string
}

// Analytics overview
export interface AnalyticsOverview {
  totalScans: number
  totalQRCodes: number
  activeQRCodes: number
  uniqueUsers: number
  scanGrowth: number // percentage
  activeGrowth: number // percentage
  topPerformingQRCodes: TopQRCode[]
  recentActivity: ScanEvent[]
  scansOverTime: TimeSeriesPoint[]
  deviceBreakdown: BreakdownItem[]
  locationBreakdown: BreakdownItem[]
}

// Comparison data
export interface ComparisonData {
  qrcodes: {
    id: number
    name: string
    data: TimeSeriesPoint[]
  }[]
  summary: {
    id: number
    name: string
    totalScans: number
    avgScansPerDay: number
  }[]
}

// Export parameters
export interface ExportParams {
  format: 'csv' | 'pdf'
  dateRange: DateRange
  qrcodeIds?: number[]
  includeCharts?: boolean
}

// Scan list parameters
export interface ScanListParams {
  page?: number
  perPage?: number
  qrcodeId?: number
  dateRange?: DateRange
  deviceType?: string
  country?: string
}
