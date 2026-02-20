'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useContentBlocks } from '@/lib/hooks/queries/useContentBlocks'
import { useTranslations } from '@/lib/hooks/queries/useTranslations'
import {
  useDeleteContentBlock,
  useDeleteContentBlocksByTranslation,
  useCopyContentBlocks,
} from '@/lib/hooks/mutations/useContentBlockMutations'
import type { ContentBlock } from '@/types/entities/content-block'
import type { Translation } from '@/types/entities/translation'

// ─── Copy Modal ───────────────────────────────────────────────────────────────

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
  const [sourceId, setSourceId] = useState('')
  const [destId, setDestId] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Copy Content Blocks</h2>
        <p className="mb-4 text-sm text-gray-600">Copy all content blocks from one language to another.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Source Language</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            >
              <option value="">Select source…</option>
              {translations.map((t) => (
                <option key={t.id} value={t.id}>{t.displayName || t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Destination Language</label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
            >
              <option value="">Select destination…</option>
              {translations.map((t) => (
                <option key={t.id} value={t.id}>{t.displayName || t.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => sourceId && destId && onCopy(Number(sourceId), Number(destId))}
            disabled={!sourceId || !destId || isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Copying…' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Inner page (needs useSearchParams) ──────────────────────────────────────

function ContentBlocksPageInner() {
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

  const setTranslationFilter = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) params.set('translation_id', id)
    else params.delete('translation_id')
    router.push(`?${params.toString()}`, { scroll: false })
    setPage(1)
  }

  const handleDeleteAll = async () => {
    if (!translationId) {
      alert('Please select a language to delete all blocks from.')
      return
    }
    const langName = allTranslations.find((t) => t.id === translationId)?.name ?? `ID ${translationId}`
    if (!confirm(`Delete ALL content blocks for language "${langName}"? This cannot be undone.`)) return
    await deleteAllMutation.mutateAsync(translationId)
  }

  const handleCopy = async (sourceId: number, destinationId: number) => {
    await copyMutation.mutateAsync({ sourceId, destinationId })
    setShowCopyModal(false)
  }

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
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
          <h1 className="text-3xl font-bold text-gray-900">Content Blocks</h1>
          <p className="mt-2 text-sm text-gray-600">Manage reusable content blocks</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/content-blocks/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Create Block
          </Link>
        </div>
      </div>

      {/* Filter row */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select
          value={translationId ?? ''}
          onChange={(e) => setTranslationFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Languages</option>
          {allTranslations.map((t) => (
            <option key={t.id} value={t.id}>{t.displayName || t.name}</option>
          ))}
        </select>
        <button
          onClick={handleDeleteAll}
          disabled={deleteAllMutation.isPending || !translationId}
          className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete All
        </button>
        <button
          onClick={() => setShowCopyModal(true)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Copy All
        </button>
        <input
          type="search"
          placeholder="Search by title or position…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="block rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none sm:w-72"
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Position</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Language</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sort Order</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((block: ContentBlock) => (
                    <tr key={block.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{block.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-semibold leading-5 text-blue-800">{block.position}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {block.translation?.name ?? 'English (default)'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{block.sortOrder}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(block.createdAt).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <Link href={`/content-blocks/${block.id}`} className="text-blue-600 hover:text-blue-900 mr-4">Edit</Link>
                        <button
                          onClick={() => handleDelete(block.id, block.title)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteMutation.isPending}
                        >
                          Delete
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
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                <span className="text-sm text-gray-600">Page {page} of {data.pagination.lastPage}</span>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= data.pagination.lastPage}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-gray-900">No content blocks</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a content block</p>
            <div className="mt-6">
              <Link href="/content-blocks/new" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Create Block</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContentBlocksPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
      </div>
    }>
      <ContentBlocksPageInner />
    </Suspense>
  )
}
