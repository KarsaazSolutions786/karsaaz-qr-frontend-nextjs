'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { blogPostsAPI } from '@/lib/api/endpoints/blog-posts'
import type { BlogPost } from '@/types/entities/blog-post'
import { Loader2, ArrowLeft, Calendar } from 'lucide-react'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    blogPostsAPI
      .getById(Number(slug))
      .then((data) => setPost(data))
      .catch(() => setError('Blog post not found'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error || 'Post not found'}</p>
        <Link href="/blog" className="text-sm text-purple-600 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{post.title}</h1>

      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        <time dateTime={post.publishedAt || post.createdAt}>
          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      {post.featuredImageId && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={`/api/blog-posts/${post.id}/featured-image`}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      )}

      <div
        className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-purple-600 prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
