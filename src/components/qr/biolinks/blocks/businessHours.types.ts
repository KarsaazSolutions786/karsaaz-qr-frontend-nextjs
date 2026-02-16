/**
 * Type definitions for Business Hours Block component
 */

// Time range (e.g., 9:00 AM - 5:00 PM)
export interface TimeRange {
  open: string; // "HH:MM" format in 24-hour time
  close: string; // "HH:MM" format in 24-hour time
}

// Schedule for a specific day of the week
export interface DaySchedule {
  day: DayOfWeek; // "sunday", "monday", etc.
  isClosed: boolean; // Whether the business is closed this day
  timeRanges: TimeRange[]; // Multiple time ranges for split shifts, lunch breaks, etc.
}

// Special hours for holidays, events, or temporary changes
export interface SpecialHours {
  date: string; // "YYYY-MM-DD" format
  name: string; // Display name (e.g., "Christmas", "Staff Training")
  isClosed: boolean; // Whether closed on this date
  timeRanges?: TimeRange[]; // Optional custom hours if not closed
}

// Complete business hours data structure
export interface BusinessHoursData {
  timezone: string; // IANA timezone name (e.g., "America/New_York")
  schedule: DaySchedule[]; // Weekly schedule
  specialHours: SpecialHours[]; // Holiday/special hours
  holidayMode: boolean; // Global override to mark as temporarily closed
}

// Day of week type for type safety
export type DayOfWeek = 
  | 'sunday' 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday';

// Component props
export interface BusinessHoursProps {
  data: BusinessHoursData;
  isEditMode?: boolean; // Whether to show edit controls
  onUpdate?: (data: BusinessHoursData) => void; // Callback for updates in edit mode
}

// Timezone option for dropdown
export interface TimezoneOption {
  value: string; // IANA timezone name
  label: string; // Display label (e.g., "Eastern Time (ET)")
}

// Current business status
export interface BusinessStatus {
  isOpen: boolean;
  message: string; // Human-readable status message
}

// Next opening time information
export interface NextOpeningTime {
  date: Date;
  openTime: string; // "HH:MM" format
  label?: string; // Optional label (e.g., "Christmas")
}
