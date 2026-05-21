'use client'

import React, { useState } from 'react'
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useConnectMega } from '@/lib/api/cloud-storage'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

interface MegaConnectorProps {
  onSuccess: () => void
}

/**
 * Purpose: Executes MegaConnector functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function MegaConnector({ onSuccess }: MegaConnectorProps) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const connectMega = useConnectMega()

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError(t('Please fill in all fields'))
      return
    }

    try {
      await connectMega.mutateAsync({ email, password })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Failed to connect to MEGA'))
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-1">{t('MEGA Connection')}</h4>
        <p className="text-sm text-gray-600">
          {t('Enter your MEGA account credentials to enable cloud backup. Your credentials are securely encrypted.')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Email Address')}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={connectMega.isPending}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Password')}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={connectMega.isPending}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {connectMega.isSuccess && (
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{t('Successfully connected to MEGA!')}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={connectMega.isPending || !email || !password}
          className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {connectMega.isPending ? (
            <span className="inline-flex items-center gap-2">
              <LottieLoader size={80} />
              {t('Connecting...')}
            </span>
          ) : (
            t('Connect to MEGA')
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center">
        {t('By connecting, you agree to allow this application to access your MEGA storage for backup purposes.')}
      </p>
    </div>
  )
}

export default MegaConnector
