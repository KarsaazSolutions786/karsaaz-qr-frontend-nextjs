/**
 * URL builder utility for QR preview API
 */

import crypto from 'crypto';

export interface QRDesignOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  width?: number;
  color?: { dark?: string; light?: string };
  logo?: { url?: string; width?: number; height?: number };
  type?: 'svg' | 'png';
}

export interface PreviewURLParams {
  data: string;
  type?: 'url' | 'text' | 'vcard' | 'email' | 'phone' | 'sms' | 'wifi';
  design?: QRDesignOptions;
}

/**
 * Generate content hash for validation
 */
export function generateContentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

/**
 * Build preview API URL
 */
export function buildPreviewURL(params: PreviewURLParams): string {
  const { data, type = 'text', design = {} } = params;

  const queryParams = new URLSearchParams();
  queryParams.set('data', data);
  queryParams.set('type', type);

  // Add design options
  if (design.errorCorrectionLevel) {
    queryParams.set('ecl', design.errorCorrectionLevel);
  }
  if (design.margin !== undefined) {
    queryParams.set('margin', design.margin.toString());
  }
  if (design.width) {
    queryParams.set('width', design.width.toString());
  }
  if (design.color?.dark) {
    queryParams.set('dark', design.color.dark.replace('#', ''));
  }
  if (design.color?.light) {
    queryParams.set('light', design.color.light.replace('#', ''));
  }
  const designType = (design as any).type;
  if (designType) {
    queryParams.set('format', designType);
  }

  // Add content hash for validation
  const hash = generateContentHash(data);
  queryParams.set('h', hash);

  return `/api/qrcodes/preview?${queryParams.toString()}`;
}

/**
 * Build full-screen preview URL
 */
export function buildFullScreenPreviewURL(src: string): string {
  const queryParams = new URLSearchParams();
  queryParams.set('src', encodeURIComponent(src));
  
  return `/designer/preview?${queryParams.toString()}`;
}

/**
 * Parse preview URL parameters
 */
export function parsePreviewURL(url: string): PreviewURLParams | null {
  try {
    const urlObj = new URL(url, 'http://localhost');
    const params = urlObj.searchParams;

    const data = params.get('data');
    if (!data) return null;

    const type = (params.get('type') || 'text') as PreviewURLParams['type'];
    
    const design: QRDesignOptions = {};
    
    const ecl = params.get('ecl');
    if (ecl && ['L', 'M', 'Q', 'H'].includes(ecl)) {
      design.errorCorrectionLevel = ecl as 'L' | 'M' | 'Q' | 'H';
    }

    const margin = params.get('margin');
    if (margin) {
      design.margin = parseInt(margin, 10);
    }

    const width = params.get('width');
    if (width) {
      design.width = parseInt(width, 10);
    }

    const dark = params.get('dark');
    const light = params.get('light');
    if (dark || light) {
      design.color = {
        dark: dark ? `#${dark}` : undefined,
        light: light ? `#${light}` : undefined,
      };
    }

    const format = params.get('format');
    if (format === 'svg' || format === 'png') {
      (design as any).type = format;
    }

    return { data, type, design };
  } catch (error) {
    return null;
  }
}

/**
 * Verify content hash
 */
export function verifyContentHash(data: string, hash: string): boolean {
  const expectedHash = generateContentHash(data);
  return expectedHash === hash;
}
