'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Filter, FolderTree as FolderTreeIcon } from 'lucide-react'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { useMultiSelect } from '@/hooks/useMultiSelect'
import { useFilters } from '@/hooks/useFilters'
import { useQRActions } from '@/hooks/useQRActions'
import { MultiSelectToolbar, type BulkAction } from '@/components/qr/MultiSelectToolbar'
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
import { Pagination } from '@/components/common/Pagination'
import { useCurrentUser } from '@/lib/hooks/queries/useCurrentUser'
import { useSubscription } from '@/lib/hooks/queries/useSubscription'
import { useFolders } from '@/lib/hooks/queries/useFolders'
import { useDomains } from '@/lib/hooks/queries/useDomains'
import { parseSortOption, buildApiFilters } from '@/lib/utils/qr-list-helpers'
import { Download, Trash2, FolderInput, Archive, Copy, Eye, EyeOff } from 'lucide-react'

export default function QRCodesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showFolders, setShowFolders] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  // Load view mode from localStorage
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

  const { filters, updateFilters, resetFilters } = useFilters()

  // Parse sort option into API params
  const { sortBy: sortField, sortOrder } = useMemo(() => parseSortOption(sortBy), [sortBy])

  // Build filter params for API
  const filterParams = useMemo(() => buildApiFilters(filters), [filters])

  const { data, isLoading, error } = useQRCodes({
    page,
    search: search || undefined,
    folderId: selectedFolder || undefined,
    domainId: selectedDomain || undefined,
    sortBy: sortField,
    sortOrder,
    ...filterParams,
  })

  // Real user/subscription data
  const { data: currentUser } = useCurrentUser()
  const { data: subscription } = useSubscription()
  const { data: foldersData } = useFolders()
  const { data: domainsData } = useDomains()
  const domains = domainsData?.data ?? []

  const plan = subscription?.plan?.name || currentUser?.plan?.name || 'free'
  const qrCodesUsed = data?.pagination?.total || 0
  const qrCodesLimit = subscription?.plan?.qr_codes_limit ?? currentUser?.plan?.qr_codes_limit ?? 10
  const isOnTrial = plan === 'trial' || subscription?.on_trial === true
  const trialEndsAt = subscription?.trial_ends_at || ''

  const qrcodes = data?.data || []
  const hasQRCodes = qrcodes.length > 0

  const { selectedItems, selectedIds, deselectAll, toggleItem } = useMultiSelect(qrcodes)

  const {
    bulkDownloadQRCodes,
    moveToFolder,
    bulkDuplicateQRCodes,
    bulkChangeStatus,
    bulkArchiveQRCodes,
    bulkDeleteQRCodes,
    archiveQRCode,
    duplicateQRCode,
    changeStatus,
    deleteQRCode,
    downloadQRCode,
  } = useQRActions()

  // Build bulk actions for toolbar
  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        id: 'download',
        label: 'Download',
        icon: <Download className="w-4 h-4" />,
        onClick: (ids: string[]) => bulkDownloadQRCodes(ids),
      },
      {
        id: 'move',
        label: 'Move to Folder',
        icon: <FolderInput className="w-4 h-4" />,
        onClick: (ids: string[]) => {
          const folderId = prompt('Enter folder ID to move to:')
          if (folderId) moveToFolder(ids, folderId)
        },
      },
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: <Copy className="w-4 h-4" />,
        onClick: (ids: string[]) => bulkDuplicateQRCodes(ids),
      },
      {
        id: 'activate',
        label: 'Activate',
        icon: <Eye className="w-4 h-4" />,
        onClick: (ids: string[]) => bulkChangeStatus(ids, 'active'),
      },
      {
        id: 'deactivate',
        label: 'Deactivate',
        icon: <EyeOff className="w-4 h-4" />,
        onClick: (ids: string[]) => bulkChangeStatus(ids, 'inactive'),
      },
      {
        id: 'archive',
        label: 'Archive',
        icon: <Archive className="w-4 h-4" />,
        onClick: (ids: string[]) => bulkArchiveQRCodes(ids).then(() => deselectAll()),
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: <Trash2 className="w-4 h-4" />,
        variant: 'danger' as const,
        requiresConfirmation: true,
        onClick: (ids: string[]) => bulkDeleteQRCodes(ids).then(() => deselectAll()),
      },
    ],
    [
      bulkDownloadQRCodes,
      moveToFolder,
      bulkDuplicateQRCodes,
      bulkChangeStatus,
      bulkArchiveQRCodes,
      bulkDeleteQRCodes,
      deselectAll,
    ]
  )

  // Single-item action handler for QRCodeDetailedRow
  const handleRowAction = useCallback(
    (action: string, qrCodeId: string) => {
      switch (action) {
        case 'archive':
          archiveQRCode(qrCodeId)
          break
        case 'duplicate':
          duplicateQRCode(qrCodeId)
          break
        case 'activate':
          changeStatus(qrCodeId, 'active')
          break
        case 'deactivate':
          changeStatus(qrCodeId, 'inactive')
          break
        case 'delete':
          if (confirm('Are you sure you want to delete this QR code?')) {
            deleteQRCode(qrCodeId)
          }
          break
        case 'download':
          downloadQRCode(qrCodeId)
          break
        default:
          break
      }
    },
    [archiveQRCode, duplicateQRCode, changeStatus, deleteQRCode, downloadQRCode]
  )

  const handleSearch = (query: string) => {
    setSearch(query)
    setPage(1)
  }

  if (error) {
    console.error('QR Codes fetch error:', error)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Trial Message */}
      {isOnTrial && trialEndsAt && (
        <div className="mb-6">
          <TrialMessage
            trialEndsAt={trialEndsAt}
            onUpgrade={() => {
              window.location.href = '/billing'
            }}
          />
        </div>
      )}

      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Codes</h1>
          <p className="mt-2 text-sm text-gray-600">Manage all your QR codes in one place</p>
          <div className="mt-3">
            <QRCodeQuotaDisplay used={qrCodesUsed} total={qrCodesLimit} plan={plan} />
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
            onClick={() => {
              window.location.href = '/qrcodes/bulk'
            }}
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
                onSelectFolder={id => {
                  setSelectedFolder(id)
                  setPage(1)
                }}
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
              <div className="flex items-center gap-3">
                <SortDropdown currentSort={sortBy} onSortChange={setSortBy} />
                {/* T184: Domain filter */}
                {domains.length > 0 && (
                  <select
                    value={selectedDomain}
                    onChange={e => {
                      setSelectedDomain(e.target.value)
                      setPage(1)
                    }}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="">All Domains</option>
                    {domains.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.domain}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <ViewModeToggle currentMode={viewMode} onModeChange={handleViewModeChange} />
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
            <NoQRCodesEmptyState onCreate={() => (window.location.href = '/qrcodes/new')} />
          )}

          {!isLoading && !hasQRCodes && search && <NoSearchResultsEmptyState query={search} />}

          {/* QR Codes List */}
          {!isLoading && hasQRCodes && (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {qrcodes.map(qrcode => (
                    <QRCodeCard key={qrcode.id} qrcode={qrcode} />
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-3">
                  {qrcodes.map(qrcode => (
                    <QRCodeDetailedRow
                      key={qrcode.id}
                      qrcode={qrcode}
                      isSelected={selectedItems.some(item => item.id === qrcode.id)}
                      onToggleSelect={() => toggleItem(qrcode.id)}
                      onAction={action => handleRowAction(action, qrcode.id)}
                    />
                  ))}
                </div>
              )}

              {/* Minimal View */}
              {viewMode === 'minimal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {qrcodes.map(qrcode => (
                    <QRCodeMinimalCard
                      key={qrcode.id}
                      qrcode={qrcode}
                      onSelect={() => {
                        window.location.href = `/qrcodes/${qrcode.id}`
                      }}
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
