/**
 * DOM Safety Utilities
 * Ported from legacy qr-code-frontend/src/core/helpers.js and dom-patches.js
 *
 * Uses DOMPurify for robust HTML sanitization (client-side).
 * Falls back to tag-stripping on the server where DOMPurify is not available.
 */
import DOMPurify from 'dompurify'

/**
 * Purpose: * Escape HTML entities to prevent XSS 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

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

/**
 * Purpose: * Sanitize SVG string — remove script tags, event handlers, javascript: URIs 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function sanitizeSvg(svg: string): string {
  if (!svg) return ''
  if (typeof window === 'undefined') {
    // SSR fallback: strip dangerous patterns
    return svg
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/javascript\s*:/gi, '')
  }
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true },
    ADD_TAGS: ['use'],
    ADD_ATTR: ['xlink:href', 'href', 'mask', 'transform', 'viewBox', 'preserveAspectRatio'],
    ALLOW_DATA_ATTR: false,
  })
}

/**
 * Purpose: * Sanitize HTML string using DOMPurify with a safe allowlist 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function sanitizeHTML(html: string): string {
  if (!html) return ''
  if (typeof window === 'undefined') {
    // Server-side: strip all HTML tags as fallback
    return html.replace(/<[^>]*>/g, '')
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'blockquote', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
  })
}

/**
 * Purpose: * Check if a URL is safe — uses protocol allowlist instead of denylist 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isSafeUrl(url: string): boolean {
  if (!url) return false
  const trimmed = url.trim()
  // Allow relative URLs
  if (trimmed.startsWith('/') || trimmed.startsWith('?') || trimmed.startsWith('#')) {
    return true
  }
  // Strict protocol allowlist — reject anything not explicitly allowed
  const SAFE_PROTOCOLS = /^(https?:\/\/|mailto:|tel:)/i
  return SAFE_PROTOCOLS.test(trimmed)
}

/**
 * Purpose: Strips script tags and inline event handlers from an HTML string. Uses DOMPurify for robust sanitization on the client.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function preventScriptInjection(html: string): string {
  if (!html) return ''
  if (typeof window === 'undefined') {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/data\s*:\s*text\/html/gi, '')
  }
  return DOMPurify.sanitize(html)
}

/**
 * Purpose: * Validate that a URL uses only an allowed scheme (http, https, mailto, tel) 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function sanitizeUrl(url: string): string {
  if (!url) return ''
  const trimmed = url.trim()
  // Relative URLs (starting with / or ? or #) are safe
  if (trimmed.startsWith('/') || trimmed.startsWith('?') || trimmed.startsWith('#')) {
    return trimmed
  }
  // Only allow http, https, mailto, tel protocols
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed
  return ''
}

/**
 * Purpose: Set up a listener for Content-Security-Policy violation reports. Call once at app startup; returns a cleanup function.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function handleCSPViolation(
  onViolation?: (event: SecurityPolicyViolationEvent) => void
): () => void {
  if (typeof document === 'undefined') return () => {}

  /**
   * Purpose: Executes handler functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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
