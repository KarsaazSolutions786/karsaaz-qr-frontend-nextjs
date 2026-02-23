'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export interface BalloonOption {
  value: string
  label: string
  icon?: ReactNode
}

interface BalloonSelectorProps {
  options: BalloonOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function BalloonSelector({
  options,
  value,
  onChange,
  className,
}: BalloonSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              selected
                ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
            )}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
