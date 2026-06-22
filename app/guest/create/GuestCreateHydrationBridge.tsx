'use client'

import { useEffect } from 'react'

export function GuestCreateHydrationBridge() {
  useEffect(() => {
    document.getElementById('guest-create-ssr')?.setAttribute('hidden', 'true')
  }, [])
  return null
}
