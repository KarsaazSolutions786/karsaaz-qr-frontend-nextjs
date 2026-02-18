/**
 * DPISettings Component
 * 
 * DPI (Dots Per Inch) settings for print-quality exports.
 */

'use client';

import React, { useState } from 'react';
import { Info, Printer, Monitor } from 'lucide-react';

export interface DPISettingsProps {
  value: number;
  onChange: (value: number) => void;
  format?: 'svg' | 'png' | 'pdf' | 'eps';
  disabled?: boolean;
  className?: string;
}

export interface DPIPreset {
  value: number;
  label: string;
  description: string;
  icon?: React.ReactNode;
  recommended?: boolean;
}

export const DPI_PRESETS: DPIPreset[] = [
  {
    value: 72,
    label: 'Screen',
    description: 'Standard screen resolution (72 DPI)',
    icon: <Monitor className="w-4 h-4" />,
  },
  {
    value: 150,
    label: 'Draft Print',
    description: 'Draft quality printing (150 DPI)',
    icon: <Printer className="w-4 h-4" />,
  },
  {
    value: 300,
    label: 'Print',
    description: 'Professional printing (300 DPI)',
    icon: <Printer className="w-4 h-4" />,
    recommended: true,
  },
  {
    value: 600,
    label: 'High Print',
    description: 'High-quality printing (600 DPI)',
    icon: <Printer className="w-4 h-4" />,
  },
  {
    value: 1200,
    label: 'Premium',
    description: 'Premium printing (1200 DPI)',
    icon: <Printer className="w-4 h-4" />,
  },
];

export function DPISettings({
  value,
  onChange,
  format: _format = 'png',
  disabled = false,
  className = '',
}: DPISettingsProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [customValue, setCustomValue] = useState(value);
  const [showCustomInput, setShowCustomInput] = useState(!DPI_PRESETS.some(p => p.value === value));
  
  const handlePresetClick = (presetValue: number) => {
    onChange(presetValue);
    setShowCustomInput(false);
  };
  
  const handleCustomChange = (newValue: string) => {
    const num = parseInt(newValue, 10);
    if (!isNaN(num)) {
      setCustomValue(num);
      onChange(num);
    }
  };
  
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            DPI (Resolution)
          </label>
          
          {/* Info tooltip */}
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Info className="w-4 h-4" />
            </button>
            
            {showTooltip && (
              <div className="absolute left-0 top-6 z-10 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                <p className="mb-2 font-medium">DPI Settings</p>
                <p className="text-gray-300 mb-2">
                  DPI (Dots Per Inch) determines the print resolution. Higher DPI = better print quality but larger file size.
                </p>
                <ul className="text-gray-300 space-y-1">
                  <li>• 72 DPI: Screen display only</li>
                  <li>• 150 DPI: Draft/home printing</li>
                  <li>• 300 DPI: Professional printing (recommended)</li>
                  <li>• 600+ DPI: High-end printing</li>
                </ul>
                <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            )}
          </div>
        </div>
        
        {/* Current DPI */}
        <span className="text-sm font-medium text-gray-900">
          {value} DPI
        </span>
      </div>
      
      {/* Preset buttons */}
      <div className="grid grid-cols-3 gap-2">
        {DPI_PRESETS.map((preset) => {
          const isSelected = value === preset.value && !showCustomInput;
          
          return (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              disabled={disabled}
              className={`
                relative p-3 rounded-lg border-2 transition-all text-left
                ${isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={preset.description}
            >
              {/* Recommended badge */}
              {preset.recommended && (
                <div className="absolute top-1 right-1">
                  <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                    Recommended
                  </span>
                </div>
              )}
              
              {/* Icon */}
              <div className={`mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                {preset.icon}
              </div>
              
              {/* Label */}
              <div className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                {preset.label}
              </div>
              
              {/* DPI value */}
              <div className="text-xs text-gray-500 mt-1">
                {preset.value} DPI
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Custom DPI input */}
      <div className="pt-2 border-t border-gray-200">
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          disabled={disabled}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
        >
          {showCustomInput ? 'Hide' : 'Set'} Custom DPI
        </button>
        
        {showCustomInput && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min={72}
              max={2400}
              step={1}
              value={customValue}
              onChange={(e) => handleCustomChange(e.target.value)}
              disabled={disabled}
              className={`
                flex-1 px-3 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              `}
              placeholder="Enter custom DPI (72-2400)"
            />
            <span className="text-sm text-gray-500">DPI</span>
          </div>
        )}
      </div>
      
      {/* DPI info panel */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Use case:</span>
            <span className="font-medium text-gray-900">
              {getDPIUseCase(value)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Print quality:</span>
            <span className="font-medium text-gray-900">
              {getDPIPrintQuality(value)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Size at 1 inch:</span>
            <span className="font-medium text-gray-900">
              {value} × {value} pixels
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact DPI selector (dropdown)
 */
export function DPISettingsCompact({
  value,
  onChange,
  disabled = false,
  className = '',
}: Omit<DPISettingsProps, 'format'>) {
  return (
    <div className={className}>
      <label htmlFor="dpi-setting" className="block text-sm font-medium text-gray-700 mb-1">
        DPI (Resolution)
      </label>
      
      <select
        id="dpi-setting"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
        `}
      >
        {DPI_PRESETS.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label} ({preset.value} DPI)
            {preset.recommended ? ' ⭐' : ''}
          </option>
        ))}
        <option value={value} disabled={DPI_PRESETS.some(p => p.value === value)}>
          Custom ({value} DPI)
        </option>
      </select>
    </div>
  );
}

/**
 * Get DPI use case description
 */
function getDPIUseCase(dpi: number): string {
  if (dpi <= 72) return 'Screen display';
  if (dpi <= 150) return 'Draft printing';
  if (dpi <= 300) return 'Professional printing';
  if (dpi <= 600) return 'High-quality printing';
  return 'Premium/commercial printing';
}

/**
 * Get DPI print quality rating
 */
function getDPIPrintQuality(dpi: number): string {
  if (dpi <= 72) return 'Not suitable for print';
  if (dpi <= 150) return 'Basic';
  if (dpi <= 300) return 'Excellent';
  if (dpi <= 600) return 'Superior';
  return 'Premium';
}

/**
 * Calculate pixel dimensions for physical size at given DPI
 */
export function calculatePixelDimensions(
  widthInches: number,
  heightInches: number,
  dpi: number
): { width: number; height: number } {
  return {
    width: Math.round(widthInches * dpi),
    height: Math.round(heightInches * dpi),
  };
}

/**
 * Calculate physical size from pixel dimensions at given DPI
 */
export function calculatePhysicalSize(
  widthPixels: number,
  heightPixels: number,
  dpi: number
): { widthInches: number; heightInches: number } {
  return {
    widthInches: widthPixels / dpi,
    heightInches: heightPixels / dpi,
  };
}

/**
 * Get recommended DPI for use case
 */
export function getRecommendedDPI(useCase: 'screen' | 'draft' | 'print' | 'premium'): number {
  switch (useCase) {
    case 'screen':
      return 72;
    case 'draft':
      return 150;
    case 'print':
      return 300;
    case 'premium':
      return 600;
  }
}
