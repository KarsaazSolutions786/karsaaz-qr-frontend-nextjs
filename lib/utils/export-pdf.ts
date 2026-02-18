/**
 * PDF Export Utility
 * 
 * Export QR codes as PDF files using jsPDF.
 */

import jsPDF from 'jspdf';
import { getSVGDimensions } from './export-svg';

export type PDFPageSize = 'a4' | 'letter' | 'legal' | 'a3' | 'a5' | 'custom';
export type PDFOrientation = 'portrait' | 'landscape';
export type PDFUnit = 'mm' | 'cm' | 'in' | 'px' | 'pt';

export interface PDFExportOptions {
  filename?: string;
  pageSize?: PDFPageSize;
  orientation?: PDFOrientation;
  unit?: PDFUnit;
  customWidth?: number; // For custom page size
  customHeight?: number; // For custom page size
  margin?: number; // Margin in chosen unit
  centerOnPage?: boolean;
  qrSize?: number; // QR code size in chosen unit
  includeMetadata?: boolean;
  metadata?: {
    title?: string;
    subject?: string;
    author?: string;
    keywords?: string;
    creator?: string;
  };
  compression?: boolean;
  quality?: number; // 0-1 for JPEG compression
}

/**
 * Export SVG to PDF
 */
export async function exportPDF(svg: string, options: PDFExportOptions = {}): Promise<void> {
  const {
    filename = 'qr-code.pdf',
    pageSize = 'a4',
    orientation = 'portrait',
    unit = 'mm',
    customWidth,
    customHeight,
    margin = 10,
    centerOnPage = true,
    qrSize,
    includeMetadata = true,
    metadata,
    compression = true,
    quality = 0.95,
  } = options;

  // Create PDF document
  const pdf = createPDFDocument(pageSize, orientation, unit, customWidth, customHeight);

  // Add metadata
  if (includeMetadata && metadata) {
    addPDFMetadata(pdf, metadata);
  }

  // Get page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Calculate QR code dimensions
  const svgDimensions = getSVGDimensions(svg);
  const aspectRatio = svgDimensions ? svgDimensions.width / svgDimensions.height : 1;

  let qrWidth = qrSize || Math.min(pageWidth - 2 * margin, pageHeight - 2 * margin);
  let qrHeight = qrWidth / aspectRatio;

  // Ensure QR fits on page with margins
  if (qrHeight > pageHeight - 2 * margin) {
    qrHeight = pageHeight - 2 * margin;
    qrWidth = qrHeight * aspectRatio;
  }

  // Calculate position
  let x = margin;
  let y = margin;

  if (centerOnPage) {
    x = (pageWidth - qrWidth) / 2;
    y = (pageHeight - qrHeight) / 2;
  }

  // Convert SVG to data URL
  const svgDataUrl = svgToDataURL(svg);

  // Add SVG to PDF
  try {
    pdf.addImage(svgDataUrl, 'SVG', x, y, qrWidth, qrHeight);
  } catch (error) {
    // Fallback: try PNG conversion
    const pngDataUrl = await svgToPNG(svg, qrWidth * 10, qrHeight * 10);
    pdf.addImage(pngDataUrl, 'PNG', x, y, qrWidth, qrHeight, undefined, compression ? 'FAST' : 'NONE');
  }

  // Save PDF
  pdf.save(filename);
}

/**
 * Get PDF as blob
 */
