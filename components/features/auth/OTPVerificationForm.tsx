'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useVerifyOTP, useResendOTP } from '@/lib/hooks/mutations/useVerifyOTP'

const OTP_LENGTH = 5

interface OTPVerificationFormProps {
  email: string
}

export function OTPVerificationForm({ email }: OTPVerificationFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [showResendSuccess, setShowResendSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const verifyMutation = useVerifyOTP()
  const resendMutation = useResendOTP()

  // Auto-submit when all digits entered
  const handleAutoSubmit = useCallback(
    (digits: string[]) => {
      const code = digits.join('')
      if (code.length === OTP_LENGTH && /^\d+$/.test(code)) {
        verifyMutation.mutate({ email, otp: code })
      }
    },
    [email, verifyMutation]
  )

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when last digit filled
    if (value && index === OTP_LENGTH - 1) {
      handleAutoSubmit(newOtp)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace when current is empty
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length > 0) {
      const newOtp = [...otp]
      for (let i = 0; i < OTP_LENGTH; i++) {
        newOtp[i] = pasted[i] || ''
      }
      setOtp(newOtp)
      // Focus last filled input or last input
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
      inputRefs.current[focusIndex]?.focus()
      if (pasted.length >= OTP_LENGTH) {
        handleAutoSubmit(newOtp)
      }
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length === OTP_LENGTH) {
      verifyMutation.mutate({ email, otp: code })
    }
  }

  // Resend countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync(email)
      setShowResendSuccess(true)
      setCountdown(60) // 60-second cooldown
      setOtp(Array(OTP_LENGTH).fill(''))
      inputRefs.current[0]?.focus()
      setTimeout(() => setShowResendSuccess(false), 5000)
    } catch {
      // Error handled by mutation
    }
  }

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600">
          We sent a {OTP_LENGTH}-digit verification code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleManualSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 text-center mb-3">
            Verification Code
          </label>
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-300 
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
                  transition-all duration-150"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {verifyMutation.isError && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {(verifyMutation.error as Error)?.message ||
                'Verification failed. Please check your code and try again.'}
            </p>
          </div>
        )}

        {showResendSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">New verification code sent!</p>
          </div>
        )}

        <button
          type="submit"
          disabled={otp.join('').length !== OTP_LENGTH || verifyMutation.isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50"
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendMutation.isPending || countdown > 0}
          className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendMutation.isPending
            ? 'Sending...'
            : countdown > 0
              ? `Resend code in ${countdown}s`
              : "Didn't receive code? Resend"}
        </button>
      </div>
    </div>
  )
}
