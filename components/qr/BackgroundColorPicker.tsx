/**
 * BackgroundColorPicker Component
 * 
 * Background color selection with transparency option.
 * Supports solid colors and transparent backgrounds.
 */

'use client';

import React from 'react';
import { ColorPicker } from '../ui/ColorPicker';

export interface BackgroundColorPickerProps {
  value: string | null; // null = transparent
  onChange: (color: string | null) => void;
  label?: string;
  showTransparent?: boolean;
  className?: string;
}

export function BackgroundColorPicker({
  value,
  onChange,
  label = 'Background Color',
  showTransparent = true,
  className = '',
}: BackgroundColorPickerProps) {
  const isTransparent = value === null || value === 'transparent';

  const handleColorChange = (color: string) => {
    onChange(color);
  };

  const handleTransparentToggle = () => {
    if (isTransparent) {
      onChange('#FFFFFF'); // Default to white when enabling
    } else {
      onChange(null); // Set to transparent
    }
  };

  return (
    <div className={`background-color-picker ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        
        {showTransparent && (
          <button
            type="button"
            onClick={handleTransparentToggle}
            className={`px-3 py-1 text-xs rounded-md transition ${
              isTransparent
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isTransparent ? '✓ Transparent' : 'Make Transparent'}
          </button>
        )}
      </div>

      {!isTransparent && (
        <ColorPicker value={value || '#FFFFFF'} onChange={handleColorChange} showPresets />
      )}

      {isTransparent && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-white relative overflow-hidden">
          {/* Checkerboard pattern for transparency */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />
          <div className="relative text-center">
            <p className="text-sm font-medium text-gray-700">Transparent Background</p>
            <p className="text-xs text-gray-500 mt-1">QR code will have no background</p>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-md border-2 border-gray-300 relative overflow-hidden"
            style={{ backgroundColor: isTransparent ? 'transparent' : value || '#FFFFFF' }}
          >
            {isTransparent && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '10px 10px',
                  backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                }}
              />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {isTransparent ? 'Transparent' : value || '#FFFFFF'}
            </p>
            <p className="text-xs text-gray-500">
              {isTransparent
                ? 'No background color'
                : 'Background will be filled with this color'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Quick background presets
 */
export const BACKGROUND_PRESETS = [
  { name: 'White', color: '#FFFFFF' },
  { name: 'Black', color: '#000000' },
  { name: 'Light Gray', color: '#F5F5F5' },
  { name: 'Dark Gray', color: '#333333' },
  { name: 'Transparent', color: null },
];

/**
 * Background preset picker
 */
export function BackgroundPresetPicker({
  onChange,
  className = '',
}: {
  onChange: (color: string | null) => void;
  className?: string;
}) {
  return (
    <div className={`background-preset-picker ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>

      <div className="grid grid-cols-5 gap-2">
        {BACKGROUND_PRESETS.map(preset => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onChange(preset.color)}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-md transition group"
          >
            <div
              className="w-12 h-12 rounded-md border-2 border-gray-300 group-hover:border-primary-500 transition relative overflow-hidden"
              style={{ backgroundColor: preset.color || 'transparent' }}
            >
              {preset.color === null && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                    backgroundSize: '10px 10px',
                    backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                  }}
                />
              )}
            </div>
            <span className="text-xs text-gray-600">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
