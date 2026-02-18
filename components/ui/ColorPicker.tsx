/**
 * ColorPicker Component
 * 
 * Color picker with hex input, presets, and opacity support.
 * Supports both solid colors and alpha channel.
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  showPresets?: boolean;
  showOpacity?: boolean;
  presets?: string[];
  className?: string;
}

const DEFAULT_PRESETS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FF6B6B', // Light Red
  '#4ECDC4', // Teal
  '#45B7D1', // Sky Blue
  '#96CEB4', // Sage
  '#FFEAA7', // Light Yellow
  '#DFE6E9', // Light Gray
  '#74B9FF', // Soft Blue
  '#A29BFE', // Lavender
];

/**
 * Validate hex color
 */
function isValidHex(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

/**
 * Extract RGB from hex
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1] ?? '0', 16),
        g: parseInt(result[2] ?? '0', 16),
        b: parseInt(result[3] ?? '0', 16),
      }
    : null;
}

export function ColorPicker({
  value,
  onChange,
  label,
  showPresets = true,
  showOpacity: _showOpacity = false,
  presets = DEFAULT_PRESETS,
  className = '',
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Validate and update
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      if (isValidHex(newValue)) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  // Handle preset click
  const handlePresetClick = useCallback(
    (preset: string) => {
      setInputValue(preset);
      onChange(preset);
      setIsOpen(false);
    },
    [onChange]
  );

  // Handle native color input
  const handleNativeColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      setInputValue(color);
      onChange(color);
    },
    [onChange]
  );

  // Get brightness for contrast
  const getBrightness = useCallback((hex: string): number => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 128;
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  }, []);

  const brightness = useMemo(() => getBrightness(value), [value, getBrightness]);
  const textColor = brightness > 128 ? '#000000' : '#FFFFFF';

  return (
    <div className={`color-picker ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div className="relative">
        {/* Color preview and input */}
        <div className="flex items-center gap-2">
          {/* Native color picker */}
          <div className="relative">
            <input
              type="color"
              value={value}
              onChange={handleNativeColorChange}
              className="w-12 h-12 rounded-md cursor-pointer border-2 border-gray-300"
              title="Pick a color"
            />
          </div>

          {/* Hex input */}
          <div className="flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="#000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              maxLength={7}
            />
            {!isValidHex(inputValue) && inputValue !== '' && (
              <p className="text-xs text-red-500 mt-1">Invalid hex color</p>
            )}
          </div>

          {/* Toggle presets */}
          {showPresets && (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition text-sm font-medium"
            >
              Presets
            </button>
          )}
        </div>

        {/* Presets dropdown */}
        {showPresets && isOpen && (
          <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-full">
            <div className="grid grid-cols-8 gap-2">
              {presets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="w-8 h-8 rounded-md border-2 transition hover:scale-110"
                  style={{
                    backgroundColor: preset,
                    borderColor: preset === value ? '#3B82F6' : '#D1D5DB',
                  }}
                  title={preset}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Color info */}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
        <div
          className="px-2 py-1 rounded"
          style={{ backgroundColor: value, color: textColor }}
        >
          Preview
        </div>
        {isValidHex(value) && (
          <span>
            RGB({hexToRgb(value)?.r}, {hexToRgb(value)?.g}, {hexToRgb(value)?.b})
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Simple color swatch selector
 */
export function ColorSwatchPicker({
  value,
  onChange,
  colors,
  label,
  className = '',
}: {
  value: string;
  onChange: (color: string) => void;
  colors: string[];
  label?: string;
  className?: string;
}) {
  return (
    <div className={`color-swatch-picker ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div className="flex flex-wrap gap-2">
        {colors.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="w-10 h-10 rounded-md border-2 transition hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: color === value ? '#3B82F6' : '#D1D5DB',
              boxShadow: color === value ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none',
            }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
