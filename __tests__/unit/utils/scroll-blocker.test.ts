import { describe, it, expect, beforeEach, vi } from 'vitest'

// Must re-import fresh module for each test since it has module-level state
let blockScroll: typeof import('@/lib/utils/scroll-blocker').blockScroll
let unblockScroll: typeof import('@/lib/utils/scroll-blocker').unblockScroll
let isScrollBlocked: typeof import('@/lib/utils/scroll-blocker').isScrollBlocked

describe('scroll-blocker', () => {
  beforeEach(async () => {
    // Reset module state by re-importing
    vi.resetModules()
    const mod = await import('@/lib/utils/scroll-blocker')
    blockScroll = mod.blockScroll
    unblockScroll = mod.unblockScroll
    isScrollBlocked = mod.isScrollBlocked

    // Reset body styles
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
  })

  it('blocks scroll by setting body styles', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    blockScroll()
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.top).toBe('-100px')
    expect(document.body.style.width).toBe('100%')
    expect(isScrollBlocked()).toBe(true)
  })

  it('unblocks scroll and restores position', () => {
    const scrollToSpy = vi.fn()
    window.scrollTo = scrollToSpy
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true })

    blockScroll()
    unblockScroll()

    expect(document.body.style.overflow).toBe('')
    expect(document.body.style.position).toBe('')
    expect(isScrollBlocked()).toBe(false)
    expect(scrollToSpy).toHaveBeenCalledWith(0, 200)
  })

  it('does not double-block', () => {
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true })
    blockScroll()
    // Change scrollY to verify it doesn't re-capture
    Object.defineProperty(window, 'scrollY', { value: 999, writable: true })
    blockScroll()
    expect(document.body.style.top).toBe('-50px')
  })

  it('does not unblock if not blocked', () => {
    const scrollToSpy = vi.fn()
    window.scrollTo = scrollToSpy
    unblockScroll()
    expect(scrollToSpy).not.toHaveBeenCalled()
  })

  it('isScrollBlocked returns false initially', () => {
    expect(isScrollBlocked()).toBe(false)
  })
})
