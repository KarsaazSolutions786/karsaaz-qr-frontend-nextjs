'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { useOrgPlans } from '@/lib/hooks/queries/useOrgPlans'
import { useOrgStore } from '@/lib/stores/useOrgStore'
import { orgPlanSelfServiceAPI, type OrgPlan } from '@/lib/api/endpoints/organization'

function formatLimit(n: number) {
  return n === -1 ? 'Unlimited' : n.toLocaleString()
}

export function OrganizationUpgradeContent() {
  const { data, isLoading, error } = useOrgPlans()
  const { selectedOrg } = useOrgStore()
  const router = useRouter()
  const [selecting, setSelecting] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const plans = (data?.data?.data ?? []).filter(p => p.is_active && !p.is_custom)

  const handleSelectPlan = async (plan: OrgPlan) => {
    if (!selectedOrg) {
      toast.error('No organization selected')
      return
    }

    setSelecting(plan.id)
    try {
      // TypeScript safety since data is either an Organization or an object with checkout_url
      const response = await orgPlanSelfServiceAPI.select(selectedOrg.id, plan.id)
      const responseData = response.data?.data as any

      if (responseData?.checkout_url) {
        window.location.href = responseData.checkout_url
      } else {
        toast.success(response.data?.message || 'Plan upgraded successfully!')
        router.push(`/organization/dashboard?org=${selectedOrg.id}`)
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to select plan')
    } finally {
      setSelecting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse rounded-2xl border bg-white p-6">
            <div className="h-6 w-24 rounded bg-gray-200" />
            <div className="mt-4 h-10 w-32 rounded bg-gray-200" />
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-4 w-full rounded bg-gray-200" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-800 m-8">
        Failed to load organization plans. Please try again later.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Upgrade your Organization
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Unlock higher limits, dedicated rate limits, and more API calls for{' '}
          {mounted && selectedOrg ? selectedOrg.name : 'your organization'}.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-lg ${
              plan.is_popular ? 'border-purple-400 ring-2 ring-purple-200' : 'border-gray-200'
            }`}
          >
            {plan.is_popular && (
              <span className="absolute -top-3 left-6 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            {plan.description && <p className="mt-1 text-sm text-gray-500">{plan.description}</p>}

            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold text-purple-700">${plan.price}</span>
              <span className="ml-1 text-base text-gray-400">/month</span>
            </div>

            <ul className="mb-6 flex-1 space-y-2.5 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
                {formatLimit(plan.monthly_api_calls)} API calls / month
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
                {formatLimit(plan.monthly_qr_creates)} QR code creates / month
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
                {plan.rate_limit_per_minute} requests/minute rate limit
              </li>
              {!!plan.included_tokens && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
                  {plan.included_tokens.toLocaleString()} bonus credits included
                </li>
              )}
              {plan.max_seats !== undefined && (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
                  {formatLimit(plan.max_seats)} members limit
                </li>
              )}
              {(plan.features ?? []).map(f => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan)}
              disabled={selecting === plan.id || !selectedOrg}
              className="mt-auto flex w-full items-center justify-center rounded-full bg-purple-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {selecting === plan.id ? 'Processing...' : 'Upgrade Now'}
            </button>
          </div>
        ))}

        {/* Custom Plan Card */}
        <div className="flex h-full flex-col rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 p-6">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Custom</h3>
          </div>
          <p className="mb-6 text-sm text-gray-600">
            Need higher limits, a dedicated rate limit, or bespoke terms? We build a plan around
            your organization's actual usage.
          </p>
          <ul className="mb-6 flex-1 space-y-2.5 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
              Tailored API call & QR create limits
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
              Unlimited members support
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
              Custom rate limits for high-volume integrations
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
              Negotiated included credits
            </li>
          </ul>
          <a
            href="mailto:sales@karsaaz.com"
            className="mt-auto flex w-full items-center justify-center rounded-full border-2 border-purple-600 py-3 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
          >
            Talk to Sales
          </a>
        </div>
      </div>
    </div>
  )
}
