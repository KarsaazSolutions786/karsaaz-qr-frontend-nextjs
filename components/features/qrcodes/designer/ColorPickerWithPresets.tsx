'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'

const PRESET_COLORS = ['#FF0000', '#8B5CF6', '#10B981', '#FFFFFF']

interface ColorPickerWithPresetsProps {
  label: string
  value: string
  onChange: (c: string) => void
}

const ColorPickerWithPresets = memo(({ label, value, onChange }: ColorPickerWithPresetsProps) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    <div className="flex items-center gap-1">
      {PRESET_COLORS.map(color => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            'w-7 h-7 rounded border-2 transition-all',
            value === color
              ? 'border-purple-500 scale-110'
              : 'border-gray-300 hover:border-gray-400'
          )}
          style={{ backgroundColor: color }}
        />
      ))}
      <div className="relative ml-1">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-14 h-7 cursor-pointer"
        />
        <button className="px-2 py-1 text-xs font-medium bg-gray-800 text-white rounded">
          RGB
        </button>
      </div>
    </div>
  </div>
))
ColorPickerWithPresets.displayName = 'ColorPickerWithPresets'

export { ColorPickerWithPresets }
export type { ColorPickerWithPresetsProps }
