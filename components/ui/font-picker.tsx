'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const FONTS = [
  { name: 'Arial', family: 'Arial, sans-serif' },
  { name: 'Helvetica', family: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', family: '"Times New Roman", serif' },
  { name: 'Georgia', family: 'Georgia, serif' },
  { name: 'Courier New', family: '"Courier New", monospace' },
  { name: 'Verdana', family: 'Verdana, sans-serif' },
  { name: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'Open Sans', family: '"Open Sans", sans-serif' },
  { name: 'Lato', family: 'Lato, sans-serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif' },
  { name: 'Poppins', family: 'Poppins, sans-serif' },
  { name: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Raleway', family: 'Raleway, sans-serif' },
  { name: 'Playfair Display', family: '"Playfair Display", serif' },
  { name: 'Oswald', family: 'Oswald, sans-serif' },
]

interface FontPickerProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

export function FontPicker({ value, onChange, className }: FontPickerProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = FONTS.find((f) => f.name === value)

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
        <span style={{ fontFamily: selected?.family }}>{selected?.name || 'Select font…'}</span>
        <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-md">
          {FONTS.map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => { onChange(f.name); setOpen(false) }}
              className={cn(
                'flex w-full items-center px-3 py-2 text-sm hover:bg-blue-50',
                value === f.name && 'bg-blue-50 font-medium text-blue-600'
              )}
              style={{ fontFamily: f.family }}
            >
              {f.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
