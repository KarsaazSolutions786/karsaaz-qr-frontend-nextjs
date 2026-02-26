'use client'

import { useState, useRef } from 'react'
import apiClient from '@/lib/api/client'
import { useBulkImportInstances, useBulkOperationsMutations } from '@/lib/hooks/queries/useBulkOperations'

interface BulkInstance {
  id: number
  name: string | null
  status: 'running' | 'completed' | 'failed'
  progress: number
  total: number
  created_at: string
}

const statusStyles: Record<string, string> = {
  running: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

export default function BulkOperationsPage() {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // TanStack Query hooks
  const { data: instances = [], isLoading: loading } = useBulkImportInstances() as { data: BulkInstance[]; isLoading: boolean }
  const { createImport, reRunInstance, deleteInstance, deleteAllQRCodes, renameInstance } = useBulkOperationsMutations()

  const uploading = createImport.isPending

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    try {
      await createImport.mutateAsync(file)
      if (fileRef.current) fileRef.current.value = ''
    } catch { /* error */ }
  }

  const handleReRun = async (id: number) => {
    try {
      await reRunInstance.mutateAsync(id)
    } catch { /* error */ }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this bulk operation instance?')) return
    try {
      await deleteInstance.mutateAsync(id)
    } catch { /* error */ }
  }

  const handleDeleteAllQR = async (id: number) => {
    if (!confirm('Delete ALL QR codes from this instance? This cannot be undone.')) return
    try {
      await deleteAllQRCodes.mutateAsync(id)
    } catch { /* error */ }
  }

  const handleExportCsv = (id: number) => {
    window.open(`${apiClient.defaults.baseURL}/bulk-operations/export-csv/${id}`, '_blank')
  }

  const handleSampleCsv = () => {
    window.open(`${apiClient.defaults.baseURL}/bulk-operations/import-url-qrcodes/csv-sample`, '_blank')
  }

  const handleRename = async (id: number) => {
    try {
      await renameInstance.mutateAsync({ id, name: editName })
      setEditingId(null)
    } catch { /* error */ }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Bulk Operations</h1>
      <p className="mt-2 text-sm text-gray-600">Import QR codes in bulk from CSV files.</p>

      {/* Upload Section */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Import URL QR Codes</h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload a CSV file with URLs to create QR codes in bulk.{' '}
          <button onClick={handleSampleCsv} className="text-indigo-600 hover:underline">
            Download sample CSV
          </button>
        </p>
        <div className="mt-4 flex items-center gap-3">
          <input ref={fileRef} type="file" accept=".csv" className="text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100" />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload & Import'}
          </button>
        </div>
      </div>

      {/* Instances List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Operation Instances</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : instances.length === 0 ? (
          <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <h3 className="text-sm font-medium text-gray-900">No bulk operations yet</h3>
            <p className="mt-1 text-sm text-gray-500">Upload a CSV file above to get started.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {instances.map((inst) => (
              <div key={inst.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    {editingId === inst.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="rounded border border-gray-300 px-2 py-1 text-sm"
                          autoFocus
                        />
                        <button onClick={() => handleRename(inst.id)} className="text-sm text-indigo-600">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-sm text-gray-500">Cancel</button>
                      </div>
                    ) : (
                      <h3 className="text-sm font-medium text-gray-900">
                        {inst.name || `Instance #${inst.id}`}
                        <button
                          onClick={() => { setEditingId(inst.id); setEditName(inst.name || '') }}
                          className="ml-2 text-xs text-gray-400 hover:text-gray-600"
                        >
                          ✏️
                        </button>
                      </h3>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Created: {new Date(inst.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[inst.status] || 'bg-gray-100 text-gray-600'}`}>
                    {inst.status}
                  </span>
                </div>

                {/* Progress bar */}
                {inst.total > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{inst.progress} / {inst.total}</span>
                      <span>{Math.round((inst.progress / inst.total) * 100)}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${(inst.progress / inst.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {inst.status !== 'running' && (
                    <button onClick={() => handleReRun(inst.id)} className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">
                      Re-Run
                    </button>
                  )}
                  <button onClick={() => handleExportCsv(inst.id)} className="rounded bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100">
                    Export CSV
                  </button>
                  <button onClick={() => handleDelete(inst.id)} className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100">
                    Delete
                  </button>
                  <button onClick={() => handleDeleteAllQR(inst.id)} className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100">
                    Delete All QR Codes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
