/**
 * SizePresets Component
 * 
 * Preset size options for QR code downloads.
 */

'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { PNG_SIZE_PRESETS } from '@/lib/utils/export-png';

export type SizePresetKey = keyof typeof PNG_SIZE_PRESETS;

export interface SizePresetsProps {
  selected: SizePresetKey;
  onSelect: (preset: SizePresetKey) => void;
  format?: 'svg' | 'png' | 'pdf' | 'eps';
  disabled?: boolean;
  className?: string;
}

const PRESET_INFO: Record<SizePresetKey, {
  label: string;
  description: string;
  useCase: string;
  recommended?: boolean;
}> = {
  thumbnail: {
    label: 'Thumbnail',
    description: '256 × 256 px',
    useCase: 'Website thumbnails, small icons',
  },
  small: {
    label: 'Small',
    description: '512 × 512 px',
    useCase: 'Social media avatars, email signatures',
  },
  medium: {
    label: 'Medium',
    description: '1024 × 1024 px',
    useCase: 'Website displays, presentations',
    recommended: true,
  },
  large: {
    label: 'Large',
    description: '2048 × 2048 px',
    useCase: 'Posters, banners, large screens',
  },
  xlarge: {
    label: 'Extra Large',
    description: '4096 × 4096 px',
    useCase: 'Billboards, very large prints',
  },
  print: {
    label: 'Print Quality',
    description: '3000 × 3000 px',
    useCase: 'Professional printing, business cards',
  },
};

export function SizePresets({
  selected,
  onSelect,
  format = 'png',
  disabled = false,
  className = '',
}: SizePresetsProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        Size Preset
      </label>
      
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(PNG_SIZE_PRESETS) as SizePresetKey[]).map((preset) => {
          const info = PRESET_INFO[preset];
          const isSelected = selected === preset;
          
          return (
            <button
              key={preset}
              onClick={() => onSelect(preset)}
              disabled={disabled}
              className={`
                relative p-3 rounded-lg border-2 transition-all text-left
                ${isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              
              {/* Preset info */}
              <div className="pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                    {info.label}
                  </span>
                  {info.recommended && (
                    <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {info.description}
                </div>
                <div className="text-xs text-gray-400">
                  {info.useCase}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact size preset selector (dropdown style)
 */
export function SizePresetsCompact({
  selected,
  onSelect,
  disabled = false,
  className = '',
}: Omit<SizePresetsProps, 'format'>) {
  return (
    <div className={className}>
      <label htmlFor="size-preset" className="block text-sm font-medium text-gray-700 mb-1">
        Size Preset
      </label>
      
      <select
        id="size-preset"
        value={selected}
        onChange={(e) => onSelect(e.target.value as SizePresetKey)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
        `}
      >
        {(Object.keys(PNG_SIZE_PRESETS) as SizePresetKey[]).map((preset) => {
          const info = PRESET_INFO[preset];
          return (
            <option key={preset} value={preset}>
              {info.label} - {info.description}
              {info.recommended ? ' ⭐' : ''}
            </option>
          );
        })}
      </select>
      
      {/* Use case hint */}
      <p className="mt-1 text-xs text-gray-500">
        {PRESET_INFO[selected].useCase}
      </p>
    </div>
  );
}

/**
 * Size preset with visual preview
 */
export function SizePresetsWithPreview({
  selected,
  onSelect,
  disabled = false,
  className = '',
}: Omit<SizePresetsProps, 'format'>) {
  const selectedSize = PNG_SIZE_PRESETS[selected];
  
  return (
    <div className={className}>
      <SizePresets
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
      />
      
      {/* Visual preview */}
      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Preview Size</span>
          <span className="text-xs text-gray-500">
            {selectedSize.width} × {selectedSize.height} px
          </span>
        </div>
        
        {/* Visual scale representation */}
        <div className="relative h-32 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden">
          <div
            className="bg-blue-100 border-2 border-blue-500 rounded transition-all"
            style={{
              width: `${Math.min(100, (selectedSize.width / 4096) * 100)}%`,
              height: `${Math.min(100, (selectedSize.height / 4096) * 100)}%`,
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700">
                {selectedSize.width}px
              </span>
            </div>
          </div>
        </div>
        
        {/* File size estimate */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          Estimated file size: {estimateFileSize(selectedSize.width, selectedSize.height)}
        </div>
      </div>
    </div>
  );
}

/**
 * Estimate file size for PNG
 */
function estimateFileSize(width: number, height: number): string {
  // PNG file size rough estimate: pixels * 4 bytes (RGBA) with compression (~0.3 ratio)
  const pixels = width * height;
  const bytesUncompressed = pixels * 4;
  const bytesCompressed = bytesUncompressed * 0.3; // Typical PNG compression
  
  if (bytesCompressed < 1024) {
    return `${Math.round(bytesCompressed)} B`;
  } else if (bytesCompressed < 1024 * 1024) {
    return `${Math.round(bytesCompressed / 1024)} KB`;
  } else {
    return `${(bytesCompressed / (1024 * 1024)).toFixed(1)} MB`;
  }
}
