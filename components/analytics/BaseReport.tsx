'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, BarChart3 } from 'lucide-react'

interface BaseReportProps {
  title: string
  isLoading?: boolean
  error?: string | null
  isEmpty?: boolean
  children: React.ReactNode
  className?: string
}

export function BaseReport({
  title,
  isLoading = false,
  error = null,
  isEmpty = false,
  children,
  className,
}: BaseReportProps) {
  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white p-6', className)}>
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : isEmpty ? (
        <div className="py-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">No data available</p>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
