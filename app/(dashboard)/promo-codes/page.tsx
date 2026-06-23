'use client'

import { useState } from 'react'
import Link from 'next/link'
import { promoCodesAPI, type PromoCode } from '@/lib/api/endpoints/promo-codes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { PageQueryError } from '@/components/common/PageQueryError'

/**
 * Purpose: Executes StatusBadge functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function StatusBadge({ active }: { active: boolean }) {
  const { t } = useTranslation()
  return (
    <span
      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
        active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {active ? t('Active') : t('Inactive')}
    </span>
  )
}

/**
 * Purpose: Executes PromoCodesPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function PromoCodesPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['promo-codes', page, search],
    queryFn: () => promoCodesAPI.list({ page, search: search || undefined }),
  })

  const deleteMutation = useMutation({
    mutationFn: promoCodesAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promo-codes'] }),
  })

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageQueryError
          error={error}
          title={t('Failed to load promo codes')}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const handleDelete = async (id: number, code: string) => {
    if (
      !confirm(t('Delete promo code "{{code}}"? This cannot be undone.').replace('{{code}}', code))
    )
      return
    await deleteMutation.mutateAsync(id)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Promo Codes')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('Manage discount codes for subscriptions')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/promo-codes/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            {t('+ Create Promo Code')}
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mt-8 mb-6">
        <input
          type="search"
          placeholder={t('Search by code...')}
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:max-w-md sm:text-sm"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LottieLoader size={80} />
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    {t('Code')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('Discount')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('Usage')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('Expiry')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('Status')}
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">{t('Actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.data.map((promo: PromoCode) => (
                  <tr key={promo.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {promo.code}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                      {promo.discount_percentage}%
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {promo.times_used} / {promo.usage_limit ?? '\u221E'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {promo.expires_at
                        ? new Date(promo.expires_at).toLocaleDateString()
                        : t('No expiry')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <StatusBadge active={promo.is_active} />
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium space-x-3">
                      <Link
                        href={`/promo-codes/${promo.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {t('Edit')}
                      </Link>
                      <button
                        onClick={() => handleDelete(promo.id, promo.code)}
                        className="text-red-600 hover:text-red-900"
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
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {t('Previous')}
              </button>
              <span className="text-sm text-gray-600">
                {t('Page')} {page} {t('of')} {data.pagination.lastPage}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.pagination.lastPage}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {t('Next')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">{t('No promo codes')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('Get started by creating a promo code.')}</p>
          <Link
            href="/promo-codes/new"
            className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {t('+ Create Promo Code')}
          </Link>
        </div>
      )}
    </div>
  )
}
