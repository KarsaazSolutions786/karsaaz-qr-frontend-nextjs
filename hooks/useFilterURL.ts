/**
 * useFilterURL Hook
 * 
 * Hook for synchronizing filter state with URL query parameters.
 */

'use client';

import { useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FilterState } from '@/hooks/useFilters';

export interface FilterURLOptions {
  debounceMs?: number;
  replaceHistory?: boolean;
}

/**
 * Serialize filters to URL query parameters
 */
export function filtersToURLParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  
  // Search
  if (filters.search) {
    params.set('search', filters.search);
  }
  
  // Type
  if (filters.type && filters.type !== 'all') {
    params.set('type', filters.type);
  }
  
  // Status
  if (filters.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }
  
  // Date range
  if (filters.dateRange && filters.dateRange !== 'all') {
    params.set('dateRange', filters.dateRange);
    
    if (filters.dateRange === 'custom') {
      if (filters.dateFrom) {
        params.set('dateFrom', filters.dateFrom.toISOString().split('T')[0]);
      }
      if (filters.dateTo) {
        params.set('dateTo', filters.dateTo.toISOString().split('T')[0]);
      }
    }
  }
  
  // Folder
  if (filters.folderId) {
    params.set('folder', filters.folderId);
  }
  
  // Scan count
  if (filters.scanCountMin !== undefined) {
    params.set('scanMin', filters.scanCountMin.toString());
  }
  if (filters.scanCountMax !== undefined) {
    params.set('scanMax', filters.scanCountMax.toString());
  }
  
  // Tags
  if (filters.tags && filters.tags.length > 0) {
    params.set('tags', filters.tags.join(','));
  }
  
  // Created by
  if (filters.createdBy) {
    params.set('createdBy', filters.createdBy);
  }
  
  // Boolean flags
  if (filters.hasLogo !== undefined) {
    params.set('hasLogo', filters.hasLogo.toString());
  }
  if (filters.hasSticker !== undefined) {
    params.set('hasSticker', filters.hasSticker.toString());
  }
  
  return params;
}

/**
 * Parse URL query parameters to filters
 */
export function urlParamsToFilters(searchParams: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {};
  
  // Search
  const search = searchParams.get('search');
  if (search) {
    filters.search = search;
  }
  
  // Type
  const type = searchParams.get('type');
  if (type) {
    filters.type = type as any;
  }
  
  // Status
  const status = searchParams.get('status');
  if (status) {
    filters.status = status as any;
  }
  
  // Date range
  const dateRange = searchParams.get('dateRange');
  if (dateRange) {
    filters.dateRange = dateRange as any;
    
    if (dateRange === 'custom') {
      const dateFrom = searchParams.get('dateFrom');
      const dateTo = searchParams.get('dateTo');
      
      if (dateFrom) {
        filters.dateFrom = new Date(dateFrom);
      }
      if (dateTo) {
        filters.dateTo = new Date(dateTo);
      }
    }
  }
  
  // Folder
  const folder = searchParams.get('folder');
  if (folder) {
    filters.folderId = folder;
  }
  
  // Scan count
  const scanMin = searchParams.get('scanMin');
  const scanMax = searchParams.get('scanMax');
  if (scanMin) {
    filters.scanCountMin = parseInt(scanMin, 10);
  }
  if (scanMax) {
    filters.scanCountMax = parseInt(scanMax, 10);
  }
  
  // Tags
  const tags = searchParams.get('tags');
  if (tags) {
    filters.tags = tags.split(',');
  }
  
  // Created by
  const createdBy = searchParams.get('createdBy');
  if (createdBy) {
    filters.createdBy = createdBy;
  }
  
  // Boolean flags
  const hasLogo = searchParams.get('hasLogo');
  if (hasLogo !== null) {
    filters.hasLogo = hasLogo === 'true';
  }
  
  const hasSticker = searchParams.get('hasSticker');
  if (hasSticker !== null) {
    filters.hasSticker = hasSticker === 'true';
  }
  
  return filters;
}

/**
 * Hook for synchronizing filters with URL
 */
export function useFilterURL(
  filters: FilterState,
  onFiltersChange: (filters: Partial<FilterState>) => void,
  options: FilterURLOptions = {}
) {
  const { debounceMs = 500, replaceHistory = false } = options;
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Sync URL to filters on mount
  useEffect(() => {
    if (searchParams) {
      const urlFilters = urlParamsToFilters(searchParams);
      if (Object.keys(urlFilters).length > 0) {
        onFiltersChange(urlFilters);
      }
    }
  }, []); // Only run on mount
  
  // Sync filters to URL
  const syncToURL = useCallback(
    (filters: FilterState) => {
      const params = filtersToURLParams(filters);
      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      
      if (replaceHistory) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [pathname, router, replaceHistory]
  );
  
  // Debounced sync to URL
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      syncToURL(filters);
    }, debounceMs);
    
    return () => clearTimeout(timeoutId);
  }, [filters, syncToURL, debounceMs]);
  
  // Clear URL parameters
  const clearURL = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);
  
  // Get sharable URL
  const getShareableURL = useCallback((): string => {
    const params = filtersToURLParams(filters);
    const queryString = params.toString();
    
    if (typeof window !== 'undefined') {
      const baseURL = window.location.origin;
      return queryString ? `${baseURL}${pathname}?${queryString}` : `${baseURL}${pathname}`;
    }
    
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [filters, pathname]);
  
  // Copy sharable URL to clipboard
  const copyShareableURL = useCallback(async (): Promise<boolean> => {
    try {
      const url = getShareableURL();
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Failed to copy URL:', error);
      return false;
    }
  }, [getShareableURL]);
  
  return {
    syncToURL,
    clearURL,
    getShareableURL,
    copyShareableURL,
  };
}

/**
 * Generate sharable filter URL
 */
export function generateShareableFilterURL(
  filters: FilterState,
  baseURL: string = ''
): string {
  const params = filtersToURLParams(filters);
  const queryString = params.toString();
  
  return queryString ? `${baseURL}?${queryString}` : baseURL;
}

/**
 * Check if URL has filter parameters
 */
export function hasFilterParams(searchParams: URLSearchParams): boolean {
  const filterKeys = [
    'search',
    'type',
    'status',
    'dateRange',
    'dateFrom',
    'dateTo',
    'folder',
    'scanMin',
    'scanMax',
    'tags',
    'createdBy',
    'hasLogo',
    'hasSticker',
  ];
  
  return filterKeys.some(key => searchParams.has(key));
}
