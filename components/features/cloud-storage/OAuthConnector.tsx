'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { getAuthUrl, handleOAuthCallback } from '@/lib/api/cloud-storage'
import { CloudProviderType } from '@/types/entities/cloud-storage'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

interface OAuthConnectorProps {
  provider: CloudProviderType
  providerName: string
  onSuccess: () => void
}

type Status = 'idle' | 'getting-url' | 'waiting' | 'processing' | 'success' | 'error'

/**
 * Purpose: Executes OAuthConnector functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function OAuthConnector({ provider, providerName, onSuccess }: OAuthConnectorProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [authWindow, setAuthWindow] = useState<Window | null>(null)

  // Handle OAuth callback message
  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      // Verify origin and message type
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== 'oauth-callback') return
      if (event.data?.provider !== provider) return

      const { code, error: oauthError } = event.data

      if (oauthError) {
        setStatus('error')
        setError(oauthError)
        return
      }

      if (code) {
        setStatus('processing')
        try {
          await handleOAuthCallback(provider, code)
          setStatus('success')
          setTimeout(onSuccess, 1000)
        } catch (err) {
          setStatus('error')
          setError(err instanceof Error ? err.message : t('Failed to complete authorization'))
        }
      }
    },
    [provider, onSuccess]
  )

  // Set up message listener
  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  // Check if auth window was closed
  useEffect(() => {
    if (!authWindow || status !== 'waiting') return

    const checkClosed = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(checkClosed)
        setAuthWindow(null)
        if (status === 'waiting') {
          setStatus('idle')
        }
      }
    }, 500)

    return () => clearInterval(checkClosed)
  }, [authWindow, status])

  /**
   * Purpose: Executes startOAuth functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const startOAuth = async () => {
    setStatus('getting-url')
    setError(null)

    try {
      const { url } = await getAuthUrl(provider)

      // Open OAuth popup
      const width = 600
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        url,
        `${provider}-oauth`,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
      )

      if (popup) {
        setAuthWindow(popup)
        setStatus('waiting')
      } else {
        throw new Error(t('Popup was blocked. Please allow popups for this site.'))
      }
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : t('Failed to start authorization'))
    }
  }

  /**
   * Purpose: Executes renderContent functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <>
            <div className="text-center mb-6">
              <p className="text-gray-600">
                {t('Click the button below to connect your')} {providerName} {t('account')}.
              </p>
            </div>
            <button
              type="button"
              onClick={startOAuth}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('Connect with')} {providerName}
            </button>
          </>
        )

      case 'getting-url':
        return (
          <div className="text-center py-8">
            <LottieLoader size={80} className="mx-auto mb-4" />
            <p className="text-gray-600">{t('Preparing authorization...')}</p>
          </div>
        )

      case 'waiting':
        return (
          <div className="text-center py-8">
            <ArrowPathIcon className="h-8 w-8 mx-auto text-blue-600 mb-4 animate-pulse" />
            <p className="text-gray-900 font-medium mb-2">
              {t('Complete authorization in the popup window')}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {t('Waiting for you to authorize access in')} {providerName}...
            </p>
            <button
              type="button"
              onClick={() => authWindow?.focus()}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {t('Reopen popup window')}
            </button>
          </div>
        )

      case 'processing':
        return (
          <div className="text-center py-8">
            <LottieLoader size={80} className="mx-auto mb-4" />
            <p className="text-gray-600">{t('Completing authorization...')}</p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-900 font-medium">{t('Successfully connected!')}</p>
            <p className="text-sm text-gray-500 mt-1">{t('Your')} {providerName} {t('account is now linked.')}</p>
          </div>
        )

      case 'error':
        return (
          <>
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">{t('Connection failed')}</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={startOAuth}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('Try Again')}
            </button>
          </>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1">{providerName} {t('Authorization')}</h4>
        <p className="text-sm text-gray-600">
          {t("You'll be redirected to")} {providerName} {t('to authorize access to your storage.')}
        </p>
      </div>

      {renderContent()}

      <p className="text-xs text-gray-500 text-center">
        {t('We only request access to create and read backup files in a dedicated folder.')}
      </p>
    </div>
  )
}

export default OAuthConnector
