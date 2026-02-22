'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'error'
  label?: string
  animated?: boolean
  className?: string
}

const statusStyles: Record<StatusBadgeProps['status'], { dot: string; bg: string; text: string }> = {
  active: { dot: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  inactive: { dot: 'bg-gray-400', bg: 'bg-gray-50', text: 'text-gray-600' },
  pending: { dot: 'bg-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  error: { dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
}

const defaultLabels: Record<StatusBadgeProps['status'], string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  error: 'Error',
}

export function StatusBadge({ status, label, animated = false, className }: StatusBadgeProps) {
  const styles = statusStyles[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles.bg,
        styles.text,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {animated && status === 'active' && (
          <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', styles.dot)} />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', styles.dot)} />
      </span>
      {label || defaultLabels[status]}
    </span>
  )
}
