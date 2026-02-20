'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCreatePage } from '@/lib/hooks/mutations/usePageMutations'
import type { CreatePageRequest } from '@/types/entities/page'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? ''

export default function NewPagePage() {
  const router = useRouter()
  const createMutation = useCreatePage()

  const [form, setForm] = useState<CreatePageRequest>({
    title: '',
    slug: '',
    htmlContent: '',
    metaDescription: '',
    published: false,
  })

  const set = <K extends keyof CreatePageRequest>(key: K, value: CreatePageRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({ ...prev, title: value, slug: slugify(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync(form)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Page</h1>
          <p className="mt-2 text-sm text-gray-600">Create a standalone page for your application</p>
        </div>
        <Link href="/pages" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {createMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to create page. Please check the fields and try again.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
          <input type="text" required value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Privacy Policy"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input type="text" value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)}
            placeholder="auto-generated from title"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
          {form.slug && (
            <p className="mt-1 text-xs text-gray-500">
              URL preview:{' '}
              <span className="font-medium text-gray-700">{APP_URL}/{form.slug}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">HTML Content <span className="text-red-500">*</span></label>
          <textarea required rows={14} value={form.htmlContent} onChange={(e) => set('htmlContent', e.target.value)}
            placeholder="<h1>Hello World</h1>"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea rows={3} maxLength={160} value={form.metaDescription ?? ''} onChange={(e) => set('metaDescription', e.target.value)}
            placeholder="Brief description for search engines (max 160 characters)"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
          <p className="mt-1 text-xs text-gray-500">{(form.metaDescription ?? '').length}/160 characters</p>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={form.published ?? false}
            onChange={(e) => set('published', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600" />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            Published — make this page publicly accessible
          </label>
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <button type="button" onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={createMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {createMutation.isPending ? 'Creating…' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  )
}
