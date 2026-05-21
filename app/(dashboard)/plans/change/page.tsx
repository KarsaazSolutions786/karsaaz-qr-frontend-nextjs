'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { useAuth } from '@/lib/hooks/useAuth'
import { planChangeAPI, type PlanChangePreview } from '@/lib/api/endpoints/account'
import { mapSubscriptionPlanToPlan } from '@/lib/utils/plan-mapper'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes PlanChangeContent functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function PlanChangeContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()
  const newPlanId = searchParams.get('plan')
  const { user } = useAuth()
  const { data: plansData, isLoading: plansLoading } = usePlans()

  const [preview, setPreview] = useState<PlanChangePreview | null>(null)
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const allPlans = plansData?.data || []
  const newPlan = allPlans.find((p) => p.id === Number(newPlanId))
  const mappedNewPlan = newPlan ? mapSubscriptionPlanToPlan(newPlan) : undefined

  // Fetch preview
  useEffect(() => {
    if (!newPlanId) return
    let cancelled = false

    /**
     * Purpose: Executes fetchPreview functionality.
     * Owner/Author: Syed Ashhad
     * Created/Updated: February 2026
     */
    const fetchPreview = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await planChangeAPI.preview(Number(newPlanId))
        if (!cancelled) setPreview(res)
      } catch {
        if (!cancelled) setError(t('Failed to load plan change details'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPreview()
    return () => { cancelled = true }
  }, [newPlanId])

  /**
   * Purpose: Executes handleConfirm functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleConfirm = async () => {
    if (!newPlanId) return
    try {
      setExecuting(true)
      setError(null)
      await planChangeAPI.execute(Number(newPlanId))
      setSuccess(true)
      setTimeout(() => router.push('/plans'), 2000)
    } catch {
      setError(t('Failed to change plan. Please try again.'))
    } finally {
      setExecuting(false)
    }
  }

  if (plansLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">{t('Loading plan details...')}</div>
      </div>
    )
  }

  if (!newPlanId || !mappedNewPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('Invalid Plan')}</h2>
          <p className="mt-2 text-gray-600">{t('Please select a plan to switch to.')}</p>
          <Link
            href="/plans"
            className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            {t('View Plans')}
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{t('Plan Changed Successfully!')}</h2>
          <p className="mt-2 text-gray-600">{t('Redirecting to your plans page...')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('Change Plan')}</h1>
          <p className="mt-2 text-gray-600">{t('Review your plan change before confirming')}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {/* Plan Comparison */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Plan Comparison')}</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Current Plan */}
            <div className="rounded-md border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase">{t('Current Plan')}</h3>
                <Badge variant="secondary">{t('Current')}</Badge>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {preview?.current_plan.name || user?.subscriptions?.[0]?.name || t('Free')}
              </p>
              <p className="text-lg font-semibold text-gray-600 mt-1">
                ${preview ? (preview.current_plan.price / 100).toFixed(2) : '0.00'}/mo
              </p>
            </div>

            {/* New Plan */}
            <div className="rounded-md border-2 border-blue-500 bg-blue-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium text-blue-600 uppercase">{t('New Plan')}</h3>
                {preview && (
                  <Badge variant={preview.is_upgrade ? 'default' : 'outline'}>
                    {preview.is_upgrade ? t('Upgrade') : t('Downgrade')}
                  </Badge>
                )}
              </div>
              <p className="text-xl font-bold text-gray-900">{mappedNewPlan.name}</p>
              <p className="text-lg font-semibold text-blue-600 mt-1">
                ${(mappedNewPlan.price / 100).toFixed(2)}/mo
              </p>
            </div>
          </div>
        </div>

        {/* Prorated Pricing */}
        {preview && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Pricing Details')}</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">{t('Prorated adjustment')}</dt>
                <dd className="font-medium text-gray-900">
                  {preview.prorated_amount >= 0 ? '+' : '-'}${Math.abs(preview.prorated_amount / 100).toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">{t('Effective date')}</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(preview.effective_date).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <dt className="font-semibold text-gray-900">{t('New monthly price')}</dt>
                <dd className="font-semibold text-gray-900">
                  ${(preview.new_plan.price / 100).toFixed(2)}/month
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/plans"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {t('← Back to Plans')}
          </Link>
          <Button
            size="lg"
            onClick={handleConfirm}
            disabled={executing || !preview}
          >
            {executing
              ? t('Processing...')
              : preview?.is_upgrade
                ? t('Confirm Upgrade')
                : t('Confirm Downgrade')}
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Purpose: Executes PlanChangePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function PlanChangePage() {
  const { t } = useTranslation()
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-600">{t('Loading...')}</div>
        </div>
      }
    >
      <PlanChangeContent />
    </Suspense>
  )
}
