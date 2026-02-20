/**
 * LogoPositioning Component
 * 
 * Logo size, shape, border, and background controls.
 * Provides visual controls for logo customization.
 */

'use client';

import React from 'react';
import { ColorPicker } from '../ui/ColorPicker';

import { LogoConfig } from '@/types/entities/designer';

export interface LogoPositioningProps {
  value: LogoConfig;
  onChange: (config: LogoConfig) => void;
  maxSize?: number;
  maxMargin?: number;
  className?: string;
}

export function LogoPositioning({
  value,
  onChange,
  maxSize = 0.5,
  maxMargin = 0.3,
  className = '',
}: LogoPositioningProps) {
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseFloat(e.target.value);
    onChange({ ...value, size });
  };

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const margin = parseFloat(e.target.value);
    onChange({ ...value, margin });
  };

  const handleShapeChange = (shape: 'square' | 'circle') => {
    onChange({ ...value, shape });
  };

  const handleBackgroundColorChange = (backgroundColor: string) => {
    onChange({ ...value, backgroundColor });
  };

  const handleBorderColorChange = (borderColor: string) => {
    onChange({ ...value, borderColor });
  };

  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const borderWidth = parseFloat(e.target.value);
    onChange({ ...value, borderWidth });
  };

  const toggleBackground = () => {
    if (value.backgroundColor) {
      const { backgroundColor, ...rest } = value;
      onChange(rest);
    } else {
      onChange({ ...value, backgroundColor: '#FFFFFF' });
    }
  };

  const toggleBorder = () => {
    if (value.borderColor) {
      const { borderColor, borderWidth, ...rest } = value;
      onChange(rest);
    } else {
      onChange({ ...value, borderColor: '#000000', borderWidth: 2 });
    }
  };

  return (
    <div className={`logo-positioning ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-3">Logo Settings</label>

      {/* Size control */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Size: {Math.round(value.size * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max={maxSize}
          step="0.01"
          value={value.size}
          onChange={handleSizeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10%</span>
          <span>30%</span>
          <span>50%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Recommended: 20-30% for best balance
        </p>
      </div>

      {/* Margin control */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Margin: {Math.round(value.margin * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max={maxMargin}
          step="0.01"
          value={value.margin}
          onChange={handleMarginChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>15%</span>
          <span>30%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Extra clearance around logo for better scanability
        </p>
      </div>

      {/* Shape selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleShapeChange('square')}
            className={`flex-1 px-4 py-2 rounded-md transition ${
              value.shape === 'square'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Square
          </button>
          <button
            type="button"
            onClick={() => handleShapeChange('circle')}
            className={`flex-1 px-4 py-2 rounded-md transition ${
              value.shape === 'circle'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Circle
          </button>
        </div>
      </div>

      {/* Background color toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Background</label>
          <button
            type="button"
            onClick={toggleBackground}
            className={`px-3 py-1 text-xs rounded-md transition ${
              value.backgroundColor
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {value.backgroundColor ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {value.backgroundColor && (
          <ColorPicker
            value={value.backgroundColor}
            onChange={handleBackgroundColorChange}
            showPresets
          />
        )}
      </div>

      {/* Border toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Border</label>
          <button
            type="button"
            onClick={toggleBorder}
            className={`px-3 py-1 text-xs rounded-md transition ${
              value.borderColor
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {value.borderColor ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {value.borderColor && (
          <div className="space-y-3">
            <ColorPicker value={value.borderColor} onChange={handleBorderColorChange} showPresets />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Width: {value.borderWidth ?? 2}px
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={value.borderWidth ?? 2}
                onChange={handleBorderWidthChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Visual preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">Preview</label>
        <div className="flex items-center justify-center">
          <div
            className="relative bg-white border-2 border-gray-300"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '8px',
            }}
          >
            {/* Simulated logo */}
            <div
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${value.size * 200}px`,
                height: `${value.size * 200}px`,
                borderRadius: value.shape === 'circle' ? '50%' : '0',
                backgroundColor: value.backgroundColor || 'transparent',
                border: value.borderColor
                  ? `${value.borderWidth ?? 2}px solid ${value.borderColor}`
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {value.url && (
                <img
                  src={value.url}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Margin indicator */}
            {value.margin > 0 && (
              <div
                className="absolute border-2 border-dashed border-primary-400"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `${(value.size + value.margin * 2) * 200}px`,
                  height: `${(value.size + value.margin * 2) * 200}px`,
                  borderRadius: value.shape === 'circle' ? '50%' : '0',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          {value.margin > 0 && 'Dashed line shows clearance area'}
        </p>
      </div>
    </div>
  );
}
