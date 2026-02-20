'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCreateCurrency } from '@/lib/hooks/mutations/useCurrencyMutations'

export default function NewCurrencyPage() {
  const createMutation = useCreateCurrency()

  const [form, setForm] = useState({
    name: '',
    currencyCode: '',
    symbol: '',
    thousandsSeparator: ',',
    decimalSeparator: '.',
    decimalSeparatorEnabled: true,
    symbolPosition: 'before',
  })

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync({
      name: form.name,
      currencyCode: form.currencyCode,
      symbol: form.symbol,
      thousandsSeparator: form.thousandsSeparator,
      decimalSeparator: form.decimalSeparator,
      decimalSeparatorEnabled: form.decimalSeparatorEnabled,
      symbolPosition: form.symbolPosition,
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/currencies" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Currencies
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Currency</h1>
      </div>

      {createMutation.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          Failed to create currency. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
              placeholder="e.g. US Dollar"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Currency Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.currencyCode}
              onChange={(e) => set('currencyCode', e.target.value.toUpperCase())}
              placeholder="e.g. USD"
              maxLength={5}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Symbol <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.symbol}
              onChange={(e) => set('symbol', e.target.value)}
              placeholder="e.g. $"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thousands Separator</label>
            <input
              type="text"
              value={form.thousandsSeparator}
              onChange={(e) => set('thousandsSeparator', e.target.value)}
              placeholder=","
              maxLength={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Decimal Separator</label>
            <input
              type="text"
              value={form.decimalSeparator}
              onChange={(e) => set('decimalSeparator', e.target.value)}
              placeholder="."
              maxLength={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Symbol Position</label>
            <select
              value={form.symbolPosition}
              onChange={(e) => set('symbolPosition', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            >
              <option value="before">Before Number</option>
              <option value="after">After Number</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.decimalSeparatorEnabled}
                onChange={(e) => set('decimalSeparatorEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Always show decimal separator (even for whole numbers)
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            href="/currencies"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating…' : 'Add Currency'}
          </button>
        </div>
      </form>
    </div>
  )
}
