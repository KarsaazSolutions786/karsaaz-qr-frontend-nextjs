'use client'

import { useEffect } from 'react'
import {
  pickAppStoreRedirectUrl,
  type NormalizedAppDownload,
} from '@/lib/utils/normalize-app-download'

interface AppStoreRedirectProps {
  app: Pick<NormalizedAppDownload, 'playStoreUrl' | 'appStoreUrl'>
}

export default function AppStoreRedirect({ app }: AppStoreRedirectProps) {
  useEffect(() => {
    const target = pickAppStoreRedirectUrl(app, navigator.userAgent)
    if (target) {
      window.location.replace(target)
    }
  }, [app])

  return null
}
