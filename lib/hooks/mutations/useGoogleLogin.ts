'use client'

import { authAPI } from '@/lib/api/endpoints/auth'

export function useGoogleLogin() {
  const redirectToGoogle = () => {
    const redirectUrl = authAPI.getGoogleRedirectUrl()
    window.location.href = redirectUrl
  }

  return { redirectToGoogle }
}
