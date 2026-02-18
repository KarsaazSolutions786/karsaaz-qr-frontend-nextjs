/**
 * SVG Export Utility
 * 
 * Export QR codes as SVG files with various options.
 */

import { svgToDataURL } from './svg-renderer';

export interface SVGExportOptions {
  filename?: string;
  optimized?: boolean; // Minify SVG
  includeXmlDeclaration?: boolean;
  addBackgroundRect?: boolean; // Add white background rect
  backgroundColor?: string;
  embedFonts?: boolean; // Embed custom fonts
  metadata?: {
    title?: string;
    description?: string;
    author?: string;
    keywords?: string[];
  };
}

/**
 * Export SVG to file
 */
export async function exportSVG(svg: string, options: SVGExportOptions = {}): Promise<void> {
  const {
    filename = 'qr-code.svg',
    optimized = false,
    includeXmlDeclaration = true,
    addBackgroundRect = false,
    backgroundColor = '#ffffff',
    embedFonts = false,
    metadata,
  } = options;

  let processedSvg = svg;

  // Add XML declaration
  if (includeXmlDeclaration && !processedSvg.startsWith('<?xml')) {
    processedSvg = `<?xml version="1.0" encoding="UTF-8"?>\n${processedSvg}`;
  }

  // Add metadata
  if (metadata) {
    processedSvg = addSVGMetadata(processedSvg, metadata);
  }

  // Add background rect
  if (addBackgroundRect) {
    processedSvg = addBackgroundRectToSVG(processedSvg, backgroundColor);
  }

  // Optimize SVG
  if (optimized) {
    processedSvg = optimizeSVG(processedSvg);
  }

  // Embed fonts if needed
  if (embedFonts) {
    processedSvg = await embedFontsInSVG(processedSvg);
  }

  // Create blob and download
  const blob = new Blob([processedSvg], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, filename);
}

/**
 * Get SVG as data URL
 */
export function getSVGDataURL(svg: string, options: SVGExportOptions = {}): string {
  const { includeXmlDeclaration = false } = options;

  let processedSvg = svg;

  // Remove XML declaration for data URLs
  if (!includeXmlDeclaration && processedSvg.startsWith('<?xml')) {
    processedSvg = processedSvg.replace(/<\?xml[^?]*\?>\s*/g, '');
  }

  return svgToDataURL(processedSvg);
}

/**
 * Get SVG as blob
 */
export function getSVGBlob(svg: string, options: SVGExportOptions = {}): Blob {
  const { optimized = false } = options;

  let processedSvg = svg;

  if (optimized) {
    processedSvg = optimizeSVG(processedSvg);
  }

  return new Blob([processedSvg], { type: 'image/svg+xml;charset=utf-8' });
}

/**
 * Add metadata to SVG
 */
function addSVGMetadata(
  svg: string,
  metadata: Required<SVGExportOptions>['metadata']
): string {
  if (!metadata) return svg;

  const { title, description, author, keywords } = metadata;

  // Build metadata XML
  let metadataXml = '<metadata>\n';

  if (title) {
    metadataXml += `  <dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(title)}</dc:title>\n`;
  }

  if (description) {
    metadataXml += `  <dc:description xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(description)}</dc:description>\n`;
  }

  if (author) {
    metadataXml += `  <dc:creator xmlns:dc="http://purl.org/dc/elements/1.1/">${escapeXml(author)}</dc:creator>\n`;
  }

  if (keywords && keywords.length > 0) {
    metadataXml += `  <dc:subject xmlns:dc="http://purl.org/dc/elements/1.1/">${keywords.map(escapeXml).join(', ')}</dc:subject>\n`;
  }

  metadataXml += '</metadata>';

  // Insert metadata after opening <svg> tag
  return svg.replace(/(<svg[^>]*>)/, `$1\n${metadataXml}`);
}

/**
 * Add background rectangle to SVG
 */
function addBackgroundRectToSVG(svg: string, backgroundColor: string): string {
  // Extract viewBox or width/height
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const widthMatch = svg.match(/width="([^"]+)"/);
  const heightMatch = svg.match(/height="([^"]+)"/);

  let bgRect = '';

  if (viewBoxMatch && viewBoxMatch[1]) {
    const parts = viewBoxMatch[1].split(/\s+/);
    const width = parts[2] ?? '0';
    const height = parts[3] ?? '0';
    bgRect = `<rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}"/>`;
  } else if (widthMatch && heightMatch && widthMatch[1] && heightMatch[1]) {
    bgRect = `<rect x="0" y="0" width="${widthMatch[1]}" height="${heightMatch[1]}" fill="${backgroundColor}"/>`;
  }

  // Insert background rect after opening <svg> tag and any <defs>
  return svg.replace(/(<svg[^>]*>(?:\s*<defs>[\s\S]*?<\/defs>)?)/, `$1\n${bgRect}`);
}

/**
 * Optimize SVG (minify)
 */
function optimizeSVG(svg: string): string {
  return svg
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    // Remove empty attributes
    .replace(/\s+(\w+)=""\s*/g, ' ')
    // Trim
    .trim();
}

/**
 * Embed fonts in SVG (placeholder - requires actual font data)
 */
async function embedFontsInSVG(svg: string): Promise<string> {
  // This is a placeholder - actual implementation would require:
  // 1. Detect fonts used in SVG
  // 2. Fetch font files
  // 3. Convert to base64
  // 4. Embed as @font-face in <defs>
  
  // For now, just return the SVG unchanged
  return svg;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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
 * Copy SVG to clipboard
 */
export async function copySVGToClipboard(svg: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(svg);
  } catch (error) {
    throw new Error('Failed to copy SVG to clipboard');
  }
}

/**
 * Get SVG file size
 */
export function getSVGFileSize(svg: string): number {
  return new Blob([svg]).size;
}

/**
 * Format file size for display
 */
export function formatSVGSize(svg: string): string {
  const bytes = getSVGFileSize(svg);
  
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate SVG
 */
export function validateSVG(svg: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for opening <svg> tag
  if (!svg.includes('<svg')) {
    errors.push('Missing <svg> opening tag');
  }

  // Check for closing </svg> tag
  if (!svg.includes('</svg>')) {
    errors.push('Missing </svg> closing tag');
  }

  // Check for viewBox or width/height
  if (!svg.match(/viewBox="[^"]+"/)) {
    if (!svg.match(/width="[^"]+"/) || !svg.match(/height="[^"]+"/)) {
      errors.push('Missing viewBox or width/height attributes');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Extract SVG dimensions
 */
export function getSVGDimensions(svg: string): { width: number; height: number } | null {
  // Try viewBox first
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  if (viewBoxMatch && viewBoxMatch[1]) {
    const parts = viewBoxMatch[1].split(/\s+/);
    return {
      width: parseFloat(parts[2] ?? '0'),
      height: parseFloat(parts[3] ?? '0'),
    };
  }

  // Try width/height attributes
  const widthMatch = svg.match(/width="([^"]+)"/);
  const heightMatch = svg.match(/height="([^"]+)"/);
  
  if (widthMatch && heightMatch && widthMatch[1] && heightMatch[1]) {
    return {
      width: parseFloat(widthMatch[1]),
      height: parseFloat(heightMatch[1]),
    };
  }

  return null;
}

/**
 * Resize SVG
 */
export function resizeSVG(svg: string, newWidth: number, newHeight: number): string {
  // Update viewBox to match new dimensions
  return svg
    .replace(/width="[^"]+"/g, `width="${newWidth}"`)
    .replace(/height="[^"]+"/g, `height="${newHeight}"`);
}
