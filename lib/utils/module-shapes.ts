/**
 * Module Shapes Renderer
 * 
 * Generates SVG path data for different QR code module shapes
 * (square, rounded, dots, circular, diamond, etc.)
 */

import { ModuleShape } from '@/types/entities/designer';
import { getModuleNeighbors } from './qrcode-utils';

export interface ModuleRenderContext {
  row: number;
  col: number;
  x: number;
  y: number;
  size: number;
  qr: any; // QRCode from qrcode-generator
  moduleCount: number;
  neighbors?: ReturnType<typeof getModuleNeighbors>;
}

/**
 * Generate SVG path for square module
 */
export function renderSquareModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}"/>`;
}

/**
 * Generate SVG path for rounded module
 */
export function renderRoundedModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const radius = size * 0.25; // 25% corner radius
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" ry="${radius}"/>`;
}

/**
 * Generate SVG path for dot module
 */
export function renderDotModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const radius = size / 2;
  return `<circle cx="${cx}" cy="${cy}" r="${radius}"/>`;
}

/**
 * Generate SVG path for circular module (smaller than dot)
 */
export function renderCircularModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const radius = size / 2.2; // Slightly smaller than full size
  return `<circle cx="${cx}" cy="${cy}" r="${radius}"/>`;
}

/**
 * Generate SVG path for diamond module
 */
export function renderDiamondModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const half = size / 2;
  const cx = x + half;
  const cy = y + half;

  const points = [
    `${cx},${y}`, // Top
    `${x + size},${cy}`, // Right
    `${cx},${y + size}`, // Bottom
    `${x},${cy}`, // Left
  ].join(' ');

  return `<polygon points="${points}"/>`;
}

/**
 * Generate SVG path for classy module (rounded based on neighbors)
 */
export function renderClassyModule(ctx: ModuleRenderContext): string {
  const { x, y, size, neighbors } = ctx;

  if (!neighbors) {
    return renderRoundedModule(ctx);
  }

  // Determine which corners should be rounded based on neighbors
  const roundTopLeft = !neighbors.top && !neighbors.left;
  const roundTopRight = !neighbors.top && !neighbors.right;
  const roundBottomLeft = !neighbors.bottom && !neighbors.left;
  const roundBottomRight = !neighbors.bottom && !neighbors.right;

  const radius = size * 0.35;

  if (!roundTopLeft && !roundTopRight && !roundBottomLeft && !roundBottomRight) {
    // No rounding needed
    return renderSquareModule(ctx);
  }

  // Build path with selective corner rounding
  let path = `M ${x + (roundTopLeft ? radius : 0)} ${y}`;

  // Top edge
  path += ` L ${x + size - (roundTopRight ? radius : 0)} ${y}`;

  // Top-right corner
  if (roundTopRight) {
    path += ` Q ${x + size} ${y} ${x + size} ${y + radius}`;
  }

  // Right edge
  path += ` L ${x + size} ${y + size - (roundBottomRight ? radius : 0)}`;

  // Bottom-right corner
  if (roundBottomRight) {
    path += ` Q ${x + size} ${y + size} ${x + size - radius} ${y + size}`;
  }

  // Bottom edge
  path += ` L ${x + (roundBottomLeft ? radius : 0)} ${y + size}`;

  // Bottom-left corner
  if (roundBottomLeft) {
    path += ` Q ${x} ${y + size} ${x} ${y + size - radius}`;
  }

  // Left edge
  path += ` L ${x} ${y + (roundTopLeft ? radius : 0)}`;

  // Top-left corner
  if (roundTopLeft) {
    path += ` Q ${x} ${y} ${x + radius} ${y}`;
  }

  path += ' Z';

  return `<path d="${path}"/>`;
}

/**
 * Generate SVG path for classy-rounded module (smoother version)
 */
export function renderClassyRoundedModule(ctx: ModuleRenderContext): string {
  const { x, y, size, neighbors } = ctx;

  if (!neighbors) {
    return renderRoundedModule(ctx);
  }

  // More aggressive rounding for connected modules
  const radius = size * 0.5;

  const roundTopLeft = !neighbors.top || !neighbors.left;
  const roundTopRight = !neighbors.top || !neighbors.right;
  const roundBottomLeft = !neighbors.bottom || !neighbors.left;
  const roundBottomRight = !neighbors.bottom || !neighbors.right;

  let path = `M ${x + (roundTopLeft ? radius : 0)} ${y}`;

  // Top edge
  path += ` L ${x + size - (roundTopRight ? radius : 0)} ${y}`;

  // Top-right corner
  if (roundTopRight) {
    path += ` Q ${x + size} ${y} ${x + size} ${y + radius}`;
  }

  // Right edge
  path += ` L ${x + size} ${y + size - (roundBottomRight ? radius : 0)}`;

  // Bottom-right corner
  if (roundBottomRight) {
    path += ` Q ${x + size} ${y + size} ${x + size - radius} ${y + size}`;
  }

  // Bottom edge
  path += ` L ${x + (roundBottomLeft ? radius : 0)} ${y + size}`;

  // Bottom-left corner
  if (roundBottomLeft) {
    path += ` Q ${x} ${y + size} ${x} ${y + size - radius}`;
  }

  // Left edge
  path += ` L ${x} ${y + (roundTopLeft ? radius : 0)}`;

  // Top-left corner
  if (roundTopLeft) {
    path += ` Q ${x} ${y} ${x + radius} ${y}`;
  }

  path += ' Z';

  return `<path d="${path}"/>`;
}

/**
 * Main module renderer - selects appropriate shape renderer
 */
export function renderModule(
  shape: ModuleShape,
  ctx: ModuleRenderContext
): string {
  switch (shape) {
    case 'square':
      return renderSquareModule(ctx);
    case 'rounded':
      return renderRoundedModule(ctx);
    case 'dots':
      return renderDotModule(ctx);
    case 'circular':
      return renderCircularModule(ctx);
    case 'diamond':
      return renderDiamondModule(ctx);
    case 'classy':
      return renderClassyModule(ctx);
    case 'classy-rounded':
      return renderClassyRoundedModule(ctx);
    default:
      return renderSquareModule(ctx);
  }
}

/**
 * Batch render modules (optimized for performance)
 */
export function renderModuleBatch(
  shape: ModuleShape,
  contexts: ModuleRenderContext[]
): string {
  // For simple shapes, we can use a single path element
  if (shape === 'square' || shape === 'rounded' || shape === 'dots' || shape === 'circular') {
    return contexts.map(ctx => renderModule(shape, ctx)).join('\n');
  }

  // For complex shapes, render individually
  return contexts.map(ctx => renderModule(shape, ctx)).join('\n');
}

/**
 * Get module shape description (for UI)
 */
export function getModuleShapeDescription(shape: ModuleShape): string {
  const descriptions: Record<ModuleShape, string> = {
    square: 'Classic square modules',
    rounded: 'Rounded corner modules',
    dots: 'Circular dots',
    circular: 'Smooth circles',
    diamond: 'Diamond shapes',
    classy: 'Contextual rounded corners',
    'classy-rounded': 'Smooth contextual rounding',
  };

  return descriptions[shape] || 'Unknown shape';
}
