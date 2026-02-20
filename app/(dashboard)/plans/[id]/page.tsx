'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { usePlan } from '@/lib/hooks/queries/usePlans'
import { useUpdatePlan } from '@/lib/hooks/mutations/usePlanMutations'

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'life-time', label: 'Life Time' },
]

export default function EditPlanPage() {
  const { id } = useParams<{ id: string }>()
  const planId = Number(id)
  const { data: plan, isLoading } = usePlan(planId)
  const updateMutation = useUpdatePlan()
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: '',
    price: 0,
    frequency: 'monthly',
    sortOrder: 0,
    isHidden: false,
    isTrial: false,
    trialDays: 7,
    numberOfDynamicQrcodes: -1,
    numberOfScans: -1,
    numberOfCustomDomains: -1,
    fileSizeLimit: -1,
    showAds: false,
    adsTimeout: 5,
    adsCode: '',
  })

  // Population on load
  useEffect(() => {
    if (plan) {
      setForm({
        name: plan.name ?? '',
        price: plan.price ?? 0,
        frequency: plan.frequency ?? 'monthly',
        sortOrder: plan.sortOrder ?? 0,
        isHidden: plan.isHidden ?? false,
        isTrial: plan.isTrial ?? false,
        trialDays: plan.trialDays ?? 7,
        numberOfDynamicQrcodes: plan.numberOfDynamicQrcodes ?? -1,
        numberOfScans: plan.numberOfScans ?? -1,
        numberOfCustomDomains: plan.numberOfCustomDomains ?? -1,
        fileSizeLimit: plan.fileSizeLimit ?? -1,
        showAds: plan.showAds ?? false,
        adsTimeout: plan.adsTimeout ?? 5,
        adsCode: '',
      })
    }
  }, [plan])

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync({
      id: planId,
      data: {
        name: form.name,
        price: Number(form.price),
        frequency: form.frequency as 'monthly' | 'yearly' | 'life-time',
        sortOrder: Number(form.sortOrder),
        isHidden: form.isHidden,
        isTrial: form.isTrial,
        trialDays: form.isTrial ? Number(form.trialDays) : undefined,
        numberOfDynamicQrcodes: Number(form.numberOfDynamicQrcodes),
        numberOfScans: Number(form.numberOfScans),
        numberOfCustomDomains: Number(form.numberOfCustomDomains),
        fileSizeLimit: Number(form.fileSizeLimit),
        showAds: form.showAds,
      },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-red-600">Plan not found.</p>
        <Link href="/plans" className="mt-2 text-sm text-blue-600 hover:text-blue-800">
          ← Back to Plans
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/plans" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Plans
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Plan</h1>
      </div>

      {/* Checkout Link */}
      <div className="mb-6 rounded-md bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Direct Checkout URL: </span>
          <a
            href={`/checkout?plan-id=${planId}`}
            className="underline hover:text-blue-600"
            target="_blank"
            rel="noreferrer"
          >
            /checkout?plan-id={planId}
          </a>
        </p>
      </div>

      {updateMutation.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to update plan. Please try again.
        </div>
      )}
      {saved && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
          Plan saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => set('frequency', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price <span className="text-gray-400 text-xs">(0 = free)</span>
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => set('sortOrder', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            </div>

            <div className="flex items-start gap-6 sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isHidden}
                  onChange={(e) => set('isHidden', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                Hidden
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isTrial}
                  onChange={(e) => set('isTrial', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                Is Trial Plan
              </label>
            </div>

            {form.isTrial && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Trial Days</label>
                <input
                  type="number"
                  min={1}
                  value={form.trialDays}
                  onChange={(e) => set('trialDays', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
                />
              </div>
            )}
          </div>
        </section>

        {/* Plan Configuration */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Plan Configuration</h2>
          <p className="mb-4 text-sm text-gray-500">Use -1 for unlimited.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Dynamic QR Codes</label>
              <input
                type="number"
                min={-1}
                value={form.numberOfDynamicQrcodes}
                onChange={(e) => set('numberOfDynamicQrcodes', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Scans</label>
              <input
                type="number"
                min={-1}
                value={form.numberOfScans}
                onChange={(e) => set('numberOfScans', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Custom Domains</label>
              <input
                type="number"
                min={-1}
                value={form.numberOfCustomDomains}
                onChange={(e) => set('numberOfCustomDomains', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">File Size Limit (MB)</label>
              <input
                type="number"
                min={-1}
                value={form.fileSizeLimit}
                onChange={(e) => set('fileSizeLimit', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            </div>
          </div>
        </section>

        {/* Ads Settings */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Ads Settings</h2>
          <div className="space-y-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.showAds}
                onChange={(e) => set('showAds', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Show Ads
            </label>

            {form.showAds && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ads Timeout (seconds)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.adsTimeout}
                    onChange={(e) => set('adsTimeout', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm sm:max-w-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ads Code (HTML)</label>
                  <textarea
                    rows={4}
                    value={form.adsCode}
                    onChange={(e) => set('adsCode', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs shadow-sm focus:border-blue-500 focus:outline-none"
                    placeholder="<script>...</script>"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/plans"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving…' : 'Save Plan'}
          </button>
        </div>
      </form>
    </div>
  )
}
