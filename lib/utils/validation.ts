/**
 * Validation helper utilities
 */

/**
 * Purpose: Check if string is a valid email
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Purpose: Check if string is a valid URL
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Purpose: Check if string is a valid hex color
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#[0-9A-Fa-f]{6}$/
  return hexRegex.test(color)
}

/**
 * Purpose: Check if password meets minimum requirements - At least 8 characters - At least 1 uppercase letter - At least 1 lowercase letter - At least 1 number
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

/**
 * Purpose: Get password strength score (0-4) 0: Very weak 1: Weak 2: Fair 3: Strong 4: Very strong
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function getPasswordStrength(password: string): number {
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++ // Special characters

  return Math.min(strength, 4)
}

/**
 * Purpose: Sanitize string for safe display (prevent XSS)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function sanitizeString(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Purpose: Truncate string to max length with ellipsis
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Purpose: Slugify string (convert to URL-friendly format)
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
