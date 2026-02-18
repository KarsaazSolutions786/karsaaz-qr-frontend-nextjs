/**
 * Print Utilities
 * 
 * Utilities for printing QR codes with proper page layout and styles.
 */

'use client';

export interface PrintOptions {
  // Page settings
  pageSize?: 'a4' | 'letter' | 'legal' | 'a3' | 'a5';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // QR settings
  qrSize?: number;
  centerOnPage?: boolean;
  includeMetadata?: boolean;
  
  // Content settings
  title?: string;
  description?: string;
  showURL?: boolean;
  showDate?: boolean;
  showLogo?: boolean;
  
  // Print settings
  printInColor?: boolean;
  printBackground?: boolean;
  scale?: number;
}

export interface PrintMetadata {
  title?: string;
  description?: string;
  url?: string;
  createdDate?: string;
  qrType?: string;
}

const DEFAULT_PRINT_OPTIONS: Required<Omit<PrintOptions, 'title' | 'description'>> = {
  pageSize: 'a4',
  orientation: 'portrait',
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  qrSize: 300,
  centerOnPage: true,
  includeMetadata: true,
  showURL: false,
  showDate: true,
  showLogo: false,
  printInColor: true,
  printBackground: true,
  scale: 1,
};

/**
 * Print QR code with options
 */
export async function printQRCode(
  svgElement: SVGElement,
  options: PrintOptions = {},
  metadata?: PrintMetadata
): Promise<void> {
  const opts = { ...DEFAULT_PRINT_OPTIONS, ...options };
  
  // Create print window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    throw new Error('Failed to open print window. Please allow popups.');
  }
  
  try {
    // Get SVG content
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    const svgString = new XMLSerializer().serializeToString(svgClone);
    
    // Build HTML content
    const htmlContent = buildPrintHTML(svgString, opts, metadata);
    
    // Write to print window
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load
    await new Promise((resolve) => {
      printWindow.onload = resolve;
      setTimeout(resolve, 500); // Fallback timeout
    });
    
    // Trigger print dialog
    printWindow.focus();
    printWindow.print();
    
    // Close print window after printing (or user cancels)
    setTimeout(() => {
      printWindow.close();
    }, 100);
  } catch (error) {
    printWindow.close();
    throw error;
  }
}

/**
 * Build HTML for print window
 */
