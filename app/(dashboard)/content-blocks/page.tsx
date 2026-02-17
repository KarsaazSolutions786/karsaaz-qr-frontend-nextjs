'use client'

export default function ContentBlocksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Blocks</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage reusable content blocks
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
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Content Block Library</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage reusable content blocks
          </p>
          <p className="mt-4 text-xs text-gray-400">
            Module ready - pending backend integration
          </p>
        </div>
      </div>
    </div>
  )
}
