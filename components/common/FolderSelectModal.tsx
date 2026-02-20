'use client'

import { useState, useEffect } from 'react'
import { foldersAPI } from '@/lib/api/endpoints/folders'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { Folder } from '@/types/entities/folder'

interface FolderSelectModalProps {
  /** Currently selected folder IDs */
  selectedIds: string[]
  /** Whether to allow multi-select */
  multi?: boolean
  /** Callback with selected folder IDs */
  onConfirm: (folderIds: string[]) => void
  /** Close modal */
  onClose: () => void
}

export function FolderSelectModal({
  selectedIds,
  multi = true,
  onConfirm,
  onClose,
}: FolderSelectModalProps) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedIds))
  const [loading, setLoading] = useState(true)
  const [newFolderName, setNewFolderName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    foldersAPI
      .list()
      .then((data) => setFolders(Array.isArray(data) ? data : []))
      .catch(() => setFolders([]))
      .finally(() => setLoading(false))
  }, [])

  function toggleFolder(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (multi) {
        next.has(id) ? next.delete(id) : next.add(id)
      } else {
        next.clear()
        next.add(id)
      }
      return next
    })
  }

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return
    setCreating(true)
    try {
      const folder = await foldersAPI.create({ name: newFolderName.trim() })
      setFolders((prev) => [...prev, folder])
      setSelected((prev) => new Set(prev).add(String(folder.id)))
      setNewFolderName('')
    } catch {
      // Failed
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {multi ? 'Select Folders' : 'Select Folder'}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Folder List */}
        <div className="px-6 py-4 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-purple-600" />
              Loading folders...
            </div>
          ) : folders.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No folders yet. Create one below.</p>
          ) : (
            <div className="space-y-1">
              {folders.map((folder) => {
                const fId = String(folder.id)
                const isSelected = selected.has(fId)
                return (
                  <label
                    key={fId}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-50 border border-purple-200' : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <input
                      type={multi ? 'checkbox' : 'radio'}
                      name="folder"
                      checked={isSelected}
                      onChange={() => toggleFolder(fId)}
                      className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{folder.name}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>

        {/* Add Folder */}
        <div className="px-6 py-3 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              placeholder="New folder name..."
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500"
            />
            <button
              onClick={handleCreateFolder}
              disabled={creating || !newFolderName.trim()}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(Array.from(selected))}
            disabled={selected.size === 0}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Confirm ({selected.size})
          </button>
        </div>
      </div>
    </div>
  )
}
