'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2']

export interface ChartProps {
  data: Record<string, any>[]
  title?: string
  className?: string
}

export interface LineChartProps extends ChartProps {
  xKey: string
  yKey: string | string[]
}

export interface BarChartProps extends ChartProps {
  xKey: string
  yKey: string | string[]
}

export interface DoughnutChartProps extends ChartProps {
  dataKey: string
  nameKey?: string
}

export function LineChartWrapper({ data, xKey, yKey, title, className }: LineChartProps) {
  const keys = Array.isArray(yKey) ? yKey : [yKey]
  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="mb-2 text-sm font-medium text-gray-700">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip />
          <Legend />
          {keys.map((k, i) => (
            <Line
              key={k}
              type="monotone"
              dataKey={k}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChartWrapper({ data, xKey, yKey, title, className }: BarChartProps) {
  const keys = Array.isArray(yKey) ? yKey : [yKey]
  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="mb-2 text-sm font-medium text-gray-700">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip />
          <Legend />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DoughnutChartWrapper({ data, dataKey, nameKey = 'name', title, className }: DoughnutChartProps) {
  return (
    <div className={cn('w-full', className)}>
      {title && <h3 className="mb-2 text-sm font-medium text-gray-700">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
