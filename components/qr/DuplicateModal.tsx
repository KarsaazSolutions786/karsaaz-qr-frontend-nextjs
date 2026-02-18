/**
 * DuplicateModal Component
 * 
 * Modal for duplicating QR codes with options.
 */

'use client';

import React, { useState } from 'react';
import { X, Copy, AlertCircle } from 'lucide-react';

export interface DuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeName: string;
  onDuplicate: (options: {
    count: number;
    includeDesign: boolean;
    includeSettings: boolean;
    prefix: string;
  }) => Promise<void>;
}

export function DuplicateModal({
  isOpen,
  onClose,
  qrCodeName,
  onDuplicate,
}: DuplicateModalProps) {
  const [count, setCount] = useState(1);
  const [includeDesign, setIncludeDesign] = useState(true);
  const [includeSettings, setIncludeSettings] = useState(true);
  const [prefix, setPrefix] = useState('Copy of');
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [error, setError] = useState('');
  
  if (!isOpen) return null;
  
  const handleDuplicate = async () => {
    setIsDuplicating(true);
    setError('');
    
    try {
      await onDuplicate({
        count,
        includeDesign,
        includeSettings,
        prefix,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Duplication failed');
    } finally {
      setIsDuplicating(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Copy className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Duplicate QR Code</h2>
              <p className="text-sm text-gray-500">Create a copy of "{qrCodeName}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDuplicating}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-5">
            {/* Number of Copies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Copies
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum 100 copies at once</p>
            </div>
            
            {/* Name Prefix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name Prefix
              </label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="Copy of"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Preview: <span className="font-medium">{prefix} {qrCodeName}</span>
              </p>
            </div>
            
            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What to Include
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDesign}
                    onChange={(e) => setIncludeDesign(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Design Settings</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Colors, logos, patterns, and styling
                    </div>
                  </div>
                </label>
                
                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSettings}
                    onChange={(e) => setIncludeSettings(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">QR Code Settings</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Error correction, size, and format preferences
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Warning */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800">
                  Each duplicate will have a new unique ID and will start with 0 scans.
                  {count > 1 && ` Creating ${count} copies will use ${count} QR code credits.`}
                </p>
              </div>
            </div>
            
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
              disabled={isDuplicating}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleDuplicate}
              disabled={isDuplicating}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isDuplicating ? (
                <>
                  <Copy className="w-4 h-4 animate-pulse" />
                  <span>Duplicating...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Duplicate {count > 1 ? `(${count})` : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
