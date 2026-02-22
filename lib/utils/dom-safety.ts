/**
 * DOM Safety Utilities
 * Ported from legacy qr-code-frontend/src/core/helpers.js and dom-patches.js
 */

/** Escape HTML entities to prevent XSS */
export function escapeHtml(str: string): string {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (div) {
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
  // SSR fallback
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Sanitize SVG string — remove script tags, event handlers, javascript: URIs */
export function sanitizeSvg(svg: string): string {
  if (!svg) return '';
  return svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '');
}

/** Sanitize HTML string — remove script tags and event handlers */
export function sanitizeHTML(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

/** Check if a URL is safe (no javascript: or data: protocols) */
export function isSafeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return !trimmed.startsWith('javascript:') && !trimmed.startsWith('data:text/html');
}
