'use client'

import Link from 'next/link'
import type { BlogPost } from '@/types/entities/blog-post'

interface BlogPostListProps {
  posts: BlogPost[]
  onEdit?: (post: BlogPost) => void
  onDelete?: (post: BlogPost) => void
}

function StatusBadge({ post }: { post: BlogPost }) {
  const isPublished = !!post.publishedAt && new Date(post.publishedAt) <= new Date()
  const label = isPublished ? 'Published' : 'Draft'
  const style = isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${style}`}>
      {label}
    </span>
  )
}

export default function BlogPostList({ posts, onEdit, onDelete }: BlogPostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first blog post.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Title</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Published</th>
            <th className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                {post.title}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <StatusBadge post={post} />
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {post.translation?.name ?? 'Default'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                {onEdit ? (
                  <button
                    onClick={() => onEdit(post)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                ) : (
                  <Link href={`/blog-posts/${post.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </Link>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(post)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
