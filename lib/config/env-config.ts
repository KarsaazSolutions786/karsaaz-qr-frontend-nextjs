/**
 * T311 — Centralized Environment Configuration
 * Single source of truth for all NEXT_PUBLIC_ environment variables.
 */

interface EnvConfig {
  /** Backend API base URL (no /api suffix) */
  API_URL: string
  /** Frontend app URL */
  APP_URL: string
  /** Google OAuth client ID */
  GOOGLE_CLIENT_ID: string
  /** Stripe publishable key */
  STRIPE_KEY: string
  /** Enable passwordless (OTP) authentication */
  ENABLE_PASSWORDLESS_AUTH: boolean
  /** Enable referral system */
  ENABLE_REFERRAL_SYSTEM: boolean
  /** Current Node environment */
  NODE_ENV: string
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback
  return value === 'true' || value === '1'
}

function buildEnvConfig(): EnvConfig {
  return {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://app.karsaazqr.com',
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    ENABLE_PASSWORDLESS_AUTH: parseBool(process.env.NEXT_PUBLIC_ENABLE_PASSWORDLESS_AUTH, false),
    ENABLE_REFERRAL_SYSTEM: parseBool(process.env.NEXT_PUBLIC_ENABLE_REFERRAL_SYSTEM, false),
    NODE_ENV: process.env.NODE_ENV || 'development',
  }
}

/**
 * Validate that required environment variables are set.
 * Logs warnings in development; can be called at app startup.
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
