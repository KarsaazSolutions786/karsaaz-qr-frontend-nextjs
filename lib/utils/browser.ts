/**
 * Browser & DOM Utility Functions
 * Environment detection, clipboard, scrollbar, and browser-specific helpers.
 */

/**
 * Check if running on mobile device
 */
const MOBILE_BREAKPOINT = 900

/**
 * Purpose: Checks if mobile.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < MOBILE_BREAKPOINT
}

/**
 * Purpose: Check if running on iPhone Safari
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function iPhoneSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  return !!navigator.userAgent.match('iPhone OS')
}

/**
 * Purpose: Get query parameter from URL
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function queryParam(name: string): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(name)
}

/**
 * Purpose: Get scrollbar width
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function getScrollbarWidth(): number {
  if (typeof document === 'undefined') return 0

  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  document.body.appendChild(outer)

  const inner = document.createElement('div')
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}

/**
 * Purpose: Copy text to clipboard
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    if (typeof document === 'undefined') return false
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      textarea.remove()
    }
  }
}

/**
 * Purpose: Download content as blob
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function downloadBlob(content: BlobPart, filename: string, contentType: string): void {
  if (typeof document === 'undefined') return

  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)

  const pom = document.createElement('a')
  pom.href = url
  pom.setAttribute('download', filename)
  pom.click()

  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * Purpose: Open link in new tab
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function openLinkInNewTab(link: string): void {
  if (typeof document === 'undefined') return

  const a = document.createElement('a')
  a.href = link
  a.target = '_blank'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()

  setTimeout(() => a.remove(), 100)
}

/**
 * Purpose: Convert pixels to rem
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function pxToRem(px: number): number {
  if (typeof document === 'undefined') return px / 16
  return px / parseFloat(getComputedStyle(document.documentElement).fontSize)
}

/**
 * Purpose: Convert rem to pixels
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function remToPx(rem: number): number {
  if (typeof document === 'undefined') return rem * 16
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}
