/**
 * QRCodeMinimalCard Component
 * 
 * Compact QR card for minimal view mode.
 */

'use client';

import React from 'react';
import { QRCode } from '@/types/entities/qrcode';
import { Eye } from 'lucide-react';

export interface QRCodeMinimalCardProps {
  qrcode: QRCode;
  onSelect: (qrcode: QRCode) => void;
}

export function QRCodeMinimalCard({ qrcode, onSelect }: QRCodeMinimalCardProps) {
  const scanCount = qrcode.scans || 0;

  return (
    <button
      onClick={() => onSelect(qrcode)}
      className="group relative w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {/* QR Code Preview */}
      <div className="relative aspect-square mb-2 bg-gray-50 rounded-md overflow-hidden">
        {qrcode.screenshotUrl ? (
          <img
            src={qrcode.screenshotUrl}
            alt={qrcode.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Eye className="w-8 h-8" />
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
              View Details
            </div>
          </div>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
        {qrcode.name}
      </h3>

      {/* Scan Count */}
      <div className="flex items-center justify-center">
        <span className="text-xs font-medium text-gray-600">
          {`${scanCount} scans`}
        </span>
      </div>

      {/* Status Indicator */}
      {qrcode.status === 'archived' && (
        <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium text-white">
          Archived
        </div>
      )}
    </button>
  );
}
