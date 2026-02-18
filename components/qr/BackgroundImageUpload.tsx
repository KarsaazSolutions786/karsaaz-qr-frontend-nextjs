/**
 * BackgroundImageUpload Component
 * 
 * Background image upload with opacity control.
 * Similar to LogoUpload but optimized for backgrounds.
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';

export interface BackgroundImageUploadProps {
  imageUrl: string | null;
  opacity?: number; // 0-1
  onImageChange: (url: string | null) => void;
  onOpacityChange?: (opacity: number) => void;
  maxSizeKB?: number;
  className?: string;
}

const DEFAULT_MAX_SIZE_KB = 10240; // 10MB for backgrounds
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export function BackgroundImageUpload({
  imageUrl,
  opacity = 1,
  onImageChange,
  onOpacityChange,
  maxSizeKB = DEFAULT_MAX_SIZE_KB,
  className = '',
}: BackgroundImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return {
          valid: false,
          error: `Invalid file type. Allowed: PNG, JPG, WebP`,
        };
      }

      // Check file size
      const sizeKB = file.size / 1024;
      if (sizeKB > maxSizeKB) {
        return {
          valid: false,
          error: `File too large. Maximum size: ${Math.round(maxSizeKB / 1024)}MB (${Math.round(sizeKB / 1024)}MB provided)`,
        };
      }

      return { valid: true };
    },
    [maxSizeKB]
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
          onImageChange(dataUrl);
          setIsLoading(false);
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
    [validateFile, onImageChange]
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
    onImageChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageChange]);

  // Handle URL input
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value.trim();
      if (url === '') {
        onImageChange(null);
      } else {
        onImageChange(url);
      }
    },
    [onImageChange]
  );

  // Handle opacity change
  const handleOpacityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onOpacityChange) {
        onOpacityChange(parseFloat(e.target.value));
      }
    },
    [onOpacityChange]
  );

  return (
    <div className={`background-image-upload ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>

      {/* Upload area */}
      {!imageUrl ? (
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
            accept={ALLOWED_TYPES.join(',')}
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">
                PNG, JPG, or WebP (max {Math.round(maxSizeKB / 1024)}MB)
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Preview */
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="relative h-48 bg-gray-100">
            <img
              src={imageUrl}
              alt="Background preview"
              className="w-full h-full object-cover"
              style={{ opacity }}
            />
          </div>

          <div className="p-4">
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={handleClick}
                className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition"
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

            {/* Opacity control */}
            {onOpacityChange && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={handleOpacityChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
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
          value={imageUrl || ''}
          onChange={handleUrlChange}
          placeholder="https://example.com/background.png"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      {/* Help text */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-800">
          💡 <span className="font-medium">Tip:</span> Use high-quality images for best results. The image will be scaled to fit the QR code size while maintaining aspect ratio.
        </p>
      </div>
    </div>
  );
}
