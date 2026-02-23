/**
 * Body scroll locking utilities.
 */

let savedScrollY = 0
let blocked = false

export function blockScroll(): void {
  if (typeof window === 'undefined' || blocked) return
  savedScrollY = window.scrollY
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${savedScrollY}px`
  document.body.style.width = '100%'
  blocked = true
}

export function unblockScroll(): void {
  if (typeof window === 'undefined' || !blocked) return
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, savedScrollY)
  blocked = false
}

export function isScrollBlocked(): boolean {
  return blocked
}
