'use client'

import { useState, useMemo } from 'react'
import { useQRCodeStats } from '@/lib/hooks/queries/useAnalytics'
import { getPresetDateRange } from '@/lib/utils/date-range'
import type {
  DateRange,
  DateRangePreset,
  TimeSeriesPoint,
  BreakdownItem,
  CountryBreakdownItem,
  CityBreakdownItem,
} from '@/types/entities/analytics'

// ---------- Date range preset type for chart selectors ----------

export type ChartDatePreset = '7d' | '30d' | '90d' | '1y'

const PRESET_MAP: Record<ChartDatePreset, DateRangePreset> = {
  '7d': 'last7days',
  '30d': 'last30days',
  '90d': 'last90days',
  '1y': 'thisYear',
}

/**
 * Purpose: Executes chartPresetToDateRange functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function chartPresetToDateRange(preset: ChartDatePreset): DateRange {
  return getPresetDateRange(PRESET_MAP[preset])
}

// ---------- Scans Per Day hook ----------

export interface UseScansPerDayResult {
  data: TimeSeriesPoint[]
  isLoading: boolean
  error: Error | null
  preset: ChartDatePreset
  setPreset: (preset: ChartDatePreset) => void
  dateRange: DateRange
}

/**
 * Purpose: Executes useScansPerDay functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useScansPerDay(
  qrcodeId: number,
  initialPreset: ChartDatePreset = '30d'
): UseScansPerDayResult {
  const [preset, setPreset] = useState<ChartDatePreset>(initialPreset)
  const dateRange = useMemo(() => chartPresetToDateRange(preset), [preset])

  const { data: stats, isLoading, error } = useQRCodeStats(qrcodeId, dateRange)

  return {
    data: stats?.scansByDay ?? [],
    isLoading,
    error: error as Error | null,
    preset,
    setPreset,
    dateRange,
  }
}

// ---------- Scans Per Country hook ----------

export interface UseScansPerCountryResult {
  data: CountryBreakdownItem[]
  isLoading: boolean
  error: Error | null
  totalScans: number
}

/**
 * Purpose: Executes useScansPerCountry functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useScansPerCountry(
  qrcodeId: number,
  dateRange: DateRange
): UseScansPerCountryResult {
  const { data: stats, isLoading, error } = useQRCodeStats(qrcodeId, dateRange)

  return {
    data: stats?.countryBreakdown ?? [],
    isLoading,
    error: error as Error | null,
    totalScans: stats?.totalScans ?? 0,
  }
}

// ---------- Scans Per City hook ----------

export interface UseScansPerCityResult {
  data: CityBreakdownItem[]
  isLoading: boolean
  error: Error | null
  totalScans: number
}

/**
 * Purpose: Executes useScansPerCity functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useScansPerCity(
  qrcodeId: number,
  dateRange: DateRange
): UseScansPerCityResult {
  const { data: stats, isLoading, error } = useQRCodeStats(qrcodeId, dateRange)

  return {
    data: stats?.cityBreakdown ?? [],
    isLoading,
    error: error as Error | null,
    totalScans: stats?.totalScans ?? 0,
  }
}

// ---------- Scans Per OS hook ----------

export interface UseScansPerOSResult {
  data: BreakdownItem[]
  isLoading: boolean
  error: Error | null
  totalScans: number
}

/**
 * Purpose: Executes useScansPerOS functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function useScansPerOS(
  qrcodeId: number,
  dateRange: DateRange
): UseScansPerOSResult {
  const { data: stats, isLoading, error } = useQRCodeStats(qrcodeId, dateRange)

  return {
    data: stats?.osBreakdown ?? [],
    isLoading,
    error: error as Error | null,
    totalScans: stats?.totalScans ?? 0,
  }
}

// ---------- Combined chart data hook (shares a single API call) ----------

export interface UseAnalyticsChartsResult {
  scansByDay: TimeSeriesPoint[]
  countryBreakdown: CountryBreakdownItem[]
  cityBreakdown: CityBreakdownItem[]
  osBreakdown: BreakdownItem[]
  totalScans: number
  uniqueScans: number
  isLoading: boolean
  error: Error | null
  dateRange: DateRange
  preset: ChartDatePreset
  setPreset: (preset: ChartDatePreset) => void
}

/**
 * Purpose: Single hook that provides all chart data from a shared useQRCodeStats query. This avoids duplicate API calls when multiple charts are rendered on the same page.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function useAnalyticsCharts(
  qrcodeId: number,
  initialPreset: ChartDatePreset = '30d'
): UseAnalyticsChartsResult {
  const [preset, setPreset] = useState<ChartDatePreset>(initialPreset)
  const dateRange = useMemo(() => chartPresetToDateRange(preset), [preset])

  const { data: stats, isLoading, error } = useQRCodeStats(qrcodeId, dateRange)

  return {
    scansByDay: stats?.scansByDay ?? [],
    countryBreakdown: stats?.countryBreakdown ?? [],
    cityBreakdown: stats?.cityBreakdown ?? [],
    osBreakdown: stats?.osBreakdown ?? [],
    totalScans: stats?.totalScans ?? 0,
    uniqueScans: stats?.uniqueScans ?? 0,
    isLoading,
    error: error as Error | null,
    dateRange,
    preset,
    setPreset,
  }
}
