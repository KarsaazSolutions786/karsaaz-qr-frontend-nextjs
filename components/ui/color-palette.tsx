'use client'

import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Check } from 'lucide-react'

const RECENTLY_USED_KEY = 'color-palette-recent'
const MAX_RECENT = 8

interface ColorPaletteProps {
  value: string
  onChange: (color: string) => void
  presets?: string[][]
  showRecent?: boolean
  showCustom?: boolean
  label?: string
  className?: string
}

const defaultPresets = [
  ['#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#ffffff'],
  ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
  ['#ec4899', '#f43f5e', '#14b8a6', '#06b6d4', '#6366f1', '#a855f7'],
  ['#78350f', '#166534', '#1e3a5f', '#4c1d95', '#831843', '#1f2937'],
]

/**
 * Purpose: Retrieves recentcolors.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getRecentColors(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RECENTLY_USED_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : []
  } catch {
    return []
  }
}

/**
 * Purpose: Executes addRecentColor functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function addRecentColor(color: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const recent = getRecentColors().filter(
      (c) => c.toLowerCase() !== color.toLowerCase()
    )
    recent.unshift(color)
    const trimmed = recent.slice(0, MAX_RECENT)
    localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(trimmed))
    return trimmed
  } catch {
    return [color]
  }
}

/**
 * Purpose: Checks if lightcolor.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '')
  if (clean.length < 6) return true
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  // Perceived luminance
  return (r * 299 + g * 587 + b * 114) / 1000 > 186
}

/**
 * Purpose: Executes ColorPalette functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function ColorPalette({
  value,
  onChange,
  presets = defaultPresets,
  showRecent = true,
  showCustom = true,
  label,
  className,
}: ColorPaletteProps) {
  const { t } = useTranslation()
  const [custom, setCustom] = useState(value)
  const [recentColors, setRecentColors] = useState<string[]>([])

  // Load recent colors from localStorage on mount
  useEffect(() => {
    if (showRecent) {
      setRecentColors(getRecentColors())
    }
  }, [showRecent])

  const handleSelect = useCallback(
    (color: string) => {
      onChange(color)
      setCustom(color)
      if (showRecent) {
        const updated = addRecentColor(color)
        setRecentColors(updated)
      }
    },
    [onChange, showRecent]
  )

  /**
   * Purpose: Executes renderColorButton functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const renderColorButton = (color: string) => {
    const selected = value.toLowerCase() === color.toLowerCase()
    const light = isLightColor(color)

    return (
      <button
        key={color}
        type="button"
        onClick={() => handleSelect(color)}
        className={cn(
          'relative h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110',
          selected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'
        )}
        style={{ backgroundColor: color }}
        title={color}
      >
        {selected && (
          <Check
            className={cn(
              'absolute inset-0 m-auto h-4 w-4',
              light ? 'text-gray-800' : 'text-white'
            )}
          />
        )}
      </button>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Preset colors */}
      {presets.map((row, ri) => (
        <div key={ri} className="flex gap-2">
          {row.map(renderColorButton)}
        </div>
      ))}

      {/* Recently used */}
      {showRecent && recentColors.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500">
            {t('Recently used')}
          </label>
          <div className="flex gap-2 flex-wrap">
            {recentColors.map(renderColorButton)}
          </div>
        </div>
      )}

      {/* Custom color input */}
      {showCustom && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className="h-8 w-8 rounded-lg border-2 border-gray-200 cursor-pointer"
              style={{ backgroundColor: custom }}
            />
            <input
              type="color"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value)
                handleSelect(e.target.value)
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              title={t('Pick custom color')}
            />
          </div>
          <input
            type="text"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value)
              if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                handleSelect(e.target.value)
              }
            }}
            placeholder="#000000"
            className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  )
}
