'use client'

import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize?: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  showFirstLast?: boolean
  showPageNumbers?: boolean
  maxVisiblePages?: number
  showTotalItems?: boolean
  showPageSize?: boolean
  className?: string
  compact?: boolean
  disabled?: boolean
}

export const Pagination = ({
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
}: PaginationProps) => {
  const { t } = useTranslation()
  const activePage = Math.max(1, Number(currentPage) || 1)
  const lastPage = Math.max(1, Number(totalPages) || 1)
  const itemsPerPage = Math.max(1, Number(pageSize) || 10)
  const totalCount = Math.max(0, Number(totalItems) || 0)
  const rangeStart = totalCount === 0 ? 0 : (activePage - 1) * itemsPerPage + 1
  const rangeEnd = Math.min(activePage * itemsPerPage, totalCount)
  const hasNextPage = activePage < lastPage
  const hasPreviousPage = activePage > 1

  const handlePageChange = (next: number) => {
    if (next < 1 || next > lastPage || next === activePage || disabled) return
    onPageChange(next)
  }

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (lastPage <= maxVisiblePages) {
      return Array.from({ length: lastPage }, (_, i) => i + 1)
    }

    const items: (number | 'ellipsis')[] = []
    const sidePages = Math.floor((maxVisiblePages - 3) / 2)

    items.push(1)

    if (activePage <= sidePages + 2) {
      for (let i = 2; i <= maxVisiblePages - 2; i++) {
        items.push(i)
      }
      items.push('ellipsis')
    } else if (activePage >= lastPage - sidePages - 1) {
      items.push('ellipsis')
      for (let i = lastPage - (maxVisiblePages - 3); i < lastPage; i++) {
        items.push(i)
      }
    } else {
      items.push('ellipsis')
      for (let i = activePage - sidePages; i <= activePage + sidePages; i++) {
        items.push(i)
      }
      items.push('ellipsis')
    }

    items.push(lastPage)
    return items
  }

  const pageNumbers = showPageNumbers ? getPageNumbers() : []

  if (totalItems === 0) return null
  if (lastPage <= 1) return null

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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        {showTotalItems && totalItems !== undefined && (
          <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
            {t('Showing')} <span className="font-medium text-foreground">{rangeStart}</span>{' '}
            {t('to')} <span className="font-medium text-foreground">{rangeEnd}</span> {t('of')}{' '}
            <span className="font-medium text-foreground">{totalItems}</span> {t('results')}
          </div>
        )}

        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-sm text-muted-foreground">
              {t('Show')}
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              disabled={disabled}
              className={cn(
                'rounded-md border border-input bg-background px-2 py-1 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
              aria-label="Items per page"
            >
              {pageSizeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">{t('per page')}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {showFirstLast && !compact && (
          <button
            type="button"
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

        <button
          type="button"
          onClick={() => handlePageChange(activePage - 1)}
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
          {!compact && <span className="ml-1 hidden sm:inline">{t('Previous')}</span>}
        </button>

        {showPageNumbers && !compact && (
          <div className="hidden items-center gap-1 md:flex" role="group" aria-label="Page numbers">
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === 'ellipsis') {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="inline-flex h-9 w-9 items-center justify-center"
                    aria-hidden="true"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                )
              }

              const isCurrentPage = pageNum === activePage

              return (
                <button
                  type="button"
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={disabled}
                  className={cn(
                    'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium',
                    'border border-input transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    isCurrentPage
                      ? /* Original page active style:
                      ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                      */
                        'border-transparent bg-[radial-gradient(ellipse_at_center,_#E889FF_0%,_#B36AC5_100%)] text-white'
                      : 'bg-background hover:bg-accent hover:text-accent-foreground'
                  )}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
        )}

        {showPageNumbers && (
          <div
            className="inline-flex h-9 items-center justify-center px-3 text-sm font-medium md:hidden"
            role="status"
            aria-live="polite"
          >
            {t('Page')} {activePage} {t('of')} {lastPage}
          </div>
        )}

        <button
          type="button"
          onClick={() => handlePageChange(activePage + 1)}
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
          {!compact && <span className="mr-1 hidden sm:inline">{t('Next')}</span>}
          <ChevronRight className="h-4 w-4" />
        </button>

        {showFirstLast && !compact && (
          <button
            type="button"
            onClick={() => handlePageChange(lastPage)}
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
  )
}

export default Pagination
