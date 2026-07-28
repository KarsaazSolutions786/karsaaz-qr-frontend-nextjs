'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from '@/lib/hooks/queries/useTranslations'
import {
  useDeleteTranslation,
  useSetMainTranslation,
  useToggleTranslationActive,
  useAutoTranslate,
} from '@/lib/hooks/mutations/useTranslationMutations'
import { translationsAPI } from '@/lib/api/endpoints/translations'
import type { Translation } from '@/types/entities/translation'
import { useTranslation as useI18n } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { useConfirmation } from '@/components/ui/confirmation-modal'

/**
 * Purpose: Executes TranslationsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function TranslationsPage() {
  const { confirm } = useConfirmation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [canAutoTranslate, setCanAutoTranslate] = useState<boolean | null>(null)

  const { data, isLoading } = useTranslations({ page, search: search || undefined })
  const deleteMutation = useDeleteTranslation()
  const setMainMutation = useSetMainTranslation()
  const toggleActiveMutation = useToggleTranslationActive()
  const autoTranslateMutation = useAutoTranslate()
  const { t } = useI18n()

  useEffect(() => {
    translationsAPI
      .canAutoTranslate()
      .then(res => setCanAutoTranslate(res.available ?? false))
      .catch(() => setCanAutoTranslate(false))
  }, [])

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDelete = async (id: number, name: string) => {
    if (
      await confirm({
        title: 'Are you sure?',
        message: t('Are you sure you want to delete') + ` "${name}"?`,
        type: 'danger',
      })
    ) {
      await deleteMutation.mutateAsync(id)
    }
  }

  /**
   * Purpose: Executes handleAutoTranslate functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleAutoTranslate = async (id: number) => {
    if (!canAutoTranslate) {
      if (
        await confirm({
          title: 'Are you sure?',
          message: t(
            'Google Translate API key is not configured. Go to System Settings to configure it?'
          ),
          type: 'danger',
        })
      ) {
        router.push('/system/settings?tab-id=advanced')
      }
      return
    }
    if (
      !(await confirm({
        title: 'Are you sure?',
        message: t('Start auto-translation? This may take a few minutes.'),
        type: 'danger',
      }))
    )
      return
    autoTranslateMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t('Auto-translation started. This may take a few minutes to complete.'))
      },
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Translations')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('Manage language translations and localization')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/translations/new"
            className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
          >
            {t('Add Language')}
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <input
            type="search"
            placeholder={t('Search translations…')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LottieLoader size={80} />
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-8 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      {t('ID')}
                    </th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      {t('Name')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Locale')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Active')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Main Language')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Completeness')}
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 w-72">
                      <span className="sr-only">{t('Actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((translation: Translation) => (
                    <tr key={translation.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                        {translation.id}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {translation.displayName || translation.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-indigo-100 px-2 text-xs font-semibold leading-5 text-indigo-800">
                          {translation.locale}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => toggleActiveMutation.mutate(translation.id)}
                          disabled={toggleActiveMutation.isPending || translation.isMain}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${translation.isActive ? 'bg-primary-600' : 'bg-gray-200'}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${translation.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                          />
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {translation.isMain ? (
                          <span className="inline-flex rounded-full bg-primary-100 px-2 text-xs font-semibold leading-5 text-primary-800">
                            {t('YES')}
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-600">
                            {t('NO')}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-primary-600 transition-all"
                              style={{ width: `${translation.completeness}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{translation.completeness}%</span>
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3 flex-wrap">
                          <Link
                            href={`/translations/${translation.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {t('Edit')}
                          </Link>
                          <button
                            onClick={() => handleAutoTranslate(translation.id)}
                            disabled={autoTranslateMutation.isPending}
                            className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                          >
                            {t('Auto Translate')}
                          </button>
                          {!translation.isMain && (
                            <button
                              onClick={() => setMainMutation.mutate(translation.id)}
                              disabled={setMainMutation.isPending}
                              className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                            >
                              {t('Set Main')}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(translation.id, translation.name)}
                            className="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={deleteMutation.isPending || translation.isMain}
                          >
                            {t('Delete')}
                          </button>
                        </div>
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
            <h3 className="text-sm font-medium text-gray-900">{t('No translations')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('Get started by adding a language')}</p>
            <div className="mt-6">
              <Link
                href="/translations/new"
                className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
              >
                {t('Add Language')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