export async function getPDFBlob(svg: string, options: PDFExportOptions = {}): Promise<Blob> {
  const {
    pageSize = 'a4',
    orientation = 'portrait',
    unit = 'mm',
    customWidth,
    customHeight,
    margin = 10,
    centerOnPage = true,
    qrSize,
    metadata,
    compression = true,
  } = options;

  const pdf = createPDFDocument(pageSize, orientation, unit, customWidth, customHeight);

  if (metadata) {
    addPDFMetadata(pdf, metadata);
  }

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const svgDimensions = getSVGDimensions(svg);
  const aspectRatio = svgDimensions ? svgDimensions.width / svgDimensions.height : 1;

  let qrWidth = qrSize || Math.min(pageWidth - 2 * margin, pageHeight - 2 * margin);
  let qrHeight = qrWidth / aspectRatio;

  if (qrHeight > pageHeight - 2 * margin) {
    qrHeight = pageHeight - 2 * margin;
    qrWidth = qrHeight * aspectRatio;
  }

  let x = margin;
  let y = margin;

  if (centerOnPage) {
    x = (pageWidth - qrWidth) / 2;
    y = (pageHeight - qrHeight) / 2;
  }

  const svgDataUrl = svgToDataURL(svg);

  try {
    pdf.addImage(svgDataUrl, 'SVG', x, y, qrWidth, qrHeight);
  } catch (error) {
    const pngDataUrl = await svgToPNG(svg, qrWidth * 10, qrHeight * 10);
    pdf.addImage(pngDataUrl, 'PNG', x, y, qrWidth, qrHeight, undefined, compression ? 'FAST' : 'NONE');
  }

  return pdf.output('blob');
}

/**
 * Create PDF document
 */
function createPDFDocument(
  pageSize: PDFPageSize,
  orientation: PDFOrientation,
  unit: PDFUnit,
  customWidth?: number,
  customHeight?: number
): jsPDF {
  const format = pageSize === 'custom' && customWidth && customHeight
    ? [customWidth, customHeight]
    : pageSize;

  return new jsPDF({
    orientation,
    unit,
    format,
    compress: true,
  });
}

/**
 * Add metadata to PDF
 */
function addPDFMetadata(pdf: jsPDF, metadata: Required<PDFExportOptions>['metadata']): void {
  if (!metadata) return;

  const { title, subject, author, keywords, creator } = metadata;

  const props: any = {};

  if (title) props.title = title;
  if (subject) props.subject = subject;
  if (author) props.author = author;
  if (keywords) props.keywords = keywords;
  if (creator) props.creator = creator || 'Karsaaz QR Generator';

  pdf.setProperties(props);
}

/**
 * Convert SVG to data URL
 */
function svgToDataURL(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

/**
 * Convert SVG to PNG (for fallback)
 */
async function svgToPNG(svg: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load SVG'));
    img.src = svgToDataURL(svg);
  });
}

/**
 * Get page size dimensions in mm
 */
export function getPageSizeDimensions(
  pageSize: PDFPageSize,
  orientation: PDFOrientation = 'portrait'
): { width: number; height: number } {
  const sizes: Record<Exclude<PDFPageSize, 'custom'>, { width: number; height: number }> = {
    a4: { width: 210, height: 297 },
    letter: { width: 215.9, height: 279.4 },
    legal: { width: 215.9, height: 355.6 },
    a3: { width: 297, height: 420 },
    a5: { width: 148, height: 210 },
  };

  if (pageSize === 'custom') {
    return { width: 210, height: 297 }; // Default to A4
  }

  const dims = sizes[pageSize];
  
  return orientation === 'landscape'
    ? { width: dims.height, height: dims.width }
    : dims;
}

/**
 * Calculate optimal QR size for page
 */
export function calculateOptimalQRSize(
  pageSize: PDFPageSize,
  orientation: PDFOrientation,
  margin: number,
  unit: PDFUnit = 'mm'
): number {
  const dims = getPageSizeDimensions(pageSize, orientation);
  
  // Convert margin to mm if needed
  let marginMm = margin;
  if (unit === 'cm') marginMm = margin * 10;
  if (unit === 'in') marginMm = margin * 25.4;
  if (unit === 'pt') marginMm = margin * 0.3528;
  if (unit === 'px') marginMm = margin * 0.2645833;

  // Use 80% of the smaller dimension
  const availableWidth = dims.width - 2 * marginMm;
  const availableHeight = dims.height - 2 * marginMm;
  
  return Math.min(availableWidth, availableHeight) * 0.8;
}

/**
 * Get PDF file size estimate
 */
export function estimatePDFSize(svg: string): number {
  // Rough estimate: base PDF overhead + SVG size
  const baseSize = 5000; // ~5KB base PDF structure
  const svgSize = new Blob([svg]).size;
  return baseSize + svgSize;
}

/**
 * Format PDF size for display
 */
export function formatPDFSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
