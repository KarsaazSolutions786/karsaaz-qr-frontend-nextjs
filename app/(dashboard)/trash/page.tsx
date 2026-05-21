'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Trash2, RotateCcw, Settings, AlertTriangle, Clock } from 'lucide-react'
import {
  useTrashList,
  useTrashSettings,
  useRestoreQRCode,
  useDestroyTrashedQRCode,
  useRestoreManyQRCodes,
  useDestroyManyTrashedQRCodes,
  useEmptyTrash,
} from '@/lib/hooks/queries/useTrash'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { useMultiSelect } from '@/lib/hooks/useMultiSelect'
import { MultiSelectToolbar, type BulkAction } from '@/components/qr/MultiSelectToolbar'
import { QRCodeCardSkeleton } from '@/components/common/Skeleton'
import { NoSearchResultsEmptyState } from '@/components/common/EmptyState'
import { SortDropdown, type SortOption } from '@/components/qr/SortDropdown'
import { ViewModeToggle } from '@/components/qr/ViewModeToggle'
import { Pagination } from '@/components/common/Pagination'
import { QRCodeCard } from '@/components/features/qrcodes/QRCodeCard'
import { QRCodeMinimalCard } from '@/components/qr/QRCodeMinimalCard'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'

/**
 * Purpose: Executes TrashPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: May 2026
 */