function buildPrintHTML(
  svgContent: string,
  options: Required<Omit<PrintOptions, 'title' | 'description'>>,
  metadata?: PrintMetadata
): string {
  const { pageSize: _pageSize, orientation: _orientation, margins: _margins, qrSize: _qrSize, centerOnPage: _centerOnPage, includeMetadata } = options;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${metadata?.title || 'QR Code'} - Print</title>
  <style>
    ${generatePrintStyles(options)}
  </style>
</head>
<body>
  <div class="print-container">
    ${includeMetadata && metadata ? buildMetadataHTML(metadata, options) : ''}
    
    <div class="qr-container">
      ${svgContent}
    </div>
    
    ${options.showURL && metadata?.url ? `
      <div class="url-container">
        <p>${metadata.url}</p>
      </div>
    ` : ''}
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate print styles
 */
function generatePrintStyles(options: Required<Omit<PrintOptions, 'title' | 'description'>>): string {
  const { pageSize, orientation, margins, qrSize, centerOnPage, printInColor, printBackground } = options;
  
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: ${pageSize} ${orientation};
      margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ${printInColor ? '' : 'print-color-adjust: exact; -webkit-print-color-adjust: exact;'}
    }
    
    .print-container {
      width: 100%;
      height: 100%;
      ${centerOnPage ? 'display: flex; flex-direction: column; align-items: center; justify-content: center;' : ''}
    }
    
    .metadata-container {
      margin-bottom: 20px;
      text-align: center;
    }
    
    .metadata-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }
    
    .metadata-description {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 12px;
    }
    
    .metadata-info {
      font-size: 12px;
      color: #9ca3af;
    }
    
    .qr-container {
      ${centerOnPage ? 'display: flex; justify-content: center; align-items: center;' : ''}
    }
    
    .qr-container svg {
      width: ${qrSize}px;
      height: ${qrSize}px;
      ${printBackground ? '' : 'background: white;'}
    }
    
    .url-container {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      word-break: break-all;
    }
    
    @media print {
      body {
        ${printBackground ? '' : '-webkit-print-color-adjust: exact; print-color-adjust: exact;'}
      }
      
      .print-container {
        page-break-inside: avoid;
      }
    }
  `.trim();
}

/**
 * Build metadata HTML
 */
function buildMetadataHTML(metadata: PrintMetadata, options: Required<Omit<PrintOptions, 'title' | 'description'>>): string {
  const { showDate } = options;
  const parts: string[] = [];
  
  if (metadata.title) {
    parts.push(`<h1 class="metadata-title">${escapeHTML(metadata.title)}</h1>`);
  }
  
  if (metadata.description) {
    parts.push(`<p class="metadata-description">${escapeHTML(metadata.description)}</p>`);
  }
  
  const infoParts: string[] = [];
  if (metadata.qrType) {
    infoParts.push(`Type: ${escapeHTML(metadata.qrType)}`);
  }
  if (showDate && metadata.createdDate) {
    infoParts.push(`Created: ${escapeHTML(metadata.createdDate)}`);
  }
  
  if (infoParts.length > 0) {
    parts.push(`<p class="metadata-info">${infoParts.join(' • ')}</p>`);
  }
  
  return parts.length > 0 ? `<div class="metadata-container">${parts.join('\n')}</div>` : '';
}

/**
 * Escape HTML special characters
 */
function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Print preview (show in new window without triggering print dialog)
 */
export async function printPreview(
  svgElement: SVGElement,
  options: PrintOptions = {},
  metadata?: PrintMetadata
): Promise<void> {
  const opts = { ...DEFAULT_PRINT_OPTIONS, ...options };
  
  const previewWindow = window.open('', '_blank', 'width=800,height=600');
  if (!previewWindow) {
    throw new Error('Failed to open preview window. Please allow popups.');
  }
  
  try {
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    const svgString = new XMLSerializer().serializeToString(svgClone);
    const htmlContent = buildPrintHTML(svgString, opts, metadata);
    
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
  } catch (error) {
    previewWindow.close();
    throw error;
  }
}

/**
 * Print multiple QR codes on one page
 */
export async function printMultipleQRCodes(
  svgElements: SVGElement[],
  options: PrintOptions & {
    layout?: 'grid' | 'list';
    columns?: number;
    spacing?: number;
  } = {}
): Promise<void> {
  const opts = {
    ...DEFAULT_PRINT_OPTIONS,
    layout: 'grid' as const,
    columns: 2,
    spacing: 20,
    ...options,
  };
  
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) {
    throw new Error('Failed to open print window. Please allow popups.');
  }
  
  try {
    const svgStrings = svgElements.map((svg) => {
      const clone = svg.cloneNode(true) as SVGElement;
      return new XMLSerializer().serializeToString(clone);
    });
    
    const htmlContent = buildMultiplePrintHTML(svgStrings, opts);
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    await new Promise((resolve) => {
      printWindow.onload = resolve;
      setTimeout(resolve, 500);
    });
    
    printWindow.focus();
    printWindow.print();
    
    setTimeout(() => {
      printWindow.close();
    }, 100);
  } catch (error) {
    printWindow.close();
    throw error;
  }
}

/**
 * Build HTML for multiple QR codes
 */
function buildMultiplePrintHTML(
  svgContents: string[],
  options: Required<Omit<PrintOptions, 'title' | 'description'>> & {
    layout: 'grid' | 'list';
    columns: number;
    spacing: number;
  }
): string {
  const { pageSize, orientation, margins, qrSize, layout, columns, spacing } = options;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>QR Codes - Print</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: ${pageSize} ${orientation};
      margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    .qr-grid {
      display: ${layout === 'grid' ? 'grid' : 'flex'};
      ${layout === 'grid' ? `grid-template-columns: repeat(${columns}, 1fr);` : 'flex-direction: column;'}
      gap: ${spacing}px;
      padding: 20px;
    }
    
    .qr-item {
      display: flex;
      justify-content: center;
      align-items: center;
      page-break-inside: avoid;
    }
    
    .qr-item svg {
      width: ${qrSize}px;
      height: ${qrSize}px;
    }
    
    @media print {
      .qr-item {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="qr-grid">
    ${svgContents.map((svg) => `
      <div class="qr-item">
        ${svg}
      </div>
    `).join('\n')}
  </div>
</body>
</html>
  `.trim();
}

/**
 * Get print page dimensions in pixels (at 96 DPI)
 */
export function getPrintPageDimensions(
  pageSize: 'a4' | 'letter' | 'legal' | 'a3' | 'a5',
  orientation: 'portrait' | 'landscape'
): { width: number; height: number } {
  const sizes = {
    a4: { width: 210, height: 297 }, // mm
    letter: { width: 215.9, height: 279.4 },
    legal: { width: 215.9, height: 355.6 },
    a3: { width: 297, height: 420 },
    a5: { width: 148, height: 210 },
  };
  
  const size = sizes[pageSize];
  const mmToPx = (mm: number) => Math.round((mm / 25.4) * 96); // Convert mm to pixels at 96 DPI
  
  if (orientation === 'landscape') {
    return {
      width: mmToPx(size.height),
      height: mmToPx(size.width),
    };
  }
  
  return {
    width: mmToPx(size.width),
    height: mmToPx(size.height),
  };
}

/**
 * Check if browser supports printing
 */
export function isPrintSupported(): boolean {
  return typeof window !== 'undefined' && 'print' in window;
}

/**
 * Detect if user is printing (print media query)
 */
export function onPrintStateChange(callback: (isPrinting: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('print');
  
  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches);
  };
  
  // Initial check
  handler(mediaQuery);
  
  // Listen for changes
  mediaQuery.addEventListener('change', handler);
  
  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
