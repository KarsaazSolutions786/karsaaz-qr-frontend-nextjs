/**
 * T311 — Centralized Environment Configuration
 * Single source of truth for all NEXT_PUBLIC_ environment variables.
 */

interface EnvConfig {
  /** Backend API base URL (no /api suffix) */
  API_URL: string
  /** Frontend app URL */
  APP_URL: string
  /** Marketing/canonical site URL for OG tags and public pages */
  CANONICAL_URL: string
  /** Google OAuth client ID */
  GOOGLE_CLIENT_ID: string
  /** Stripe publishable key */
  STRIPE_KEY: string
  /** Enable passwordless (OTP) authentication */
  ENABLE_PASSWORDLESS_AUTH: boolean
  /** Enable referral system */
  ENABLE_REFERRAL_SYSTEM: boolean
  /** Google Maps embed API key */
  GOOGLE_MAPS_API_KEY: string
  /** Current Node environment */
  NODE_ENV: string
}

/**
 * Purpose: Executes parseBool functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback
  return value === 'true' || value === '1'
}

/**
 * Purpose: Executes buildEnvConfig functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function resolveCanonicalUrl(appUrl: string): string {
  const explicit = process.env.NEXT_PUBLIC_CANONICAL_URL
  if (explicit) return explicit

  if (/app\.karsaazqr\.com/i.test(appUrl)) {
    return 'https://www.karsaazqr.com'
  }

  return appUrl
}

function buildEnvConfig(): EnvConfig {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://app.karsaazqr.com',
    APP_URL: appUrl,
    CANONICAL_URL: resolveCanonicalUrl(appUrl),
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    ENABLE_PASSWORDLESS_AUTH: parseBool(process.env.NEXT_PUBLIC_ENABLE_PASSWORDLESS_AUTH, false),
    ENABLE_REFERRAL_SYSTEM: parseBool(process.env.NEXT_PUBLIC_ENABLE_REFERRAL_SYSTEM, false),
    GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
  }
}

/**
 * Purpose: Validate that required environment variables are set. Logs warnings in development; can be called at app startup.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function validateEnv(): string[] {
  const missing: string[] = []

  const required: Array<{ key: string; value: string | undefined }> = [
    { key: 'NEXT_PUBLIC_API_URL', value: process.env.NEXT_PUBLIC_API_URL },
    { key: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL },
  ]

  const recommended: Array<{ key: string; value: string | undefined }> = [
    { key: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID', value: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID },
    {
      key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
  ]

  for (const { key, value } of required) {
    if (!value) {
      missing.push(key)
      console.warn(`[env-config] ⚠ Missing required env var: ${key}`)
    }
  }

  for (const { key, value } of recommended) {
    if (!value) {
      console.warn(`[env-config] ℹ Missing recommended env var: ${key}`)
    }
  }

  return missing
}

/** Frozen, typed environment configuration */
export const envConfig: Readonly<EnvConfig> = Object.freeze(buildEnvConfig())
