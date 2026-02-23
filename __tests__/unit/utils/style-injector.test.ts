import { describe, it, expect, beforeEach } from 'vitest'
import { injectStyle, removeStyle, injectTheme } from '@/lib/utils/style-injector'

describe('style-injector', () => {
  beforeEach(() => {
    // Clean up any injected styles
    document.head.innerHTML = ''
  })

  it('injects a style element into head', () => {
    injectStyle('test-style', 'body { color: red; }')
    const el = document.getElementById('test-style') as HTMLStyleElement
    expect(el).toBeTruthy()
    expect(el.textContent).toBe('body { color: red; }')
  })

  it('updates existing style element', () => {
    injectStyle('test-style', 'body { color: red; }')
    injectStyle('test-style', 'body { color: blue; }')
    const elements = document.querySelectorAll('#test-style')
    expect(elements).toHaveLength(1)
    expect(elements[0]!.textContent).toBe('body { color: blue; }')
  })

  it('removes a style element', () => {
    injectStyle('remove-me', '.x { display: none; }')
    removeStyle('remove-me')
    expect(document.getElementById('remove-me')).toBeNull()
  })

  it('removeStyle does not throw for non-existent id', () => {
    expect(() => removeStyle('non-existent')).not.toThrow()
  })

  it('injectTheme creates CSS custom properties', () => {
    injectTheme({ '--primary': '#ff0000', accent: '#00ff00' })
    const el = document.getElementById('__theme-variables')
    expect(el).toBeTruthy()
    expect(el!.textContent).toContain('--primary: #ff0000;')
    expect(el!.textContent).toContain('--accent: #00ff00;')
  })
})
