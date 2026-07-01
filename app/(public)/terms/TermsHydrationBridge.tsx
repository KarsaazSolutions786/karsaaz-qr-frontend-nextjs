'use client'

import { useEffect } from 'react'

/** Hides the SSR terms page once the interactive client content has mounted. */
export function TermsHydrationBridge() {
  useEffect(() => {
    document.getElementById('terms-ssr')?.setAttribute('hidden', 'true')
  }, [])
  return null
}
