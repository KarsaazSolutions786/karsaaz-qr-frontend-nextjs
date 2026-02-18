/**
 * EPS Export Utility
 * 
 * Export QR codes as EPS (Encapsulated PostScript) files.
 * EPS is a vector format commonly used for professional printing.
 */

import { getSVGDimensions } from './export-svg';

export interface EPSExportOptions {
  filename?: string;
  width?: number; // Width in points (1/72 inch)
  height?: number; // Height in points
  boundingBox?: boolean; // Include BoundingBox
  hiResBoundingBox?: boolean; // Include HiResBoundingBox
  includePreview?: boolean; // Include preview (TIFF or EPSI)
  metadata?: {
    title?: string;
    creator?: string;
    creationDate?: string;
  };
}

/**
 * Export SVG to EPS
 */
export async function exportEPS(svg: string, options: EPSExportOptions = {}): Promise<void> {
  const {
    filename = 'qr-code.eps',
    width = 300,
    height = 300,
    boundingBox = true,
    hiResBoundingBox = true,
    includePreview = false,
    metadata,
  } = options;

  const eps = generateEPSFromSVG(svg, {
    width,
    height,
    boundingBox,
    hiResBoundingBox,
    includePreview,
    metadata,
  });

  // Create blob and download
  const blob = new Blob([eps], { type: 'application/postscript' });
  downloadBlob(blob, filename);
}

/**
 * Generate EPS content from SVG
 */
function generateEPSFromSVG(svg: string, options: EPSExportOptions): string {
  const {
    width = 300,
    height = 300,
    boundingBox = true,
    hiResBoundingBox = true,
    metadata,
  } = options;

  let eps = '';

  // EPS Header
  eps += '%!PS-Adobe-3.0 EPSF-3.0\n';

  // Bounding Box
  if (boundingBox) {
    eps += `%%BoundingBox: 0 0 ${Math.round(width)} ${Math.round(height)}\n`;
  }

  if (hiResBoundingBox) {
    eps += `%%HiResBoundingBox: 0.0 0.0 ${width.toFixed(4)} ${height.toFixed(4)}\n`;
  }

  // Metadata
  if (metadata) {
    if (metadata.title) {
      eps += `%%Title: ${metadata.title}\n`;
    }
    if (metadata.creator) {
      eps += `%%Creator: ${metadata.creator}\n`;
    }
    if (metadata.creationDate) {
      eps += `%%CreationDate: ${metadata.creationDate}\n`;
    }
  } else {
    eps += '%%Creator: Karsaaz QR Generator\n';
    eps += `%%CreationDate: ${new Date().toISOString()}\n`;
  }

  eps += '%%DocumentData: Clean7Bit\n';
  eps += '%%LanguageLevel: 2\n';
  eps += '%%EndComments\n\n';

  // Prolog
  eps += '%%BeginProlog\n';
  eps += '/bd { bind def } bind def\n';
  eps += '/ld { load def } bd\n';
  eps += '/m { moveto } bd\n';
  eps += '/l { lineto } bd\n';
  eps += '/rl { rlineto } bd\n';
  eps += '/c { curveto } bd\n';
  eps += '/h { closepath } bd\n';
  eps += '/f { fill } bd\n';
  eps += '/s { stroke } bd\n';
  eps += '/rgb { setrgbcolor } bd\n';
  eps += '/w { setlinewidth } bd\n';
  eps += '/rec { 4 2 roll moveto 1 index 0 rlineto 0 exch rlineto neg 0 rlineto closepath } bd\n';
  eps += '%%EndProlog\n\n';

  // Setup
  eps += '%%BeginSetup\n';
  eps += '%%EndSetup\n\n';

  // Page
  eps += '%%Page: 1 1\n';
  eps += 'gsave\n';

  // Convert SVG to PostScript commands
  eps += svgToPostScript(svg, width, height);

  eps += 'grestore\n';
  eps += 'showpage\n';
  eps += '%%EOF\n';

  return eps;
}

/**
 * Convert SVG to PostScript commands (simplified)
 */
