'use client';

import React, { useState, useCallback, useRef } from 'react';

type ImageMode = 'upload' | 'url' | 'gallery';

interface ImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
  galleryImages?: string[];
  mode?: ImageMode;
}

const TABS: { key: ImageMode; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'url', label: 'URL' },
  { key: 'gallery', label: 'Gallery' },
];

export function ImageSelector({
  value,
  onChange,
  galleryImages = [],
  mode: initialMode = 'upload',
}: ImageSelectorProps) {
  const [activeMode, setActiveMode] = useState<ImageMode>(initialMode);
  const [urlInput, setUrlInput] = useState(value || '');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) onChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) handleFile(file);
    },
    [handleFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="w-full space-y-3">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveMode(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeMode === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upload Mode */}
      {activeMode === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <span className="text-3xl mb-2">📁</span>
          <p className="text-sm text-gray-600">
            Drag & drop an image here, or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* URL Mode */}
      {activeMode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.png"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput.trim()) onChange(urlInput.trim());
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      )}

      {/* Gallery Mode */}
      {activeMode === 'gallery' && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {galleryImages.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-gray-500">
              No gallery images available
            </p>
          ) : (
            galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(img)}
                className={`overflow-hidden rounded-lg border-2 transition-colors ${
                  value === img ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="h-20 w-full object-cover"
                />
              </button>
            ))
          )}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2">
          <p className="mb-1 text-xs text-gray-500">Preview</p>
          <img
            src={value}
            alt="Selected"
            className="h-24 w-24 rounded-md border border-gray-200 object-cover"
          />
        </div>
      )}
    </div>
  );
}
