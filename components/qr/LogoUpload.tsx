/**
 * LogoUpload Component
 * 
 * Logo upload and preview with drag-and-drop support.
 * Validates file types and sizes.
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';

export interface LogoUploadProps {
  value: string | null; // URL of uploaded logo
  onChange: (url: string | null) => void;
  onFileSelect?: (file: File) => void;
  maxSizeKB?: number;
  allowedTypes?: string[];
  className?: string;
}

const DEFAULT_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
const DEFAULT_MAX_SIZE_KB = 5120; // 5MB

export function LogoUpload({
  value,
  onChange,
  onFileSelect,
  maxSizeKB = DEFAULT_MAX_SIZE_KB,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  className = '',
}: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`,
        };
      }

      // Check file size
      const sizeKB = file.size / 1024;
      if (sizeKB > maxSizeKB) {
        return {
          valid: false,
          error: `File too large. Maximum size: ${maxSizeKB}KB (${Math.round(sizeKB)}KB provided)`,
        };
      }

      return { valid: true };
    },
    [allowedTypes, maxSizeKB]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);
      setIsLoading(true);

      // Validate
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        setIsLoading(false);
        return;
      }

      try {
        // Convert to data URL
        const reader = new FileReader();
        reader.onload = e => {
          const dataUrl = e.target?.result as string;
          onChange(dataUrl);
          setIsLoading(false);

          // Notify parent if callback provided
          if (onFileSelect) {
            onFileSelect(file);
          }
        };
        reader.onerror = () => {
          setError('Failed to read file');
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Failed to process file');
        setIsLoading(false);
      }
    },
    [validateFile, onChange, onFileSelect]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // Handle click to browse
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle remove
  const handleRemove = useCallback(() => {
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  // Handle URL input
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value.trim();
      if (url === '') {
        onChange(null);
      } else {
        onChange(url);
      }
    },
    [onChange]
  );

  return (
    <div className={`logo-upload ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>

      {/* Upload area */}
      {!value ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleInputChange}
            className="hidden"
          />

          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-3"></div>
              <p className="text-sm text-gray-600">Processing...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-3"
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
              <p className="text-sm text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">
                PNG, JPG, SVG, or WebP (max {Math.round(maxSizeKB / 1024)}MB)
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Preview */
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <div className="flex items-start gap-4">
            {/* Logo preview */}
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={value} alt="Logo preview" className="max-w-full max-h-full object-contain" />
            </div>

            {/* Info and actions */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-2">Logo uploaded</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClick}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* URL input as alternative */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Or enter image URL</label>
        <input
          type="url"
          value={value || ''}
          onChange={handleUrlChange}
          placeholder="https://example.com/logo.png"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>
    </div>
  );
}
