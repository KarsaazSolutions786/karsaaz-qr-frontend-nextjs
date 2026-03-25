'use client'

import { useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { sanitizeSvg } from '@/lib/utils/dom-safety'
import { useTranslation } from '@/lib/i18n'
import { Lock, Search } from 'lucide-react'
import type { ReactNode } from 'react'

export interface BalloonOption {
  value: string
  label: string
  icon?: ReactNode
  image?: string
  svg?: string
  badge?: { text: string; type?: 'info' | 'warning' | 'success' }
  disabled?: boolean
  locked?: boolean
}

// ----- Single select -----
interface BalloonSelectorSingleProps {
  options: BalloonOption[]
  value: string
  onChange: (value: string) => void
  multiple?: false
  className?: string
  searchable?: boolean
  searchPlaceholder?: string
  columns?: number
  hoverPreview?: boolean
  onLockedClick?: (option: BalloonOption) => void
}

// ----- Multi select -----
interface BalloonSelectorMultiProps {
  options: BalloonOption[]
  value: string[]
  onChange: (value: string[]) => void
  multiple: true
  className?: string
  searchable?: boolean
  searchPlaceholder?: string
  columns?: number
  hoverPreview?: boolean
  onLockedClick?: (option: BalloonOption) => void
}

type BalloonSelectorProps = BalloonSelectorSingleProps | BalloonSelectorMultiProps

export function BalloonSelector(props: BalloonSelectorProps) {
  const {
    options,
    className,
    searchable,
    searchPlaceholder,
    columns,
    hoverPreview = false,
    onLockedClick,
  } = props

  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const [hoveredOption, setHoveredOption] = useState<BalloonOption | null>(null)

  const showSearch = searchable || options.length >= 10

  const filteredOptions = useMemo(() => {
    if (!keyword.trim()) return options
    const lowerKeyword = keyword.toLowerCase()
    return options.filter(opt => opt.label.toLowerCase().includes(lowerKeyword))
  }, [options, keyword])

  const isSelected = useCallback(
    (optValue: string) => {
      if (props.multiple) {
        return Array.isArray(props.value) && props.value.includes(optValue)
      }
      return props.value === optValue
    },
    [props.multiple, props.value]
  )

  const handleClick = useCallback(
    (opt: BalloonOption) => {
      if (opt.disabled) return
      if (opt.locked) {
        onLockedClick?.(opt)
        return
      }

      if (props.multiple) {
        const current = Array.isArray(props.value) ? props.value : []
        const exists = current.includes(opt.value)
        const next = exists ? current.filter(v => v !== opt.value) : [...current, opt.value]
        props.onChange(next)
      } else {
        ;(props as BalloonSelectorSingleProps).onChange(opt.value)
      }
    },
    [props, onLockedClick]
  )

  const handleSelectAll = useCallback(() => {
    if (!props.multiple) return
    const allValues = options.filter(o => !o.disabled && !o.locked).map(o => o.value)
    props.onChange(allValues)
  }, [props, options])

  const handleSelectNone = useCallback(() => {
    if (!props.multiple) return
    props.onChange([])
  }, [props])

  const gridClass = columns ? `grid gap-2` : 'flex flex-wrap gap-2'

  const gridStyle = columns
    ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
    : undefined

  return (
    <div className={cn('space-y-3', className)}>
      {/* Search + multi-select actions */}
      {(showSearch || props.multiple) && (
        <div className="flex flex-wrap items-center gap-2">
          {showSearch && (
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder={
                  searchPlaceholder || `${t('Search in')} ${options.length} ${t('options')}`
                }
                className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
          {props.multiple && (
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                disabled={
                  Array.isArray(props.value) &&
                  props.value.length === options.filter(o => !o.disabled && !o.locked).length
                }
              >
                {t('Select all')}
              </button>
              <button
                type="button"
                onClick={handleSelectNone}
                className="text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                disabled={!Array.isArray(props.value) || props.value.length === 0}
              >
                {t('Select none')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Options grid */}
      <div className={gridClass} style={gridStyle}>
        {filteredOptions.map(opt => {
          const selected = isSelected(opt.value)
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleClick(opt)}
              onMouseEnter={hoverPreview ? () => setHoveredOption(opt) : undefined}
              onMouseLeave={hoverPreview ? () => setHoveredOption(null) : undefined}
              disabled={opt.disabled}
              className={cn(
                'relative inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                selected
                  ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50',
                opt.disabled && 'opacity-40 cursor-not-allowed',
                opt.locked && !opt.disabled && 'opacity-70 cursor-pointer'
              )}
            >
              {opt.locked && <Lock className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              {opt.image && (
                <img
                  src={opt.image}
                  alt={opt.label}
                  className="h-6 w-6 shrink-0 rounded object-contain"
                />
              )}
              {opt.svg && (
                <span
                  className="h-6 w-6 shrink-0 [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: sanitizeSvg(opt.svg) }}
                />
              )}
              {opt.label && <span className="truncate">{opt.label}</span>}
              {opt.badge && (
                <span
                  className={cn(
                    'ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                    opt.badge.type === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : opt.badge.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                  )}
                >
                  {opt.badge.text}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Hover preview */}
      {hoverPreview && hoveredOption && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-3">
            {hoveredOption.image && (
              <img
                src={hoveredOption.image}
                alt={hoveredOption.label}
                className="h-16 w-16 rounded-lg object-contain"
              />
            )}
            {hoveredOption.svg && (
              <span
                className="h-16 w-16 [&>svg]:h-full [&>svg]:w-full"
                dangerouslySetInnerHTML={{ __html: sanitizeSvg(hoveredOption.svg) }}
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{hoveredOption.label}</p>
              <p className="text-xs text-gray-500">{hoveredOption.value}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredOptions.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-400">{t('No matching options')}</p>
      )}
    </div>
  )
}
