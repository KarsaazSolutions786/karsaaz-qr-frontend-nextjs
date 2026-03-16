'use client'

import { useTranslation } from '@/lib/i18n'
import type { CalendarBlockData } from '@/types/entities/biolink'

interface CalendarBlockProps {
  block: CalendarBlockData
  isEditing?: boolean
  onUpdate?: (data: CalendarBlockData['data']) => void
}

function formatEventDate(startDate: string, endDate?: string): string {
  if (!startDate) return ''

  const start = new Date(startDate)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  let result = start.toLocaleDateString('en-US', options)

  if (endDate) {
    const end = new Date(endDate)
    const isSameDay = start.toDateString() === end.toDateString()

    if (isSameDay) {
      result += ` - ${end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    } else {
      result += ` - ${end.toLocaleDateString('en-US', options)}`
    }
  }

  return result
}

function generateGoogleCalendarUrl(data: CalendarBlockData['data']): string {
  const params = new URLSearchParams()
  params.set('action', 'TEMPLATE')
  params.set('text', data.eventName)

  if (data.startDate) {
    const start = new Date(data.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    let end = start
    if (data.endDate) {
      end = new Date(data.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    params.set('dates', `${start}/${end}`)
  }

  if (data.location) {
    params.set('location', data.location)
  }

  if (data.description) {
    params.set('details', data.description)
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function generateICSContent(data: CalendarBlockData['data']): string {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:${data.eventName}`,
  ]

  if (data.startDate) {
    lines.push(`DTSTART:${formatDate(data.startDate)}`)
  }
  if (data.endDate) {
    lines.push(`DTEND:${formatDate(data.endDate)}`)
  }
  if (data.location) {
    lines.push(`LOCATION:${data.location}`)
  }
  if (data.description) {
    lines.push(`DESCRIPTION:${data.description}`)
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}

export default function CalendarBlock({ block, isEditing, onUpdate }: CalendarBlockProps) {
  const { eventName, startDate, endDate, location, description } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Event Name')}</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => onUpdate?.({ ...block.data, eventName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="My Event"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Start Date & Time')}</label>
            <input
              type="datetime-local"
              value={startDate || ''}
              onChange={(e) => onUpdate?.({ ...block.data, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('End Date & Time')}</label>
            <input
              type="datetime-local"
              value={endDate || ''}
              onChange={(e) => onUpdate?.({ ...block.data, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Location (optional)')}</label>
          <input
            type="text"
            value={location || ''}
            onChange={(e) => onUpdate?.({ ...block.data, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="123 Main St, City"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Description (optional)')}</label>
          <textarea
            value={description || ''}
            onChange={(e) => onUpdate?.({ ...block.data, description: e.target.value })}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  if (!eventName) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('No event configured')}</p>
      </div>
    )
  }

  const handleDownloadICS = () => {
    const icsContent = generateICSContent(block.data)
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${eventName.replace(/\s+/g, '_')}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50">
          <span className="text-xs font-bold uppercase text-blue-600">
            {startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'short' }) : ''}
          </span>
          <span className="text-lg font-bold leading-none text-blue-700">
            {startDate ? new Date(startDate).getDate() : ''}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900">{eventName}</h3>
          {startDate && (
            <p className="mt-0.5 text-sm text-gray-600">
              {formatEventDate(startDate, endDate)}
            </p>
          )}
          {location && (
            <p className="mt-0.5 text-sm text-gray-500">
              <span className="mr-1">&#x1F4CD;</span>
              {location}
            </p>
          )}
        </div>
      </div>
      {description && (
        <p className="mb-3 text-sm text-gray-600 whitespace-pre-wrap">{description}</p>
      )}
      <div className="flex gap-2">
        <a
          href={generateGoogleCalendarUrl(block.data)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {t('Google Calendar')}
        </a>
        <button
          type="button"
          onClick={handleDownloadICS}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t('Download .ics')}
        </button>
      </div>
    </div>
  )
}
