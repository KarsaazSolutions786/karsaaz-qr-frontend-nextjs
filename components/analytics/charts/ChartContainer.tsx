'use client'

import React from 'react'

interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  isLoading?: boolean
  error?: Error | null
  actions?: React.ReactNode
}

export default function ChartContainer({
  title,
  description,
  children,
  isLoading,
  error,
  actions,
}: ChartContainerProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="mt-4 text-center text-sm text-red-600">
          Failed to load chart data
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      ) : (
        <div className="mt-4">{children}</div>
      )}
    </div>
  )
}
