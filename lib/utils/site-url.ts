import { envConfig } from '@/lib/config/env-config'

const MARKETING_HOST = 'https://www.karsaazqr.com'
const APP_HOST = 'https://app.karsaazqr.com'

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '')
}

export function getCanonicalSiteUrl(): string {
  if (envConfig.CANONICAL_URL) {
    return stripTrailingSlash(envConfig.CANONICAL_URL)
  }

  const appUrl = envConfig.APP_URL
  if (/app\.karsaazqr\.com/i.test(appUrl)) {
    return MARKETING_HOST
  }

  if (/localhost|127\.0\.0\.1/i.test(appUrl)) {
    return stripTrailingSlash(appUrl)
  }

  if (/karsaazqr\.com/i.test(appUrl)) {
    return stripTrailingSlash(appUrl.replace(/^https?:\/\/app\./i, 'https://www.'))
  }

  return stripTrailingSlash(appUrl)
}

export function getAppSiteUrl(): string {
  const appUrl = envConfig.APP_URL

  if (/localhost|127\.0\.0\.1/i.test(appUrl)) {
    return stripTrailingSlash(appUrl)
  }

  if (/karsaazqr\.com/i.test(appUrl)) {
    return APP_HOST
  }

  return stripTrailingSlash(appUrl)
}
