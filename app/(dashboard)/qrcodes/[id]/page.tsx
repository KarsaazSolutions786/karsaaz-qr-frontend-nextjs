'use client'

import { useQRCode } from '@/lib/hooks/queries/useQRCode'
import { useQRCodeStats } from '@/lib/hooks/queries/useQRCodeStats'
import { useDeleteQRCode } from '@/lib/hooks/mutations/useDeleteQRCode'
import { useQRActions } from '@/hooks/useQRActions'
import { QRCodePreview } from '@/components/features/qrcodes/QRCodePreview'
import { DeleteQRCodeDialog } from '@/components/features/qrcodes/DeleteQRCodeDialog'
import { TypeConversionModal } from '@/components/qr/TypeConversionModal'
import { DuplicateModal } from '@/components/qr/DuplicateModal'
import { TransferOwnershipModal } from '@/components/qr/TransferOwnershipModal'
import { ArchiveModal } from '@/components/qr/ArchiveModal'
import { PINProtectionModal } from '@/components/qr/PINProtectionModal'
import { formatDate } from '@/lib/utils/format'
import Link from 'next/link'
import { useState } from 'react'
import {
  DocumentDuplicateIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ArchiveBoxIcon,
  LockClosedIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default function QRCodeDetailPage({ params }: { params: { id: string } }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showTypeConversion, setShowTypeConversion] = useState(false)
  const [showDuplicate, setShowDuplicate] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [showPINProtection, setShowPINProtection] = useState(false)
  
  const { data: qrcode, isLoading } = useQRCode(params.id)
  const { data: stats } = useQRCodeStats(params.id)
  const deleteMutation = useDeleteQRCode()
  const { duplicateQRCode, archiveQRCode, transferQRCode, convertQRType, downloadQRCode } = useQRActions()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(params.id)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDuplicate = async (options: { count: number; includeDesign: boolean; includeSettings: boolean; prefix: string }) => {
    if (qrcode) {
      await duplicateQRCode(qrcode.id, options)
      setShowDuplicate(false)
    }
  }

  const handleArchive = async (reason?: string) => {
    if (qrcode) {
      await archiveQRCode(qrcode.id, { reason })
      setShowArchive(false)
    }
  }

  const handleTransfer = async (options: { newOwnerId: string; transferDesign: boolean; transferAnalytics: boolean; notifyNewOwner: boolean }) => {
    if (qrcode) {
      await transferQRCode(qrcode.id, options)
      setShowTransfer(false)
    }
  }

  const handleConvertType = async (newType: string) => {
    if (qrcode) {
      await convertQRType(qrcode.id, newType, {})
      setShowTypeConversion(false)
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/qrcodes"
            className="mb-2 inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to QR Codes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{qrcode.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Created {formatDate(qrcode.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/qrcodes/${qrcode.id}/analytics`}
            className="inline-flex items-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ChartBarIcon className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            href={`/qrcodes/${qrcode.id}/edit`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* QR Code Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">QR Code Preview</h2>
            <div className="flex justify-center mb-6">
              <QRCodePreview qrcode={qrcode} size={280} />
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-2">
              <button
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                onClick={() => qrcode && downloadQRCode(qrcode.id, 'png', qrcode.name)}
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Download QR Code
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowDuplicate(true)}
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                  Duplicate
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowTypeConversion(true)}
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Convert
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowPINProtection(true)}
                >
                  <LockClosedIcon className="h-4 w-4" />
                  PIN
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowTransfer(true)}
                >
                  <UserGroupIcon className="h-4 w-4" />
                  Transfer
                </button>
              </div>
              <button
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-orange-300 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50"
                onClick={() => setShowArchive(true)}
              >
                <ArchiveBoxIcon className="h-4 w-4" />
                Archive
              </button>
            </div>
          </div>
        </div>

        {/* Details and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-medium text-gray-500">Total Scans</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.total_scans ?? qrcode.scans}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.scans_this_month ?? '—'}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-medium text-gray-500">Today</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.scans_today ?? '—'}</p>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{qrcode.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    qrcode.status === 'archived' ? 'bg-orange-100 text-orange-800' :
                    qrcode.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {(qrcode.status || 'active').charAt(0).toUpperCase() + (qrcode.status || 'active').slice(1)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(qrcode.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(qrcode.updatedAt)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Folder</dt>
                <dd className="mt-1 text-sm text-gray-900">Uncategorized</dd>
              </div>
            </dl>
          </div>

          {/* QR Code Data */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">QR Code Data</h2>
            <pre className="overflow-auto rounded bg-gray-50 p-4 text-xs font-mono">
              {JSON.stringify(qrcode.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteQRCodeDialog
        qrcode={qrcode}
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
      
      {qrcode && (
        <>
          <TypeConversionModal
            qrCodeId={qrcode.id}
            currentType={qrcode.type || 'url'}
            open={showTypeConversion}
            onClose={() => setShowTypeConversion(false)}
            onConvert={handleConvertType}
          />
          
          <DuplicateModal
            isOpen={showDuplicate}
            onClose={() => setShowDuplicate(false)}
            qrCodeName={qrcode.name || 'QR Code'}
            onDuplicate={handleDuplicate}
          />
          
          <TransferOwnershipModal
            isOpen={showTransfer}
            onClose={() => setShowTransfer(false)}
            qrCodeName={qrcode.name || 'QR Code'}
            currentOwner={qrcode.userId?.toString() || ''}
            onTransfer={handleTransfer}
          />
          
          <ArchiveModal
            isOpen={showArchive}
            onClose={() => setShowArchive(false)}
            mode="archive"
            qrCodeNames={[qrcode.name || 'QR Code']}
            onArchive={handleArchive}
          />
          
          <PINProtectionModal
            qrCodeId={qrcode.id}
            hasPIN={false}
            open={showPINProtection}
            onClose={() => setShowPINProtection(false)}
            onSuccess={() => setShowPINProtection(false)}
          />
        </>
      )}
    </div>
  )
}
