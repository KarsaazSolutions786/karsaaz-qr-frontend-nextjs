'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBlogPost } from '@/lib/hooks/queries/useBlogPosts'
import { useUpdateBlogPost } from '@/lib/hooks/mutations/useBlogPostMutations'
import { blogPostsAPI } from '@/lib/api/endpoints/blog-posts'
import BlogPostForm, { type BlogPostFormData } from '@/components/features/blog/BlogPostForm'

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: post, isLoading } = useBlogPost(Number(id))
  const updateMutation = useUpdateBlogPost()
  const [uploading, setUploading] = useState(false)

  const handleSubmit = async (data: BlogPostFormData) => {
    await updateMutation.mutateAsync({
      id: Number(id),
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        metaDescription: data.meta_description || data.meta_title || '',
        publishedAt: data.publishedAt || undefined,
      },
    })
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      await blogPostsAPI.uploadImage(Number(id), file)
      router.refresh()
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploading(false)
    }
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

  const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="mt-2 text-sm text-gray-600">Update blog post content and settings</p>
        </div>
        <div className="flex items-center gap-3">
          {slug && (
            <button
              type="button"
              onClick={() => {
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
                window.open(`${appUrl}/blog/post/${slug}`, '_blank')
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Preview
            </button>
          )}
          <Link href="/blog-posts" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
        </div>
      </div>

      <BlogPostForm
        defaultValues={{
          title: post.title,
          slug,
          content: post.content,
          excerpt: post.excerpt || '',
          meta_description: post.metaDescription || '',
          publishedAt: post.publishedAt?.slice(0, 16),
        }}
        onSubmit={handleSubmit}
        onImageUpload={handleImageUpload}
        isSubmitting={updateMutation.isPending || uploading}
        submitLabel="Update Post"
      />
    </div>
  )
}
