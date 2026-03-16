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
  Legend,
} from 'recharts'

interface BarChartProps {
  data: any[]
  dataKey?: string
  xAxisKey?: string
  color?: string
  height?: number
  layout?: 'horizontal' | 'vertical'
}

export default function BarChart({
  data,
  dataKey = 'value',
  xAxisKey = 'label',
  color = '#3b82f6',
  height = 300,
  layout = 'vertical',
}: BarChartProps) {
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
      <RechartsBar data={data} layout={layout}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        {layout === 'vertical' ? (
          <>
            <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              width={100}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={xAxisKey} stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  )
}
