'use client'

import { authAPI } from '@/lib/api/endpoints/auth'

/**
 * Google login hook — triggers server-side OAuth redirect.
 * No mutation needed since it's a full-page redirect.
 */
export function useGoogleLogin() {
  const redirectToGoogle = () => {
    const redirectUrl = authAPI.getGoogleRedirectUrl()
    window.location.href = redirectUrl
  }

  return { redirectToGoogle }
}
