'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Archive, Filter, FolderTree as FolderTreeIcon, Folder as FolderIcon } from 'lucide-react'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import { PageQueryError } from '@/components/common/PageQueryError'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { useMultiSelect } from '@/lib/hooks/useMultiSelect'
import { useFilters } from '@/lib/hooks/useFilters'
import { useQRActions } from '@/lib/hooks/useQRActions'
import { MultiSelectToolbar, type BulkAction } from '@/components/qr/MultiSelectToolbar'
import { FilterModal } from '@/components/qr/FilterModal'
import { QRCodeCardSkeleton } from '@/components/common/Skeleton'
import { NoSearchResultsEmptyState } from '@/components/common/EmptyState'
import { SortDropdown, type SortOption } from '@/components/qr/SortDropdown'
import { ViewModeToggle } from '@/components/qr/ViewModeToggle'
import { QRCodeMinimalCard } from '@/components/qr/QRCodeMinimalCard'
import { QRCodeDetailedRow } from '@/components/qr/QRCodeDetailedRow'
import { QRCodeCard } from '@/components/features/qrcodes/QRCodeCard'
import { Pagination } from '@/components/common/Pagination'
import { useFolders } from '@/lib/hooks/queries/useFolders'
import type { Folder } from '@/lib/api/endpoints/folders'
import { parseSortOption, buildApiFilters } from '@/lib/utils/qr-list-helpers'
import { Download, Trash2, ArchiveRestore, Copy } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'
import { QRDownloadModal } from '@/components/qr/QRDownloadModal'

