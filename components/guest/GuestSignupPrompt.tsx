'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useGuest } from '@/lib/hooks/useGuest'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

export function GuestSignupPrompt() {
  const { t } = useTranslation()
  const { shouldShowSignupPrompt, guestConfig } = useGuest()
  const [dismissed, setDismissed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasDismissed = sessionStorage.getItem('guest_signup_prompt_dismissed')
      if (wasDismissed) setDismissed(true)
    }
  }, [])

  useEffect(() => {
    if (shouldShowSignupPrompt && !dismissed) {
      // Slight delay for slide-in effect
      const timer = setTimeout(() => setVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [shouldShowSignupPrompt, dismissed])

  if (!shouldShowSignupPrompt || dismissed) return null

  const message =
    guestConfig?.signup_prompt_message ||
    t('Sign up to save your QR codes and unlock more features!')

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="border-t border-blue-200 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 shadow-lg">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-sm font-medium text-white sm:text-left">
            ✨ {message}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                {t('Sign Up')}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => {
                setDismissed(true)
                setVisible(false)
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('guest_signup_prompt_dismissed', 'true')
                }
              }}
            >
              {t('Maybe Later')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
