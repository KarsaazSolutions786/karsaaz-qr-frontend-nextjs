'use client'

import { useEffect, useState } from 'react'
import { portalAxios } from '@/lib/context/OrgPortalAuthContext'
import { BarChart3, Zap, Globe, Star, CheckCircle2, AlertCircle, Coins } from 'lucide-react'
import { toast } from 'sonner'

interface OrgPlan {
  id: number
  name: string
  description?: string
  price: number
  monthly_api_calls: number
  monthly_qr_creates: number
  rate_limit_per_minute: number
  included_tokens?: number
  features?: string[]
  is_popular: boolean
}

interface PlansData {
  current_plan: OrgPlan | null
  available_plans: OrgPlan[]
}

/**
 * Purpose: Executes formatLimit functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
function formatLimit(n: number) {
  return n === -1 ? 'Unlimited' : n.toLocaleString()
}

/**
 * Purpose: Executes OrgPortalPlansPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function OrgPortalPlansPage() {
  const [data, setData] = useState<PlansData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selecting, setSelecting] = useState<number | null>(null)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    portalAxios
      .get<{ data: PlansData }>('/plans')
      .then(res => setData(res.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  /**
   * Purpose: Executes selectPlan functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const selectPlan = async (planId: number) => {
    setSelecting(planId)
    setSuccess('')
    try {
      const res = await portalAxios.post<{
        checkout_url?: string
        data?: { orgPlan?: { name: string } }
        message?: string
      }>('/plan', { plan_id: planId })
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url
      } else {
        const planName = res.data.data?.orgPlan?.name ?? 'new plan'
        setSuccess(`Plan updated to ${planName}.`)
        toast.success(`Plan updated to ${planName}.`)
        // Reload page data to reflect new plan
        portalAxios.get<{ data: PlansData }>('/plans').then(r => setData(r.data.data))
      }
    } catch {
      toast.error('Failed to select plan. Please try again.')
    } finally {
      setSelecting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
        <p className="text-gray-600">Failed to load plans. Please try again later.</p>
      </div>
    )
  }

  const current = data?.current_plan ?? null
  const available = data?.available_plans ?? []

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
        <p className="mt-1 text-sm text-gray-500">Your current plan and available options.</p>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Current plan */}
      {current ? (
        <div className="mb-8 rounded-xl border-2 border-indigo-400 bg-indigo-50 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Current Plan
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{current.name}</h2>
              {current.description && (
                <p className="mt-0.5 text-sm text-gray-500">{current.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-indigo-600">
                ${current.price}
                <span className="text-sm font-normal text-gray-400">/mo</span>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <BarChart3 className="mx-auto mb-1 h-4 w-4 text-indigo-500" />
              <div className="text-sm font-bold text-gray-900">
                {formatLimit(current.monthly_api_calls)}
              </div>
              <div className="text-xs text-gray-400">API Calls / mo</div>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <Globe className="mx-auto mb-1 h-4 w-4 text-green-500" />
              <div className="text-sm font-bold text-gray-900">
                {formatLimit(current.monthly_qr_creates)}
              </div>
              <div className="text-xs text-gray-400">QR Creates / mo</div>
            </div>
            <div className="rounded-lg bg-white p-3 text-center shadow-sm">
              <Zap className="mx-auto mb-1 h-4 w-4 text-yellow-500" />
              <div className="text-sm font-bold text-gray-900">
                {current.rate_limit_per_minute}/min
              </div>
              <div className="text-xs text-gray-400">Rate Limit</div>
            </div>
          </div>

          {/* Features */}
          {current.features && current.features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {current.features.map(f => (
                <span
                  key={f}
                  className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                >
                  <CheckCircle2 className="h-3 w-3" /> {f}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-8 rounded-xl border border-dashed bg-white p-6 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="font-medium text-gray-600">No plan assigned</p>
          <p className="mt-1 text-sm text-gray-400">
            Contact your administrator to get a plan assigned to your organization.
          </p>
        </div>
      )}

      {/* Available plans */}
      {available.length > 0 && (
        <>
          <h2 className="mb-4 text-base font-semibold text-gray-700">Available Plans</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map(plan => {
              const isCurrent = current?.id === plan.id
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border bg-white p-5 shadow-sm ${
                    plan.is_popular ? 'ring-2 ring-indigo-400' : ''
                  } ${isCurrent ? 'ring-2 ring-green-400' : ''}`}
                >
                  {plan.is_popular && !isCurrent && (
                    <span className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                      <Star className="h-3 w-3" /> Popular
                    </span>
                  )}
                  {isCurrent && (
                    <span className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                      <CheckCircle2 className="h-3 w-3" /> Current
                    </span>
                  )}

                  <h3 className="mb-1 font-bold text-gray-900">{plan.name}</h3>
                  {plan.description && (
                    <p className="mb-3 text-xs text-gray-400">{plan.description}</p>
                  )}

                  <div className="mb-4 text-2xl font-extrabold text-indigo-600">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-400">/mo</span>
                  </div>

                  <ul className="mb-4 space-y-1.5 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
                      API calls:
                      <span className="font-semibold ml-auto">
                        {formatLimit(plan.monthly_api_calls)}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-green-400" />
                      QR creates:
                      <span className="font-semibold ml-auto">
                        {formatLimit(plan.monthly_qr_creates)}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-yellow-400" />
                      Rate limit:
                      <span className="font-semibold ml-auto">
                        {plan.rate_limit_per_minute}/min
                      </span>
                    </li>
                    {(plan.included_tokens ?? 0) > 0 && (
                      <li className="flex items-center gap-2">
                        <Coins className="h-3.5 w-3.5 text-indigo-400" />
                        Included tokens:
                        <span className="font-semibold ml-auto">
                          {(plan.included_tokens ?? 0).toLocaleString()}
                        </span>
                      </li>
                    )}
                  </ul>

                  {plan.features && plan.features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {plan.features.map(f => (
                        <span
                          key={f}
                          className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {!isCurrent && (
                    <button
                      onClick={() => selectPlan(plan.id)}
                      disabled={selecting === plan.id}
                      className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {selecting === plan.id
                        ? 'Redirecting…'
                        : plan.price > 0
                          ? `Upgrade — $${plan.price}/mo`
                          : 'Select Free Plan'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
