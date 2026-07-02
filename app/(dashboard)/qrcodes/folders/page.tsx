'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Plus, Folder, FolderTree, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useQRCodes } from '@/lib/hooks/queries/useQRCodes'
import { useFolders } from '@/lib/hooks/queries/useFolders'
import { useAuth } from '@/lib/hooks/useAuth'
import { useQRActions } from '@/lib/hooks/useQRActions'
import { foldersAPI } from '@/lib/api/endpoints/folders'
import type { Folder as FolderEntity, FolderContentAction } from '@/lib/api/endpoints/folders'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { useTranslation } from '@/lib/i18n'
import { DebouncedSearch } from '@/components/common/DebouncedSearch'
import { QRCodeCardSkeleton } from '@/components/common/Skeleton'
import { NoSearchResultsEmptyState } from '@/components/common/EmptyState'
import { SortDropdown, type SortOption } from '@/components/qr/SortDropdown'
import { ViewModeToggle } from '@/components/qr/ViewModeToggle'
import { QRCodeCard } from '@/components/features/qrcodes/QRCodeCard'
import { QRCodeDetailedRow } from '@/components/qr/QRCodeDetailedRow'
import { QRCodeMinimalCard } from '@/components/qr/QRCodeMinimalCard'
import { Pagination } from '@/components/common/Pagination'
import { PageQueryError } from '@/components/common/PageQueryError'
import { DeleteFolderDialog } from '@/components/qr/DeleteFolderDialog'
import { parseSortOption } from '@/lib/utils/qr-list-helpers'
import { FolderModal } from '@/components/qr/FolderModal'

const FOLDER_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Gray', value: '#6b7280' },
]

