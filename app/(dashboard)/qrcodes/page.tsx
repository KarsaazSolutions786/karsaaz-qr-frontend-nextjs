'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Filter,
  FolderTree as FolderTreeIcon,
  Folder,
  Trash2 as TrashIcon,
  X,
} from 'lucide-react'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { useMultiSelect } from '@/hooks/useMultiSelect'
import { useFilters } from '@/hooks/useFilters'
import { useQRActions } from '@/hooks/useQRActions'
import { MultiSelectToolbar, type BulkAction } from '@/components/qr/MultiSelectToolbar'
import { FilterModal } from '@/components/qr/FilterModal'
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
import { Download, FolderInput, Archive, Copy, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { isSuperAdmin } from '@/lib/utils/permissions'
import { foldersAPI } from '@/lib/api/endpoints/folders'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { FolderSelectModal } from '@/components/common/FolderSelectModal'

export default function QRCodesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showFolders, setShowFolders] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [folderLoading, setFolderLoading] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [folderModalQRIds, setFolderModalQRIds] = useState<string[] | null>(null)
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

  const { data, isLoading, isFetching, error } = useQRCodes({
    page,
    perPage: 12,
    search: search || undefined,
    folderId: selectedFolder || undefined,
    domainId: selectedDomain || undefined,
    sortBy: sortField,
    sortOrder,
    ...filterParams,
  })

  // Real user/subscription data
  const { user } = useAuth()
  const isAdmin = isSuperAdmin(user)
  const { data: currentUser } = useCurrentUser()
  const { data: subscription } = useSubscription()
  const { data: foldersData } = useFolders()
  const queryClient = useQueryClient()
  const { data: domainsData } = useDomains(undefined, { enabled: isAdmin })
  const domains = domainsData?.data ?? []

  // Scroll to top when page changes
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const plan = subscription?.plan?.name || currentUser?.plan?.name || 'free'
  const qrCodesUsed = data?.pagination?.total || 0
  const qrCodesLimit = subscription?.plan?.qr_codes_limit ?? currentUser?.plan?.qr_codes_limit ?? 10
  const isOnTrial = plan === 'trial' || subscription?.on_trial === true
  const trialEndsAt = subscription?.trial_ends_at || ''

  const qrcodes = data?.data || []
  const hasQRCodes = qrcodes.length > 0

  // Folder actions
  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !user?.id) return
    setFolderLoading(true)
    try {
      await foldersAPI.create(user.id, { folder_name: newFolderName.trim() })
      setNewFolderName('')
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all() })
    } catch (err) {
      console.error('Failed to create folder:', err)
    } finally {
      setFolderLoading(false)
    }
  }

  const handleDeleteFolder = async (folderId: number) => {
    if (!user?.id) return
    if (
      !confirm(
        'Are you sure you want to delete this folder? QR codes inside will be moved to root.'
      )
    )
      return
    setFolderLoading(true)
    try {
      await foldersAPI.delete(user.id, folderId)
      if (selectedFolder === String(folderId)) {
        setSelectedFolder(null)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.qrcodes.list({} as Record<string, unknown>),
      })
    } catch (err) {
      console.error('Failed to delete folder:', err)
    } finally {
      setFolderLoading(false)
    }
  }

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
          setFolderModalQRIds(ids)
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
        icon: <TrashIcon className="w-4 h-4" />,
        variant: 'danger' as const,
        requiresConfirmation: true,
        onClick: (ids: string[]) => bulkDeleteQRCodes(ids).then(() => deselectAll()),
      },
    ],
    [
      bulkDownloadQRCodes,
      bulkDuplicateQRCodes,
      bulkChangeStatus,
      bulkArchiveQRCodes,
      bulkDeleteQRCodes,
      deselectAll,
    ]
  )

  // Single-item action handler for QRCodeCard and QRCodeDetailedRow
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
              alert('QR code link copied to clipboard!')
            })
            .catch(() => {
              window.open(shareUrl, '_blank')
            })
          break
        }
        case 'move-to-folder':
          setFolderModalQRIds([qrCodeId])
          break
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
    [router, archiveQRCode, duplicateQRCode, changeStatus, deleteQRCode, downloadQRCode]
  )

  const handleSearch = useCallback((query: string) => {
    setSearch(query)
    setPage(1)
  }, [])

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
              router.push('/billing')
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
              router.push('/qrcodes/bulk-create')
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Folders</h3>
                <button
                  onClick={() => setShowFolders(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* "All QR Codes" option */}
              <button
                onClick={() => {
                  setSelectedFolder(null)
                  setPage(1)
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  selectedFolder === null
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span className="flex-1 text-left">All QR Codes</span>
              </button>

              {/* Folder list */}
              <div className="space-y-1">
                {(foldersData || []).map(folder => (
                  <div
                    key={folder.id}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      selectedFolder === String(folder.id)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Folder className="w-4 h-4 flex-shrink-0" />
                    <button
                      onClick={() => {
                        setSelectedFolder(String(folder.id))
                        setPage(1)
                      }}
                      className="flex-1 text-left font-medium truncate"
                    >
                      {folder.name}
                    </button>
                    {folder.qrcode_count > 0 && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {folder.qrcode_count}
                      </span>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleDeleteFolder(folder.id)
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                      title="Delete folder"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Create folder input */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleCreateFolder()
                    }}
                    placeholder="New folder name"
                    disabled={folderLoading}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    onClick={handleCreateFolder}
                    disabled={folderLoading || !newFolderName.trim()}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
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
            <NoQRCodesEmptyState onCreate={() => router.push('/qrcodes/new')} />
          )}

          {!isLoading && !hasQRCodes && search && <NoSearchResultsEmptyState query={search} />}

          {/* QR Codes List */}
          {!isLoading && hasQRCodes && (
            <div
              className={`transition-opacity duration-200 ${isFetching ? 'opacity-50 pointer-events-none' : ''}`}
            >
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
            </div>
          )}

          {/* Pagination - rendered outside isLoading block so it stays visible during page changes */}
          {data?.pagination && data.pagination.total > data.pagination.perPage && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={data.pagination.lastPage}
                pageSize={data.pagination.perPage}
                totalItems={data.pagination.total}
                onPageChange={setPage}
                showPageSize={false}
                disabled={isFetching}
              />
            </div>
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

      {/* Folder Select Modal */}
      {folderModalQRIds && (
        <FolderSelectModal
          selectedIds={[]}
          multi={false}
          onConfirm={async folderIds => {
            const folderId = folderIds[0] || null
            if (folderId) {
              await moveToFolder(folderModalQRIds, folderId)
              deselectAll()
            }
            setFolderModalQRIds(null)
          }}
          onClose={() => setFolderModalQRIds(null)}
        />
      )}
    </div>
  )
}
