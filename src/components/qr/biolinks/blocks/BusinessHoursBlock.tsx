import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import type { BusinessHoursData } from './businessHours.types';
import {
  DAYS_OF_WEEK,
  TIMEZONES,
  getCurrentTimeInTimezone,
  getBusinessStatus,
  getNextOpeningTime,
  getSpecialHoursForDate,
  getDayKeyFromDate,
  formatTime,
} from './businessHours.utils';

// Main Component
export const BusinessHoursBlock: React.FC<{
  data: BusinessHoursData;
  isEditMode?: boolean;
  onUpdate?: (data: BusinessHoursData) => void;
}> = ({ 
  data, 
  isEditMode = false, 
  onUpdate 
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(() => getCurrentTimeInTimezone(data.timezone));
  const [selectedTimezone, setSelectedTimezone] = useState<string>(data.timezone);
  const [holidayMode, setHolidayMode] = useState<boolean>(data.holidayMode);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      requestAnimationFrame(() => {
        setCurrentTime(getCurrentTimeInTimezone(data.timezone));
      });
    }, 60000);
    
    return () => clearInterval(interval);
  }, [data.timezone]);

  // Reset current time when timezone changes
  useEffect(() => {
    requestAnimationFrame(() => {
      setCurrentTime(getCurrentTimeInTimezone(data.timezone));
    });
  }, [data.timezone]);

  const businessStatus = useMemo(() => 
    getBusinessStatus(currentTime, data),
    [currentTime, data]
  );

  const nextOpening = useMemo(() => 
    getNextOpeningTime(currentTime, data),
    [currentTime, data]
  );

  const handleDayToggle = useCallback((dayKey: string) => {
    if (!onUpdate) return;

    const newSchedule = data.schedule.map(day => {
      if (day.day === dayKey) {
        return { ...day, isClosed: !day.isClosed };
      }
      return day;
    });

    onUpdate({ ...data, schedule: newSchedule });
  }, [data, onUpdate]);

  const handleTimeRangeChange = useCallback((dayKey: string, index: number, field: 'open' | 'close', value: string) => {
    if (!onUpdate) return;

    const newSchedule = data.schedule.map(day => {
      if (day.day === dayKey) {
        const newTimeRanges = [...day.timeRanges];
        newTimeRanges[index] = { ...newTimeRanges[index], [field]: value };
        return { ...day, timeRanges: newTimeRanges };
      }
      return day;
    });

    onUpdate({ ...data, schedule: newSchedule });
  }, [data, onUpdate]);

  const addTimeRange = useCallback((dayKey: string) => {
    if (!onUpdate) return;

    const newSchedule = data.schedule.map(day => {
      if (day.day === dayKey) {
        return {
          ...day,
          timeRanges: [...day.timeRanges, { open: '09:00', close: '17:00' }]
        };
      }
      return day;
    });

    onUpdate({ ...data, schedule: newSchedule });
  }, [data, onUpdate]);

  const removeTimeRange = useCallback((dayKey: string, index: number) => {
    if (!onUpdate) return;

    const newSchedule = data.schedule.map(day => {
      if (day.day === dayKey) {
        return {
          ...day,
          timeRanges: day.timeRanges.filter((_, i) => i !== index)
        };
      }
      return day;
    });

    onUpdate({ ...data, schedule: newSchedule });
  }, [data, onUpdate]);

  const handleTimezoneChange = useCallback((timezone: string) => {
    setSelectedTimezone(timezone);
    if (onUpdate) {
      onUpdate({ ...data, timezone });
    }
  }, [data, onUpdate]);

  const handleHolidayModeToggle = useCallback(() => {
    const newHolidayMode = !holidayMode;
    setHolidayMode(newHolidayMode);
    if (onUpdate) {
      onUpdate({ ...data, holidayMode: newHolidayMode });
    }
  }, [data, holidayMode, onUpdate]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with Current Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Business Hours</h2>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              businessStatus.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                businessStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
              }`} />
              {businessStatus.message}
            </span>
          </div>
        </div>

        {/* Next Opening Time */}
        {nextOpening && !businessStatus.isOpen && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Next opening:</span>{' '}
              {format(nextOpening.date, 'EEEE, MMMM d')} at{' '}
              {formatTime(nextOpening.openTime, data.timezone)}
              {nextOpening.label && ` (${nextOpening.label})`}
            </p>
          </div>
        )}

        {/* Current Time Display */}
        <div className="text-sm text-gray-600 mb-4">
          Current time: {format(currentTime, 'h:mm a')} on{' '}
          {format(currentTime, 'EEEE, MMMM d, yyyy')} ({data.timezone})
        </div>

        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={selectedTimezone}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="holiday-mode"
                checked={holidayMode}
                onChange={handleHolidayModeToggle}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="holiday-mode" className="ml-2 text-sm font-medium text-gray-900">
                Holiday Mode - Temporarily Closed
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Day</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Hours</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
              {isEditMode && <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {DAYS_OF_WEEK.map(({ key, label }) => {
              const daySchedule = data.schedule.find(d => d.day === key);
              const isToday = getDayKeyFromDate(currentTime) === key;
              const hasSpecialHours = !!getSpecialHoursForDate(currentTime, data.specialHours) && isToday;

              if (!daySchedule) return null;

              return (
                <tr 
                  key={key} 
                  className={`border-b border-gray-100 ${isToday ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-4 px-4">
                    <span className={`font-medium ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                      {label}
                      {isToday && <span className="ml-2 text-xs text-blue-600">(Today)</span>}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    {isEditMode ? (
                      <div className="space-y-2">
                        <div className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`${key}-closed`}
                            checked={daySchedule.isClosed}
                            onChange={() => handleDayToggle(key)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`${key}-closed`} className="ml-2 text-sm text-gray-700">
                            Closed
                          </label>
                        </div>
                        
                        {!daySchedule.isClosed && (
                          <div className="space-y-2">
                            {daySchedule.timeRanges.map((range, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input
                                  type="time"
                                  value={range.open}
                                  onChange={(e) => handleTimeRangeChange(key, index, 'open', e.target.value)}
                                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                  type="time"
                                  value={range.close}
                                  onChange={(e) => handleTimeRangeChange(key, index, 'close', e.target.value)}
                                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {daySchedule.timeRanges.length > 1 && (
                                  <button
                                    onClick={() => removeTimeRange(key, index)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => addTimeRange(key)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              + Add Time Range
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-700">
                        {daySchedule.isClosed ? (
                          <span className="text-red-600 font-medium">Closed</span>
                        ) : (
                          <div className="space-y-1">
                            {daySchedule.timeRanges.map((range, index) => (
                              <div key={index} className="text-sm">
                                {formatTime(range.open, data.timezone)} - {formatTime(range.close, data.timezone)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    {isToday && !holidayMode && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        businessStatus.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {businessStatus.isOpen ? 'Open Now' : 'Currently Closed'}
                      </span>
                    )}
                    {hasSpecialHours && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {getSpecialHoursForDate(currentTime, data.specialHours)?.name}
                        </span>
                      </div>
                    )}
                  </td>
                  
                  {isEditMode && (
                    <td className="py-4 px-4">
                      {/* Additional actions can be added here */}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Holiday/Special Hours Section - Edit Mode */}
      {isEditMode && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Special Hours</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Special hours feature coming soon. This will allow you to set holiday hours,
              special events, and temporary schedule changes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Default data for new instances
export const defaultBusinessHoursData: BusinessHoursData = {
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
};

export default BusinessHoursBlock;