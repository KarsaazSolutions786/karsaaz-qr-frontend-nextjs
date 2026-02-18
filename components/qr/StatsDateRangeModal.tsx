/**
 * StatsDateRangeModal Component
 * 
 * Analytics date range picker with presets and comparison.
 */

'use client';

import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';

export type DateRangePreset = 
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'allTime'
  | 'custom';

export interface DateRange {
  preset?: DateRangePreset;
  startDate: string;
  endDate: string;
  compareWithPrevious?: boolean;
}

export interface StatsDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRange: DateRange;
  onApply: (range: DateRange) => void;
}

const PRESETS: Array<{ value: DateRangePreset; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'allTime', label: 'All Time' },
  { value: 'custom', label: 'Custom Range' },
];

function getDateRangeForPreset(preset: DateRangePreset): { startDate: string; endDate: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const toDateStr = (d: Date) => d.toISOString().split('T')[0] ?? '';
  
  switch (preset) {
    case 'today': {
      return { startDate: toDateStr(today), endDate: toDateStr(today) };
    }
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { startDate: toDateStr(yesterday), endDate: toDateStr(yesterday) };
    }
    case 'last7days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 6);
      return { startDate: toDateStr(start), endDate: toDateStr(today) };
    }
    case 'last30days': {
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      return { startDate: toDateStr(start), endDate: toDateStr(today) };
    }
    case 'thisMonth': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: toDateStr(start), endDate: toDateStr(today) };
    }
    case 'lastMonth': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: toDateStr(start), endDate: toDateStr(end) };
    }
    case 'thisYear': {
      const start = new Date(now.getFullYear(), 0, 1);
      return { startDate: toDateStr(start), endDate: toDateStr(today) };
    }
    case 'allTime': {
      const start = new Date('2020-01-01');
      return { startDate: toDateStr(start), endDate: toDateStr(today) };
    }
    default:
      return { startDate: toDateStr(today), endDate: toDateStr(today) };
  }
}

export function StatsDateRangeModal({
  isOpen,
  onClose,
  currentRange,
  onApply,
}: StatsDateRangeModalProps) {
  const [preset, setPreset] = useState<DateRangePreset>(
    currentRange.preset || 'last7days'
  );
  const [startDate, setStartDate] = useState(currentRange.startDate);
  const [endDate, setEndDate] = useState(currentRange.endDate);
  const [compareWithPrevious, setCompareWithPrevious] = useState(
    currentRange.compareWithPrevious || false
  );

  if (!isOpen) return null;

  const handlePresetChange = (newPreset: DateRangePreset) => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      const range = getDateRangeForPreset(newPreset);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
  };

  const handleApply = () => {
    onApply({
      preset: preset !== 'custom' ? preset : undefined,
      startDate,
      endDate,
      compareWithPrevious,
    });
    onClose();
  };

  const handleReset = () => {
    const defaultPreset: DateRangePreset = 'last7days';
    const range = getDateRangeForPreset(defaultPreset);
    setPreset(defaultPreset);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setCompareWithPrevious(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Select Date Range</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preset Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quick Select
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.filter((p) => p.value !== 'custom').map((presetOption) => (
                <button
                  key={presetOption.value}
                  type="button"
                  onClick={() => handlePresetChange(presetOption.value)}
                  className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition flex items-center justify-between ${
                    preset === presetOption.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span>{presetOption.label}</span>
                  {preset === presetOption.value && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Custom Date Range
              </label>
              <button
                type="button"
                onClick={() => handlePresetChange('custom')}
                className={`text-xs font-medium px-2 py-1 rounded ${
                  preset === 'custom'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {preset === 'custom' ? 'Selected' : 'Select Custom'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPreset('custom');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPreset('custom');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Comparison Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={compareWithPrevious}
                onChange={(e) => setCompareWithPrevious(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">
                Compare with previous period
              </span>
            </label>
            {compareWithPrevious && (
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Analytics will show comparison with the same date range in the previous period.
              </p>
            )}
          </div>

          {/* Selected Range Display */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xs font-medium text-blue-900 mb-1">
              Selected Range
            </div>
            <div className="text-sm text-blue-700">
              {new Date(startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              -{' '}
              {new Date(endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              {preset !== 'custom' && (
                <span className="ml-2 text-xs">
                  ({PRESETS.find((p) => p.value === preset)?.label})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Reset
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
