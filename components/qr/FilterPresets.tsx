/**
 * FilterPresets Component
 * 
 * Saved filter presets UI.
 */

'use client';

import React, { useState } from 'react';
import { Star, Trash2, Edit2, Check, X } from 'lucide-react';
import { FilterPreset } from '@/hooks/useFilters';

export interface FilterPresetsProps {
  presets: FilterPreset[];
  activePresetId?: string;
  onLoadPreset: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
  onUpdatePreset: (presetId: string, updates: Partial<FilterPreset>) => void;
  className?: string;
}

export function FilterPresets({
  presets,
  activePresetId,
  onLoadPreset,
  onDeletePreset,
  onUpdatePreset,
  className = '',
}: FilterPresetsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  if (presets.length === 0) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <p className="text-sm text-gray-500">No saved presets yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Save your current filters as a preset for quick access
        </p>
      </div>
    );
  }
  
  const startEdit = (preset: FilterPreset) => {
    setEditingId(preset.id);
    setEditName(preset.name);
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };
  
  const saveEdit = (presetId: string) => {
    if (editName.trim()) {
      onUpdatePreset(presetId, { name: editName.trim() });
    }
    cancelEdit();
  };
  
  const handleDelete = (presetId: string, presetName: string) => {
    if (confirm(`Delete preset "${presetName}"?`)) {
      onDeletePreset(presetId);
    }
  };
  
  const toggleDefault = (preset: FilterPreset) => {
    onUpdatePreset(preset.id, { isDefault: !preset.isDefault });
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {presets.map(preset => (
        <div
          key={preset.id}
          className={`
            group p-4 rounded-lg border-2 transition-all
            ${activePresetId === preset.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Preset info */}
            <div className="flex-1 min-w-0">
              {editingId === preset.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 border border-blue-500 rounded text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(preset.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button
                    onClick={() => saveEdit(preset.id)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onLoadPreset(preset.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${
                      activePresetId === preset.id ? 'text-blue-700' : 'text-gray-900'
                    }`}>
                      {preset.name}
                    </span>
                    {preset.isDefault && (
                      <span className="px-1.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  
                  {/* Filter summary */}
                  <div className="mt-1 text-xs text-gray-500">
                    {getFilterSummary(preset.filters)}
                  </div>
                  
                  {/* Created date */}
                  <div className="mt-1 text-xs text-gray-400">
                    Created {formatDate(preset.createdAt)}
                  </div>
                </button>
              )}
            </div>
            
            {/* Actions */}
            {editingId !== preset.id && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleDefault(preset)}
                  className={`p-1.5 rounded transition-colors ${
                    preset.isDefault
                      ? 'text-yellow-600 bg-yellow-50'
                      : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                  }`}
                  title={preset.isDefault ? 'Unset as default' : 'Set as default'}
                >
                  <Star className={`w-4 h-4 ${preset.isDefault ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => startEdit(preset)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Rename preset"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(preset.id, preset.name)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete preset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Get filter summary text
 */
function getFilterSummary(filters: Record<string, any>): string {
  const parts: string[] = [];
  
  if (filters.type && filters.type !== 'all') {
    parts.push(`Type: ${filters.type}`);
  }
  
  if (filters.status && filters.status !== 'all') {
    parts.push(`Status: ${filters.status}`);
  }
  
  if (filters.dateRange && filters.dateRange !== 'all') {
    parts.push(`Date: ${filters.dateRange}`);
  }
  
  if (filters.scanCountMin !== undefined || filters.scanCountMax !== undefined) {
    const min = filters.scanCountMin || 0;
    const max = filters.scanCountMax || '∞';
    parts.push(`Scans: ${min}-${max}`);
  }
  
  if (filters.hasLogo) {
    parts.push('Has logo');
  }
  
  if (filters.hasSticker) {
    parts.push('Has sticker');
  }
  
  return parts.length > 0 ? parts.join(' • ') : 'No filters applied';
}

/**
 * Format date
 */
function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

/**
 * Compact presets dropdown
 */
export function FilterPresetsDropdown({
  presets,
  activePresetId,
  onLoadPreset,
  className = '',
}: Pick<FilterPresetsProps, 'presets' | 'activePresetId' | 'onLoadPreset' | 'className'>) {
  
  return (
    <select
      value={activePresetId || ''}
      onChange={(e) => e.target.value && onLoadPreset(e.target.value)}
      className={`px-3 py-2 border border-gray-300 rounded-lg bg-white ${className}`}
    >
      <option value="">Select a preset...</option>
      {presets.map(preset => (
        <option key={preset.id} value={preset.id}>
          {preset.name}
          {preset.isDefault ? ' ⭐' : ''}
        </option>
      ))}
    </select>
  );
}
