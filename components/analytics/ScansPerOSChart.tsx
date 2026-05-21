/**
 * ScansPerOSChart Component
 *
 * Doughnut/Pie chart (recharts PieChart) showing scan distribution by
 * operating system. Includes a legend with percentages and color-coded
 * segments with a hollow center displaying the total.
 */

'use client'

import React, { useMemo } from 'react'
import { Monitor } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from 'recharts'
import type { BreakdownItem } from '@/types/entities/analytics'

// ---------- Types ----------

export interface ScansPerOSChartProps {
  data: BreakdownItem[]
  totalScans: number
  isLoading?: boolean
  height?: number
}

// ---------- Constants ----------

const OS_COLORS: Record<string, string> = {
  iOS: '#007AFF',
  Android: '#3DDC84',
  Windows: '#0078D4',
  macOS: '#555555',
  Linux: '#FCC624',
  'Chrome OS': '#4285F4',
  Ubuntu: '#E95420',
}

const FALLBACK_COLORS = [
  '#6366f1',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
]

/**
 * Purpose: Retrieves oscolor.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getOSColor(osName: string, index: number): string {
  return OS_COLORS[osName] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length] ?? '#6366f1'
}

// ---------- Loading skeleton ----------

/**
 * Purpose: Executes ChartSkeleton functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function ChartSkeleton() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div className="h-48 w-48 animate-pulse rounded-full border-[20px] border-gray-200" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

// ---------- Active shape renderer (for hover effect on segments) ----------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Purpose: Executes renderActiveShape functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function renderActiveShape(props: any) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      {/* Center text on hover */}
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fill="#111827"
        fontSize={16}
        fontWeight="bold"
      >
        {payload.label}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="#6b7280"
        fontSize={13}
      >
        {value.toLocaleString()} ({(percent * 100).toFixed(1)}%)
      </text>
    </g>
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
  payload?: { payload: { label: string; value: number; percentage: number }; color: string }[]
}) {
  if (!active || !payload || payload.length === 0) return null

  const firstEntry = payload[0]
  if (!firstEntry) return null

  const item = firstEntry.payload
  const color = firstEntry.color

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
      </div>
      <p className="mt-1 text-lg font-bold text-gray-900">
        {item.value.toLocaleString()} scans
      </p>
      <p className="text-sm text-gray-500">{item.percentage}% of total</p>
    </div>
  )
}

// ---------- Component ----------

/**
 * Purpose: Executes ScansPerOSChart functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function ScansPerOSChart({
  data,
  totalScans,
  isLoading = false,
  height = 300,
}: ScansPerOSChartProps) {
  const { t } = useTranslation()

  // Sort by value descending and compute colors
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value)
    return sorted.map((item, i) => ({
      ...item,
      color: getOSColor(item.label, i),
    }))
  }, [data])

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
          <Monitor className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t('Scans by OS')}
          </h3>
          <p className="text-sm text-gray-500">
            {t('Operating system distribution')}
          </p>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <ChartSkeleton />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Monitor className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm text-gray-500">{t('No data available')}</p>
          <p className="mt-1 text-xs text-gray-400">
            {t('OS data will appear once your QR code is scanned')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 lg:flex-row">
          {/* Pie chart */}
          <div className="relative w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={height}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={2}
                  activeShape={renderActiveShape}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center total overlay (always visible, hidden by activeShape on hover) */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {totalScans.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{t('Total Scans')}</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full space-y-3 lg:w-1/2">
            {chartData.map((item) => {
              const percentage =
                totalScans > 0
                  ? ((item.value / totalScans) * 100).toFixed(1)
                  : '0.0'

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
                >
                  <div
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="flex-1 text-sm font-medium text-gray-900">
                    {item.label}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value.toLocaleString()}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {percentage}%
                    </span>
                  </div>
                </div>
              )
            })}

            {/* Total row */}
            <div className="mt-2 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-3 px-3">
                <div className="h-3 w-3 flex-shrink-0 rounded-full bg-gray-300" />
                <span className="flex-1 text-sm font-medium text-gray-600">
                  {t('Total')}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {totalScans.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
