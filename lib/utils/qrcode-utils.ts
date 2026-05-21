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
 * Purpose: Generate QR code matrix data
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Get module count from QR code instance
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function getModuleCount(qr: QRCode): number {
  return qr.getModuleCount();
}

/**
 * Purpose: Check if module is dark at given coordinates
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isDark(qr: QRCode, row: number, col: number): boolean {
  return qr.isDark(row, col);
}

/**
 * Purpose: Calculate QR code dimensions
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Check if coordinates are in a corner position
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Check if coordinates are in the logo area
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Get neighbors for a module (used for rounded corners detection)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Get 8-bit neighbour bitmask for a module (used by line shapes and triangle-end). Bit layout (clockwise from top-left): 1 2 3 8 # 4 7 6 5 bit 0 (0x01) = top-left bit 1 (0x02) = top bit 2 (0x04) = top-right bit 3 (0x08) = right bit 4 (0x10) = bottom-right bit 5 (0x20) = bottom bit 6 (0x40) = bottom-left bit 7 (0x80) = left
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function getNeighbourBits(
  qr: QRCode,
  row: number,
  col: number,
  moduleCount: number
): number {
  let bits = 0;
  const offsets: [number, number, number][] = [
    [0x01, -1, -1], // top-left
    [0x02,  0, -1], // top
    [0x04,  1, -1], // top-right
    [0x08,  1,  0], // right
    [0x10,  1,  1], // bottom-right
    [0x20,  0,  1], // bottom
    [0x40, -1,  1], // bottom-left
    [0x80, -1,  0], // left
  ];
  for (const [bit, dx, dy] of offsets) {
    const nx = col + dx;
    const ny = row + dy;
    if (nx >= 0 && nx < moduleCount && ny >= 0 && ny < moduleCount && isDark(qr, ny, nx)) {
      bits |= bit;
    }
  }
  return bits;
}

/**
 * Purpose: Check neighbour bitmask: returns true when all `all` bits are set among the bits allowed by `any` mask.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function checkNeighbourBits(bits: number, all: number, any: number): boolean {
  return (bits & (all | (~any & 0xff))) === all;
}

/**
 * Purpose: Convert hex color to RGB
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Validate QR code data
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
