'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

/**
 * OAuth Callback Page
 * 
 * This page handles OAuth redirects from cloud storage providers.
 * It runs in a popup window, extracts the authorization code from URL params,
 * and sends it back to the parent window via postMessage.
 * 
 * Per CLOUD_STORAGE_DOCUMENTATION.md Section 7:
 * - Parses URL params (code, state, provider)
 * - Detects provider from state param format: "provider:random_token"
 * - Posts message to parent window with type 'cloud-oauth-callback'
 * - Shows "Authorization Successful" message
 * - Auto-closes after 1.5 seconds
 */

type CallbackStatus = 'processing' | 'success' | 'error'

function CallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<CallbackStatus>('processing')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Extract OAuth parameters from URL
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Handle OAuth errors
    if (error) {
      setStatus('error')
      setErrorMessage(errorDescription || error)
      return
    }

    // Validate required params
    if (!code) {
      setStatus('error')
      setErrorMessage('No authorization code received')
      return
    }

    // Detect provider from state parameter
    // State format: "provider:random_token" (e.g., "google_drive:abc123")
    let provider: string | null = null
    if (state) {
      const parts = state.split(':')
      if (parts.length >= 1 && parts[0]) {
        provider = parts[0]
      }
    }

    // Also check for provider in URL (some backends include it directly)
    const urlProvider = searchParams.get('provider')
    if (urlProvider) {
      provider = urlProvider
    }

    // If still no provider, try to infer from referrer or fallback
    if (!provider) {
      // Check if we can detect from URL patterns
      const referrer = document.referrer || ''
      if (referrer.includes('google')) provider = 'google_drive'
      else if (referrer.includes('dropbox')) provider = 'dropbox'
      else if (referrer.includes('microsoft') || referrer.includes('live')) provider = 'onedrive'
    }

    // Ensure we're in a popup with an opener
    if (!window.opener) {
      setStatus('error')
      setErrorMessage('This page must be opened in a popup window')
      return
    }

    try {
      // Send the OAuth data back to the parent window
      window.opener.postMessage({
        type: 'cloud-oauth-callback',
        code,
        state,
        provider,
      }, window.location.origin)

      // Mark as successful
      setStatus('success')

      // Auto-close popup after 1.5 seconds
      setTimeout(() => {
        window.close()
      }, 1500)
    } catch (err) {
      setStatus('error')
      setErrorMessage('Failed to communicate with parent window')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-lg text-center">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Authorization
            </h1>
            <p className="text-gray-600">
              Please wait while we complete your connection...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Authorization Successful
            </h1>
            <p className="text-gray-600">
              Your cloud storage account has been connected. This window will close automatically.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Authorization Failed
            </h1>
            <p className="text-gray-600 mb-4">
              {errorMessage || 'An error occurred during authorization.'}
            </p>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function CloudStorageOAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-lg text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h1>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
