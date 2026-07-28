'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useBlogPosts } from '@/lib/hooks/queries/useBlogPosts'
import { useDeleteBlogPost } from '@/lib/hooks/mutations/useBlogPostMutations'
import BlogPostList from '@/components/features/blog/BlogPostList'
import type { BlogPost } from '@/types/entities/blog-post'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { useConfirmation } from '@/components/ui/confirmation-modal'

/**
 * Purpose: Executes BlogPostsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function BlogPostsPage() {
  const { confirm } = useConfirmation()
  const { t } = useTranslation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useBlogPosts({ page, search: search || undefined })
  const deleteMutation = useDeleteBlogPost()

  /**
   * Purpose: Executes handleEdit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleEdit = (post: BlogPost) => {
    router.push(`/blog-posts/${post.id}`)
  }

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDelete = async (post: BlogPost) => {
    if (
      await confirm({
        title: 'Are you sure?',
        message: t('Are you sure you want to delete "{{title}}"?').replace('{{title}}', post.title),
        type: 'danger',
      })
    ) {
      await deleteMutation.mutateAsync(post.id)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Blog Posts')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('Manage your blog content')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/blog-posts/new"
            className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
          >
            {t('New Post')}
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <input
            type="search"
            placeholder={t('Search by title')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <LottieLoader size={80} />
            <p className="mt-2 text-sm text-gray-600">{t('Loading...')}</p>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <BlogPostList posts={data.data} onEdit={handleEdit} onDelete={handleDelete} />

            {data.pagination && data.pagination.lastPage > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('Previous')}
                </button>
                <span className="text-sm text-gray-600">
                  {t('Page')} {page} {t('of')} {data.pagination.lastPage}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= data.pagination.lastPage}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('Next')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('No posts yet')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('Get started by creating your first blog post')}
            </p>
            <div className="mt-6">
              <Link
                href="/blog-posts/new"
                className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
              >
                {t('New Post')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
