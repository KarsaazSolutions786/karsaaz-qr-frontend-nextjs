/**
 * ShareModal Component
 * 
 * Social sharing modal for QR codes with multiple platforms.
 */

'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Mail,
  Copy,
  Download,
  Check,
} from 'lucide-react';
import { QRCode } from '@/types/entities/qrcode';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrcode: QRCode;
  onDownload?: () => void;
}

export function ShareModal({
  isOpen,
  onClose,
  qrcode,
  onDownload,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  // Generate share URL (this would be the public URL for the QR code)
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/qr/${qrcode.id}` 
    : '';
  const shareTitle = `Check out my QR code: ${qrcode.name}`;
  const shareDescription = `Scan this QR code for ${qrcode.type}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareDescription}\n\n${shareUrl}`)}`;
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Share QR Code</h2>
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
          {/* QR Code Preview */}
          <div className="mb-6 text-center">
            <div className="inline-block p-4 bg-gray-50 rounded-lg">
              <div className="w-40 h-40 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-sm text-gray-500">
                  QR Preview
                  <br />
                  {qrcode.name}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="font-semibold text-gray-900">{qrcode.name}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {qrcode.type} QR Code
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {qrcode.scans} scans • Created {new Date(qrcode.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Share URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Share on Social Media
            </label>
            <div className="grid grid-cols-3 gap-3">
              {shareButtons.map((button) => (
                <button
                  key={button.name}
                  type="button"
                  onClick={button.onClick}
                  className={`${button.color} text-white p-3 rounded-lg transition flex flex-col items-center gap-2`}
                >
                  <button.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{button.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Download for Sharing */}
          {onDownload && (
            <div>
              <button
                type="button"
                onClick={onDownload}
                className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR Code for Sharing
              </button>
            </div>
          )}

          {/* Meta Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Social Media Preview
            </h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Title:</strong> {shareTitle}</p>
              <p><strong>Description:</strong> {shareDescription}</p>
              <p><strong>URL:</strong> {shareUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
