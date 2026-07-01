'use client'

import { useEffect } from 'react'

export function QRCodesNewHydrationBridge() {
  useEffect(() => {
    document.getElementById('qrcodes-new-ssr')?.setAttribute('hidden', 'true')
  }, [])
  return null
}
