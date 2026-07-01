'use client'

import { useEffect } from 'react'

export function SignupHydrationBridge() {
  useEffect(() => {
    document.getElementById('signup-form-ssr')?.setAttribute('hidden', 'true')
  }, [])
  return null
}
