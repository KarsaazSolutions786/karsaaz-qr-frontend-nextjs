'use client';

import React, { useState, useEffect } from 'react';

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100, 300, 500, 1000] as const;
const STORAGE_KEY = 'qrcode_list_settings';

interface ListSettings {
  pageSize: number;
  showQRCodePreview: boolean;
}

interface QRCodeListSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (settings: ListSettings) => void;
}

function getStoredSettings(): ListSettings {
  if (typeof window === 'undefined') return { pageSize: 25, showQRCodePreview: true };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { pageSize: 25, showQRCodePreview: true };
}

export function QRCodeListSettingsModal({ open, onClose, onApply }: QRCodeListSettingsModalProps) {
  const [pageSize, setPageSize] = useState(25);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (open) {
      const s = getStoredSettings();
      setPageSize(s.pageSize);
      setShowPreview(s.showQRCodePreview);
    }
  }, [open]);

  const handleApply = () => {
    const settings: ListSettings = { pageSize, showQRCodePreview: showPreview };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    onApply(settings);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">List Settings</h3>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Items per page</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setPageSize(size)}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                  pageSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Show QR Code Preview</label>
          <div className="mt-2 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setShowPreview(val)}
                className={`rounded-md border px-4 py-1.5 text-sm font-medium transition ${
                  showPreview === val
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {val ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
