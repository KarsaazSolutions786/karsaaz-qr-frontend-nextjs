'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { useSubscriptionStatuses } from '@/lib/hooks/queries/useAdminSubscriptions'
import { useCreateAdminSubscription } from '@/lib/hooks/mutations/useAdminSubscriptionMutations'

export default function NewSubscriptionPage() {
  const createMutation = useCreateAdminSubscription()
  const { data: plansData } = usePlans()
  const { data: statuses } = useSubscriptionStatuses()

  const [form, setForm] = useState({
    user_id: '',
    subscription_plan_id: '',
    subscription_status: '',
    expires_at: '',
  })

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync({
      user_id: Number(form.user_id),
      subscription_plan_id: Number(form.subscription_plan_id),
      subscription_status: form.subscription_status,
      expires_at: form.expires_at || null,
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/subscriptions" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Subscriptions
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Subscription</h1>
      </div>

      {createMutation.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to create subscription. Please check the details and try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              value={form.user_id}
              onChange={(e) => set('user_id', e.target.value)}
              placeholder="Enter user ID"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              You can find user IDs in the{' '}
              <Link href="/users" className="text-blue-600 hover:underline">Users</Link> section.
            </p>
          </div>

          {/* Subscription Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subscription Plan <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.subscription_plan_id}
              onChange={(e) => set('subscription_plan_id', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            >
              <option value="">Select a plan…</option>
              {plansData?.data.map((plan) => (
                <option key={plan.id} value={String(plan.id)}>
                  {plan.name} — {plan.frequency} {plan.price > 0 ? `($${plan.price})` : '(free)'}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.subscription_status}
              onChange={(e) => set('subscription_status', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            >
              <option value="">Select a status…</option>
              {statuses?.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              {/* Fallback statuses if API has none */}
              {(!statuses || statuses.length === 0) && (
                <>
                  <option value="active">active</option>
                  <option value="cancelled">cancelled</option>
                  <option value="expired">expired</option>
                  <option value="pending">pending</option>
                  <option value="trialing">trialing</option>
                </>
              )}
            </select>
          </div>

          {/* Expires At */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Expires At</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => set('expires_at', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm sm:max-w-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            href="/subscriptions"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating…' : 'Create Subscription'}
          </button>
        </div>
      </form>
    </div>
  )
}
