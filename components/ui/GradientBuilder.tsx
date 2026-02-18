/**
 * GradientBuilder Component
 * 
 * Interactive gradient builder with live preview.
 * Supports linear and radial gradients with rotation control.
 */

'use client';

import React, { useMemo } from 'react';
import { ColorPicker } from './ColorPicker';

export type GradientType = 'linear' | 'radial';

export interface GradientConfig {
  type: GradientType;
  startColor: string;
  endColor: string;
  rotation?: number; // 0-360 degrees (linear only)
}

export interface GradientBuilderProps {
  value: GradientConfig;
  onChange: (gradient: GradientConfig) => void;
  label?: string;
  showPreview?: boolean;
  className?: string;
}

export function GradientBuilder({
  value,
  onChange,
  label,
  showPreview = true,
  className = '',
}: GradientBuilderProps) {
  // Generate CSS gradient for preview
  const gradientCSS = useMemo(() => {
    if (value.type === 'linear') {
      const angle = value.rotation ?? 0;
      return `linear-gradient(${angle}deg, ${value.startColor}, ${value.endColor})`;
    } else {
      return `radial-gradient(circle, ${value.startColor}, ${value.endColor})`;
    }
  }, [value]);

  // Generate SVG gradient for QR preview
  const generateSVGGradient = useMemo(() => {
    if (value.type === 'linear') {
      const angle = value.rotation ?? 0;
      const rad = (angle * Math.PI) / 180;
      const x1 = 50 - 50 * Math.cos(rad);
      const y1 = 50 - 50 * Math.sin(rad);
      const x2 = 50 + 50 * Math.cos(rad);
      const y2 = 50 + 50 * Math.sin(rad);

      return `<linearGradient id="preview-gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="${value.startColor}"/>
        <stop offset="100%" stop-color="${value.endColor}"/>
      </linearGradient>`;
    } else {
      return `<radialGradient id="preview-gradient">
        <stop offset="0%" stop-color="${value.startColor}"/>
        <stop offset="100%" stop-color="${value.endColor}"/>
      </radialGradient>`;
    }
  }, [value]);

  const handleTypeChange = (type: GradientType) => {
    onChange({ ...value, type });
  };

  const handleStartColorChange = (startColor: string) => {
    onChange({ ...value, startColor });
  };

  const handleEndColorChange = (endColor: string) => {
    onChange({ ...value, endColor });
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rotation = parseInt(e.target.value, 10);
    onChange({ ...value, rotation });
  };

  return (
    <div className={`gradient-builder ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>}

      {/* Gradient type selector */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('linear')}
            className={`flex-1 px-4 py-2 rounded-md transition ${
              value.type === 'linear'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Linear
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('radial')}
            className={`flex-1 px-4 py-2 rounded-md transition ${
              value.type === 'radial'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Radial
          </button>
        </div>
      </div>

      {/* Color pickers */}
      <div className="space-y-4 mb-4">
        <ColorPicker
          value={value.startColor}
          onChange={handleStartColorChange}
          label="Start Color"
        />

        <ColorPicker
          value={value.endColor}
          onChange={handleEndColorChange}
          label="End Color"
        />
      </div>

      {/* Rotation slider (linear only) */}
      {value.type === 'linear' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rotation: {value.rotation ?? 0}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={value.rotation ?? 0}
            onChange={handleRotationChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0°</span>
            <span>90°</span>
            <span>180°</span>
            <span>270°</span>
            <span>360°</span>
          </div>
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div
            className="w-full h-32 rounded-lg border-2 border-gray-300"
            style={{ background: gradientCSS }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Quick gradient presets
 */
export const GRADIENT_PRESETS: Array<{ name: string; config: GradientConfig }> = [
  {
    name: 'Sunset',
    config: { type: 'linear', startColor: '#FF512F', endColor: '#F09819', rotation: 45 },
  },
  {
    name: 'Ocean',
    config: { type: 'linear', startColor: '#2E3192', endColor: '#1BFFFF', rotation: 135 },
  },
  {
    name: 'Forest',
    config: { type: 'linear', startColor: '#134E5E', endColor: '#71B280', rotation: 90 },
  },
  {
    name: 'Purple Haze',
    config: { type: 'radial', startColor: '#A770EF', endColor: '#CF8BF3' },
  },
  {
    name: 'Fire',
    config: { type: 'radial', startColor: '#FF416C', endColor: '#FF4B2B' },
  },
  {
    name: 'Arctic',
    config: { type: 'linear', startColor: '#E0EAFC', endColor: '#CFDEF3', rotation: 180 },
  },
  {
    name: 'Candy',
    config: { type: 'linear', startColor: '#FF6FD8', endColor: '#3813C2', rotation: 45 },
  },
  {
    name: 'Mint',
    config: { type: 'radial', startColor: '#00F260', endColor: '#0575E6' },
  },
];

/**
 * Gradient preset selector
 */
export function GradientPresetPicker({
  onChange,
  className = '',
}: {
  onChange: (gradient: GradientConfig) => void;
  className?: string;
}) {
  return (
    <div className={`gradient-preset-picker ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-3">Gradient Presets</label>

      <div className="grid grid-cols-2 gap-3">
        {GRADIENT_PRESETS.map(preset => {
          const gradientCSS =
            preset.config.type === 'linear'
              ? `linear-gradient(${preset.config.rotation ?? 0}deg, ${preset.config.startColor}, ${preset.config.endColor})`
              : `radial-gradient(circle, ${preset.config.startColor}, ${preset.config.endColor})`;

          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onChange(preset.config)}
              className="relative h-20 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-500 transition group"
              style={{ background: gradientCSS }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition">
                  {preset.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
