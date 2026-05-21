'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { CountdownBlockData } from '@/types/entities/biolink'

interface CountdownBlockProps {
  block: CountdownBlockData
  isEditing?: boolean
  onUpdate?: (data: CountdownBlockData['data']) => void
}

/**
 * Purpose: Executes calculateTimeLeft functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function calculateTimeLeft(targetDate: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
} {
  const difference = new Date(targetDate).getTime() - Date.now()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    expired: false,
  }
}

/**
 * Purpose: Executes CountdownBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function CountdownBlock({ block, isEditing, onUpdate }: CountdownBlockProps) {
  const { t } = useTranslation();
  const { title, targetDate, expiredMessage = 'Event has ended', style = 'cards' } = block.data
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate))

  useEffect(() => {
    if (!targetDate || isEditing) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, isEditing])

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Title (optional)')}</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Countdown to launch..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Target Date & Time')}</label>
          <input
            type="datetime-local"
            value={targetDate || ''}
            onChange={(e) => onUpdate?.({ ...block.data, targetDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Expired Message')}</label>
          <input
            type="text"
            value={expiredMessage}
            onChange={(e) => onUpdate?.({ ...block.data, expiredMessage: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Style')}</label>
          <select
            value={style}
            onChange={(e) =>
              onUpdate?.({ ...block.data, style: e.target.value as 'cards' | 'inline' | 'minimal' })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="cards">{t('Cards')}</option>
            <option value="inline">{t('Inline')}</option>
            <option value="minimal">{t('Minimal')}</option>
          </select>
        </div>
      </div>
    )
  }

  if (!targetDate) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('No target date set')}</p>
      </div>
    )
  }

  if (timeLeft.expired) {
    return (
      <div className="rounded-lg bg-gray-100 p-6 text-center">
        {title && <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>}
        <p className="text-gray-600">{expiredMessage}</p>
      </div>
    )
  }

  const units = [
    { label: t('Days'), value: timeLeft.days },
    { label: t('Hours'), value: timeLeft.hours },
    { label: t('Minutes'), value: timeLeft.minutes },
    { label: t('Seconds'), value: timeLeft.seconds },
  ]

  if (style === 'minimal') {
    return (
      <div className="text-center">
        {title && <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>}
        <p className="text-2xl font-bold tabular-nums text-gray-900">
          {String(timeLeft.days).padStart(2, '0')}:{String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </p>
      </div>
    )
  }

  if (style === 'inline') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
        {title && <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>}
        <div className="flex items-center justify-center gap-2 text-xl font-bold tabular-nums text-gray-900">
          {units.map((unit, i) => (
            <span key={unit.label}>
              {String(unit.value).padStart(2, '0')}
              <span className="ml-0.5 text-xs font-normal uppercase text-gray-500">
                {unit.label.charAt(0)}
              </span>
              {i < units.length - 1 && <span className="mx-1 text-gray-400">:</span>}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 text-center">
      {title && <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>}
      <div className="grid grid-cols-4 gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="rounded-lg bg-gray-50 p-3">
            <div className="text-2xl font-bold tabular-nums text-gray-900">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="mt-1 text-xs uppercase text-gray-500">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
