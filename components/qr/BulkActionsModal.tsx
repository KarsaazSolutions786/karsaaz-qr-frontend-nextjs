/**
 * BulkActionsModal Component
 * 
 * Modal for executing bulk actions on selected QR codes.
 */

'use client';

import React, { useState } from 'react';
import { X, Download, Loader2, AlertCircle } from 'lucide-react';
import {
  downloadQRCodesAsZipWithProgress,
  estimateZipSize,
  ZipDownloadOptions,
  QRCodeData,
} from '@/lib/utils/zip-download';

export interface BulkActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQRCodes: QRCodeData[];
  action: 'download' | 'delete' | 'move' | 'archive';
}

export function BulkActionsModal({
  isOpen,
  onClose,
  selectedQRCodes,
  action,
}: BulkActionsModalProps) {
  if (!isOpen) return null;
  
  switch (action) {
    case 'download':
      return <BulkDownloadModal isOpen={isOpen} onClose={onClose} qrCodes={selectedQRCodes} />;
    case 'delete':
      return <BulkDeleteModal isOpen={isOpen} onClose={onClose} qrCodes={selectedQRCodes} />;
    default:
      return null;
  }
}

/**
 * Bulk download modal
 */
function BulkDownloadModal({
  isOpen: _isOpen,
  onClose,
  qrCodes,
}: {
  isOpen: boolean;
  onClose: () => void;
  qrCodes: QRCodeData[];
}) {
  const [format, setFormat] = useState<'svg' | 'png' | 'pdf' | 'all'>('png');
  const [pngSize, setPngSize] = useState(1024);
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [folderStructure, setFolderStructure] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const estimatedSize = estimateZipSize(qrCodes.length, format, pngSize);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    setProgress(0);
    
    try {
      const options: ZipDownloadOptions = {
        format,
        filename: `qr-codes-${Date.now()}`,
        includeMetadata,
        pngSize,
        folderStructure,
        compressionLevel: 6,
      };
      
      await downloadQRCodesAsZipWithProgress(
        qrCodes,
        options,
        (progressData) => {
          setProgress(progressData.percentage);
          setCurrentFile(progressData.currentFile);
        }
      );
      
      // Success - close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ZIP file');
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Download {qrCodes.length} QR {qrCodes.length === 1 ? 'Code' : 'Codes'}
          </h2>
          <button
            onClick={onClose}
            disabled={isDownloading}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Format selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Download Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['png', 'svg', 'pdf', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  disabled={isDownloading}
                  className={`
                    px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all
                    ${format === f
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }
                    ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          {/* PNG size */}
          {(format === 'png' || format === 'all') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PNG Size
              </label>
              <select
                value={pngSize}
                onChange={(e) => setPngSize(parseInt(e.target.value))}
                disabled={isDownloading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={256}>256 × 256</option>
                <option value={512}>512 × 512</option>
                <option value={1024}>1024 × 1024</option>
                <option value={2048}>2048 × 2048</option>
                <option value={4096}>4096 × 4096</option>
              </select>
            </div>
          )}
          
          {/* Options */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                disabled={isDownloading}
                className="rounded"
              />
              Include metadata (JSON files)
            </label>
            
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={folderStructure}
                onChange={(e) => setFolderStructure(e.target.checked)}
                disabled={isDownloading}
                className="rounded"
              />
              Preserve folder structure
            </label>
          </div>
          
          {/* Estimated size */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimated ZIP size:</span>
              <span className="font-medium text-gray-900">{estimatedSize.formatted}</span>
            </div>
          </div>
          
          {/* Progress */}
          {isDownloading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Creating ZIP...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {currentFile && (
                <p className="text-xs text-gray-500 truncate">
                  Processing: {currentFile}
                </p>
              )}
            </div>
          )}
          
          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDownloading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Bulk delete modal
 */
function BulkDeleteModal({
  isOpen: _isOpen,
  onClose,
  qrCodes,
}: {
  isOpen: boolean;
  onClose: () => void;
  qrCodes: QRCodeData[];
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeleting(false);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Delete QR Codes</h2>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-6">
            Are you sure you want to delete {qrCodes.length} QR {qrCodes.length === 1 ? 'code' : 'codes'}?
            This will permanently remove {qrCodes.length === 1 ? 'it' : 'them'} from your account.
          </p>
          
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete {qrCodes.length} {qrCodes.length === 1 ? 'Code' : 'Codes'}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
