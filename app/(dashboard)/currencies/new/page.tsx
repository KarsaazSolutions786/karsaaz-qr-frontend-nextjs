'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCreateCurrency } from '@/lib/hooks/mutations/useCurrencyMutations'
import { BalloonSelector } from '@/components/ui/balloon-selector'
import { useTranslation } from '@/lib/i18n'

const SYMBOL_POSITION_OPTIONS = [
  { value: 'before', label: 'Before Number' },
  { value: 'after', label: 'After Number' },
]

const DECIMAL_SEPARATOR_OPTIONS = [
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
]

const inputClass =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm'

export default function NewCurrencyPage() {
  const { t } = useTranslation()
  const createMutation = useCreateCurrency()

  const [form, setForm] = useState({
    name: '',
    currencyCode: '',
    symbol: '',
    thousandsSeparator: ',',
    decimalSeparator: '.',
    decimalSeparatorEnabled: 'enabled',
    symbolPosition: 'before',
  })

  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        name: form.name,
        currencyCode: form.currencyCode,
        symbol: form.symbol,
        thousandsSeparator: form.thousandsSeparator,
        decimalSeparator: form.decimalSeparator,
        decimalSeparatorEnabled: form.decimalSeparatorEnabled === 'enabled',
        symbolPosition: form.symbolPosition,
      })
    } catch {
      // Error shown by mutation state
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/currencies" className="text-sm text-blue-600 hover:text-blue-800">
          {t('← Back to Currencies')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{t('Add Currency')}</h1>
      </div>

      {createMutation.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {t('Failed to create currency. Please try again.')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Currency Details')}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('Name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder={t('Currency name')}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Currency Code')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.currencyCode}
                maxLength={5}
                onChange={e => set('currencyCode', e.target.value.toUpperCase())}
                placeholder={t('Currency code')}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Symbol')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.symbol}
                onChange={e => set('symbol', e.target.value)}
                placeholder={t('Symbol')}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Thousands Separator')}
              </label>
              <input
                type="text"
                value={form.thousandsSeparator}
                maxLength={2}
                onChange={e => set('thousandsSeparator', e.target.value)}
                placeholder=","
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Decimal Separator')}
              </label>
              <input
                type="text"
                value={form.decimalSeparator}
                maxLength={2}
                onChange={e => set('decimalSeparator', e.target.value)}
                placeholder="."
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Decimal Separator Enabled */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">{t('Decimal Separator')}</h2>
          <p className="mb-4 text-sm text-gray-500">
            {t(
              'Always add decimal separator even if the number after decimal point is zero, e.g. 10.00'
            )}
          </p>
          <BalloonSelector
            options={DECIMAL_SEPARATOR_OPTIONS}
            value={form.decimalSeparatorEnabled}
            onChange={v => set('decimalSeparatorEnabled', v)}
          />
        </section>

        {/* Symbol Position */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Symbol Position')}</h2>
          <BalloonSelector
            options={SYMBOL_POSITION_OPTIONS}
            value={form.symbolPosition}
            onChange={v => set('symbolPosition', v)}
          />
        </section>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/currencies"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('Cancel')}
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createMutation.isPending ? t('Creating...') : t('Add Currency')}
          </button>
        </div>
      </form>
    </div>
  )
}
