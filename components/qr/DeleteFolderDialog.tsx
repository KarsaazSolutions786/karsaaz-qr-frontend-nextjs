'use client'

import { useEffect, useState } from 'react'
import { FolderX, Trash2, FolderInput, FolderMinus } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { Folder } from '@/lib/api/endpoints/folders'
import type { FolderContentAction } from '@/lib/api/endpoints/folders'

interface DeleteFolderDialogProps {
  isOpen: boolean
  /** The folder being deleted (needs id, name, qrcode_count). */
  folder: Pick<Folder, 'id' | 'name' | 'qrcode_count'> | null
  /** All of the user's folders — used to populate the "move to" picker (this folder is filtered out). */
  folders: Folder[]
  loading?: boolean
  onClose: () => void
  onConfirm: (action: FolderContentAction, targetFolderId?: number) => void
}

/**
 * Folder-deletion flow. When a folder still contains QR codes, the user must
 * choose what happens to them: move to another folder, keep them (unassign),
 * or delete them along with the folder. Empty folders delete with a simple confirm.
 *
 * Owner/Author: Syed Ashhad
 * Created/Updated: June 2026
 */
export function DeleteFolderDialog({
  isOpen,
  folder,
  folders,
  loading = false,
  onClose,
  onConfirm,
}: DeleteFolderDialogProps) {
  const { t } = useTranslation()
  const count = folder?.qrcode_count ?? 0
  const hasItems = count > 0

  const otherFolders = folders.filter(f => f.id !== folder?.id)

  // Default to the safe, non-destructive option: keep the QR codes (unassign).
  const [action, setAction] = useState<FolderContentAction>('unassign')
  const [targetFolderId, setTargetFolderId] = useState<number | ''>('')

  useEffect(() => {
    if (isOpen) {
      setAction('unassign')
      setTargetFolderId(otherFolders[0]?.id ?? '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, folder?.id])

  if (!isOpen || !folder) return null

  const moveDisabled = otherFolders.length === 0
  const confirmDisabled = loading || (action === 'move' && (moveDisabled || targetFolderId === ''))
  const isDestructive = action === 'delete_all'

  const handleConfirm = () => {
    if (confirmDisabled) return
    onConfirm(action, action === 'move' ? Number(targetFolderId) : undefined)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 pb-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isDestructive ? 'bg-red-100' : 'bg-amber-100'
            }`}
          >
            <FolderX className={`h-6 w-6 ${isDestructive ? 'text-red-600' : 'text-amber-600'}`} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t('Delete Folder')}</h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium">&ldquo;{folder.name}&rdquo;</span>
            </p>
          </div>
        </div>

        <div className="px-6 pb-2">
          {!hasItems ? (
            <p className="text-sm text-gray-700">
              {t('This folder is empty. Are you sure you want to delete it?')}
            </p>
          ) : (
            <>
              <p className="mb-3 text-sm text-gray-700">
                {t('This folder contains')} <span className="font-semibold">{count}</span>{' '}
                {count === 1 ? t('QR code') : t('QR codes')}. {t('What should happen to them?')}
              </p>

              <div className="space-y-2">
                {/* Move to another folder */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    action === 'move'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${moveDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <input
                    type="radio"
                    name="folder-delete-action"
                    className="mt-1"
                    checked={action === 'move'}
                    disabled={moveDisabled}
                    onChange={() => setAction('move')}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <FolderInput className="h-4 w-4 text-primary-600" />
                      {t('Move QR codes to another folder')}
                    </div>
                    {moveDisabled ? (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {t('No other folders available')}
                      </p>
                    ) : (
                      action === 'move' && (
                        <select
                          value={targetFolderId}
                          onChange={e => setTargetFolderId(Number(e.target.value))}
                          className="mt-2 w-full rounded-md border border-gray-300 pl-2 pr-10 py-1.5 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem_1.25rem] focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          {otherFolders.map(f => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      )
                    )}
                  </div>
                </label>

                {/* Unassign (keep QR codes) — default */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    action === 'unassign'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="folder-delete-action"
                    className="mt-1"
                    checked={action === 'unassign'}
                    onChange={() => setAction('unassign')}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <FolderMinus className="h-4 w-4 text-gray-600" />
                      {t('Keep QR codes')}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {t('Remove them from this folder but keep them in your account.')}
                    </p>
                  </div>
                </label>

                {/* Delete folder + content */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    action === 'delete_all'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="folder-delete-action"
                    className="mt-1"
                    checked={action === 'delete_all'}
                    onChange={() => setAction('delete_all')}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                      <Trash2 className="h-4 w-4 text-red-600" />
                      {t('Delete the folder and its QR codes')}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {t('The QR codes will be moved to trash (recoverable).')}
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {t('Cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirmDisabled}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] hover:brightness-105'
            }`}
          >
            {loading
              ? t('Deleting...')
              : isDestructive
                ? t('Delete folder & QR codes')
                : t('Delete Folder')}
          </button>
        </div>
      </div>
    </div>
  )
}
