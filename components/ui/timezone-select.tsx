'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { ChevronDown, Clock, Search } from 'lucide-react'

/**
 * Purpose: Retrieves timezones.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function getTimezones(): string[] {
  try {
    return Intl.supportedValuesOf('timeZone')
  } catch {
    return [
      'UTC',
      'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
      'America/Toronto', 'America/Sao_Paulo', 'America/Mexico_City', 'America/Argentina/Buenos_Aires',
      'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid', 'Europe/Rome',
      'Europe/Moscow', 'Europe/Istanbul',
      'Asia/Dubai', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul',
      'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Bangkok', 'Asia/Karachi',
      'Africa/Cairo', 'Africa/Lagos', 'Africa/Johannesburg', 'Africa/Nairobi',
      'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth',
      'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Honolulu',
    ]
  }
}

/**
 * Purpose: Retrieves utcoffset.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function getUtcOffset(tz: string): string {
  try {
    const now = new Date()
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' })
    const parts = fmt.formatToParts(now)
    return parts.find((p) => p.type === 'timeZoneName')?.value || ''
  } catch {
    return ''
  }
}

/**
 * Purpose: Retrieves region.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getRegion(tz: string): string {
  const slash = tz.indexOf('/')
  if (slash === -1) return 'Other'
  return tz.slice(0, slash)
}

const REGION_ORDER = [
  'America', 'Europe', 'Asia', 'Africa', 'Australia', 'Pacific', 'Atlantic', 'Indian', 'Arctic', 'Antarctica', 'Other',
]

const REGION_LABELS: Record<string, string> = {
  America: 'Americas',
  Europe: 'Europe',
  Asia: 'Asia',
  Africa: 'Africa',
  Australia: 'Australia',
  Pacific: 'Pacific',
  Atlantic: 'Atlantic',
  Indian: 'Indian Ocean',
  Arctic: 'Arctic',
  Antarctica: 'Antarctica',
  Other: 'Other',
}

interface TimezoneEntry {
  tz: string
  offset: string
  region: string
  displayName: string
}

interface TimezoneSelectProps {
  value?: string
  onChange: (value: string) => void
  grouped?: boolean
  className?: string
  placeholder?: string
}

/**
 * Purpose: Executes TimezoneSelect functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
export function TimezoneSelect({
  value,
  onChange,
  grouped = true,
  className,
  placeholder,
}: TimezoneSelectProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const ref = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Build timezone entries once
  const entries = React.useMemo<TimezoneEntry[]>(() => {
    return getTimezones().map((tz) => ({
      tz,
      offset: getUtcOffset(tz),
      region: getRegion(tz),
      displayName: tz.split('/').pop()?.replace(/_/g, ' ') || tz,
    }))
  }, [])

  // Filter entries by search
  const filtered = React.useMemo(() => {
    if (!search.trim()) return entries
    const lower = search.toLowerCase()
    return entries.filter(
      (e) =>
        e.tz.toLowerCase().includes(lower) ||
        e.displayName.toLowerCase().includes(lower) ||
        e.offset.toLowerCase().includes(lower)
    )
  }, [entries, search])

  // Group filtered entries by region
  const groupedEntries = React.useMemo(() => {
    if (!grouped) return null
    const groups: Record<string, TimezoneEntry[]> = {}
    for (const entry of filtered) {
      const region = entry.region
      if (!groups[region]) groups[region] = []
      groups[region]!.push(entry)
    }
    // Sort by region order
    const sorted: { region: string; label: string; items: TimezoneEntry[] }[] = []
    for (const region of REGION_ORDER) {
      if (groups[region]) {
        sorted.push({
          region,
          label: REGION_LABELS[region] || region,
          items: groups[region]!,
        })
      }
    }
    // Any regions not in REGION_ORDER
    for (const region of Object.keys(groups)) {
      if (!REGION_ORDER.includes(region)) {
        sorted.push({
          region,
          label: region,
          items: groups[region]!,
        })
      }
    }
    return sorted
  }, [filtered, grouped])

  // Close on outside click
  React.useEffect(() => {
    /**
     * Purpose: Executes handler functionality.
     * Owner/Author: Syed Ashhad
     * Created/Updated: February 2026
     */
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Auto-focus search input when opening
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
  }, [open])

  // Find selected entry for display
  const selectedEntry = React.useMemo(
    () => entries.find((e) => e.tz === value),
    [entries, value]
  )

  /**
   * Purpose: Executes renderItem functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const renderItem = (entry: TimezoneEntry) => (
    <button
      key={entry.tz}
      type="button"
      onClick={() => {
        onChange(entry.tz)
        setOpen(false)
      }}
      className={cn(
        'flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-blue-50 transition-colors',
        value === entry.tz && 'bg-blue-50 font-medium text-blue-600'
      )}
    >
      <span className="truncate">{entry.displayName}</span>
      <span className="ml-2 shrink-0 text-xs text-gray-400">{entry.offset}</span>
    </button>
  )

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm',
          'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <Clock className="h-4 w-4 shrink-0 text-gray-400" />
          {selectedEntry ? (
            <>
              <span>{selectedEntry.tz.replace(/_/g, ' ')}</span>
              <span className="text-xs text-gray-400">({selectedEntry.offset})</span>
            </>
          ) : (
            <span className="text-gray-400">
              {placeholder || t('Select timezone...')}
            </span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t('Search timezones...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  'flex h-9 w-full rounded-md border border-gray-300 bg-white pl-8 pr-3 py-1 text-sm',
                  'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                )}
              />
            </div>
          </div>

          {/* Timezone list */}
          <div className="max-h-60 overflow-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                {t('No timezones found')}
              </div>
            )}

            {grouped && groupedEntries ? (
              groupedEntries.map((group) => (
                <div key={group.region}>
                  <div className="sticky top-0 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t(group.label)}
                  </div>
                  {group.items.map(renderItem)}
                </div>
              ))
            ) : (
              filtered.map(renderItem)
            )}
          </div>
        </div>
      )}
    </div>
  )
}
