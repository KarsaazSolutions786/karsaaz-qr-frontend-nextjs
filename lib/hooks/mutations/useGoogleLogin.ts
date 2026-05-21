'use client'

import { authAPI } from '@/lib/api/endpoints/auth'

/**
 * Purpose: Google login hook — triggers server-side OAuth redirect. No mutation needed since it's a full-page redirect.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useGoogleLogin() {
  /**
   * Purpose: Executes redirectToGoogle functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const redirectToGoogle = () => {
    const redirectUrl = authAPI.getGoogleRedirectUrl()
    window.location.href = redirectUrl
  }

  return { redirectToGoogle }
}
