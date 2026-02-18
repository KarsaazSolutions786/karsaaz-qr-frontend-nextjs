'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from '@/lib/hooks/queries/useTranslations'
import {
  useDeleteTranslation,
  useSetMainTranslation,
  useToggleTranslationActive,
} from '@/lib/hooks/mutations/useTranslationMutations'
import type { Translation } from '@/types/entities/translation'

export default function TranslationsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useTranslations({ page, search: search || undefined })
  const deleteMutation = useDeleteTranslation()
  const setMainMutation = useSetMainTranslation()
  const toggleActiveMutation = useToggleTranslationActive()

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Translations</h1>
          <p className="mt-2 text-sm text-gray-600">Manage language translations and localization</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/translations/new" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
            Add Language
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <input type="search" placeholder="Search translations..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:max-w-md" />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Loading translations...</p>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Locale</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Direction</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Active</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Main</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Completeness</th>
                    <th className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((translation: Translation) => (
                    <tr key={translation.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {translation.displayName || translation.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex rounded-full bg-indigo-100 px-2 text-xs font-semibold leading-5 text-indigo-800">{translation.locale}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${translation.direction === 'rtl' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                          {translation.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <button
                          onClick={() => toggleActiveMutation.mutate(translation.id)}
                          disabled={toggleActiveMutation.isPending || translation.isMain}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${translation.isActive ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${translation.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {translation.isMain ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">Main</span>
                        ) : (
                          <button
                            onClick={() => setMainMutation.mutate(translation.id)}
                            disabled={setMainMutation.isPending}
                            className="text-sm text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          >
                            Set Main
                          </button>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-blue-600 transition-all"
                              style={{ width: `${translation.completeness}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{translation.completeness}%</span>
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <Link href={`/translations/${translation.id}`} className="text-blue-600 hover:text-blue-900 mr-4">Edit</Link>
                        <button
                          onClick={() => handleDelete(translation.id, translation.name)}
                          className="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={deleteMutation.isPending || translation.isMain}
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
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No translations</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a language</p>
            <div className="mt-6">
              <Link href="/translations/new" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Add Language</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
