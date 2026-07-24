'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Star,
  Zap,
  Globe,
  BarChart3,
  Save,
  X,
  Building2,
} from 'lucide-react'
import {
  orgPlanAPI,
  organizationAPI,
  type OrgPlan,
  type Organization,
} from '@/lib/api/endpoints/organization'
import { plansAPI } from '@/lib/api/endpoints/plans'
import type { SubscriptionPlan } from '@/types/entities/plan'

const DEFAULT_FORM: Omit<OrgPlan, 'id' | 'slug' | 'created_at' | 'is_custom'> = {
  name: '',
  description: '',
  price: 0,
  monthly_api_calls: -1,
  monthly_qr_creates: -1,
  rate_limit_per_minute: 60,
  included_tokens: 0,
  features: [],
  max_seats: -1,
  default_subscription_plan_id: null,
  is_active: true,
  is_popular: false,
  organization_id: null,
  sort_order: 0,
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
 * Purpose: Executes OrgPlansPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function OrgPlansPage() {
  const searchParams = useSearchParams()
  const orgId = Number(searchParams.get('org') ?? 0)
  const wantsCustomCreate = searchParams.get('custom') === '1' && !!orgId
  const wantsGenericCreate = searchParams.get('create') === '1' && !wantsCustomCreate

  const [plans, setPlans] = useState<OrgPlan[]>([])
  const [org, setOrg] = useState<Organization | null>(null)
  const [subPlans, setSubPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<OrgPlan | null>(null)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [featureInput, setFeatureInput] = useState('')
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    const p = orgPlanAPI
      .list(orgId ? { organization_id: orgId } : undefined)
      .then(res => setPlans(res.data.data ?? []))
    const o = orgId
      ? organizationAPI
          .get(orgId)
          .then(res => setOrg(res.data.data))
          .catch(() => null)
      : Promise.resolve()
    const sp = plansAPI.getAll({ page: 1 }).then(res => setSubPlans(res.data))
    Promise.all([p, o, sp])
      .catch(() => toast.error('Failed to load plans'))
      .finally(() => setLoading(false))
  }, [orgId])

  // ?custom=1&org=<id> opens the create form pre-locked to that organization.
  // ?create=1 (no org) opens a plain shared-catalog create form -- arrives from
  // the /plans/new audience picker when "Organizations" is chosen.
  useEffect(() => {
    if ((wantsCustomCreate || wantsGenericCreate) && !loading && !showForm) {
      setEditing(null)
      setForm(wantsCustomCreate ? { ...DEFAULT_FORM, organization_id: orgId } : DEFAULT_FORM)
      setFeatureInput('')
      setShowForm(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsCustomCreate, wantsGenericCreate, loading])

  /**
   * Purpose: Executes openCreate functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const openCreate = () => {
    setEditing(null)
    setForm(DEFAULT_FORM)
    setFeatureInput('')
    setShowForm(true)
  }

  /**
   * Purpose: Executes openEdit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const openEdit = (plan: OrgPlan) => {
    setEditing(plan)
    setForm({
      name: plan.name,
      description: plan.description ?? '',
      price: plan.price,
      monthly_api_calls: plan.monthly_api_calls,
      monthly_qr_creates: plan.monthly_qr_creates,
      rate_limit_per_minute: plan.rate_limit_per_minute,
      included_tokens: plan.included_tokens ?? 0,
      features: plan.features ?? [],
      max_seats: plan.max_seats ?? -1,
      default_subscription_plan_id: plan.default_subscription_plan_id ?? null,
      is_active: plan.is_active,
      is_popular: plan.is_popular,
      organization_id: plan.organization_id,
      sort_order: plan.sort_order,
    })
    setFeatureInput('')
    setShowForm(true)
  }

  /**
   * Purpose: Open the create form pre-locked to a specific organization -- creates a
   * private plan visible only to that org, auto-assigned to it on save.
   */
  const openCreateCustomFor = (organizationId: number) => {
    setEditing(null)
    setForm({ ...DEFAULT_FORM, organization_id: organizationId })
    setFeatureInput('')
    setShowForm(true)
  }

  /**
   * Purpose: Executes addFeature functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const addFeature = () => {
    const f = featureInput.trim()
    if (f && !form.features?.includes(f)) {
      setForm(p => ({ ...p, features: [...(p.features ?? []), f] }))
    }
    setFeatureInput('')
  }

  /**
   * Purpose: Deletes the specified resource.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const removeFeature = (f: string) =>
    setForm(p => ({ ...p, features: (p.features ?? []).filter(x => x !== f) }))

  /**
   * Purpose: Executes handleSave functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Name is required')
    setSaving(true)
    try {
      if (editing) {
        const res = await orgPlanAPI.update(editing.id, form)
        setPlans(p => p.map(x => (x.id === editing.id ? res.data.data : x)))
        toast.success('Plan updated')
      } else {
        const res = await orgPlanAPI.create(form)
        setPlans(p => [...p, res.data.data])
        toast.success(
          form.organization_id
            ? `Custom plan created and assigned to ${org?.name ?? 'organization'}`
            : 'Plan created'
        )
        if (form.organization_id && orgId === form.organization_id) {
          setOrg(prev => (prev ? ({ ...prev, org_plan_id: res.data.data.id } as any) : prev))
        }
      }
      setShowForm(false)
    } catch {
      toast.error('Failed to save plan')
    } finally {
      setSaving(false)
    }
  }

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleDelete = async (plan: OrgPlan) => {
    if (!confirm(`Delete plan "${plan.name}"? This cannot be undone.`)) return
    try {
      await orgPlanAPI.delete(plan.id)
      setPlans(p => p.filter(x => x.id !== plan.id))
      toast.success('Plan deleted')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to delete plan')
    }
  }

  /**
   * Purpose: Executes handleAssign functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleAssign = async (planId: number | null) => {
    if (!orgId) return
    setAssigning(true)
    try {
      await orgPlanAPI.assignToOrg(orgId, planId)
      setOrg(prev => (prev ? ({ ...prev, org_plan_id: planId } as any) : prev))
      toast.success(planId ? 'Plan assigned' : 'Plan removed')
    } catch {
      toast.error('Failed to assign plan')
    } finally {
      setAssigning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Org Plans</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create API plans for organizations. Assign a plan to control limits and features.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
        >
          <Plus className="h-4 w-4" /> New Plan
        </button>
      </div>

      {/* Assign to current org */}
      {org && (
        <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-800">
              Assign plan to: <span className="text-indigo-600">{org.name}</span>
            </span>
            {(org as any).org_plan_id && (
              <span className="text-xs text-gray-500">
                Current plan ID: {(org as any).org_plan_id}
              </span>
            )}
            <button
              onClick={() => openCreateCustomFor(orgId)}
              className="ml-auto flex items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="h-3 w-3" /> Create Custom Plan for {org.name}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {plans
              .filter(p => p.is_active)
              .map(plan => (
                <button
                  key={plan.id}
                  onClick={() => handleAssign(plan.id)}
                  disabled={assigning || (org as any).org_plan_id === plan.id}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    (org as any).org_plan_id === plan.id
                      ? 'bg-primary-600 text-white cursor-default'
                      : 'border bg-white text-gray-700 hover:bg-primary-100'
                  }`}
                >
                  {(org as any).org_plan_id === plan.id && (
                    <CheckCircle2 className="inline h-3 w-3 mr-1" />
                  )}
                  {plan.name}
                </button>
              ))}
            {(org as any).org_plan_id && (
              <button
                onClick={() => handleAssign(null)}
                disabled={assigning}
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Remove plan
              </button>
            )}
          </div>
        </div>
      )}

      {/* Plan list */}
      {plans.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <Zap className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="font-medium text-gray-600">No plans yet</p>
          <p className="mt-1 text-sm text-gray-400">Create your first org plan to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-xl border bg-white p-5 shadow-sm ${
                plan.is_popular ? 'ring-2 ring-indigo-400' : ''
              } ${!plan.is_active ? 'opacity-60' : ''}`}
            >
              {plan.is_popular && (
                <span className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  <Star className="h-3 w-3" /> Popular
                </span>
              )}
              {!plan.is_active && (
                <span className="absolute -top-2.5 right-4 rounded-full bg-gray-400 px-2.5 py-0.5 text-xs font-semibold text-white">
                  Inactive
                </span>
              )}

              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{plan.name}</h3>
                  {plan.is_custom && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                      Custom
                    </span>
                  )}
                </div>
                {plan.is_custom && (
                  <p className="mt-0.5 text-xs text-amber-600">
                    Private -- exclusive to org #{plan.organization_id}
                  </p>
                )}
                {plan.description && (
                  <p className="mt-0.5 text-xs text-gray-400">{plan.description}</p>
                )}
              </div>

              <div className="mb-4 text-2xl font-extrabold text-indigo-600">
                ${plan.price}
                <span className="text-sm font-normal text-gray-400">/mo</span>
              </div>

              <ul className="mb-4 space-y-1.5 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  API calls:{' '}
                  <span className="font-semibold ml-auto">
                    {formatLimit(plan.monthly_api_calls)}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  QR creates:{' '}
                  <span className="font-semibold ml-auto">
                    {formatLimit(plan.monthly_qr_creates)}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  Rate limit:{' '}
                  <span className="font-semibold ml-auto">{plan.rate_limit_per_minute}/min</span>
                </li>
              </ul>

              {plan.features && plan.features.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1">
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

              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => openEdit(plan)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="flex items-center justify-center gap-1 rounded-lg border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl my-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {form.organization_id
                  ? `Custom Plan for ${org?.id === form.organization_id ? org.name : `Org #${form.organization_id}`}`
                  : editing
                    ? 'Edit Plan'
                    : 'Create Plan'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {form.organization_id && !editing && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                This plan is private and will be auto-assigned to this organization on save -- it
                will not appear in the shared catalog for other organizations.
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Starter, Pro, Enterprise"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Short plan description"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Price (USD/month) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Limits row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    API Calls/mo
                  </label>
                  <input
                    type="number"
                    min="-1"
                    value={form.monthly_api_calls}
                    onChange={e =>
                      setForm(p => ({ ...p, monthly_api_calls: parseInt(e.target.value) || -1 }))
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <p className="mt-0.5 text-xs text-gray-400">-1 = unlimited</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    QR Creates/mo
                  </label>
                  <input
                    type="number"
                    min="-1"
                    value={form.monthly_qr_creates}
                    onChange={e =>
                      setForm(p => ({ ...p, monthly_qr_creates: parseInt(e.target.value) || -1 }))
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <p className="mt-0.5 text-xs text-gray-400">-1 = unlimited</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Rate/min</label>
                  <input
                    type="number"
                    min="1"
                    value={form.rate_limit_per_minute}
                    onChange={e =>
                      setForm(p => ({
                        ...p,
                        rate_limit_per_minute: parseInt(e.target.value) || 60,
                      }))
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Members & Default Plan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
                    Max Members
                  </label>
                  <input
                    type="number"
                    min="-1"
                    value={form.max_seats}
                    onChange={e =>
                      setForm(p => ({ ...p, max_seats: parseInt(e.target.value) || -1 }))
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <p className="mt-0.5 text-xs text-gray-400">-1 = unlimited</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">
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
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                  >
                    <option value="">None</option>
                    {subPlans.map(sp => (
                      <option key={sp.id} value={sp.id}>
                        {sp.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-0.5 text-xs text-gray-400">Assigned automatically</p>
                </div>
              </div>

              {/* Included tokens */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Included Tokens (bonus credits granted on assignment)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.included_tokens ?? 0}
                  onChange={e =>
                    setForm(p => ({ ...p, included_tokens: parseInt(e.target.value) || 0 }))
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Features */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Features</label>
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
                    className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
                {(form.features ?? []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {form.features!.map(f => (
                      <span
                        key={f}
                        className="flex items-center gap-1 rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700"
                      >
                        {f}
                        <button
                          onClick={() => removeFeature(f)}
                          className="ml-0.5 text-indigo-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_popular}
                    onChange={e => setForm(p => ({ ...p, is_popular: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">Mark as Popular</span>
                </label>
              </div>

              {/* Sort order */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Sort Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={e =>
                    setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))
                  }
                  className="w-28 rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] py-2.5 text-sm font-semibold text-white hover:brightness-105 transition-all disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving
                  ? 'Saving…'
                  : editing
                    ? 'Save Changes'
                    : form.organization_id
                      ? 'Create & Assign Custom Plan'
                      : 'Create Plan'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
