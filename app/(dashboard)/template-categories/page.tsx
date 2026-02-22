'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api/client'
import type { TemplateCategory } from '@/types/entities/template'

export default function TemplateCategoriesPage() {
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/template-categories?no-pagination=true')
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return
    try {
      await apiClient.delete(`/template-categories/${id}`)
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch { /* error */ }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Template Categories</h1>
          <p className="mt-1 text-sm text-gray-600">Organize QR code templates into categories.</p>
        </div>
        <Link
          href="/template-categories/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Create Category
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-sm font-medium text-gray-900">No categories</h3>
          <p className="mt-1 text-sm text-gray-500">Create a category to organize your templates.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sort Order</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{cat.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {cat.textColor && (
                      <span
                        className="mr-2 inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.textColor }}
                      />
                    )}
                    {cat.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{cat.sort_order ?? '—'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <Link href={`/template-categories/${cat.id}`} className="mr-3 font-medium text-indigo-600 hover:text-indigo-500">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(cat.id)} className="font-medium text-red-600 hover:text-red-500">
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
  )
}
