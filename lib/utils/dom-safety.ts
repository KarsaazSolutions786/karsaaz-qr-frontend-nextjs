/**
 * DOM Safety Utilities
 * Ported from legacy qr-code-frontend/src/core/helpers.js and dom-patches.js
 */

/** Escape HTML entities to prevent XSS */
export function escapeHtml(str: string): string {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null
  if (div) {
    div.appendChild(document.createTextNode(str))
    return div.innerHTML
  }
  // SSR fallback
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/** Sanitize SVG string — remove script tags, event handlers, javascript: URIs */
export function sanitizeSvg(svg: string): string {
  if (!svg) return ''
  return svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
}

/** Sanitize HTML string — remove script tags and event handlers */
export function sanitizeHTML(html: string): string {
  if (!html) return ''
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
}

/** Check if a URL is safe (no javascript: or data: protocols) */
export function isSafeUrl(url: string): boolean {
  if (!url) return false
  const trimmed = url.trim().toLowerCase()
  return !trimmed.startsWith('javascript:') && !trimmed.startsWith('data:text/html')
}

/**
 * Strips script tags and inline event handlers from an HTML string.
 * Stricter than sanitizeHTML — also removes data: URIs in attributes.
 */
export function preventScriptInjection(html: string): string {
  if (!html) return ''
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
}

/** Validate that a URL uses only an allowed scheme (http, https, mailto, tel) */
export function sanitizeUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()
  const ALLOWED_SCHEMES = /^(https?:\/\/|mailto:|tel:)/i
  // Relative URLs (starting with / or ?) are safe
  if (trimmed.startsWith('/') || trimmed.startsWith('?') || trimmed.startsWith('#')) {
    return trimmed
  }
  return ALLOWED_SCHEMES.test(trimmed) ? trimmed : ''
}

/**
 * Set up a listener for Content-Security-Policy violation reports.
 * Call once at app startup; returns a cleanup function.
 */
export function handleCSPViolation(
  onViolation?: (event: SecurityPolicyViolationEvent) => void
): () => void {
  if (typeof document === 'undefined') return () => {}

  const handler = (event: SecurityPolicyViolationEvent) => {
    console.warn('[CSP Violation]', {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      originalPolicy: event.originalPolicy,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
    })
    onViolation?.(event)
  }

  document.addEventListener('securitypolicyviolation', handler)

  return () => {
    document.removeEventListener('securitypolicyviolation', handler)
  }
}
