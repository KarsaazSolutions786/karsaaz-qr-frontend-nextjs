'use client'

import { useQRCode } from '@/lib/hooks/queries/useQRCode'
import { useDeleteQRCode } from '@/lib/hooks/mutations/useDeleteQRCode'
import { QRCodePreview } from '@/components/features/qrcodes/QRCodePreview'
import { DeleteQRCodeDialog } from '@/components/features/qrcodes/DeleteQRCodeDialog'
import { formatDate } from '@/lib/utils/format'
import Link from 'next/link'
import { useState } from 'react'

export default function QRCodeDetailPage({ params }: { params: { id: string } }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { data: qrcode, isLoading } = useQRCode(params.id)
  const deleteMutation = useDeleteQRCode()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(params.id)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!qrcode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">QR Code Not Found</h2>
          <Link href="/qrcodes" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
            Back to QR Codes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{qrcode.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Created {formatDate(qrcode.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/qrcodes/${qrcode.id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">QR Code Preview</h2>
          <div className="flex justify-center">
            <QRCodePreview qrcode={qrcode} size={300} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{qrcode.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Scans</dt>
                <dd className="mt-1 text-sm text-gray-900">{qrcode.scans}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(qrcode.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Data</h2>
            <pre className="overflow-auto rounded bg-gray-50 p-4 text-xs">
              {JSON.stringify(qrcode.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <DeleteQRCodeDialog
        qrcode={qrcode}
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}
