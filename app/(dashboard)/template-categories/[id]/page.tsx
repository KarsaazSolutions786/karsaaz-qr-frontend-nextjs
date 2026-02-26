'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  useTemplateCategory,
  useCreateTemplateCategory,
  useUpdateTemplateCategory,
} from '@/lib/hooks/queries/useTemplates'

const inputClass = 'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

export default function TemplateCategoryEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'

  const [name, setName] = useState('')
  const [textColor, setTextColor] = useState('#000000')
  const [sortOrder, setSortOrder] = useState('')

  // TanStack Query hooks
  const { data: categoryData, isLoading: queryLoading, error: queryError } = useTemplateCategory(
    isNew ? null : id
  )
  const createMutation = useCreateTemplateCategory()
  const updateMutation = useUpdateTemplateCategory()

  // Sync fetched data to local state
  useEffect(() => {
    if (categoryData) {
      setName(categoryData.name ?? '')
      setTextColor(categoryData.textColor ?? '#000000')
      setSortOrder(String(categoryData.sort_order ?? ''))
    }
  }, [categoryData])

  // Redirect on fetch error
  useEffect(() => {
    if (queryError && !isNew) {
      router.push('/template-categories')
    }
  }, [queryError, isNew, router])

  const loading = !isNew && queryLoading
  const saving = createMutation.isPending || updateMutation.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body: { name: string; text_color?: string; sort_order?: number } = { name, text_color: textColor }
    if (sortOrder) body.sort_order = Number(sortOrder)

    try {
      if (isNew) {
        await createMutation.mutateAsync(body)
      } else {
        await updateMutation.mutateAsync({ id, data: body })
      }
      router.push('/template-categories')
    } catch { /* error */ }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">
        {isNew ? 'New Template Category' : 'Edit Template Category'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">Color</label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="color"
              id="textColor"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-300"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className={inputClass + ' max-w-[140px]'}
            />
          </div>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">Sort Order</label>
          <input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={inputClass}
            placeholder="0"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : isNew ? 'Create' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/template-categories')}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
