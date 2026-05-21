/**
 * Body scroll locking utilities.
 */

let savedScrollY = 0
let blocked = false

/**
 * Purpose: Executes blockScroll functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function blockScroll(): void {
  if (typeof window === 'undefined' || blocked) return
  savedScrollY = window.scrollY
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${savedScrollY}px`
  document.body.style.width = '100%'
  blocked = true
}

/**
 * Purpose: Executes unblockScroll functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function unblockScroll(): void {
  if (typeof window === 'undefined' || !blocked) return
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, savedScrollY)
  blocked = false
}

/**
 * Purpose: Checks if scrollblocked.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function isScrollBlocked(): boolean {
  return blocked
}
