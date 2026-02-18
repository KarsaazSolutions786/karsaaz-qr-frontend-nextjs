/**
 * StickerCategoryFilter Component
 * 
 * Category filtering for sticker gallery.
 */

'use client';

import React from 'react';
import { StickerCategory } from '@/types/entities/sticker';
import { getCategoryDisplayName, getCategoryIcon } from '@/lib/utils/sticker-utils';

export interface StickerCategoryFilterProps {
  selectedCategory: StickerCategory | 'all';
  onCategoryChange: (category: StickerCategory | 'all') => void;
  categoryCounts?: Record<StickerCategory | 'all', number>;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showCounts?: boolean;
  className?: string;
}

const CATEGORIES: Array<StickerCategory | 'all'> = [
  'all',
  'call-to-action',
  'social-media',
  'contact',
  'business',
  'events',
  'seasonal',
  'custom',
];

export function StickerCategoryFilter({
  selectedCategory,
  onCategoryChange,
  categoryCounts,
  layout = 'horizontal',
  showCounts = true,
  className = '',
}: StickerCategoryFilterProps) {
  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-2 md:grid-cols-4 gap-2',
  };

  return (
    <div className={`sticker-category-filter ${className}`}>
      <div className={layoutClasses[layout]}>
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const count = categoryCounts?.[category] ?? 0;
          const displayName = getCategoryDisplayName(category);
          const icon = getCategoryIcon(category);

          // Skip if no items and counts are shown
          if (showCounts && count === 0 && category !== 'all') {
            return null;
          }

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`category-button flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm transition ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{displayName}</span>
              {showCounts && count > 0 && (
                <span
                  className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact category filter (dropdown style)
 */
export interface StickerCategoryDropdownProps {
  selectedCategory: StickerCategory | 'all';
  onCategoryChange: (category: StickerCategory | 'all') => void;
  className?: string;
}

export function StickerCategoryDropdown({
  selectedCategory,
  onCategoryChange,
  className = '',
}: StickerCategoryDropdownProps) {
  const displayName = getCategoryDisplayName(selectedCategory);
  const icon = getCategoryIcon(selectedCategory);

  return (
    <div className={`sticker-category-dropdown ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as StickerCategory | 'all')}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {getCategoryIcon(category)} {getCategoryDisplayName(category)}
            </option>
          ))}
        </select>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
          {icon}
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * Category tabs
 */
export interface StickerCategoryTabsProps {
  selectedCategory: StickerCategory | 'all';
  onCategoryChange: (category: StickerCategory | 'all') => void;
  categoryCounts?: Record<StickerCategory | 'all', number>;
  className?: string;
}

export function StickerCategoryTabs({
  selectedCategory,
  onCategoryChange,
  categoryCounts,
  className = '',
}: StickerCategoryTabsProps) {
  return (
    <div className={`sticker-category-tabs border-b border-gray-200 ${className}`}>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const count = categoryCounts?.[category] ?? 0;
          const displayName = getCategoryDisplayName(category);
          const icon = getCategoryIcon(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                isSelected
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <span>{icon}</span>
              <span>{displayName}</span>
              {count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    isSelected
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Category chips (minimal style)
 */
export interface StickerCategoryChipsProps {
  selectedCategory: StickerCategory | 'all';
  onCategoryChange: (category: StickerCategory | 'all') => void;
  className?: string;
}

export function StickerCategoryChips({
  selectedCategory,
  onCategoryChange,
  className = '',
}: StickerCategoryChipsProps) {
  return (
    <div className={`sticker-category-chips ${className}`}>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const displayName = getCategoryDisplayName(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
