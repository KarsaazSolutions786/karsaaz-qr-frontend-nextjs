'use client'

import { useSubscription } from '@/lib/hooks/queries/useSubscription'
import { SubscriptionDetails } from '@/components/features/subscriptions/SubscriptionDetails'
import { PricingPlans } from '@/components/features/subscriptions/PricingPlans'
import Link from 'next/link'

export default function SubscriptionsPage() {
  const { data: subscription, isLoading } = useSubscription()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">No Active Subscription</h1>
          <p className="mt-4 text-lg text-gray-600">
            Subscribe to a plan to unlock premium features and create unlimited QR codes.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            View Plans
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">Available Plans</h2>
          <PricingPlans />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        <p className="mt-2 text-gray-600">
          Manage your subscription, view billing history, and update payment methods.
        </p>
      </div>

      <SubscriptionDetails subscription={subscription} />

      <div className="mt-8">
        <Link
          href="/pricing"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          ← View all plans
        </Link>
      </div>
    </div>
  )
}
