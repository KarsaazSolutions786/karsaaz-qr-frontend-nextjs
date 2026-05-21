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
 * Purpose: Export SVG to EPS
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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

  let eps = generateEPSFromSVG(svg, {
    width,
    height,
    boundingBox,
    hiResBoundingBox,
    includePreview,
    metadata,
  });

  // If vector conversion produced a raster placeholder, render it async
  if (eps.includes('% [RASTER_PLACEHOLDER]')) {
    eps = await generateRasterEPS(svg, eps, width, height);
  }

  // Create blob and download
  const blob = new Blob([eps], { type: 'application/postscript' });
  downloadBlob(blob, filename);
}

/**
 * Purpose: Generate EPS content from SVG
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Convert SVG to PostScript commands. Strategy: try vector conversion first (rects, circles, paths). If the SVG produces zero drawing commands (complex SVG the regex parser cannot handle), fall back to rasterising the SVG onto a canvas and embedding the image data as ASCII85-encoded Level-2 PostScript.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function svgToPostScript(svg: string, width: number, height: number): string {
  const vectorPS = svgToPostScriptVector(svg, width, height);

  // If the vector converter produced at least one drawing command, use it.
  // We detect this by checking for any fill/stroke operator.
  if (/\b[fs]\b/.test(vectorPS)) {
    return vectorPS;
  }

  // Fallback: embed a rasterised PNG via PostScript Level 2 image operator.
  // This path is async-unfriendly, so we return a placeholder that exportEPS
  // will replace.  See generateEPSFromSVG for the async handling.
  return `% [RASTER_PLACEHOLDER]\n`;
}

/**
 * Purpose: Vector SVG-to-PostScript conversion for rects, circles, and path elements.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

function svgToPostScriptVector(svg: string, width: number, height: number): string {
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

  // Extract rectangles
  const rectMatches = svg.matchAll(/<rect[^>]*>/g);
  for (const match of rectMatches) {
    const rect = match[0];
    const x = parseFloat(rect.match(/x="([^"]+)"/)?.[ 1] || '0');
    const y = parseFloat(rect.match(/y="([^"]+)"/)?.[ 1] || '0');
    const w = parseFloat(rect.match(/width="([^"]+)"/)?.[ 1] || '0');
    const h = parseFloat(rect.match(/height="([^"]+)"/)?.[ 1] || '0');
    const fill = rect.match(/fill="([^"]+)"/)?.[ 1] || '#000000';

    if (fill === 'none') continue;
    const rgb = hexToRGB(fill);
    ps += `${rgb.r} ${rgb.g} ${rgb.b} rgb\n`;
    ps += `${x} ${svgHeight - y - h} ${w} ${h} rec f\n`;
  }

  // Extract paths
  const pathMatches = svg.matchAll(/<path[^>]*d="([^"]+)"[^>]*>/g);
  for (const match of pathMatches) {
    const d = match[1] ?? '';
    const fill = match[0]?.match(/fill="([^"]+)"/)?.[ 1] || '#000000';

    if (fill === 'none') continue;
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

    if (fill === 'none') continue;
    const rgb = hexToRGB(fill);
    ps += `${rgb.r} ${rgb.g} ${rgb.b} rgb\n`;
    ps += `${cx} ${svgHeight - cy} ${r} 0 360 arc f\n`;
  }

  return ps;
}

/**
 * Purpose: Generate EPS with raster fallback (async). Renders the SVG onto a canvas, then embeds the raw RGB pixel data using PostScript Level 2 image / colorimage operator with ASCII hex encoding.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

async function generateRasterEPS(
  svg: string,
  epsTemplate: string,
  width: number,
  height: number,
): Promise<string> {
  // Render SVG to canvas
  const pixelSize = Math.min(Math.max(Math.round(width), 512), 2048);
  const canvas = document.createElement('canvas');
  canvas.width = pixelSize;
  canvas.height = pixelSize;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create canvas context for EPS raster fallback');
  }

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to rasterize SVG for EPS export'));
    const encoded = encodeURIComponent(svg)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22');
    image.src = `data:image/svg+xml;charset=utf-8,${encoded}`;
  });

  ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
  const imageData = ctx.getImageData(0, 0, pixelSize, pixelSize);

  // Build hex-encoded RGB data (drop alpha channel)
  const hexLines: string[] = [];
  let line = '';
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = (imageData.data[i] ?? 0).toString(16).padStart(2, '0');
    const g = (imageData.data[i + 1] ?? 0).toString(16).padStart(2, '0');
    const b = (imageData.data[i + 2] ?? 0).toString(16).padStart(2, '0');
    line += r + g + b;
    if (line.length >= 72) {
      hexLines.push(line);
      line = '';
    }
  }
  if (line.length > 0) hexLines.push(line);

  // PostScript image operator
  const imagePS = [
    `% Raster image fallback (${pixelSize}x${pixelSize})`,
    'gsave',
    `${width} ${height} scale`,
    `${pixelSize} ${pixelSize} 8`,
    `[${pixelSize} 0 0 -${pixelSize} 0 ${pixelSize}]`,
    '{currentfile /ASCIIHexDecode filter}',
    'false 3 colorimage',
    ...hexLines,
    '>',
    'grestore',
  ].join('\n');

  return epsTemplate.replace('% [RASTER_PLACEHOLDER]\n', imagePS + '\n');
}

/**
 * Purpose: Convert SVG path commands to PostScript
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Convert hex color to RGB (0-1 range for PostScript)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

function hexToRGB(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;
  return { r, g, b };
}

/**
 * Purpose: Download blob as file
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Get EPS as blob (async to support raster fallback)
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export async function getEPSBlob(svg: string, options: EPSExportOptions = {}): Promise<Blob> {
  let eps = generateEPSFromSVG(svg, options);

  if (eps.includes('% [RASTER_PLACEHOLDER]')) {
    eps = await generateRasterEPS(
      svg,
      eps,
      options.width ?? 300,
      options.height ?? 300,
    );
  }

  return new Blob([eps], { type: 'application/postscript' });
}

/**
 * Purpose: Get EPS file size
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function getEPSFileSize(svg: string, options: EPSExportOptions = {}): number {
  const eps = generateEPSFromSVG(svg, options);
  return new Blob([eps]).size;
}

/**
 * Purpose: Format EPS file size
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function formatEPSSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
