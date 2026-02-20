'use client'

import { useEffect, useState } from 'react'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'

const BILLING_KEYS = ['billing_collection_enabled', 'billing_private_form', 'billing_company_form']

export default function BillingPage() {
  const { data: configs, isLoading } = useSystemConfigs(BILLING_KEYS)
  const saveMutation = useSaveSystemConfigs(BILLING_KEYS)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    billing_collection_enabled: 'disabled',
    billing_private_form: '',
    billing_company_form: '',
  })

  useEffect(() => {
    if (configs) {
      setForm({
        billing_collection_enabled: configs['billing_collection_enabled'] || 'disabled',
        billing_private_form: configs['billing_private_form'] || '',
        billing_company_form: configs['billing_company_form'] || '',
      })
    }
  }, [configs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveMutation.mutateAsync([
      { key: 'billing_collection_enabled', value: form.billing_collection_enabled },
      { key: 'billing_private_form', value: form.billing_private_form },
      { key: 'billing_company_form', value: form.billing_company_form },
    ])
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure billing data collection during checkout.
        </p>
      </div>

      {saveMutation.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to save settings. Please try again.
        </div>
      )}
      {saved && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
          Settings saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Billing Collection Toggle */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Billing Collection</h2>
          <p className="mb-4 text-sm text-gray-500">
            When enabled, customers will be prompted to fill in billing details during checkout.
          </p>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50">
              <input
                type="radio"
                name="billing_collection_enabled"
                value="enabled"
                checked={form.billing_collection_enabled === 'enabled'}
                onChange={(e) => setForm((f) => ({ ...f, billing_collection_enabled: e.target.value }))}
                className="text-blue-600"
              />
              Enabled
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50">
              <input
                type="radio"
                name="billing_collection_enabled"
                value="disabled"
                checked={form.billing_collection_enabled === 'disabled'}
                onChange={(e) => setForm((f) => ({ ...f, billing_collection_enabled: e.target.value }))}
                className="text-blue-600"
              />
              Disabled
            </label>
          </div>
        </section>

        {/* Private Customer Form Builder */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Private Customer Details Form</h2>
          <p className="mb-4 text-sm text-gray-500">
            Define the fields to collect from private (individual) customers during checkout.
            Enter field definitions as JSON or a form schema.
          </p>
          <textarea
            rows={8}
            value={form.billing_private_form}
            onChange={(e) => setForm((f) => ({ ...f, billing_private_form: e.target.value }))}
            placeholder={'[\n  { "name": "full_name", "label": "Full Name", "type": "text", "required": true },\n  { "name": "address", "label": "Address", "type": "textarea", "required": false }\n]'}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </section>

        {/* Company Details Form Builder */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">Company Details Form</h2>
          <p className="mb-4 text-sm text-gray-500">
            Define the fields to collect from company customers during checkout.
          </p>
          <textarea
            rows={8}
            value={form.billing_company_form}
            onChange={(e) => setForm((f) => ({ ...f, billing_company_form: e.target.value }))}
            placeholder={'[\n  { "name": "company_name", "label": "Company Name", "type": "text", "required": true },\n  { "name": "vat_number", "label": "VAT Number", "type": "text", "required": false }\n]'}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </section>

        <div className="flex items-center justify-end gap-4">
          <div className="flex-1 text-sm text-gray-500">
            Related:{' '}
            <a href="/transactions" className="text-blue-600 hover:underline">Transactions</a>
            {' · '}
            <a href="/plans" className="text-blue-600 hover:underline">Plans</a>
            {' · '}
            <a href="/currencies" className="text-blue-600 hover:underline">Currencies</a>
          </div>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {saveMutation.isPending ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
