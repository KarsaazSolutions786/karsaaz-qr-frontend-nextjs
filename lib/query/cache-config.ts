/**
 * Per-data-type stale and cache times for React Query.
 * Import and spread into individual useQuery calls to override defaults.
 */

/** Static data that rarely changes (plans, currencies, system config) */
export const staticDataConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
} as const

/** User-specific data (profile, preferences) */
export const userDataConfig = {
  staleTime: 30 * 1000, // 30 seconds
  gcTime: 10 * 60 * 1000, // 10 minutes
} as const

/** List data with moderate change frequency (QR codes, tickets, folders) */
export const listDataConfig = {
  staleTime: 15 * 1000, // 15 seconds
  gcTime: 5 * 60 * 1000, // 5 minutes
} as const

/** Analytics data that can tolerate slight staleness */
export const analyticsDataConfig = {
  staleTime: 60 * 1000, // 60 seconds
  gcTime: 10 * 60 * 1000, // 10 minutes
} as const

/** Real-time data (notifications, live stats) */
export const realtimeDataConfig = {
  staleTime: 5 * 1000, // 5 seconds
  gcTime: 2 * 60 * 1000, // 2 minutes
} as const

/**
 * Lookup map for query key prefix → cache config.
 * Can be used to auto-configure queries via a wrapper.
 */
export const cacheConfigMap: Record<string, { staleTime: number; gcTime: number }> = {
  // Static
  plans: staticDataConfig,
  currencies: staticDataConfig,
  roles: staticDataConfig,
  'system-configs': staticDataConfig,
  translations: staticDataConfig,

  // User
  auth: userDataConfig,
  passwordless: userDataConfig,

  // Lists
  qrcodes: listDataConfig,
  folders: listDataConfig,
  contacts: listDataConfig,
  'lead-forms': listDataConfig,
  'blog-posts': listDataConfig,
  support: listDataConfig,
  domains: listDataConfig,
  biolinks: listDataConfig,

  // Analytics
  referrals: analyticsDataConfig,
}
