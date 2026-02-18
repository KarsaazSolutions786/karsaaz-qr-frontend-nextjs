/**
 * QualitySlider Component
 * 
 * Quality control slider for export options.
 */

'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

export interface QualitySliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: 'svg' | 'png' | 'pdf' | 'eps';
  showPercentage?: boolean;
  showPresets?: boolean;
  disabled?: boolean;
  className?: string;
}

interface QualityPreset {
  value: number;
  label: string;
  description: string;
}

const QUALITY_PRESETS: QualityPreset[] = [
  {
    value: 0.5,
    label: 'Low',
    description: 'Smaller file size, acceptable quality',
  },
  {
    value: 0.75,
    label: 'Medium',
    description: 'Balanced file size and quality',
  },
  {
    value: 0.9,
    label: 'High',
    description: 'Great quality, larger file size',
  },
  {
    value: 1.0,
    label: 'Maximum',
    description: 'Best quality, largest file size',
  },
];

export function QualitySlider({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  format = 'png',
  showPercentage = true,
  showPresets = true,
  disabled = false,
  className = '',
}: QualitySliderProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const percentage = Math.round(value * 100);
  
  // Get quality description
  const getQualityLabel = (val: number): string => {
    if (val >= 0.95) return 'Maximum';
    if (val >= 0.85) return 'High';
    if (val >= 0.65) return 'Medium';
    if (val >= 0.4) return 'Low';
    return 'Very Low';
  };
  
  // Get color based on quality
  const getQualityColor = (val: number): string => {
    if (val >= 0.85) return 'text-green-600';
    if (val >= 0.65) return 'text-blue-600';
    if (val >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Handle preset click
  const handlePresetClick = (presetValue: number) => {
    onChange(presetValue);
  };
  
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Quality
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
              <div className="absolute left-0 top-6 z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                <p className="mb-1 font-medium">Quality Settings</p>
                <p className="text-gray-300">
                  Higher quality results in better image clarity but larger file sizes.
                  For {format.toUpperCase()}, this affects compression and detail retention.
                </p>
                <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            )}
          </div>
        </div>
        
        {/* Quality indicator */}
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getQualityColor(value)}`}>
            {getQualityLabel(value)}
          </span>
          {showPercentage && (
            <span className="text-sm text-gray-500">
              ({percentage}%)
            </span>
          )}
        </div>
      </div>
      
      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className={`
            w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-blue-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:bg-blue-600
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-blue-500
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:hover:bg-blue-600
          `}
        />
        
        {/* Progress fill */}
        <div
          className="absolute top-0 h-2 bg-blue-500 rounded-lg pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Quality presets */}
      {showPresets && (
        <div className="grid grid-cols-4 gap-2">
          {QUALITY_PRESETS.map((preset) => {
            const isSelected = Math.abs(value - preset.value) < 0.01;
            
            return (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                disabled={disabled}
                className={`
                  px-3 py-2 rounded-lg border transition-all text-xs font-medium
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                title={preset.description}
              >
                {preset.label}
                <div className="text-gray-500 font-normal mt-0.5">
                  {Math.round(preset.value * 100)}%
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Compact quality slider (no presets)
 */
export function QualitySliderCompact({
  value,
  onChange,
  disabled = false,
  className = '',
}: Omit<QualitySliderProps, 'showPresets' | 'showPercentage'>) {
  return (
    <QualitySlider
      value={value}
      onChange={onChange}
      disabled={disabled}
      showPresets={false}
      showPercentage={true}
      className={className}
    />
  );
}

/**
 * Quality slider with file size estimate
 */
export function QualitySliderWithEstimate({
  value,
  onChange,
  baseFileSize,
  disabled = false,
  className = '',
}: QualitySliderProps & { baseFileSize: number }) {
  // Estimate file size based on quality
  // Lower quality = better compression = smaller size
  const compressionFactor = 1 - (value * 0.5); // 50% reduction at max quality
  const estimatedSize = baseFileSize * (1 - compressionFactor);
  
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${Math.round(bytes)} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className={className}>
      <QualitySlider
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      
      {/* File size estimate */}
      <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Estimated file size:</span>
          <span className="font-medium text-gray-900">
            {formatSize(estimatedSize)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Get quality recommendation based on use case
 */
export function getQualityRecommendation(useCase: 'web' | 'print' | 'share' | 'archive'): {
  quality: number;
  reason: string;
} {
  switch (useCase) {
    case 'web':
      return {
        quality: 0.75,
        reason: 'Balanced quality and file size for web delivery',
      };
    case 'print':
      return {
        quality: 1.0,
        reason: 'Maximum quality for professional printing',
      };
    case 'share':
      return {
        quality: 0.65,
        reason: 'Optimized for sharing with good quality',
      };
    case 'archive':
      return {
        quality: 0.9,
        reason: 'High quality for long-term storage',
      };
  }
}
