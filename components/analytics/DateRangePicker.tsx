'use client'

import React from 'react'
import { getPresetDateRange, formatDateRange } from '@/lib/utils/date-range'
import type { DateRange, DateRangePreset } from '@/types/entities/analytics'

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

const PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'last30days', label: 'Last 30 days' },
  { value: 'last90days', label: 'Last 90 days' },
  { value: 'thisMonth', label: 'This month' },
  { value: 'lastMonth', label: 'Last month' },
  { value: 'thisYear', label: 'This year' },
]

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = e.target.value as DateRangePreset
    if (preset === 'custom') {
      // For custom, keep current dates or show date inputs
      return
    }
    const range = getPresetDateRange(preset)
    onChange({ ...range, preset })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value.preset || 'custom'}
        onChange={handlePresetChange}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {PRESETS.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
        <option value="custom">Custom range</option>
      </select>

      <div className="text-sm text-gray-600">
        {formatDateRange(value.startDate, value.endDate)}
      </div>
    </div>
  )
}
