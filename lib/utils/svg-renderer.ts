/**
 * SVG Renderer
 * 
 * Main SVG rendering engine for QR codes with full designer configuration support.
 * Orchestrates module shapes, corner shapes, fills, logos, backgrounds, and stickers.
 */

import QRCode from 'qrcode-generator';
import { DesignerConfig, FillConfig } from '@/types/entities/designer';
import { StickerConfig, getStickerPosition } from '@/types/entities/sticker';
import { isDark, getModuleNeighbors, isCornerPosition } from './qrcode-utils';
import { needsLogoMarginClearing, getCornerModuleType } from './qrcode-generator';
import { renderModule, ModuleRenderContext } from './module-shapes';
import { renderAllCorners } from './corner-shapes';
import { fillToSVGDefinition, fillToSVGReference, isSolidFill, isGradientFill } from './fill-handlers';
import { renderOutline } from './outline-renderer';
import { calculateStickerPosition } from './sticker-utils';

export interface SVGRenderOptions {
  qr: QRCode;
  moduleCount: number;
  config: DesignerConfig;
  stickerConfig?: StickerConfig | null;
}

/**
 * Generate complete QR code SVG
 */
export function generateQRCodeSVG(options: SVGRenderOptions): string {
  const { qr, moduleCount, config, stickerConfig } = options;

  const moduleSize = config.size / (moduleCount + config.margin * 2);
  const totalSize = config.size;
  const offset = config.margin * moduleSize;

  // Build SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}">`;

  // Background
  svg += renderBackground(config, totalSize);

  // Define patterns/gradients if needed
  svg += renderDefinitions(config);

  // Render modules (data pattern)
  svg += '<g class="qr-modules">';
  svg += renderModules(qr, moduleCount, moduleSize, offset, config);
  svg += '</g>';

  // Render corners (finder patterns)
  const foregroundColor = getForegroundColor(config);
  svg += '<g class="qr-corners">';
  svg += renderAllCorners(
    config.cornerFrameStyle,
    config.cornerDotStyle,
    moduleSize,
    moduleCount,
    config.margin,
    foregroundColor
  );
  svg += '</g>';

  // Render logo if configured
  if (config.logo) {
    svg += renderLogo(config.logo, totalSize);
  }

  // Render sticker if configured
  if (stickerConfig) {
    svg += renderSticker(stickerConfig, totalSize);
  }

  svg += '</svg>';

  // Add outline if configured
  if (config.outline && config.outline.enabled) {
    svg = renderOutline({
      svg,
      size: totalSize,
      outline: config.outline,
    });
  }

  return svg;
}

/**
 * Render background
 */
function renderBackground(config: DesignerConfig, size: number): string {
  const bg = config.background;

  if (bg.type === 'transparent') {
    return '';
  }

  if (bg.type === 'solid' && bg.color) {
    return `<rect width="${size}" height="${size}" fill="${bg.color}"/>`;
  }

  if (bg.type === 'gradient' && bg.gradientStart && bg.gradientEnd) {
    const gradientId = 'bg-gradient';
    return `<rect width="${size}" height="${size}" fill="url(#${gradientId})"/>`;
  }

  if (bg.type === 'image' && bg.imageUrl) {
    const opacity = bg.imageOpacity ?? 1;
    return `<image href="${bg.imageUrl}" width="${size}" height="${size}" opacity="${opacity}" preserveAspectRatio="xMidYMid slice"/>`;
  }

  // Default white background
  return `<rect width="${size}" height="${size}" fill="#FFFFFF"/>`;
}

/**
 * Render SVG definitions (gradients, patterns, etc.)
 */
function renderDefinitions(config: DesignerConfig): string {
  let defs = '<defs>';

  // Foreground gradient
  if (config.foregroundFill.type === 'gradient') {
    defs += renderGradientDefinition('fg-gradient', config.foregroundFill);
  }

  // Background gradient
  if (
    config.background.type === 'gradient' &&
    config.background.gradientStart &&
    config.background.gradientEnd
  ) {
    const gradType = config.background.gradientType || 'linear';
    defs += renderGradientDefinitionFromColors(
      'bg-gradient',
      config.background.gradientStart,
      config.background.gradientEnd,
      gradType
    );
  }

  defs += '</defs>';

  return defs;
}

/**
 * Render gradient definition
 */
function renderGradientDefinition(id: string, fill: FillConfig): string {
  if (fill.type !== 'gradient') return '';

  const { gradientType, startColor, endColor, rotation = 0 } = fill;

  if (gradientType === 'linear') {
    // Calculate gradient direction based on rotation
    const rad = (rotation * Math.PI) / 180;
    const x1 = 50 - 50 * Math.cos(rad);
    const y1 = 50 - 50 * Math.sin(rad);
    const x2 = 50 + 50 * Math.cos(rad);
    const y2 = 50 + 50 * Math.sin(rad);

    return `
      <linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="${startColor}"/>
        <stop offset="100%" stop-color="${endColor}"/>
      </linearGradient>
    `;
  } else {
    // Radial gradient
    return `
      <radialGradient id="${id}">
        <stop offset="0%" stop-color="${startColor}"/>
        <stop offset="100%" stop-color="${endColor}"/>
      </radialGradient>
    `;
  }
}

/**
 * Render gradient from colors
 */
