/**
 * useQRPreview Hook
 * 
 * Hook for managing QR code preview state with real-time updates.
 * Integrates with wizard state for live config changes.
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { DesignerConfig } from '@/types/entities/designer';
import { StickerConfig } from '@/types/entities/sticker';
import { generateQRCode } from '@/lib/utils/qrcode-generator';
import { generateQRCodeSVG } from '@/lib/utils/svg-renderer';

export interface UseQRPreviewOptions {
  data: string;
  config: DesignerConfig;
  stickerConfig?: StickerConfig | null;
  debounce?: number; // Debounce time in ms (default: 100)
  onError?: (error: Error) => void;
}

export interface QRPreviewState {
  svg: string | null;
  dataURL: string | null;
  isGenerating: boolean;
  error: string | null;
  moduleCount: number;
  estimatedComplexity: 'low' | 'medium' | 'high';
}

/**
 * Hook for QR code preview with real-time updates
 */
export function useQRPreview(options: UseQRPreviewOptions): QRPreviewState {
  const { data, config, stickerConfig, debounce = 100, onError } = options;

  const [state, setState] = useState<QRPreviewState>({
    svg: null,
    dataURL: null,
    isGenerating: false,
    error: null,
    moduleCount: 0,
    estimatedComplexity: 'low',
  });

  // Generate QR code with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const generate = async () => {
      if (!data || data.trim() === '') {
        setState({
          svg: null,
          dataURL: null,
          isGenerating: false,
          error: 'No data provided',
          moduleCount: 0,
          estimatedComplexity: 'low',
        });
        return;
      }

      setState(prev => ({ ...prev, isGenerating: true, error: null }));

      try {
        // Generate QR code
        const result = generateQRCode({
          data,
          errorCorrectionLevel: config.errorCorrectionLevel,
          margin: config.margin,
          designerConfig: config,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        // Generate SVG
        const svg = generateQRCodeSVG({
          qr: result.qr,
          moduleCount: result.moduleCount,
          config,
          stickerConfig: stickerConfig || null,
        });

        // Generate data URL
        const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
        const dataURL = `data:image/svg+xml,${encoded}`;

        if (!isCancelled) {
          setState({
            svg,
            dataURL,
            isGenerating: false,
            error: null,
            moduleCount: result.moduleCount,
            estimatedComplexity: result.estimatedComplexity,
          });
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        if (!isCancelled) {
          setState({
            svg: null,
            dataURL: null,
            isGenerating: false,
            error: err.message,
            moduleCount: 0,
            estimatedComplexity: 'low',
          });

          if (onError) {
            onError(err);
          }
        }
      }
    };

    // Debounce generation
    if (debounce > 0) {
      timeoutId = setTimeout(generate, debounce);
    } else {
      generate();
    }

    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [data, config, stickerConfig, debounce, onError]);

  return state;
}

/**
 * Hook for downloading QR code
 */
export function useQRDownload(svg: string | null, size: number) {
  const { downloadPNG, downloadSVG, downloadPDF, downloadEPS } = useMemo(() => {
    return {
      downloadPNG: async (filename: string) => {
        if (!svg) throw new Error('No QR code to download');
        const { downloadPNG } = await import('@/lib/utils/download-utils');
        await downloadPNG(svg, filename, size);
      },
      downloadSVG: (filename: string) => {
        if (!svg) throw new Error('No QR code to download');
        const { downloadSVG } = require('@/lib/utils/download-utils');
        downloadSVG(svg, filename);
      },
      downloadPDF: async (filename: string) => {
        if (!svg) throw new Error('No QR code to download');
        const { downloadPDF } = await import('@/lib/utils/download-utils');
        await downloadPDF(svg, filename, size);
      },
      downloadEPS: (filename: string) => {
        if (!svg) throw new Error('No QR code to download');
        const { downloadEPS } = require('@/lib/utils/download-utils');
        downloadEPS(svg, filename);
      },
    };
  }, [svg, size]);

  return { downloadPNG, downloadSVG, downloadPDF, downloadEPS };
}

/**
 * Hook for config validation
 */
export function useConfigValidation(config: DesignerConfig) {
  return useMemo(() => {
    const errors: string[] = [];

    // Size validation
    if (config.size < 100 || config.size > 5000) {
      errors.push('Size must be between 100 and 5000 pixels');
    }

    // Margin validation
    if (config.margin < 0 || config.margin > 10) {
      errors.push('Margin must be between 0 and 10 modules');
    }

    // Logo validation
    if (config.logo) {
      if (config.logo.size < 0 || config.logo.size > 0.5) {
        errors.push('Logo size must be between 0 and 0.5 (50%)');
      }

      if (config.logo.margin < 0 || config.logo.margin > 0.3) {
        errors.push('Logo margin must be between 0 and 0.3 (30%)');
      }
    }

    // Color validation
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (config.foregroundFill.type === 'solid' && !colorRegex.test(config.foregroundFill.color)) {
      errors.push('Invalid foreground color format');
    }

    if (config.background.type === 'solid' && config.background.color && !colorRegex.test(config.background.color)) {
      errors.push('Invalid background color format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [config]);
}

/**
 * Hook for performance metrics
 */
export function useQRPerformance(data: string, config: DesignerConfig) {
  return useMemo(() => {
    const dataLength = data.length;
    const hasLogo = !!config.logo;
    const hasSticker = false; // Would need to be passed as prop
    const hasGradient = config.foregroundFill.type === 'gradient' || config.background.type === 'gradient';
    const hasComplexShape = ['classy', 'classy-rounded'].includes(config.moduleShape);

    let complexity: 'low' | 'medium' | 'high' = 'low';

    if (dataLength > 500 || hasComplexShape || (hasLogo && hasGradient)) {
      complexity = 'high';
    } else if (dataLength > 200 || hasLogo || hasGradient || hasSticker) {
      complexity = 'medium';
    }

    return {
      dataLength,
      complexity,
      hasLogo,
      hasGradient,
      hasComplexShape,
      estimatedRenderTime: complexity === 'high' ? 200 : complexity === 'medium' ? 100 : 50,
    };
  }, [data, config]);
}
