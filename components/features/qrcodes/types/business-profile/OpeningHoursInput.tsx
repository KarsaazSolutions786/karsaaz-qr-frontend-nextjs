'use client';

import { useState } from 'react';
import { Clock, Copy, Plus, X } from 'lucide-react';
import { OpeningHours, DaySchedule } from '@/types/entities/business-profile';

interface OpeningHoursInputProps {
  value: OpeningHours;
  onChange: (value: OpeningHours) => void;
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

export function OpeningHoursInput({ value, onChange }: OpeningHoursInputProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const updateDay = (day: string, schedule: DaySchedule) => {
    onChange({
      ...value,
      [day]: schedule,
    });
  };

  const copyToAllDays = (sourceDay: string) => {
    const sourceSchedule = value[sourceDay as keyof OpeningHours] as DaySchedule;
    const newHours = { ...value };
    DAYS.forEach(({ key }) => {
      if (key !== sourceDay) {
        newHours[key] = { ...sourceSchedule };
      }
    });
    onChange(newHours);
  };

  const addBreak = (day: string) => {
    const daySchedule = value[day as keyof OpeningHours] as DaySchedule;
    updateDay(day, {
      ...daySchedule,
      breaks: [
        ...(daySchedule.breaks || []),
        { startTime: '12:00', endTime: '13:00' },
      ],
    });
  };

  const removeBreak = (day: string, index: number) => {
    const daySchedule = value[day as keyof OpeningHours] as DaySchedule;
    updateDay(day, {
      ...daySchedule,
      breaks: daySchedule.breaks?.filter((_, i) => i !== index),
    });
  };

  const updateBreak = (
    day: string,
    index: number,
    field: 'startTime' | 'endTime',
    newValue: string
  ) => {
    const daySchedule = value[day as keyof OpeningHours] as DaySchedule;
    const breaks = [...(daySchedule.breaks || [])];
    breaks[index] = { startTime: '', endTime: '', ...breaks[index], [field]: newValue };
    updateDay(day, { ...daySchedule, breaks });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Opening Hours</h3>
      </div>

      <div className="space-y-2">
        {DAYS.map(({ key, label }) => {
          const daySchedule = value[key] as DaySchedule;
          const isExpanded = expandedDay === key;

          return (
            <div
              key={key}
              className="border rounded-lg overflow-hidden bg-white"
            >
              <div className="flex items-center gap-4 p-4">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={daySchedule.isOpen}
                    onChange={(e) =>
                      updateDay(key, { ...daySchedule, isOpen: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900 w-28">{label}</span>

                  {daySchedule.isOpen ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={daySchedule.openTime || '09:00'}
                        onChange={(e) =>
                          updateDay(key, { ...daySchedule, openTime: e.target.value })
                        }
                        className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={daySchedule.closeTime || '17:00'}
                        onChange={(e) =>
                          updateDay(key, { ...daySchedule, closeTime: e.target.value })
                        }
                        className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      {daySchedule.breaks && daySchedule.breaks.length > 0 && (
                        <span className="text-sm text-gray-500">
                          ({daySchedule.breaks.length} break{daySchedule.breaks.length > 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Closed</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {daySchedule.isOpen && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedDay(isExpanded ? null : key)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={isExpanded ? 'Collapse' : 'Expand for breaks & notes'}
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToAllDays(key)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy to all days"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isExpanded && daySchedule.isOpen && (
                <div className="border-t bg-gray-50 p-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Breaks
                      </label>
                      <button
                        type="button"
                        onClick={() => addBreak(key)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Break
                      </button>
                    </div>

                    {daySchedule.breaks && daySchedule.breaks.length > 0 && (
                      <div className="space-y-2">
                        {daySchedule.breaks.map((breakTime, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={breakTime.startTime}
                              onChange={(e) =>
                                updateBreak(key, index, 'startTime', e.target.value)
                              }
                              className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-500 text-sm">to</span>
                            <input
                              type="time"
                              value={breakTime.endTime}
                              onChange={(e) =>
                                updateBreak(key, index, 'endTime', e.target.value)
                              }
                              className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeBreak(key, index)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Note
                    </label>
                    <input
                      type="text"
                      value={daySchedule.note || ''}
                      onChange={(e) =>
                        updateDay(key, { ...daySchedule, note: e.target.value })
                      }
                      placeholder="e.g., Happy hour 5-7pm"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={value.timezone || ''}
          onChange={(e) => onChange({ ...value, timezone: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Auto-detect</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Paris">Paris (CET)</option>
          <option value="Asia/Dubai">Dubai (GST)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
          <option value="Australia/Sydney">Sydney (AEST)</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
          Special Hours Note
        </label>
        <textarea
          value={value.specialHours || ''}
          onChange={(e) => onChange({ ...value, specialHours: e.target.value })}
          placeholder="e.g., Closed on public holidays, Extended hours during summer"
          rows={2}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
