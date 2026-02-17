'use client'

import React, { useState } from 'react'
import { getPresetDateRange } from '@/lib/utils/date-range'
import { useAnalyticsOverview, useTopQRCodes } from '@/lib/hooks/queries/useAnalytics'
import MetricCard from '@/components/analytics/MetricCard'
import ChartContainer from '@/components/analytics/charts/ChartContainer'
import LineChart from '@/components/analytics/charts/LineChart'
import BarChart from '@/components/analytics/charts/BarChart'
import PieChart from '@/components/analytics/charts/PieChart'
import ActivityFeed from '@/components/analytics/ActivityFeed'
import DateRangePicker from '@/components/analytics/DateRangePicker'
import type { DateRange } from '@/types/entities/analytics'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>(
    getPresetDateRange('last30days')
  )

  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useAnalyticsOverview(dateRange)

  const {
    data: topQRCodes,
    isLoading: topLoading,
    error: topError,
  } = useTopQRCodes(dateRange, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your QR code performance and engagement
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Scans"
          value={overview?.totalScans.toLocaleString() ?? '0'}
          change={overview?.scanGrowth}
          isLoading={overviewLoading}
        />
        <MetricCard
          title="Unique Users"
          value={overview?.uniqueUsers.toLocaleString() ?? '0'}
          isLoading={overviewLoading}
        />
        <MetricCard
          title="Active QR Codes"
          value={overview?.activeQRCodes ?? '0'}
          change={overview?.activeGrowth}
          isLoading={overviewLoading}
        />
        <MetricCard
          title="Total QR Codes"
          value={overview?.totalQRCodes ?? '0'}
          isLoading={overviewLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartContainer
          title="Scans Over Time"
          description="Daily scan activity"
          isLoading={overviewLoading}
          error={overviewError}
        >
          <LineChart
            data={overview?.scansOverTime ?? []}
            dataKey="count"
            xAxisKey="date"
            color="#3b82f6"
          />
        </ChartContainer>

        <ChartContainer
          title="Top Performing QR Codes"
          description="Most scanned QR codes"
          isLoading={topLoading}
          error={topError}
        >
          <BarChart
            data={
              topQRCodes?.map((qr) => ({
                label: qr.name,
                value: qr.totalScans,
              })) ?? []
            }
            dataKey="value"
            xAxisKey="label"
            color="#8b5cf6"
            layout="vertical"
          />
        </ChartContainer>
      </div>

      {/* Breakdown Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartContainer
          title="Scans by Device"
          isLoading={overviewLoading}
          error={overviewError}
        >
          <PieChart data={overview?.deviceBreakdown ?? []} />
        </ChartContainer>

        <ChartContainer
          title="Scans by Location"
          isLoading={overviewLoading}
          error={overviewError}
        >
          <PieChart data={overview?.locationBreakdown ?? []} />
        </ChartContainer>
      </div>

      {/* Recent Activity */}
      <ChartContainer
        title="Recent Scans"
        description="Latest QR code scans"
        isLoading={overviewLoading}
        error={overviewError}
      >
        <ActivityFeed scans={overview?.recentActivity ?? []} />
      </ChartContainer>
    </div>
  )
}
