'use client'

import { useState, Suspense } from 'react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useContentBlocks } from '@/lib/hooks/queries/useContentBlocks'
import { useTranslations } from '@/lib/hooks/queries/useTranslations'
import { useTranslation } from '@/lib/i18n'
import {
  useDeleteContentBlock,
  useDeleteContentBlocksByTranslation,
  useCopyContentBlocks,
} from '@/lib/hooks/mutations/useContentBlockMutations'
import type { ContentBlock } from '@/types/entities/content-block'
import type { Translation } from '@/types/entities/translation'
import { LottieLoader } from '@/components/ui/lottie-loader'

// ─── Copy Modal ───────────────────────────────────────────────────────────────

/**
 * Purpose: Executes CopyModal functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function CopyModal({
  translations,
  onClose,
  onCopy,
  isPending,
}: {
  translations: Translation[]
  onClose: () => void
  onCopy: (sourceId: number, destinationId: number) => void
  isPending: boolean
}) {
  const { t } = useTranslation()
  const [sourceId, setSourceId] = useState('')
  const [destId, setDestId] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Copy Content Blocks')}</h2>
        <p className="mb-4 text-sm text-gray-600">{t('Copy all content blocks from one language to another.')}</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Source Language')}</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">{t('Select source...')}</option>
              {translations.map((tr) => (
                <option key={tr.id} value={tr.id}>{tr.displayName || tr.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Destination Language')}</label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">{t('Select destination...')}</option>
              {translations.map((tr) => (
                <option key={tr.id} value={tr.id}>{tr.displayName || tr.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('Cancel')}
          </button>
          <button
            onClick={() => sourceId && destId && onCopy(Number(sourceId), Number(destId))}
            disabled={!sourceId || !destId || isPending}
            className="rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50 transition-all"
          >
            {isPending ? t('Copying...') : t('Copy')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Inner page (needs useSearchParams) ──────────────────────────────────────

/**
 * Purpose: Executes ContentBlocksPageInner functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function ContentBlocksPageInner() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showCopyModal, setShowCopyModal] = useState(false)

  const translationIdParam = searchParams.get('translation_id')
  const translationId = translationIdParam ? Number(translationIdParam) : undefined

  const { data, isLoading } = useContentBlocks({ page, search: search || undefined, translationId })
  const { data: translationsData } = useTranslations({ page: 1 })

  const deleteMutation = useDeleteContentBlock()
  const deleteAllMutation = useDeleteContentBlocksByTranslation()
  const copyMutation = useCopyContentBlocks()

  const allTranslations = translationsData?.data ?? []

  /**
   * Purpose: Sets translationfilter.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const setTranslationFilter = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) params.set('translation_id', id)
    else params.delete('translation_id')
    router.push(`?${params.toString()}`, { scroll: false })
    setPage(1)
  }

  /**
   * Purpose: Executes handleDeleteAll functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDeleteAll = async () => {
    if (!translationId) {
      toast.warning(t('Please select a language first to delete blocks from.'))
      return
    }
    const langName = allTranslations.find((tr) => tr.id === translationId)?.name ?? `ID ${translationId}`
    if (!confirm(t('Delete ALL content blocks for language "{{name}}"? This cannot be undone.').replace('{{name}}', langName))) return
    await deleteAllMutation.mutateAsync(translationId)
  }

  /**
   * Purpose: Executes handleCopy functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleCopy = async (sourceId: number, destinationId: number) => {
    await copyMutation.mutateAsync({ sourceId, destinationId })
    setShowCopyModal(false)
  }

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDelete = async (id: number, title: string) => {
    if (confirm(t('Delete "{{title}}"?').replace('{{title}}', title))) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {showCopyModal && (
        <CopyModal
          translations={allTranslations}
          onClose={() => setShowCopyModal(false)}
          onCopy={handleCopy}
          isPending={copyMutation.isPending}
        />
      )}

      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Content Blocks')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('Manage reusable content blocks')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/content-blocks/new"
            className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
          >
            {t('Create Block')}
          </Link>
        </div>
      </div>

      {/* Filter row */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          value={translationId ?? ''}
          onChange={(e) => setTranslationFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">{t('All Languages')}</option>
          {allTranslations.map((tr) => (
            <option key={tr.id} value={tr.id}>{tr.displayName || tr.name}</option>
          ))}
        </select>
        <button
          onClick={handleDeleteAll}
          disabled={deleteAllMutation.isPending || !translationId}
          className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('Delete All')}
        </button>
        <button
          onClick={() => setShowCopyModal(true)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {t('Copy All')}
        </button>
        <input
          type="search"
          placeholder={t('Search by title or position...')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="block rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:w-72"
        />
      </div>

      <div className="mt-6">
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
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">{t('Title')}</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('Position')}</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('Language')}</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('Sort Order')}</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">{t('Created')}</th>
                    <th className="relative py-3.5 pl-3 pr-4"><span className="sr-only">{t('Actions')}</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((block: ContentBlock) => (
                    <tr key={block.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{block.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-primary-100 px-2 text-xs font-semibold leading-5 text-primary-800">{block.position}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {block.translation?.name ?? t('English (default)')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{block.sortOrder}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {(block.createdAt || block.created_at)
                          ? new Date(block.createdAt || block.created_at!).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <Link href={`/content-blocks/${block.id}`} className="text-primary-600 hover:text-primary-900 mr-4">{t('Edit')}</Link>
                        <button
                          onClick={() => handleDelete(block.id, block.title)}
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
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">{t('Previous')}</button>
                <span className="text-sm text-gray-600">{t('Page')} {page} {t('of')} {data.pagination.lastPage}</span>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= data.pagination.lastPage}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">{t('Next')}</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-gray-900">{t('No content blocks')}</h3>
            <p className="mt-1 text-sm text-gray-500">{t('Get started by creating a content block')}</p>
            <div className="mt-6">
              <Link href="/content-blocks/new" className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all">{t('Create Block')}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Purpose: Executes ContentBlocksPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function ContentBlocksPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-96 items-center justify-center">
        <LottieLoader size={80} />
      </div>
    }>
      <ContentBlocksPageInner />
    </Suspense>
  )
}
