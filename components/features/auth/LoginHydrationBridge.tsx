'use client'

import { useEffect } from 'react'

/** Hides the SSR login form once the interactive client form has mounted. */
export function LoginHydrationBridge() {
  useEffect(() => {
    document.getElementById('login-form-ssr')?.setAttribute('hidden', 'true')
  }, [])
  return null
}
