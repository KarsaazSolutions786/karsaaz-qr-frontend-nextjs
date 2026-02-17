import { 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  format,
  isBefore,
  isValid
} from 'date-fns'
import type { DateRange, DateRangePreset } from '@/types/entities/analytics'

export function getPresetDateRange(preset: DateRangePreset): DateRange {
  const now = new Date()
  
  switch (preset) {
    case 'last7days':
      return {
        startDate: subDays(now, 7),
        endDate: now,
        preset,
      }
    
    case 'last30days':
      return {
        startDate: subDays(now, 30),
        endDate: now,
        preset,
      }
    
    case 'last90days':
      return {
        startDate: subDays(now, 90),
        endDate: now,
        preset,
      }
    
    case 'thisMonth':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        preset,
      }
    
    case 'lastMonth':
      const lastMonth = subDays(startOfMonth(now), 1)
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
        preset,
      }
    
    case 'thisYear':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
        preset,
      }
    
    case 'custom':
    default:
      return {
        startDate: subDays(now, 30),
        endDate: now,
        preset: 'last30days',
      }
  }
}

export function formatDateRange(startDate: Date, endDate: Date): string {
  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
}

export function isValidDateRange(range: DateRange): boolean {
  return (
    isValid(range.startDate) &&
    isValid(range.endDate) &&
    isBefore(range.startDate, range.endDate)
  )
}

export function dateRangeToQueryParams(range: DateRange): {
  start_date: string
  end_date: string
} {
  return {
    start_date: format(range.startDate, 'yyyy-MM-dd'),
    end_date: format(range.endDate, 'yyyy-MM-dd'),
  }
}
