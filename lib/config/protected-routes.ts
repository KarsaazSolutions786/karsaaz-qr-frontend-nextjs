/**
 * Route protection config for Next.js middleware (server-side auth guard).
 * Matches audit finding F-02: unauthenticated dashboard routes must redirect to /login.
 */

export const AUTH_COOKIE_NAME = 'auth_token'

/** Paths accessible without a registered-user session */
export const PUBLIC_ROUTE_PREFIXES: string[] = [
  '/',
  '/login',
  '/register',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/auth-callback',
  '/guest',
  '/terms',
  '/privacy-policy',
  '/privacy',
  '/cookie-policy',
  '/refund-policy',
  '/disclaimer-policy',
  '/au-policy',
  '/subscription-billing-policy',
  '/checkout',
  '/payment',
  '/pricing',
  '/account/email-verified',
  '/account/dashboard',
  '/org-portal/login',
  '/org-portal/accept-invite',
]

/** Dashboard routes that require auth_token cookie.
 * NOTE: '/qrcodes' is deliberately absent — guest mode serves /qrcodes/new and /qrcodes
 * to visitors whose session token lives in localStorage (no auth_token cookie), so the
 * middleware cannot gate it. DashboardLayout redirects non-user non-guest visitors client-side. */
export const PROTECTED_ROUTE_PREFIXES: string[] = [
  '/users',
  '/plans',
  '/system',
  '/subscriptions',
  '/account-credits',
  '/referrals',
  '/referral',
  '/trash',
  '/translations',
  '/transactions',
  '/template-categories',
  '/support-tickets',
  '/promo-codes',
  '/plugins',
  '/payment-processors',
  '/pages',
  '/organization',
  '/archived',
  '/qrcode-templates',
  '/cloud-storage',
  '/billing',
  '/blog-posts',
  '/contacts',
  '/lead-forms',
  '/content-blocks',
  '/custom-codes',
  '/custom-forms',
  '/currencies',
  '/design-assets',
  '/domains',
  '/dynamic-biolink-blocks',
  '/folders',
  '/apis',
  '/admin',
  '/analytics',
  '/commissions',
  '/notifications',
  '/org-portal/dashboard',
]

export function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true
  return PUBLIC_ROUTE_PREFIXES.some(
    prefix => prefix !== '/' && (pathname === prefix || pathname.startsWith(prefix + '/'))
  )
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(prefix + '/')
  )
}
