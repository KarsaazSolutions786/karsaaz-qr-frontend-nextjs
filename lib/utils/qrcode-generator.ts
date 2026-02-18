/**
 * QR Code Generator Utility
 * 
 * High-level wrapper for QR code generation with designer configuration support.
 * Integrates qrcode-generator library with custom rendering pipeline.
 */

import QRCode from 'qrcode-generator';
import { DesignerConfig, DEFAULT_DESIGNER_CONFIG } from '@/types/entities/designer';
import { StickerConfig } from '@/types/entities/sticker';
import {
  generateQRMatrix,
  getModuleCount,
  isDark,
  calculateQRDimensions,
  isCornerPosition,
  isInLogoArea,
  validateQRData,
} from './qrcode-utils';

export interface GenerateQRCodeOptions {
  data: string;
  designerConfig?: Partial<DesignerConfig>;
  stickerConfig?: StickerConfig | null;
}

export interface QRCodeGenerationResult {
  qr: QRCode;
  moduleCount: number;
  dimensions: {
    moduleSize: number;
    totalModules: number;
    totalSize: number;
    offset: number;
  };
  config: DesignerConfig;
}

/**
 * Generate QR code with full designer configuration
 */
export async function generateQRCode(
  options: GenerateQRCodeOptions
): Promise<QRCodeGenerationResult> {
  const { data, designerConfig = {}, stickerConfig = null } = options;

  // Validate QR data
  const validation = validateQRData(data);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid QR code data');
  }

  // Merge with default config
  const config: DesignerConfig = {
    ...DEFAULT_DESIGNER_CONFIG,
    ...designerConfig,
  };

  // Generate QR matrix
  const qr = generateQRMatrix(data, config.errorCorrectionLevel);
  const moduleCount = getModuleCount(qr);

  // Calculate dimensions
  const dimensions = calculateQRDimensions(
    moduleCount,
    config.size,
    config.margin
  );

  return {
    qr,
    moduleCount,
    dimensions,
    config,
  };
}

/**
 * Get QR code data URL (for preview/download)
 */
export async function getQRCodeDataURL(
  options: GenerateQRCodeOptions,
  format: 'png' | 'svg' = 'png'
): Promise<string> {
  const result = await generateQRCode(options);

  if (format === 'svg') {
    // SVG rendering will be handled by svg-renderer.ts
    return ''; // Placeholder - actual SVG generation in next step
  }

  // PNG rendering via canvas
  return ''; // Placeholder - will be implemented with canvas rendering
}

/**
 * Estimate QR code complexity
 */
export function estimateQRComplexity(data: string): {
  estimatedModules: number;
  estimatedVersion: number;
  recommendedErrorCorrection: 'L' | 'M' | 'Q' | 'H';
} {
  const dataLength = data.length;

  let estimatedVersion = 1;
  let estimatedModules = 21;
  let recommendedErrorCorrection: 'L' | 'M' | 'Q' | 'H' = 'M';

  if (dataLength > 1000) {
    estimatedVersion = 15;
    estimatedModules = 77;
    recommendedErrorCorrection = 'L'; // Low error correction for large data
  } else if (dataLength > 500) {
    estimatedVersion = 10;
    estimatedModules = 57;
    recommendedErrorCorrection = 'M';
  } else if (dataLength > 200) {
    estimatedVersion = 6;
    estimatedModules = 41;
    recommendedErrorCorrection = 'M';
  } else if (dataLength > 100) {
    estimatedVersion = 3;
    estimatedModules = 29;
    recommendedErrorCorrection = 'Q'; // Higher error correction for smaller data
  } else {
    estimatedVersion = 1;
    estimatedModules = 21;
    recommendedErrorCorrection = 'H'; // Highest error correction for small data
  }

  return {
    estimatedModules,
    estimatedVersion,
    recommendedErrorCorrection,
  };
}

/**
 * Calculate optimal logo size based on error correction level
 */
export function calculateOptimalLogoSize(
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
): number {
  // Error correction allows for some data to be obscured
  // L = 7%, M = 15%, Q = 25%, H = 30%
  const maxCoverage: Record<typeof errorCorrectionLevel, number> = {
    L: 0.07,
    M: 0.15,
    Q: 0.25,
    H: 0.30,
  };

  // We'll be conservative and use 80% of max coverage
  return maxCoverage[errorCorrectionLevel] * 0.8;
}

/**
 * Validate designer configuration
 */
export function validateDesignerConfig(config: Partial<DesignerConfig>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate size
  if (config.size && (config.size < 100 || config.size > 5000)) {
    errors.push('Size must be between 100 and 5000 pixels');
  }

  // Validate margin
  if (config.margin && (config.margin < 0 || config.margin > 10)) {
    errors.push('Margin must be between 0 and 10 modules');
  }

  // Validate logo size
  if (config.logo && config.logo.size) {
    if (config.logo.size < 0 || config.logo.size > 0.5) {
      errors.push('Logo size must be between 0 and 0.5 (50%)');
    }
  }

  // Validate colors
  const hexPattern = /^#[0-9A-F]{6}$/i;
  
  if (config.foregroundFill?.type === 'solid') {
    if (!hexPattern.test(config.foregroundFill.color)) {
      errors.push('Invalid foreground color format');
    }
  }

  if (config.background?.type === 'solid' && config.background.color) {
    if (!hexPattern.test(config.background.color)) {
      errors.push('Invalid background color format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get QR code module matrix as 2D array
 */
export function getModuleMatrix(qr: QRCode): boolean[][] {
  const moduleCount = getModuleCount(qr);
  const matrix: boolean[][] = [];

  for (let row = 0; row < moduleCount; row++) {
    matrix[row] = [];
    for (let col = 0; col < moduleCount; col++) {
      matrix[row][col] = isDark(qr, row, col);
    }
  }

  return matrix;
}

/**
 * Check if QR code needs logo margin clearing
 */
export function needsLogoMarginClearing(
  row: number,
  col: number,
  moduleCount: number,
  logoSize: number,
  logoMargin: number
): boolean {
  if (logoSize === 0) return false;

  const center = moduleCount / 2;
  const totalLogoSize = (logoSize + logoMargin) * moduleCount;
  const logoRadius = totalLogoSize / 2;

  const dx = Math.abs(col - center);
  const dy = Math.abs(row - center);

  return dx < logoRadius && dy < logoRadius;
}

/**
 * Get corner module type (for special rendering)
 */
export function getCornerModuleType(
  row: number,
  col: number,
  moduleCount: number
): 'outer-frame' | 'inner-frame' | 'dot' | 'normal' {
  const cornerInfo = isCornerPosition(row, col, moduleCount);

  if (!cornerInfo.isCorner) {
    return 'normal';
  }

  // Determine if in outer frame, inner frame, or dot
  let localRow = row;
  let localCol = col;

  if (cornerInfo.position === 'top-right') {
    localCol = moduleCount - 1 - col;
  } else if (cornerInfo.position === 'bottom-left') {
    localRow = moduleCount - 1 - row;
  }

  // Outer frame
  if (localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6) {
    return 'outer-frame';
  }

  // Inner frame
  if (localRow === 1 || localRow === 5 || localCol === 1 || localCol === 5) {
    return 'inner-frame';
  }

  // Center dot (3x3)
  if (localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4) {
    return 'dot';
  }

  return 'normal';
}
