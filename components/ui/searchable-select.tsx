'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SearchableSelectOption {
  value: string
  label: string
}

export interface SearchableSelectProps {
  className?: string
  options: SearchableSelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  isLoading?: boolean
  disabled?: boolean
}

const SearchableSelect = React.forwardRef<HTMLDivElement, SearchableSelectProps>(
  ({ className, options, value, onChange, placeholder = 'Select...', isLoading = false, disabled = false }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const [highlightIndex, setHighlightIndex] = React.useState(0)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const selectedLabel = options.find((o) => o.value === value)?.label || ''

    const filtered = React.useMemo(
      () => options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())),
      [options, search]
    )

    React.useEffect(() => {
      setHighlightIndex(0)
    }, [filtered.length])

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
          setSearch('')
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = React.useCallback(
      (val: string) => {
        onChange?.(val)
        setOpen(false)
        setSearch('')
      },
      [onChange]
    )

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (!open) {
          if (e.key === 'ArrowDown' || e.key === 'Enter') {
            setOpen(true)
            e.preventDefault()
          }
          return
        }
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1))
            break
          case 'ArrowUp':
            e.preventDefault()
            setHighlightIndex((i) => Math.max(i - 1, 0))
            break
          case 'Enter':
            e.preventDefault()
            if (filtered[highlightIndex]) handleSelect(filtered[highlightIndex].value)
            break
          case 'Escape':
            setOpen(false)
            setSearch('')
            break
        }
      },
      [open, filtered, highlightIndex, handleSelect]
    )

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        <div
          ref={ref}
          className={cn(
            'flex h-10 w-full items-center rounded-md border border-gray-300 bg-white px-3 text-sm shadow-sm transition-colors',
            'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          onClick={() => { if (!disabled) { setOpen(true); inputRef.current?.focus() } }}
        >
          <input
            ref={inputRef}
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
            placeholder={open ? 'Type to search...' : (selectedLabel || placeholder)}
            value={open ? search : selectedLabel}
            readOnly={!open}
            disabled={disabled}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <svg className="ml-2 h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {open && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-md">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">No results found</div>
            ) : (
              filtered.map((option, i) => (
                <div
                  key={option.value}
                  className={cn(
                    'cursor-pointer px-3 py-2 text-sm',
                    i === highlightIndex && 'bg-blue-50 text-blue-700',
                    option.value === value && 'font-medium text-blue-600',
                    i !== highlightIndex && option.value !== value && 'text-gray-700 hover:bg-gray-50'
                  )}
                  onMouseEnter={() => setHighlightIndex(i)}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    )
  }
)
SearchableSelect.displayName = 'SearchableSelect'

export { SearchableSelect }
