'use client'

import Link from 'next/link'
import { QRCode } from '@/types/entities/qrcode'
import { formatDate } from '@/lib/utils/format'

interface QRCodeCardProps {
  qrcode: QRCode
}

export function QRCodeCard({ qrcode }: QRCodeCardProps) {
  return (
    <Link
      href={`/qrcodes/${qrcode.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{qrcode.name}</h3>
          <p className="mt-1 text-sm text-gray-500">Type: {qrcode.type}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
          {qrcode.type}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{qrcode.scans} scans</span>
        <span>{formatDate(qrcode.createdAt)}</span>
      </div>
    </Link>
  )
}
