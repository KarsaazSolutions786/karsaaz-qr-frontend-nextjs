/**
 * SVG processor utilities for QR SVG manipulation.
 */

/**
 * Purpose: * Changes all fill and stroke colors on the SVG element tree. 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function recolorSVG(svg: SVGElement, color: string): void {
  const elements = svg.querySelectorAll('*');
  elements.forEach((el) => {
    const htmlEl = el as SVGElement;
    if (htmlEl.getAttribute('fill') && htmlEl.getAttribute('fill') !== 'none') {
      htmlEl.setAttribute('fill', color);
    }
    if (htmlEl.getAttribute('stroke') && htmlEl.getAttribute('stroke') !== 'none') {
      htmlEl.setAttribute('stroke', color);
    }
  });
  // Also handle root element
  if (svg.getAttribute('fill') && svg.getAttribute('fill') !== 'none') {
    svg.setAttribute('fill', color);
  }
  if (svg.getAttribute('stroke') && svg.getAttribute('stroke') !== 'none') {
    svg.setAttribute('stroke', color);
  }
}

/**
 * Purpose: * Scales the SVG by updating its viewBox and width/height attributes. 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function scaleSVG(svg: SVGElement, scale: number): void {
  const vb = svg.getAttribute('viewBox');
  const width = parseFloat(svg.getAttribute('width') || '0');
  const height = parseFloat(svg.getAttribute('height') || '0');

  if (width) svg.setAttribute('width', String(width * scale));
  if (height) svg.setAttribute('height', String(height * scale));

  // If no viewBox exists but width/height do, set one at the original size
  if (!vb && width && height) {
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }
}

/**
 * Purpose: * Inserts a background rect behind all existing content. 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function addBackgroundToSVG(
  svg: SVGElement,
  color: string,
  padding: number
): void {
  const vb = svg.getAttribute('viewBox');
  let w = parseFloat(svg.getAttribute('width') || '100');
  let h = parseFloat(svg.getAttribute('height') || '100');

  if (vb) {
    const parts = vb.split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      w = parts[2]!;
      h = parts[3]!;
    }
  }

  // Expand viewBox to include padding
  const newW = w + padding * 2;
  const newH = h + padding * 2;
  svg.setAttribute('viewBox', `${-padding} ${-padding} ${newW} ${newH}`);
  svg.setAttribute('width', String(newW));
  svg.setAttribute('height', String(newH));

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', String(-padding));
  rect.setAttribute('y', String(-padding));
  rect.setAttribute('width', String(newW));
  rect.setAttribute('height', String(newH));
  rect.setAttribute('fill', color);

  // Insert as first child so it's behind everything
  svg.insertBefore(rect, svg.firstChild);
}

/**
 * Purpose: * Serializes an SVGElement to a data:image/svg+xml URL. 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function svgToDataURL(svg: SVGElement): string {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}
