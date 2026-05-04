'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

export type SimplePaginationVariant = 'buttons' | 'load-more';

export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: SimplePaginationVariant;
  loading?: boolean;
  hasMore?: boolean;
  loadingText?: string;
  loadMoreText?: string;
  className?: string;
  disabled?: boolean;
  showPageIndicator?: boolean;
  compact?: boolean;
}

export const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'buttons',
  loading = false,
  hasMore,
  loadingText,
  loadMoreText,
  className,
  disabled = false,
  showPageIndicator = true,
  compact = false,
}: SimplePaginationProps) => {
  const { t } = useTranslation();
  const resolvedLoadingText = loadingText ?? t('Loading...');
  const resolvedLoadMoreText = loadMoreText ?? t('Load More');
  const hasNextPage = hasMore !== undefined ? hasMore : currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handlePrevious = () => {
    if (hasPreviousPage && !disabled && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage && !disabled && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !disabled && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  if (variant === 'load-more') {
    if (!hasNextPage && currentPage === 1) return null;

    return (
      <div
        className={cn('flex flex-col items-center gap-3', className)}
        role="navigation"
        aria-label="Pagination"
      >
        {showPageIndicator && totalPages > 0 && (
          <div
            className="text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            {t('Page')} {currentPage} {t('of')} {totalPages}
          </div>
        )}

        {hasNextPage && (
          <button
            onClick={handleLoadMore}
            disabled={disabled || loading}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3',
              'border border-input bg-background text-sm font-medium',
              'hover:bg-accent hover:text-accent-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              compact && 'px-4 py-2'
            )}
            aria-label={t('Load more items')}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {resolvedLoadingText}
              </>
            ) : (
              resolvedLoadMoreText
            )}
          </button>
        )}
      </div>
    );
  }

  // Buttons variant
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 sm:flex-row sm:justify-between',
        compact && 'gap-2',
        className
      )}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Page indicator */}
      {showPageIndicator && (
        <div
          className={cn(
            'text-sm text-muted-foreground',
            'order-1 sm:order-none'
          )}
          role="status"
          aria-live="polite"
        >
          {totalPages > 0 ? (
            <>
              {t('Page')} <span className="font-medium text-foreground">{currentPage}</span> {t('of')}{' '}
              <span className="font-medium text-foreground">{totalPages}</span>
            </>
          ) : (
            t('No pages')
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={!hasPreviousPage || disabled || loading}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md',
            'border border-input bg-background px-4 py-2 text-sm font-medium',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors',
            compact && 'px-3 py-1.5'
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeft className={cn('h-4 w-4', compact && 'h-3 w-3')} />
          <span className={cn(!compact && 'hidden sm:inline')}>{t('Previous')}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNextPage || disabled || loading}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-md',
            'border border-input bg-background px-4 py-2 text-sm font-medium',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors',
            compact && 'px-3 py-1.5'
          )}
          aria-label="Go to next page"
        >
          {loading ? (
            <>
              <Loader2 className={cn('h-4 w-4 animate-spin', compact && 'h-3 w-3')} />
              <span className={cn(!compact && 'hidden sm:inline')}>{t('Loading...')}</span>
            </>
          ) : (
            <>
              <span className={cn(!compact && 'hidden sm:inline')}>{t('Next')}</span>
              <ChevronRight className={cn('h-4 w-4', compact && 'h-3 w-3')} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SimplePagination;
