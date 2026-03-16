/**
 * ArchiveModal Component
 * 
 * Modal for archiving/unarchiving QR codes.
 */

'use client';

import React, { useState } from 'react';
import { X, Archive, ArchiveRestore, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'archive' | 'unarchive';
  qrCodeNames: string[];
  onArchive?: (reason?: string) => Promise<void>;
  onUnarchive?: () => Promise<void>;
}

export function ArchiveModal({
  isOpen,
  onClose,
  mode,
  qrCodeNames,
  onArchive,
  onUnarchive,
}: ArchiveModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;
  
  const isBulk = qrCodeNames.length > 1;
  
  const handleSubmit = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      if (mode === 'archive' && onArchive) {
        await onArchive(reason || undefined);
      } else if (mode === 'unarchive' && onUnarchive) {
        await onUnarchive();
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Operation failed'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              mode === 'archive' ? 'bg-orange-100' : 'bg-green-100'
            }`}>
              {mode === 'archive' ? (
                <Archive className="w-5 h-5 text-orange-600" />
              ) : (
                <ArchiveRestore className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'archive' ? t('Archive') : t('Unarchive')} {t('QR Code')}{isBulk ? 's' : ''}
              </h2>
              <p className="text-sm text-gray-500">
                {isBulk ? `${qrCodeNames.length} ${t('QR codes selected')}` : qrCodeNames[0]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Info */}
            <div className={`p-3 border rounded-lg flex items-start gap-2 ${
              mode === 'archive' 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                mode === 'archive' ? 'text-orange-600' : 'text-green-600'
              }`} />
              <div className="flex-1">
                <p className={`text-sm ${
                  mode === 'archive' ? 'text-orange-800' : 'text-green-800'
                }`}>
                  {mode === 'archive' ? (
                    <>
                      {t('Archived QR codes will be hidden from your main list but can be restored at any time.')}
                      {' '}{t('The QR code will continue to work and scans will still be tracked.')}
                    </>
                  ) : (
                    <>
                      {t('Unarchiving will restore the QR code to your active list.')}
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {/* QR Code List (for bulk) */}
            {isBulk && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Selected QR Codes')} ({qrCodeNames.length})
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                  <div className="divide-y divide-gray-100">
                    {qrCodeNames.slice(0, 10).map((name, index) => (
                      <div key={index} className="px-3 py-2 text-sm text-gray-700">
                        {name}
                      </div>
                    ))}
                    {qrCodeNames.length > 10 && (
                      <div className="px-3 py-2 text-sm text-gray-500 italic">
                        ... {t('and')} {qrCodeNames.length - 10} {t('more')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Reason (archive only) */}
            {mode === 'archive' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Reason (Optional)')}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={t('Why are you archiving this QR code?')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('This note will help you remember why you archived this item')}
                </p>
              </div>
            )}
            
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {t('Cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`
                px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 flex items-center gap-2
                ${mode === 'archive' 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-green-600 hover:bg-green-700'
                }
              `}
            >
              {isProcessing ? (
                <>
                  {mode === 'archive' ? (
                    <Archive className="w-4 h-4 animate-pulse" />
                  ) : (
                    <ArchiveRestore className="w-4 h-4 animate-pulse" />
                  )}
                  <span>{t('Processing...')}</span>
                </>
              ) : (
                <>
                  {mode === 'archive' ? (
                    <>
                      <Archive className="w-4 h-4" />
                      <span>{t('Archive')} {isBulk ? `(${qrCodeNames.length})` : ''}</span>
                    </>
                  ) : (
                    <>
                      <ArchiveRestore className="w-4 h-4" />
                      <span>{t('Unarchive')} {isBulk ? `(${qrCodeNames.length})` : ''}</span>
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Archive Button Component
 */
export function ArchiveButton({
  isArchived,
  onClick,
  variant = 'icon',
}: {
  isArchived: boolean;
  onClick: () => void;
  variant?: 'icon' | 'button';
}) {
  const { t } = useTranslation();
  if (variant === 'icon') {
    return (
      <button
        onClick={onClick}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title={isArchived ? t('Unarchive') : t('Archive')}
      >
        {isArchived ? (
          <ArchiveRestore className="w-4 h-4 text-green-600" />
        ) : (
          <Archive className="w-4 h-4 text-orange-600" />
        )}
      </button>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors
        ${isArchived
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
        }
      `}
    >
      {isArchived ? (
        <>
          <ArchiveRestore className="w-4 h-4" />
          <span>{t('Unarchive')}</span>
        </>
      ) : (
        <>
          <Archive className="w-4 h-4" />
          <span>{t('Archive')}</span>
        </>
      )}
    </button>
  );
}
