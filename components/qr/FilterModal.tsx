/**
 * FilterModal Component
 * 
 * Advanced filter modal for QR codes.
 */

'use client';

import React, { useState } from 'react';
import { X, Filter, Save, RotateCcw, Search } from 'lucide-react';
import { FilterState, QRCodeType, QRCodeStatus, DateRangeType } from '@/hooks/useFilters';

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  onSavePreset?: (name: string) => void;
}

const QR_TYPES: { value: QRCodeType; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'url', label: 'URL' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'vcard', label: 'vCard' },
  { value: 'location', label: 'Location' },
];

const STATUSES: { value: QRCodeStatus; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

const DATE_RANGES: { value: DateRangeType; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset,
  onSavePreset,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  
  if (!isOpen) return null;
  
  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };
  
  const handleReset = () => {
    onReset();
    setLocalFilters({
      search: '',
      type: 'all',
      status: 'all',
      dateRange: 'all',
    });
  };
  
  const handleSavePreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset(presetName.trim());
      setPresetName('');
      setShowSavePreset(false);
    }
  };
  
  const updateLocalFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Advanced Filters</h2>
              <p className="text-sm text-gray-500">Refine your QR code search</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={localFilters.search}
                  onChange={(e) => updateLocalFilter('search', e.target.value)}
                  placeholder="Search by name, content, or description..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Type and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code Type
                </label>
                <select
                  value={localFilters.type}
                  onChange={(e) => updateLocalFilter('type', e.target.value as QRCodeType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {QR_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={localFilters.status}
                  onChange={(e) => updateLocalFilter('status', e.target.value as QRCodeStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUSES.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={localFilters.dateRange}
                onChange={(e) => updateLocalFilter('dateRange', e.target.value as DateRangeType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DATE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              
              {/* Custom date range */}
              {localFilters.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">From</label>
                    <input
                      type="date"
                      value={localFilters.dateFrom?.toISOString().split('T')[0] || ''}
                      onChange={(e) => updateLocalFilter('dateFrom', new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">To</label>
                    <input
                      type="date"
                      value={localFilters.dateTo?.toISOString().split('T')[0] || ''}
                      onChange={(e) => updateLocalFilter('dateTo', new Date(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Scan Count Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scan Count Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    min={0}
                    value={localFilters.scanCountMin || ''}
                    onChange={(e) => updateLocalFilter('scanCountMin', parseInt(e.target.value) || undefined)}
                    placeholder="Min scans"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    min={0}
                    value={localFilters.scanCountMax || ''}
                    onChange={(e) => updateLocalFilter('scanCountMax', parseInt(e.target.value) || undefined)}
                    placeholder="Max scans"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            {/* Advanced Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Advanced Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={localFilters.hasLogo === true}
                    onChange={(e) => updateLocalFilter('hasLogo', e.target.checked ? true : undefined)}
                    className="rounded"
                  />
                  Has Logo
                </label>
                
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={localFilters.hasSticker === true}
                    onChange={(e) => updateLocalFilter('hasSticker', e.target.checked ? true : undefined)}
                    className="rounded"
                  />
                  Has Sticker
                </label>
              </div>
            </div>
            
            {/* Save as Preset */}
            {onSavePreset && (
              <div className="pt-4 border-t border-gray-200">
                {!showSavePreset ? (
                  <button
                    onClick={() => setShowSavePreset(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save as Preset
                  </button>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Preset Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        placeholder="e.g., Active URL QR Codes"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                      />
                      <button
                        onClick={handleSavePreset}
                        disabled={!presetName.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setShowSavePreset(false);
                          setPresetName('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
