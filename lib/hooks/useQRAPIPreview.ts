/**
 * Enhanced preview hook for API-based QR preview with URL building
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { buildPreviewURL, PreviewURLParams } from '../utils/qr-preview-url-builder';

export interface QRAPIPreviewState {
  url: string | null;
  isGenerating: boolean;
  error: string | null;
}

export interface UseQRAPIPreviewOptions {
  autoGenerate?: boolean;
}

/**
 * Hook for managing QR code preview via API
 */
export function useQRAPIPreview(
  params?: PreviewURLParams,
  options: UseQRAPIPreviewOptions = {}
) {
  const { autoGenerate = false } = options;

  const [state, setState] = useState<QRAPIPreviewState>({
    url: null,
    isGenerating: false,
    error: null,
  });

  /**
   * Generate preview URL
   */
  const generate = useCallback((newParams?: PreviewURLParams) => {
    const targetParams = newParams || params;

    if (!targetParams?.data) {
      setState({
        url: null,
        isGenerating: false,
        error: 'No data provided for QR code',
      });
      return;
    }

    setState(prev => ({
      ...prev,
      isGenerating: true,
      error: null,
    }));

    try {
      const url = buildPreviewURL(targetParams);
      setState({
        url,
        isGenerating: false,
        error: null,
      });
    } catch (error) {
      setState({
        url: null,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate preview URL',
      });
    }
  }, [params]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      url: null,
      isGenerating: false,
      error: null,
    });
  }, []);

  /**
   * Download QR code
   */
  const download = useCallback(async (filename = 'qrcode') => {
    if (!state.url) {
      console.error('No QR code URL available for download');
      return;
    }

    try {
      const response = await fetch(state.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      // Determine file extension from content type or URL
      const contentType = response.headers.get('content-type');
      const extension = contentType?.includes('svg') ? 'svg' : 'png';
      link.download = `${filename}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      throw error;
    }
  }, [state.url]);

  /**
   * Print QR code
   */
  const print = useCallback(() => {
    if (!state.url) {
      console.error('No QR code URL available for printing');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <img src="${state.url}" alt="QR Code" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }, [state.url]);

  /**
   * Auto-generate on mount if enabled
   */
  useEffect(() => {
    if (autoGenerate && params?.data) {
      generate();
    }
  }, [autoGenerate, params?.data, generate]);

  return {
    ...state,
    generate,
    reset,
    download,
    print,
  };
}
