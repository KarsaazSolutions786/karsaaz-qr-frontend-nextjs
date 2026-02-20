/**
 * Corner Shapes Renderer
 * 
 * Generates SVG elements for QR code corner patterns (finder patterns)
 * with customizable frame and dot styles.
 */

// Corner finder style types handled via string for backward compatibility

export interface CornerRenderContext {
  x: number; // Top-left X position
  y: number; // Top-left Y position
  moduleSize: number; // Size of one module
  position: 'top-left' | 'top-right' | 'bottom-left';
}

/**
 * Render corner frame (outer pattern)
 */
export function renderCornerFrame(
  style: string,
  ctx: CornerRenderContext,
  color: string
): string {
  const { x, y, moduleSize } = ctx;
  const size = moduleSize * 7; // Corner patterns are 7x7 modules

  switch (style) {
    case 'square':
    case 'default':
      return renderSquareFrame(x, y, size, moduleSize, color);
    case 'rounded':
    case 'rounded-corners':
      return renderRoundedFrame(x, y, size, moduleSize, color);
    case 'extra-rounded':
      return renderExtraRoundedFrame(x, y, size, moduleSize, color);
    case 'circular':
    case 'circle':
      return renderCircularFrame(x, y, size, moduleSize, color);
    case 'dot':
      return renderDotFrame(x, y, size, moduleSize, color);
    default:
      return renderSquareFrame(x, y, size, moduleSize, color);
  }
}

/**
 * Render corner dot (inner pattern)
 */
export function renderCornerDot(
  style: string,
  ctx: CornerRenderContext,
  color: string
): string {
  const { x, y, moduleSize } = ctx;
  const dotSize = moduleSize * 3; // Inner dot is 3x3 modules
  const dotX = x + moduleSize * 2; // Center dot with 2-module offset
  const dotY = y + moduleSize * 2;

  switch (style) {
    case 'square':
    case 'default':
      return `<rect x="${dotX}" y="${dotY}" width="${dotSize}" height="${dotSize}" fill="${color}"/>`;
    case 'rounded':
    case 'rounded-corners':
      const roundedRadius = dotSize * 0.3;
      return `<rect x="${dotX}" y="${dotY}" width="${dotSize}" height="${dotSize}" rx="${roundedRadius}" ry="${roundedRadius}" fill="${color}"/>`;
    case 'dot':
    case 'circle':
      const cx = dotX + dotSize / 2;
      const cy = dotY + dotSize / 2;
      const radius = dotSize / 2;
      return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${color}"/>`;
    default:
      return `<rect x="${dotX}" y="${dotY}" width="${dotSize}" height="${dotSize}" fill="${color}"/>`;
  }
}

/**
 * Square frame (7x7 with 5x5 hollow)
 */
function renderSquareFrame(
  x: number,
  y: number,
  size: number,
  moduleSize: number,
  color: string
): string {
  // Outer rectangle
  const outer = `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${color}"/>`;

  // Inner hollow (1 module border, so 5x5 hollow area)
  const innerX = x + moduleSize;
  const innerY = y + moduleSize;
  const innerSize = size - moduleSize * 2;
  const inner = `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" fill="none"/>`;

  return `<g>${outer}${inner}</g>`;
}

/**
 * Rounded frame
 */
function renderRoundedFrame(
  x: number,
  y: number,
  size: number,
  moduleSize: number,
  color: string
): string {
  const radius = moduleSize * 0.5;

  // Outer rounded rectangle
  const outer = `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${color}"/>`;

  // Inner hollow
  const innerX = x + moduleSize;
  const innerY = y + moduleSize;
  const innerSize = size - moduleSize * 2;
  const inner = `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" rx="${radius * 0.5}" ry="${radius * 0.5}" fill="white"/>`;

  return `<g>${outer}${inner}</g>`;
}

/**
 * Extra rounded frame
 */
