'use client'

import React, { useState, useCallback } from 'react'
import apiClient from '@/lib/api/client'
import { EmailStep } from './steps/EmailStep'
import { NameStep } from './steps/NameStep'
import { OTPStep } from './steps/OTPStep'

export interface ViewerAuth {
  token: string
  email: string
  name: string
  viewerId: string
}

type AuthStep = 'email' | 'name' | 'otp'

interface CustomerAuthenticatorProps {
  qrCodeId: string
  onAuthenticated: (viewer: ViewerAuth) => void
  onCancel: () => void
}

const VIEWER_AUTH_KEY = 'viewer_auth'

/**
 * Multi-step auth component for public QR code pages.
 * Steps: email → name → OTP verification
 */
export function CustomerAuthenticator({
  qrCodeId,
  onAuthenticated,
  onCancel,
}: CustomerAuthenticatorProps) {
  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSubmit = useCallback(async (submittedEmail: string) => {
    setEmail(submittedEmail)
    setError(null)
    setStep('name')
  }, [])

  const handleNameSubmit = useCallback(
    async (submittedName: string) => {
      setName(submittedName)
      setError(null)
      setLoading(true)
      try {
        await apiClient.post('/viewer/send-otp', {
          email,
          name: submittedName,
          qr_code_id: qrCodeId,
        })
        setStep('otp')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to send verification code'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [email, qrCodeId]
  )

  const handleOTPVerify = useCallback(
    async (otp: string) => {
      setError(null)
      setLoading(true)
      try {
        const response = await apiClient.post('/viewer/verify-otp', {
          email,
          otp,
          qr_code_id: qrCodeId,
        })

        const viewerAuth: ViewerAuth = {
          token: response.data.token,
          email,
          name,
          viewerId: response.data.viewer_id || response.data.viewerId,
        }

        // Store in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(VIEWER_AUTH_KEY, JSON.stringify(viewerAuth))
        }

        onAuthenticated(viewerAuth)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid verification code'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [email, name, qrCodeId, onAuthenticated]
  )

  const handleResendOTP = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      await apiClient.post('/viewer/send-otp', {
        email,
        name,
        qr_code_id: qrCodeId,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [email, name, qrCodeId])

  const handleBack = useCallback(() => {
    setError(null)
    if (step === 'otp') setStep('name')
    else if (step === 'name') setStep('email')
    else onCancel()
  }, [step, onCancel])

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {(['email', 'name', 'otp'] as AuthStep[]).map((s, i) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step
                ? 'w-8 bg-primary'
                : i < ['email', 'name', 'otp'].indexOf(step)
                  ? 'w-6 bg-primary/60'
                  : 'w-6 bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Steps */}
      {step === 'email' && (
        <EmailStep onSubmit={handleEmailSubmit} onCancel={onCancel} loading={loading} />
      )}
      {step === 'name' && (
        <NameStep email={email} onSubmit={handleNameSubmit} onBack={handleBack} loading={loading} />
      )}
      {step === 'otp' && (
        <OTPStep
          email={email}
          onVerify={handleOTPVerify}
          onResend={handleResendOTP}
          onBack={handleBack}
          loading={loading}
        />
      )}
    </div>
  )
}

export default CustomerAuthenticator
