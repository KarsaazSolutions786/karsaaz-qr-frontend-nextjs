/**
 * PreviewModal Component
 * 
 * Full QR code preview with details and actions.
 */

'use client';

import React from 'react';
import {
  X,
  Download,
  Edit,
  Smartphone,
  BarChart3,
  Calendar,
  Eye,
  QrCode,
} from 'lucide-react';
import { QRCode } from '@/types/entities/qrcode';
import { useRouter } from 'next/navigation';

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrcode: QRCode;
  onDownload?: () => void;
  stats?: {
    totalScans: number;
    recentScans: Array<{ date: string; count: number }>;
    topLocation?: string;
    topDevice?: string;
  };
}

export function PreviewModal({
  isOpen,
  onClose,
  qrcode,
  onDownload,
  stats,
}: PreviewModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleEdit = () => {
    router.push(`/qrcodes/${qrcode.id}/edit`);
    onClose();
  };

  const handleViewAnalytics = () => {
    router.push(`/qrcodes/${qrcode.id}/analytics`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">QR Code Preview</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - QR Code Display */}
            <div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border-2 border-gray-200">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="w-full aspect-square bg-white border-4 border-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <QrCode className="w-16 h-16 mx-auto mb-2" />
                      <div className="text-sm font-medium">QR Code Preview</div>
                      <div className="text-xs">{qrcode.name}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan Guide */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      Test with Your Phone
                    </h4>
                    <p className="text-xs text-blue-700">
                      Open your phone camera and point it at the QR code to test the scan functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* QR Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Name
                    </label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {qrcode.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Type
                    </label>
                    <p className="text-sm font-medium text-gray-900 mt-1 capitalize">
                      {qrcode.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </label>
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          qrcode.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : qrcode.status === 'archived'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {qrcode.status || 'active'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Created
                    </label>
                    <p className="text-sm text-gray-700 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(qrcode.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {qrcode.tags && qrcode.tags.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {qrcode.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Analytics Preview */}
              {stats && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary-600" />
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {stats.totalScans}
                      </div>
                      <div className="text-xs text-gray-500">Total Scans</div>
                    </div>
                    {stats.topLocation && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {stats.topLocation}
                        </div>
                        <div className="text-xs text-gray-500">Top Location</div>
                      </div>
                    )}
                    {stats.topDevice && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {stats.topDevice}
                        </div>
                        <div className="text-xs text-gray-500">Top Device</div>
                      </div>
                    )}
                    {stats.recentScans.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.recentScans[0]?.count ?? 0}
                        </div>
                        <div className="text-xs text-gray-500">Today</div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleViewAnalytics}
                    className="mt-3 w-full text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Analytics
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
            <button
              type="button"
              onClick={handleEdit}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
