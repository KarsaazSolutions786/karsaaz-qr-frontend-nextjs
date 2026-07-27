'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCustomCodes } from '@/lib/hooks/queries/useCustomCodes'
import { useDeleteCustomCode } from '@/lib/hooks/mutations/useCustomCodeMutations'
import type { CustomCode } from '@/types/entities/custom-code'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { useConfirmation } from '@/components/ui/confirmation-modal'

/**
 * Purpose: Executes CustomCodesPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function CustomCodesPage() {
  const { confirm } = useConfirmation()
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useCustomCodes({ page, search: search || undefined })
  const deleteMutation = useDeleteCustomCode()

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDelete = async (id: number, name: string) => {
    if (
      await confirm({
        title: 'Are you sure?',
        message: t('Are you sure you want to delete "{{name}}"?').replace('{{name}}', name),
        type: 'danger',
      })
    ) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Custom Code')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('Inject custom scripts, styles, or markup into your application')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/custom-codes/new"
            className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
          >
            {t('Create Custom Code')}
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <input
            type="search"
            placeholder={t('Search custom codes…')}
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <LottieLoader size={80} />
            <p className="mt-2 text-sm text-gray-600">{t('Loading…')}</p>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-8 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      ID
                    </th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      {t('Name')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Language')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Position')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Sort order')}
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 w-28">
                      <span className="sr-only">{t('Actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((code: CustomCode) => (
                    <tr key={code.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                        {code.id}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {code.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 capitalize">
                          {code.language}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {code.position}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {code.sortOrder}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <Link
                          href={`/custom-codes/${code.id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          {t('Edit')}
                        </Link>
                        <button
                          onClick={() => handleDelete(code.id, code.name)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('Previous')}
                </button>
                <span className="text-sm text-gray-600">
                  {t('Page')} {page} {t('of')} {data.pagination.lastPage}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
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
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('No custom codes')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('Get started by injecting a custom script, style, or HTML snippet.')}
            </p>
            <div className="mt-6">
              <Link
                href="/custom-codes/new"
                className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
              >
                {t('Create Custom Code')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
