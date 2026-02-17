'use client'

export default function BlogPostsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your blog content
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Coming Soon Placeholder */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Blog Post Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create and edit blog posts with rich text editor
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Module ready - pending backend integration
          </p>
        </div>
      </div>
    </div>
  )
}
