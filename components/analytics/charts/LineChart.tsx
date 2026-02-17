'use client'

import React from 'react'
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

export default function LineChart({
  data,
  dataKey = 'count',
  xAxisKey = 'date',
  color = '#3b82f6',
  height = 300,
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500">
        No data available
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
