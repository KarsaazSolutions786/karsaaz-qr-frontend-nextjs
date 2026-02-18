/**
 * QR Code Generation Utilities
 * 
 * Provides functions for generating QR codes with customization options
 * including module shapes, corner styles, colors, logos, and backgrounds.
 */

import QRCode from 'qrcode-generator';

export type ModuleShape = 'square' | 'rounded' | 'dots' | 'circular' | 'diamond';
export type CornerStyle = 'square' | 'rounded' | 'circular' | 'extra-rounded';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCodeOptions {
  data: string;
  size?: number;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  moduleShape?: ModuleShape;
  cornerFrameStyle?: CornerStyle;
  cornerDotStyle?: CornerStyle;
  foregroundColor?: string;
  backgroundColor?: string;
  logo?: string | null;
  logoSize?: number;
  margin?: number;
}

/**
 * Generate QR code matrix data
 */
export function generateQRMatrix(
  data: string,
  errorCorrectionLevel: ErrorCorrectionLevel = 'M'
): QRCode {
  // Determine optimal type number based on data length
  let typeNumber = 0; // Auto-detect
  
  if (data.length > 1000) typeNumber = 15;
  else if (data.length > 500) typeNumber = 10;
  else if (data.length > 100) typeNumber = 5;
  
  const qr = QRCode(typeNumber as any, errorCorrectionLevel);
  qr.addData(data);
  qr.make();
  
  return qr;
}

/**
 * Get module count from QR code instance
 */
export function getModuleCount(qr: QRCode): number {
  return qr.getModuleCount();
}

/**
 * Check if module is dark at given coordinates
 */
export function isDark(qr: QRCode, row: number, col: number): boolean {
  return qr.isDark(row, col);
}

/**
 * Calculate QR code dimensions
 */
export function calculateQRDimensions(
  moduleCount: number,
  size: number,
  margin: number = 4
): {
  moduleSize: number;
  totalModules: number;
  totalSize: number;
  offset: number;
} {
  const totalModules = moduleCount + (margin * 2);
  const moduleSize = size / totalModules;
  const offset = margin * moduleSize;
  
  return {
    moduleSize,
    totalModules,
    totalSize: size,
    offset,
  };
}

/**
 * Check if coordinates are in a corner position
 */
export function isCornerPosition(
  row: number,
  col: number,
  moduleCount: number
): {
  isCorner: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | null;
} {
  const cornerSize = 7; // Standard QR corner size
  
  // Top-left corner
  if (row < cornerSize && col < cornerSize) {
    return { isCorner: true, position: 'top-left' };
  }
  
  // Top-right corner
  if (row < cornerSize && col >= moduleCount - cornerSize) {
    return { isCorner: true, position: 'top-right' };
  }
  
  // Bottom-left corner
  if (row >= moduleCount - cornerSize && col < cornerSize) {
    return { isCorner: true, position: 'bottom-left' };
  }
  
  return { isCorner: false, position: null };
}

/**
 * Check if coordinates are in the logo area
 */
export function isInLogoArea(
  row: number,
  col: number,
  moduleCount: number,
  logoSize: number
): boolean {
  const center = moduleCount / 2;
  const logoRadius = (logoSize * moduleCount) / 2;
  
  const dx = Math.abs(col - center);
  const dy = Math.abs(row - center);
  
  return dx < logoRadius && dy < logoRadius;
}

/**
 * Get neighbors for a module (used for rounded corners detection)
 */
export function getModuleNeighbors(
  qr: QRCode,
  row: number,
  col: number,
  moduleCount: number
): {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  topLeft: boolean;
  topRight: boolean;
  bottomLeft: boolean;
  bottomRight: boolean;
} {
  return {
    top: row > 0 ? isDark(qr, row - 1, col) : false,
    right: col < moduleCount - 1 ? isDark(qr, row, col + 1) : false,
    bottom: row < moduleCount - 1 ? isDark(qr, row + 1, col) : false,
    left: col > 0 ? isDark(qr, row, col - 1) : false,
    topLeft: row > 0 && col > 0 ? isDark(qr, row - 1, col - 1) : false,
    topRight: row > 0 && col < moduleCount - 1 ? isDark(qr, row - 1, col + 1) : false,
    bottomLeft: row < moduleCount - 1 && col > 0 ? isDark(qr, row + 1, col - 1) : false,
    bottomRight: row < moduleCount - 1 && col < moduleCount - 1 ? isDark(qr, row + 1, col + 1) : false,
  };
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1] ?? '0', 16),
        g: parseInt(result[2] ?? '0', 16),
        b: parseInt(result[3] ?? '0', 16),
      }
    : null;
}

/**
 * Validate QR code data
 */
export function validateQRData(data: string): {
  isValid: boolean;
  error?: string;
  estimatedSize?: number;
} {
  if (!data || data.trim().length === 0) {
    return { isValid: false, error: 'QR code data cannot be empty' };
  }
  
  // Maximum capacity for QR codes is around 4296 alphanumeric characters
  // or 2953 bytes with high error correction
  if (data.length > 2000) {
    return {
      isValid: false,
      error: 'QR code data too large. Maximum recommended length is 2000 characters.',
    };
  }
  
  // Estimate QR code version/size
  let estimatedSize = 21; // Minimum size (version 1)
  if (data.length > 1000) estimatedSize = 57; // Version 10
  else if (data.length > 500) estimatedSize = 45; // Version 6
  else if (data.length > 100) estimatedSize = 33; // Version 3
  
  return { isValid: true, estimatedSize };
}
