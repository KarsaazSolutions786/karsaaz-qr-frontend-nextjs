'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBlogPost } from '@/lib/hooks/queries/useBlogPosts'
import { useUpdateBlogPost } from '@/lib/hooks/mutations/useBlogPostMutations'
import { useTranslations } from '@/lib/hooks/queries/useTranslations'
import { blogPostsAPI } from '@/lib/api/endpoints/blog-posts'
import type { CreateBlogPostRequest } from '@/types/entities/blog-post'

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: post, isLoading } = useBlogPost(Number(id))
  const updateMutation = useUpdateBlogPost()
  const { data: translations } = useTranslations({ page: 1 })

  const [formData, setFormData] = useState<CreateBlogPostRequest>({
    title: '',
    content: '',
    excerpt: '',
    metaDescription: '',
    publishedAt: undefined,
    translationId: undefined,
  })

  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [slug, setSlug] = useState('')

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        metaDescription: post.metaDescription || '',
        publishedAt: post.publishedAt,
        translationId: post.translationId,
      })
      // Generate slug from title (simplified - backend should provide actual slug)
      setSlug(post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync({ id: Number(id), data: formData })
  }

  const handleImageUpload = async () => {
    if (!featuredImage) return
    
    setUploading(true)
    try {
      await blogPostsAPI.uploadImage(Number(id), featuredImage)
      setFeaturedImage(null)
      // Refresh post data
      router.refresh()
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handlePreview = () => {
    // Open public blog URL in new tab
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    window.open(`${appUrl}/blog/post/${slug}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    )
  }

  if (!post) {
    return <div className="text-center py-12">Blog post not found</div>
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="mt-2 text-sm text-gray-600">Update blog post content and settings</p>
        </div>
        {slug && (
          <button
            type="button"
            onClick={handlePreview}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
        )}
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

        {/* Featured Image */}
        <div>
          <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
            Featured Image
          </label>
          <input
            type="file"
            id="featuredImage"
            accept="image/*"
            onChange={(e) => setFeaturedImage(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {featuredImage && (
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploading}
              className="mt-2 rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          )}
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
            disabled={updateMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
