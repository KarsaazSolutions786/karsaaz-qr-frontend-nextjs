/**
 * Logo Utilities
 * 
 * Helper functions for logo processing, validation, and optimization.
 */

import { LogoConfig as DesignerLogoConfig } from '@/types/entities/designer';

export interface LogoValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate logo configuration
 */
export function validateLogoConfig(
  logo: DesignerLogoConfig,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
): LogoValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Size validation
  if (logo.size < 0 || logo.size > 0.5) {
    errors.push('Logo size must be between 0 and 0.5 (50%)');
  }

  // Margin validation
  if (logo.margin < 0 || logo.margin > 0.3) {
    errors.push('Logo margin must be between 0 and 0.3 (30%)');
  }

  // URL validation
  if (!logo.url || logo.url.trim() === '') {
    errors.push('Logo URL is required');
  }

  // Check if logo size exceeds error correction capacity
  const maxLogoSize = getMaxLogoSize(errorCorrectionLevel);
  if (logo.size > maxLogoSize) {
    warnings.push(
      `Logo size (${Math.round(logo.size * 100)}%) exceeds recommended maximum (${Math.round(maxLogoSize * 100)}%) for error correction level ${errorCorrectionLevel}. QR code may not scan reliably.`
    );
  }

  // Optimal size check
  const optimalSize = getOptimalLogoSize(errorCorrectionLevel);
  if (logo.size > optimalSize && logo.size <= maxLogoSize) {
    warnings.push(
      `Logo size is above optimal (${Math.round(optimalSize * 100)}%). Consider reducing for better scanning reliability.`
    );
  }

  // Border width validation
  if (logo.borderWidth !== undefined && (logo.borderWidth < 0 || logo.borderWidth > 20)) {
    errors.push('Border width must be between 0 and 20 pixels');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get maximum logo size based on error correction level
 */
export function getMaxLogoSize(errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'): number {
  const errorCorrectionCapacity = {
    L: 0.07, // 7% recovery
    M: 0.15, // 15% recovery
    Q: 0.25, // 25% recovery
    H: 0.30, // 30% recovery
  };

  // Max logo size is error correction capacity
  return errorCorrectionCapacity[errorCorrectionLevel];
}

/**
 * Get optimal logo size (80% of max)
 */
export function getOptimalLogoSize(errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'): number {
  return getMaxLogoSize(errorCorrectionLevel) * 0.8;
}

/**
 * Calculate logo pixel dimensions
 */
export function calculateLogoPixelSize(
  qrSize: number,
  logoSize: number
): { width: number; height: number } {
  const pixels = qrSize * logoSize;
  return { width: pixels, height: pixels };
}

/**
 * Calculate logo clearance area (including margin)
 */
export function calculateLogoClearanceArea(
  qrSize: number,
  logoSize: number,
  logoMargin: number
): { width: number; height: number; totalSize: number } {
  const totalSize = logoSize + logoMargin * 2;
  const pixels = qrSize * totalSize;
  return { width: pixels, height: pixels, totalSize };
}

/**
 * Check if logo is too small to be visible
 */
export function isLogoTooSmall(logoSize: number, qrSize: number): boolean {
  const pixels = qrSize * logoSize;
  return pixels < 50; // Less than 50 pixels
}

/**
 * Optimize logo size based on QR content complexity
 */
export function optimizeLogoSize(
  dataLength: number,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
): number {
  const optimalSize = getOptimalLogoSize(errorCorrectionLevel);

  // For complex QR codes (lots of data), use smaller logo
  if (dataLength > 500) {
    return optimalSize * 0.7;
  } else if (dataLength > 200) {
    return optimalSize * 0.85;
  }

  return optimalSize;
}

/**
 * Convert data URL to blob
 */
export async function dataURLToBlob(dataURL: string): Promise<Blob> {
  const response = await fetch(dataURL);
  return response.blob();
}

/**
 * Compress image to target size
 */
export async function compressImage(
  dataURL: string,
  maxWidth: number = 512,
  maxHeight: number = 512,
  quality: number = 0.9
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataURL;
  });
}

/**
 * Get logo file size from data URL
 */
export function getLogoFileSize(dataURL: string): number {
  // Remove data URL prefix
  const base64 = dataURL.split(',')[1] || '';
  // Calculate size in bytes (base64 is ~33% larger than binary)
  return (base64.length * 3) / 4;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Detect if image has transparency
 */
export async function hasTransparency(dataURL: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Check alpha channel
      for (let i = 3; i < data.length; i += 4) {
        if ((data[i] ?? 255) < 255) {
          resolve(true);
          return;
        }
      }

      resolve(false);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataURL;
  });
}

/**
 * Get recommended background color based on logo transparency
 */
export async function getRecommendedBackgroundColor(dataURL: string): Promise<string | null> {
  const transparent = await hasTransparency(dataURL);
  return transparent ? '#FFFFFF' : null;
}

/**
 * Create default logo config
 */
export function createDefaultLogoConfig(url: string): DesignerLogoConfig {
  return {
    url,
    size: 0.2, // 20%
    margin: 0.05, // 5%
    shape: 'square',
  };
}

/**
 * Clone logo config
 */
export function cloneLogoConfig(logo: DesignerLogoConfig): DesignerLogoConfig {
  return JSON.parse(JSON.stringify(logo));
}

/**
 * Get logo description (for UI)
 */
export function getLogoDescription(logo: DesignerLogoConfig): string {
  const parts: string[] = [];

  parts.push(`${Math.round(logo.size * 100)}% size`);
  parts.push(`${logo.shape} shape`);

  if (logo.backgroundColor) {
    parts.push('with background');
  }

  if (logo.borderColor) {
    parts.push(`${logo.borderWidth ?? 2}px border`);
  }

  return parts.join(', ');
}
