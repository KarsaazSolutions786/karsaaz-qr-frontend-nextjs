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
import { RealtimeStatsWidget } from '@/components/analytics/RealtimeStatsWidget'
import { LocationMap } from '@/components/analytics/LocationMap'
import { DeviceBrowserCharts } from '@/components/analytics/DeviceBrowserCharts'
import { ReferrerTracker } from '@/components/analytics/ReferrerTracker'
import { ScansPerLanguage } from '@/components/analytics/ScansPerLanguage'
import { ScansPerHour } from '@/components/analytics/ScansPerHour'
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

  // Mock data for new analytics components
  const mockLocationData = [
    { country: 'United States', countryCode: 'US', scans: 1245, city: 'New York', latitude: 40.7128, longitude: -74.0060 },
    { country: 'Canada', countryCode: 'CA', scans: 856, city: 'Toronto', latitude: 43.6532, longitude: -79.3832 },
    { country: 'United Kingdom', countryCode: 'GB', scans: 734, city: 'London', latitude: 51.5074, longitude: -0.1278 },
    { country: 'Germany', countryCode: 'DE', scans: 621, city: 'Berlin', latitude: 52.5200, longitude: 13.4050 },
    { country: 'Japan', countryCode: 'JP', scans: 489, city: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  ]

  const mockDeviceData = [
    { type: 'mobile' as const, count: 3250 },
    { type: 'desktop' as const, count: 1420 },
    { type: 'tablet' as const, count: 330 },
  ]

  const mockBrowserData = [
    { name: 'Chrome', count: 2450 },
    { name: 'Safari', count: 1560 },
    { name: 'Firefox', count: 720 },
    { name: 'Edge', count: 270 },
  ]

  const mockOSData = [
    { name: 'iOS', count: 1890 },
    { name: 'Android', count: 1650 },
    { name: 'Windows', count: 980 },
    { name: 'macOS', count: 480 },
  ]

  const mockReferrers = [
    { url: 'https://google.com/search', domain: 'google.com', scans: 856, lastSeen: new Date() },
    { url: 'https://facebook.com', domain: 'facebook.com', scans: 634, lastSeen: new Date() },
    { url: 'https://twitter.com', domain: 'twitter.com', scans: 421, lastSeen: new Date() },
    { url: 'https://instagram.com', domain: 'instagram.com', scans: 312, lastSeen: new Date() },
  ]

  const mockLanguageData = [
    { language: 'English', count: 2340, percentage: 46.8 },
    { language: 'Spanish', count: 890, percentage: 17.8 },
    { language: 'French', count: 520, percentage: 10.4 },
    { language: 'German', count: 410, percentage: 8.2 },
    { language: 'Japanese', count: 340, percentage: 6.8 },
    { language: 'Chinese', count: 280, percentage: 5.6 },
    { language: 'Arabic', count: 220, percentage: 4.4 },
  ]

  const mockHourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: Math.round(50 + 200 * Math.sin((i - 6) * Math.PI / 12) ** 2 + (i >= 9 && i <= 17 ? 80 : 0)),
  }))

  const totalScans = overview?.totalScans || 5000

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

      {/* Real-time Stats Widget */}
      <RealtimeStatsWidget showRecentScans={true} />

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

      {/* Location Map */}
      <LocationMap
        locations={mockLocationData}
        totalScans={totalScans}
        showList={true}
      />

      {/* Device & Browser Analytics */}
      <DeviceBrowserCharts
        devices={mockDeviceData}
        browsers={mockBrowserData}
        operatingSystems={mockOSData}
        totalScans={totalScans}
      />

      {/* Referrer Tracking */}
      <ReferrerTracker
        referrers={mockReferrers}
        totalScans={totalScans}
        directScans={1234}
        unknownScans={543}
      />

      {/* Language & Hourly Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ScansPerLanguage data={mockLanguageData} />
        <ScansPerHour data={mockHourlyData} />
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
