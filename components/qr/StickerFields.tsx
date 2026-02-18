/**
 * StickerFields Component
 * 
 * Complete sticker configuration UI combining all sticker controls.
 */

'use client';

import React, { useState } from 'react';
import { StickerConfig, Sticker } from '@/types/entities/sticker';
import { StickerSelector } from './StickerSelector';
import { StickerPositioning } from './StickerPositioning';
import { StickerSizeControl } from './StickerSizeControl';
import { createDefaultStickerConfig, validateStickerConfig, checkStickerOverlap } from '@/lib/utils/sticker-utils';

export interface StickerFieldsProps {
  value: StickerConfig | null;
  onChange: (config: StickerConfig | null) => void;
  onUpload?: (file: File, name: string, category?: any) => Promise<Sticker>;
  onDelete?: (stickerId: string) => Promise<void>;
  fetchCustomStickers?: () => Promise<Sticker[]>;
  qrSize?: number;
  label?: string;
  className?: string;
}

export function StickerFields({
  value,
  onChange,
  onUpload,
  onDelete,
  fetchCustomStickers,
  qrSize = 300,
  label = 'Sticker',
  className = '',
}: StickerFieldsProps) {
  const [showSelector, setShowSelector] = useState(!value);

  // Handle sticker selection
  const handleStickerSelect = (sticker: Sticker) => {
    const newConfig = createDefaultStickerConfig(sticker.id, sticker.url);
    onChange(newConfig);
    setShowSelector(false);
  };

  // Handle position change
  const handlePositionChange = (position: StickerConfig['position']) => {
    if (!value) return;
    onChange({ ...value, position });
  };

  // Handle size change
  const handleSizeChange = (size: number) => {
    if (!value) return;
    onChange({ ...value, size });
  };

  // Handle rotation change
  const handleRotationChange = (rotation: number) => {
    if (!value) return;
    onChange({ ...value, rotation });
  };

  // Handle opacity change
  const handleOpacityChange = (opacity: number) => {
    if (!value) return;
    onChange({ ...value, opacity });
  };

  // Handle remove sticker
  const handleRemove = () => {
    onChange(null);
    setShowSelector(true);
  };

  // Validate configuration
  const validation = value ? validateStickerConfig(value) : { valid: true, errors: [] };
  const overlapCheck = value ? checkStickerOverlap(value.position, value.size, qrSize) : { hasOverlap: false, warnings: [] };

  return (
    <div className={`sticker-fields ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {value && !showSelector && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSelector(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Change Sticker
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Sticker selector */}
      {showSelector && (
        <div className="mb-4">
          <StickerSelector
            selectedStickerId={value?.id}
            onSelect={handleStickerSelect}
            onUpload={onUpload}
            onDelete={onDelete}
            fetchCustomStickers={fetchCustomStickers}
            showUpload={!!onUpload}
            columns={4}
          />
        </div>
      )}

      {/* Configuration UI */}
      {value && !showSelector && (
        <div className="space-y-4">
          {/* Current sticker preview */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-gray-300 rounded bg-white p-2 flex items-center justify-center flex-shrink-0">
                <img src={value.url} alt="Sticker" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Sticker #{value.id}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{value.url}</p>
              </div>
            </div>
          </div>

          {/* Position control */}
          <StickerPositioning
            position={value.position}
            onChange={handlePositionChange}
            qrSize={qrSize}
            stickerSize={value.size}
            showPreview={true}
          />

          {/* Size, rotation, opacity controls */}
          <StickerSizeControl
            size={value.size}
            rotation={value.rotation ?? 0}
            opacity={value.opacity ?? 1.0}
            onSizeChange={handleSizeChange}
            onRotationChange={handleRotationChange}
            onOpacityChange={handleOpacityChange}
            qrSize={qrSize}
            showRotation={true}
            showOpacity={true}
          />

          {/* Validation errors */}
          {!validation.valid && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-900 mb-1">⚠️ Validation Errors</p>
              <ul className="text-xs text-red-800 space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Overlap warnings */}
          {overlapCheck.hasOverlap && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-900 mb-1">⚠️ Position Warnings</p>
              <ul className="text-xs text-yellow-800 space-y-1">
                {overlapCheck.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
              <p className="text-xs text-yellow-700 mt-2">
                Sticker may overlap with QR code patterns. Consider repositioning for better scannability.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-900 mb-1">💡 Sticker Tips</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Position stickers away from QR code corners</li>
              <li>• Bottom center is the safest position</li>
              <li>• Keep stickers at 20-30% size for best results</li>
              <li>• Avoid rotating stickers with text</li>
              <li>• Use full opacity for clear visibility</li>
            </ul>
          </div>

          {/* Summary */}
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Configuration Summary</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">Size:</span> {Math.round(value.size * 100)}%
              </div>
              <div>
                <span className="font-medium">Position:</span> {value.position.preset}
              </div>
              <div>
                <span className="font-medium">Rotation:</span> {value.rotation ?? 0}°
              </div>
              <div>
                <span className="font-medium">Opacity:</span> {Math.round((value.opacity ?? 1.0) * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No sticker state */}
      {!value && !showSelector && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sticker added</h3>
          <p className="mt-1 text-xs text-gray-500">Add a sticker to decorate your QR code</p>
          <button
            type="button"
            onClick={() => setShowSelector(true)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
          >
            Add Sticker
          </button>
        </div>
      )}
    </div>
  );
}
