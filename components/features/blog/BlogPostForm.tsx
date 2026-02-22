'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().max(160, 'Max 160 characters').optional(),
  publishedAt: z.string().optional(),
  translationId: z.number().optional(),
})

export type BlogPostFormData = z.infer<typeof blogPostSchema>

interface BlogPostFormProps {
  defaultValues?: Partial<BlogPostFormData>
  onSubmit: (data: BlogPostFormData) => Promise<void> | void
  onImageUpload?: (file: File) => Promise<void> | void
  isSubmitting?: boolean
  submitLabel?: string
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function BlogPostForm({
  defaultValues,
  onSubmit,
  onImageUpload,
  isSubmitting = false,
  submitLabel = 'Save',
}: BlogPostFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      meta_title: '',
      meta_description: '',
      publishedAt: undefined,
      ...defaultValues,
    },
  })

  const title = watch('title')
  const metaDescription = watch('meta_description')

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !defaultValues?.slug) {
      setValue('slug', generateSlug(title))
    }
  }, [title, defaultValues?.slug, setValue])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onImageUpload) onImageUpload(file)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input
          type="text"
          {...register('slug')}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 shadow-sm focus:border-blue-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-500">Auto-generated from title. Edit if needed.</p>
      </div>

      {/* Content (Markdown) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('content')}
          rows={12}
          placeholder="Write your content in Markdown..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
        <p className="mt-1 text-xs text-gray-500">Supports Markdown formatting</p>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Excerpt</label>
        <textarea
          {...register('excerpt')}
          rows={3}
          placeholder="Short summary for listing pages"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Featured Image</label>
        {onImageUpload ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
        ) : (
          <div className="mt-1 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
            Image upload available after saving the post.
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:max-w-xs sm:text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Published At */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Published At</label>
        <input
          type="datetime-local"
          {...register('publishedAt')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:max-w-xs sm:text-sm"
        />
      </div>

      {/* SEO Fields */}
      <fieldset className="rounded-md border border-gray-200 p-4">
        <legend className="text-sm font-medium text-gray-700 px-1">SEO</legend>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">Meta Title</label>
          <input
            type="text"
            {...register('meta_title')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            {...register('meta_description')}
            rows={2}
            maxLength={160}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">{metaDescription?.length ?? 0}/160 characters</p>
          {errors.meta_description && <p className="mt-1 text-xs text-red-600">{errors.meta_description.message}</p>}
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 border-t pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
