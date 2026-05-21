'use client'

import { useState, useCallback } from 'react'
import {
  twoFactorAPI,
  type TwoFactorStatus,
  type TwoFactorSetup,
} from '@/lib/api/endpoints/account'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/i18n'
import { sanitizeSvg } from '@/lib/utils/dom-safety'

interface TwoFactorTabProps {
  userId: number | string
}

/**
 * Purpose: Executes TwoFactorTab functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function TwoFactorTab({ userId }: TwoFactorTabProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState<TwoFactorStatus | null>(null)
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [confirmCode, setConfirmCode] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [disableCode, setDisableCode] = useState('')
  const [showDisable, setShowDisable] = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      const res = await twoFactorAPI.status(userId)
      setStatus(res)
      setFetched(true)
    } catch {
      setError(t('Failed to load 2FA status'))
      setFetched(true)
    } finally {
      setLoading(false)
    }
  }, [userId])

  if (!fetched && !loading) {
    fetchStatus()
  }

  /**
   * Purpose: Executes handleEnable functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleEnable = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await twoFactorAPI.enable(userId)
      setSetup(res)
    } catch {
      setError(t('Failed to initiate 2FA setup'))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Purpose: Executes handleConfirm functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleConfirm = async () => {
    if (!confirmCode) return
    try {
      setLoading(true)
      setError(null)
      await twoFactorAPI.confirm(userId, confirmCode)
      setSetup(null)
      setConfirmCode('')
      setSuccess(t('Two-factor authentication enabled successfully!'))
      await fetchStatus()
    } catch {
      setError(t('Invalid verification code. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Purpose: Executes handleDisable functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDisable = async () => {
    if (!disablePassword || !disableCode) return
    try {
      setLoading(true)
      setError(null)
      await twoFactorAPI.disable(userId, disablePassword, disableCode)
      setShowDisable(false)
      setDisablePassword('')
      setDisableCode('')
      setSuccess(t('Two-factor authentication disabled.'))
      await fetchStatus()
    } catch {
      setError(t('Invalid password or code. Cannot disable 2FA.'))
    } finally {
      setLoading(false)
    }
  }

  /**
   * Purpose: Executes handleShowRecovery functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleShowRecovery = async () => {
    try {
      setLoading(true)
      const res = await twoFactorAPI.recoveryCodes(userId)
      setRecoveryCodes(res.data)
      setShowRecovery(true)
    } catch {
      setError(t('Failed to load recovery codes'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">{t('Two-Factor Authentication')}</h2>
          {status && (
            <Badge variant={status.enabled ? 'default' : 'secondary'}>
              {status.enabled ? t('Enabled') : t('Disabled')}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-6">
          {t('Add an extra layer of security to your account using a TOTP authenticator app.')}
        </p>

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</div>
        )}

        {/* Setup flow: show QR code */}
        {setup && (
          <div className="mb-6 space-y-4 rounded-md border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">
              {t('Scan this QR code with your authenticator app:')}
            </p>
            <div
              className="flex justify-center bg-white rounded-md p-4"
              dangerouslySetInnerHTML={{ __html: sanitizeSvg(setup.qr_code_svg) }}
            />
            <div>
              <p className="text-xs text-gray-500 mb-1">{t('Or enter this secret manually:')}</p>
              <code className="block rounded bg-white px-3 py-2 text-sm font-mono border break-all">
                {setup.secret}
              </code>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('Enter verification code')}
              </label>
              <div className="flex gap-2">
                <Input
                  value={confirmCode}
                  onChange={e => setConfirmCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                />
                <Button onClick={handleConfirm} disabled={loading || confirmCode.length < 6}>
                  {loading ? t('Verifying...') : t('Verify & Enable')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Current status actions */}
        {!setup && status && !status.enabled && (
          <Button onClick={handleEnable} disabled={loading}>
            {loading ? t('Setting up...') : t('Enable Two-Factor Authentication')}
          </Button>
        )}

        {!setup && status?.enabled && (
          <div className="space-y-4">
            {/* Recovery codes */}
            {!showRecovery ? (
              <Button variant="outline" onClick={handleShowRecovery} disabled={loading}>
                {t('View Recovery Codes')}
              </Button>
            ) : (
              <div className="rounded-md border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">{t('Recovery Codes')}</h3>
                <p className="text-xs text-gray-500 mb-3">
                  {t(
                    'Store these codes securely. Each can be used once if you lose access to your authenticator.'
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {recoveryCodes.map(code => (
                    <code
                      key={code}
                      className="rounded bg-gray-50 px-3 py-1.5 text-sm font-mono text-center border"
                    >
                      {code}
                    </code>
                  ))}
                </div>
              </div>
            )}

            {/* Disable 2FA */}
            {!showDisable ? (
              <Button variant="destructive" onClick={() => setShowDisable(true)}>
                {t('Disable Two-Factor Authentication')}
              </Button>
            ) : (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 space-y-3">
                <p className="text-sm text-red-800">
                  {t('Enter your password and authenticator code to disable 2FA:')}
                </p>
                <div className="space-y-2">
                  <Input
                    type="password"
                    value={disablePassword}
                    onChange={e => setDisablePassword(e.target.value)}
                    placeholder={t('Current password')}
                  />
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={disableCode}
                    onChange={e => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder={t('6-digit code')}
                    maxLength={6}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={handleDisable}
                      disabled={loading || !disablePassword || disableCode.length < 6}
                    >
                      {loading ? t('Disabling...') : t('Confirm Disable')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDisable(false)
                        setDisablePassword('')
                        setDisableCode('')
                      }}
                    >
                      {t('Cancel')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
