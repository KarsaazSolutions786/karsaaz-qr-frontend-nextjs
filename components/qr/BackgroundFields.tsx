/**
 * BackgroundFields Component
 * 
 * Complete background configuration UI.
 * Supports transparent, solid, gradient, and image backgrounds.
 */

'use client';

import React from 'react';
import { BackgroundConfig } from '@/types/entities/designer';
import { BackgroundColorPicker, BackgroundPresetPicker } from './BackgroundColorPicker';
import { BackgroundImageUpload } from './BackgroundImageUpload';
import { GradientBuilder, GradientPresetPicker } from '../ui/GradientBuilder';
import {
  createTransparentBackground,
  createSolidBackground,
  createGradientBackground,
  createImageBackground,
  isSolidBackground,
  isGradientBackground,
  isImageBackground,
  isTransparentBackground,
} from '@/lib/utils/background-utils';

export interface BackgroundFieldsProps {
  value: BackgroundConfig;
  onChange: (bg: BackgroundConfig) => void;
  label?: string;
  showTypeSelector?: boolean;
  className?: string;
}

export function BackgroundFields({
  value,
  onChange,
  label = 'Background',
  showTypeSelector = true,
  className = '',
}: BackgroundFieldsProps) {
  // Handle type change
  const handleTypeChange = (type: 'transparent' | 'solid' | 'gradient' | 'image') => {
    if (type === 'transparent') {
      onChange(createTransparentBackground());
    } else if (type === 'solid') {
      onChange(createSolidBackground('#FFFFFF'));
    } else if (type === 'gradient') {
      onChange(createGradientBackground('#FFFFFF', '#000000', 'linear'));
    } else {
      onChange(createImageBackground('', 1));
    }
  };

  // Handle solid color change
  const handleSolidColorChange = (color: string | null) => {
    if (color === null) {
      onChange(createTransparentBackground());
    } else {
      onChange(createSolidBackground(color));
    }
  };

  // Handle gradient change
  const handleGradientChange = (gradient: {
    type: 'linear' | 'radial';
    startColor: string;
    endColor: string;
  }) => {
    onChange(createGradientBackground(gradient.startColor, gradient.endColor, gradient.type));
  };

  // Handle image change
  const handleImageChange = (url: string | null) => {
    if (url === null) {
      onChange(createTransparentBackground());
    } else {
      const opacity = isImageBackground(value) ? value.imageOpacity ?? 1 : 1;
      onChange(createImageBackground(url, opacity));
    }
  };

  const handleImageOpacityChange = (opacity: number) => {
    if (isImageBackground(value) && value.imageUrl) {
      onChange(createImageBackground(value.imageUrl, opacity));
    }
  };

  return (
    <div className={`background-fields ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>}

      {/* Background type selector */}
      {showTypeSelector && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('transparent')}
              className={`px-4 py-2 rounded-md transition text-sm ${
                isTransparentBackground(value)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Transparent
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('solid')}
              className={`px-4 py-2 rounded-md transition text-sm ${
                isSolidBackground(value)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Solid Color
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('gradient')}
              className={`px-4 py-2 rounded-md transition text-sm ${
                isGradientBackground(value)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Gradient
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('image')}
              className={`px-4 py-2 rounded-md transition text-sm ${
                isImageBackground(value)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Image
            </button>
          </div>
        </div>
      )}

      {/* Transparent background */}
      {isTransparentBackground(value) && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg bg-white relative overflow-hidden">
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
            <p className="text-xs text-gray-500 mt-1">No background will be rendered</p>
          </div>
        </div>
      )}

      {/* Solid color background */}
      {isSolidBackground(value) && (
        <div className="space-y-4">
          <BackgroundColorPicker
            value={value.color || null}
            onChange={handleSolidColorChange}
            showTransparent={false}
          />

          <BackgroundPresetPicker onChange={handleSolidColorChange} />
        </div>
      )}

      {/* Gradient background */}
      {isGradientBackground(value) && (
        <div className="space-y-4">
          <GradientBuilder
            value={{
              type: value.gradientType || 'linear',
              startColor: value.gradientStart || '#FFFFFF',
              endColor: value.gradientEnd || '#000000',
            }}
            onChange={handleGradientChange}
            showPreview
          />

          <GradientPresetPicker onChange={handleGradientChange} />
        </div>
      )}

      {/* Image background */}
      {isImageBackground(value) && (
        <BackgroundImageUpload
          imageUrl={value.imageUrl || null}
          opacity={value.imageOpacity ?? 1}
          onImageChange={handleImageChange}
          onOpacityChange={handleImageOpacityChange}
        />
      )}

      {/* Background tips */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Background Tips</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Transparent backgrounds work best for digital displays</li>
          <li>White or light backgrounds improve print quality</li>
          <li>High contrast with foreground improves scannability</li>
          <li>Gradients can reduce scan reliability - test thoroughly</li>
          <li>Image backgrounds should have low opacity (20-40%)</li>
          <li>Avoid busy patterns that interfere with QR modules</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Simple background toggle (enable/disable with default)
 */
export function BackgroundToggle({
  enabled,
  onToggle,
  className = '',
}: {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}) {
  return (
    <div className={`background-toggle ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Background</label>
          <p className="text-xs text-gray-500 mt-1">
            {enabled ? 'Background enabled' : 'Transparent background'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
            enabled ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
