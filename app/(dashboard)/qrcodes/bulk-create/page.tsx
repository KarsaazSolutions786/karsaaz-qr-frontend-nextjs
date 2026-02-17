'use client'

import { useState } from 'react'
import { useBulkCreateQRCodes } from '@/lib/hooks/mutations/useBulkCreateQRCodes'

export default function BulkCreatePage() {
  const [csvText, setCsvText] = useState('')
  const bulkCreateMutation = useBulkCreateQRCodes()

  const handleBulkCreate = async () => {
    // Parse CSV - simple implementation
    const lines = csvText.split('\n').filter(line => line.trim())
    const qrcodes = lines.slice(1)
      .map(line => {
        const [name, type, url] = line.split(',').map(s => s.trim())
        return {
          name: name || '',
          type: type || 'url',
          data: { url: url || '' },
        }
      })
      .filter(qr => qr.name) // Remove entries without names

    try {
      await bulkCreateMutation.mutateAsync({ qrcodes })
    } catch (error) {
      // Error handled by mutation
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Create QR Codes</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload a CSV file or paste CSV data to create multiple QR codes at once
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">CSV Format</h2>
          <p className="text-sm text-gray-600 mb-4">
            Use the following format (first line is header):
          </p>
          <pre className="rounded bg-gray-50 p-4 text-xs">
{`name,type,url
My Website,url,https://example.com
Company Site,url,https://company.com`}
          </pre>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Paste CSV Data</h2>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={10}
            placeholder="Paste your CSV data here..."
            className="block w-full rounded-md border border-gray-300 px-4 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        {bulkCreateMutation.isError && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {(bulkCreateMutation.error as any)?.message || 'Failed to create QR codes'}
            </p>
          </div>
        )}

        {bulkCreateMutation.isSuccess && bulkCreateMutation.data && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">
              Successfully created {bulkCreateMutation.data.created.length} QR codes!
              {bulkCreateMutation.data.failed.length > 0 && (
                <span className="block mt-2 text-yellow-800">
                  {bulkCreateMutation.data.failed.length} failed
                </span>
              )}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleBulkCreate}
            disabled={!csvText || bulkCreateMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {bulkCreateMutation.isPending ? 'Creating...' : 'Create QR Codes'}
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
