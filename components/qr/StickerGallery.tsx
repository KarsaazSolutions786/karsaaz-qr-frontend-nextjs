/**
 * StickerGallery Component
 * 
 * Display and select stickers from built-in gallery and user uploads.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Sticker, StickerCategory } from '@/types/entities/sticker';
import { filterStickersByCategory, filterStickersBySearch, sortStickers } from '@/lib/utils/sticker-utils';

export interface StickerGalleryProps {
  stickers: Sticker[];
  selectedStickerId?: string;
  onSelect: (sticker: Sticker) => void;
  category?: StickerCategory | 'all';
  searchQuery?: string;
  sortBy?: 'name' | 'category' | 'recent';
  showCustom?: boolean;
  columns?: 3 | 4 | 5 | 6;
  className?: string;
}

export function StickerGallery({
  stickers,
  selectedStickerId,
  onSelect,
  category = 'all',
  searchQuery = '',
  sortBy = 'name',
  showCustom = true,
  columns = 4,
  className = '',
}: StickerGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Filter and sort stickers
  const filteredStickers = useMemo(() => {
    let filtered = stickers;

    // Filter by category
    filtered = filterStickersByCategory(filtered, category);

    // Filter by search
    filtered = filterStickersBySearch(filtered, searchQuery);

    // Filter custom/built-in
    if (!showCustom) {
      filtered = filtered.filter((s) => !s.isCustom);
    }

    // Sort
    filtered = sortStickers(filtered, sortBy);

    return filtered;
  }, [stickers, category, searchQuery, showCustom, sortBy]);

  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[columns];

  if (filteredStickers.length === 0) {
    return (
      <div className={`sticker-gallery-empty ${className}`}>
        <div className="text-center py-12">
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
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No stickers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search or filter.'
              : 'Upload a custom sticker or select a different category.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`sticker-gallery ${className}`}>
      <div className={`grid ${gridCols} gap-3`}>
        {filteredStickers.map((sticker) => {
          const isSelected = selectedStickerId === sticker.id;
          const isHovered = hoveredId === sticker.id;

          return (
            <button
              key={sticker.id}
              type="button"
              onClick={() => onSelect(sticker)}
              onMouseEnter={() => setHoveredId(sticker.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`sticker-item relative aspect-square rounded-lg border-2 transition-all overflow-hidden ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-primary-300 hover:shadow-md bg-white'
              }`}
              title={sticker.name}
            >
              {/* Sticker image */}
              <div className="absolute inset-0 p-3 flex items-center justify-center">
                <img
                  src={sticker.thumbnail || sticker.url}
                  alt={sticker.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Custom badge */}
              {sticker.isCustom && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-purple-600 text-white text-xs font-medium rounded">
                  Custom
                </div>
              )}

              {/* Hover overlay with name */}
              {(isHovered || isSelected) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-2">
                  <p className="text-white text-xs font-medium truncate">{sticker.name}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Showing {filteredStickers.length} sticker{filteredStickers.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

/**
 * Sticker Gallery with pagination
 */
export interface StickerGalleryPaginatedProps extends StickerGalleryProps {
  itemsPerPage?: number;
}

export function StickerGalleryPaginated({
  itemsPerPage = 12,
  ...props
}: StickerGalleryPaginatedProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalItems = props.stickers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStickers = props.stickers.slice(startIndex, endIndex);

  return (
    <div className="sticker-gallery-paginated">
      <StickerGallery {...props} stickers={paginatedStickers} />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