export default function TrashPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('date-desc')
  const [confirmEmpty, setConfirmEmpty] = useState(false)

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'minimal'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('qr-list-view-mode') as 'grid' | 'list' | 'minimal') || 'grid'
    }
    return 'grid'
  })

  /**
   * Purpose: Executes handleViewModeChange functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */
  const handleViewModeChange = (mode: 'grid' | 'list' | 'minimal') => {
    setViewMode(mode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('qr-list-view-mode', mode)
    }
  }

  const sortParam = useMemo(() => {
    const map: Record<SortOption, string> = {
      'date-desc': 'deleted_at',
      'date-asc': 'deleted_at',
      'name-asc': 'name',
      'name-desc': 'name',
      'scans-desc': 'scans',
      'scans-asc': 'scans',
    }
    return map[sortBy] || 'deleted_at'
  }, [sortBy])

  const { data, isLoading, error } = useTrashList({
    search: search || undefined,
    page,
    per_page: 24,
  })

  const { data: settings } = useTrashSettings()

  const qrcodes = data?.data || []
  const hasQRCodes = qrcodes.length > 0

  const { selectedItems, selectedIds, deselectAll, toggleItem } = useMultiSelect(qrcodes)

  const restoreOne = useRestoreQRCode()
  const destroyOne = useDestroyTrashedQRCode()
  const restoreMany = useRestoreManyQRCodes()
  const destroyMany = useDestroyManyTrashedQRCodes()
  const emptyTrash = useEmptyTrash()

  const bulkActions: BulkAction[] = useMemo(
    () => [
      {
        id: 'restore',
        label: t('Restore'),
        icon: <RotateCcw className="w-4 h-4" />,
        onClick: async (ids: string[]) => {
          await restoreMany.mutateAsync(ids)
          deselectAll()
          toast.success(t('QR codes restored successfully'))
        },
      },
      {
        id: 'delete-forever',
        label: t('Delete Forever'),
        icon: <Trash2 className="w-4 h-4" />,
        variant: 'danger' as const,
        requiresConfirmation: true,
        onClick: async (ids: string[]) => {
          await destroyMany.mutateAsync(ids)
          deselectAll()
          toast.success(t('QR codes permanently deleted'))
        },
      },
    ],
    [restoreMany, destroyMany, deselectAll, t]
  )

  /**
   * Purpose: Executes handleRestore functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */
  const handleRestore = async (id: string) => {
    await restoreOne.mutateAsync(id)
    toast.success(t('QR code restored'))
  }

  /**
   * Purpose: Executes handleDestroyForever functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */
  const handleDestroyForever = async (id: string) => {
    if (!confirm(t('Permanently delete this QR code? This cannot be undone.'))) return
    await destroyOne.mutateAsync(id)
    toast.success(t('QR code permanently deleted'))
  }

  /**
   * Purpose: Executes handleEmptyTrash functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */
  const handleEmptyTrash = async () => {
    if (!confirmEmpty) {
      setConfirmEmpty(true)
      setTimeout(() => setConfirmEmpty(false), 5000)
      return
    }
    await emptyTrash.mutateAsync()
    setConfirmEmpty(false)
    toast.success(t('Trash emptied'))
  }

  /**
   * Purpose: Executes handleSearch functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: May 2026
   */
  const handleSearch = (query: string) => {
    setSearch(query)
    setPage(1)
  }

  const autoDeleteLabel = settings?.trash_auto_delete_days
    ? settings.trash_auto_delete_days === 7
      ? t('7 days')
      : settings.trash_auto_delete_days === 30
      ? t('30 days')
      : `${settings.trash_auto_delete_days} ${t('days')}`
    : null

  if (error) {
    console.error('Trash fetch error:', error)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Trash2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('Trash')}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {data?.trash_count !== undefined
                  ? `${data.trash_count} ${t('item(s) in trash')}`
                  : t('Deleted QR codes that can be restored or permanently deleted')}
                {data?.trash_limit
                  ? ` · ${t('Limit')}: ${data.trash_limit}`
                  : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Link
            href="/trash/settings"
            className="inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            {t('Settings')}
          </Link>

          {hasQRCodes && (
            <button
              onClick={handleEmptyTrash}
              disabled={emptyTrash.isPending}
              className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none disabled:opacity-50 transition-colors ${
                confirmEmpty
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {emptyTrash.isPending
                ? t('Emptying...')
                : confirmEmpty
                ? t('Click again to confirm')
                : t('Empty Trash')}
            </button>
          )}
        </div>
      </div>

      {/* Auto-delete info banner */}
      {autoDeleteLabel && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              {t('Items in trash are automatically permanently deleted after')} <strong>{autoDeleteLabel}</strong>.{' '}
              <Link href="/trash/settings" className="underline hover:text-amber-900">
                {t('Change settings')}
              </Link>
            </p>
          </div>
        </div>
      )}

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

      {/* Search + Sort + View */}
      <div className="mt-8 mb-6 space-y-4">
        <DebouncedSearch
          onSearch={handleSearch}
          placeholder={t('Search trash...')}
          delay={300}
          minLength={0}
        />
        <div className="flex items-center justify-between">
          <SortDropdown currentSort={sortBy} onSortChange={setSortBy} />
          <ViewModeToggle currentMode={viewMode} onModeChange={handleViewModeChange} />
        </div>
      </div>

      {/* Loading */}
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
          <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('Trash is empty')}</h3>
          <p className="text-gray-500 mb-6">
            {t('When you delete QR codes, they will appear here so you can restore or permanently delete them.')}
          </p>
          <Link
            href="/qrcodes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t('View Active QR Codes')}
          </Link>
        </div>
      )}

      {!isLoading && !hasQRCodes && search && <NoSearchResultsEmptyState query={search} />}

      {/* QR Codes */}
      {!isLoading && hasQRCodes && (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrcodes.map(qrcode => (
                <div key={qrcode.id} className="relative group">
                  <div className="opacity-80 hover:opacity-100 transition-opacity">
                    <QRCodeCard qrcode={qrcode} />
                  </div>
                  {/* Trash action overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 bg-gradient-to-t from-white/90 to-transparent flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                    <button
                      onClick={() => handleRestore(qrcode.id)}
                      disabled={restoreOne.isPending}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {t('Restore')}
                    </button>
                    <button
                      onClick={() => handleDestroyForever(qrcode.id)}
                      disabled={destroyOne.isPending}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      {t('Delete Forever')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-2">
              {qrcodes.map(qrcode => (
                <div
                  key={qrcode.id}
                  className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedItems.some(i => i.id === qrcode.id)}
                      onChange={() => toggleItem(qrcode.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {qrcode.filePath && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrcode.filePath}
                        alt={qrcode.name}
                        className="w-10 h-10 rounded object-contain border border-gray-200"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{qrcode.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{qrcode.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleRestore(qrcode.id)}
                      disabled={restoreOne.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {t('Restore')}
                    </button>
                    <button
                      onClick={() => handleDestroyForever(qrcode.id)}
                      disabled={destroyOne.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      {t('Delete Forever')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Minimal View */}
          {viewMode === 'minimal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {qrcodes.map(qrcode => (
                <div key={qrcode.id} className="relative group">
                  <QRCodeMinimalCard
                    qrcode={qrcode}
                    onSelect={() => {}}
                  />
                  <div className="mt-2 flex gap-1.5">
                    <button
                      onClick={() => handleRestore(qrcode.id)}
                      disabled={restoreOne.isPending}
                      className="flex-1 py-1 bg-green-600 text-white text-xs font-semibold rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {t('Restore')}
                    </button>
                    <button
                      onClick={() => handleDestroyForever(qrcode.id)}
                      disabled={destroyOne.isPending}
                      className="flex-1 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {t('Delete')}
                    </button>
                  </div>
                </div>
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
  )
}
