'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { usePasswordlessSetPreference } from '@/lib/hooks/mutations/usePasswordlessAuth'

interface ConfirmCurrentPasswordModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ConfirmCurrentPasswordModal({
  open,
  onClose,
  onSuccess,
}: ConfirmCurrentPasswordModalProps) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const setPreferenceMutation = usePasswordlessSetPreference()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!password) {
      setErrors({ password: [t('Current password is required.')] })
      return
    }

    setPreferenceMutation.mutate(
      { preference: 'enabled', password },
      {
        onSuccess: () => {
          setPassword('')
          onSuccess()
        },
        onError: (err: unknown) => {
          const error = err as {
            response?: { data?: { errors?: Record<string, string[]>; message?: string } }
          }
          if (error.response?.data?.errors) {
            setErrors(error.response.data.errors)
          } else {
            setErrors({
              password: [
                error.response?.data?.message ||
                  t('Failed to enable passwordless login. Please try again.'),
              ],
            })
          }
        },
      }
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">{t('Confirm Password')}</h3>
        <p className="mt-1 text-sm text-gray-600">
          {t(
            'Enter your current password to switch to passwordless login. Your password will be removed.'
          )}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <div>
            <label
              htmlFor="confirm_current_password"
              className="block text-sm font-medium text-gray-700"
            >
              {t('Current Password')}
            </label>
            <input
              id="confirm_current_password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
            {errors.password?.map(err => (
              <p key={err} className="mt-1 text-xs text-red-600">
                {err}
              </p>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={setPreferenceMutation.isPending}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              disabled={setPreferenceMutation.isPending}
              className="relative rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {setPreferenceMutation.isPending && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              )}
              <span className={setPreferenceMutation.isPending ? 'invisible' : undefined}>
                {t('Enable Passwordless')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
