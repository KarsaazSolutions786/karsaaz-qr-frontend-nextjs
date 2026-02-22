'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

function getTimezones(): string[] {
  try {
    return Intl.supportedValuesOf('timeZone')
  } catch {
    return [
      'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
      'America/Toronto', 'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
      'Europe/Moscow', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo',
      'Asia/Seoul', 'Australia/Sydney', 'Pacific/Auckland',
    ]
  }
}

function getUtcOffset(tz: string): string {
  try {
    const now = new Date()
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
    const parts = fmt.formatToParts(now)
    const offset = parts.find((p) => p.type === 'timeZoneName')?.value || ''
    return offset
  } catch {
    return ''
  }
}

interface TimezoneSelectProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

export function TimezoneSelect({ value, onChange, className }: TimezoneSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const ref = React.useRef<HTMLDivElement>(null)

  const timezones = React.useMemo(() => getTimezones(), [])
  const filtered = React.useMemo(
    () => timezones.filter((tz) => tz.toLowerCase().includes(search.toLowerCase())),
    [timezones, search]
  )

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
          'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        )}
      >
        <span className="truncate">{value || 'Select timezone…'}</span>
        <svg className="h-4 w-4 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search timezones…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              )}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No timezones found</div>
            )}
            {filtered.map((tz) => (
              <button
                key={tz}
                type="button"
                onClick={() => { onChange(tz); setOpen(false); setSearch('') }}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-blue-50',
                  value === tz && 'bg-blue-50 font-medium text-blue-600'
                )}
              >
                <span>{tz.replace(/_/g, ' ')}</span>
                <span className="text-xs text-gray-400">{getUtcOffset(tz)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
