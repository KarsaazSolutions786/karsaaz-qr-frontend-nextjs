'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { getAuthUrl, handleOAuthCallback } from '@/lib/api/cloud-storage'
import { CloudProviderType } from '@/types/entities/cloud-storage'

interface OAuthConnectorProps {
  provider: CloudProviderType
  providerName: string
  onSuccess: () => void
}

type Status = 'idle' | 'getting-url' | 'waiting' | 'processing' | 'success' | 'error'

export function OAuthConnector({ provider, providerName, onSuccess }: OAuthConnectorProps) {
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
          setError(err instanceof Error ? err.message : 'Failed to complete authorization')
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
        throw new Error('Popup was blocked. Please allow popups for this site.')
      }
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to start authorization')
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <>
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Click the button below to connect your {providerName} account.
              </p>
            </div>
            <button
              type="button"
              onClick={startOAuth}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect with {providerName}
            </button>
          </>
        )

      case 'getting-url':
        return (
          <div className="text-center py-8">
            <svg
              className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600">Preparing authorization...</p>
          </div>
        )

      case 'waiting':
        return (
          <div className="text-center py-8">
            <ArrowPathIcon className="h-8 w-8 mx-auto text-blue-600 mb-4 animate-pulse" />
            <p className="text-gray-900 font-medium mb-2">
              Complete authorization in the popup window
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Waiting for you to authorize access in {providerName}...
            </p>
            <button
              type="button"
              onClick={() => authWindow?.focus()}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Reopen popup window
            </button>
          </div>
        )

      case 'processing':
        return (
          <div className="text-center py-8">
            <svg
              className="animate-spin h-8 w-8 mx-auto text-blue-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600">Completing authorization...</p>
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
            <p className="text-gray-900 font-medium">Successfully connected!</p>
            <p className="text-sm text-gray-500 mt-1">Your {providerName} account is now linked.</p>
          </div>
        )

      case 'error':
        return (
          <>
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Connection failed</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={startOAuth}
              className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1">{providerName} Authorization</h4>
        <p className="text-sm text-gray-600">
          You&apos;ll be redirected to {providerName} to authorize access to your storage.
        </p>
      </div>

      {renderContent()}

      <p className="text-xs text-gray-500 text-center">
        We only request access to create and read backup files in a dedicated folder.
      </p>
    </div>
  )
}

export default OAuthConnector
