'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCustomCodes } from '@/lib/hooks/queries/useCustomCodes'
import { useDeleteCustomCode } from '@/lib/hooks/mutations/useCustomCodeMutations'
import type { CustomCode } from '@/types/entities/custom-code'

export default function CustomCodesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useCustomCodes({ page, search: search || undefined })
  const deleteMutation = useDeleteCustomCode()

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Custom Code</h1>
          <p className="mt-2 text-sm text-gray-600">Inject custom scripts, styles, or markup into your application</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/custom-codes/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Create Custom Code
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search custom codes…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-gray-600">Loading…</p>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-8 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Language</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Position</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sort order</th>
                    <th className="relative py-3.5 pl-3 pr-4 w-28">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((code: CustomCode) => (
                    <tr key={code.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">{code.id}</td>
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
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(code.id, code.name)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
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
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {data.pagination.lastPage}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.pagination.lastPage}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No custom codes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by injecting a custom script, style, or HTML snippet.
            </p>
            <div className="mt-6">
              <Link
                href="/custom-codes/new"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Create Custom Code
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
