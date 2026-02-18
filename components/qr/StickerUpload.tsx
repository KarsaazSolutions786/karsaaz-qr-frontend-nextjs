/**
 * StickerUpload Component
 * 
 * Upload custom stickers with drag-and-drop support.
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { StickerCategory } from '@/types/entities/sticker';
import {
  validateStickerFile,
  formatFileSize,
  compressStickerImage,
  estimateUploadTime,
  getCategoryDisplayName,
} from '@/lib/utils/sticker-utils';

export interface StickerUploadProps {
  onUpload: (file: File, name: string, category?: StickerCategory) => Promise<void>;
  onCancel?: () => void;
  maxSize?: number; // Max file size in bytes
  className?: string;
}

export function StickerUpload({
  onUpload,
  onCancel,
  maxSize = 2 * 1024 * 1024, // 2MB default
  className = '',
}: StickerUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stickerName, setStickerName] = useState('');
  const [category, setCategory] = useState<StickerCategory>('custom');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    setError(null);

    // Validate file
    const validation = validateStickerFile(file);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    // Set file and preview
    setSelectedFile(file);
    setStickerName(file.name.replace(/\.[^.]+$/, '')); // Remove extension

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile || !stickerName.trim()) {
      setError('Please select a file and provide a name');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile, stickerName.trim(), category);
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setStickerName('');
      setCategory('custom');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStickerName('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onCancel?.();
  };

  return (
    <div className={`sticker-upload ${className}`}>
      {/* Upload area */}
      {!selectedFile && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`upload-dropzone border-2 border-dashed rounded-lg p-8 text-center transition ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm font-medium text-gray-900">
            {isDragging ? 'Drop your sticker here' : 'Drag and drop your sticker'}
          </p>
          <p className="mt-1 text-xs text-gray-500">or click to browse</p>
          <p className="mt-2 text-xs text-gray-500">
            PNG, JPG, SVG, WebP up to {formatFileSize(maxSize)}
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Choose File
          </button>
        </div>
      )}

      {/* Preview and details */}
      {selectedFile && previewUrl && (
        <div className="preview-section">
          {/* Preview */}
          <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24 h-24 border border-gray-300 rounded-lg bg-white p-2 flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(selectedFile.size)}</p>
                <p className="text-xs text-gray-500">{selectedFile.type}</p>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sticker Name</label>
            <input
              type="text"
              value={stickerName}
              onChange={(e) => setStickerName(e.target.value)}
              placeholder="Enter sticker name"
              maxLength={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">{stickerName.length}/50 characters</p>
          </div>

          {/* Category selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as StickerCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {(['call-to-action', 'social-media', 'contact', 'business', 'events', 'seasonal', 'custom'] as StickerCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryDisplayName(cat)}
                </option>
              ))}
            </select>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || !stickerName.trim()}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span>Upload Sticker</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

          {/* Upload estimate */}
          {!isUploading && selectedFile && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Estimated upload time: ~{Math.round(estimateUploadTime(selectedFile.size) / 1000)}s
            </p>
          )}
        </div>
      )}
    </div>
  );
}
