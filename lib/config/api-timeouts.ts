/**
 * T313 — API Timeout Presets
 * Centralized timeout configuration for API operations.
 */

export const API_TIMEOUT_PRESETS = {
  DEFAULT: 60_000, // 60s — standard operations
  FAST: 10_000, // 10s — quick reads, counts
  HEAVY: 120_000, // 120s — bulk ops, exports, reports
  AUTH: 30_000, // 30s — login, register, password reset
  GOOGLE_AUTH: 45_000, // 45s — Google OAuth round-trip
  UPLOAD: 180_000, // 180s — file uploads, imports
} as const

export type TimeoutPreset = keyof typeof API_TIMEOUT_PRESETS

/** Map of operation name patterns to timeout presets */
const OPERATION_MAP: Record<string, TimeoutPreset> = {
  login: 'AUTH',
  register: 'AUTH',
  'forgot-password': 'AUTH',
  'reset-password': 'AUTH',
  'verify-otp': 'AUTH',
  logout: 'AUTH',
  'google-auth': 'GOOGLE_AUTH',
  'google-callback': 'GOOGLE_AUTH',
  upload: 'UPLOAD',
  import: 'UPLOAD',
  export: 'HEAVY',
  bulk: 'HEAVY',
  report: 'HEAVY',
  generate: 'HEAVY',
  count: 'FAST',
  list: 'FAST',
  search: 'FAST',
}

/**
 * Get the timeout (ms) for a named operation.
 * Falls back to DEFAULT if no match is found.
 */
export function getTimeout(operation: string): number {
  const normalized = operation.toLowerCase().trim()

  // Direct match
  const directPreset = OPERATION_MAP[normalized]
  if (directPreset) {
    return API_TIMEOUT_PRESETS[directPreset]
  }

  // Partial match — check if operation contains a known key
  for (const [key, preset] of Object.entries(OPERATION_MAP)) {
    if (normalized.includes(key)) {
      return API_TIMEOUT_PRESETS[preset]
    }
  }

  return API_TIMEOUT_PRESETS.DEFAULT
}
