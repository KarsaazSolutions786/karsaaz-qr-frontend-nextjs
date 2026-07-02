'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCurrencies } from '@/lib/hooks/queries/useCurrencies'
import { useDeleteCurrency, useToggleCurrencyEnabled } from '@/lib/hooks/mutations/useCurrencyMutations'
import type { Currency } from '@/types/entities/currency'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes CurrenciesPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function CurrenciesPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useCurrencies({ page, search: search || undefined })
  const deleteMutation = useDeleteCurrency()
  const toggleMutation = useToggleCurrencyEnabled()

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDelete = async (id: number, name: string) => {
    if (confirm(t('Are you sure you want to delete "{{name}}"?').replace('{{name}}', name))) {
      await deleteMutation.mutateAsync(id)
    }
  }

  /**
   * Purpose: Executes handleToggleEnabled functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleToggleEnabled = async (id: number) => {
    await toggleMutation.mutateAsync(id)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Currencies')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('Manage available currencies')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/currencies/new"
            className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
          >
            {t('Add Currency')}
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <input
            type="search"
            placeholder={t('Search currencies...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <LottieLoader size={80} />
            <p className="mt-2 text-sm text-gray-600">{t('Loading currencies...')}</p>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">{t('Name')}</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('Code')}</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('Symbol')}</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('Separator')}</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('Enabled')}</th>
                    <th className="relative py-3.5 pl-3 pr-4">
                      <span className="sr-only">{t('Actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((currency: Currency) => (
                    <tr key={currency.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {currency.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {currency.currencyCode}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {currency.symbol}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {currency.thousandsSeparator || '\u2014'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <button
                          onClick={() => handleToggleEnabled(currency.id)}
                          disabled={toggleMutation.isPending}
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            currency.isEnabled
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {currency.isEnabled ? t('Enabled') : t('Disabled')}
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <Link
                          href={`/currencies/${currency.id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          {t('Edit')}
                        </Link>
                        <button
                          onClick={() => handleDelete(currency.id, currency.name)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteMutation.isPending}
                        >
                          {t('Delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.pagination && data.pagination.lastPage > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('Previous')}
                </button>
                <span className="text-sm text-gray-600">
                  {t('Page')} {page} {t('of')} {data.pagination.lastPage}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.pagination.lastPage}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('Next')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('No currencies')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('Get started by adding a currency')}
            </p>
            <div className="mt-6">
              <Link
                href="/currencies/new"
                className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
              >
                {t('Add Currency')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