export default function QRCodesFoldersPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const selectedFolderId = searchParams.get('folder')
  const search = searchParams.get('q') ?? ''
  const sortBy = (searchParams.get('sort') || 'date-desc') as SortOption

  const [page, setPageState] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [folderLoading, setFolderLoading] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<FolderEntity | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'minimal'>('grid')

  const { data: folders = [], isLoading: foldersLoading } = useFolders()
  const selectedFolder = folders.find(f => String(f.id) === selectedFolderId) ?? null

  useEffect(() => {
    const stored = localStorage.getItem('qr-list-view-mode')
    if (stored === 'grid' || stored === 'list' || stored === 'minimal') {
      setViewMode(stored)
    }
  }, [])

  useEffect(() => {
    setPageState(1)
  }, [selectedFolderId, search, sortBy])

  const syncQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') params.delete(key)
        else params.set(key, value)
      })
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const selectFolder = useCallback(
    (folderId: number | string) => {
      syncQuery({ folder: String(folderId) })
    },
    [syncQuery]
  )

  const { sortBy: sortField, sortOrder } = useMemo(() => parseSortOption(sortBy), [sortBy])

  const qrListParams = useMemo(
    () => ({
      page,
      perPage: 12,
      search: search || undefined,
      folderId: selectedFolderId || undefined,
      sortBy: sortField,
      sortOrder,
    }),
    [page, search, selectedFolderId, sortField, sortOrder]
  )

  const { data, isLoading, isFetching, error, refetch } = useQRCodes(qrListParams)

  const { archiveQRCode, duplicateQRCode, changeStatus, deleteQRCode, downloadQRCode } =
    useQRActions()

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

  const setPage = useCallback((p: number) => {
    setPageState(Math.max(1, Number(p) || 1))
  }, [])

  const handleViewModeChange = (mode: 'grid' | 'list' | 'minimal') => {
    setViewMode(mode)
    localStorage.setItem('qr-list-view-mode', mode)
  }

  const handleCreateFolder = async (data: { name: string; color?: string }) => {
    if (!data.name.trim() || !user?.id) return
    setFolderLoading(true)
    try {
      const created = await foldersAPI.create(user.id, { folder_name: data.name.trim() })
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all() })
      selectFolder(created.id)
      toast.success(t('Folder created'))
    } catch (err) {
      console.error('Failed to create folder:', err)
      toast.error(t('Failed to create folder. Please try again.'))
    } finally {
      setFolderLoading(false)
    }
  }

  const handleConfirmDeleteFolder = async (
    action: FolderContentAction,
    targetFolderId?: number
  ) => {
    if (!user?.id || !folderToDelete) return
    const folderId = folderToDelete.id
    setFolderLoading(true)
    try {
      await foldersAPI.delete(user.id, folderId, { contentAction: action, targetFolderId })
      if (selectedFolderId === String(folderId)) {
        syncQuery({ folder: null })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.folders.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.qrcodes.all() })
      setFolderToDelete(null)
      toast.success(t('Folder deleted'))
    } catch (err) {
      console.error('Failed to delete folder:', err)
      toast.error(t('Failed to delete folder. Please try again.'))
    } finally {
      setFolderLoading(false)
    }
  }

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
        case 'download':
          downloadQRCode(qrCodeId)
          break
        case 'duplicate':
          duplicateQRCode(qrCodeId)
          break
        case 'archive':
          archiveQRCode(qrCodeId)
          break
        case 'activate':
          changeStatus(qrCodeId, 'active')
          break
        case 'deactivate':
          changeStatus(qrCodeId, 'inactive')
          break
        case 'delete':
          deleteQRCode(qrCodeId)
          break
        default:
          break
      }
    },
    [router, downloadQRCode, duplicateQRCode, archiveQRCode, changeStatus, deleteQRCode]
  )

  if (error) {
    return <PageQueryError error={error} onRetry={() => refetch()} />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <Link
            href="/qrcodes"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('Back to QR Codes')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t('Folders')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('Organize your QR codes into folders')}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('Create Folder')}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <FolderTree className="w-4 h-4" />
                {t('Your Folders')}
              </div>
            </div>
            {foldersLoading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : folders.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                {t('No folders yet. Create one to get started.')}
              </div>
            ) : (
              <ul className="p-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {folders.map(folder => {
                  const isActive = selectedFolderId === String(folder.id)
                  return (
                    <li key={folder.id}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => selectFolder(folder.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            selectFolder(folder.id)
                          }
                        }}
                        className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors mb-1 ${
                          isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Folder className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left font-medium truncate">{folder.name}</span>
                        {folder.qrcode_count > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
                            {folder.qrcode_count}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation()
                            setFolderToDelete(folder)
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity flex-shrink-0"
                          title={t('Delete folder')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {!selectedFolderId ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-20 px-6 text-center">
              <Folder className="w-12 h-12 text-gray-300 mb-4" />
              <h2 className="text-lg font-semibold text-gray-900">{t('Select a folder')}</h2>
              <p className="mt-2 text-sm text-gray-500 max-w-sm">
                {t('Choose a folder from the list to view and manage its QR codes.')}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedFolder?.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {paginationMeta.total} {t('QR codes in this folder')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/qrcodes/new?folder_id=${selectedFolderId}`)}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('Create QR Code')}
                </button>
              </div>

              <div className="mb-6 space-y-4">
                <DebouncedSearch
                  onSearch={q => syncQuery({ q: q || null })}
                  placeholder={t('Search QR codes...')}
                  delay={300}
                  minLength={0}
                  initialValue={search}
                />
                <div className="flex items-center justify-between">
                  <SortDropdown
                    currentSort={sortBy}
                    onSortChange={newSort =>
                      syncQuery({ sort: newSort === 'date-desc' ? null : newSort })
                    }
                  />
                  <ViewModeToggle currentMode={viewMode} onModeChange={handleViewModeChange} />
                </div>
              </div>

              {showListLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <QRCodeCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {!showListLoading && !hasQRCodes && search && (
                <NoSearchResultsEmptyState query={search} />
              )}

              {!showListLoading && !hasQRCodes && !search && (
                <div className="text-center py-16 rounded-lg border border-gray-200 bg-white">
                  <p className="text-gray-500 mb-4">{t('This folder has no QR codes yet.')}</p>
                  <button
                    type="button"
                    onClick={() => router.push(`/qrcodes/new?folder_id=${selectedFolderId}`)}
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('Create QR Code')}
                  </button>
                </div>
              )}

              {!showListLoading && hasQRCodes && (
                <>
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
                  {viewMode === 'list' && (
                    <div className="space-y-2">
                      {qrcodes.map(qrcode => (
                        <QRCodeDetailedRow
                          key={qrcode.id}
                          qrcode={qrcode}
                          isSelected={false}
                          onToggleSelect={() => {}}
                          onAction={action => handleRowAction(action, qrcode.id)}
                        />
                      ))}
                    </div>
                  )}
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
                </>
              )}

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
            </>
          )}
        </main>
      </div>

      <FolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        mode="create"
        colors={FOLDER_COLORS}
        onSave={data => {
          void handleCreateFolder(data)
        }}
      />

      <DeleteFolderDialog
        isOpen={!!folderToDelete}
        folder={folderToDelete}
        folders={folders}
        loading={folderLoading}
        onClose={() => setFolderToDelete(null)}
        onConfirm={handleConfirmDeleteFolder}
      />
    </div>
  )
}
