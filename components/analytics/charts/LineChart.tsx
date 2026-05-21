'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n'
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { TimeSeriesPoint } from '@/types/entities/analytics'

interface LineChartProps {
  data: TimeSeriesPoint[]
  dataKey?: string
  xAxisKey?: string
  color?: string
  height?: number
}

/**
 * Purpose: Executes LineChart functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function LineChart({
  data,
  dataKey = 'count',
  xAxisKey = 'date',
  color = '#3b82f6',
  height = 300,
}: LineChartProps) {
  const { t } = useTranslation()

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        {t('No data available')}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey={xAxisKey}
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
        />
        <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RechartsLine>
    </ResponsiveContainer>
  )
}
