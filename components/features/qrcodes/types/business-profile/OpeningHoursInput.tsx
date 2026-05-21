'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Clock, Copy, Plus, X } from 'lucide-react';
import { OpeningHours, DaySchedule } from '@/types/entities/business-profile';

interface OpeningHoursInputProps {
  value: OpeningHours;
  onChange: (value: OpeningHours) => void;
}

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

/**
 * Purpose: Retrieves days.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
const getDays = (t: (key: string) => string) => [
  { key: 'monday' as const, label: t('Monday') },
  { key: 'tuesday' as const, label: t('Tuesday') },
  { key: 'wednesday' as const, label: t('Wednesday') },
  { key: 'thursday' as const, label: t('Thursday') },
  { key: 'friday' as const, label: t('Friday') },
  { key: 'saturday' as const, label: t('Saturday') },
  { key: 'sunday' as const, label: t('Sunday') },
];

/**
 * Purpose: Executes OpeningHoursInput functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function OpeningHoursInput({ value, onChange }: OpeningHoursInputProps) {
  const { t } = useTranslation();
  const DAYS = getDays(t);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const updateDay = (day: string, schedule: DaySchedule) => {
    onChange({
      ...value,
      [day]: schedule,
    });
  };

  /**
   * Purpose: Executes copyToAllDays functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const copyToAllDays = (sourceDay: string) => {
    const sourceSchedule = value[sourceDay as keyof OpeningHours] as DaySchedule;
    const newHours = { ...value };
    DAY_KEYS.forEach((key) => {
      if (key !== sourceDay) {
        newHours[key] = { ...sourceSchedule };
      }
    });
    onChange(newHours);
  };

  /**
   * Purpose: Executes addBreak functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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

  /**
   * Purpose: Deletes the specified resource.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const removeBreak = (day: string, index: number) => {
    const daySchedule = value[day as keyof OpeningHours] as DaySchedule;
    updateDay(day, {
      ...daySchedule,
      breaks: daySchedule.breaks?.filter((_, i) => i !== index),
    });
  };

  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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
        <h3 className="text-lg font-semibold text-gray-900">{t('Opening Hours')}</h3>
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
                      <span className="text-gray-500">{t('to')}</span>
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
                          ({daySchedule.breaks.length} {daySchedule.breaks.length > 1 ? t('breaks') : t('break')})
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">{t('Closed')}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {daySchedule.isOpen && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedDay(isExpanded ? null : key)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={isExpanded ? t('Collapse') : t('Expand for breaks & notes')}
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => copyToAllDays(key)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={t('Copy to all days')}
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
                        {t('Breaks')}
                      </label>
                      <button
                        type="button"
                        onClick={() => addBreak(key)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        {t('Add Break')}
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
                            <span className="text-gray-500 text-sm">{t('to')}</span>
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
                      {t('Special Note')}
                    </label>
                    <input
                      type="text"
                      value={daySchedule.note || ''}
                      onChange={(e) =>
                        updateDay(key, { ...daySchedule, note: e.target.value })
                      }
                      placeholder={t('e.g., Happy hour 5-7pm')}
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
          {t('Timezone')}
        </label>
        <select
          value={value.timezone || ''}
          onChange={(e) => onChange({ ...value, timezone: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('Auto-detect')}</option>
          <option value="America/New_York">{t('Eastern Time (ET)')}</option>
          <option value="America/Chicago">{t('Central Time (CT)')}</option>
          <option value="America/Denver">{t('Mountain Time (MT)')}</option>
          <option value="America/Los_Angeles">{t('Pacific Time (PT)')}</option>
          <option value="Europe/London">{t('London (GMT)')}</option>
          <option value="Europe/Paris">{t('Paris (CET)')}</option>
          <option value="Asia/Dubai">{t('Dubai (GST)')}</option>
          <option value="Asia/Tokyo">{t('Tokyo (JST)')}</option>
          <option value="Australia/Sydney">{t('Sydney (AEST)')}</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
          {t('Special Hours Note')}
        </label>
        <textarea
          value={value.specialHours || ''}
          onChange={(e) => onChange({ ...value, specialHours: e.target.value })}
          placeholder={t('e.g., Closed on public holidays, Extended hours during summer')}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
