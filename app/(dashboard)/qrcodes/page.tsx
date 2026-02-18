'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Filter, FolderTree as FolderTreeIcon } from 'lucide-react'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import { QRCodeList } from '@/components/features/qrcodes/QRCodeList'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { useMultiSelect } from '@/hooks/useMultiSelect'
import { MultiSelectToolbar } from '@/components/qr/MultiSelectToolbar'
import { FilterModal } from '@/components/qr/FilterModal'
import { FolderTree } from '@/components/qr/FolderTree'
import { QRCodeCardSkeleton } from '@/components/common/Skeleton'
import { NoQRCodesEmptyState, NoSearchResultsEmptyState } from '@/components/common/EmptyState'

export default function QRCodesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showFolders, setShowFolders] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  
  const { data, isLoading, error } = useQRCodes({ 
    page, 
    search: search || undefined,
    folder_id: selectedFolder || undefined,
  })

  const {
    selectedItems,
    isSelected,
    toggleItem,
    selectAll,
    deselectAll,
    selectRange,
  } = useMultiSelect()

  const handleSearch = (query: string) => {
    setSearch(query)
    setPage(1)
  }

  const handleBulkAction = async (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedItems)
    // Implement bulk actions here
  }

  if (error) {
    console.error('QR Codes fetch error:', error)
  }

  const qrcodes = data?.data || []
  const hasQRCodes = qrcodes.length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Codes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage all your QR codes in one place
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <button
            onClick={() => setShowFolders(!showFolders)}
            className="inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FolderTreeIcon className="w-4 h-4 mr-2" />
            Folders
          </button>
          <button
            onClick={() => setShowFilters(true)}
            className="inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <Link
            href="/qrcodes/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create QR Code
          </Link>
        </div>
      </div>

      {/* Multi-Select Toolbar */}
      {selectedItems.size > 0 && (
        <div className="mt-6">
          <MultiSelectToolbar
            selectedCount={selectedItems.size}
            onAction={handleBulkAction}
            onDeselectAll={deselectAll}
          />
        </div>
      )}

      <div className="mt-8 flex gap-6">
        {/* Folders Sidebar */}
        {showFolders && (
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Folders</h3>
              <FolderTree
                selectedFolderId={selectedFolder}
                onSelectFolder={setSelectedFolder}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Search */}
          <div className="mb-6">
            <DebouncedSearch
              onSearch={handleSearch}
              placeholder="Search QR codes..."
              delay={300}
              minLength={0}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <QRCodeCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty States */}
          {!isLoading && !hasQRCodes && !search && (
            <NoQRCodesEmptyState onCreate={() => window.location.href = '/qrcodes/new'} />
          )}

          {!isLoading && !hasQRCodes && search && (
            <NoSearchResultsEmptyState query={search} />
          )}

          {/* QR Codes List */}
          {!isLoading && hasQRCodes && (
            <>
              <QRCodeList 
                qrcodes={qrcodes} 
                isLoading={false}
                selectedItems={selectedItems}
                onToggleItem={toggleItem}
                onSelectRange={selectRange}
              />

              {/* Pagination */}
              {data?.pagination && data.pagination.total > data.pagination.perPage && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {data.pagination.lastPage}
                  </span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.pagination.lastPage}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  )
}
