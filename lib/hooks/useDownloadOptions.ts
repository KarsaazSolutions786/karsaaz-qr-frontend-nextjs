/**
 * useDownloadOptions Hook
 * 
 * Hook for managing download format-specific options.
 */

'use client';

import { useState, useCallback } from 'react';
import { PNG_SIZE_PRESETS } from '@/lib/utils/export-png';
import { PDFPageSize, PDFOrientation } from '@/lib/utils/export-pdf';

export type DownloadFormat = 'svg' | 'pdf' | 'eps' | 'png';

export interface DownloadOptions {
  format: DownloadFormat;
  filename: string;
  
  // PNG options
  pngSize: keyof typeof PNG_SIZE_PRESETS;
  pngBackground: string;
  pngSmoothing: boolean;
  pngScale: number;
  
  // SVG options
  svgOptimized: boolean;
  svgBackground: boolean;
  svgBackgroundColor: string;
  svgIncludeMetadata: boolean;
  
  // PDF options
  pdfPageSize: PDFPageSize;
  pdfOrientation: PDFOrientation;
  pdfMargin: number;
  pdfCenterOnPage: boolean;
  
  // EPS options
  epsWidth: number;
  epsHeight: number;
  epsBoundingBox: boolean;
  
  // Common options
  dpi?: number;
  quality?: number;
}

const DEFAULT_OPTIONS: DownloadOptions = {
  format: 'png',
  filename: 'qr-code',
  
  // PNG defaults
  pngSize: 'medium',
  pngBackground: '',
  pngSmoothing: false,
  pngScale: 1,
  
  // SVG defaults
  svgOptimized: false,
  svgBackground: false,
  svgBackgroundColor: '#ffffff',
  svgIncludeMetadata: true,
  
  // PDF defaults
  pdfPageSize: 'a4',
  pdfOrientation: 'portrait',
  pdfMargin: 10,
  pdfCenterOnPage: true,
  
  // EPS defaults
  epsWidth: 300,
  epsHeight: 300,
  epsBoundingBox: true,
  
  // Common defaults
  quality: 1.0,
};

