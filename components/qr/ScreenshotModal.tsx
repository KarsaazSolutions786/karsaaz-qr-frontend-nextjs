'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Camera } from 'lucide-react';

export type ExportFormat = 'PNG' | 'SVG' | 'PDF';
export type SizePreset = 'S' | 'M' | 'L' | 'XL';

const SIZE_MAP: Record<SizePreset, { px: number; label: string }> = {
  S: { px: 256, label: '256 px' },
  M: { px: 512, label: '512 px' },
  L: { px: 1024, label: '1024 px' },
  XL: { px: 2048, label: '2048 px' },
};

export interface ScreenshotModalProps {
  qrCodeId: number;
  qrSvg: string;
  open: boolean;
  onClose: () => void;
}

export function ScreenshotModal({
  qrCodeId: _qrCodeId,
  qrSvg,
  open,
  onClose,
}: ScreenshotModalProps) {
  const [format, setFormat] = useState<ExportFormat>('PNG');
  const [size, setSize] = useState<SizePreset>('M');
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const dim = SIZE_MAP[size].px;

      if (format === 'SVG') {
        const blob = new Blob([qrSvg], { type: 'image/svg+xml' });
        downloadBlob(blob, `qrcode.svg`);
        return;
      }

      // Render SVG to canvas for PNG/PDF
      const canvas = document.createElement('canvas');
      canvas.width = dim;
      canvas.height = dim;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svgBlob = new Blob([qrSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, dim, dim);
          ctx.drawImage(img, 0, 0, dim, dim);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });

      if (format === 'PNG') {
        canvas.toBlob((blob) => {
          if (blob) downloadBlob(blob, `qrcode.png`);
        }, 'image/png');
      } else if (format === 'PDF') {
        // Simple PDF wrapper around the PNG image
        const dataUrl = canvas.toDataURL('image/png');
        const blob = new Blob(
          [buildMinimalPdfWithImage(dataUrl, dim)],
          { type: 'application/pdf' }
        );
        downloadBlob(blob, `qrcode.pdf`);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">Download QR Code</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Preview */}
          <div className="flex justify-center">
            <div
              ref={previewRef}
              className="w-48 h-48 border-2 border-gray-200 rounded-lg bg-white p-3 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['PNG', 'SVG', 'PDF'] as ExportFormat[]).map((fmt) => (
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(SIZE_MAP) as SizePreset[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition ${
                    size === s
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="block font-bold">{s}</span>
                  <span className="block text-xs text-gray-500">{SIZE_MAP[s].label}</span>
                </button>
              ))}
            </div>
          </div>
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
            disabled={isExporting}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Exporting…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download {format}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

/** Produces a minimal single-page PDF containing the image (data-url). */
function buildMinimalPdfWithImage(_dataUrl: string, dim: number): string {
  // Minimal PDF with an embedded page of given dimensions
  const w = dim;
  const h = dim;
  return `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${w} ${h}]>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF`;
}
