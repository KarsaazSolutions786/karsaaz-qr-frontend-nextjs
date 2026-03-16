/**
 * useStickerGallery Hook
 * 
 * State management for sticker gallery with filtering, search, and upload.
 */

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Sticker, StickerCategory, BUILTIN_STICKERS } from '@/types/entities/sticker';
import {
  filterStickersByCategory,
  filterStickersBySearch,
  sortStickers,
} from '@/lib/utils/sticker-utils';

export interface UseStickerGalleryOptions {
  includeBuiltin?: boolean;
  fetchCustomStickers?: () => Promise<Sticker[]>;
  onStickerSelect?: (sticker: Sticker) => void;
  onStickerUpload?: (file: File, name: string, category?: StickerCategory) => Promise<Sticker>;
  onStickerDelete?: (stickerId: string) => Promise<void>;
}

export interface UseStickerGalleryReturn {
  // State
  stickers: Sticker[];
  filteredStickers: Sticker[];
  selectedSticker: Sticker | null;
  selectedCategory: StickerCategory | 'all';
  searchQuery: string;
  sortBy: 'name' | 'category' | 'recent';
  isLoading: boolean;
  error: string | null;
  categoryCounts: Record<StickerCategory | 'all', number>;

  // Actions
  selectSticker: (sticker: Sticker) => void;
  setCategory: (category: StickerCategory | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'name' | 'category' | 'recent') => void;
  uploadSticker: (file: File, name: string, category?: StickerCategory) => Promise<void>;
  deleteSticker: (stickerId: string) => Promise<void>;
  refreshStickers: () => Promise<void>;
  reset: () => void;
}

export function useStickerGallery(
  options: UseStickerGalleryOptions = {}
): UseStickerGalleryReturn {
  const {
    includeBuiltin = true,
    fetchCustomStickers,
    onStickerSelect,
    onStickerUpload,
    onStickerDelete,
  } = options;

  // State
  const [customStickers, setCustomStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StickerCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'recent'>('name');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combine built-in and custom stickers
  const allStickers = useMemo(() => {
    const stickers: Sticker[] = [];
    if (includeBuiltin) {
      stickers.push(...BUILTIN_STICKERS);
    }
    stickers.push(...customStickers);
    return stickers;
  }, [includeBuiltin, customStickers]);

  // Filter and sort stickers
  const filteredStickers = useMemo(() => {
    let filtered = allStickers;

    // Filter by category
    filtered = filterStickersByCategory(filtered, selectedCategory);

    // Filter by search
    filtered = filterStickersBySearch(filtered, searchQuery);

    // Sort
    filtered = sortStickers(filtered, sortBy);

    return filtered;
  }, [allStickers, selectedCategory, searchQuery, sortBy]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<StickerCategory | 'all', number> = {
      all: allStickers.length,
      'call-to-action': 0,
      'social-media': 0,
      contact: 0,
      business: 0,
      events: 0,
      seasonal: 0,
      custom: 0,
    };

    allStickers.forEach((sticker) => {
      counts[sticker.category]++;
    });

    return counts;
  }, [allStickers]);

  // Load custom stickers
  const refreshStickers = useCallback(async () => {
    if (!fetchCustomStickers) return;

    setIsLoading(true);
    setError(null);

    try {
      const stickers = await fetchCustomStickers();
      setCustomStickers(stickers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stickers');
    } finally {
      setIsLoading(false);
    }
  }, [fetchCustomStickers]);

  // Select sticker
  const selectSticker = useCallback(
    (sticker: Sticker) => {
      setSelectedSticker(sticker);
      onStickerSelect?.(sticker);
    },
    [onStickerSelect]
  );

  // Upload sticker
  const uploadSticker = useCallback(
    async (file: File, name: string, category?: StickerCategory) => {
      if (!onStickerUpload) {
        throw new Error('Upload not supported');
      }

      setIsLoading(true);
      setError(null);

      try {
        const newSticker = await onStickerUpload(file, name, category);
        setCustomStickers((prev) => [...prev, newSticker]);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onStickerUpload]
  );

  // Delete sticker
  const deleteSticker = useCallback(
    async (stickerId: string) => {
      if (!onStickerDelete) {
        throw new Error('Delete not supported');
      }

      setIsLoading(true);
      setError(null);

      try {
        await onStickerDelete(stickerId);
        setCustomStickers((prev) => prev.filter((s) => s.id !== stickerId));
        if (selectedSticker?.id === stickerId) {
          setSelectedSticker(null);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Delete failed';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onStickerDelete, selectedSticker]
  );

  // Reset state
  const reset = useCallback(() => {
    setSelectedSticker(null);
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('name');
    setError(null);
  }, []);

  // Load custom stickers on mount
  useEffect(() => {
    refreshStickers();
  }, [refreshStickers]);

  return {
    // State
    stickers: allStickers,
    filteredStickers,
    selectedSticker,
    selectedCategory,
    searchQuery,
    sortBy,
    isLoading,
    error,
    categoryCounts,

    // Actions
    selectSticker,
    setCategory: setSelectedCategory,
    setSearchQuery,
    setSortBy,
    uploadSticker,
    deleteSticker,
    refreshStickers,
    reset,
  };
}

/**
 * Hook for managing sticker positioning
 */
export interface UseStickerPositionOptions {
  qrSize: number;
  initialSize?: number;
  initialRotation?: number;
  initialOpacity?: number;
}

export function useStickerPosition(options: UseStickerPositionOptions) {
  const { qrSize, initialSize = 0.2, initialRotation = 0, initialOpacity = 1.0 } = options;

  const [size, setSize] = useState(initialSize);
  const [rotation, setRotation] = useState(initialRotation);
  const [opacity, setOpacity] = useState(initialOpacity);

  // Calculate pixel dimensions
  const pixelSize = useMemo(() => {
    return qrSize * size;
  }, [qrSize, size]);

  // Reset to defaults
  const reset = useCallback(() => {
    setSize(initialSize);
    setRotation(initialRotation);
    setOpacity(initialOpacity);
  }, [initialSize, initialRotation, initialOpacity]);

  return {
    size,
    setSize,
    rotation,
    setRotation,
    opacity,
    setOpacity,
    pixelSize,
    reset,
  };
}

/**
 * Hook for sticker search with debouncing
 */
export function useStickerSearch(delay: number = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return {
    query,
    setQuery,
    debouncedQuery,
  };
}

/**
 * Hook for managing sticker favorites
 */
export function useStickerFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = useCallback((stickerId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(stickerId)) {
        next.delete(stickerId);
      } else {
        next.add(stickerId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (stickerId: string) => {
      return favorites.has(stickerId);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
  }, []);

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
