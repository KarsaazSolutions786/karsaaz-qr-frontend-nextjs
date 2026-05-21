/**
 * Module Shapes Renderer
 *
 * Generates SVG path data for different QR code module shapes.
 * All 15 shapes from P1 backend: square, rounded, dots, circular, diamond,
 * classy, classy-rounded, triangle, rhombus, star-5, star-7,
 * vertical-lines, horizontal-lines, fish, tree, twoTrianglesWithCircle,
 * fourTriangles, triangle-end.
 */

// ModuleShape type handled via string for backward compatibility with client-side renderer
import { getModuleNeighbors, getNeighbourBits, checkNeighbourBits } from './qrcode-utils';

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
 * Purpose: Generate SVG path for square module
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function renderSquareModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}"/>`;
}

/**
 * Purpose: Generate SVG path for rounded module
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function renderRoundedModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const radius = size * 0.25; // 25% corner radius
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" ry="${radius}"/>`;
}

/**
 * Purpose: Generate SVG path for dot module
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function renderDotModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const radius = size / 2;
  return `<circle cx="${cx}" cy="${cy}" r="${radius}"/>`;
}

/**
 * Purpose: Generate SVG path for circular module (smaller than dot)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function renderCircularModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const radius = size / 2.2; // Slightly smaller than full size
  return `<circle cx="${cx}" cy="${cy}" r="${radius}"/>`;
}

/**
 * Purpose: Generate SVG path for diamond module
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Generate SVG path for classy module (rounded based on neighbors)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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
 * Purpose: Generate SVG path for classy-rounded module (smoother version)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
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

// ============================================================
// Polygon shapes: triangle, rhombus, star-5, star-7
// Ported from P1 PolygonModule.php — makePolygon() algorithm
// ============================================================

/**
 * Purpose: Generate polygon points (star/polygon algorithm from P1). Alternates between inner and outer radii to create star shapes.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

function makePolygon(
  translateX: number,
  translateY: number,
  innerRadius: number,
  outerRadius: number,
  numPoints: number
): [number, number][] {
  const center = Math.max(innerRadius, outerRadius);
  const angle = Math.PI / numPoints;
  const points: [number, number][] = [];

  for (let i = 0; i < numPoints * 2; i++) {
    const radius = i & 1 ? innerRadius : outerRadius;
    const px = center + radius * Math.sin(i * angle) + translateX;
    const py = center - radius * Math.cos(i * angle) + translateY;
    points.push([px, py]);
  }
  return points;
}

/**
 * Purpose: Executes polygonToPath functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function polygonToPath(points: [number, number][]): string {
  const lines = points.map(([px, py]) => `L${px},${py}`).join(' ');
  const first = points[0]!;
  return `<path d="M${first[0]},${first[1]} ${lines}Z"/>`;
}

/**
 * Purpose: Executes renderTriangleModule functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderTriangleModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const points = makePolygon(x, y, size / 3, size / 1.5, 3);
  return polygonToPath(points);
}

/**
 * Purpose: Executes renderRhombusModule functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderRhombusModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const points = makePolygon(x, y, size / 3, size / 2, 4);
  return polygonToPath(points);
}

/**
 * Purpose: Executes renderStar5Module functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderStar5Module(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const points = makePolygon(x, y, size / 3, size / 1.75, 5);
  return polygonToPath(points);
}

/**
 * Purpose: Executes renderStar7Module functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderStar7Module(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const points = makePolygon(x, y, size / 3, size / 1.7, 7);
  return polygonToPath(points);
}

// ============================================================
// Line shapes: vertical-lines, horizontal-lines
// Ported from P1 VerticalLinesModule.php / HorizontalLinesModule.php
// ============================================================

/**
 * Purpose: Executes renderVerticalLinesModule functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderVerticalLinesModule(ctx: ModuleRenderContext): string {
  const { x, y, size, qr, row, col, moduleCount } = ctx;
  const width = size * 0.8;
  const height = size;
  const bits = getNeighbourBits(qr, row, col, moduleCount);
  /**
   * Purpose: Executes check functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const check = (all: number, any: number) => checkNeighbourBits(bits, all, any);

  const r = 0.5;
  const radius = r * width;
  const radiusInverse = (1 - r) * width;
  const radiusInverse2 = (1 - 2 * r) * width;

  // 4 rounded corners — isolated vertically
  if (check(0b0000000, 0b11011101)) {
    return `<path d="M${x},${y} m0,${radius} v${radiusInverse2} q0,${radius} ${radius},${radius} h${radiusInverse2} q${radius},0 ${radius},-${radius} v-${radiusInverse2} q0,-${radius} -${radius},-${radius} h-${radiusInverse2} q-${radius},0 -${radius},${radius}Z"/>`;
  }

  // 2 rounded corners top (neighbour below, not above)
  if (check(0b00000000, 0b11111101)) {
    return `<path d="M${x},${y} m0,${height} h${width} v-${radius} q0,-${radius} -${radius},-${radius} h-${radiusInverse2} q-${radius},0 -${radius},${radius}Z"/>`;
  }

  // 2 rounded corners bottom (neighbour above, not below)
  if (check(0b00000000, 0b11011111)) {
    return `<path d="M${x},${y} v${radiusInverse} q0,${radius} ${radius},${radius} h${radiusInverse2} q${radius},0 ${radius},-${radius} v-${radiusInverse}Z"/>`;
  }

  // Plain rectangle
  return `<path d="M${x},${y} h${width} v${height} h-${width}Z"/>`;
}

/**
 * Purpose: Executes renderHorizontalLinesModule functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderHorizontalLinesModule(ctx: ModuleRenderContext): string {
  const { x, y, size, qr, row, col, moduleCount } = ctx;
  const height = size * 0.8;
  const width = size;
  const bits = getNeighbourBits(qr, row, col, moduleCount);
  /**
   * Purpose: Executes check functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const check = (all: number, any: number) => checkNeighbourBits(bits, all, any);

  const r = 0.5;
  const radius = r * height;
  const radiusInverse = (1 - r) * height;
  const radiusInverse2 = (1 - 2 * r) * height;

  // 4 rounded corners — isolated horizontally
  if (check(0b0000000, 0b01110111)) {
    return `<path d="M${x},${y} m0,${radius} v${radiusInverse2} q0,${radius} ${radius},${radius} h${radiusInverse2} q${radius},0 ${radius},-${radius} v-${radiusInverse2} q0,-${radius} -${radius},-${radius} h-${radiusInverse2} q-${radius},0 -${radius},${radius}Z"/>`;
  }

  // 2 rounded corners on right side (neighbour to left, not right)
  if (check(0, 0b11110111)) {
    return `<path d="M${x},${y} h${radiusInverse} q${radius},0 ${radius},${radius} v${radiusInverse2} q0,${radius} -${radius},${radius} h-${radiusInverse}Z"/>`;
  }

  // 2 rounded corners on left side (neighbour to right, not left)
  if (check(0b00001000, 0b01111111)) {
    return `<path d="M${x},${y} m${width},${height} v-${height} h-${radiusInverse} q-${radius},0 -${radius},${radius} v${radiusInverse2} q0,${radius} ${radius},${radius}Z"/>`;
  }

  // Plain rectangle
  return `<path d="M${x},${y} h${width} v${height} h-${width}Z"/>`;
}

// ============================================================
// Dynamic shapes: fish, tree, twoTrianglesWithCircle, fourTriangles
// Ported from P1 DynamicModuleRenderer.php — pathCommands() algorithm
// ============================================================

/**
 * Purpose: Generate a 6-sided parametric curved shape from 3 equilateral triangle vertices. The t1/t2/t3 parameters control how the edges are interpolated.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

function dynamicPathCommands(
  angle: number,
  t1: number,
  t2: number,
  t3: number,
  length: number,
  originX: number,
  originY: number
): string {
  const deg2rad = Math.PI / 180;
  const ts = [t1, t2, t3];

  // 3 equilateral triangle vertices
  const points = [0, 1, 2].map(i => ({
    x: originX + length * Math.cos(angle * deg2rad + ((2 * Math.PI) / 3) * i),
    y: originY + length * Math.sin(angle * deg2rad + ((2 * Math.PI) / 3) * i),
  }));

  // Forward interpolation
  const arr1 = points.map((p, i) => {
    const ii = i > 0 ? i - 1 : points.length - 1;
    const pp = points[ii]!;
    const t = ts[i] ?? 0;
    return {
      x: pp.x + (p.x - pp.x) * t,
      y: pp.y + (p.y - pp.y) * t,
    };
  });

  // Reverse interpolation
  const arr2: { x: number; y: number }[] = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const ii = i === points.length - 1 ? 0 : i + 1;
    const p = points[i]!;
    const pp = points[ii]!;
    const t = ts[ii] ?? 0;
    arr2.push({
      x: pp.x + (p.x - pp.x) * t,
      y: pp.y + (p.y - pp.y) * t,
    });
  }

  // Interleave
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < arr1.length; i++) {
    pts.push(arr1[i]!);
    pts.push(arr2[arr2.length - 1 - i]!);
  }

  const first = pts[0]!;
  const cmds = pts.map(p => `L${p.x},${p.y}`).join('');
  return `<path d="M${first.x},${first.y} ${cmds}Z"/>`;
}

// Seeded PRNG for deterministic per-module variation
/**
 * Purpose: Executes moduleHash functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function moduleHash(row: number, col: number): number {
  let h = (row * 31 + col * 127) & 0xffff;
  h = ((h >>> 0) * 2654435761) >>> 0;
  return h;
}

/**
 * Purpose: Executes renderFishModule functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderFishModule(ctx: ModuleRenderContext): string {
  const { x, y, size, row, col } = ctx;
  const l = size / 1.5;
  const ox = x + l;
  const oy = y + l / 2;
  const angle = moduleHash(row, col) & 1 ? 120 : -60;
  return dynamicPathCommands(angle, 0.82, 0.13, 0.82, l, ox, oy);
}

/**
 * Purpose: Executes renderTreeModule functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderTreeModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const l = size / 1.5;
  const ox = x + l;
  const oy = y + l / 2;
  return dynamicPathCommands(150, 0.4, 0.12, 0.12, l, ox, oy);
}

/**
 * Purpose: Executes renderTwoTrianglesWithCircleModule functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderTwoTrianglesWithCircleModule(ctx: ModuleRenderContext): string {
  const { x, y, size, qr, row, col, moduleCount } = ctx;
  const l = size / 2;
  const ox = x + l;
  const oy = y + l / 2;

  // When module has only a top neighbour, render as circle arc
  const bits = getNeighbourBits(qr, row, col, moduleCount);
  if (checkNeighbourBits(bits, 0b0000010, 0b11011101)) {
    const r = l / 1.3;
    const cx = ox - r / 2;
    const cy = oy - r / 2;
    return `<path d="M${cx} ${cy} a${r} ${r} 0 1 0 ${r} 0Z"/>`;
  }

  return dynamicPathCommands(90, 1.31, 1.31, 0.79, l, ox, oy);
}

/**
 * Purpose: Executes renderFourTrianglesModule functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderFourTrianglesModule(ctx: ModuleRenderContext): string {
  const { x, y, size } = ctx;
  const l = size / 2.5;
  const ox = x + l;
  const oy = y + l / 2;
  return dynamicPathCommands(90, 1.3, 1.3, 1.5, l, ox, oy);
}

// ============================================================
// Triangle-end: directional triangles/trapezoids based on neighbours
// Ported from P1 TriangleEndModule.php
// ============================================================

/**
 * Purpose: Executes renderTriangleEndModule functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function renderTriangleEndModule(ctx: ModuleRenderContext): string {
  const { x: px, y: py, size, qr, row, col, moduleCount } = ctx;
  const bits = getNeighbourBits(qr, row, col, moduleCount);
  /**
   * Purpose: Executes check functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const check = (all: number, any: number) => checkNeighbourBits(bits, all, any);

  const base = size;
  const half = size / 2;

  // Direction 1: neighbour below → pointing up
  if (check(0b00100000, 0b01010101)) {
    const y2 = py + half;
    return `<path d="M${px},${y2} L${px + base / 2},${y2 - half} L${px + base},${y2} L${px + base},${y2 + half} L${px},${y2 + half}Z"/>`;
  }

  // Direction 3: neighbour above → pointing down
  if (check(0b00000010, 0b01010101)) {
    const y2 = py + half;
    return `<path d="M${px},${y2} L${px + base / 2},${y2 + half} L${px + base},${y2} L${px + base},${y2 - half} L${px},${y2 - half}Z"/>`;
  }

  // Direction 2: neighbour left → pointing right
  if (check(0b10000000, 0b01010101)) {
    const x2 = px + half;
    return `<path d="M${x2},${py} L${x2 + half},${py + base / 2} L${x2},${py + base} L${x2 - half},${py + base} L${x2 - half},${py}Z"/>`;
  }

  // Direction 4: neighbour right → pointing left
  if (check(0b00001000, 0b01010101)) {
    const x2 = px + half;
    return `<path d="M${x2},${py} L${x2 - half},${py + base / 2} L${x2},${py + base} L${x2 + half},${py + base} L${x2 + half},${py}Z"/>`;
  }

  // Direction 5: isolated (lonely) → rhombus
  if (check(0, 0b01010101)) {
    const y2 = py + half;
    return `<path d="M${px},${y2} L${px + base / 2},${y2 - half} L${px + base},${y2} L${px + base / 2},${y2 + half}Z"/>`;
  }

  // Trapezoid — corner junctions
  const len = size;

  // Trapezoid direction 5 (top-right corner)
  if (check(0, 0b11010111)) {
    return `<path d="M${px},${py} L${px + len},${py} L${px + len},${py + len / 2} L${px + len / 2},${py + len} L${px},${py + len}Z"/>`;
  }

  // Trapezoid direction 1 (bottom-left corner)
  if (check(0, 0b01111101)) {
    return `<path d="M${px},${py + len / 2} L${px + len / 2},${py} L${px + len},${py} L${px + len},${py + len} L${px},${py + len}Z"/>`;
  }

  // Trapezoid direction 3 (bottom-right corner)
  if (check(0, 0b11110101)) {
    return `<path d="M${px},${py} L${px + len / 2},${py} L${px + len},${py + len / 2} L${px + len},${py + len} L${px},${py + len}Z"/>`;
  }

  // Trapezoid direction 7 (top-left corner)
  if (check(0, 0b01011111)) {
    return `<path d="M${px},${py + len / 2} L${px + len / 2},${py + len} L${px + len},${py + len} L${px + len},${py} L${px},${py}Z"/>`;
  }

  // Fallback: plain rectangle
  return `<path d="M${px} ${py} h${size} v${size} h-${size}Z"/>`;
}

// ============================================================
// Main dispatcher + utilities
// ============================================================

/**
 * Purpose: Main module renderer - selects appropriate shape renderer
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function renderModule(
  shape: string,
  ctx: ModuleRenderContext
): string {
  switch (shape) {
    case 'square':
    case 'default':
      return renderSquareModule(ctx);
    case 'rounded':
    case 'roundness':
      return renderRoundedModule(ctx);
    case 'dots':
    case 'circle':
      return renderDotModule(ctx);
    case 'circular':
      return renderCircularModule(ctx);
    case 'diamond':
      return renderDiamondModule(ctx);
    case 'classy':
      return renderClassyModule(ctx);
    case 'classy-rounded':
      return renderClassyRoundedModule(ctx);
    case 'triangle':
    case 'polygon-3':
      return renderTriangleModule(ctx);
    case 'rhombus':
    case 'polygon-4':
      return renderRhombusModule(ctx);
    case 'star-5':
    case 'polygon-5':
      return renderStar5Module(ctx);
    case 'star-7':
    case 'polygon-7':
      return renderStar7Module(ctx);
    case 'vertical-lines':
      return renderVerticalLinesModule(ctx);
    case 'horizontal-lines':
      return renderHorizontalLinesModule(ctx);
    case 'fish':
      return renderFishModule(ctx);
    case 'tree':
      return renderTreeModule(ctx);
    case 'twoTrianglesWithCircle':
      return renderTwoTrianglesWithCircleModule(ctx);
    case 'fourTriangles':
      return renderFourTrianglesModule(ctx);
    case 'triangle-end':
      return renderTriangleEndModule(ctx);
    default:
      return renderSquareModule(ctx);
  }
}

/**
 * Purpose: Batch render modules (optimized for performance)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function renderModuleBatch(
  shape: string,
  contexts: ModuleRenderContext[]
): string {
  return contexts.map(ctx => renderModule(shape, ctx)).join('\n');
}

/**
 * Purpose: Get module shape description (for UI)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function getModuleShapeDescription(shape: string): string {
  const descriptions: Record<string, string> = {
    square: 'Classic square modules',
    rounded: 'Rounded corner modules',
    roundness: 'Rounded corner modules',
    dots: 'Circular dots',
    circle: 'Circular dots',
    circular: 'Smooth circles',
    diamond: 'Diamond shapes',
    classy: 'Contextual rounded corners',
    'classy-rounded': 'Smooth contextual rounding',
    triangle: 'Triangular modules',
    rhombus: 'Rhombus (4-point star)',
    'star-5': '5-point star',
    'star-7': '7-point star',
    'vertical-lines': 'Vertical line bars',
    'horizontal-lines': 'Horizontal line bars',
    fish: 'Fish-shaped parametric',
    tree: 'Tree-shaped parametric',
    twoTrianglesWithCircle: 'Two triangles with circle',
    fourTriangles: 'Four triangles',
    'triangle-end': 'Directional triangle ends',
  };

  return descriptions[shape] || shape;
}
