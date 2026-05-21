/**
 * ScansPerCityChart Component
 *
 * Horizontal bar chart (recharts BarChart with layout="vertical") showing
 * top 10 cities by scan count with tooltip, responsive sizing, and
 * "Show all" toggle to expand beyond the top 10.
 */

'use client'

import React, { useState, useMemo } from 'react'
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { CityBreakdownItem } from '@/types/entities/analytics'

// ---------- Types ----------

export interface ScansPerCityChartProps {
  data: CityBreakdownItem[]
  isLoading?: boolean
  maxCities?: number
  height?: number
}

// ---------- Constants ----------

const BAR_COLORS = [
  '#6366f1', // indigo-500
  '#818cf8', // indigo-400
  '#a5b4fc', // indigo-300
  '#c7d2fe', // indigo-200
  '#8b5cf6', // violet-500
  '#a78bfa', // violet-400
  '#c4b5fd', // violet-300
  '#7c3aed', // violet-600
  '#6d28d9', // violet-700
  '#4f46e5', // indigo-600
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
      <div className="flex h-full flex-col justify-center gap-3 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div
              className="h-6 rounded bg-gray-200"
              style={{ width: `${90 - i * 8}%` }}
            />
          </div>
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
}: {
  active?: boolean
  payload?: { payload: { name: string; scans: number; country?: string } }[]
}) {
  if (!active || !payload || payload.length === 0) return null

  const firstEntry = payload[0]
  if (!firstEntry) return null

  const item = firstEntry.payload

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
      {item.country && (
        <p className="text-xs text-gray-500">{item.country}</p>
      )}
      <p className="mt-1 text-lg font-bold text-indigo-600">
        {item.scans.toLocaleString()} scans
      </p>
    </div>
  )
}

// ---------- Component ----------

/**
 * Purpose: Executes ScansPerCityChart functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function ScansPerCityChart({
  data,
  isLoading = false,
  maxCities = 10,
  height: _height = 400,
}: ScansPerCityChartProps) {
  const { t } = useTranslation()
  const [showAll, setShowAll] = useState(false)

  // Sort all cities by scan count descending
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  )

  const hasMore = sorted.length > maxCities

  // Determine visible items based on toggle
  const chartData = useMemo(() => {
    const visible = showAll ? sorted : sorted.slice(0, maxCities)
    return visible.map((item) => ({
      name: item.label,
      scans: item.value,
      country: item.country,
    }))
  }, [sorted, showAll, maxCities])

  // Remaining cities summary (only when not showing all)
  const remaining = useMemo(() => {
    if (showAll || data.length <= maxCities) return null
    const rest = sorted.slice(maxCities)
    const totalRest = rest.reduce((sum, d) => sum + d.value, 0)
    return { count: rest.length, total: totalRest }
  }, [data, sorted, showAll, maxCities])

  // Dynamic height based on number of items
  const dynamicHeight = Math.max(
    250,
    chartData.length * 44 + 60
  )

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
          <MapPin className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t('Scans by City')}
          </h3>
          <p className="text-sm text-gray-500">
            {showAll
              ? `All ${data.length}`
              : `Top ${Math.min(maxCities, data.length)} of ${data.length}`}{' '}
            {data.length === 1 ? 'city' : 'cities'}
          </p>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <ChartSkeleton height={dynamicHeight} />
      ) : data.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <MapPin className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm text-gray-500">{t('No data available')}</p>
          <p className="mt-1 text-xs text-gray-400">
            {t('City data will appear once your QR code is scanned')}
          </p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={dynamicHeight}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) =>
                  value >= 1000
                    ? `${(value / 1000).toFixed(1)}k`
                    : `${value}`
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={110}
                tick={({ x, y, payload }) => (
                  <text
                    x={x}
                    y={y}
                    textAnchor="end"
                    fill="#374151"
                    fontSize={13}
                    dominantBaseline="central"
                  >
                    {payload.value.length > 14
                      ? `${payload.value.slice(0, 12)}...`
                      : payload.value}
                  </text>
                )}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="scans" radius={[0, 6, 6, 0]} maxBarSize={28}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Remaining cities summary (only when not showing all) */}
          {remaining && (
            <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-center">
              <p className="text-sm text-gray-500">
                + {remaining.count} more{' '}
                {remaining.count === 1 ? 'city' : 'cities'} with{' '}
                <span className="font-medium text-gray-700">
                  {remaining.total.toLocaleString()}
                </span>{' '}
                total scans
              </p>
            </div>
          )}

          {/* Show all / Show less */}
          {hasMore && (
            <div className="mt-4 border-t border-gray-100 pt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
              >
                {showAll ? (
                  <>
                    Show top {maxCities} <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show all {sorted.length} cities{' '}
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
