'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import {
  useAdminSubscription,
  useSubscriptionStatuses,
} from '@/lib/hooks/queries/useAdminSubscriptions'
import { useUpdateAdminSubscription } from '@/lib/hooks/mutations/useAdminSubscriptionMutations'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { useUser } from '@/lib/hooks/queries/useUsers'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes EditSubscriptionPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function EditSubscriptionPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const subId = Number(id)
  const { data: sub, isLoading } = useAdminSubscription(subId)
  const { data: userData } = useUser(sub?.user_id ? String(sub.user_id) : '')
  const { data: plansData } = usePlans()
  const { data: statuses } = useSubscriptionStatuses()
  const updateMutation = useUpdateAdminSubscription()
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    subscription_plan_id: '',
    subscription_status: '',
    expires_at: '',
  })

  useEffect(() => {
    if (sub) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync form state from async query
      setForm({
        subscription_plan_id: String(sub.subscription_plan_id ?? ''),
        subscription_status: sub.statuses?.[0]?.status ?? '',
        expires_at: sub.expires_at ? sub.expires_at.substring(0, 10) : '',
      })
    }
  }, [sub])

  /**
   * Purpose: Sets .
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }))

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sub) return
    try {
      await updateMutation.mutateAsync({
        id: subId,
        data: {
          user_id: sub.user_id,
          subscription_plan_id: Number(form.subscription_plan_id),
          subscription_status: form.subscription_status,
          expires_at: form.expires_at || null,
        },
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // Error shown by mutation state
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LottieLoader size={80} />
      </div>
    )
  }

  if (!sub) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-red-600">{t('Subscription not found.')}</p>
        <Link href="/subscriptions" className="text-sm text-blue-600">
          {t('← Back to Subscriptions')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/subscriptions" className="text-sm text-blue-600 hover:text-blue-800">
          {t('← Back to Subscriptions')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('Edit Subscription')} #{sub.id}
        </h1>
      </div>

      {/* User info (read-only) */}
      <div className="mb-6 rounded-md bg-gray-50 p-4">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-medium text-gray-700">{t('User:')} </span>
            <Link href={`/users/${sub.user_id}`} className="text-blue-600 hover:underline">
              {/* {sub.user_name || sub.user_id} */}
              {/* {sub.user?.name || sub.user_id} */}
              {/* {sub.user?.name || sub.user_name || sub.user_id} */}
              {/* {userData?.name || sub.user?.name || sub.user_name || sub.user_id} */}
              {sub.user_id}
            </Link>
          </div>
          <div>
            <span className="font-medium text-gray-700">{t('Email:')} </span>
            {/* <span className="text-gray-600">{sub.user_email || '—'}</span> */}
            {/* <span className="text-gray-600">{sub.user?.email || '—'}</span> */}
            {/* <span className="text-gray-600">{sub.user?.email || sub.user_email || '—'}</span> */}
            <span className="text-gray-600">
              {userData?.email || sub.user?.email || sub.user_email || '—'}
            </span>
          </div>
        </div>
      </div>

      {updateMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {t('Failed to update subscription.')}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
          {t('Subscription saved successfully.')}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Subscription Plan')} <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.subscription_plan_id}
            onChange={e => set('subscription_plan_id', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          >
            <option value="">{t('Select a plan…')}</option>
            {plansData?.data.map(plan => (
              <option key={plan.id} value={String(plan.id)}>
                {plan.name} — {plan.frequency} {plan.price > 0 ? `($${plan.price})` : t('(free)')}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Status')} <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.subscription_status}
            onChange={e => set('subscription_status', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          >
            <option value="">{t('Select a status…')}</option>
            {statuses?.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
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
          <label className="block text-sm font-medium text-gray-700">{t('Expires At')}</label>
          <input
            type="date"
            value={form.expires_at}
            onChange={e => set('expires_at', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm sm:max-w-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            href="/subscriptions"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('Cancel')}
          </Link>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? t('Saving…') : t('Save Subscription')}
          </button>
        </div>
      </form>
    </div>
  )
}
