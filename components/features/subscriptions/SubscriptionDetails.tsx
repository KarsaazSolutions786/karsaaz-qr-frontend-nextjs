'use client'

import { useState } from 'react'
import { Subscription } from '@/types/entities/subscription'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { CancelSubscriptionDialog } from './CancelSubscriptionDialog'
import { formatDate } from '@/lib/utils/format'

interface SubscriptionDetailsProps {
  subscription: Subscription
}

export function SubscriptionDetails({ subscription }: SubscriptionDetailsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { data: plans } = usePlans()
  
  const plan = plans?.find((p) => p.id === subscription.planId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'trial':
        return 'bg-blue-100 text-blue-800'
      case 'canceled':
        return 'bg-yellow-100 text-yellow-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Subscription Overview */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {plan?.name || 'Unknown'} Plan
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(subscription.status)}`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </span>
                {subscription.cancelAtPeriodEnd && (
                  <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    Canceling at period end
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ${plan ? (plan.price / 100).toFixed(2) : '0.00'}
              </p>
              <p className="text-sm text-gray-600">/month</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Period</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {subscription.cancelAtPeriodEnd
                  ? 'Subscription will not renew'
                  : formatDate(subscription.currentPeriodEnd)}
              </dd>
            </div>
          </dl>

          {plan && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Features</h3>
              <ul className="mt-2 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <span className="mr-2 text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {!subscription.cancelAtPeriodEnd ? (
              <button
                onClick={() => setShowCancelDialog(true)}
                className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Cancel Subscription
              </button>
            ) : (
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Reactivate Subscription
              </button>
            )}
            <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Update Payment Method
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
          <p className="mt-1 text-sm text-gray-600">
            View and download your past invoices
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">No invoices yet</p>
          </div>
        </div>
      </div>

      <CancelSubscriptionDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        subscription={subscription}
      />
    </>
  )
}
