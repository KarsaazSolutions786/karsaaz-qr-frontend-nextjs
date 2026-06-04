'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import apiClient from '@/lib/api/client'
import { useTranslation } from '@/lib/i18n'

interface CreatePasswordModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

/**
 * Purpose: Executes CreatePasswordModal functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function CreatePasswordModal({ open, onClose, onSuccess }: CreatePasswordModalProps) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const newErrors: Record<string, string[]> = {}
    if (!password) {
      newErrors.password = [t('Password is required.')]
    } else if (password.length < 6) {
      newErrors.password = [t('Password must be at least 6 characters.')]
    }
    if (!passwordConfirmation) {
      newErrors.password_confirmation = [t('Please confirm your password.')]
    } else if (password && password !== passwordConfirmation) {
      newErrors.password_confirmation = [t('Passwords do not match.')]
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await apiClient.put('/passwordless-auth/preference', {
        preference: 'disabled',
        password,
        password_confirmation: passwordConfirmation,
      })
      setPassword('')
      setPasswordConfirmation('')
      onSuccess()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { errors?: Record<string, string[]> } } }
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ password: [t('Failed to set password. Please try again.')] })
      }
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">{t('Create Password')}</h3>
        <p className="mt-1 text-sm text-gray-600">
          {t('Set a password to switch from passwordless to password-based login.')}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <div>
            <label htmlFor="pwd_password" className="block text-sm font-medium text-gray-700">
              {t('Password')}
            </label>
            <input
              id="pwd_password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              minLength={6}
              required
            />
            {errors.password?.map(err => (
              <p key={err} className="mt-1 text-xs text-red-600">
                {err}
              </p>
            ))}
          </div>
          <div>
            <label
              htmlFor="pwd_password_confirmation"
              className="block text-sm font-medium text-gray-700"
            >
              {t('Confirm Password')}
            </label>
            <input
              id="pwd_password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={e => setPasswordConfirmation(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              minLength={6}
              required
            />
            {errors.password_confirmation?.map(err => (
              <p key={err} className="mt-1 text-xs text-red-600">
                {err}
              </p>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              )}
              <span className={loading ? 'invisible' : undefined}>{t('Set Password')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
