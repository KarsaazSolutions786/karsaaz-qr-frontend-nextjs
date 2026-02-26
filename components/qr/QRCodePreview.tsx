/**
 * QRCodePreview Component
 * 
 * Real-time QR code preview with full designer configuration support.
 * Generates and displays QR codes with all customization options.
 */

'use client';

import React, { useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { DesignerConfig, DEFAULT_DESIGNER_CONFIG } from '@/types/entities/designer';
import { StickerConfig } from '@/types/entities/sticker';
import { generateQRCodeSync } from '@/lib/utils/qrcode-generator';
import { generateQRCodeSVG } from '@/lib/utils/svg-renderer';
import { downloadPNG, downloadSVG, downloadPDF, downloadEPS } from '@/lib/utils/download-utils';
import { sanitizeSvg } from '@/lib/utils/dom-safety';

export interface QRCodePreviewProps {
  data: string;
  config?: Partial<DesignerConfig>;
  stickerConfig?: StickerConfig | null;
  className?: string;
  showError?: boolean;
  onGenerationError?: (error: Error) => void;
}

export type DownloadFormat = 'png' | 'svg' | 'pdf' | 'eps';

export interface QRCodePreviewRef {
  download: (format: DownloadFormat, filename?: string) => Promise<void>;
  getSVG: () => string | null;
  getDataURL: () => string | null;
}

export const QRCodePreview = React.forwardRef<QRCodePreviewRef, QRCodePreviewProps>(
  ({ data, config = {}, stickerConfig, className = '', showError = true, onGenerationError }, ref) => {
    // Merge with defaults
    const mergedConfig: DesignerConfig = useMemo(
      () => ({
        ...DEFAULT_DESIGNER_CONFIG,
        ...config,
      }),
      [config]
    );

    // Generate QR code
    const qrResult = useMemo(() => {
      try {
        if (!data || data.trim() === '') {
          return { error: 'No data provided' as const, svg: null, qr: null, moduleCount: 0 };
        }

        const result = generateQRCodeSync({
          data,
          designerConfig: mergedConfig,
        });

        const svg = generateQRCodeSVG({
          qr: result.qr,
          moduleCount: result.moduleCount,
          config: mergedConfig,
          stickerConfig,
        });

        return { error: null, svg, qr: result.qr, moduleCount: result.moduleCount };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        if (onGenerationError) {
          onGenerationError(err);
        }
        return { error: err.message, svg: null, qr: null, moduleCount: 0 };
      }
    }, [data, mergedConfig, stickerConfig, onGenerationError]);

    // Download function
    const download = useCallback(
      async (format: DownloadFormat, filename?: string) => {
        if (!qrResult.svg) {
          throw new Error('No QR code generated');
        }

        const defaultFilename = filename || `qrcode-${Date.now()}`;

        const svgEl = qrResult.svg as any;

        switch (format) {
          case 'png':
            await downloadPNG(svgEl, `${defaultFilename}.png`, mergedConfig.size);
            break;
          case 'svg':
            downloadSVG(svgEl, `${defaultFilename}.svg`);
            break;
          case 'pdf':
            await downloadPDF(svgEl, `${defaultFilename}.pdf`, mergedConfig.size);
            break;
          case 'eps':
            downloadEPS(svgEl, `${defaultFilename}.eps`);
            break;
          default:
            throw new Error(`Unsupported format: ${format}`);
        }
      },
      [qrResult.svg, mergedConfig.size]
    );

    // Get SVG string
    const getSVG = useCallback(() => {
      return qrResult.svg;
    }, [qrResult.svg]);

    // Get data URL
    const getDataURL = useCallback(() => {
      if (!qrResult.svg) return null;
      const encoded = encodeURIComponent(qrResult.svg).replace(/'/g, '%27').replace(/"/g, '%22');
      return `data:image/svg+xml,${encoded}`;
    }, [qrResult.svg]);

    // Expose methods via ref
    React.useImperativeHandle(
      ref,
      () => ({
        download,
        getSVG,
        getDataURL,
      }),
      [download, getSVG, getDataURL]
    );

    // Error state
    if (qrResult.error) {
      if (!showError) {
        return null;
      }

      return (
        <div className={`qr-preview-error ${className}`}>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Generation Failed</h3>
            <p className="text-sm text-gray-600">{qrResult.error}</p>
          </div>
        </div>
      );
    }

    // Loading state
    if (!qrResult.svg) {
      return (
        <div className={`qr-preview-loading ${className}`}>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      );
    }

    // Success state - render SVG
    return (
      <div className={`qr-preview ${className}`} data-qr-size={mergedConfig.size}>
        <div
          className="qr-preview-container"
          dangerouslySetInnerHTML={{ __html: sanitizeSvg(qrResult.svg) }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </div>
    );
  }
);

QRCodePreview.displayName = 'QRCodePreview';

/**
 * Simple preview without ref (for basic use cases)
 */
export function SimpleQRCodePreview({
  data,
  config,
  stickerConfig,
  className,
}: Omit<QRCodePreviewProps, 'onGenerationError' | 'showError'>) {
  return <QRCodePreview data={data} config={config} stickerConfig={stickerConfig} className={className} />;
}

/**
 * Preview with download buttons
 */
export function QRCodePreviewWithDownload({
  data,
  config,
  stickerConfig,
  filename = 'qrcode',
  showFormats = ['png', 'svg', 'pdf'],
}: QRCodePreviewProps & {
  filename?: string;
  showFormats?: DownloadFormat[];
}) {
  const previewRef = React.useRef<QRCodePreviewRef>(null);

  const handleDownload = async (format: DownloadFormat) => {
    try {
      await previewRef.current?.download(format, filename);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Download failed. Please try again.');
    }
  };

  return (
    <div className="qr-preview-with-download space-y-4">
      <QRCodePreview ref={previewRef} data={data} config={config} stickerConfig={stickerConfig} />

      <div className="flex gap-2 justify-center">
        {showFormats.includes('png') && (
          <button
            onClick={() => handleDownload('png')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            Download PNG
          </button>
        )}
        {showFormats.includes('svg') && (
          <button
            onClick={() => handleDownload('svg')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Download SVG
          </button>
        )}
        {showFormats.includes('pdf') && (
          <button
            onClick={() => handleDownload('pdf')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Download PDF
          </button>
        )}
        {showFormats.includes('eps') && (
          <button
            onClick={() => handleDownload('eps')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            Download EPS
          </button>
        )}
      </div>
    </div>
  );
}
