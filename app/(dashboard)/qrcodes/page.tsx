'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Plus,
  Filter,
  FolderTree as FolderTreeIcon,
  Folder,
  Trash2 as TrashIcon,
  X,
} from 'lucide-react'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import { PageQueryError } from '@/components/common/PageQueryError'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { useMultiSelect } from '@/lib/hooks/useMultiSelect'
import { useQRActions } from '@/lib/hooks/useQRActions'
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
import {
  Download,
  FolderInput,
  Archive,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  UserCheck,
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useAuth } from '@/lib/hooks/useAuth'
import { isSuperAdmin } from '@/lib/utils/permissions'
import { foldersAPI } from '@/lib/api/endpoints/folders'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { FolderSelectModal } from '@/components/common/FolderSelectModal'
import { DeleteFolderDialog } from '@/components/qr/DeleteFolderDialog'
import type { Folder as FolderEntity, FolderContentAction } from '@/lib/api/endpoints/folders'
import { useSubscriptionLimits } from '@/lib/hooks/useSubscriptionLimits'
import { UpgradeRequiredModal } from '@/components/subscription/UpgradeRequiredModal'
import { BulkChangeTypeModal } from '@/components/qr/BulkChangeTypeModal'
import { BulkChangeOwnerModal } from '@/components/qr/BulkChangeOwnerModal'
import { useGuest } from '@/lib/hooks/useGuest'

