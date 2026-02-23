import { type RefObject, useEffect } from 'react'

type KeyNavDirection = 'vertical' | 'horizontal' | 'both'

interface KeyNavOptions {
  /** Which arrow keys to handle */
  direction?: KeyNavDirection
  /** Selector for focusable items within the container */
  itemSelector?: string
  /** Wrap around when reaching the end */
  wrap?: boolean
  /** Callback when an item is selected (Enter/Space) */
  onSelect?: (element: HTMLElement, index: number) => void
}

/**
 * Handle keyboard navigation (arrow keys) within a list container.
 * Attach to the container's onKeyDown event.
 */
export function handleKeyboardNav(e: React.KeyboardEvent, options: KeyNavOptions = {}) {
  const {
    direction = 'vertical',
    itemSelector = '[role="option"], [role="menuitem"], li, a, button',
    wrap = true,
    onSelect,
  } = options

  const container = e.currentTarget as HTMLElement
  const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector))
  if (items.length === 0) return

  const currentIndex = items.indexOf(document.activeElement as HTMLElement)

  const isNext =
    (direction !== 'horizontal' && e.key === 'ArrowDown') ||
    (direction !== 'vertical' && e.key === 'ArrowRight')

  const isPrev =
    (direction !== 'horizontal' && e.key === 'ArrowUp') ||
    (direction !== 'vertical' && e.key === 'ArrowLeft')

  if (isNext || isPrev) {
    e.preventDefault()
    let nextIndex: number

    if (isNext) {
      nextIndex = wrap
        ? (currentIndex + 1) % items.length
        : Math.min(currentIndex + 1, items.length - 1)
    } else {
      nextIndex = wrap
        ? (currentIndex - 1 + items.length) % items.length
        : Math.max(currentIndex - 1, 0)
    }

    items[nextIndex]?.focus()
  }

  if ((e.key === 'Enter' || e.key === ' ') && currentIndex >= 0) {
    e.preventDefault()
    onSelect?.(items[currentIndex]!, currentIndex)
  }

  if (e.key === 'Home') {
    e.preventDefault()
    items[0]?.focus()
  }

  if (e.key === 'End') {
    e.preventDefault()
    items[items.length - 1]?.focus()
  }
}

/**
 * Trap focus within a container element (for modals/dialogs).
 * Returns cleanup function.
 */
export function trapFocus(containerRef: RefObject<HTMLElement | null>) {
  const container = containerRef.current
  if (!container) return () => {}

  const focusableSelector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusable = container.querySelectorAll<HTMLElement>(focusableSelector)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last!.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first!.focus()
    }
  }

  container.addEventListener('keydown', handleKeyDown)
  return () => container.removeEventListener('keydown', handleKeyDown)
}

/**
 * React hook to trap focus inside a container ref.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    return trapFocus(containerRef)
  }, [containerRef])
}