function renderGradientDefinitionFromColors(
  id: string,
  startColor: string,
  endColor: string,
  type: 'linear' | 'radial'
): string {
  if (type === 'linear') {
    return `
      <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${startColor}"/>
        <stop offset="100%" stop-color="${endColor}"/>
      </linearGradient>
    `;
  } else {
    return `
      <radialGradient id="${id}">
        <stop offset="0%" stop-color="${startColor}"/>
        <stop offset="100%" stop-color="${endColor}"/>
      </radialGradient>
    `;
  }
}

/**
 * Render all modules
 */
function renderModules(
  qr: QRCode,
  moduleCount: number,
  moduleSize: number,
  offset: number,
  config: DesignerConfig
): string {
  let modules = '';
  const fill = getForegroundFill(config);

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!isDark(qr, row, col)) continue;

      // Skip corner modules (rendered separately)
      const cornerInfo = isCornerPosition(row, col, moduleCount);
      if (cornerInfo.isCorner) continue;

      // Skip logo area if logo is configured
      if (config.logo && needsLogoMarginClearing(row, col, moduleCount, config.logo.size, config.logo.margin)) {
        continue;
      }

      const x = offset + col * moduleSize;
      const y = offset + row * moduleSize;

      const ctx: ModuleRenderContext = {
        row,
        col,
        x,
        y,
        size: moduleSize,
        qr,
        moduleCount,
        neighbors: getModuleNeighbors(qr, row, col, moduleCount),
      };

      modules += renderModule(config.moduleShape, ctx);
    }
  }

  return `<g fill="${fill}">${modules}</g>`;
}

/**
 * Get foreground fill (color or gradient reference)
 */
function getForegroundFill(config: DesignerConfig): string {
  if (config.foregroundFill.type === 'solid') {
    return config.foregroundFill.color;
  }

  if (config.foregroundFill.type === 'gradient') {
    return 'url(#fg-gradient)';
  }

  return '#000000'; // Default black
}

/**
 * Get foreground color (for corners)
 */
function getForegroundColor(config: DesignerConfig): string {
  if (config.foregroundFill.type === 'solid') {
    return config.foregroundFill.color;
  }

  if (config.foregroundFill.type === 'gradient') {
    return config.foregroundFill.startColor;
  }

  return '#000000';
}

/**
 * Render logo
 */
function renderLogo(logo: NonNullable<DesignerConfig['logo']>, svgSize: number): string {
  const logoSize = svgSize * logo.size;
  const x = (svgSize - logoSize) / 2;
  const y = (svgSize - logoSize) / 2;

  let logoSvg = '<g class="qr-logo">';

  // Background behind logo
  if (logo.backgroundColor) {
    const bgPadding = logoSize * 0.1;
    const bgSize = logoSize + bgPadding * 2;
    const bgX = x - bgPadding;
    const bgY = y - bgPadding;

    if (logo.shape === 'circle') {
      const cx = svgSize / 2;
      const cy = svgSize / 2;
      const radius = bgSize / 2;
      logoSvg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${logo.backgroundColor}"/>`;
    } else {
      logoSvg += `<rect x="${bgX}" y="${bgY}" width="${bgSize}" height="${bgSize}" fill="${logo.backgroundColor}"/>`;
    }
  }

  // Logo image
  if (logo.shape === 'circle') {
    const clipId = 'logo-clip';
    const cx = svgSize / 2;
    const cy = svgSize / 2;
    const radius = logoSize / 2;

    logoSvg += `
      <defs>
        <clipPath id="${clipId}">
          <circle cx="${cx}" cy="${cy}" r="${radius}"/>
        </clipPath>
      </defs>
    `;
    logoSvg += `<image href="${logo.url}" x="${x}" y="${y}" width="${logoSize}" height="${logoSize}" clip-path="url(#${clipId})"/>`;
  } else {
    logoSvg += `<image href="${logo.url}" x="${x}" y="${y}" width="${logoSize}" height="${logoSize}"/>`;
  }

  // Border around logo
  if (logo.borderWidth && logo.borderColor) {
    if (logo.shape === 'circle') {
      const cx = svgSize / 2;
      const cy = svgSize / 2;
      const radius = logoSize / 2;
      logoSvg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${logo.borderColor}" stroke-width="${logo.borderWidth}"/>`;
    } else {
      logoSvg += `<rect x="${x}" y="${y}" width="${logoSize}" height="${logoSize}" fill="none" stroke="${logo.borderColor}" stroke-width="${logo.borderWidth}"/>`;
    }
  }

  logoSvg += '</g>';
  return logoSvg;
}

/**
 * Render sticker
 */
function renderSticker(sticker: StickerConfig, svgSize: number): string {
  // Use utility function for proper position calculation
  const { x, y } = calculateStickerPosition(sticker.position, svgSize, sticker.size);
  const stickerSize = svgSize * sticker.size;

  const rotation = sticker.rotation || 0;
  const opacity = sticker.opacity || 1;

  let transform = '';
  if (rotation !== 0) {
    const cx = x + stickerSize / 2;
    const cy = y + stickerSize / 2;
    transform = `transform="rotate(${rotation} ${cx} ${cy})"`;
  }

  return `<image class="qr-sticker" href="${sticker.url}" x="${x}" y="${y}" width="${stickerSize}" height="${stickerSize}" opacity="${opacity}" ${transform}/>`;
}

/**
 * Convert SVG string to data URL
 */
export function svgToDataURL(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Get SVG element from string
 */
export function svgStringToElement(svg: string): SVGSVGElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  return doc.documentElement as unknown as SVGSVGElement;
}
