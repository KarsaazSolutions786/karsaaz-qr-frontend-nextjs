'use client'

import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { CalendarIcon } from '@heroicons/react/24/outline'
import type { DateRange } from 'react-day-picker'

export interface DateRangeValue {
  from: Date | undefined
  to: Date | undefined
}

interface PresetOption {
  label: string
  getValue: () => DateRangeValue
}

interface DateRangeInputProps {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  presets?: PresetOption[]
  className?: string
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(date: Date | undefined): string {
  if (!date) return ''
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const defaultPresets: PresetOption[] = [
  {
    label: 'Today',
    getValue: () => {
      const today = startOfDay(new Date())
      return { from: today, to: today }
    },
  },
  {
    label: 'Last 7 days',
    getValue: () => {
      const to = startOfDay(new Date())
      const from = new Date(to)
      from.setDate(from.getDate() - 6)
      return { from, to }
    },
  },
  {
    label: 'Last 30 days',
    getValue: () => {
      const to = startOfDay(new Date())
      const from = new Date(to)
      from.setDate(from.getDate() - 29)
      return { from, to }
    },
  },
  {
    label: 'This month',
    getValue: () => {
      const now = new Date()
      const from = new Date(now.getFullYear(), now.getMonth(), 1)
      const to = startOfDay(now)
      return { from, to }
    },
  },
  {
    label: 'This year',
    getValue: () => {
      const now = new Date()
      const from = new Date(now.getFullYear(), 0, 1)
      const to = startOfDay(now)
      return { from, to }
    },
  },
]

export function DateRangeInput({
  value,
  onChange,
  presets,
  className,
}: DateRangeInputProps) {
  const [open, setOpen] = useState(false)
  const resolvedPresets = presets ?? defaultPresets

  const displayText = useMemo(() => {
    if (value.from && value.to) {
      return `${formatDate(value.from)} – ${formatDate(value.to)}`
    }
    if (value.from) return formatDate(value.from)
    return 'Select date range'
  }, [value])

  const handleCalendarSelect = useCallback(
    (range: DateRange | undefined) => {
      onChange({ from: range?.from, to: range?.to })
    },
    [onChange]
  )

  const handlePreset = useCallback(
    (preset: PresetOption) => {
      onChange(preset.getValue())
      setOpen(false)
    },
    [onChange]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'h-10 w-full justify-start text-left font-normal',
            !value.from && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Presets sidebar */}
          <div className="flex flex-col border-r p-2">
            {resolvedPresets.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start text-xs"
                onClick={() => handlePreset(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-2">
            <Calendar
              mode="range"
              selected={
                value.from
                  ? { from: value.from, to: value.to ?? undefined }
                  : undefined
              }
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
