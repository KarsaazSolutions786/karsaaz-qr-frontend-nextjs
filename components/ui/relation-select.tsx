'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface RelationOption {
  value: string
  label: string
}

interface RelationSelectProps {
  value?: string
  onChange: (value: string) => void
  fetchOptions: (search: string) => Promise<RelationOption[]>
  placeholder?: string
  className?: string
}

export function RelationSelect({
  value,
  onChange,
  fetchOptions,
  placeholder = 'Search…',
  className,
}: RelationSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [options, setOptions] = React.useState<RelationOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState('')
  const ref = React.useRef<HTMLDivElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  React.useEffect(() => {
    if (!open) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const results = await fetchOptions(search)
        setOptions(results)
      } catch {
        setOptions([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [search, open, fetchOptions])

  const handleSelect = (opt: RelationOption) => {
    onChange(opt.value)
    setSelectedLabel(opt.label)
    setOpen(false)
    setSearch('')
  }

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
        <span className={cn('truncate', !value && 'text-gray-400')}>
          {value ? selectedLabel || value : placeholder}
        </span>
        <svg className="h-4 w-4 shrink-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-md">
          <div className="p-2">
            <input
              type="text"
              placeholder={placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                'flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm',
                'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              )}
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-auto">
            {loading && <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>}
            {!loading && options.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No results</div>
            )}
            {!loading &&
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    'flex w-full items-center px-3 py-2 text-sm hover:bg-blue-50',
                    value === opt.value && 'bg-blue-50 font-medium text-blue-600'
                  )}
                >
                  {opt.label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
