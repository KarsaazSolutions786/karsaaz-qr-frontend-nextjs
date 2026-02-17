import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  // Note: Token is stored in localStorage (client-side), not in cookies
  // Middleware can't access localStorage, so we skip auth checks here
  // Client-side route protection is handled by:
  // - (dashboard)/layout.tsx - protects dashboard routes
  // - (auth)/layout.tsx - redirects if already logged in
  
  // Allow all requests through - auth protection happens client-side
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
}
