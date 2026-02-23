/**
 * T312 — Config Helper
 * Fetches and caches server-side system configuration via the system-configs API.
 */

import { systemConfigsAPI, type SystemConfig } from '../api/endpoints/system-configs'

// In-memory cache with TTL
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

let configCache: CacheEntry<Record<string, string | null>> | null = null

function isCacheValid<T>(entry: CacheEntry<T> | null): entry is CacheEntry<T> {
  return entry !== null && Date.now() < entry.expiresAt
}

/**
 * Fetch system settings from the API and cache the result.
 * Pass specific keys or omit for common site-level keys.
 */
export async function getSystemConfig(
  keys: string[] = ['site_name', 'site_logo', 'site_favicon', 'feature_flags']
): Promise<Record<string, string | null>> {
  if (isCacheValid(configCache)) {
    // Check if all requested keys are present in cache
    const allCached = keys.every(k => k in configCache!.data)
    if (allCached) return configCache!.data
  }

  try {
    const configs: SystemConfig[] = await systemConfigsAPI.get(keys)
    const mapped: Record<string, string | null> = {}
    for (const cfg of configs) {
      mapped[cfg.key] = cfg.value
    }

    // Merge into existing cache (preserves previously fetched keys)
    configCache = {
      data: { ...(configCache?.data ?? {}), ...mapped },
      expiresAt: Date.now() + CACHE_TTL_MS,
    }

    return configCache.data
  } catch (error) {
    console.error('[config-helper] Failed to fetch system config:', error)
    // Return stale cache if available, otherwise empty
    return configCache?.data ?? {}
  }
}

/** Get the configured site name */
export async function getSiteName(): Promise<string> {
  const config = await getSystemConfig(['site_name'])
  return config['site_name'] ?? 'Karsaaz QR'
}

/** Get the configured site logo URL */
export async function getSiteLogo(): Promise<string | null> {
  const config = await getSystemConfig(['site_logo'])
  return config['site_logo'] ?? null
}

/** Get server-side feature flags as a parsed object */
export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const config = await getSystemConfig(['feature_flags'])
  const raw = config['feature_flags']
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw)
    // Ensure all values are booleans
    const flags: Record<string, boolean> = {}
    for (const [key, value] of Object.entries(parsed)) {
      flags[key] = Boolean(value)
    }
    return flags
  } catch {
    console.warn('[config-helper] Failed to parse feature_flags JSON')
    return {}
  }
}

/** Invalidate the in-memory config cache */
export function clearConfigCache(): void {
  configCache = null
}
