'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { blogPostsAPI } from '@/lib/api/endpoints/blog-posts'
import type { BlogPost } from '@/types/entities/blog-post'
import { Loader2, Calendar } from 'lucide-react'

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    blogPostsAPI
      .getAll({ page })
      .then((res) => {
        setPosts(res.data)
        setLastPage(res.pagination.lastPage)
      })
      .catch(() => setError('Failed to load blog posts'))
      .finally(() => setLoading(false))
  }, [page])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts published yet.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {post.featuredImageId && (
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={`/api/blog-posts/${post.id}/featured-image`}
                    alt={post.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                <h2 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mb-3 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <span className="mt-3 inline-block text-sm font-medium text-purple-600 group-hover:underline">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {lastPage > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="flex items-center px-3 text-sm text-gray-500">
            Page {page} of {lastPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page === lastPage}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
