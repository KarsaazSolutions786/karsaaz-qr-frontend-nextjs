'use client'

import React from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon?: React.ReactNode
  isLoading?: boolean
}

export default function MetricCard({
  title,
  value,
  change,
  icon,
  isLoading,
}: MetricCardProps) {
  const formatChange = (val: number) => {
    const sign = val >= 0 ? '+' : ''
    return `${sign}${val.toFixed(1)}%`
  }

  const changeColor =
    change !== undefined
      ? change >= 0
        ? 'text-green-600'
        : 'text-red-600'
      : 'text-gray-500'

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-gray-200" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          )}
          {change !== undefined && !isLoading && (
            <p className={`mt-2 text-sm font-medium ${changeColor}`}>
              {formatChange(change)} vs previous period
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
