'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  showTotalItems?: boolean;
  showPageSize?: boolean;
  className?: string;
  compact?: boolean;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showFirstLast = true,
  showPageNumbers = true,
  maxVisiblePages = 7,
  showTotalItems = true,
  showPageSize = true,
  className,
  compact = false,
  disabled = false,
}) => {
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || disabled) return;
    onPageChange(page);
  };

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const sidePages = Math.floor((maxVisiblePages - 3) / 2);

    // Always show first page
    pages.push(1);

    if (currentPage <= sidePages + 2) {
      // Near the start
      for (let i = 2; i <= maxVisiblePages - 2; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
    } else if (currentPage >= totalPages - sidePages - 1) {
      // Near the end
      pages.push('ellipsis');
      for (let i = totalPages - (maxVisiblePages - 3); i < totalPages; i++) {
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
  };

  const pageNumbers = showPageNumbers ? getPageNumbers() : [];

  if (totalPages <= 1 && !showTotalItems) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        compact && 'gap-2',
        className
      )}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Left section - Items info and page size selector */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        {showTotalItems && totalItems !== undefined && (
          <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
            Showing{' '}
            <span className="font-medium text-foreground">
              {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{' '}
            of <span className="font-medium text-foreground">{totalItems}</span> results
          </div>
        )}

        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-sm text-muted-foreground">
              Show
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={disabled}
              className={cn(
                'rounded-md border border-input bg-background px-2 py-1 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
              aria-label="Items per page"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
        )}
      </div>

      {/* Right section - Navigation controls */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {/* First page button */}
        {showFirstLast && !compact && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={!hasPreviousPage || disabled}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-md',
              'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors'
            )}
            aria-label="Go to first page"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}

        {/* Previous page button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPreviousPage || disabled}
          className={cn(
            'inline-flex h-9 items-center justify-center rounded-md px-3',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors'
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          {!compact && <span className="ml-1 hidden sm:inline">Previous</span>}
        </button>

        {/* Page numbers */}
        {showPageNumbers && !compact && (
          <div className="hidden items-center gap-1 md:flex" role="group" aria-label="Page numbers">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="inline-flex h-9 w-9 items-center justify-center"
                    aria-hidden="true"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                );
              }

              const isCurrentPage = page === currentPage;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={disabled}
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium',
                    'border border-input transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    isCurrentPage
                      ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-background hover:bg-accent hover:text-accent-foreground'
                  )}
                  aria-label={`Go to page ${page}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile page indicator */}
        {showPageNumbers && (
          <div
            className="inline-flex h-9 items-center justify-center px-3 text-sm font-medium md:hidden"
            role="status"
            aria-live="polite"
          >
            Page {currentPage} of {totalPages}
          </div>
        )}

        {/* Next page button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage || disabled}
          className={cn(
            'inline-flex h-9 items-center justify-center rounded-md px-3',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors'
          )}
          aria-label="Go to next page"
        >
          {!compact && <span className="mr-1 hidden sm:inline">Next</span>}
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page button */}
        {showFirstLast && !compact && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={!hasNextPage || disabled}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-md',
              'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors'
            )}
            aria-label="Go to last page"
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
