import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  APP_MARKETING_HOST,
  buildWwwMarketingRedirectUrl,
  shouldRedirectAppHostToWww,
} from '@/lib/config/app-subdomain-marketing-redirect'

import { AUTH_COOKIE_NAME, isProtectedRoute, isPublicRoute } from '@/lib/config/protected-routes'

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? ''
  if (host === APP_MARKETING_HOST && shouldRedirectAppHostToWww(pathname)) {
    const target = buildWwwMarketingRedirectUrl(pathname, request.nextUrl.search)
    return applySecurityHeaders(NextResponse.redirect(target, 301))
  }

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return applySecurityHeaders(NextResponse.next())
  }

  const hasAuthCookie = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value)
  const isPublic = isPublicRoute(pathname)

  if (!isPublic && isProtectedRoute(pathname) && !hasAuthCookie) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('returnUrl', pathname)
    return applySecurityHeaders(NextResponse.redirect(loginUrl))
  }

  if (
    hasAuthCookie &&
    (pathname === '/login' || pathname === '/register' || pathname === '/signup')
  ) {
    // A returnUrl/reason param means the app itself sent the user here (client saw a 401
    // or missing session). The cookie may be stale — bouncing back to /qrcodes/new would
    // create an infinite reload loop, since JS cannot delete the httpOnly cookie.
    const params = request.nextUrl.searchParams
    if (params.has('returnUrl') || params.has('reason')) {
      const response = applySecurityHeaders(NextResponse.next())
      if (params.get('reason') === 'session_expired') {
        response.cookies.delete('auth_token')
      }
      return response
    }
    const home = request.nextUrl.clone()
    home.pathname = '/qrcodes/new'
    home.search = ''
    return applySecurityHeaders(NextResponse.redirect(home))
  }

  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$).*)',
  ],
}
