'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateBlogPost } from '@/lib/hooks/mutations/useBlogPostMutations'
import { useTranslations } from '@/lib/hooks/queries/useTranslations'
import type { CreateBlogPostRequest } from '@/types/entities/blog-post'

export default function NewBlogPostPage() {
  const router = useRouter()
  const createMutation = useCreateBlogPost()
  const { data: translations } = useTranslations({ page: 1 })

  const [formData, setFormData] = useState<CreateBlogPostRequest>({
    title: '',
    content: '',
    excerpt: '',
    metaDescription: '',
    publishedAt: undefined,
    translationId: undefined,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync(formData)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Blog Post</h1>
        <p className="mt-2 text-sm text-gray-600">Add a new blog post to your website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            required
            rows={10}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 font-mono text-sm"
            placeholder="Markdown content..."
          />
          <p className="mt-1 text-xs text-gray-500">Supports Markdown formatting</p>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Optional excerpt for blog index page"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            rows={2}
            maxLength={160}
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.metaDescription?.length || 0}/160 characters
          </p>
        </div>

        {/* Published At */}
        <div>
          <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
            Published At
          </label>
          <input
            type="datetime-local"
            id="publishedAt"
            value={formData.publishedAt?.slice(0, 16) || ''}
            onChange={(e) =>
              setFormData({ ...formData, publishedAt: e.target.value ? e.target.value + ':00' : undefined })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Only posts with publish date in the past will be available on the front end
          </p>
        </div>

        {/* Language */}
        <div>
          <label htmlFor="translationId" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="translationId"
            value={formData.translationId || ''}
            onChange={(e) =>
              setFormData({ ...formData, translationId: e.target.value ? Number(e.target.value) : undefined })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Default</option>
            {translations?.data.filter((t) => t.isActive).map((translation) => (
              <option key={translation.id} value={translation.id}>
                {translation.displayName || translation.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
