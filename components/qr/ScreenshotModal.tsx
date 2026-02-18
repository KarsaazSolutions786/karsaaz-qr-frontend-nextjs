/**
 * ScreenshotModal Component
 * 
 * Advanced screenshot/export options with customization.
 */

'use client';

import React, { useState } from 'react';
import { X, Download, Camera } from 'lucide-react';
import { QRCode } from '@/types/entities/qrcode';

export type ScreenshotFormat = 'PNG' | 'JPG' | 'SVG' | 'PDF';
export type ScreenshotSize = 'small' | 'medium' | 'large' | 'custom';

export interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrcode: QRCode;
  onExport?: (options: ScreenshotOptions) => Promise<void>;
}

export interface ScreenshotOptions {
  format: ScreenshotFormat;
  size: ScreenshotSize;
  customWidth?: number;
  customHeight?: number;
  quality: number;
  dpi: number;
  includeBackground: boolean;
  watermark: boolean;
}

const SIZE_PRESETS = {
  small: { width: 512, height: 512, label: '512x512 (Social Media)' },
  medium: { width: 1024, height: 1024, label: '1024x1024 (Web)' },
  large: { width: 2048, height: 2048, label: '2048x2048 (Print)' },
  custom: { width: 1024, height: 1024, label: 'Custom Size' },
};

const DPI_PRESETS = [
  { value: 72, label: '72 DPI (Screen)' },
  { value: 150, label: '150 DPI (Standard)' },
  { value: 300, label: '300 DPI (Print)' },
  { value: 600, label: '600 DPI (High Quality)' },
];

export function ScreenshotModal({
  isOpen,
  onClose,
  qrcode,
  onExport,
}: ScreenshotModalProps) {
  const [format, setFormat] = useState<ScreenshotFormat>('PNG');
  const [size, setSize] = useState<ScreenshotSize>('medium');
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);
  const [quality, setQuality] = useState(90);
  const [dpi, setDpi] = useState(72);
  const [includeBackground, setIncludeBackground] = useState(true);
  const [watermark, setWatermark] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!onExport) return;

    setIsExporting(true);
    try {
      await onExport({
        format,
        size,
        customWidth: size === 'custom' ? customWidth : undefined,
        customHeight: size === 'custom' ? customHeight : undefined,
        quality,
        dpi,
        includeBackground,
        watermark,
      });
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const currentSize = size === 'custom' 
    ? { width: customWidth, height: customHeight }
    : SIZE_PRESETS[size];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Export QR Code</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preview
              </label>
              <div className={`aspect-square rounded-lg border-2 border-gray-200 ${includeBackground ? 'bg-white' : 'bg-transparent'} p-6 relative`}>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-sm font-medium">{qrcode.name}</div>
                    <div className="text-xs mt-1">
                      {currentSize.width} × {currentSize.height}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {format} • {dpi} DPI
                    </div>
                  </div>
                </div>
                {watermark && (
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    Karsaaz QR
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Options */}
            <div className="space-y-4">
              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['PNG', 'JPG', 'SVG', 'PDF'] as ScreenshotFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition ${
                        format === fmt
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as ScreenshotSize)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Size */}
              {size === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1024)}
                      min="100"
                      max="4096"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1024)}
                      min="100"
                      max="4096"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {/* Quality (for JPG/PNG) */}
              {(format === 'JPG' || format === 'PNG') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>
              )}

              {/* DPI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DPI/Resolution
                </label>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {DPI_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeBackground}
                    onChange={(e) => setIncludeBackground(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Include background</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={watermark}
                    onChange={(e) => setWatermark(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Add watermark</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {format}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
