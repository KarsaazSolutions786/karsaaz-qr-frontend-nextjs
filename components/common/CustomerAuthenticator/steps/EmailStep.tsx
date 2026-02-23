'use client'

import React, { useState, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface EmailStepProps {
  onSubmit: (email: string) => void
  onCancel: () => void
  loading: boolean
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EmailStep({ onSubmit, onCancel, loading }: EmailStepProps) {
  const [email, setEmail] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setValidationError('Email is required')
      return
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setValidationError('Please enter a valid email address')
      return
    }
    setValidationError(null)
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Enter your email</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          We&apos;ll send you a verification code
        </p>
      </div>

      <div className="space-y-2">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            if (validationError) setValidationError(null)
          }}
          autoFocus
          disabled={loading}
        />
        {validationError && <p className="text-sm text-red-500">{validationError}</p>}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={loading || !email.trim()}>
          Continue
        </Button>
      </div>
    </form>
  )
}
