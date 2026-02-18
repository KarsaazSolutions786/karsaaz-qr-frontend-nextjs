/**
 * OutlineFields Component
 * 
 * Outline/border configuration UI for QR codes.
 * Toggle, color, and width controls.
 */

'use client';

import React from 'react';
import { OutlineConfig } from '@/types/entities/designer';
import { ColorPicker } from '../ui/ColorPicker';
import {
  createDefaultOutlineConfig,
  createEnabledOutlineConfig,
  getOptimalOutlineWidth,
  isOutlineTooThick,
} from '@/lib/utils/outline-renderer';

export interface OutlineFieldsProps {
  value: OutlineConfig;
  onChange: (outline: OutlineConfig) => void;
  qrSize?: number;
  label?: string;
  className?: string;
}

export function OutlineFields({
  value,
  onChange,
  qrSize = 512,
  label = 'Outline',
  className = '',
}: OutlineFieldsProps) {
  const isEnabled = value.enabled;
  const outlineColor = value.color || '#000000';
  const outlineWidth = value.width || 4;

  // Handle enable/disable
  const handleToggle = () => {
    if (isEnabled) {
      onChange(createDefaultOutlineConfig());
    } else {
      const optimalWidth = getOptimalOutlineWidth(qrSize);
      onChange(createEnabledOutlineConfig('#000000', optimalWidth));
    }
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    onChange({
      ...value,
      color,
    });
  };

  // Handle width change
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10);
    onChange({
      ...value,
      width,
    });
  };

  // Check if outline is too thick
  const tooThick = isEnabled && isOutlineTooThick(outlineWidth, qrSize);
  const optimalWidth = getOptimalOutlineWidth(qrSize);

  return (
    <div className={`outline-fields ${className}`}>
      {/* Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <p className="text-xs text-gray-500 mt-1">
            {isEnabled ? `${outlineWidth}px border around QR code` : 'No outline'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            isEnabled ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Configuration (only when enabled) */}
      {isEnabled && (
        <div className="space-y-4">
          {/* Color picker */}
          <ColorPicker value={outlineColor} onChange={handleColorChange} label="Outline Color" showPresets />

          {/* Width slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Width: {outlineWidth}px
              {outlineWidth === optimalWidth && (
                <span className="ml-2 text-xs text-green-600">✓ Optimal</span>
              )}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={outlineWidth}
              onChange={handleWidthChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1px</span>
              <span>{optimalWidth}px (optimal)</span>
              <span>20px</span>
            </div>
          </div>

          {/* Warning if too thick */}
          {tooThick && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ <span className="font-medium">Warning:</span> Outline is very thick relative to QR
                size. This may affect scannability.
              </p>
            </div>
          )}

          {/* Preview */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">Preview</label>
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* QR placeholder */}
                <div
                  className="bg-white"
                  style={{
                    width: '200px',
                    height: '200px',
                    border: `${outlineWidth}px solid ${outlineColor}`,
                  }}
                >
                  {/* Simulated QR pattern */}
                  <div className="p-4">
                    <div className="grid grid-cols-8 gap-1">
                      {[...Array(64)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square"
                          style={{
                            backgroundColor: Math.random() > 0.5 ? '#000' : '#FFF',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              This outline will be added around the entire QR code
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange(createEnabledOutlineConfig(outlineColor, optimalWidth))}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition"
            >
              Use Optimal Width ({optimalWidth}px)
            </button>
            <button
              type="button"
              onClick={() => onChange(createDefaultOutlineConfig())}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition"
            >
              Remove Outline
            </button>
          </div>
        </div>
      )}

      {/* Outline tips */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Outline Tips</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Outlines add visual emphasis to QR codes</li>
          <li>Use high-contrast colors for better visibility</li>
          <li>Keep outline width under 5% of QR size</li>
          <li>Match outline color to your brand</li>
          <li>Test scannability with outline enabled</li>
          <li>Outlines work best on solid backgrounds</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Outline color presets
 */
export const OUTLINE_COLOR_PRESETS = [
  { name: 'Black', color: '#000000' },
  { name: 'White', color: '#FFFFFF' },
  { name: 'Primary Blue', color: '#3B82F6' },
  { name: 'Red', color: '#EF4444' },
  { name: 'Green', color: '#10B981' },
  { name: 'Purple', color: '#8B5CF6' },
  { name: 'Orange', color: '#F97316' },
  { name: 'Gray', color: '#6B7280' },
];

/**
 * Outline preset picker
 */
export function OutlinePresetPicker({
  onChange,
  className = '',
}: {
  onChange: (outline: OutlineConfig) => void;
  className?: string;
}) {
  return (
    <div className={`outline-preset-picker ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Quick Outline Presets</label>

      <div className="grid grid-cols-4 gap-2">
        {OUTLINE_COLOR_PRESETS.map(preset => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onChange(createEnabledOutlineConfig(preset.color, 4))}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-md transition group"
          >
            <div
              className="w-12 h-12 rounded-md border-4 group-hover:border-primary-500 transition"
              style={{
                borderColor: preset.color,
                backgroundColor: '#FFFFFF',
              }}
            />
            <span className="text-xs text-gray-600">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
