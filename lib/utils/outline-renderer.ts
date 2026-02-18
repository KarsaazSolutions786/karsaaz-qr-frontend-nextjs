/**
 * Outline Renderer
 * 
 * Renders outline/border around QR code modules.
 * Provides visual emphasis and branding opportunities.
 */

import { OutlineConfig } from '@/types/entities/designer';

export interface OutlineRenderContext {
  svg: string; // Existing SVG content
  size: number; // Total QR code size
  outline: OutlineConfig;
}

/**
 * Add outline to QR code SVG
 */
export function renderOutline(ctx: OutlineRenderContext): string {
  if (!ctx.outline.enabled || !ctx.outline.color || !ctx.outline.width) {
    return ctx.svg;
  }

  const { size, outline } = ctx;
  const color = outline.color!;
  const width = outline.width!;

  // Insert outline rect after opening svg tag
  const svgOpenTagEnd = ctx.svg.indexOf('>');
  if (svgOpenTagEnd === -1) return ctx.svg;

  const outlineRect = `
    <rect 
      x="${width / 2}" 
      y="${width / 2}" 
      width="${size - width}" 
      height="${size - width}" 
      fill="none" 
      stroke="${color}" 
      stroke-width="${width}"
      class="qr-outline"
    />
  `;

  return (
    ctx.svg.slice(0, svgOpenTagEnd + 1) +
    outlineRect +
    ctx.svg.slice(svgOpenTagEnd + 1)
  );
}

/**
 * Add rounded outline
 */
export function renderRoundedOutline(ctx: OutlineRenderContext, borderRadius: number): string {
  if (!ctx.outline.enabled || !ctx.outline.color || !ctx.outline.width) {
    return ctx.svg;
  }

  const { size, outline } = ctx;
  const color = outline.color!;
  const width = outline.width!;

  const svgOpenTagEnd = ctx.svg.indexOf('>');
  if (svgOpenTagEnd === -1) return ctx.svg;

  const outlineRect = `
    <rect 
      x="${width / 2}" 
      y="${width / 2}" 
      width="${size - width}" 
      height="${size - width}" 
      rx="${borderRadius}"
      ry="${borderRadius}"
      fill="none" 
      stroke="${color}" 
      stroke-width="${width}"
      class="qr-outline qr-outline-rounded"
    />
  `;

  return (
    ctx.svg.slice(0, svgOpenTagEnd + 1) +
    outlineRect +
    ctx.svg.slice(svgOpenTagEnd + 1)
  );
}

/**
 * Add circular outline
 */
export function renderCircularOutline(ctx: OutlineRenderContext): string {
  if (!ctx.outline.enabled || !ctx.outline.color || !ctx.outline.width) {
    return ctx.svg;
  }

  const { size, outline } = ctx;
  const color = outline.color!;
  const width = outline.width!;

  const svgOpenTagEnd = ctx.svg.indexOf('>');
  if (svgOpenTagEnd === -1) return ctx.svg;

  const center = size / 2;
  const radius = (size - width) / 2;

  const outlineCircle = `
    <circle 
      cx="${center}" 
      cy="${center}" 
      r="${radius}" 
      fill="none" 
      stroke="${color}" 
      stroke-width="${width}"
      class="qr-outline qr-outline-circular"
    />
  `;

  return (
    ctx.svg.slice(0, svgOpenTagEnd + 1) +
    outlineCircle +
    ctx.svg.slice(svgOpenTagEnd + 1)
  );
}

/**
 * Add dashed outline
 */
export function renderDashedOutline(
  ctx: OutlineRenderContext,
  dashArray: string = '10,5'
): string {
  if (!ctx.outline.enabled || !ctx.outline.color || !ctx.outline.width) {
    return ctx.svg;
  }

  const { size, outline } = ctx;
  const color = outline.color!;
  const width = outline.width!;

  const svgOpenTagEnd = ctx.svg.indexOf('>');
  if (svgOpenTagEnd === -1) return ctx.svg;

  const outlineRect = `
    <rect 
      x="${width / 2}" 
      y="${width / 2}" 
      width="${size - width}" 
      height="${size - width}" 
      fill="none" 
      stroke="${color}" 
      stroke-width="${width}"
      stroke-dasharray="${dashArray}"
      class="qr-outline qr-outline-dashed"
    />
  `;

  return (
    ctx.svg.slice(0, svgOpenTagEnd + 1) +
    outlineRect +
    ctx.svg.slice(svgOpenTagEnd + 1)
  );
}

