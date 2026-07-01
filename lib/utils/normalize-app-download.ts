export interface NormalizedAppDownload {
  appName: string
  developer?: string
  icon?: string
  description?: string
  shortDescription?: string
  category?: string
  features?: string[]
  screenshots?: string[]
  appStoreUrl?: string
  playStoreUrl?: string
  apkUrl?: string
  rating?: number
  totalRatings?: number
  version?: string
  whatsNew?: string[]
  size?: string
  minOsVersion?: string
  releaseDate?: string
  downloads?: string
  ageRating?: string
  languages?: string[]
  permissions?: string[]
  keywords?: string[]
}

const APP_DOWNLOAD_TYPES = ['app-download', 'app', 'download'] as const

export function isAppDownloadType(type: string | undefined): boolean {
  return !!type && APP_DOWNLOAD_TYPES.includes(type as (typeof APP_DOWNLOAD_TYPES)[number])
}

export function normalizeAppDownloadData(
  raw: Record<string, unknown> | null | undefined,
  fallbackName?: string
): NormalizedAppDownload | null {
  if (!raw) return null

  const playStoreUrl =
    (raw.playStoreUrl as string | undefined) ||
    (raw.google_play_url as string | undefined) ||
    undefined
  const appStoreUrl =
    (raw.appStoreUrl as string | undefined) ||
    (raw.apple_store_url as string | undefined) ||
    undefined
  const description =
    (raw.description as string | undefined) ||
    (raw.appDescription as string | undefined) ||
    undefined

  return {
    appName: (raw.appName as string | undefined) || fallbackName || 'App',
    developer: raw.developer as string | undefined,
    icon: raw.icon as string | undefined,
    description,
    shortDescription: (raw.shortDescription as string | undefined) || description,
    category: raw.category as string | undefined,
    features: raw.features as string[] | undefined,
    screenshots: raw.screenshots as string[] | undefined,
    playStoreUrl,
    appStoreUrl,
    apkUrl: raw.apkUrl as string | undefined,
    rating: raw.rating as number | undefined,
    totalRatings: raw.totalRatings as number | undefined,
    version: raw.version as string | undefined,
    whatsNew: raw.whatsNew as string[] | undefined,
    size: raw.size as string | undefined,
    minOsVersion: raw.minOsVersion as string | undefined,
    releaseDate: raw.releaseDate as string | undefined,
    downloads: raw.downloads as string | undefined,
    ageRating: raw.ageRating as string | undefined,
    languages: raw.languages as string[] | undefined,
    permissions: raw.permissions as string[] | undefined,
    keywords: raw.keywords as string[] | undefined,
  }
}

export function pickAppStoreRedirectUrl(
  app: Pick<NormalizedAppDownload, 'playStoreUrl' | 'appStoreUrl'>,
  userAgent?: string
): string | null {
  const ua = (userAgent || '').toLowerCase()
  const isAndroid = ua.includes('android')
  const isIOS = /iphone|ipad|ipod/.test(ua)

  if (isAndroid && app.playStoreUrl) return app.playStoreUrl
  if (isIOS && app.appStoreUrl) return app.appStoreUrl
  if (app.playStoreUrl) return app.playStoreUrl
  if (app.appStoreUrl) return app.appStoreUrl
  return null
}
