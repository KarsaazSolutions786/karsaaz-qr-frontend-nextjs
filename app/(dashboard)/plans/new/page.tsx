'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCreatePlan } from '@/lib/hooks/mutations/usePlanMutations'
import { PlanFeaturesEditor } from '@/components/features/plans/PlanFeaturesEditor'
import { PlanCheckpoints, type Checkpoint } from '@/components/features/plans/PlanCheckpoints'
import { QrTypeLimitsEditor, type QrTypeLimit } from '@/components/features/plans/QrTypeLimitsEditor'

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'life-time', label: 'Life Time' },
]

export default function NewPlanPage() {
  const createMutation = useCreatePlan()

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
    features: [] as string[],
    checkpoints: [] as Checkpoint[],
    qrTypeLimits: [] as QrTypeLimit[],
  })

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync({
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
      features: form.features,
      checkpoints: form.checkpoints,
      qrTypeLimits: form.qrTypeLimits,
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/plans" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Plans
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Plan</h1>
      </div>

      {createMutation.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to create plan. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 2: Basic Details */}
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="e.g. Pro Monthly"
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
                Price <span className="text-gray-400 text-xs">(Type 0 for free)</span>
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
                Hidden (not shown publicly)
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

        {/* Section 3: Plan Configuration */}
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

        {/* Section 3.5: Plan Features */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Plan Features</h2>
          <p className="mb-4 text-sm text-gray-500">
            Features displayed on the pricing page for this plan.
          </p>
          <PlanFeaturesEditor
            features={form.features}
            onChange={(features) => set('features', features)}
          />
        </section>

        {/* Section 3.6: Plan Checkpoints */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Plan Checkpoints</h2>
          <p className="mb-4 text-sm text-gray-500">
            Displayed on the pricing page as plan milestones.
          </p>
          <PlanCheckpoints
            checkpoints={form.checkpoints}
            onChange={(checkpoints) => set('checkpoints', checkpoints)}
          />
        </section>

        {/* Section 3.7: QR Type Limits */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">QR Type Limits</h2>
          <QrTypeLimitsEditor
            limits={form.qrTypeLimits}
            onChange={(qrTypeLimits) => set('qrTypeLimits', qrTypeLimits)}
          />
        </section>

        {/* Section 4: Ads Settings */}
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
                  <label className="block text-sm font-medium text-gray-700">
                    Ads Timeout (seconds before QR code)
                  </label>
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
            disabled={createMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating…' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  )
}
