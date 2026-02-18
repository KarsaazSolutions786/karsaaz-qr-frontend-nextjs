/**
 * QR code generation logic with design options
 */

import QRCode from 'qrcode';

export interface QRDesignOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  width?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  type?: 'svg' | 'png';
}

export interface QRGenerationParams {
  data: string;
  design?: QRDesignOptions;
}

/**
 * Default design options
 */
const DEFAULT_DESIGN: QRDesignOptions = {
  errorCorrectionLevel: 'M',
  margin: 4,
  width: 512,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
  type: 'svg',
};

/**
 * Generate QR code as SVG
 */
export async function generateQRSVG(
  data: string,
  options: QRDesignOptions = {}
): Promise<string> {
  const mergedOptions = { ...DEFAULT_DESIGN, ...options };

  try {
    const svg = await QRCode.toString(data, {
      type: 'svg',
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel,
      margin: mergedOptions.margin,
      width: mergedOptions.width,
      color: {
        dark: mergedOptions.color?.dark || DEFAULT_DESIGN.color!.dark,
        light: mergedOptions.color?.light || DEFAULT_DESIGN.color!.light,
      },
    });

    return svg;
  } catch (error) {
    throw new Error(
      `Failed to generate QR SVG: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate QR code as PNG data URL
 */
export async function generateQRPNG(
  data: string,
  options: QRDesignOptions = {}
): Promise<string> {
  const mergedOptions = { ...DEFAULT_DESIGN, ...options };

  try {
    const dataUrl = await QRCode.toDataURL(data, {
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel,
      margin: mergedOptions.margin,
      width: mergedOptions.width,
      color: {
        dark: mergedOptions.color?.dark || DEFAULT_DESIGN.color!.dark,
        light: mergedOptions.color?.light || DEFAULT_DESIGN.color!.light,
      },
    });

    return dataUrl;
  } catch (error) {
    throw new Error(
      `Failed to generate QR PNG: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generate QR code based on type
 */
export async function generateQRCode(
  params: QRGenerationParams
): Promise<string> {
  const { data, design = {} } = params;
  const type = design.type || 'svg';

  if (type === 'png') {
    return generateQRPNG(data, design);
  }

  return generateQRSVG(data, design);
}

/**
 * Validate QR data
 */
export function validateQRData(data: string): {
  valid: boolean;
  error?: string;
} {
  if (!data || data.trim().length === 0) {
    return { valid: false, error: 'QR data cannot be empty' };
  }

  if (data.length > 4296) {
    return {
      valid: false,
      error: 'QR data exceeds maximum length (4296 characters)',
    };
  }

  return { valid: true };
}
