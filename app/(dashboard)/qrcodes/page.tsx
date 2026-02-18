'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Filter, FolderTree as FolderTreeIcon } from 'lucide-react'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { useMultiSelect } from '@/hooks/useMultiSelect'
import { useFilters } from '@/hooks/useFilters'
import { MultiSelectToolbar } from '@/components/qr/MultiSelectToolbar'
import { FilterModal } from '@/components/qr/FilterModal'
import { FolderTree } from '@/components/qr/FolderTree'
import { QRCodeCardSkeleton } from '@/components/common/Skeleton'
import { NoQRCodesEmptyState, NoSearchResultsEmptyState } from '@/components/common/EmptyState'
import { SortDropdown, type SortOption } from '@/components/qr/SortDropdown'
import { ViewModeToggle } from '@/components/qr/ViewModeToggle'
import { QRCodeQuotaDisplay } from '@/components/qr/QRCodeQuotaDisplay'
import { BulkCreateButton } from '@/components/qr/BulkCreateButton'
import { TrialMessage } from '@/components/qr/TrialMessage'
import { QRCodeMinimalCard } from '@/components/qr/QRCodeMinimalCard'
import { QRCodeDetailedRow } from '@/components/qr/QRCodeDetailedRow'
import { QRCodeCard } from '@/components/features/qrcodes/QRCodeCard'


export default function QRCodesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showFolders, setShowFolders] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'minimal'>('grid')
  
  const { data, isLoading, error } = useQRCodes({ 
    page, 
    search: search || undefined,
    folderId: selectedFolder || undefined,
  })

  // Mock user data - replace with real user data from context/hook
  const user = {
    subscription: {
      plan: 'trial', // or 'basic', 'pro', 'enterprise'
      qrCodesUsed: data?.pagination?.total || 0,
      qrCodesLimit: 10,
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }

  const isOnTrial = user.subscription.plan === 'trial'

  const {
    selectedItems,
    deselectAll,
  } = useMultiSelect()

  const {
    filters,
    updateFilters,
    resetFilters,
  } = useFilters()

  const handleSearch = (query: string) => {
    setSearch(query)
    setPage(1)
  }

  if (error) {
    console.error('QR Codes fetch error:', error)
  }

  const qrcodes = data?.data || []
  const hasQRCodes = qrcodes.length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Trial Message */}
      {isOnTrial && (
        <div className="mb-6">
          <TrialMessage
            trialEndsAt={user.subscription.trialEndsAt}
            onUpgrade={() => { window.location.href = '/pricing' }}
          />
        </div>
      )}

      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Codes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage all your QR codes in one place
          </p>
          <div className="mt-3">
            <QRCodeQuotaDisplay
              used={user.subscription.qrCodesUsed}
              total={user.subscription.qrCodesLimit}
              plan={user.subscription.plan}
            />
          </div>
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
          <BulkCreateButton
            onClick={() => { window.location.href = '/qrcodes/bulk' }}
          />
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
      {selectedItems.length > 0 && (
        <div className="mt-6">
          <MultiSelectToolbar
            selectedCount={selectedItems.length}
            onClearSelection={deselectAll}
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
                folders={[]}
                selectedFolderId={selectedFolder}
                onSelectFolder={setSelectedFolder}
                onToggleExpanded={() => {}}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Toolbar */}
          <div className="mb-6 space-y-4">
            <DebouncedSearch
              onSearch={handleSearch}
              placeholder="Search QR codes..."
              delay={300}
              minLength={0}
            />
            
            <div className="flex items-center justify-between">
              <SortDropdown
                currentSort={sortBy}
                onSortChange={setSortBy}
              />
              <ViewModeToggle
                currentMode={viewMode}
                onModeChange={setViewMode}
              />
            </div>
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
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {qrcodes.map((qrcode) => (
                    <QRCodeCard
                      key={qrcode.id}
                      qrcode={qrcode}
                    />
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-3">
                  {qrcodes.map((qrcode) => (
                    <QRCodeDetailedRow
                      key={qrcode.id}
                      qrcode={qrcode}
                      isSelected={selectedItems.some(item => item.id === qrcode.id)}
                      onToggleSelect={() => {}}
                      onAction={() => {}}
                    />
                  ))}
                </div>
              )}

              {/* Minimal View */}
              {viewMode === 'minimal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {qrcodes.map((qrcode) => (
                    <QRCodeMinimalCard
                      key={qrcode.id}
                      qrcode={qrcode}
                      onSelect={() => { window.location.href = `/qrcodes/${qrcode.id}` }}
                    />
                  ))}
                </div>
              )}

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
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />
    </div>
  )
}
