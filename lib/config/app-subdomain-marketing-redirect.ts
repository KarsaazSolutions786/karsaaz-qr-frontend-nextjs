export const APP_MARKETING_HOST = 'app.karsaazqr.com'
export const WWW_MARKETING_ORIGIN = 'https://www.karsaazqr.com'

const NO_REDIRECT_PREFIXES = [
  '/account',
  '/api',
  '/dashboard',
  '/payment',
  '/health',
  '/qr',
  '/webhooks',
  '/_next',
]

const MARKETING_EXACT = new Set([
  '/',
  '/login',
  '/signup',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/terms',
  '/privacy-policy',
  '/cookie-policy',
  '/refund-policy',
  '/disclaimer-policy',
  '/subscription-billing-policy',
  '/au-policy',
  '/pricing',
  '/qrcodes/new',
])

export function shouldRedirectAppHostToWww(pathname: string): boolean {
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return false
  }

  for (const prefix of NO_REDIRECT_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return false
    }
  }

  if (MARKETING_EXACT.has(pathname)) {
    return true
  }

  if (pathname === '/guest' || pathname.startsWith('/guest/')) {
    return true
  }

  if (/^\/[a-z0-9-]+-policy\/?$/.test(pathname)) {
    return true
  }

  return false
}

export function buildWwwMarketingRedirectUrl(pathname: string, search: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${WWW_MARKETING_ORIGIN}${path}${search}`
}
