'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { orgPlanAPI } from '@/lib/api/endpoints/organization'
import { plansAPI } from '@/lib/api/endpoints/plans'
import type { SubscriptionPlan } from '@/types/entities/plan'

const DEFAULT_FORM = {
  name: '',
  description: '',
  price: 0,
  monthly_api_calls: -1,
  monthly_qr_creates: -1,
  rate_limit_per_minute: 60,
  included_tokens: 0,
  features: [] as string[],
  max_seats: -1,
  default_subscription_plan_id: null as number | null,
  is_active: true,
  is_popular: false,
  organization_id: null,
  sort_order: 0,
}

export function CreateOrgPlanForm() {
  const router = useRouter()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [featureInput, setFeatureInput] = useState('')
  const [subPlans, setSubPlans] = useState<SubscriptionPlan[]>([])

  useEffect(() => {
    plansAPI
      .getAll({ page: 1 })
      .then(res => setSubPlans(res.data))
      .catch(() => {})
  }, [])

  const addFeature = () => {
    const f = featureInput.trim()
    if (f && !form.features.includes(f)) {
      setForm(p => ({ ...p, features: [...p.features, f] }))
    }
    setFeatureInput('')
  }

  const removeFeature = (f: string) =>
    setForm(p => ({ ...p, features: p.features.filter(x => x !== f) }))

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required')
    setSaving(true)
    try {
      await orgPlanAPI.create(form)
      toast.success('Organization Plan created successfully')
      router.push('/organization/plans')
    } catch {
      toast.error('Failed to save organization plan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Organization Plan Details</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Plan Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Starter, Pro, Enterprise"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Short plan description"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price (USD/month) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">API & Usage Limits</h2>
        <p className="mb-4 text-sm text-gray-500">Use -1 for unlimited.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">API Calls/mo</label>
            <input
              type="number"
              min="-1"
              value={form.monthly_api_calls}
              onChange={e =>
                setForm(p => ({ ...p, monthly_api_calls: parseInt(e.target.value) || -1 }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">QR Creates/mo</label>
            <input
              type="number"
              min="-1"
              value={form.monthly_qr_creates}
              onChange={e =>
                setForm(p => ({ ...p, monthly_qr_creates: parseInt(e.target.value) || -1 }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Rate/min</label>
            <input
              type="number"
              min="1"
              value={form.rate_limit_per_minute}
              onChange={e =>
                setForm(p => ({ ...p, rate_limit_per_minute: parseInt(e.target.value) || 60 }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Organization Settings</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Max Members</label>
            <input
              type="number"
              min="-1"
              value={form.max_seats}
              onChange={e => setForm(p => ({ ...p, max_seats: parseInt(e.target.value) || -1 }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">-1 = unlimited</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Default User Plan
            </label>
            <select
              value={form.default_subscription_plan_id ?? ''}
              onChange={e =>
                setForm(p => ({
                  ...p,
                  default_subscription_plan_id: e.target.value ? parseInt(e.target.value) : null,
                }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm bg-white"
            >
              <option value="">None</option>
              {subPlans.map(sp => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Assigned automatically to members</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Included Tokens</label>
            <input
              type="number"
              min="0"
              value={form.included_tokens ?? 0}
              onChange={e =>
                setForm(p => ({ ...p, included_tokens: parseInt(e.target.value) || 0 }))
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Bonus credits granted on assignment</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">Features</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addFeature()
                }
              }}
              placeholder="e.g. analytics, webhooks, bulk"
              className="flex-1 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
            <button
              type="button"
              onClick={addFeature}
              className="mt-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Add
            </button>
          </div>
          {form.features.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.features.map(f => (
                <span
                  key={f}
                  className="flex items-center gap-1 rounded bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => removeFeature(f)}
                    className="ml-1 text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Active
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={form.is_popular}
              onChange={e => setForm(p => ({ ...p, is_popular: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            Mark as Popular
          </label>
        </div>

        <div className="mt-6 sm:max-w-xs">
          <label className="mb-1 block text-sm font-medium text-gray-700">Sort Order</label>
          <input
            type="number"
            min="0"
            value={form.sort_order}
            onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/plans')}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
        >
          {saving ? 'Creating…' : 'Create Organization Plan'}
        </button>
      </div>
    </div>
  )
}
