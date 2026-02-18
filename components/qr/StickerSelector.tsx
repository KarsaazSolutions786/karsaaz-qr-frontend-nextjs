/**
 * StickerSelector Component
 * 
 * Complete sticker selection interface combining gallery, filters, upload, and search.
 */

'use client';

import React, { useState } from 'react';
import { Sticker, StickerCategory } from '@/types/entities/sticker';
import { StickerGallery } from './StickerGallery';
import { StickerCategoryFilter, StickerCategoryTabs } from './StickerCategoryFilter';
import { StickerUpload } from './StickerUpload';
import { useStickerGallery, useStickerSearch } from '@/hooks/useStickerGallery';

export interface StickerSelectorProps {
  selectedStickerId?: string;
  onSelect: (sticker: Sticker) => void;
  onUpload?: (file: File, name: string, category?: StickerCategory) => Promise<Sticker>;
  onDelete?: (stickerId: string) => Promise<void>;
  fetchCustomStickers?: () => Promise<Sticker[]>;
  showUpload?: boolean;
  showSearch?: boolean;
  columns?: 3 | 4 | 5 | 6;
  className?: string;
}

export function StickerSelector({
  selectedStickerId,
  onSelect,
  onUpload,
  onDelete,
  fetchCustomStickers,
  showUpload = true,
  showSearch = true,
  columns = 4,
  className = '',
}: StickerSelectorProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { query, setQuery, debouncedQuery } = useStickerSearch();

  const {
    filteredStickers,
    selectedCategory,
    setCategory,
    sortBy,
    setSortBy,
    isLoading,
    error,
    categoryCounts,
    uploadSticker,
    deleteSticker,
  } = useStickerGallery({
    includeBuiltin: true,
    fetchCustomStickers,
    onStickerSelect: onSelect,
    onStickerUpload: onUpload,
    onStickerDelete: onDelete,
  });

  // Handle upload
  const handleUpload = async (file: File, name: string, category?: StickerCategory) => {
    await uploadSticker(file, name, category);
    setShowUploadModal(false);
  };

  return (
    <div className={`sticker-selector ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Select Sticker</h3>
        <div className="flex items-center gap-2">
          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
            <option value="recent">Sort by Recent</option>
          </select>

          {/* Upload button */}
          {showUpload && onUpload && (
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Upload
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stickers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="mb-4">
        <StickerCategoryTabs
          selectedCategory={selectedCategory}
          onCategoryChange={setCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading stickers...</p>
        </div>
      )}

      {/* Gallery */}
      {!isLoading && (
        <StickerGallery
          stickers={filteredStickers}
          selectedStickerId={selectedStickerId}
          onSelect={onSelect}
          category={selectedCategory}
          searchQuery={debouncedQuery}
          columns={columns}
        />
      )}

      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Custom Sticker</h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
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
            <StickerUpload
              onUpload={handleUpload}
              onCancel={() => setShowUploadModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact sticker selector (dropdown style)
 */
export interface StickerSelectorCompactProps {
  selectedStickerId?: string;
  onSelect: (sticker: Sticker) => void;
  stickers: Sticker[];
  placeholder?: string;
  className?: string;
}

export function StickerSelectorCompact({
  selectedStickerId,
  onSelect,
  stickers,
  placeholder = 'Select a sticker...',
  className = '',
}: StickerSelectorCompactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedSticker = stickers.find((s) => s.id === selectedStickerId);

  const handleSelect = (sticker: Sticker) => {
    onSelect(sticker);
    setIsOpen(false);
  };

  return (
    <div className={`sticker-selector-compact relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {selectedSticker ? (
          <div className="flex items-center gap-3">
            <img
              src={selectedSticker.thumbnail || selectedSticker.url}
              alt={selectedSticker.name}
              className="w-8 h-8 object-contain"
            />
            <span className="text-sm font-medium text-gray-900">{selectedSticker.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500">{placeholder}</span>
        )}
        <svg
          className={`w-5 h-5 text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

          {/* Dropdown */}
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
            {stickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                onClick={() => handleSelect(sticker)}
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition"
              >
                <img
                  src={sticker.thumbnail || sticker.url}
                  alt={sticker.name}
                  className="w-8 h-8 object-contain"
                />
                <span className="text-sm text-gray-900">{sticker.name}</span>
                {selectedStickerId === sticker.id && (
                  <svg className="w-4 h-4 text-primary-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
