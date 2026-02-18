/**
 * DownloadModal Component
 * 
 * Modal for downloading QR codes in multiple formats with options.
 */

'use client';

import React, { useState } from 'react';
import { exportSVG } from '@/lib/utils/export-svg';
import { exportPDF, PDFPageSize, PDFOrientation } from '@/lib/utils/export-pdf';
import { exportEPS } from '@/lib/utils/export-eps';
import { exportPNG, PNG_SIZE_PRESETS } from '@/lib/utils/export-png';

export type DownloadFormat = 'svg' | 'pdf' | 'eps' | 'png';

export interface DownloadModalProps {
  svg: string;
  defaultFilename?: string;
  isOpen: boolean;
  onClose: () => void;
  onDownloadComplete?: (format: DownloadFormat) => void;
}

export function DownloadModal({
  svg,
  defaultFilename = 'qr-code',
  isOpen,
  onClose,
  onDownloadComplete,
}: DownloadModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('png');
  const [filename, setFilename] = useState(defaultFilename);
  const [isDownloading, setIsDownloading] = useState(false);

  // PNG options
  const [pngSize, setPNGSize] = useState<keyof typeof PNG_SIZE_PRESETS>('medium');
  const [pngBackground, setPNGBackground] = useState<string>('');

  // PDF options
  const [pdfPageSize, setPDFPageSize] = useState<PDFPageSize>('a4');
  const [pdfOrientation, setPDFOrientation] = useState<PDFOrientation>('portrait');
  const [pdfMargin, setPDFMargin] = useState(10);

  // SVG options
  const [svgOptimized, setSVGOptimized] = useState(false);
  const [svgBackground, setSVGBackground] = useState(false);

  // EPS options
  const [epsWidth, setEPSWidth] = useState(300);
  const [epsHeight, setEPSHeight] = useState(300);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const fileExt = selectedFormat;
      const fullFilename = `${filename}.${fileExt}`;

      switch (selectedFormat) {
        case 'svg':
          await exportSVG(svg, {
            filename: fullFilename,
            optimized: svgOptimized,
            addBackgroundRect: svgBackground,
            backgroundColor: '#ffffff',
          });
          break;

        case 'pdf':
          await exportPDF(svg, {
            filename: fullFilename,
            pageSize: pdfPageSize,
            orientation: pdfOrientation,
            margin: pdfMargin,
            centerOnPage: true,
          });
          break;

        case 'eps':
          await exportEPS(svg, {
            filename: fullFilename,
            width: epsWidth,
            height: epsHeight,
          });
          break;

        case 'png':
          const preset = PNG_SIZE_PRESETS[pngSize];
          await exportPNG(svg, {
            filename: fullFilename,
            width: preset.width,
            height: preset.height,
            backgroundColor: pngBackground || undefined,
          });
          break;
      }

      onDownloadComplete?.(selectedFormat);
      onClose();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Download QR Code</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filename */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filename</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="qr-code"
            />
          </div>

          {/* Format selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div className="grid grid-cols-4 gap-3">
              <FormatButton
                format="png"
                label="PNG"
                description="Raster image"
                icon="🖼️"
                isSelected={selectedFormat === 'png'}
                onClick={() => setSelectedFormat('png')}
              />
              <FormatButton
                format="svg"
                label="SVG"
                description="Vector image"
                icon="📐"
                isSelected={selectedFormat === 'svg'}
                onClick={() => setSelectedFormat('svg')}
              />
              <FormatButton
                format="pdf"
                label="PDF"
                description="Document"
                icon="📄"
                isSelected={selectedFormat === 'pdf'}
                onClick={() => setSelectedFormat('pdf')}
              />
              <FormatButton
                format="eps"
                label="EPS"
                description="Print ready"
                icon="🖨️"
                isSelected={selectedFormat === 'eps'}
                onClick={() => setSelectedFormat('eps')}
              />
            </div>
          </div>

          {/* Format-specific options */}
          {selectedFormat === 'png' && (
            <PNGOptions
              size={pngSize}
              onSizeChange={setPNGSize}
              background={pngBackground}
              onBackgroundChange={setPNGBackground}
            />
          )}

          {selectedFormat === 'svg' && (
            <SVGOptions
              optimized={svgOptimized}
              onOptimizedChange={setSVGOptimized}
              background={svgBackground}
              onBackgroundChange={setSVGBackground}
            />
          )}

          {selectedFormat === 'pdf' && (
            <PDFOptions
              pageSize={pdfPageSize}
              onPageSizeChange={setPDFPageSize}
              orientation={pdfOrientation}
              onOrientationChange={setPDFOrientation}
              margin={pdfMargin}
              onMarginChange={setPDFMargin}
            />
          )}

          {selectedFormat === 'eps' && (
            <EPSOptions
              width={epsWidth}
              onWidthChange={setEPSWidth}
              height={epsHeight}
              onHeightChange={setEPSHeight}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download {selectedFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Format button component
interface FormatButtonProps {
  format: DownloadFormat;
  label: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

function FormatButton({ label, description, icon, isSelected, onClick }: FormatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition text-center ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-gray-500">{description}</div>
    </button>
  );
}

// PNG Options
interface PNGOptionsProps {
  size: keyof typeof PNG_SIZE_PRESETS;
  onSizeChange: (size: keyof typeof PNG_SIZE_PRESETS) => void;
  background: string;
  onBackgroundChange: (color: string) => void;
}

function PNGOptions({ size, onSizeChange, background, onBackgroundChange }: PNGOptionsProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
        <select
          value={size}
          onChange={(e) => onSizeChange(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {Object.entries(PNG_SIZE_PRESETS).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color (optional)</label>
        <input
          type="color"
          value={background || '#ffffff'}
          onChange={(e) => onBackgroundChange(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
        />
        <button
          type="button"
          onClick={() => onBackgroundChange('')}
          className="mt-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Clear (transparent)
        </button>
      </div>
    </div>
  );
}

// SVG Options
interface SVGOptionsProps {
  optimized: boolean;
  onOptimizedChange: (optimized: boolean) => void;
  background: boolean;
  onBackgroundChange: (background: boolean) => void;
}

function SVGOptions({ optimized, onOptimizedChange, background, onBackgroundChange }: SVGOptionsProps) {
  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={optimized}
          onChange={(e) => onOptimizedChange(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm text-gray-700">Optimize SVG (smaller file size)</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={background}
          onChange={(e) => onBackgroundChange(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm text-gray-700">Add white background</span>
      </label>
    </div>
  );
}

// PDF Options
interface PDFOptionsProps {
  pageSize: PDFPageSize;
  onPageSizeChange: (size: PDFPageSize) => void;
  orientation: PDFOrientation;
  onOrientationChange: (orientation: PDFOrientation) => void;
  margin: number;
  onMarginChange: (margin: number) => void;
}

function PDFOptions({
  pageSize,
  onPageSizeChange,
  orientation,
  onOrientationChange,
  margin,
  onMarginChange,
}: PDFOptionsProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value as PDFPageSize)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
          <option value="legal">Legal</option>
          <option value="a3">A3</option>
          <option value="a5">A5</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onOrientationChange('portrait')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
              orientation === 'portrait'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Portrait
          </button>
          <button
            type="button"
            onClick={() => onOrientationChange('landscape')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
              orientation === 'landscape'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Landscape
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Margin: {margin}mm</label>
        <input
          type="range"
          min="0"
          max="50"
          step="5"
          value={margin}
          onChange={(e) => onMarginChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

// EPS Options
interface EPSOptionsProps {
  width: number;
  onWidthChange: (width: number) => void;
  height: number;
  onHeightChange: (height: number) => void;
}

function EPSOptions({ width, onWidthChange, height, onHeightChange }: EPSOptionsProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Width (points)</label>
        <input
          type="number"
          value={width}
          onChange={(e) => onWidthChange(parseInt(e.target.value))}
          min="72"
          max="1440"
          step="72"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Height (points)</label>
        <input
          type="number"
          value={height}
          onChange={(e) => onHeightChange(parseInt(e.target.value))}
          min="72"
          max="1440"
          step="72"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <p className="text-xs text-gray-500">1 point = 1/72 inch</p>
    </div>
  );
}
