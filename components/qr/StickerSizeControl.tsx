/**
 * StickerSizeControl Component
 * 
 * Controls for sticker size, rotation, and opacity.
 */

'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';

export interface StickerSizeControlProps {
  size: number; // 0-1 (percentage)
  rotation?: number; // 0-360 degrees
  opacity?: number; // 0-1
  onSizeChange: (size: number) => void;
  onRotationChange?: (rotation: number) => void;
  onOpacityChange?: (opacity: number) => void;
  qrSize?: number; // For pixel size display
  showRotation?: boolean;
  showOpacity?: boolean;
  className?: string;
}

/**
 * Purpose: Executes StickerSizeControl functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function StickerSizeControl({
  size,
  rotation = 0,
  opacity = 1.0,
  onSizeChange,
  onRotationChange,
  onOpacityChange,
  qrSize = 300,
  showRotation = true,
  showOpacity = true,
  className = '',
}: StickerSizeControlProps) {
  const { t } = useTranslation();
  const pixelSize = Math.round(qrSize * size);

  return (
    <div className={`sticker-size-control ${className}`}>
      {/* Size slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">{t('Sticker Size')}</label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{Math.round(size * 100)}%</span>
            <span className="text-xs text-gray-500">({pixelSize}px)</span>
          </div>
        </div>
        <input
          type="range"
          min="0.05"
          max="0.5"
          step="0.01"
          value={size}
          onChange={(e) => onSizeChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5% ({t('Small')})</span>
          <span>20% ({t('Default')})</span>
          <span>50% ({t('Large')})</span>
        </div>
      </div>

      {/* Rotation slider */}
      {showRotation && onRotationChange && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">{t('Rotation')}</label>
            <span className="text-sm font-medium text-gray-900">{Math.round(rotation)}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={(e) => onRotationChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0°</span>
            <span>90°</span>
            <span>180°</span>
            <span>270°</span>
            <span>360°</span>
          </div>
          
          {/* Quick rotation buttons */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => onRotationChange(0)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
            >
              0°
            </button>
            <button
              type="button"
              onClick={() => onRotationChange(90)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
            >
              90°
            </button>
            <button
              type="button"
              onClick={() => onRotationChange(180)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
            >
              180°
            </button>
            <button
              type="button"
              onClick={() => onRotationChange(270)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
            >
              270°
            </button>
          </div>
        </div>
      )}

      {/* Opacity slider */}
      {showOpacity && onOpacityChange && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">{t('Opacity')}</label>
            <span className="text-sm font-medium text-gray-900">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10% ({t('Transparent')})</span>
            <span>50%</span>
            <span>100% ({t('Opaque')})</span>
          </div>
        </div>
      )}

      {/* Visual indicator */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600 mb-2">{t('Preview Transform')}</p>
        <div className="flex items-center justify-center h-24 bg-white rounded border border-gray-300">
          <div
            className="bg-primary-600 rounded flex items-center justify-center text-white font-bold transition-all"
            style={{
              width: `${size * 80}px`,
              height: `${size * 80}px`,
              transform: `rotate(${rotation}deg)`,
              opacity: opacity,
            }}
          >
            📌
          </div>
        </div>
      </div>

      {/* Size recommendations */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs font-medium text-blue-900 mb-1">{t('Recommendations')}</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>{t('Default size (20%) works well for most stickers')}</li>
          <li>{t('Keep stickers under 30% for better scannability')}</li>
          <li>{t('Use rotation sparingly to maintain readability')}</li>
          <li>{t('Full opacity (100%) recommended for best visibility')}</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Compact size control (single slider)
 */
export interface StickerSizeControlCompactProps {
  size: number;
  onSizeChange: (size: number) => void;
  label?: string;
  className?: string;
}

/**
 * Purpose: Executes StickerSizeControlCompact functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function StickerSizeControlCompact({
  size,
  onSizeChange,
  label = 'Size',
  className = '',
}: StickerSizeControlCompactProps) {
  const { t } = useTranslation();
  return (
    <div className={`sticker-size-control-compact ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{t(label)}</label>
        <span className="text-sm font-medium text-gray-900">{Math.round(size * 100)}%</span>
      </div>
      <input
        type="range"
        min="0.05"
        max="0.5"
        step="0.01"
        value={size}
        onChange={(e) => onSizeChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
      />
    </div>
  );
}

/**
 * Advanced size control with presets
 */
export interface StickerSizeControlAdvancedProps extends StickerSizeControlProps {
  presets?: Array<{ label: string; size: number; rotation?: number; opacity?: number }>;
}

/**
 * Purpose: Executes StickerSizeControlAdvanced functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function StickerSizeControlAdvanced({
  size,
  rotation = 0,
  opacity = 1.0,
  onSizeChange,
  onRotationChange,
  onOpacityChange,
  presets = [
    { label: 'Small', size: 0.1, rotation: 0, opacity: 1.0 },
    { label: 'Medium', size: 0.2, rotation: 0, opacity: 1.0 },
    { label: 'Large', size: 0.35, rotation: 0, opacity: 1.0 },
  ],
  ...props
}: StickerSizeControlAdvancedProps) {
  const { t } = useTranslation();
  /**
   * Purpose: Executes handlePresetClick functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handlePresetClick = (preset: typeof presets[0]) => {
    onSizeChange(preset.size);
    if (preset.rotation !== undefined && onRotationChange) {
      onRotationChange(preset.rotation);
    }
    if (preset.opacity !== undefined && onOpacityChange) {
      onOpacityChange(preset.opacity);
    }
  };

  return (
    <div className="sticker-size-control-advanced">
      {/* Presets */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Quick Presets')}</label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="px-3 py-2 text-sm font-medium border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              {t(preset.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Regular controls */}
      <StickerSizeControl
        size={size}
        rotation={rotation}
        opacity={opacity}
        onSizeChange={onSizeChange}
        onRotationChange={onRotationChange}
        onOpacityChange={onOpacityChange}
        {...props}
      />
    </div>
  );
}
