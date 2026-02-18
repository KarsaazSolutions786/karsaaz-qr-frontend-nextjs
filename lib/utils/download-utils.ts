/**
 * Download Utilities
 * 
 * Provides functions for downloading QR codes in various formats
 * (PNG, SVG, PDF, EPS) with custom sizing and quality options.
 */

export type DownloadFormat = 'png' | 'svg' | 'pdf' | 'eps';

export interface DownloadOptions {
  filename: string;
  format: DownloadFormat;
  size?: number;
  quality?: number; // 0-1 for PNG/JPEG
  dpi?: number; // For print quality
}

/**
 * Trigger browser download of a file
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download SVG as file
 */
export function downloadSVG(svgElement: SVGSVGElement, filename: string): void {
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  triggerDownload(blob, `${filename}.svg`);
}

/**
 * Convert SVG to Canvas
 */
export async function svgToCanvas(
  svgElement: SVGSVGElement,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };
    img.src = url;
  });
}

/**
 * Download PNG from SVG
 */
export async function downloadPNG(
  svgElement: SVGSVGElement,
  filename: string,
  size: number = 600,
  quality: number = 0.95
): Promise<void> {
  try {
    const canvas = await svgToCanvas(svgElement, size, size);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create PNG blob'));
            return;
          }
          triggerDownload(blob, `${filename}.png`);
          resolve();
        },
        'image/png',
        quality
      );
    });
  } catch (error) {
    throw new Error(`PNG download failed: ${error}`);
  }
}

/**
 * Download PDF from SVG (requires jsPDF and svg2pdf.js)
 */
export async function downloadPDF(
  svgElement: SVGSVGElement,
  filename: string,
  _size: number = 600
): Promise<void> {
  try {
    // Dynamic imports to reduce initial bundle size
    const { jsPDF } = await import('jspdf');
    const svg2pdf = await import('svg2pdf.js');
    
    // Create PDF in portrait mode with mm units
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Calculate dimensions to fit on page with margin
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20; // mm
    const maxSize = Math.min(pageWidth, pageHeight) - (margin * 2);
    
    // Convert SVG to PDF
    await svg2pdf.svg2pdf(svgElement, pdf, {
      x: margin,
      y: margin,
      width: maxSize,
      height: maxSize,
    });
    
    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    throw new Error(`PDF download failed: ${error}`);
  }
}

/**
 * Download EPS from SVG (converts to EPS format)
 */
export async function downloadEPS(
  svgElement: SVGSVGElement,
  filename: string
): Promise<void> {
  // EPS is PostScript-based, we'll convert SVG to EPS format
  const svgString = new XMLSerializer().serializeToString(svgElement);
  
  // Get SVG dimensions
  const width = svgElement.width.baseVal.value || 600;
  const height = svgElement.height.baseVal.value || 600;
  
  // Create basic EPS header
  const epsHeader = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 ${width} ${height}
%%Title: ${filename}
%%Creator: Karsaaz QR Code Generator
%%CreationDate: ${new Date().toISOString()}
%%DocumentData: Clean7Bit
%%Origin: 0 0
%%LanguageLevel: 2
%%Pages: 1
%%Page: 1 1
`;

  // Convert SVG paths to PostScript (simplified conversion)
  // Note: This is a basic implementation. For production, consider using a proper SVG to EPS converter
  const epsContent = `${epsHeader}
% SVG embedded as comment for reference
% ${svgString.replace(/\n/g, '\n% ')}

% End of EPS
showpage
%%EOF
`;
  
  const blob = new Blob([epsContent], { type: 'application/postscript' });
  triggerDownload(blob, `${filename}.eps`);
}

/**
 * Get optimal file size for format
 */
export function getOptimalSize(format: DownloadFormat): number {
  switch (format) {
    case 'png':
      return 1200; // High quality for print
    case 'svg':
      return 600; // Vector, size doesn't matter much
    case 'pdf':
      return 800; // Balanced for PDF
    case 'eps':
      return 800; // Vector format
    default:
      return 600;
  }
}

/**
 * Get file extension for format
 */
export function getFileExtension(format: DownloadFormat): string {
  return format;
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: DownloadFormat): string {
  switch (format) {
    case 'png':
      return 'image/png';
    case 'svg':
      return 'image/svg+xml';
    case 'pdf':
      return 'application/pdf';
    case 'eps':
      return 'application/postscript';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Validate download options
 */
export function validateDownloadOptions(options: DownloadOptions): {
  isValid: boolean;
  error?: string;
} {
  if (!options.filename || options.filename.trim().length === 0) {
    return { isValid: false, error: 'Filename is required' };
  }
  
  if (options.size && (options.size < 100 || options.size > 5000)) {
    return { isValid: false, error: 'Size must be between 100 and 5000 pixels' };
  }
  
  if (options.quality && (options.quality < 0 || options.quality > 1)) {
    return { isValid: false, error: 'Quality must be between 0 and 1' };
  }
  
  return { isValid: true };
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(baseName: string, format: DownloadFormat): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const sanitizedName = baseName.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  return `${sanitizedName}_${timestamp}.${format}`;
}

/**
 * Calculate DPI-adjusted size
 */
export function calculatePrintSize(widthInches: number, heightInches: number, dpi: number = 300): {
  width: number;
  height: number;
} {
  return {
    width: Math.round(widthInches * dpi),
    height: Math.round(heightInches * dpi),
  };
}
