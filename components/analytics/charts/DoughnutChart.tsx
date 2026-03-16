'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n'
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
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

interface DoughnutChartProps {
  data: BreakdownItem[]
  height?: number
  innerRadius?: number
  outerRadius?: number
  colors?: string[]
  showLabels?: boolean
  showLegend?: boolean
  centerLabel?: string
  centerValue?: string | number
}

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: Record<string, number | string>) {
  const pct = Number(percent)
  if (pct < 0.05) return null
  const RADIAN = Math.PI / 180
  const r = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 1.4
  const xPos = Number(cx) + r * Math.cos(-Number(midAngle) * RADIAN)
  const yPos = Number(cy) + r * Math.sin(-Number(midAngle) * RADIAN)

  return (
    <text
      x={xPos}
      y={yPos}
      fill="#374151"
      textAnchor={xPos > Number(cx) ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {name} ({(pct * 100).toFixed(0)}%)
    </text>
  )
}

export default function DoughnutChart({
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  colors = DEFAULT_COLORS,
  showLabels = true,
  showLegend = true,
  centerLabel,
  centerValue,
}: DoughnutChartProps) {
  const { t } = useTranslation()

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        {t('No data available')}
      </div>
    )
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPie>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            label={showLabels ? (renderCustomLabel as unknown as import('recharts').PieLabel) : false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                strokeWidth={0}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
            formatter={(value, name) => {
              const v = Number(value ?? 0)
              return [
                `${v.toLocaleString()} (${data.find((d) => d.label === name)?.percentage?.toFixed(1) ?? '0'}%)`,
                name,
              ]
            }}
          />
          {showLegend && <Legend />}
        </RechartsPie>
      </ResponsiveContainer>

      {/* Center label for doughnut */}
      {(centerLabel || centerValue !== undefined) && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {centerValue !== undefined && (
              <div className="text-2xl font-bold text-gray-900">
                {typeof centerValue === 'number'
                  ? centerValue.toLocaleString()
                  : centerValue}
              </div>
            )}
            {centerLabel && (
              <div className="text-xs text-gray-500">{centerLabel}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
