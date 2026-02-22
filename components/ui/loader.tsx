'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LoaderProps {
  variant?: 'spinner' | 'bar'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
const barSizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' }

export function Loader({ variant = 'spinner', size = 'md', className }: LoaderProps) {
  if (variant === 'bar') {
    return (
      <div className={cn('w-full overflow-hidden rounded-full bg-gray-200', barSizes[size], className)}>
        <div className="h-full w-1/3 animate-[bar_1.5s_ease-in-out_infinite] rounded-full bg-blue-600" />
        <style>{`@keyframes bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }`}</style>
      </div>
    )
  }

  return (
    <svg
      className={cn('animate-spin text-blue-600', spinnerSizes[size], className)}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
