'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ColorPaletteProps {
  value: string
  onChange: (color: string) => void
  presets?: string[][]
  className?: string
}

const defaultPresets = [
  ['#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#ffffff'],
  ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
]

export function ColorPalette({
  value,
  onChange,
  presets = defaultPresets,
  className,
}: ColorPaletteProps) {
  const [custom, setCustom] = useState(value)

  return (
    <div className={cn('space-y-3', className)}>
      {presets.map((row, ri) => (
        <div key={ri} className="flex gap-2">
          {row.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={cn(
                'relative h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110',
                value === color ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'
              )}
              style={{ backgroundColor: color }}
              title={color}
            >
              {value === color && (
                <Check
                  className={cn(
                    'absolute inset-0 m-auto h-4 w-4',
                    ['#ffffff', '#d1d5db', '#f5f5f5'].includes(color.toLowerCase())
                      ? 'text-gray-800'
                      : 'text-white'
                  )}
                />
              )}
            </button>
          ))}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={custom}
          onChange={e => {
            setCustom(e.target.value)
            onChange(e.target.value)
          }}
          className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
        />
        <input
          type="text"
          value={custom}
          onChange={e => {
            setCustom(e.target.value)
            if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
              onChange(e.target.value)
            }
          }}
          placeholder="#000000"
          className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
    </div>
  )
}
