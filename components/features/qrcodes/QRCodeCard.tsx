'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { QRCode } from '@/types/entities/qrcode'
import { formatDate } from '@/lib/utils/format'
import { MoreVertical, Copy, Archive, Trash2, Download, Eye, Edit, BarChart3 } from 'lucide-react'
import { QRPreviewImage } from '@/components/qr/QRPreviewImage'

interface QRCodeCardProps {
  qrcode: QRCode
  onAction?: (action: string, id: string) => void
}

const TYPE_LABELS: Record<string, string> = {
  url: 'URL',
  vcard: 'vCard',
  wifi: 'WiFi',
  text: 'Text',
  email: 'Email',
  sms: 'SMS',
  phone: 'Phone',
  location: 'Location',
  calendar: 'Calendar',
  'app-store': 'App Store',
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  inactive: { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
  archived: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
}

export function QRCodeCard({ qrcode, onAction }: QRCodeCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const status = qrcode.status || 'active'
  const statusStyle = (STATUS_STYLES[status] ?? STATUS_STYLES.active) as {
    bg: string
    text: string
    dot: string
  }

  const handleAction = (action: string) => {
    setMenuOpen(false)
    onAction?.(action, qrcode.id)
  }

  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:border-gray-300">
      {/* QR Preview */}
      <Link href={`/qrcodes/${qrcode.id}`} className="block p-4 pb-3">
        <div className="flex justify-center mb-3">
          <QRPreviewImage
            svgUrl={qrcode.svgUrl}
            fallbackUrl={qrcode.screenshotUrl}
            alt={qrcode.name}
            size={120}
          />
        </div>

        {/* Name + Type */}
        <h3 className="text-sm font-semibold text-gray-900 truncate">{qrcode.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
            {TYPE_LABELS[qrcode.type] || qrcode.type}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text}`}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </Link>

      {/* Footer Row */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            {(qrcode.scans || 0).toLocaleString()}
          </span>
          <span>{formatDate(qrcode.createdAt)}</span>
        </div>

        {/* Action Menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-lg border border-gray-200 shadow-lg z-50 py-1">
              <button
                onClick={() => handleAction('view')}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button
                onClick={() => handleAction('edit')}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleAction('duplicate')}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button
                onClick={() => handleAction('download')}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => handleAction('archive')}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50"
              >
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
              <button
                onClick={() => handleAction('delete')}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
