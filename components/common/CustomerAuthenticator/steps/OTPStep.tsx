'use client'

import React, { useState, useEffect, useRef, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface OTPStepProps {
  email: string
  onVerify: (otp: string) => void
  onResend: () => void
  onBack: () => void
  loading: boolean
}

const OTP_LENGTH = 6
const RESEND_COOLDOWN_SECONDS = 60

export function OTPStep({ email, onVerify, onResend, onBack, loading }: OTPStepProps) {
  const [otp, setOtp] = useState('')
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN_SECONDS)
  const inputRef = useRef<HTMLInputElement>(null)

  // Resend cooldown timer
  useEffect(() => {
    if (resendCountdown <= 0) return
    const timer = setInterval(() => {
      setResendCountdown(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCountdown])

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = otp.trim()
    if (trimmed.length < OTP_LENGTH) return
    onVerify(trimmed)
  }

  const handleResend = () => {
    if (resendCountdown > 0) return
    setResendCountdown(RESEND_COOLDOWN_SECONDS)
    onResend()
  }

  const handleChange = (value: string) => {
    // Only allow digits
    const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH)
    setOtp(digits)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Enter verification code
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          We sent a {OTP_LENGTH}-digit code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          placeholder={'0'.repeat(OTP_LENGTH)}
          value={otp}
          onChange={e => handleChange(e.target.value)}
          maxLength={OTP_LENGTH}
          className="text-center text-2xl tracking-[0.5em] font-mono"
          disabled={loading}
          autoComplete="one-time-code"
        />
      </div>

      {/* Resend button */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCountdown > 0 || loading}
          className="text-sm text-primary hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
        >
          {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend code'}
        </button>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={loading}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading || otp.length < OTP_LENGTH}>
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </div>
    </form>
  )
}
