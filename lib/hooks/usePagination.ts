import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
  syncWithUrl?: boolean;
  pageParam?: string;
  pageSizeParam?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setPageSize: (size: number) => void;
  getPageNumbers: (maxVisible?: number) => (number | 'ellipsis')[];
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems,
  syncWithUrl = false,
  pageParam = 'page',
  pageSizeParam = 'pageSize',
  onPageChange,
  onPageSizeChange,
}: UsePaginationOptions): UsePaginationReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL if syncing
  const urlPage = syncWithUrl ? parseInt(searchParams.get(pageParam) || '1', 10) : initialPage;
  const urlPageSize = syncWithUrl
    ? parseInt(searchParams.get(pageSizeParam) || String(initialPageSize), 10)
    : initialPageSize;

  const [currentPage, setCurrentPage] = useState(Math.max(1, urlPage));
  const [pageSize, setPageSizeState] = useState(Math.max(1, urlPageSize));

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  // Sync with URL
  useEffect(() => {
    if (syncWithUrl) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(pageParam, String(currentPage));
      params.set(pageSizeParam, String(pageSize));
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [currentPage, pageSize, syncWithUrl, pageParam, pageSizeParam, router, searchParams]);

  // Auto-adjust page if it exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Calculate indices
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Navigation helpers
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
      onPageChange?.(validPage);
    },
    [totalPages, onPageChange]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [hasNextPage, currentPage, goToPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  }, [hasPreviousPage, currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  const setPageSize = useCallback(
    (size: number) => {
      const validSize = Math.max(1, size);
      setPageSizeState(validSize);
      // Reset to first page when changing page size
      setCurrentPage(1);
      onPageSizeChange?.(validSize);
    },
    [onPageSizeChange]
  );

  const getPageNumbers = useCallback(
    (maxVisible: number = 7): (number | 'ellipsis')[] => {
      if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages: (number | 'ellipsis')[] = [];
      const sidePages = Math.floor((maxVisible - 3) / 2);

      // Always show first page
      pages.push(1);

      if (currentPage <= sidePages + 2) {
        // Near the start
        for (let i = 2; i <= maxVisible - 2; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      } else if (currentPage >= totalPages - sidePages - 1) {
        // Near the end
        pages.push('ellipsis');
        for (let i = totalPages - (maxVisible - 3); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('ellipsis');
        for (let i = currentPage - sidePages; i <= currentPage + sidePages; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);

      return pages;
    },
    [currentPage, totalPages]
  );

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    isFirstPage,
    isLastPage,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
    getPageNumbers,
  };
}