/**
 * Add double outline (inner + outer)
 */
export function renderDoubleOutline(
  ctx: OutlineRenderContext,
  innerWidth: number,
  gap: number = 5
): string {
  if (!ctx.outline.enabled || !ctx.outline.color || !ctx.outline.width) {
    return ctx.svg;
  }

  const { size, outline } = ctx;
  const color = outline.color!;
  const width = outline.width!;

  const svgOpenTagEnd = ctx.svg.indexOf('>');
  if (svgOpenTagEnd === -1) return ctx.svg;

  // Outer outline
  const outerOffset = width / 2;
  const outerSize = size - width;

  // Inner outline
  const innerOffset = width + gap + innerWidth / 2;
  const innerSize = size - (width + gap + innerWidth) * 2;

  const doubleOutline = `
    <g class="qr-outline qr-outline-double">
      <rect 
        x="${outerOffset}" 
        y="${outerOffset}" 
        width="${outerSize}" 
        height="${outerSize}" 
        fill="none" 
        stroke="${color}" 
        stroke-width="${width}"
      />
      <rect 
        x="${innerOffset}" 
        y="${innerOffset}" 
        width="${innerSize}" 
        height="${innerSize}" 
        fill="none" 
        stroke="${color}" 
        stroke-width="${innerWidth}"
      />
    </g>
  `;

  return (
    ctx.svg.slice(0, svgOpenTagEnd + 1) +
    doubleOutline +
    ctx.svg.slice(svgOpenTagEnd + 1)
  );
}

/**
 * Validate outline configuration
 */
export function validateOutlineConfig(outline: OutlineConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (outline.enabled) {
    if (outline.color && !/^#[0-9A-F]{6}$/i.test(outline.color)) {
      errors.push('Invalid outline color format');
    }

    if (outline.width !== undefined && (outline.width < 0 || outline.width > 50)) {
      errors.push('Outline width must be between 0 and 50 pixels');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create default outline config
 */
export function createDefaultOutlineConfig(): OutlineConfig {
  return {
    enabled: false,
  };
}

/**
 * Create enabled outline config
 */
export function createEnabledOutlineConfig(
  color: string = '#000000',
  width: number = 4
): OutlineConfig {
  return {
    enabled: true,
    color,
    width,
  };
}

/**
 * Get outline description (for UI)
 */
export function getOutlineDescription(outline: OutlineConfig): string {
  if (!outline.enabled) {
    return 'No outline';
  }

  const width = outline.width ?? 4;
  const color = outline.color ?? '#000000';

  return `${width}px ${color} outline`;
}

/**
 * Calculate optimal outline width based on QR size
 */
export function getOptimalOutlineWidth(qrSize: number): number {
  if (qrSize <= 256) return 2;
  if (qrSize <= 512) return 4;
  if (qrSize <= 1024) return 6;
  return 8;
}

/**
 * Check if outline is too thick
 */
export function isOutlineTooThick(width: number, qrSize: number): boolean {
  const ratio = width / qrSize;
  return ratio > 0.05; // More than 5% of QR size
}

/**
 * Adjust outline for QR size
 */
export function adjustOutlineForSize(outline: OutlineConfig, qrSize: number): OutlineConfig {
  if (!outline.enabled || !outline.width) {
    return outline;
  }

  // Cap outline at 5% of QR size
  const maxWidth = qrSize * 0.05;
  const adjustedWidth = Math.min(outline.width, maxWidth);

  return {
    ...outline,
    width: adjustedWidth,
  };
}

/**
 * Clone outline config
 */
export function cloneOutlineConfig(outline: OutlineConfig): OutlineConfig {
  return JSON.parse(JSON.stringify(outline));
}

/**
 * Merge outline configs
 */
export function mergeOutlineConfig(
  base: OutlineConfig,
  updates: Partial<OutlineConfig>
): OutlineConfig {
  return {
    ...base,
    ...updates,
  };
}
