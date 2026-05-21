'use client'

import { useTranslation } from '@/lib/i18n'
import { Subscription } from '@/types/entities/subscription'
import { useCancelSubscription } from '@/lib/hooks/mutations/useCancelSubscription'
import { formatDate } from '@/lib/utils/format'

interface CancelSubscriptionDialogProps {
  isOpen: boolean
  onClose: () => void
  subscription: Subscription
}

/**
 * Purpose: Executes CancelSubscriptionDialog functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function CancelSubscriptionDialog({
  isOpen,
  onClose,
  subscription,
}: CancelSubscriptionDialogProps) {
  const { t } = useTranslation()
  const cancelMutation = useCancelSubscription()

  /**
   * Purpose: Executes handleCancel functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync()
      onClose()
    } catch {
      // Error handled by mutation
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <span className="text-2xl">⚠️</span>
          </div>
        </div>

        <h3 className="text-center text-lg font-semibold text-gray-900">
          {t('Cancel Subscription?')}
        </h3>
        
        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <p>
            {t('Your subscription will remain active until')} <strong>{formatDate(subscription.currentPeriodEnd)}</strong>.
          </p>
          <p>
            {t("After that date, you'll lose access to:")}
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>{t('Premium features')}</li>
            <li>{t('Unlimited QR code creation')}</li>
            <li>{t('Advanced analytics')}</li>
            <li>{t('Custom branding options')}</li>
          </ul>
          <p className="font-medium text-gray-700">
            {t('You can reactivate your subscription at any time before')} {formatDate(subscription.currentPeriodEnd)}.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelMutation.isPending ? t('Canceling...') : t('Yes, Cancel Subscription')}
          </button>

          <button
            onClick={onClose}
            disabled={cancelMutation.isPending}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('Keep Subscription')}
          </button>
        </div>
      </div>
    </div>
  )
}
