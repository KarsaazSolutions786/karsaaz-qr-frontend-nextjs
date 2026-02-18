/**
 * PNG Export Utility
 * 
 * Export QR codes as PNG (raster) files using HTML5 Canvas.
 */

import { getSVGDimensions } from './export-svg';

export interface PNGExportOptions {
  filename?: string;
  width?: number; // Width in pixels
  height?: number; // Height in pixels
  scale?: number; // Scale multiplier (for retina displays)
  quality?: number; // 0-1 (only affects when converting to JPEG first)
  backgroundColor?: string; // Background color (default: transparent)
  smoothing?: boolean; // Enable image smoothing
  pixelRatio?: number; // Device pixel ratio override
}

/**
 * Export SVG to PNG
 */
export async function exportPNG(svg: string, options: PNGExportOptions = {}): Promise<void> {
  const {
    filename = 'qr-code.png',
    width = 1000,
    height = 1000,
    scale = 1,
    quality = 1.0,
    backgroundColor,
    smoothing = false,
  } = options;

  const canvas = await svgToCanvas(svg, {
    width: width * scale,
    height: height * scale,
    backgroundColor,
    smoothing,
  });

  // Convert to blob
  const blob = await canvasToBlob(canvas, 'image/png', quality);

  // Download
  downloadBlob(blob, filename);
}

/**
 * Convert SVG to Canvas
 */
export async function svgToCanvas(
  svg: string,
  options: {
    width: number;
    height: number;
    backgroundColor?: string;
    smoothing?: boolean;
  }
): Promise<HTMLCanvasElement> {
  const { width, height, backgroundColor, smoothing = false } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    // Set image smoothing
    ctx.imageSmoothingEnabled = smoothing;
    if (smoothing) {
      ctx.imageSmoothingQuality = 'high';
    }

    // Fill background if specified
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Create image from SVG
    const img = new Image();
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas);
    };

    img.onerror = () => {
      reject(new Error('Failed to load SVG'));
    };

    // Convert SVG to data URL
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;

    // Clean up URL after image loads
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
  });
}

/**
 * Convert canvas to blob
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = 'image/png',
  quality: number = 1.0
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      type,
      quality
    );
  });
}

/**
 * Get PNG as data URL
 */
export async function getPNGDataURL(svg: string, options: PNGExportOptions = {}): Promise<string> {
  const {
    width = 1000,
    height = 1000,
    scale = 1,
    backgroundColor,
    smoothing = false,
  } = options;

  const canvas = await svgToCanvas(svg, {
    width: width * scale,
    height: height * scale,
    backgroundColor,
    smoothing,
  });

  return canvas.toDataURL('image/png');
}

/**
 * Get PNG as blob
 */
export async function getPNGBlob(svg: string, options: PNGExportOptions = {}): Promise<Blob> {
  const {
    width = 1000,
    height = 1000,
    scale = 1,
    quality = 1.0,
    backgroundColor,
    smoothing = false,
  } = options;

  const canvas = await svgToCanvas(svg, {
    width: width * scale,
    height: height * scale,
    backgroundColor,
    smoothing,
  });

  return canvasToBlob(canvas, 'image/png', quality);
}

/**
 * Download blob as file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Calculate dimensions maintaining aspect ratio
 */
export function calculateDimensions(
  svg: string,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  const svgDims = getSVGDimensions(svg);
  
  if (!svgDims) {
    return {
      width: targetWidth || 1000,
      height: targetHeight || 1000,
    };
  }

  const aspectRatio = svgDims.width / svgDims.height;

  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  }

  if (!targetWidth && targetHeight) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }

  if (targetWidth && targetHeight) {
    return {
      width: targetWidth,
      height: targetHeight,
    };
  }

  // Default to 1000x1000 if neither specified
  return {
    width: 1000,
    height: 1000,
  };
}

/**
 * Get PNG file size estimate
 */
export async function estimatePNGSize(svg: string, options: PNGExportOptions = {}): Promise<number> {
  const blob = await getPNGBlob(svg, options);
  return blob.size;
}

/**
 * Format PNG file size
 */
export function formatPNGSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Export to multiple PNG sizes
 */
export async function exportPNGMultipleSizes(
  svg: string,
  sizes: Array<{ width: number; height: number; filename: string }>,
  options: Omit<PNGExportOptions, 'width' | 'height' | 'filename'> = {}
): Promise<void> {
  for (const size of sizes) {
    await exportPNG(svg, {
      ...options,
      width: size.width,
      height: size.height,
      filename: size.filename,
    });
  }
}

/**
 * Common PNG size presets
 */
export const PNG_SIZE_PRESETS = {
  thumbnail: { width: 256, height: 256, label: 'Thumbnail (256x256)' },
  small: { width: 512, height: 512, label: 'Small (512x512)' },
  medium: { width: 1024, height: 1024, label: 'Medium (1024x1024)' },
  large: { width: 2048, height: 2048, label: 'Large (2048x2048)' },
  xlarge: { width: 4096, height: 4096, label: 'Extra Large (4096x4096)' },
  print: { width: 3000, height: 3000, label: 'Print Quality (3000x3000)' },
};

/**
 * Export with device pixel ratio for retina displays
 */
export async function exportPNGRetina(
  svg: string,
  width: number,
  height: number,
  options: Omit<PNGExportOptions, 'width' | 'height' | 'scale'> = {}
): Promise<void> {
  const pixelRatio = options.pixelRatio || window.devicePixelRatio || 1;
  
  await exportPNG(svg, {
    ...options,
    width,
    height,
    scale: pixelRatio,
  });
}

/**
 * Copy PNG to clipboard
 */
export async function copyPNGToClipboard(svg: string, options: PNGExportOptions = {}): Promise<void> {
  try {
    const blob = await getPNGBlob(svg, options);
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
  } catch (error) {
    throw new Error('Failed to copy PNG to clipboard');
  }
}
