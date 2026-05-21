/**
 * XSS Prevention utilities for safe DOM manipulation
 */

import { sanitizeHTML, sanitizeSvg, isSafeUrl } from './dom-safety';

/**
 * Purpose: * Safely set innerHTML on a DOM element after sanitizing 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function safeSetInnerHTML(element: HTMLElement, html: string): void {
  element.innerHTML = sanitizeHTML(html);
}

/**
 * Purpose: * Safely set SVG content after sanitizing 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function safeSetSvgContent(element: HTMLElement, svg: string): void {
  element.innerHTML = sanitizeSvg(svg);
}

/**
 * Purpose: * Sanitize attributes on an HTML element — remove dangerous ones 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function sanitizeAttributes(element: HTMLElement): void {
  const dangerousAttrs = Array.from(element.attributes).filter(
    (attr) => attr.name.startsWith('on') ||
    (attr.name === 'href' && !isSafeUrl(attr.value)) ||
    (attr.name === 'src' && !isSafeUrl(attr.value))
  );
  dangerousAttrs.forEach((attr) => element.removeAttribute(attr.name));
}

/**
 * Purpose: * Create sanitized HTML props for dangerouslySetInnerHTML 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function createSafeHtmlProps(html: string): { __html: string } {
  return { __html: sanitizeHTML(html) };
}

/**
 * Purpose: * Create sanitized SVG props for dangerouslySetInnerHTML 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function createSafeSvgProps(svg: string): { __html: string } {
  return { __html: sanitizeSvg(svg) };
}
