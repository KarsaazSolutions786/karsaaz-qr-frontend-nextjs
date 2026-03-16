'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { Copy, Plus, X } from 'lucide-react'

export interface DayHours {
  enabled: boolean
  open: string
  close: string
}

export interface BusinessHours {
  day: string
  enabled: boolean
  open: string
  close: string
  additionalHours?: { open: string; close: string }[]
}

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

const DEFAULT_HOURS: BusinessHours[] = DAYS.map((day) => ({
  day,
  enabled: day !== 'Saturday' && day !== 'Sunday',
  open: '09:00',
  close: '17:00',
  additionalHours: [],
}))

interface BusinessHoursInputProps {
  value?: BusinessHours[]
  onChange: (value: BusinessHours[]) => void
  maxAdditionalHours?: number
  className?: string
}

export function BusinessHoursInput({
  value,
  onChange,
  maxAdditionalHours = 3,
  className,
}: BusinessHoursInputProps) {
  const { t } = useTranslation()
  const hours = value && value.length === 7 ? value : DEFAULT_HOURS

  const update = (index: number, patch: Partial<BusinessHours>) => {
    const next = hours.map((h, i) => (i === index ? { ...h, ...patch } : h))
    onChange(next)
  }

  const addAdditionalHours = (index: number) => {
    const h = hours[index]!
    const additional = h.additionalHours || []
    if (additional.length >= maxAdditionalHours) return
    update(index, {
      additionalHours: [...additional, { open: '12:00', close: '14:00' }],
    })
  }

  const removeAdditionalHours = (dayIndex: number, additionalIndex: number) => {
    const h = hours[dayIndex]!
    const additional = (h.additionalHours || []).filter(
      (_, i) => i !== additionalIndex
    )
    update(dayIndex, { additionalHours: additional })
  }

  const updateAdditionalHours = (
    dayIndex: number,
    additionalIndex: number,
    field: 'open' | 'close',
    fieldValue: string
  ) => {
    const h = hours[dayIndex]!
    const additional = (h.additionalHours || []).map((ah, i) =>
      i === additionalIndex ? { ...ah, [field]: fieldValue } : ah
    )
    update(dayIndex, { additionalHours: additional })
  }

  const copyToAll = (sourceIndex: number) => {
    const source = hours[sourceIndex]!
    const next = hours.map((h) => ({
      ...h,
      enabled: source.enabled,
      open: source.open,
      close: source.close,
      additionalHours: source.additionalHours
        ? source.additionalHours.map((ah) => ({ ...ah }))
        : [],
    }))
    onChange(next)
  }

  const copyToWeekdays = (sourceIndex: number) => {
    const source = hours[sourceIndex]!
    const next = hours.map((h) => {
      if (h.day === 'Saturday' || h.day === 'Sunday') return h
      return {
        ...h,
        enabled: source.enabled,
        open: source.open,
        close: source.close,
        additionalHours: source.additionalHours
          ? source.additionalHours.map((ah) => ({ ...ah }))
          : [],
      }
    })
    onChange(next)
  }

  const timeInputClass = cn(
    'h-9 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm',
    'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
    'disabled:cursor-not-allowed disabled:opacity-50'
  )

  return (
    <div className={cn('space-y-1', className)}>
      {hours.map((h, i) => (
        <div key={h.day} className="space-y-1">
          {/* Main row */}
          <div className="flex items-center gap-3 rounded-md p-1.5 hover:bg-gray-50">
            <label className="flex items-center gap-2 w-32 text-sm shrink-0">
              <input
                type="checkbox"
                checked={h.enabled}
                onChange={(e) => update(i, { enabled: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              {t(h.day)}
            </label>

            {h.enabled ? (
              <>
                <input
                  type="time"
                  value={h.open}
                  onChange={(e) => update(i, { open: e.target.value })}
                  className={timeInputClass}
                />
                <span className="text-sm text-gray-500">{t('to')}</span>
                <input
                  type="time"
                  value={h.close}
                  onChange={(e) => update(i, { close: e.target.value })}
                  className={timeInputClass}
                />

                {/* Add additional hours */}
                {(h.additionalHours?.length || 0) < maxAdditionalHours && (
                  <button
                    type="button"
                    onClick={() => addAdditionalHours(i)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title={t('Add hours')}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}

                {/* Copy to all / weekdays dropdown */}
                <div className="relative group">
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title={t('Copy hours')}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <div className="hidden group-hover:block absolute right-0 top-full z-10 mt-1 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => copyToAll(i)}
                      className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                    >
                      {t('Copy to all days')}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToWeekdays(i)}
                      className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50"
                    >
                      {t('Copy to weekdays')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <span className="text-sm text-gray-400 italic">{t('Closed')}</span>
            )}
          </div>

          {/* Additional hours */}
          {h.enabled &&
            h.additionalHours?.map((ah, ai) => (
              <div key={ai} className="flex items-center gap-3 pl-[8.5rem]">
                <input
                  type="time"
                  value={ah.open}
                  onChange={(e) =>
                    updateAdditionalHours(i, ai, 'open', e.target.value)
                  }
                  className={timeInputClass}
                />
                <span className="text-sm text-gray-500">{t('to')}</span>
                <input
                  type="time"
                  value={ah.close}
                  onChange={(e) =>
                    updateAdditionalHours(i, ai, 'close', e.target.value)
                  }
                  className={timeInputClass}
                />
                <button
                  type="button"
                  onClick={() => removeAdditionalHours(i, ai)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title={t('Remove')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
