/**
 * ScansPerDayChart Component
 *
 * Line chart showing daily scan counts over a configurable date range.
 * Includes a date range selector (7d, 30d, 90d, 1y), responsive layout,
 * and a tooltip displaying the date and count on hover.
 */

'use client'

import React, { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from 'recharts'
import type { TimeSeriesPoint } from '@/types/entities/analytics'
import type { ChartDatePreset } from '@/lib/hooks/useAnalyticsCharts'

// ---------- Types ----------

export interface ScansPerDayChartProps {
  data: TimeSeriesPoint[]
  isLoading?: boolean
  preset?: ChartDatePreset
  onPresetChange?: (preset: ChartDatePreset) => void
  height?: number
}

// ---------- Constants ----------

const PRESET_OPTIONS: { value: ChartDatePreset; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '1y', label: '1 year' },
]

// ---------- Loading skeleton ----------

/**
 * Purpose: Executes ChartSkeleton functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function ChartSkeleton({ height }: { height: number }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="flex h-full items-end gap-1 px-8 pb-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gray-200"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  )
}

// ---------- Custom tooltip ----------

/**
 * Purpose: Executes CustomTooltip functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload || payload.length === 0) return null

  const firstEntry = payload[0]
  if (!firstEntry) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900">
        {firstEntry.value.toLocaleString()} scans
      </p>
    </div>
  )
}

// ---------- Component ----------

/**
 * Purpose: Executes ScansPerDayChart functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function ScansPerDayChart({
  data,
  isLoading = false,
  preset = '30d',
  onPresetChange,
  height = 320,
}: ScansPerDayChartProps) {
  const { t } = useTranslation()

  // Compute summary stats
  const summary = useMemo(() => {
    if (!data || data.length === 0)
      return { total: 0, average: 0, peak: 0, peakDate: '' }

    const total = data.reduce((sum, d) => sum + d.count, 0)
    const average = total / data.length
    let peak = 0
    let peakDate = ''
    for (const d of data) {
      if (d.count > peak) {
        peak = d.count
        peakDate = d.date
      }
    }

    return { total, average: Math.round(average * 10) / 10, peak, peakDate }
  }, [data])

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('Scans Per Day')}
            </h3>
            <p className="text-sm text-gray-500">{t('Daily scan activity')}</p>
          </div>
        </div>

        {/* Date range selector */}
        {onPresetChange && (
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {PRESET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onPresetChange(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  preset === opt.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(opt.label)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary stats */}
      {!isLoading && data.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-gray-50 px-4 py-2">
            <p className="text-xs text-gray-500">{t('Total')}</p>
            <p className="text-lg font-bold text-gray-900">
              {summary.total.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-2">
            <p className="text-xs text-gray-500">{t('Daily Average')}</p>
            <p className="text-lg font-bold text-gray-900">
              {summary.average.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-2">
            <p className="text-xs text-gray-500">{t('Peak Day')}</p>
            <p className="text-lg font-bold text-gray-900">
              {summary.peak.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Chart area */}
      {isLoading ? (
        <ChartSkeleton height={height} />
      ) : data.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center text-center"
          style={{ height }}
        >
          <TrendingUp className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm text-gray-500">{t('No data available')}</p>
          <p className="mt-1 text-xs text-gray-400">
            {t('Scans will appear here once your QR code is scanned')}
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={45}
              tickFormatter={(value: number) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="none"
              fill="url(#scanGradient)"
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
