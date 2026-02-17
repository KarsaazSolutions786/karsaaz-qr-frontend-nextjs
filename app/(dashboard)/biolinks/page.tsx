'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useBiolinks } from '@/lib/hooks/queries/useBiolinks'
import { useDeleteBiolink } from '@/lib/hooks/mutations/useBiolinkMutations'

export default function BiolinksPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useBiolinks({ search: search || undefined })
  const deleteMutation = useDeleteBiolink()

  const handleDelete = async (id: number, slug: string) => {
    if (confirm(`Delete biolink "${slug}"? This action cannot be undone.`)) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading biolinks...</div>
      </div>
    )
  }

  const biolinks = data?.data || []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biolink Pages</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create custom landing pages with links and content blocks
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/biolinks/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Create Biolink
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search biolinks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="mt-8">
        {biolinks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No biolinks</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first biolink page.</p>
            <div className="mt-6">
              <Link
                href="/biolinks/new"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Create Biolink
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {biolinks.map((biolink) => (
                  <tr key={biolink.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {biolink.title}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      /{biolink.slug}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          biolink.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {biolink.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {biolink.views}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/biolinks/${biolink.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(biolink.id, biolink.slug)}
                        className="ml-4 text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
