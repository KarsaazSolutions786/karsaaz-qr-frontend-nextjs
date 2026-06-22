import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_COOKIE_NAME, isProtectedRoute, isPublicRoute } from '@/lib/config/protected-routes'

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
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

  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return applySecurityHeaders(NextResponse.next())
  }

  const hasAuthCookie = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value)
  const isPublic = isPublicRoute(pathname)

  if (!isPublic && isProtectedRoute(pathname) && !hasAuthCookie) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('from', pathname)
    return applySecurityHeaders(NextResponse.redirect(loginUrl))
  }

  if (hasAuthCookie && (pathname === '/login' || pathname === '/register')) {
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
