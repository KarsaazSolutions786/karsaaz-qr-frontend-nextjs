/**
 * StickerPositioning Component
 * 
 * Visual controls for positioning stickers on QR codes.
 */

'use client';

import React, { useState, useCallback } from 'react';
import { StickerPosition, StickerPositionPreset, POSITION_PRESETS } from '@/types/entities/sticker';
import { calculateStickerPosition } from '@/lib/utils/sticker-utils';

export interface StickerPositioningProps {
  position: StickerPosition;
  onChange: (position: StickerPosition) => void;
  qrSize?: number;
  stickerSize?: number;
  showPreview?: boolean;
  className?: string;
}

export function StickerPositioning({
  position,
  onChange,
  qrSize = 300,
  stickerSize = 0.2,
  showPreview = true,
  className = '',
}: StickerPositioningProps) {
  const [showCustom, setShowCustom] = useState(position.preset === 'custom');

  // Handle preset selection
  const handlePresetSelect = (preset: StickerPositionPreset) => {
    if (preset === 'custom') {
      setShowCustom(true);
      onChange({
        preset: 'custom',
        x: position.x ?? 0.5,
        y: position.y ?? 1,
      });
    } else {
      setShowCustom(false);
      onChange({
        preset,
      });
    }
  };

  // Handle custom position change
  const handleCustomChange = (axis: 'x' | 'y', value: number) => {
    onChange({
      preset: 'custom',
      x: axis === 'x' ? value : (position.x ?? 0.5),
      y: axis === 'y' ? value : (position.y ?? 1),
    });
  };

  // Get current position coordinates
  const currentCoords = position.preset === 'custom' && position.x !== undefined && position.y !== undefined
    ? { x: position.x, y: position.y }
    : POSITION_PRESETS[position.preset];

  return (
    <div className={`sticker-positioning ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-3">Sticker Position</label>

      {/* Preset selector */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2">
          {/* Top row */}
          <PositionButton
            preset="top-left"
            label="Top Left"
            icon="↖"
            isSelected={position.preset === 'top-left'}
            onClick={() => handlePresetSelect('top-left')}
          />
          <PositionButton
            preset="top"
            label="Top"
            icon="↑"
            isSelected={position.preset === 'top'}
            onClick={() => handlePresetSelect('top')}
          />
          <PositionButton
            preset="top-right"
            label="Top Right"
            icon="↗"
            isSelected={position.preset === 'top-right'}
            onClick={() => handlePresetSelect('top-right')}
          />

          {/* Middle row */}
          <PositionButton
            preset="left"
            label="Left"
            icon="←"
            isSelected={position.preset === 'left'}
            onClick={() => handlePresetSelect('left')}
          />
          <PositionButton
            preset="custom"
            label="Custom"
            icon="⊕"
            isSelected={position.preset === 'custom'}
            onClick={() => handlePresetSelect('custom')}
          />
          <PositionButton
            preset="right"
            label="Right"
            icon="→"
            isSelected={position.preset === 'right'}
            onClick={() => handlePresetSelect('right')}
          />

          {/* Bottom row */}
          <PositionButton
            preset="bottom-left"
            label="Bottom Left"
            icon="↙"
            isSelected={position.preset === 'bottom-left'}
            onClick={() => handlePresetSelect('bottom-left')}
          />
          <PositionButton
            preset="bottom"
            label="Bottom"
            icon="↓"
            isSelected={position.preset === 'bottom'}
            onClick={() => handlePresetSelect('bottom')}
          />
          <PositionButton
            preset="bottom-right"
            label="Bottom Right"
            icon="↘"
            isSelected={position.preset === 'bottom-right'}
            onClick={() => handlePresetSelect('bottom-right')}
          />
        </div>
      </div>

      {/* Custom position sliders */}
      {showCustom && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">Custom Position</p>
          
          {/* X position */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">Horizontal</label>
              <span className="text-xs font-medium text-gray-900">
                {Math.round((position.x ?? 0.5) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={position.x ?? 0.5}
              onChange={(e) => handleCustomChange('x', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Left</span>
              <span>Center</span>
              <span>Right</span>
            </div>
          </div>

          {/* Y position */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">Vertical</label>
              <span className="text-xs font-medium text-gray-900">
                {Math.round((position.y ?? 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={position.y ?? 1}
              onChange={(e) => handleCustomChange('y', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Top</span>
              <span>Middle</span>
              <span>Bottom</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual preview */}
      {showPreview && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Preview</p>
          <div className="relative w-full aspect-square bg-white border border-gray-300 rounded-lg overflow-hidden">
            {/* QR code representation */}
            <div className="absolute inset-2 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <span className="text-xs text-gray-400">QR Code</span>
            </div>

            {/* Sticker position indicator */}
            <div
              className="absolute w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
              style={{
                left: `${currentCoords.x * 100}%`,
                top: `${currentCoords.y * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              📌
            </div>
          </div>
        </div>
      )}

      {/* Current coordinates */}
      <div className="text-xs text-gray-500">
        Current position: X: {Math.round(currentCoords.x * 100)}%, Y: {Math.round(currentCoords.y * 100)}%
      </div>
    </div>
  );
}

/**
 * Position button component
 */
interface PositionButtonProps {
  preset: StickerPositionPreset;
  label: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

function PositionButton({ preset, label, icon, isSelected, onClick }: PositionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`aspect-square rounded-lg border-2 transition flex flex-col items-center justify-center gap-1 ${
        isSelected
          ? 'border-primary-500 bg-primary-50 text-primary-700'
          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
      }`}
      title={label}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium">{label.split(' ')[0]}</span>
    </button>
  );
}

/**
 * Compact sticker positioning (dropdown style)
 */
export interface StickerPositioningCompactProps {
  position: StickerPosition;
  onChange: (position: StickerPosition) => void;
  className?: string;
}

export function StickerPositioningCompact({
  position,
  onChange,
  className = '',
}: StickerPositioningCompactProps) {
  const presets: Array<{ value: StickerPositionPreset; label: string; icon: string }> = [
    { value: 'top-left', label: 'Top Left', icon: '↖' },
    { value: 'top', label: 'Top Center', icon: '↑' },
    { value: 'top-right', label: 'Top Right', icon: '↗' },
    { value: 'left', label: 'Left', icon: '←' },
    { value: 'right', label: 'Right', icon: '→' },
    { value: 'bottom-left', label: 'Bottom Left', icon: '↙' },
    { value: 'bottom', label: 'Bottom Center', icon: '↓' },
    { value: 'bottom-right', label: 'Bottom Right', icon: '↘' },
    { value: 'custom', label: 'Custom', icon: '⊕' },
  ];

  const selectedPreset = presets.find((p) => p.value === position.preset);

  return (
    <div className={`sticker-positioning-compact ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
      <div className="relative">
        <select
          value={position.preset}
          onChange={(e) => onChange({ preset: e.target.value as StickerPositionPreset })}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
        >
          {presets.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.icon} {preset.label}
            </option>
          ))}
        </select>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
          {selectedPreset?.icon}
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