/**
 * Purpose: Executes ArchivedQRCodesPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function ArchivedQRCodesPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showFolders, setShowFolders] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [downloadModalQRIds, setDownloadModalQRIds] = useState<string[]>([])

  // Load view mode from localStorage (same as main QR list)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'minimal'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('qr-list-view-mode') as 'grid' | 'list' | 'minimal') || 'grid'
    }
    return 'grid'
  })

  // Persist view mode to localStorage
  /**
   * Purpose: Executes handleViewModeChange functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
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

  // Fetch QR codes with archived filter + sort + filters
  const { data, isLoading, error, refetch } = useQRCodes({
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

  const { selectedItems, selectedIds, deselectAll, toggleItem } = useMultiSelect(qrcodes)

  const {
    bulkDownloadQRCodes,
    bulkDuplicateQRCodes,
    bulkUnarchiveQRCodes,
    bulkDeleteQRCodes,
    unarchiveQRCode,
    duplicateQRCode,
    deleteQRCode,
    downloadQRCode,
  } = useQRActions()

  // Build bulk actions for archived toolbar (unarchive instead of archive)
  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        id: 'download',
        label: t('Download'),
        icon: <Download className="w-4 h-4" />,
        onClick: (ids: string[]) => setDownloadModalQRIds(ids),
      },
      {
        id: 'duplicate',
        label: t('Duplicate'),
        icon: <Copy className="w-4 h-4" />,
        onClick: async (ids: string[]) => {
          toast
            .promise(bulkDuplicateQRCodes(ids), {
              loading: t('Duplicating QR codes...'),
              success: t('QR codes duplicated successfully'),
              error: t('Failed to duplicate QR codes'),
            })
            .unwrap()
            .then(() => deselectAll())
        },
      },
      {
        id: 'unarchive',
        label: t('Unarchive'),
        icon: <ArchiveRestore className="w-4 h-4" />,
        onClick: async (ids: string[]) => {
          await bulkUnarchiveQRCodes(ids)
          deselectAll()
        },
      },
      {
        id: 'delete',
        label: t('Delete'),
        icon: <Trash2 className="w-4 h-4" />,
        variant: 'danger' as const,
        requiresConfirmation: true,
        onClick: async (ids: string[]) => {
          await bulkDeleteQRCodes(ids)
          deselectAll()
        },
      },
    ],
    [
      bulkDownloadQRCodes,
      bulkDuplicateQRCodes,
      bulkUnarchiveQRCodes,
      bulkDeleteQRCodes,
      deselectAll,
      t,
    ]
  )

  // Single-item action handler for archived rows
  const handleRowAction = useCallback(
    (action: string, qrCodeId: string) => {
      switch (action) {
        case 'view':
        case 'preview':
          router.push(`/qrcodes/${qrCodeId}`)
          break
        case 'edit':
          router.push(`/qrcodes/${qrCodeId}/edit`)
          break
        case 'stats':
        case 'analytics':
          router.push(`/qrcodes/${qrCodeId}/analytics`)
          break
        case 'share': {
          const shareUrl = `${window.location.origin}/qr/${qrCodeId}`
          navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
              alert(t('QR code link copied to clipboard!'))
            })
            .catch(() => {
              window.open(shareUrl, '_blank')
            })
          break
        }
        case 'move-to-folder':
          // Folders might not be supported in archive directly, but we can redirect or show an alert, or support it if needed.
          // In original it just ignores it because it's not handled.
          // Wait, 'move-to-folder' needs setFolderModalQRIds which is not in archived page. I'll just ignore it or alert.
          alert(t('Moving to folders is only available for active QR codes.'))
          break
        case 'unarchive':
          unarchiveQRCode(qrCodeId)
          break
        case 'duplicate':
          toast.promise(duplicateQRCode(qrCodeId), {
            loading: t('Duplicating QR code...'),
            success: t('QR code duplicated successfully'),
            error: t('Failed to duplicate QR code'),
          })
          break
        case 'delete':
          if (confirm(t('Are you sure you want to delete this QR code?'))) {
            deleteQRCode(qrCodeId)
          }
          break
        case 'download':
          setDownloadModalQRIds([qrCodeId])
          break
        default:
          break
      }
    },
    [router, unarchiveQRCode, duplicateQRCode, deleteQRCode, downloadQRCode, t]
  )

  /**
   * Purpose: Executes handleSearch functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSearch = (query: string) => {
    setSearch(query)
    setPage(1)
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageQueryError
          error={error}
          title={t('Failed to load archived QR codes')}
          onRetry={() => refetch()}
        />
      </div>
    )
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
              <h1 className="text-3xl font-bold text-gray-900">{t('Archived QR Codes')}</h1>
              <p className="mt-2 text-sm text-gray-600">
                {t('View and manage your archived QR codes')}
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
            {t('Folders')}
          </button>
          <button
            onClick={() => setShowFilters(true)}
            className="inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('Filters')}
          </button>
          <Link
            href="/qrcodes"
            className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
          >
            {t('View Active QR Codes')}
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
              <h3 className="font-semibold text-gray-900 mb-4">{t('Folders')}</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedFolder(null)
                    setPage(1)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    !selectedFolder
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t('All QR Codes')}
                </button>
                {(foldersData || []).map((folder: Folder) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setSelectedFolder(String(folder.id))
                      setPage(1)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                      selectedFolder === String(folder.id)
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FolderIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 truncate">{folder.name}</span>
                    {folder.qrcode_count > 0 && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {folder.qrcode_count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Toolbar */}
          <div className="mb-6 space-y-4">
            <DebouncedSearch
              onSearch={handleSearch}
              placeholder={t('Search archived QR codes...')}
              delay={300}
              minLength={0}
            />

            <div className="flex items-center justify-between">
              <SortDropdown currentSort={sortBy} onSortChange={setSortBy} />
              <ViewModeToggle currentMode={viewMode} onModeChange={handleViewModeChange} />
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-6 bg-[#D3BBFF]/15 border border-[#D3BBFF] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Archive className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary-900">
                  {t('These QR codes are archived')}
                </p>
                <p className="text-sm text-primary-700 mt-1">
                  {t(
                    'Archived QR codes are hidden from your active list but can be unarchived at any time. They continue to work and track scans.'
                  )}
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
                {t('No archived QR codes')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("You haven't archived any QR codes yet. Archived items will appear here.")}
              </p>
              <Link
                href="/qrcodes"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] text-white rounded-md hover:brightness-105 transition-all"
              >
                {t('View Active QR Codes')}
              </Link>
            </div>
          )}

          {!isLoading && !hasQRCodes && search && <NoSearchResultsEmptyState query={search} />}

          {/* QR Codes List */}
          {!isLoading && hasQRCodes && (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {qrcodes.map(qrcode => (
                    <QRCodeCard
                      key={qrcode.id}
                      qrcode={qrcode}
                      onAction={action => handleRowAction(action, qrcode.id)}
                    />
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
                        router.push(`/qrcodes/${qrcode.id}`)
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

      <QRDownloadModal
        isOpen={downloadModalQRIds.length > 0}
        onClose={() => setDownloadModalQRIds([])}
        qrCodeIds={downloadModalQRIds}
      />
    </div>
  )
}
