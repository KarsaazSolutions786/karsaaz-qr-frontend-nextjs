'use client'

import { useEffect } from 'react'

export function SignupHydrationBridge() {
  useEffect(() => {
    const el = document.getElementById('signup-form-ssr')
    if (el) {
      el.style.display = 'none'
      el.setAttribute('hidden', 'true')
    }
  }, [])
  return null
}
