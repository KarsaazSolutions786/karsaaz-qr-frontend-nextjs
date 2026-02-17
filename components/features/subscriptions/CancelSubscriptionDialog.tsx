'use client'

import { Subscription } from '@/types/entities/subscription'
import { useCancelSubscription } from '@/lib/hooks/mutations/useCancelSubscription'
import { formatDate } from '@/lib/utils/format'

interface CancelSubscriptionDialogProps {
  isOpen: boolean
  onClose: () => void
  subscription: Subscription
}

export function CancelSubscriptionDialog({
  isOpen,
  onClose,
  subscription,
}: CancelSubscriptionDialogProps) {
  const cancelMutation = useCancelSubscription()

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync()
      onClose()
    } catch (error) {
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
          Cancel Subscription?
        </h3>
        
        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <p>
            Your subscription will remain active until <strong>{formatDate(subscription.currentPeriodEnd)}</strong>.
          </p>
          <p>
            After that date, you'll lose access to:
          </p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Premium features</li>
            <li>Unlimited QR code creation</li>
            <li>Advanced analytics</li>
            <li>Custom branding options</li>
          </ul>
          <p className="font-medium text-gray-700">
            You can reactivate your subscription at any time before {formatDate(subscription.currentPeriodEnd)}.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelMutation.isPending ? 'Canceling...' : 'Yes, Cancel Subscription'}
          </button>

          <button
            onClick={onClose}
            disabled={cancelMutation.isPending}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep Subscription
          </button>
        </div>
      </div>
    </div>
  )
}
