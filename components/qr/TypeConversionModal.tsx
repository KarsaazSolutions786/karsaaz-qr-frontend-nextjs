'use client';

import React, { useState } from 'react';
import { X, RefreshCw, AlertCircle } from 'lucide-react';

export interface TypeConversionModalProps {
  qrCodeId: number | string;
  currentType: string;
  open: boolean;
  onClose: () => void;
  onConvert: (newType: string) => void;
}

const STATIC_TYPES = ['url', 'text', 'email', 'phone', 'sms', 'wifi', 'vcard', 'location'];
const DYNAMIC_TYPES = ['dynamic_url', 'dynamic_vcard', 'dynamic_pdf', 'dynamic_menu', 'dynamic_landing'];

function getCompatibleTypes(currentType: string): string[] {
  if (DYNAMIC_TYPES.includes(currentType)) {
    return DYNAMIC_TYPES.filter((t) => t !== currentType);
  }
  return STATIC_TYPES.filter((t) => t !== currentType);
}

function formatTypeName(type: string): string {
  return type
    .replace(/^dynamic_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TypeConversionModal({
  qrCodeId: _qrCodeId,
  currentType,
  open,
  onClose,
  onConvert,
}: TypeConversionModalProps) {
  const [selectedType, setSelectedType] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  if (!open) return null;

  const compatibleTypes = getCompatibleTypes(currentType);
  const canConvert = selectedType !== '' && selectedType !== currentType;
  const isDynamic = DYNAMIC_TYPES.includes(currentType);

  const handleConvert = async () => {
    if (!canConvert) return;
    setIsConverting(true);
    try {
      onConvert(selectedType);
      onClose();
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Convert QR Code Type</h2>
              <p className="text-sm text-gray-500">
                Change from <span className="font-medium capitalize">{formatTypeName(currentType)}</span> to another type
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isConverting}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Warning */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Data will change</p>
              <p className="text-xs text-yellow-700 mt-1">
                Converting the QR code type will replace the current data. This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Current Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Type</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="font-medium text-gray-900 capitalize">{formatTypeName(currentType)}</span>
              <span className="ml-2 text-xs text-gray-500">
                ({isDynamic ? 'Dynamic' : 'Static'})
              </span>
            </div>
          </div>

          {/* Target Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Convert To</label>
            <div className="grid grid-cols-3 gap-2">
              {compatibleTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2.5 rounded-lg border-2 font-medium text-sm transition-all capitalize ${
                    selectedType === type
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {formatTypeName(type)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isConverting}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConvert}
            disabled={!canConvert || isConverting}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isConverting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Converting…
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Convert
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