function svgToPostScript(svg: string, width: number, height: number): string {
  let ps = '';

  // Extract SVG dimensions
  const svgDims = getSVGDimensions(svg);
  const svgWidth = svgDims?.width || 300;
  const svgHeight = svgDims?.height || 300;

  // Calculate scale
  const scaleX = width / svgWidth;
  const scaleY = height / svgHeight;
  const scale = Math.min(scaleX, scaleY);

  // Set scale
  ps += `${scale} ${scale} scale\n`;

  // Parse SVG elements (simplified - handles basic shapes)
  // In a full implementation, you'd parse the SVG DOM and convert each element

  // Extract rectangles
  const rectMatches = svg.matchAll(/<rect[^>]*>/g);
  for (const match of rectMatches) {
    const rect = match[0];
    const x = parseFloat(rect.match(/x="([^"]+)"/)?.[ 1] || '0');
    const y = parseFloat(rect.match(/y="([^"]+)"/)?.[ 1] || '0');
    const w = parseFloat(rect.match(/width="([^"]+)"/)?.[ 1] || '0');
    const h = parseFloat(rect.match(/height="([^"]+)"/)?.[ 1] || '0');
    const fill = rect.match(/fill="([^"]+)"/)?.[ 1] || '#000000';

    // Convert fill color to RGB
    const rgb = hexToRGB(fill);
    ps += `${rgb.r} ${rgb.g} ${rgb.b} rgb\n`;
    ps += `${x} ${svgHeight - y - h} ${w} ${h} rec f\n`;
  }

  // Extract paths (basic support)
  const pathMatches = svg.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g);
  for (const match of pathMatches) {
    const d = match[1] ?? '';
    const fill = match[0]?.match(/fill="([^"]+)"/)?.[ 1] || '#000000';

    const rgb = hexToRGB(fill);
    ps += `${rgb.r} ${rgb.g} ${rgb.b} rgb\n`;
    ps += pathToPostScript(d, svgHeight);
    ps += 'f\n';
  }

  // Extract circles
  const circleMatches = svg.matchAll(/<circle[^>]*>/g);
  for (const match of circleMatches) {
    const circle = match[0];
    const cx = parseFloat(circle.match(/cx="([^"]+)"/)?.[ 1] || '0');
    const cy = parseFloat(circle.match(/cy="([^"]+)"/)?.[ 1] || '0');
    const r = parseFloat(circle.match(/r="([^"]+)"/)?.[ 1] || '0');
    const fill = circle.match(/fill="([^"]+)"/)?.[ 1] || '#000000';

    const rgb = hexToRGB(fill);
    ps += `${rgb.r} ${rgb.g} ${rgb.b} rgb\n`;
    ps += `${cx} ${svgHeight - cy} ${r} 0 360 arc f\n`;
  }

  return ps;
}

/**
 * Convert SVG path commands to PostScript
 */
function pathToPostScript(d: string, svgHeight: number): string {
  let ps = '';
  const commands = d.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];

  let currentX = 0;
  let currentY = 0;

  for (const cmd of commands) {
    const type = cmd[0] ?? '';
    const coords = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat);

    switch (type.toUpperCase()) {
      case 'M': // MoveTo
        currentX = coords[0] ?? 0;
        currentY = coords[1] ?? 0;
        ps += `${currentX} ${svgHeight - currentY} m\n`;
        break;

      case 'L': // LineTo
        currentX = coords[0] ?? 0;
        currentY = coords[1] ?? 0;
        ps += `${currentX} ${svgHeight - currentY} l\n`;
        break;

      case 'H': // Horizontal LineTo
        currentX = coords[0] ?? 0;
        ps += `${currentX} ${svgHeight - currentY} l\n`;
        break;

      case 'V': // Vertical LineTo
        currentY = coords[0] ?? 0;
        ps += `${currentX} ${svgHeight - currentY} l\n`;
        break;

      case 'C': // Cubic Bezier
        ps += `${coords[0] ?? 0} ${svgHeight - (coords[1] ?? 0)} ${coords[2] ?? 0} ${svgHeight - (coords[3] ?? 0)} ${coords[4] ?? 0} ${svgHeight - (coords[5] ?? 0)} c\n`;
        currentX = coords[4] ?? 0;
        currentY = coords[5] ?? 0;
        break;

      case 'Z': // ClosePath
        ps += 'h\n';
        break;
    }
  }

  return ps;
}

/**
 * Convert hex color to RGB (0-1 range for PostScript)
 */
function hexToRGB(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;
  return { r, g, b };
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
 * Get EPS as blob
 */
export function getEPSBlob(svg: string, options: EPSExportOptions = {}): Blob {
  const eps = generateEPSFromSVG(svg, options);
  return new Blob([eps], { type: 'application/postscript' });
}

/**
 * Get EPS file size
 */
export function getEPSFileSize(svg: string, options: EPSExportOptions = {}): number {
  const eps = generateEPSFromSVG(svg, options);
  return new Blob([eps]).size;
}

/**
 * Format EPS file size
 */
export function formatEPSSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
