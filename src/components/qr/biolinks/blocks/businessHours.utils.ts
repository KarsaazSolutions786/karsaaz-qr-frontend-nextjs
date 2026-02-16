/**
 * Utility functions for Business Hours Block component
 */

import { format, addDays, isWithinInterval, parse, setHours, setMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import type { 
  TimeRange, 
  DaySchedule, 
  SpecialHours, 
  BusinessHoursData, 
  DayOfWeek,
  BusinessStatus,
  NextOpeningTime 
} from './businessHours.types';

// Days of week in order (Sunday = 0)
export const DAYS_OF_WEEK = [
  { key: 'sunday' as DayOfWeek, label: 'Sunday' },
  { key: 'monday' as DayOfWeek, label: 'Monday' },
  { key: 'tuesday' as DayOfWeek, label: 'Tuesday' },
  { key: 'wednesday' as DayOfWeek, label: 'Wednesday' },
  { key: 'thursday' as DayOfWeek, label: 'Thursday' },
  { key: 'friday' as DayOfWeek, label: 'Friday' },
  { key: 'saturday' as DayOfWeek, label: 'Saturday' },
];

// Common timezone options
export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Phoenix', label: 'Arizona Time (AZ)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AK)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HI)' },
  { value: 'America/Toronto', label: 'Toronto' },
  { value: 'America/Vancouver', label: 'Vancouver' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
];

/**
 * Get current time in a specific timezone
 */
export const getCurrentTimeInTimezone = (timezone: string): Date => {
  return utcToZonedTime(new Date(), timezone);
};

/**
 * Parse time string ("HH:MM") to Date object on a base date
 */
export const parseTimeToDate = (time: string, baseDate: Date): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  return setMinutes(setHours(baseDate, hours), minutes);
};

/**
 * Check if current time is within a time range
 * Handles overnight shifts (e.g., 22:00 - 02:00)
 */
export const isTimeInRange = (currentTime: Date, openTime: string, closeTime: string): boolean => {
  const open = parseTimeToDate(openTime, currentTime);
  const close = parseTimeToDate(closeTime, currentTime);
  
  // Handle overnight shifts (close time is next day)
  if (close < open) {
    return currentTime >= open || currentTime <= close;
  }
  
  return isWithinInterval(currentTime, { start: open, end: close });
};

/**
 * Get day key (e.g., "monday") from Date object
 */
export const getDayKeyFromDate = (date: Date): DayOfWeek => {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

/**
 * Format time string ("HH:MM") to readable format with timezone
 */
export const formatTime = (time: string, timezone: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = setMinutes(setHours(new Date(), hours), minutes);
  return format(utcToZonedTime(date, timezone), 'h:mm a');
};

/**
 * Format date to display format
 */
export const formatDate = (date: Date, timezone: string): string => {
  return format(utcToZonedTime(date, timezone), 'EEEE, MMMM d, yyyy');
};

/**
 * Get special hours for a specific date
 */
export const getSpecialHoursForDate = (date: Date, specialHours: SpecialHours[]): SpecialHours | null => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return specialHours.find(sh => sh.date === dateStr) || null;
};

/**
 * Get current business status (open/closed)
 */
export const getBusinessStatus = (
  currentTime: Date,
  data: BusinessHoursData
): BusinessStatus => {
  const { timezone, schedule, specialHours, holidayMode } = data;

  if (holidayMode) {
    return { isOpen: false, message: 'Holiday Mode - Temporarily Closed' };
  }

  const todaySpecialHours = getSpecialHoursForDate(currentTime, specialHours);
  if (todaySpecialHours) {
    if (todaySpecialHours.isClosed) {
      return { isOpen: false, message: `Closed for ${todaySpecialHours.name}` };
    }
    if (todaySpecialHours.timeRanges) {
      for (const range of todaySpecialHours.timeRanges) {
        if (isTimeInRange(currentTime, range.open, range.close)) {
          return { isOpen: true, message: `Open for ${todaySpecialHours.name}` };
        }
      }
      return { isOpen: false, message: `Closed for ${todaySpecialHours.name}` };
    }
  }

  const dayKey = getDayKeyFromDate(currentTime);
  const daySchedule = schedule.find(d => d.day === dayKey);
  
  if (!daySchedule || daySchedule.isClosed) {
    const dayName = DAYS_OF_WEEK.find(d => d.key === dayKey)?.label || key;
    return { isOpen: false, message: `Closed on ${dayName}` };
  }

  for (const range of daySchedule.timeRanges) {
    if (isTimeInRange(currentTime, range.open, range.close)) {
      return { isOpen: true, message: 'Open Now' };
    }
  }

  const dayName = DAYS_OF_WEEK.find(d => d.key === dayKey)?.label || key;
  return { isOpen: false, message: `Closed on ${dayName}` };
};

