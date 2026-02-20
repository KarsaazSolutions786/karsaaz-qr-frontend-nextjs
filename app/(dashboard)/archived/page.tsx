'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Archive, Filter, FolderTree as FolderTreeIcon } from 'lucide-react'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { useMultiSelect } from '@/hooks/useMultiSelect'
import { useFilters } from '@/hooks/useFilters'
import { useQRActions } from '@/hooks/useQRActions'
import { MultiSelectToolbar, type BulkAction } from '@/components/qr/MultiSelectToolbar'
import { FilterModal } from '@/components/qr/FilterModal'
import { FolderTree } from '@/components/qr/FolderTree'
import { QRCodeCardSkeleton } from '@/components/common/Skeleton'
import { NoSearchResultsEmptyState } from '@/components/common/EmptyState'
import { SortDropdown, type SortOption } from '@/components/qr/SortDropdown'
import { ViewModeToggle } from '@/components/qr/ViewModeToggle'
import { QRCodeMinimalCard } from '@/components/qr/QRCodeMinimalCard'
import { QRCodeDetailedRow } from '@/components/qr/QRCodeDetailedRow'
import { QRCodeCard } from '@/components/features/qrcodes/QRCodeCard'
import { Pagination } from '@/components/common/Pagination'
import { useFolders } from '@/lib/hooks/queries/useFolders'
import { parseSortOption, buildApiFilters } from '@/lib/utils/qr-list-helpers'
import {
  Download,
  Trash2,
  FolderInput,
  ArchiveRestore,
  Copy,
  FileDown,
} from 'lucide-react'

export default function ArchivedQRCodesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showFolders, setShowFolders] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  
  // Load view mode from localStorage (same as main QR list)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'minimal'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('qr-list-view-mode') as 'grid' | 'list' | 'minimal') || 'grid'
    }
    return 'grid'
  })
  
  // Persist view mode to localStorage
  const handleViewModeChange = (mode: 'grid' | 'list' | 'minimal') => {
    setViewMode(mode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('qr-list-view-mode', mode)
    }
  }

  const {
    filters,
    updateFilters,
    resetFilters,
  } = useFilters()
  
  // Parse sort option into API params
  const { sortBy: sortField, sortOrder } = useMemo(() => parseSortOption(sortBy), [sortBy])

  // Build filter params for API
  const filterParams = useMemo(() => buildApiFilters(filters), [filters])

  // Fetch QR codes with archived filter + sort + filters
  const { data, isLoading, error } = useQRCodes({ 
    page, 
    search: search || undefined,
    folderId: selectedFolder || undefined,
    sortBy: sortField,
    sortOrder,
    search_archived: true,
    ...filterParams,
  })

  // Folders data
  const { data: foldersData } = useFolders()

  const qrcodes = data?.data || []
  const hasQRCodes = qrcodes.length > 0

  const {
    selectedItems,
    selectedIds,
    deselectAll,
    toggleItem,
  } = useMultiSelect(qrcodes)

  const {
    isProcessing,
    bulkDownloadQRCodes,
    moveToFolder,
    bulkDuplicateQRCodes,
    bulkUnarchiveQRCodes,
    bulkDeleteQRCodes,
    unarchiveQRCode,
    duplicateQRCode,
    deleteQRCode,
    downloadQRCode,
  } = useQRActions()

  // Build bulk actions for archived toolbar (unarchive instead of archive)
  const bulkActions: BulkAction[] = useMemo(() => [
    {
      id: 'download',
      label: 'Download',
      icon: <Download className="w-4 h-4" />,
      onClick: (ids: string[]) => bulkDownloadQRCodes(ids),
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <Copy className="w-4 h-4" />,
      onClick: (ids: string[]) => bulkDuplicateQRCodes(ids),
    },
    {
      id: 'unarchive',
      label: 'Unarchive',
      icon: <ArchiveRestore className="w-4 h-4" />,
      onClick: (ids: string[]) => bulkUnarchiveQRCodes(ids).then(() => deselectAll()),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      variant: 'danger' as const,
      requiresConfirmation: true,
      onClick: (ids: string[]) => bulkDeleteQRCodes(ids).then(() => deselectAll()),
    },
  ], [bulkDownloadQRCodes, bulkDuplicateQRCodes, bulkUnarchiveQRCodes, bulkDeleteQRCodes, deselectAll])

  // Single-item action handler for archived rows
  const handleRowAction = useCallback((action: string, qrCodeId: string) => {
    switch (action) {
      case 'unarchive': unarchiveQRCode(qrCodeId); break
      case 'duplicate': duplicateQRCode(qrCodeId); break
      case 'delete':
        if (confirm('Are you sure you want to delete this QR code?')) {
          deleteQRCode(qrCodeId)
        }
        break
      case 'download': downloadQRCode(qrCodeId); break
      default: break
    }
  }, [unarchiveQRCode, duplicateQRCode, deleteQRCode, downloadQRCode])

  const handleSearch = (query: string) => {
    setSearch(query)
    setPage(1)
  }

  if (error) {
    console.error('Archived QR Codes fetch error:', error)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Archive className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Archived QR Codes</h1>
              <p className="mt-2 text-sm text-gray-600">
                View and manage your archived QR codes
              </p>
            </div>
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
          <Link
            href="/qrcodes"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            View Active QR Codes
          </Link>
        </div>
      </div>

      {/* Multi-Select Toolbar */}
      {selectedItems.length > 0 && (
        <div className="mt-6">
          <MultiSelectToolbar
            selectedCount={selectedItems.length}
            onClearSelection={deselectAll}
            actions={bulkActions.map(a => ({
              ...a,
              onClick: () => a.onClick(selectedIds),
            }))}
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
                folders={foldersData || []}
                selectedFolderId={selectedFolder}
                onSelectFolder={(id) => { setSelectedFolder(id); setPage(1) }}
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
              placeholder="Search archived QR codes..."
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
                onModeChange={handleViewModeChange}
              />
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Archive className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  These QR codes are archived
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Archived QR codes are hidden from your active list but can be unarchived at any time. 
                  They continue to work and track scans.
                </p>
              </div>
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
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No archived QR codes
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't archived any QR codes yet. Archived items will appear here.
              </p>
              <Link
                href="/qrcodes"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Active QR Codes
              </Link>
            </div>
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
                      onToggleSelect={() => toggleItem(qrcode.id)}
                      onAction={(action) => handleRowAction(action, qrcode.id)}
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
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={data.pagination.lastPage}
                    pageSize={data.pagination.perPage}
                    totalItems={data.pagination.total}
                    onPageChange={setPage}
                    showPageSize={false}
                  />
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
