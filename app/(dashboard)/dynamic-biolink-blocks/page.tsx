'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useDynamicBiolinkBlocks } from '@/lib/hooks/queries/useDynamicBiolinkBlocks'
import { useDeleteDynamicBiolinkBlock } from '@/lib/hooks/mutations/useDynamicBiolinkBlockMutations'

export default function DynamicBiolinkBlocksPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useDynamicBiolinkBlocks({ page })
  const deleteMutation = useDeleteDynamicBiolinkBlock()

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this dynamic block?')) return
    setDeleteTarget(id)
    try {
      await deleteMutation.mutateAsync(id)
    } finally {
      setDeleteTarget(null)
    }
  }

  const blocks = data?.data ?? []
  const pagination = data?.pagination

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Biolink Blocks</h1>
          <p className="mt-2 text-sm text-gray-600">Reusable block templates for biolink pages</p>
        </div>
        <Link href="/dynamic-biolink-blocks/new"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          + New Block
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          </div>
        ) : blocks.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-gray-500">
            <p className="text-lg font-medium">No dynamic blocks yet</p>
            <Link href="/dynamic-biolink-blocks/new" className="text-sm text-blue-600 hover:underline">Create your first block</Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-16 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fields</th>
                <th className="w-28 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {blocks.map((block) => (
                <tr key={block.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">{block.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{block.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{block.fields?.length ?? 0} field(s)</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dynamic-biolink-blocks/${block.id}`}
                        className="rounded px-2 py-1 text-blue-600 hover:bg-blue-50">Edit</Link>
                      <button onClick={() => handleDelete(block.id)}
                        disabled={deleteTarget === block.id}
                        className="rounded px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50">
                        {deleteTarget === block.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination && pagination.lastPage > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Page {pagination.currentPage} of {pagination.lastPage}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.currentPage === 1}
              className="rounded border px-3 py-1 disabled:opacity-40">← Prev</button>
            <button onClick={() => setPage((p) => Math.min(pagination.lastPage, p + 1))}
              disabled={pagination.currentPage === pagination.lastPage}
              className="rounded border px-3 py-1 disabled:opacity-40">Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}
