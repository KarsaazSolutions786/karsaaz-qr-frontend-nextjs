'use client'

import React, { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download } from 'lucide-react'
import { getPresetDateRange } from '@/lib/utils/date-range'
import { useQRCodeStats, useQRCodeScans } from '@/lib/hooks/queries/useAnalytics'
import { useQRCode } from '@/lib/hooks/queries/useQRCode'
import MetricCard from '@/components/analytics/MetricCard'
import ChartContainer from '@/components/analytics/charts/ChartContainer'
import ActivityFeed from '@/components/analytics/ActivityFeed'
import DateRangePicker from '@/components/analytics/DateRangePicker'
import { ScansPerCountryChart } from '@/components/analytics/ScansPerCountryChart'
import type { DateRange } from '@/types/entities/analytics'
import type { ChartDatePreset } from '@/lib/hooks/useAnalyticsCharts'
import { chartPresetToDateRange } from '@/lib/hooks/useAnalyticsCharts'
import { useTranslation } from '@/lib/i18n'
import { exportAnalyticsCsv } from '@/lib/utils/export-analytics-csv'

// Lazy-load recharts-based chart components to reduce main bundle size
const ChartSkeleton = () => <div className="animate-pulse h-64 bg-muted rounded" />

const PieChart = dynamic(() => import('@/components/analytics/charts/PieChart'), {
  loading: ChartSkeleton,
  ssr: false,
})

const ScansPerDayChart = dynamic(
  () =>
    import('@/components/analytics/ScansPerDayChart').then(mod => ({
      default: mod.ScansPerDayChart,
    })),
  { loading: ChartSkeleton, ssr: false }
)

const ScansPerCityChart = dynamic(
  () =>
    import('@/components/analytics/ScansPerCityChart').then(mod => ({
      default: mod.ScansPerCityChart,
    })),
  { loading: ChartSkeleton, ssr: false }
)

const ScansPerOSChart = dynamic(
  () =>
    import('@/components/analytics/ScansPerOSChart').then(mod => ({
      default: mod.ScansPerOSChart,
    })),
  { loading: ChartSkeleton, ssr: false }
)

export default function QRCodeAnalyticsPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const qrcodeId = parseInt(params.id as string, 10)

  const [dateRange, setDateRange] = useState<DateRange>(getPresetDateRange('last30days'))

  // Chart-specific preset state for ScansPerDayChart (its own date range)
  const [dayChartPreset, setDayChartPreset] = useState<ChartDatePreset>('30d')
  const dayChartDateRange = useMemo(() => chartPresetToDateRange(dayChartPreset), [dayChartPreset])

  const { data: qrcode } = useQRCode(params.id as string)

  // Main stats query (used by metric cards and most charts)
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQRCodeStats(qrcodeId, dateRange)

  // Separate stats query for the day chart when it has a different date range
  const { data: dayStats, isLoading: dayStatsLoading } = useQRCodeStats(qrcodeId, dayChartDateRange)

  const { data: scansData, isLoading: scansLoading } = useQRCodeScans(qrcodeId, { perPage: 10 })

  const handleExportCsv = useCallback(() => {
    if (!stats) return
    exportAnalyticsCsv(stats)
  }, [stats])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {qrcode?.name ?? t('QR Code Analytics')}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{t('Detailed performance metrics')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={statsLoading || !stats}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {t('Export CSV')}
          </button>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('Total Scans')}
          value={stats?.totalScans.toLocaleString() ?? '0'}
          isLoading={statsLoading}
        />
        <MetricCard
          title={t('Unique Scans')}
          value={stats?.uniqueScans.toLocaleString() ?? '0'}
          isLoading={statsLoading}
        />
        <MetricCard
          title={t('Last Scan')}
          value={stats?.lastScan ?? t('Never')}
          isLoading={statsLoading}
        />
        <MetricCard
          title={t('Avg. Daily Scans')}
          value={
            stats?.scansByDay && stats.scansByDay.length > 0
              ? (stats.totalScans / stats.scansByDay.length).toFixed(1)
              : '0'
          }
          isLoading={statsLoading}
        />
      </div>

      {/* 1. Scans Per Day Chart (with its own date range selector) */}
      <ScansPerDayChart
        data={dayStats?.scansByDay ?? []}
        isLoading={dayStatsLoading}
        preset={dayChartPreset}
        onPresetChange={setDayChartPreset}
      />

      {/* 2. Scans by Country + 3. Scans by City (side by side) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ScansPerCountryChart
          data={stats?.countryBreakdown ?? []}
          totalScans={stats?.totalScans ?? 0}
          isLoading={statsLoading}
        />
        <ScansPerCityChart data={stats?.cityBreakdown ?? []} isLoading={statsLoading} />
      </div>

      {/* 4. Scans by OS (full width) */}
      <ScansPerOSChart
        data={stats?.osBreakdown ?? []}
        totalScans={stats?.totalScans ?? 0}
        isLoading={statsLoading}
      />

      {/* Remaining breakdown charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartContainer title={t('Devices')} isLoading={statsLoading} error={statsError}>
          <PieChart data={stats?.deviceBreakdown ?? []} height={250} />
        </ChartContainer>

        <ChartContainer title={t('Browsers')} isLoading={statsLoading} error={statsError}>
          <PieChart data={stats?.browserBreakdown ?? []} height={250} />
        </ChartContainer>
      </div>

      {/* Recent Scans */}
      <ChartContainer
        title={t('Recent Scans')}
        description={t('Latest scan activity')}
        isLoading={scansLoading}
      >
        <ActivityFeed scans={scansData?.data ?? []} isLoading={scansLoading} />
      </ChartContainer>
    </div>
  )
}
