import { envConfig } from '@/lib/config/env-config'

/**
 * Purpose: Resolves a backend-relative URL (e.g. `/api/design-assets/thumbnail/...`) to a full URL pointing at the Laravel backend. - If the URL is already absolute (starts with http), returns it as-is. - If the URL is a relative `/api/...` path, prefixes the backend host. - If the URL is a frontend-local path (e.g. `/images/...`), returns as-is. - Returns `null` for falsy input.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function resolveBackendUrl(url: string | null | undefined): string | null {
  if (!url) return null

  // Already an absolute URL — nothing to do
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  // Backend-relative API path — needs the Laravel host prefix
  if (url.startsWith('/api/')) {
    const backendHost = getBackendHost()
    return backendHost ? `${backendHost}${url}` : url
  }

  // Local public asset (e.g. /images/qr/modules/square.png) — works as-is
  return url
}

/**
 * Purpose: Retrieves backendhost.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function getBackendHost(): string {
  // Priority 1: window.BACKEND_URL (runtime override)
  if (typeof window !== 'undefined' && (window as any).BACKEND_URL) {
    return (window as any).BACKEND_URL
  }

  // Priority 2: envConfig.API_URL (centralized single source of truth)
  return envConfig.API_URL
}
