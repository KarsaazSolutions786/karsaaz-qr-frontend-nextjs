'use client'

import { useEffect } from 'react'

const CONSENT_COOKIE = 'karsaaz_cookie_consent'

function setConsent(value: 'accepted' | 'rejected') {
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = CONSENT_COOKIE + '=' + value + '; path=/; max-age=' + maxAge + '; SameSite=Lax'
  document.getElementById('cookie-consent-banner')?.setAttribute('hidden', 'true')
}

export function CookieConsentClient() {
  useEffect(() => {
    const banner = document.getElementById('cookie-consent-banner')
    if (!banner) return
    const onAccept = () => {
      setConsent('accepted')
    }
    const onReject = () => {
      setConsent('rejected')
    }
    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', onAccept)
    banner.querySelector('[data-cookie-reject]')?.addEventListener('click', onReject)
    return () => {
      banner.querySelector('[data-cookie-accept]')?.removeEventListener('click', onAccept)
      banner.querySelector('[data-cookie-reject]')?.removeEventListener('click', onReject)
    }
  }, [])

  return null
}
