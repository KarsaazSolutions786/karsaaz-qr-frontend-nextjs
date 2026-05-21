/**
 * T314 — Brand URL Helper
 * Constructs multi-tenant URLs using custom domain or default configuration.
 */

import { envConfig } from '../config/env-config'

/**
 * Purpose: Determine protocol based on environment. Production uses https; development defaults to http.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function getProtocol(): 'https' | 'http' {
  if (envConfig.NODE_ENV === 'production') return 'https'

  // Check if the configured URLs already use https
  if (envConfig.APP_URL.startsWith('https://')) return 'https'

  return 'http'
}

/**
 * Purpose: Build a brand-facing URL, using a custom domain if provided. Falls back to APP_URL from envConfig.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function getBrandUrl(path?: string, customDomain?: string): string {
  const base = customDomain
    ? `${getProtocol()}://${customDomain.replace(/^https?:\/\//, '')}`
    : envConfig.APP_URL.replace(/\/+$/, '')

  if (!path) return base
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

/**
 * Purpose: Build an API URL with optional path appended. Always appends /api to the configured API_URL.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function getApiUrl(path?: string): string {
  const base = `${envConfig.API_URL.replace(/\/+$/, '')}/api`
  if (!path) return base
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}
