'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import apiClient from '@/lib/api/client'

type OperationType = 'create' | 'update' | 'delete'

interface PreviewRow {
  [key: string]: string
}

export default function NewBulkOperationPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [operationType, setOperationType] = useState<OperationType>('create')
  const [file, setFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([])
  const [executing, setExecuting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter((l) => l.trim())
    if (lines.length < 2) return { headers: [], rows: [] }
    const hdrs = lines[0]!.split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
    const rows = lines.slice(1, 6).map((line) => {
      const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
      const row: PreviewRow = {}
      hdrs.forEach((h, i) => { row[h] = values[i] || '' })
      return row
    })
    return { headers: hdrs, rows }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setError('')

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      const { headers: h, rows } = parseCSV(text)
      setHeaders(h)
      setPreviewRows(rows)
    }
    reader.readAsText(f)
  }

  const handleExecute = async () => {
    if (!file) return
    setExecuting(true)
    setError('')
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('operation_type', operationType)

      const res = await apiClient.post('/bulk-operations/import-url-qrcodes/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const data = res.data as any
      const instanceId = data?.data?.id ?? data?.id

      // Poll for progress
      if (instanceId) {
        const poll = setInterval(async () => {
          try {
            const statusRes = await apiClient.get(`/bulk-operations/import-url-qrcodes/instances`)
            const instances = statusRes.data as any
            const list = Array.isArray(instances.data) ? instances.data : Array.isArray(instances) ? instances : []
            const inst = list.find((i: any) => i.id === instanceId)
            if (inst) {
              const pct = inst.total > 0 ? Math.round((inst.progress / inst.total) * 100) : 0
              setProgress(pct)
              if (inst.status === 'completed' || inst.status === 'failed') {
                clearInterval(poll)
                setExecuting(false)
                router.push(`/bulk-operations/${instanceId}`)
              }
            }
          } catch {
            clearInterval(poll)
            setExecuting(false)
          }
        }, 2000)
      } else {
        setProgress(100)
        setExecuting(false)
        router.push('/bulk-operations')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to execute bulk operation.')
      setExecuting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Bulk Operation</h1>
          <p className="mt-2 text-sm text-gray-600">Upload a CSV file and execute a bulk operation</p>
        </div>
        <Link href="/bulk-operations" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="space-y-6">
        {/* Operation Type */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700">Operation Type <span className="text-red-500">*</span></label>
          <select
            value={operationType}
            onChange={(e) => setOperationType(e.target.value as OperationType)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:max-w-xs sm:text-sm"
          >
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        {/* CSV Upload */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700">Upload CSV File <span className="text-red-500">*</span></label>
          <div className="mt-2 flex items-center gap-4">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {file && <p className="mt-2 text-xs text-gray-500">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
        </div>

        {/* Preview Table */}
        {previewRows.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-medium text-gray-700">Preview (first {previewRows.length} rows)</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {previewRows.map((row, idx) => (
                    <tr key={idx}>
                      {headers.map((h) => (
                        <td key={h} className="whitespace-nowrap px-3 py-2 text-gray-700">{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {executing && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Processing…</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Execute Button */}
        <div className="flex justify-end">
          <button
            onClick={handleExecute}
            disabled={!file || executing}
            className="rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {executing ? 'Executing…' : 'Execute'}
          </button>
        </div>
      </div>
    </div>
  )
}
