'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BusinessHours {
  day: string
  enabled: boolean
  open: string
  close: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DEFAULT_HOURS: BusinessHours[] = DAYS.map((day) => ({
  day,
  enabled: day !== 'Saturday' && day !== 'Sunday',
  open: '09:00',
  close: '17:00',
}))

interface BusinessHoursInputProps {
  value?: BusinessHours[]
  onChange: (value: BusinessHours[]) => void
  className?: string
}

export function BusinessHoursInput({ value, onChange, className }: BusinessHoursInputProps) {
  const hours = value && value.length === 7 ? value : DEFAULT_HOURS

  const update = (index: number, patch: Partial<BusinessHours>) => {
    const next = hours.map((h, i) => (i === index ? { ...h, ...patch } : h))
    onChange(next)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {hours.map((h, i) => (
        <div key={h.day} className="flex items-center gap-3">
          <label className="flex items-center gap-2 w-32 text-sm">
            <input
              type="checkbox"
              checked={h.enabled}
              onChange={(e) => update(i, { enabled: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            {h.day}
          </label>
          <input
            type="time"
            value={h.open}
            disabled={!h.enabled}
            onChange={(e) => update(i, { open: e.target.value })}
            className={cn(
              'h-9 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          />
          <span className="text-sm text-gray-500">to</span>
          <input
            type="time"
            value={h.close}
            disabled={!h.enabled}
            onChange={(e) => update(i, { close: e.target.value })}
            className={cn(
              'h-9 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm',
              'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          />
        </div>
      ))}
    </div>
  )
}
