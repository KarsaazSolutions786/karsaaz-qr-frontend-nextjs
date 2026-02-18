/**
 * FillTypeFields Component
 * 
 * Dynamic form fields for fill configuration.
 * Renders different UI based on fill type (solid, gradient, image).
 */

'use client';

import React from 'react';
import { FillConfig } from '@/types/entities/designer';
import { ColorPicker } from './ColorPicker';
import { GradientBuilder, GradientPresetPicker } from './GradientBuilder';
import {
  createSolidFill,
  createGradientFill,
  createImageFill,
  isSolidFill,
  isGradientFill,
  isImageFill,
} from '@/lib/utils/fill-handlers';

export interface FillTypeFieldsProps {
  value: FillConfig;
  onChange: (fill: FillConfig) => void;
  label?: string;
  showTypeSelector?: boolean;
  showPreview?: boolean;
  className?: string;
}

export function FillTypeFields({
  value,
  onChange,
  label,
  showTypeSelector = true,
  showPreview = true,
  className = '',
}: FillTypeFieldsProps) {
  // Handle fill type change
  const handleTypeChange = (type: 'solid' | 'gradient' | 'image') => {
    if (type === 'solid') {
      onChange(createSolidFill('#000000'));
    } else if (type === 'gradient') {
      onChange(createGradientFill('#000000', '#FFFFFF', 'linear', 0));
    } else {
      onChange(createImageFill('', 1));
    }
  };

  // Handle solid color change
  const handleSolidColorChange = (color: string) => {
    onChange(createSolidFill(color));
  };

  // Handle gradient change
  const handleGradientChange = (gradient: {
    type: 'linear' | 'radial';
    startColor: string;
    endColor: string;
    rotation?: number;
  }) => {
    onChange(createGradientFill(gradient.startColor, gradient.endColor, gradient.type, gradient.rotation ?? 0));
  };

  // Handle image change
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isImageFill(value)) {
      onChange(createImageFill(e.target.value, value.opacity));
    }
  };

  const handleImageOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isImageFill(value)) {
      onChange(createImageFill(value.imageUrl, parseFloat(e.target.value)));
    }
  };

  return (
    <div className={`fill-type-fields ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>}

      {/* Fill type selector */}
      {showTypeSelector && (
        <div className="mb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('solid')}
              className={`flex-1 px-4 py-2 rounded-md transition ${
                isSolidFill(value)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Solid
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('gradient')}
              className={`flex-1 px-4 py-2 rounded-md transition ${
                isGradientFill(value)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Gradient
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('image')}
              className={`flex-1 px-4 py-2 rounded-md transition ${
                isImageFill(value)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Image
            </button>
          </div>
        </div>
      )}

      {/* Solid fill fields */}
      {isSolidFill(value) && (
        <div>
          <ColorPicker value={value.color} onChange={handleSolidColorChange} showPresets />
        </div>
      )}

      {/* Gradient fill fields */}
      {isGradientFill(value) && (
        <div className="space-y-4">
          <GradientBuilder
            value={{
              type: value.gradientType,
              startColor: value.startColor,
              endColor: value.endColor,
              rotation: value.rotation,
            }}
            onChange={handleGradientChange}
            showPreview={showPreview}
          />

          <GradientPresetPicker onChange={handleGradientChange} />
        </div>
      )}

      {/* Image fill fields */}
      {isImageFill(value) && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={value.imageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">Enter a URL to an image file</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacity: {Math.round((value.opacity ?? 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={value.opacity ?? 1}
              onChange={handleImageOpacityChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {showPreview && value.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="w-full h-32 rounded-lg border-2 border-gray-300 overflow-hidden">
                <img
                  src={value.imageUrl}
                  alt="Fill preview"
                  className="w-full h-full object-cover"
                  style={{ opacity: value.opacity ?? 1 }}
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Simplified fill selector (just type buttons with current value preview)
 */
export function SimpleFillSelector({
  value,
  onChange,
  label,
  className = '',
}: {
  value: FillConfig;
  onChange: (fill: FillConfig) => void;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`simple-fill-selector ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      <div className="flex items-center gap-3">
        {/* Current fill preview */}
        <div className="w-12 h-12 rounded-md border-2 border-gray-300">
          {isSolidFill(value) && (
            <div className="w-full h-full rounded" style={{ backgroundColor: value.color }} />
          )}
          {isGradientFill(value) && (
            <div
              className="w-full h-full rounded"
              style={{
                background:
                  value.gradientType === 'linear'
                    ? `linear-gradient(${value.rotation ?? 0}deg, ${value.startColor}, ${value.endColor})`
                    : `radial-gradient(circle, ${value.startColor}, ${value.endColor})`,
              }}
            />
          )}
          {isImageFill(value) && value.imageUrl && (
            <img src={value.imageUrl} alt="Fill" className="w-full h-full object-cover rounded" />
          )}
        </div>

        {/* Fill type indicator */}
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">
            {isSolidFill(value) && `Solid: ${value.color}`}
            {isGradientFill(value) && `${value.gradientType === 'linear' ? 'Linear' : 'Radial'} Gradient`}
            {isImageFill(value) && 'Image Fill'}
          </div>
          {isGradientFill(value) && (
            <div className="text-xs text-gray-500">
              {value.startColor} → {value.endColor}
            </div>
          )}
        </div>

        {/* Edit button */}
        <button
          type="button"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition text-sm font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
