/**
 * RowActionsModal Component
 * 
 * Quick actions modal for QR code list rows.
 */

'use client';

import React from 'react';
import {
  X,
  Edit,
  Eye,
  Download,
  Share2,
  Copy,
  Archive,
  Trash2,
  BarChart3,
  QrCode,
} from 'lucide-react';
import { QRCode } from '@/types/entities/qrcode';

export type QRAction =
  | 'edit'
  | 'preview'
  | 'download'
  | 'share'
  | 'duplicate'
  | 'archive'
  | 'delete'
  | 'analytics';

export interface RowActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrcode: QRCode;
  onAction: (action: QRAction) => void;
}

export function RowActionsModal({
  isOpen,
  onClose,
  qrcode,
  onAction,
}: RowActionsModalProps) {
  if (!isOpen) return null;

  const handleAction = (action: QRAction) => {
    onAction(action);
    onClose();
  };

  const actions = [
    {
      action: 'edit' as QRAction,
      label: 'Edit',
      icon: Edit,
      description: 'Modify QR code settings',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      action: 'preview' as QRAction,
      label: 'Preview',
      icon: Eye,
      description: 'View full details',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
    },
    {
      action: 'download' as QRAction,
      label: 'Download',
      icon: Download,
      description: 'Export QR code',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
    },
    {
      action: 'share' as QRAction,
      label: 'Share',
      icon: Share2,
      description: 'Share on social media',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100',
    },
    {
      action: 'duplicate' as QRAction,
      label: 'Duplicate',
      icon: Copy,
      description: 'Create a copy',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 hover:bg-teal-100',
    },
    {
      action: 'analytics' as QRAction,
      label: 'Analytics',
      icon: BarChart3,
      description: 'View scan statistics',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
    },
    {
      action: 'archive' as QRAction,
      label: qrcode.status === 'archived' ? 'Unarchive' : 'Archive',
      icon: Archive,
      description: qrcode.status === 'archived' ? 'Restore from archive' : 'Move to archive',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
    },
    {
      action: 'delete' as QRAction,
      label: 'Delete',
      icon: Trash2,
      description: 'Permanently remove',
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Mini Preview */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <QrCode className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {qrcode.name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {qrcode.type}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500">
                  {qrcode.scans} scans
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    qrcode.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : qrcode.status === 'archived'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {qrcode.status || 'active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions List */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action) => (
              <button
                key={action.action}
                type="button"
                onClick={() => handleAction(action.action)}
                className={`${action.bgColor} p-4 rounded-lg text-left transition`}
              >
                <action.icon className={`w-5 h-5 ${action.color} mb-2`} />
                <div className="font-medium text-gray-900 text-sm">
                  {action.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {action.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
