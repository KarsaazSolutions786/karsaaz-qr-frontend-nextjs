/**
 * XSS Prevention utilities for safe DOM manipulation
 */

import { sanitizeHTML, sanitizeSvg, isSafeUrl } from './dom-safety';

/** Safely set innerHTML on a DOM element after sanitizing */
export function safeSetInnerHTML(element: HTMLElement, html: string): void {
  element.innerHTML = sanitizeHTML(html);
}

/** Safely set SVG content after sanitizing */
export function safeSetSvgContent(element: HTMLElement, svg: string): void {
  element.innerHTML = sanitizeSvg(svg);
}

/** Sanitize attributes on an HTML element — remove dangerous ones */
export function sanitizeAttributes(element: HTMLElement): void {
  const dangerousAttrs = Array.from(element.attributes).filter(
    (attr) => attr.name.startsWith('on') ||
    (attr.name === 'href' && !isSafeUrl(attr.value)) ||
    (attr.name === 'src' && !isSafeUrl(attr.value))
  );
  dangerousAttrs.forEach((attr) => element.removeAttribute(attr.name));
}

/** Create sanitized HTML props for dangerouslySetInnerHTML */
export function createSafeHtmlProps(html: string): { __html: string } {
  return { __html: sanitizeHTML(html) };
}

/** Create sanitized SVG props for dangerouslySetInnerHTML */
export function createSafeSvgProps(svg: string): { __html: string } {
  return { __html: sanitizeSvg(svg) };
}
