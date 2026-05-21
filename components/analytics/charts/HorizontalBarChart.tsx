'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n'
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { BreakdownItem } from '@/types/entities/analytics'

const DEFAULT_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#6366f1',
  '#ef4444',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
]

interface HorizontalBarChartProps {
  data: BreakdownItem[]
  height?: number
  colors?: string[]
  maxBars?: number
  barSize?: number
  showGrid?: boolean
  showPercentage?: boolean
}

/**
 * Purpose: Executes HorizontalBarChart functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function HorizontalBarChart({
  data,
  height = 300,
  colors = DEFAULT_COLORS,
  maxBars = 10,
  barSize = 24,
  showGrid = false,
  showPercentage = true,
}: HorizontalBarChartProps) {
  const { t } = useTranslation()

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        {t('No data available')}
      </div>
    )
  }

  const sliced = data.slice(0, maxBars)
  const dynamicHeight = Math.max(height, sliced.length * 44)

  return (
    <ResponsiveContainer width="100%" height={dynamicHeight}>
      <RechartsBar
        data={sliced}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        barSize={barSize}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
        )}
        <XAxis
          type="number"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val: number) =>
            val >= 1000 ? `${(val / 1000).toFixed(0)}k` : String(val)
          }
        />
        <YAxis
          type="category"
          dataKey="label"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={120}
          tick={({ x, y, payload }) => (
            <text
              x={x}
              y={y}
              dy={4}
              textAnchor="end"
              fill="#374151"
              fontSize={12}
            >
              {String(payload.value).length > 18
                ? `${String(payload.value).slice(0, 18)}...`
                : payload.value}
            </text>
          )}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '0.875rem',
          }}
          formatter={(value, _name, props) => {
            const v = Number(value ?? 0)
            const item = (props as { payload?: BreakdownItem })?.payload
            const pct = item?.percentage
            const label = showPercentage && pct != null
              ? `${v.toLocaleString()} (${pct.toFixed(1)}%)`
              : v.toLocaleString()
            return [label, t('Count')]
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {sliced.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  )
}
