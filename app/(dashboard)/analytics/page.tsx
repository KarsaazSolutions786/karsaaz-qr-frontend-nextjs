'use client'

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, QrCode, TrendingUp, Zap, ExternalLink, ArrowRight } from 'lucide-react'
import { getPresetDateRange } from '@/lib/utils/date-range'
import { useQRCodeStats } from '@/lib/hooks/queries/useAnalytics'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import MetricCard from '@/components/analytics/MetricCard'
import DateRangePicker from '@/components/analytics/DateRangePicker'
import { ScansPerCountryChart } from '@/components/analytics/ScansPerCountryChart'
import type { DateRange } from '@/types/entities/analytics'
import type { ChartDatePreset } from '@/lib/hooks/useAnalyticsCharts'
import { chartPresetToDateRange } from '@/lib/hooks/useAnalyticsCharts'
import { useTranslation } from '@/lib/i18n'
import { PageQueryError } from '@/components/common/PageQueryError'

/**
 * Purpose: Executes ChartSkeleton functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
const ChartSkeleton = () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />

const ScansPerDayChart = dynamic(
  () =>
    import('@/components/analytics/ScansPerDayChart').then(mod => ({
      default: mod.ScansPerDayChart,
    })),
  { loading: ChartSkeleton, ssr: false }
)

const PieChart = dynamic(() => import('@/components/analytics/charts/PieChart'), {
  loading: ChartSkeleton,
  ssr: false,
})

/**
 * Purpose: Executes AnalyticsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function AnalyticsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange>(getPresetDateRange('last30days'))
  const [dayChartPreset, setDayChartPreset] = useState<ChartDatePreset>('30d')
  const dayChartDateRange = useMemo(() => chartPresetToDateRange(dayChartPreset), [dayChartPreset])

  // Fetch all QR codes sorted by scans (up to 100) to compute aggregates
  const {
    data: allQRData,
    isLoading: qrLoading,
    error: qrError,
    refetch: refetchQR,
  } = useQRCodes({
    page: 1,
    perPage: 100,
    sortBy: 'scans',
    sortOrder: 'desc',
  })

  const qrcodes = allQRData?.data ?? []

  // Compute aggregate metrics
  const totalScans = useMemo(() => qrcodes.reduce((sum, qr) => sum + (qr.scans ?? 0), 0), [qrcodes])
  const activeCount = useMemo(() => qrcodes.filter(qr => qr.status === 'active').length, [qrcodes])
  const totalCount = allQRData?.pagination?.total ?? qrcodes.length
  const topQR = qrcodes[0] ?? null
  const topQRId = topQR ? parseInt(topQR.id, 10) : 0

  // Fetch detailed stats for the top QR code to power charts
  const { data: topStats, isLoading: topStatsLoading } = useQRCodeStats(topQRId, dateRange, {
    enabled: !!topQRId,
  })
  const { data: dayStats, isLoading: dayStatsLoading } = useQRCodeStats(
    topQRId,
    dayChartDateRange,
    { enabled: !!topQRId }
  )

  // Top 10 QR codes for the leaderboard
  const topTen = qrcodes.slice(0, 10)
  const maxScans = topTen[0]?.scans ?? 1

  if (qrError) {
    return (
      <div className="space-y-6">
        <PageQueryError
          error={qrError}
          title={t('Failed to load analytics')}
          onRetry={() => refetchQR()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('Analytics')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('Track your QR code performance and engagement')}
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t('Total Scans')}
          value={totalScans.toLocaleString()}
          isLoading={qrLoading}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          title={t('Active QR Codes')}
          value={activeCount.toLocaleString()}
          isLoading={qrLoading}
          icon={<Zap className="h-5 w-5" />}
        />
        <MetricCard
          title={t('Total QR Codes')}
          value={totalCount.toLocaleString()}
          isLoading={qrLoading}
          icon={<QrCode className="h-5 w-5" />}
        />
        <MetricCard
          title={t('Most Scanned')}
          value={topQR ? `${(topQR.scans ?? 0).toLocaleString()} scans` : '—'}
          isLoading={qrLoading}
          icon={<BarChart3 className="h-5 w-5" />}
        />
      </div>

      {/* Top QR Code Charts */}
      {topQR && (
        <>
          {/* Scans Per Day for the top QR code */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {t('Showing stats for most-scanned QR code:')}
                <span className="ml-1 font-semibold text-gray-800">{topQR.name}</span>
              </p>
              <Link
                href={`/qrcodes/${topQR.id}/analytics`}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                {t('View full analytics')} <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <ScansPerDayChart
              data={dayStats?.scansByDay ?? []}
              isLoading={dayStatsLoading}
              preset={dayChartPreset}
              onPresetChange={setDayChartPreset}
            />
          </div>

          {/* Country + Device breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ScansPerCountryChart
              data={topStats?.countryBreakdown ?? []}
              totalScans={topStats?.totalScans ?? 0}
              isLoading={topStatsLoading}
            />
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('Devices')}</h3>
              {topStatsLoading ? (
                <ChartSkeleton />
              ) : (
                <PieChart data={topStats?.deviceBreakdown ?? []} height={250} />
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('Browsers')}</h3>
              {topStatsLoading ? (
                <ChartSkeleton />
              ) : (
                <PieChart data={topStats?.browserBreakdown ?? []} height={250} />
              )}
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">{t('Operating Systems')}</h3>
              {topStatsLoading ? (
                <ChartSkeleton />
              ) : (
                <PieChart data={topStats?.osBreakdown ?? []} height={250} />
              )}
            </div>
          </div>
        </>
      )}

      {/* Top QR Codes Leaderboard */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('Top Performing QR Codes')}</h2>
          <Link
            href="/qrcodes"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            {t('View all')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {qrLoading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-2 w-full animate-pulse rounded bg-gray-100" />
                </div>
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : topTen.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            <QrCode className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            {t('No QR codes yet')}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {topTen.map((qr, index) => {
              const pct = maxScans > 0 ? Math.round(((qr.scans ?? 0) / maxScans) * 100) : 0
              return (
                <div
                  key={qr.id}
                  className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/qrcodes/${qr.id}/analytics`)}
                >
                  {/* Rank */}
                  <span className="w-6 text-center text-sm font-bold text-gray-400">
                    {index + 1}
                  </span>

                  {/* QR image */}
                  {qr.screenshotUrl ? (
                    <img
                      src={qr.screenshotUrl}
                      alt={qr.name}
                      className="h-10 w-10 rounded-md object-contain border border-gray-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <QrCode className="h-5 w-5 text-gray-400" />
                    </div>
                  )}

                  {/* Name + bar */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{qr.name}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 capitalize">{qr.type}</span>
                    </div>
                  </div>

                  {/* Scans + link */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-900">
                      {(qr.scans ?? 0).toLocaleString()} {t('scans')}
                    </span>
                    <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
