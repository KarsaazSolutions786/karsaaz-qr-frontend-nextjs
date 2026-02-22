'use client'

import Link from 'next/link'
import { useCreateBlogPost } from '@/lib/hooks/mutations/useBlogPostMutations'
import BlogPostForm, { type BlogPostFormData } from '@/components/features/blog/BlogPostForm'

export default function NewBlogPostPage() {
  const createMutation = useCreateBlogPost()

  const handleSubmit = async (data: BlogPostFormData) => {
    await createMutation.mutateAsync({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || '',
      metaDescription: data.meta_description || data.meta_title || '',
      publishedAt: data.publishedAt || undefined,
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Blog Post</h1>
          <p className="mt-2 text-sm text-gray-600">Add a new blog post to your website</p>
        </div>
        <Link href="/blog-posts" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      <BlogPostForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Post"
      />
    </div>
  )
}
