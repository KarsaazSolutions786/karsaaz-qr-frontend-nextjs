'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { getPresetDateRange } from '@/lib/utils/date-range'
import { useQRCodeStats, useQRCodeScans } from '@/lib/hooks/queries/useAnalytics'
import { useQRCode } from '@/lib/hooks/queries/useQRCode'
import MetricCard from '@/components/analytics/MetricCard'
import ChartContainer from '@/components/analytics/charts/ChartContainer'
import LineChart from '@/components/analytics/charts/LineChart'
import PieChart from '@/components/analytics/charts/PieChart'
import ActivityFeed from '@/components/analytics/ActivityFeed'
import DateRangePicker from '@/components/analytics/DateRangePicker'
import type { DateRange } from '@/types/entities/analytics'

export default function QRCodeAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const qrcodeId = parseInt(params.id as string, 10)

  const [dateRange, setDateRange] = useState<DateRange>(
    getPresetDateRange('last30days')
  )

  const { data: qrcode } = useQRCode(params.id as string)

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQRCodeStats(qrcodeId, dateRange)

  const {
    data: scansData,
    isLoading: scansLoading,
  } = useQRCodeScans(qrcodeId, {
    page: 1,
    perPage: 10,
    ...dateRange,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {qrcode?.name ?? 'QR Code Analytics'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Detailed performance metrics
            </p>
          </div>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Scans"
          value={stats?.totalScans.toLocaleString() ?? '0'}
          isLoading={statsLoading}
        />
        <MetricCard
          title="Unique Scans"
          value={stats?.uniqueScans.toLocaleString() ?? '0'}
          isLoading={statsLoading}
        />
        <MetricCard
          title="Last Scan"
          value={stats?.lastScan ? format(new Date(stats.lastScan), 'MMM d, yyyy') : 'Never'}
          isLoading={statsLoading}
        />
        <MetricCard
          title="Avg. Daily Scans"
          value={stats?.scansByDay ? (stats.totalScans / stats.scansByDay.length).toFixed(1) : '0'}
          isLoading={statsLoading}
        />
      </div>

      {/* Scans Over Time */}
      <ChartContainer
        title="Scans Over Time"
        description="Daily scan activity for this QR code"
        isLoading={statsLoading}
        error={statsError}
      >
        <LineChart
          data={stats?.scansByDay ?? []}
          dataKey="count"
          xAxisKey="date"
          color="#3b82f6"
        />
      </ChartContainer>

      {/* Breakdown Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartContainer
          title="Devices"
          isLoading={statsLoading}
          error={statsError}
        >
          <PieChart data={stats?.deviceBreakdown ?? []} height={250} />
        </ChartContainer>

        <ChartContainer
          title="Locations"
          isLoading={statsLoading}
          error={statsError}
        >
          <PieChart data={stats?.locationBreakdown ?? []} height={250} />
        </ChartContainer>

        <ChartContainer
          title="Browsers"
          isLoading={statsLoading}
          error={statsError}
        >
          <PieChart data={stats?.browserBreakdown ?? []} height={250} />
        </ChartContainer>
      </div>

      {/* Recent Scans */}
      <ChartContainer
        title="Recent Scans"
        description="Latest scan activity"
        isLoading={scansLoading}
      >
        <ActivityFeed scans={scansData?.data ?? []} isLoading={scansLoading} />
      </ChartContainer>
    </div>
  )
}
