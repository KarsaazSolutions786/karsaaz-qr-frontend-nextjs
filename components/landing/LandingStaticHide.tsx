'use client'

import { useEffect } from 'react'

export function LandingStaticHide({ targetId }: { targetId: string }) {
  useEffect(() => {
    document.getElementById(targetId)?.setAttribute('hidden', 'true')
  }, [targetId])
  return null
}