export function useDownloadOptions(initialOptions?: Partial<DownloadOptions>) {
  const [options, setOptions] = useState<DownloadOptions>({
    ...DEFAULT_OPTIONS,
    ...initialOptions,
  });

  const setFormat = useCallback((format: DownloadFormat) => {
    setOptions((prev) => ({ ...prev, format }));
  }, []);

  const setFilename = useCallback((filename: string) => {
    setOptions((prev) => ({ ...prev, filename }));
  }, []);

  // PNG setters
  const setPNGSize = useCallback((size: keyof typeof PNG_SIZE_PRESETS) => {
    setOptions((prev) => ({ ...prev, pngSize: size }));
  }, []);

  const setPNGBackground = useCallback((color: string) => {
    setOptions((prev) => ({ ...prev, pngBackground: color }));
  }, []);

  const setPNGSmoothing = useCallback((smoothing: boolean) => {
    setOptions((prev) => ({ ...prev, pngSmoothing: smoothing }));
  }, []);

  const setPNGScale = useCallback((scale: number) => {
    setOptions((prev) => ({ ...prev, pngScale: scale }));
  }, []);

  // SVG setters
  const setSVGOptimized = useCallback((optimized: boolean) => {
    setOptions((prev) => ({ ...prev, svgOptimized: optimized }));
  }, []);

  const setSVGBackground = useCallback((background: boolean) => {
    setOptions((prev) => ({ ...prev, svgBackground: background }));
  }, []);

  const setSVGBackgroundColor = useCallback((color: string) => {
    setOptions((prev) => ({ ...prev, svgBackgroundColor: color }));
  }, []);

  const setSVGIncludeMetadata = useCallback((include: boolean) => {
    setOptions((prev) => ({ ...prev, svgIncludeMetadata: include }));
  }, []);

  // PDF setters
  const setPDFPageSize = useCallback((pageSize: PDFPageSize) => {
    setOptions((prev) => ({ ...prev, pdfPageSize: pageSize }));
  }, []);

  const setPDFOrientation = useCallback((orientation: PDFOrientation) => {
    setOptions((prev) => ({ ...prev, pdfOrientation: orientation }));
  }, []);

  const setPDFMargin = useCallback((margin: number) => {
    setOptions((prev) => ({ ...prev, pdfMargin: margin }));
  }, []);

  const setPDFCenterOnPage = useCallback((center: boolean) => {
    setOptions((prev) => ({ ...prev, pdfCenterOnPage: center }));
  }, []);

  // EPS setters
  const setEPSWidth = useCallback((width: number) => {
    setOptions((prev) => ({ ...prev, epsWidth: width }));
  }, []);

  const setEPSHeight = useCallback((height: number) => {
    setOptions((prev) => ({ ...prev, epsHeight: height }));
  }, []);

  const setEPSBoundingBox = useCallback((boundingBox: boolean) => {
    setOptions((prev) => ({ ...prev, epsBoundingBox: boundingBox }));
  }, []);

  // Common setters
  const setDPI = useCallback((dpi: number) => {
    setOptions((prev) => ({ ...prev, dpi }));
  }, []);

  const setQuality = useCallback((quality: number) => {
    setOptions((prev) => ({ ...prev, quality }));
  }, []);

  // Reset to defaults
  const reset = useCallback(() => {
    setOptions(DEFAULT_OPTIONS);
  }, []);

  // Bulk update
  const updateOptions = useCallback((updates: Partial<DownloadOptions>) => {
    setOptions((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    options,
    setFormat,
    setFilename,
    
    // PNG
    setPNGSize,
    setPNGBackground,
    setPNGSmoothing,
    setPNGScale,
    
    // SVG
    setSVGOptimized,
    setSVGBackground,
    setSVGBackgroundColor,
    setSVGIncludeMetadata,
    
    // PDF
    setPDFPageSize,
    setPDFOrientation,
    setPDFMargin,
    setPDFCenterOnPage,
    
    // EPS
    setEPSWidth,
    setEPSHeight,
    setEPSBoundingBox,
    
    // Common
    setDPI,
    setQuality,
    
    // Utilities
    reset,
    updateOptions,
  };
}

/**
 * Get format recommendations
 */
export function getFormatRecommendation(useCase: 'web' | 'print' | 'vector' | 'document'): {
  format: DownloadFormat;
  reason: string;
} {
  switch (useCase) {
    case 'web':
      return {
        format: 'png',
        reason: 'PNG offers best compatibility and quality for web use with transparency support',
      };
    case 'print':
      return {
        format: 'eps',
        reason: 'EPS is the professional print standard with perfect scalability',
      };
    case 'vector':
      return {
        format: 'svg',
        reason: 'SVG provides infinite scalability and smallest file size for vector graphics',
      };
    case 'document':
      return {
        format: 'pdf',
        reason: 'PDF is universally supported for documents and maintains quality',
      };
  }
}

/**
 * Format capabilities
 */
export const FORMAT_CAPABILITIES = {
  svg: {
    name: 'SVG',
    fullName: 'Scalable Vector Graphics',
    vector: true,
    scalable: true,
    transparent: true,
    editInDesignTools: true,
    webCompatible: true,
    printReady: true,
    avgFileSize: '5-15 KB',
    pros: ['Infinitely scalable', 'Smallest file size', 'Editable', 'Web compatible'],
    cons: ['May not render in all applications', 'Limited print software support'],
  },
  png: {
    name: 'PNG',
    fullName: 'Portable Network Graphics',
    vector: false,
    scalable: false,
    transparent: true,
    editInDesignTools: false,
    webCompatible: true,
    printReady: true,
    avgFileSize: '50-500 KB',
    pros: ['Universal compatibility', 'Transparency support', 'Crisp at chosen resolution'],
    cons: ['Not scalable', 'Larger file size', 'Fixed resolution'],
  },
  pdf: {
    name: 'PDF',
    fullName: 'Portable Document Format',
    vector: true,
    scalable: true,
    transparent: false,
    editInDesignTools: true,
    webCompatible: true,
    printReady: true,
    avgFileSize: '15-50 KB',
    pros: ['Universal compatibility', 'Scalable', 'Perfect for documents', 'Print ready'],
    cons: ['Larger than SVG', 'Harder to edit', 'No transparency'],
  },
  eps: {
    name: 'EPS',
    fullName: 'Encapsulated PostScript',
    vector: true,
    scalable: true,
    transparent: false,
    editInDesignTools: true,
    webCompatible: false,
    printReady: true,
    avgFileSize: '20-80 KB',
    pros: ['Professional print standard', 'Perfect scalability', 'Adobe compatible'],
    cons: ['Not web compatible', 'Larger file size', 'Limited viewer support'],
  },
};

/**
 * Get file extension for format
 */
export function getFileExtension(format: DownloadFormat): string {
  return format;
}

/**
 * Get MIME type for format
 */
export function getMIMEType(format: DownloadFormat): string {
  const mimeTypes: Record<DownloadFormat, string> = {
    svg: 'image/svg+xml',
    png: 'image/png',
    pdf: 'application/pdf',
    eps: 'application/postscript',
  };
  return mimeTypes[format];
}
