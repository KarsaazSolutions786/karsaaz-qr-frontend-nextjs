import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  sanitizeSvg,
  sanitizeHTML,
  isSafeUrl,
  preventScriptInjection,
  sanitizeUrl,
} from '@/lib/utils/dom-safety'

describe('escapeHtml', () => {
  it('escapes angle brackets and ampersands', () => {
    const result = escapeHtml('<script>alert("xss")</script>')
    expect(result).not.toContain('<script>')
    expect(result).toContain('&lt;')
  })

  it('returns empty-safe for plain text', () => {
    expect(escapeHtml('hello world')).toBe('hello world')
  })
})

describe('sanitizeSvg', () => {
  it('removes script tags from SVG', () => {
    const svg = '<svg><script>alert(1)</script><rect/></svg>'
    expect(sanitizeSvg(svg)).not.toContain('<script>')
  })

  it('removes event handlers', () => {
    const svg = '<svg onload="alert(1)"><rect/></svg>'
    expect(sanitizeSvg(svg)).not.toMatch(/onload/i)
  })

  it('removes javascript: URIs', () => {
    const svg = '<svg><a href="javascript:alert(1)">click</a></svg>'
    expect(sanitizeSvg(svg)).not.toMatch(/javascript:/i)
  })

  it('returns empty string for falsy input', () => {
    expect(sanitizeSvg('')).toBe('')
  })
})

describe('sanitizeHTML', () => {
  it('strips script tags', () => {
    expect(sanitizeHTML('<div><script>x</script></div>')).toBe('<div></div>')
  })

  it('strips inline event handlers', () => {
    expect(sanitizeHTML('<img onerror="alert(1)">')).not.toMatch(/onerror/i)
  })
})

describe('isSafeUrl', () => {
  it('accepts https URLs', () => {
    expect(isSafeUrl('https://example.com')).toBe(true)
  })

  it('rejects javascript: URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejects data:text/html', () => {
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isSafeUrl('')).toBe(false)
  })
})

describe('preventScriptInjection', () => {
  it('removes scripts, handlers, javascript: and data: URIs', () => {
    const html = '<div onclick="x" data-x="data:text/html,bad"><script>y</script></div>'
    const result = preventScriptInjection(html)
    expect(result).not.toMatch(/<script/i)
    expect(result).not.toMatch(/onclick/i)
    expect(result).not.toMatch(/data:text\/html/i)
  })
})

describe('sanitizeUrl', () => {
  it('allows https', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
  })

  it('allows relative paths', () => {
    expect(sanitizeUrl('/dashboard')).toBe('/dashboard')
  })

  it('allows mailto and tel', () => {
    expect(sanitizeUrl('mailto:a@b.com')).toBe('mailto:a@b.com')
    expect(sanitizeUrl('tel:+1234')).toBe('tel:+1234')
  })

  it('blocks javascript: scheme', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('')
  })

  it('returns empty for empty input', () => {
    expect(sanitizeUrl('')).toBe('')
  })
})
