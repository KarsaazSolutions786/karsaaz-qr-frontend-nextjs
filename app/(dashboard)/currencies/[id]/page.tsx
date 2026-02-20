'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useCurrency } from '@/lib/hooks/queries/useCurrencies'
import { useUpdateCurrency } from '@/lib/hooks/mutations/useCurrencyMutations'

export default function EditCurrencyPage() {
  const { id } = useParams<{ id: string }>()
  const currencyId = Number(id)
  const { data: currency, isLoading } = useCurrency(currencyId)
  const updateMutation = useUpdateCurrency()
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: '',
    currencyCode: '',
    symbol: '',
    thousandsSeparator: ',',
    decimalSeparator: '.',
    decimalSeparatorEnabled: true,
    symbolPosition: 'before',
  })

  useEffect(() => {
    if (currency) {
      setForm({
        name: currency.name ?? '',
        currencyCode: currency.currencyCode ?? '',
        symbol: currency.symbol ?? '',
        thousandsSeparator: currency.thousandsSeparator ?? ',',
        decimalSeparator: currency.decimalSeparator ?? '.',
        decimalSeparatorEnabled: currency.decimalSeparatorEnabled ?? true,
        symbolPosition: currency.symbolPosition ?? 'before',
      })
    }
  }, [currency])

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync({ id: currencyId, data: form })
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

  if (!currency) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-red-600">Currency not found.</p>
        <Link href="/currencies" className="mt-2 text-sm text-blue-600">← Back to Currencies</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/currencies" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Currencies
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Currency</h1>
      </div>

      {updateMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to update currency.</div>
      )}
      {saved && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Currency saved successfully.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
            <input
              type="text" required value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Currency Code <span className="text-red-500">*</span></label>
            <input
              type="text" required value={form.currencyCode} maxLength={5}
              onChange={(e) => set('currencyCode', e.target.value.toUpperCase())}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Symbol <span className="text-red-500">*</span></label>
            <input
              type="text" required value={form.symbol}
              onChange={(e) => set('symbol', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thousands Separator</label>
            <input
              type="text" value={form.thousandsSeparator} maxLength={2}
              onChange={(e) => set('thousandsSeparator', e.target.value)}
              placeholder="," className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Decimal Separator</label>
            <input
              type="text" value={form.decimalSeparator} maxLength={2}
              onChange={(e) => set('decimalSeparator', e.target.value)}
              placeholder="." className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
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
                type="checkbox" checked={form.decimalSeparatorEnabled}
                onChange={(e) => set('decimalSeparatorEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Always show decimal separator
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-2">
          <Link href="/currencies" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          <button
            type="submit" disabled={updateMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving…' : 'Save Currency'}
          </button>
        </div>
      </form>
    </div>
  )
}
