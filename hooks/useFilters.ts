/**
 * useFilters Hook
 * 
 * Hook for managing QR code filters with state management.
 */

'use client';

import { useState, useCallback, useMemo } from 'react';

export type QRCodeType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard' | 'location' | 'all';
export type QRCodeStatus = 'active' | 'inactive' | 'archived' | 'all';
export type DateRangeType = 'today' | 'week' | 'month' | 'year' | 'custom' | 'all';

export interface FilterState {
  // Basic filters
  search: string;
  type: QRCodeType;
  status: QRCodeStatus;
  
  // Date filters
  dateRange: DateRangeType;
  dateFrom?: Date;
  dateTo?: Date;
  
  // Folder filter
  folderId?: string | null;
  
  // Scan count filter
  scanCountMin?: number;
  scanCountMax?: number;
  
  // Advanced filters
  tags?: string[];
  createdBy?: string;
  hasLogo?: boolean;
  hasSticker?: boolean;
}

export interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<FilterState>;
  isDefault?: boolean;
  createdAt: Date;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  type: 'all',
  status: 'all',
  dateRange: 'all',
};

export function useFilters(initialFilters?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  
  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.type !== 'all' ||
      filters.status !== 'all' ||
      filters.dateRange !== 'all' ||
      filters.folderId !== undefined ||
      filters.scanCountMin !== undefined ||
      filters.scanCountMax !== undefined ||
      (filters.tags && filters.tags.length > 0) ||
      filters.createdBy !== undefined ||
      filters.hasLogo !== undefined ||
      filters.hasSticker !== undefined
    );
  }, [filters]);
  
  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search !== '') count++;
    if (filters.type !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.folderId !== undefined) count++;
    if (filters.scanCountMin !== undefined || filters.scanCountMax !== undefined) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.createdBy !== undefined) count++;
    if (filters.hasLogo !== undefined) count++;
    if (filters.hasSticker !== undefined) count++;
    return count;
  }, [filters]);
  
  // Update individual filter
  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Update multiple filters at once
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Reset filters to default
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);
  
  // Reset specific filter
  const resetFilter = useCallback(<K extends keyof FilterState>(key: K) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return {
        ...newFilters,
        [key]: DEFAULT_FILTERS[key],
      };
    });
  }, []);
  
  // Save current filters as preset
  const savePreset = useCallback((name: string, isDefault = false) => {
    const preset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters: { ...filters },
      isDefault,
      createdAt: new Date(),
    };
    
    setPresets(prev => {
      // If setting as default, unset other defaults
      const updated = isDefault
        ? prev.map(p => ({ ...p, isDefault: false }))
        : prev;
      return [...updated, preset];
    });
    
    return preset;
  }, [filters]);
  
  // Load preset
  const loadPreset = useCallback((presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setFilters({ ...DEFAULT_FILTERS, ...preset.filters });
    }
  }, [presets]);
  
  // Delete preset
  const deletePreset = useCallback((presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
  }, []);
  
  // Update preset
  const updatePreset = useCallback((presetId: string, updates: Partial<FilterPreset>) => {
    setPresets(prev => prev.map(p =>
      p.id === presetId ? { ...p, ...updates } : p
    ));
  }, []);
  
  // Get default preset
  const defaultPreset = useMemo(
    () => presets.find(p => p.isDefault),
    [presets]
  );
  
  // Apply filters to items
  const applyFilters = useCallback(<T extends Record<string, any>>(
    items: T[],
    filterFn?: (item: T, filters: FilterState) => boolean
  ): T[] => {
    if (!hasActiveFilters) return items;
    
    return items.filter(item => {
      // Custom filter function
      if (filterFn && !filterFn(item, filters)) return false;
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableFields = [
          item.name,
          item.title,
          item.description,
          item.content,
        ].filter(Boolean);
        
        const matches = searchableFields.some(field =>
          String(field).toLowerCase().includes(searchLower)
        );
        
        if (!matches) return false;
      }
      
      // Type filter
      if (filters.type !== 'all' && item.type !== filters.type) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange !== 'all' && item.createdAt) {
        const itemDate = new Date(item.createdAt);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            if (itemDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (itemDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (itemDate < monthAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (itemDate < yearAgo) return false;
            break;
          case 'custom':
            if (filters.dateFrom && itemDate < filters.dateFrom) return false;
            if (filters.dateTo && itemDate > filters.dateTo) return false;
            break;
        }
      }
      
      // Folder filter
      if (filters.folderId !== undefined && item.folderId !== filters.folderId) {
        return false;
      }
      
      // Scan count filter
      if (filters.scanCountMin !== undefined && (item.scanCount || 0) < filters.scanCountMin) {
        return false;
      }
      if (filters.scanCountMax !== undefined && (item.scanCount || 0) > filters.scanCountMax) {
        return false;
      }
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const itemTags = item.tags || [];
        const hasAllTags = filters.tags.every(tag => itemTags.includes(tag));
        if (!hasAllTags) return false;
      }
      
      // Created by filter
      if (filters.createdBy && item.createdBy !== filters.createdBy) {
        return false;
      }
      
      // Has logo filter
      if (filters.hasLogo !== undefined && Boolean(item.logo) !== filters.hasLogo) {
        return false;
      }
      
      // Has sticker filter
      if (filters.hasSticker !== undefined && Boolean(item.sticker) !== filters.hasSticker) {
        return false;
      }
      
      return true;
    });
  }, [filters, hasActiveFilters]);
  
  return {
    // State
    filters,
    hasActiveFilters,
    activeFilterCount,
    
    // Filter updates
    updateFilter,
    updateFilters,
    resetFilters,
    resetFilter,
    
    // Presets
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    updatePreset,
    defaultPreset,
    
    // Apply filters
    applyFilters,
  };
}
