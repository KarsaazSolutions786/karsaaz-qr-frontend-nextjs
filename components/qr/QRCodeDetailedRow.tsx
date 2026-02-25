/**
 * QRCodeDetailedRow Component
 *
 * Full details row for table/list view mode.
 */

'use client'

import React, { useState } from 'react'
import { QRCode } from '@/types/entities/qrcode'
import { RowActionsModal, QRAction } from './RowActionsModal'
import { MoreVertical, Eye, Download, Share2, BarChart3, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export interface QRCodeDetailedRowProps {
  qrcode: QRCode
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onAction: (action: QRAction, qrcode: QRCode) => void
}

export function QRCodeDetailedRow({
  qrcode,
  isSelected,
  onToggleSelect,
  onAction,
}: QRCodeDetailedRowProps) {
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)

  const handleAction = (action: QRAction) => {
    onAction(action, qrcode)
    setIsActionsOpen(false)
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      url: 'URL',
      text: 'Text',
      email: 'Email',
      phone: 'Phone',
      sms: 'SMS',
      wifi: 'WiFi',
      vcard: 'vCard',
      location: 'Location',
    }
    return typeMap[type] || type.toUpperCase()
  }

  const getTypeBadgeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      url: 'bg-blue-100 text-blue-700',
      text: 'bg-gray-100 text-gray-700',
      email: 'bg-purple-100 text-purple-700',
      phone: 'bg-green-100 text-green-700',
      sms: 'bg-yellow-100 text-yellow-700',
      wifi: 'bg-cyan-100 text-cyan-700',
      vcard: 'bg-pink-100 text-pink-700',
      location: 'bg-red-100 text-red-700',
    }
    return colorMap[type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <>
      <tr
        className={`
          border-b border-gray-200 transition-colors
          ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
          ${qrcode.status === 'archived' ? 'opacity-60' : ''}
        `}
        onMouseEnter={() => setShowQuickActions(true)}
        onMouseLeave={() => setShowQuickActions(false)}
      >
        {/* Checkbox */}
        <td className="px-4 py-3 w-12">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(qrcode.id)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </td>

        {/* QR Preview */}
        <td className="px-4 py-3 w-20">
          <div className="w-12 h-12 bg-gray-50 rounded border border-gray-200 overflow-hidden flex items-center justify-center">
            {qrcode.svgUrl || qrcode.screenshotUrl ? (
              <img
                src={qrcode.svgUrl || qrcode.screenshotUrl}
                alt={qrcode.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Eye className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </td>

        {/* Name */}
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 truncate max-w-xs">{qrcode.name}</span>
            {qrcode.name && (
              <span className="text-xs text-gray-500 truncate max-w-xs mt-0.5">{qrcode.type}</span>
            )}
          </div>
        </td>

        {/* Type */}
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(
              qrcode.type
            )}`}
          >
            {getTypeLabel(qrcode.type)}
          </span>
        </td>

        {/* Scans */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">{qrcode.scans || 0}</span>
          </div>
        </td>

        {/* Created */}
        <td className="px-4 py-3 hidden lg:table-cell">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            {qrcode.createdAt
              ? formatDistanceToNow(new Date(qrcode.createdAt), { addSuffix: true })
              : 'N/A'}
          </div>
        </td>

        {/* Actions */}
        <td className="px-4 py-3 w-24">
          <div className="flex items-center gap-2">
            {/* Quick Actions (shown on hover) */}
            {showQuickActions && (
              <div className="hidden xl:flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
                <button
                  onClick={() => handleAction('preview')}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAction('download')}
                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAction('share')}
                  className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* More Actions Button */}
            <button
              onClick={() => setIsActionsOpen(true)}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      <RowActionsModal
        isOpen={isActionsOpen}
        onClose={() => setIsActionsOpen(false)}
        qrcode={qrcode}
        onAction={handleAction}
      />
    </>
  )
}