function renderExtraRoundedFrame(
  x: number,
  y: number,
  size: number,
  moduleSize: number,
  color: string
): string {
  const outerRadius = moduleSize * 1.5;
  const innerRadius = moduleSize * 1.0;

  // Outer rounded rectangle
  const outer = `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${outerRadius}" ry="${outerRadius}" fill="${color}"/>`;

  // Inner hollow
  const innerX = x + moduleSize;
  const innerY = y + moduleSize;
  const innerSize = size - moduleSize * 2;
  const inner = `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" rx="${innerRadius}" ry="${innerRadius}" fill="white"/>`;

  return `<g>${outer}${inner}</g>`;
}

/**
 * Circular frame (ring shape)
 */
function renderCircularFrame(
  x: number,
  y: number,
  size: number,
  moduleSize: number,
  color: string
): string {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const outerRadius = size / 2;
  const innerRadius = (size - moduleSize * 2) / 2;

  // Create ring using two circles
  const outer = `<circle cx="${cx}" cy="${cy}" r="${outerRadius}" fill="${color}"/>`;
  const inner = `<circle cx="${cx}" cy="${cy}" r="${innerRadius}" fill="white"/>`;

  return `<g>${outer}${inner}</g>`;
}

/**
 * Dot frame (just dots at corners)
 */
function renderDotFrame(
  x: number,
  y: number,
  size: number,
  moduleSize: number,
  color: string
): string {
  const radius = moduleSize * 0.6;

  // Four corner dots
  const dots = [
    { cx: x + radius, cy: y + radius }, // Top-left
    { cx: x + size - radius, cy: y + radius }, // Top-right
    { cx: x + radius, cy: y + size - radius }, // Bottom-left
    { cx: x + size - radius, cy: y + size - radius }, // Bottom-right
  ];

  const dotElements = dots
    .map(({ cx, cy }) => `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${color}"/>`)
    .join('');

  // Frame outline
  const frameStroke = `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="${moduleSize * 0.3}"/>`;

  return `<g>${frameStroke}${dotElements}</g>`;
}

/**
 * Render complete corner (frame + dot)
 */
export function renderCompleteCorner(
  frameStyle: string,
  dotStyle: string,
  ctx: CornerRenderContext,
  color: string
): string {
  const frame = renderCornerFrame(frameStyle, ctx, color);
  const dot = renderCornerDot(dotStyle, ctx, color);

  return `<g class="qr-corner qr-corner-${ctx.position}">${frame}${dot}</g>`;
}

/**
 * Render all three corners
 */
export function renderAllCorners(
  frameStyle: string,
  dotStyle: string,
  moduleSize: number,
  moduleCount: number,
  margin: number,
  color: string
): string {
  const offset = margin * moduleSize;

  const corners: CornerRenderContext[] = [
    {
      x: offset,
      y: offset,
      moduleSize,
      position: 'top-left',
    },
    {
      x: offset + (moduleCount - 7) * moduleSize,
      y: offset,
      moduleSize,
      position: 'top-right',
    },
    {
      x: offset,
      y: offset + (moduleCount - 7) * moduleSize,
      moduleSize,
      position: 'bottom-left',
    },
  ];

  return corners
    .map(ctx => renderCompleteCorner(frameStyle, dotStyle, ctx, color))
    .join('\n');
}

/**
 * Get corner style description (for UI)
 */
export function getCornerStyleDescription(
  frameStyle: string,
  dotStyle: string
): string {
  const frameDescriptions: Record<string, string> = {
    square: 'Square',
    default: 'Square',
    rounded: 'Rounded',
    'rounded-corners': 'Rounded',
    'extra-rounded': 'Extra Rounded',
    circular: 'Circular',
    circle: 'Circular',
    dot: 'Dotted',
  };

  const dotDescriptions: Record<string, string> = {
    square: 'square dot',
    default: 'square dot',
    rounded: 'rounded dot',
    'rounded-corners': 'rounded dot',
    dot: 'circular dot',
    circle: 'circular dot',
  };

  return `${frameDescriptions[frameStyle] || frameStyle} frame with ${dotDescriptions[dotStyle] || dotStyle}`;
}
