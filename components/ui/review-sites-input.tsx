'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const PLATFORMS = ['Google', 'Yelp', 'TripAdvisor', 'Facebook', 'Trustpilot'] as const
export type ReviewPlatform = (typeof PLATFORMS)[number]

export interface ReviewSite {
  platform: ReviewPlatform
  url: string
}

interface ReviewSitesInputProps {
  value?: ReviewSite[]
  onChange: (value: ReviewSite[]) => void
  className?: string
}

export function ReviewSitesInput({ value = [], onChange, className }: ReviewSitesInputProps) {
  const addRow = () => {
    onChange([...value, { platform: 'Google', url: '' }])
  }

  const updateRow = (index: number, patch: Partial<ReviewSite>) => {
    onChange(value.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className={cn('space-y-2', className)}>
      {value.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <select
            value={row.platform}
            onChange={(e) => updateRow(i, { platform: e.target.value as ReviewPlatform })}
            className={cn(
              'h-10 w-40 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input
            type="url"
            placeholder="https://..."
            value={row.url}
            onChange={(e) => updateRow(i, { url: e.target.value })}
            className={cn(
              'flex h-10 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            )}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Remove row"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className={cn(
          'flex h-9 items-center gap-1 rounded-md border border-dashed border-gray-300 px-3 text-sm text-gray-600',
          'hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500'
        )}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add review site
      </button>
    </div>
  )
}