/**
 * Get next opening time
 */
export const getNextOpeningTime = (
  currentTime: Date,
  data: BusinessHoursData
): NextOpeningTime | null => {
  const { timezone, schedule, specialHours, holidayMode } = data;

  if (holidayMode) return null;

  let checkDate = new Date(currentTime);
  const maxDaysToCheck = 14; // Check next 14 days
  let daysChecked = 0;

  while (daysChecked < maxDaysToCheck) {
    const specialHoursForDate = getSpecialHoursForDate(checkDate, specialHours);
    const dayKey = getDayKeyFromDate(checkDate);
    const daySchedule = schedule.find(d => d.day === dayKey);

    // Skip if special hours mark as closed
    if (specialHoursForDate?.isClosed) {
      checkDate = addDays(checkDate, 1);
      daysChecked++;
      continue;
    }

    // Check special hours first
    if (specialHoursForDate?.timeRanges && specialHoursForDate.timeRanges.length > 0) {
      const nextOpenRange = specialHoursForDate.timeRanges.find(range => {
        const openTime = parseTimeToDate(range.open, checkDate);
        return openTime > checkDate;
      });
      
      if (nextOpenRange) {
        return {
          date: checkDate,
          openTime: nextOpenRange.open,
          label: specialHoursForDate.name
        };
      }
    }

    // Check regular schedule
    if (daySchedule && !daySchedule.isClosed && daySchedule.timeRanges.length > 0) {
      // If checking today, find the next time range that hasn't started yet
      if (daysChecked === 0) {
        const nextOpenRange = daySchedule.timeRanges.find(range => {
          const openTime = parseTimeToDate(range.open, checkDate);
          return openTime > currentTime;
        });
        
        if (nextOpenRange) {
          return {
            date: checkDate,
            openTime: nextOpenRange.open
          };
        }
      } else {
        // For future days, return the first time range
        return {
          date: checkDate,
          openTime: daySchedule.timeRanges[0].open
        };
      }
    }

    // Move to next day
    checkDate = addDays(checkDate, 1);
    // Reset time to start of day for accurate comparisons
    checkDate.setHours(0, 0, 0, 0);
    daysChecked++;
  }

  return null;
};

/**
 * Check if a day is currently active (today)
 */
export const isToday = (date: Date, dayKey: DayOfWeek): boolean => {
  return getDayKeyFromDate(date) === dayKey;
};

/**
 * Get day schedule for a specific day
 */
export const getDaySchedule = (schedule: DaySchedule[], dayKey: DayOfWeek): DaySchedule | undefined => {
  return schedule.find(d => d.day === dayKey);
};

/**
 * Create default business hours data
 */
export const createDefaultBusinessHours = (): BusinessHoursData => ({
  timezone: 'America/New_York',
  holidayMode: false,
  schedule: [
    { day: 'sunday', isClosed: true, timeRanges: [] },
    { day: 'monday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
    { day: 'tuesday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
    { day: 'wednesday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
    { day: 'thursday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
    { day: 'friday', isClosed: false, timeRanges: [{ open: '09:00', close: '17:00' }] },
    { day: 'saturday', isClosed: true, timeRanges: [] },
  ],
  specialHours: [],
});

/**
 * Validate time range
 */
export const isValidTimeRange = (range: TimeRange): boolean => {
  const open = parseTimeToDate(range.open, new Date());
  const close = parseTimeToDate(range.close, new Date());
  return open < close;
};

/**
 * Validate business hours data
 */
export const validateBusinessHours = (data: BusinessHoursData): string[] => {
  const errors: string[] = [];

  // Validate schedule
  data.schedule.forEach(daySchedule => {
    if (!daySchedule.isClosed && daySchedule.timeRanges.length === 0) {
      errors.push(`${daySchedule.day} is not marked as closed but has no time ranges`);
    }

    if (!daySchedule.isClosed) {
      daySchedule.timeRanges.forEach((range, index) => {
        if (!isValidTimeRange(range)) {
          errors.push(`${daySchedule.day} time range ${index + 1} is invalid: ${range.open} - ${range.close}`);
        }
      });
    }
  });

  // Validate timezone
  try {
    getCurrentTimeInTimezone(data.timezone);
  } catch (error) {
    errors.push(`Invalid timezone: ${data.timezone}`);
  }

  return errors;
};