/**
 * Purpose: Executes QRCodesPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function QRCodesPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isGuest } = useGuest()

  // ─── URL-driven state ──────────────────────────────────────────────────────
  // All filter/sort/page/search state lives in the URL so that:
  // • filters survive page reload
  // • back/forward navigation restores state
  // • users can share filtered URLs

  /** Read a URL param with a fallback */
  const sp = useCallback(
    (key: string, fallback = '') => searchParams.get(key) ?? fallback,
    [searchParams]
  )

  /** Push updated params to the URL without a full navigation */
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === '' || v === 'all' || v === 'date-desc') {
          params.delete(k)
        } else {
          params.set(k, v)
        }
      })
      // Use replace so each keystroke doesn't push a new history entry
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  // Derive state directly from URL params
  const search = sp('q')
  const urlPage = parseInt(sp('page', '1'), 10) || 1
  const sortBy = sp('sort', 'date-desc') as SortOption

  const selectedFolder = searchParams.get('folder') // null = all folders
  const selectedDomain = sp('domain')

  // ─── Filter state (also URL-backed) ────────────────────────────────────────
  const filters = useMemo(
    () => ({
      search: sp('q'),
      type: sp('type', 'all') as any,
      status: sp('status', 'all') as any,
      dateRange: sp('dateRange', 'all') as any,
      dateFrom: searchParams.get('dateFrom') ? new Date(sp('dateFrom')) : undefined,
      dateTo: searchParams.get('dateTo') ? new Date(sp('dateTo')) : undefined,
      scanCountMin: searchParams.get('scansMin') ? parseInt(sp('scansMin'), 10) : undefined,
      scanCountMax: searchParams.get('scansMax') ? parseInt(sp('scansMax'), 10) : undefined,
      hasLogo: searchParams.get('hasLogo') ? true : undefined,
      hasSticker: searchParams.get('hasSticker') ? true : undefined,
    }),
    [searchParams]
  )

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (filters.search) n++
    if (filters.type !== 'all') n++
    if (filters.status !== 'all') n++
    if (filters.dateRange !== 'all') n++
    if (filters.scanCountMin != null || filters.scanCountMax != null) n++
    if (filters.hasLogo) n++
    if (filters.hasSticker) n++
    return n
  }, [filters])

  // ─── UI-only state (not persisted in URL) ──────────────────────────────────
  const [showFilters, setShowFilters] = useState(false)
  const [showFolders, setShowFolders] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [folderLoading, setFolderLoading] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<FolderEntity | null>(null)
  const [folderModalQRIds, setFolderModalQRIds] = useState<string[] | null>(null)
  const [showChangeTypeModal, setShowChangeTypeModal] = useState(false)
  const [showChangeOwnerModal, setShowChangeOwnerModal] = useState(false)

  // Load view mode from localStorage
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

  // ─── Handlers that write to URL ────────────────────────────────────────────

  const setPage = useCallback(
    (p: number) => {
      updateUrl({ page: p === 1 ? null : String(p) })
    },
    [updateUrl]
  )

  const handleSearch = useCallback(
    (query: string) => {
      updateUrl({ q: query || null, page: null })
    },
    [updateUrl]
  )

  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      updateUrl({ sort: newSort === 'date-desc' ? null : newSort, page: null })
    },
    [updateUrl]
  )

  const handleFiltersChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      updateUrl({
        q: newFilters.search !== undefined ? newFilters.search || null : null,
        type:
          newFilters.type !== undefined
            ? newFilters.type === 'all'
              ? null
              : newFilters.type
            : searchParams.get('type'),
        status:
          newFilters.status !== undefined
            ? newFilters.status === 'all'
              ? null
              : newFilters.status
            : searchParams.get('status'),
        dateRange:
          newFilters.dateRange !== undefined
            ? newFilters.dateRange === 'all'
              ? null
              : (newFilters.dateRange as string)
            : searchParams.get('dateRange'),
        dateFrom: (newFilters.dateFrom !== undefined
          ? newFilters.dateFrom
            ? newFilters.dateFrom.toISOString().split('T')[0]
            : null
          : (searchParams.get('dateFrom') ?? null)) as string | null,
        dateTo: (newFilters.dateTo !== undefined
          ? newFilters.dateTo
            ? newFilters.dateTo.toISOString().split('T')[0]
            : null
          : (searchParams.get('dateTo') ?? null)) as string | null,
        scansMin: (newFilters.scanCountMin != null
          ? String(newFilters.scanCountMin)
          : newFilters.scanCountMin === undefined
            ? searchParams.get('scansMin')
            : null) as string | null,
        scansMax: (newFilters.scanCountMax != null
          ? String(newFilters.scanCountMax)
          : newFilters.scanCountMax === undefined
            ? searchParams.get('scansMax')
            : null) as string | null,
        hasLogo: (newFilters.hasLogo
          ? 'true'
          : newFilters.hasLogo === undefined
            ? searchParams.get('hasLogo')
            : null) as string | null,
        hasSticker: (newFilters.hasSticker
          ? 'true'
          : newFilters.hasSticker === undefined
            ? searchParams.get('hasSticker')
            : null) as string | null,
        page: null, // always reset to page 1 when filters change
      })
    },
    [updateUrl, searchParams]
  )

  const handleResetFilters = useCallback(() => {
    router.replace('?', { scroll: false })
  }, [router])

  // ─── API params ────────────────────────────────────────────────────────────
  const { sortBy: sortField, sortOrder } = useMemo(() => parseSortOption(sortBy), [sortBy])
  const filterParams = useMemo(() => buildApiFilters(filters), [filters])

  const { data, isLoading, isFetching, error, refetch } = useQRCodes({
    page: urlPage,
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

  // Subscription quota check for "Create QR Code" button
  const {
    canCreateQR,
    upgradeReason: quotaUpgradeReason,
    usage: quotaUsage,
    limits: quotaLimits,
    showUpgradeModal: showQuotaModal,
    setShowUpgradeModal: setShowQuotaModal,
  } = useSubscriptionLimits()

  // Scroll to top of main content when page changes
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const main = document.getElementById('main-content')
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [urlPage])

  const plan = subscription?.plan?.name || currentUser?.plan?.name || 'free'
  const qrCodesUsed = data?.pagination?.total || 0
  const qrCodesLimit = subscription?.plan?.qr_codes_limit ?? currentUser?.plan?.qr_codes_limit ?? 10
  const isOnTrial = plan === 'trial' || subscription?.on_trial === true
  const trialEndsAt = subscription?.trial_ends_at || ''

  const qrcodes = data?.data || []
  const hasQRCodes = qrcodes.length > 0

  // Folder actions
  /**
   * Purpose: Executes handleCreateFolder functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
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

  /**
   * Purpose: Executes handleDeleteFolder functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleConfirmDeleteFolder = async (
    action: FolderContentAction,
    targetFolderId?: number
  ) => {
    if (!user?.id || !folderToDelete) return
    const folderId = folderToDelete.id
    setFolderLoading(true)
    try {
      await foldersAPI.delete(user.id, folderId, { contentAction: action, targetFolderId })
      if (selectedFolder === String(folderId)) {
        updateUrl({ folder: null, page: null })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all() })
      queryClient.invalidateQueries({
        queryKey: queryKeys.qrcodes.list({} as Record<string, unknown>),
      })
      toast.success(
        action === 'delete_all'
          ? t('Folder and its QR codes deleted.')
          : action === 'move'
            ? t('Folder deleted. QR codes moved.')
            : t('Folder deleted. QR codes kept.')
      )
      setFolderToDelete(null)
    } catch (err) {
      console.error('Failed to delete folder:', err)
      toast.error(t('Failed to delete folder. Please try again.'))
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
        label: t('Download'),
        icon: <Download className="w-4 h-4" />,
        onClick: (ids: string[]) => bulkDownloadQRCodes(ids),
      },
      {
        id: 'move',
        label: t('Move to Folder'),
        icon: <FolderInput className="w-4 h-4" />,
        onClick: (ids: string[]) => {
          setFolderModalQRIds(ids)
        },
      },
      {
        id: 'duplicate',
        label: t('Duplicate'),
        icon: <Copy className="w-4 h-4" />,
        onClick: (ids: string[]) => bulkDuplicateQRCodes(ids),
      },
      {
        id: 'activate',
        label: t('Activate'),
        icon: <Eye className="w-4 h-4" />,
        onClick: (ids: string[]) => bulkChangeStatus(ids, 'active'),
      },
      {
        id: 'deactivate',
        label: t('Deactivate'),
        icon: <EyeOff className="w-4 h-4" />,
        onClick: (ids: string[]) => bulkChangeStatus(ids, 'inactive'),
      },
      {
        id: 'archive',
        label: t('Archive'),
        icon: <Archive className="w-4 h-4" />,
        onClick: (ids: string[]) =>
          bulkArchiveQRCodes(ids)
            .then(() => deselectAll())
            .catch(() => {
              toast.error('Operation failed. Please try again.')
            }),
      },
      {
        id: 'change-type',
        label: t('Change Type'),
        icon: <RefreshCw className="w-4 h-4" />,
        onClick: () => setShowChangeTypeModal(true),
      },
      ...(isAdmin
        ? [
            {
              id: 'change-owner',
              label: t('Change Owner'),
              icon: <UserCheck className="w-4 h-4" />,
              onClick: () => setShowChangeOwnerModal(true),
            } as BulkAction,
          ]
        : []),
      {
        id: 'delete',
        label: t('Delete'),
        icon: <TrashIcon className="w-4 h-4" />,
        variant: 'danger' as const,
        requiresConfirmation: true,
        onClick: (ids: string[]) =>
          bulkDeleteQRCodes(ids)
            .then(() => deselectAll())
            .catch(() => {
              toast.error('Operation failed. Please try again.')
            }),
      },
    ],
    [
      bulkDownloadQRCodes,
      bulkDuplicateQRCodes,
      bulkChangeStatus,
      bulkArchiveQRCodes,
      bulkDeleteQRCodes,
      deselectAll,
      isAdmin,
      t,
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
              alert(t('QR code link copied to clipboard!'))
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
          if (confirm(t('Are you sure you want to delete this QR code?'))) {
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
    [router, archiveQRCode, duplicateQRCode, changeStatus, deleteQRCode, downloadQRCode, t]
  )

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageQueryError
          error={error}
          title={t('Failed to load QR codes')}
          onRetry={() => refetch()}
        />
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">{t('QR Codes')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {isGuest ? t('Your guest QR codes') : t('Manage all your QR codes in one place')}
          </p>
          {!isGuest && (
            <div className="mt-3">
              <QRCodeQuotaDisplay used={qrCodesUsed} total={qrCodesLimit} plan={plan} />
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          {!isGuest && (
            <>
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
                {activeFilterCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <BulkCreateButton
                onClick={() => {
                  router.push('/qrcodes/bulk-create')
                }}
              />
            </>
          )}
          <button
            onClick={() => {
              if (!canCreateQR) {
                setShowQuotaModal(true)
              } else {
                router.push(
                  selectedFolder ? `/qrcodes/new?folder_id=${selectedFolder}` : '/qrcodes/new'
                )
              }
            }}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('Create QR Code')}
          </button>
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
                <h3 className="font-semibold text-gray-900">{t('Folders')}</h3>
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
                  updateUrl({ folder: null, page: null })
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  selectedFolder === null
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span className="flex-1 text-left">{t('All QR Codes')}</span>
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
                        updateUrl({ folder: String(folder.id), page: null })
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
                        setFolderToDelete(folder)
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                      title={t('Delete folder')}
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
                    placeholder={t('New folder name')}
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
              placeholder={t('Search QR codes...')}
              delay={300}
              minLength={0}
              initialValue={search}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SortDropdown currentSort={sortBy} onSortChange={handleSortChange} />
                {/* T184: Domain filter */}
                {domains.length > 0 && (
                  <select
                    value={selectedDomain}
                    onChange={e => {
                      updateUrl({ domain: e.target.value || null, page: null })
                    }}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="">{t('All Domains')}</option>
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
            <NoQRCodesEmptyState
              onCreate={() =>
                router.push(
                  selectedFolder ? `/qrcodes/new?folder_id=${selectedFolder}` : '/qrcodes/new'
                )
              }
            />
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
                <div className="space-y-2">
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {qrcodes.map(qrcode => (
                    <QRCodeMinimalCard
                      key={qrcode.id}
                      qrcode={qrcode}
                      onSelect={() => router.push(`/qrcodes/${qrcode.id}`)}
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
                currentPage={urlPage}
                totalPages={data.pagination.lastPage}
                pageSize={data.pagination.perPage}
                totalItems={data.pagination.total}
                onPageChange={setPage}
                showPageSize={false}
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
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
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

      {/* Quota upgrade modal — shown when user tries to create a QR code while over limit */}
      <UpgradeRequiredModal
        open={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        message={quotaUpgradeReason}
        currentUsage={quotaUsage.totalQRCodes}
        planLimit={quotaLimits.maxQRCodes}
      />

      {/* Bulk Change Type Modal */}
      <BulkChangeTypeModal
        open={showChangeTypeModal}
        onClose={() => setShowChangeTypeModal(false)}
        selectedIds={selectedIds}
        onComplete={() => {
          deselectAll()
          queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })
        }}
      />

      {/* Bulk Change Owner Modal (admin only) */}
      <BulkChangeOwnerModal
        open={showChangeOwnerModal}
        onClose={() => setShowChangeOwnerModal(false)}
        selectedIds={selectedIds}
        onComplete={() => {
          deselectAll()
          queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })
        }}
      />

      {/* Folder deletion flow — choose what happens to the QR codes inside */}
      <DeleteFolderDialog
        isOpen={!!folderToDelete}
        folder={folderToDelete}
        folders={foldersData || []}
        loading={folderLoading}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handleConfirmDeleteFolder}
      />
    </div>
  )
}
