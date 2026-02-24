'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// ============================================
// Image Captcha Component
// ============================================

interface ImageCaptchaValue {
  code: string
  session_key: string
}

interface ImageCaptchaProps {
  name?: string
  value?: ImageCaptchaValue
  onChange?: (value: ImageCaptchaValue) => void
  label?: string
  placeholder?: string
  differentImageText?: string
  error?: string
  disabled?: boolean
  fetchUrl?: string
  className?: string
}

export function ImageCaptcha({
  name = 'captcha',
  value,
  onChange,
  label = 'Human Verification',
  placeholder = 'Enter the code you see above',
  differentImageText = 'Different image',
  error,
  disabled = false,
  fetchUrl = '/api/captcha',
  className,
}: ImageCaptchaProps) {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState(value?.code || '')
  const [sessionKey, setSessionKey] = useState(value?.session_key || '')

  const fetchCaptcha = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(fetchUrl)
      const data = await response.json()
      setImage(data.image)
      setSessionKey(data.session_key)
      setCode('')
      onChange?.({
        code: '',
        session_key: data.session_key,
      })
    } catch (err) {
      console.error('Failed to fetch captcha:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchUrl, onChange])

  useEffect(() => {
    fetchCaptcha()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value
    setCode(newCode)
    onChange?.({
      code: newCode,
      session_key: sessionKey,
    })
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="flex items-center gap-4">
        {/* Captcha Image */}
        <div className="relative w-[193px] h-[84px] border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <svg className="animate-spin h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24">
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
            </div>
          ) : image ? (
            <img src={image} alt="Captcha" className="w-full h-full object-contain" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
              Failed to load
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={fetchCaptcha}
          disabled={loading || disabled}
          className={cn(
            'inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors',
            (loading || disabled) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ArrowPathIcon className={cn('w-4 h-4', loading && 'animate-spin')} />
          <span className="hover:underline">{differentImageText}</span>
        </button>
      </div>

      {/* Code Input */}
      <input
        type="text"
        name={name}
        value={code}
        onChange={handleCodeChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

// ============================================
// Google reCAPTCHA Component
// ============================================

interface GoogleRecaptchaProps {
  siteKey: string
  name?: string
  onChange?: (token: string | null) => void
  onExpired?: () => void
  onError?: () => void
  theme?: 'light' | 'dark'
  size?: 'normal' | 'compact'
  tabIndex?: number
  error?: string
  className?: string
}

// grecaptcha types declared in GoogleReCaptcha.tsx

export function GoogleRecaptcha({
  siteKey,
  name = 'g-recaptcha-response',
  onChange,
  onExpired,
  onError,
  theme = 'light',
  size = 'normal',
  tabIndex = 0,
  error,
  className,
}: GoogleRecaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load reCAPTCHA script if not already loaded
    const scriptId = 'google-recaptcha-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src =
        'https://www.google.com/recaptcha/api.js?onload=qrcgRecaptchaOnLoad&render=explicit'
      script.async = true
      script.defer = true

      window.qrcgRecaptchaOnLoad = () => {
        setIsLoaded(true)
      }

      document.head.appendChild(script)
    } else if (window.grecaptcha) {
      // Script already loaded — defer setState to avoid sync setState in effect
      queueMicrotask(() => setIsLoaded(true))
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current)
        } catch {
          // Ignore errors during cleanup
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !containerRef.current || widgetIdRef.current !== null) return

    window.grecaptcha.ready(() => {
      if (containerRef.current) {
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onChange?.(token)
          },
          'expired-callback': () => {
            onChange?.(null)
            onExpired?.()
          },
          'error-callback': () => {
            onChange?.(null)
            onError?.()
          },
          theme,
          size,
          tabindex: tabIndex,
        })
      }
    })
  }, [isLoaded, siteKey, theme, size, tabIndex, onChange, onExpired, onError])

  return (
    <div className={cn('space-y-2', className)}>
      <div ref={containerRef} />
      {!isLoaded && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
          Loading reCAPTCHA...
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input type="hidden" name={name} />
    </div>
  )
}

// Export reset function for external use
export function useGoogleRecaptcha() {
  const widgetIdRef = useRef<number | null>(null)

  const reset = useCallback(() => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current)
    }
  }, [])

  const getResponse = useCallback(() => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      return window.grecaptcha.getResponse(widgetIdRef.current)
    }
    return ''
  }, [])

  return { reset, getResponse, widgetIdRef }
}

// ============================================
// Unified Captcha Input Component
// ============================================

type CaptchaType = 'image' | 'recaptcha'

interface CaptchaInputProps {
  type?: CaptchaType
  // Image captcha props
  imageCaptchaProps?: Omit<ImageCaptchaProps, 'className'>
  // Google reCAPTCHA props
  recaptchaProps?: Omit<GoogleRecaptchaProps, 'className'>
  className?: string
}

export function CaptchaInput({
  type = 'image',
  imageCaptchaProps,
  recaptchaProps,
  className,
}: CaptchaInputProps) {
  if (type === 'recaptcha' && recaptchaProps?.siteKey) {
    return <GoogleRecaptcha {...recaptchaProps} className={className} />
  }

  return <ImageCaptcha {...imageCaptchaProps} className={className} />
}

export default CaptchaInput
