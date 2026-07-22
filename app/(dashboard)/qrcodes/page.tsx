'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Plus, Filter, Trash2 as TrashIcon } from 'lucide-react'
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
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { FolderSelectModal } from '@/components/common/FolderSelectModal'
import { QRDownloadModal } from '@/components/qr/QRDownloadModal'
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
  const pathname = usePathname()
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

  const [page, setPageState] = useState(() => {
    if (typeof window === 'undefined') return 1
    return Math.max(
      1,
      parseInt(new URLSearchParams(window.location.search).get('page') || '1', 10) || 1
    )
  })

  useEffect(() => {
    const onPopState = () => {
      const fromUrl = Math.max(
        1,
        parseInt(new URLSearchParams(window.location.search).get('page') || '1', 10) || 1
      )
      setPageState(fromUrl)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const syncPageToUrl = useCallback(
    (next: number) => {
      const params = new URLSearchParams(window.location.search)
      if (next === 1) params.delete('page')
      else params.set('page', String(next))
      const qs = params.toString()
      const href = qs ? `${pathname}?${qs}` : pathname
      window.history.replaceState(null, '', href)
    },
    [pathname]
  )
  /** Push updated params to the URL without a full navigation */
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      if ('page' in updates && updates.page === null) {
        setPageState(1)
        syncPageToUrl(1)
      }
      const params = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : searchParams.toString()
      )
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === '' || v === 'all' || v === 'date-desc') {
          params.delete(k)
        } else {
          params.set(k, v)
        }
      })
      const qs = params.toString()
      const href = qs ? `${pathname}?${qs}` : pathname
      router.replace(href, { scroll: false })
    },
    [router, searchParams, pathname, syncPageToUrl]
  )

  const search = sp('q')
  const sortBy = sp('sort', 'date-desc') as SortOption

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
    [searchParams, sp]
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
  const [folderModalQRIds, setFolderModalQRIds] = useState<string[] | null>(null)
  const [showChangeTypeModal, setShowChangeTypeModal] = useState(false)
  const [showChangeOwnerModal, setShowChangeOwnerModal] = useState(false)
  const [downloadModalQRIds, setDownloadModalQRIds] = useState<string[]>([])

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'minimal'>(() => {
    if (typeof window === 'undefined') return 'grid'
    const stored = localStorage.getItem('qr-list-view-mode')
    if (stored === 'grid' || stored === 'list' || stored === 'minimal') return stored
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
      const next = Math.max(1, Number(p) || 1)
      setPageState(next)
      syncPageToUrl(next)
    },
    [syncPageToUrl]
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
        q: 'search' in newFilters ? newFilters.search || null : searchParams.get('q'),
        type:
          'type' in newFilters
            ? newFilters.type === 'all'
              ? null
              : (newFilters.type ?? null)
            : searchParams.get('type'),
        status:
          'status' in newFilters
            ? newFilters.status === 'all'
              ? null
              : (newFilters.status ?? null)
            : searchParams.get('status'),
        dateRange:
          'dateRange' in newFilters
            ? newFilters.dateRange === 'all'
              ? null
              : (newFilters.dateRange as string)
            : searchParams.get('dateRange'),
        dateFrom: ('dateFrom' in newFilters
          ? newFilters.dateFrom
            ? newFilters.dateFrom.toISOString().split('T')[0]
            : null
          : searchParams.get('dateFrom')) as string | null,
        dateTo: ('dateTo' in newFilters
          ? newFilters.dateTo
            ? newFilters.dateTo.toISOString().split('T')[0]
            : null
          : searchParams.get('dateTo')) as string | null,
        scansMin: ('scanCountMin' in newFilters
          ? newFilters.scanCountMin != null
            ? String(newFilters.scanCountMin)
            : null
          : searchParams.get('scansMin')) as string | null,
        scansMax: ('scanCountMax' in newFilters
          ? newFilters.scanCountMax != null
            ? String(newFilters.scanCountMax)
            : null
          : searchParams.get('scansMax')) as string | null,
        hasLogo: ('hasLogo' in newFilters
          ? newFilters.hasLogo
            ? 'true'
            : null
          : searchParams.get('hasLogo')) as string | null,
        hasSticker: ('hasSticker' in newFilters
          ? newFilters.hasSticker
            ? 'true'
            : null
          : searchParams.get('hasSticker')) as string | null,
        page: null,
      })
    },
    [updateUrl, searchParams]
  )

  const handleResetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [router, pathname])

  // ─── API params ────────────────────────────────────────────────────────────
  const { sortBy: sortField, sortOrder } = useMemo(() => parseSortOption(sortBy), [sortBy])
  const filterParams = useMemo(() => buildApiFilters(filters), [filters])

  const qrListParams = useMemo(
    () => ({
      page,
      perPage: 12,
      search: search || undefined,
      domainId: selectedDomain || undefined,
      sortBy: sortField,
      sortOrder,
      ...filterParams,
    }),
    [page, search, selectedDomain, sortField, sortOrder, filterParams]
  )

  const { data, isLoading, isFetching, error, refetch } = useQRCodes(qrListParams)

  // Real user/subscription data
  const { user } = useAuth()
  const isAdmin = isSuperAdmin(user)
  const { data: currentUser } = useCurrentUser()
  const { data: subscription } = useSubscription()
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

  // Scroll to top only after the new page data has loaded
  const prevPageRef = useRef(page)
  useEffect(() => {
    if (prevPageRef.current === page) return
    if (data?.pagination?.currentPage !== page) return
    prevPageRef.current = page
    const main = document.getElementById('main-content')
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [page, data?.pagination?.currentPage])

  const plan = subscription?.plan?.name || currentUser?.plan?.name || 'free'
  const qrCodesUsed = data?.pagination?.total || 0
  const qrCodesLimit = subscription?.plan?.qr_codes_limit ?? currentUser?.plan?.qr_codes_limit ?? 10
  const isOnTrial = plan === 'trial' || subscription?.on_trial === true
  const trialEndsAt = subscription?.trial_ends_at || ''

  const paginationMeta = useMemo(() => {
    const total = Math.max(0, Number(data?.pagination?.total) || 0)
    const perPage = Math.max(1, Number(data?.pagination?.perPage) || 12)
    const currentPage = Math.max(1, Number(page) || 1)
    const fromApi = Math.max(1, Number(data?.pagination?.lastPage) || 1)
    const computed = total > 0 ? Math.max(1, Math.ceil(total / perPage)) : 1
    const lastPage = Math.max(fromApi, computed)
    return { currentPage, lastPage, perPage, total }
  }, [page, data?.pagination?.lastPage, data?.pagination?.perPage, data?.pagination?.total])

  const showListLoading = isLoading || (isFetching && (data?.pagination?.currentPage ?? 0) !== page)
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
        label: t('Download'),
        icon: <Download className="w-4 h-4" />,
        onClick: (ids: string[]) => setDownloadModalQRIds(ids),
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
        onClick: (ids: string[]) => {
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
          toast.promise(duplicateQRCode(qrCodeId), {
            loading: t('Duplicating QR code...'),
            success: t('QR code duplicated successfully'),
            error: t('Failed to duplicate QR code'),
          })
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
          setDownloadModalQRIds([qrCodeId])
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
        <div className="mt-4 sm:mt-0 flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {!isGuest && (
            <>
              <button
                type="button"
                onClick={() => router.push('/qrcodes/folders')}
                className="relative z-10 shrink-0 inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FolderInput className="w-4 h-4 mr-2" />
                {t('Folders')}
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="relative z-10 shrink-0 inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                {t('Filters')}
                {activeFilterCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#AF47AF] text-white text-xs font-bold">
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
            type="button"
            onClick={() => {
              if (!canCreateQR) {
                setShowQuotaModal(true)
              } else {
                router.push('/qrcodes/new')
              }
            }}
            className="relative z-10 shrink-0 inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
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

      <div className="mt-8">
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
                  className="rounded-md border border-gray-300 pl-3 pr-10 py-1.5 text-sm shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem] focus:border-primary-500 focus:outline-none focus:ring-primary-500"
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
        {showListLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <QRCodeCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty States */}
        {!showListLoading && !hasQRCodes && !search && (
          <NoQRCodesEmptyState onCreate={() => router.push('/qrcodes/new')} />
        )}

        {!showListLoading && !hasQRCodes && search && <NoSearchResultsEmptyState query={search} />}

        {/* QR Codes List */}
        {!showListLoading && hasQRCodes && (
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
        {paginationMeta.total > paginationMeta.perPage && (
          <div className="mt-8">
            <Pagination
              currentPage={paginationMeta.currentPage}
              totalPages={paginationMeta.lastPage}
              pageSize={paginationMeta.perPage}
              totalItems={paginationMeta.total}
              onPageChange={setPage}
              showPageSize={false}
            />
          </div>
        )}
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
      <QRDownloadModal
        isOpen={downloadModalQRIds.length > 0}
        onClose={() => setDownloadModalQRIds([])}
        qrCodeIds={downloadModalQRIds}
      />
    </div>
  )
}
