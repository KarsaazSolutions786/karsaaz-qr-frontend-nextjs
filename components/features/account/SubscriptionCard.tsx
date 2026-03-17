'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSubscription } from '@/lib/hooks/useSubscription'
import { authAPI } from '@/lib/api/endpoints/auth'
import { User } from '@/types/entities/user'
import { useTranslation } from '@/lib/i18n'

interface SubscriptionCardProps {
  user: User
}

function formatNumber(value: number | null | undefined, translate?: (key: string) => string): string {
  if (value === null || value === undefined) return '0'
  if (value === -1) return translate ? translate('Unlimited') : 'Unlimited'
  return String(value)
}

export function SubscriptionCard({ user }: SubscriptionCardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [cancelLoading, setCancelLoading] = useState(false)

  const {
    plan,
    remainingDays,
    isOnTrial,
    features,
    usage,
    status,
    invalidateSubscription,
  } = useSubscription()

  const isSuperAdmin = Boolean(user.roles?.[0]?.super_admin)

  const planName = plan?.name || (isOnTrial ? t('Trial') : t('No Plan'))

  const remainingDaysDisplay = (() => {
    if (isNaN(remainingDays) || remainingDays === null || remainingDays === undefined) return t('N/A')
    if (remainingDays > 365) return t('Unlimited')
    return Math.max(0, remainingDays)
  })()

  const allowedDynamic = features.max_dynamic_qrcodes
  const usedDynamic = usage.dynamicQrcodes
  const remainingDynamic = allowedDynamic === -1 ? t('Unlimited') : Math.max(0, allowedDynamic - usedDynamic)
  const allowedScans = features.max_scans_per_month
  const usedScans = usage.scansThisMonth

  const remainingScans = allowedScans === -1 ? t('Unlimited') : Math.max(0, allowedScans - usedScans)

  const isCanceled = status === 'expired'

  const handleCancelSubscription = async () => {
    if (!confirm(t('Are you sure you want to cancel your subscription?'))) return
    setCancelLoading(true)
    try {
      await authAPI.cancelSubscription()
      toast.success(t('Your subscription has been canceled successfully.'))
      // Invalidate and refetch subscription data
      invalidateSubscription()
    } catch {
      toast.error(t('Unable to cancel subscription. Please try again or contact support.'))
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('Subscription')}</h2>
        {isCanceled && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            {t('Canceled')}
          </span>
        )}
        {isOnTrial && (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            {t('Trial')}
          </span>
        )}
      </div>

      {/* Subscription Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Row 1 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">{t('Plan')}</div>
          <div className="text-lg font-semibold text-gray-900">{planName}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">{t('Remaining Days')}</div>
          <div className="text-lg font-semibold text-gray-900">{remainingDaysDisplay}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">{t('Remaining Scans')}</div>
          <div className="text-lg font-semibold text-gray-900">{remainingScans}</div>
        </div>

        {/* Row 2 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">{t('Allowed Dynamic QR Codes')}</div>
          <div className="text-lg font-semibold text-gray-900">{formatNumber(allowedDynamic, t)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">{t('Used Dynamic QR Codes')}</div>
          <div className="text-lg font-semibold text-gray-900">{usedDynamic}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">{t('Remaining Dynamic QR Codes')}</div>
          <div className="text-lg font-semibold text-gray-900">{remainingDynamic}</div>
        </div>

        {/* Row 3 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">{t('Used Scans')}</div>
          <div className="text-lg font-semibold text-gray-900">{usedScans}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">{t('Allowed QR Code Scans')}</div>
          <div className="text-lg font-semibold text-gray-900">{formatNumber(allowedScans, t)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">{t('Max Invited Users')}</div>
          <div className="text-lg font-semibold text-gray-900">{formatNumber(features.max_invited_users, t)}</div>
        </div>
      </div>

      {/* Actions - hidden for admin/sub-users */}
      {!isSuperAdmin && !user.is_sub && (
        <div className="flex flex-wrap gap-3">
          {!isCanceled && (
            <button
              type="button"
              onClick={handleCancelSubscription}
              disabled={cancelLoading}
              className="inline-flex items-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {cancelLoading ? t('Canceling...') : t('Cancel Subscription')}
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push('/pricing')}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {t('Change Plan')}
          </button>
        </div>
      )}
    </div>
  )
}
