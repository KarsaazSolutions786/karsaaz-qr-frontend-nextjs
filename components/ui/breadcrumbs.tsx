'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  href?: string
  text: string
  icon?: React.ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  showHomeIcon?: boolean
  homeHref?: string
  homeText?: string
  className?: string
  itemClassName?: string
  activeClassName?: string
  separatorClassName?: string
}

export function Breadcrumbs({
  items,
  separator,
  showHomeIcon = false,
  homeHref = '/dashboard',
  homeText = 'Home',
  className,
  itemClassName,
  activeClassName,
  separatorClassName,
}: BreadcrumbsProps) {
  // Build full items list with optional home
  const allItems: BreadcrumbItem[] = showHomeIcon
    ? [{ href: homeHref, text: homeText, icon: <HomeIcon className="h-4 w-4" /> }, ...items]
    : items

  const defaultSeparator = (
    <ChevronRightIcon className={cn('h-4 w-4 text-gray-400 flex-shrink-0', separatorClassName)} />
  )

  const renderSeparator = separator || defaultSeparator

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center flex-wrap gap-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const isFirst = index === 0

          return (
            <li key={index} className="flex items-center">
              {/* Separator (except for first item) */}
              {!isFirst && (
                <span className="mx-2 flex items-center" aria-hidden="true">
                  {renderSeparator}
                </span>
              )}

              {/* Breadcrumb item */}
              {isLast || !item.href ? (
                // Current page (non-clickable)
                <span
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium text-gray-900',
                    activeClassName
                  )}
                  aria-current="page"
                >
                  {item.icon}
                  <span>{item.text}</span>
                </span>
              ) : (
                // Clickable link
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors',
                    itemClassName
                  )}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Alternative: Simple breadcrumb with string paths
interface SimpleBreadcrumbsProps {
  path: string // e.g., "Dashboard / QR Codes / Edit"
  separator?: string
  baseHref?: string
  className?: string
}

export function SimpleBreadcrumbs({
  path,
  separator = ' / ',
  baseHref = '/dashboard',
  className,
}: SimpleBreadcrumbsProps) {
  const parts = path
    .split(separator)
    .map(p => p.trim())
    .filter(Boolean)

  const items: BreadcrumbItem[] = parts.map((part, index) => {
    // Last item has no href (current page)
    if (index === parts.length - 1) {
      return { text: part }
    }

    // Build href from parts
    const slugs = parts.slice(0, index + 1).map(p => p.toLowerCase().replace(/\s+/g, '-'))
    const href = `${baseHref}/${slugs.join('/')}`

    return { href, text: part }
  })

  return <Breadcrumbs items={items} className={className} />
}

// Breadcrumb with children pattern
interface BreadcrumbProps {
  href?: string
  children: React.ReactNode
  className?: string
}

export function Breadcrumb({ href, children, className }: BreadcrumbProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn('text-sm text-gray-500 hover:text-gray-700 transition-colors', className)}
      >
        {children}
      </Link>
    )
  }

  return (
    <span className={cn('text-sm font-medium text-gray-900', className)} aria-current="page">
      {children}
    </span>
  )
}

interface BreadcrumbListProps {
  children: React.ReactNode
  separator?: React.ReactNode
  className?: string
}

export function BreadcrumbList({ children, separator, className }: BreadcrumbListProps) {
  const childArray = React.Children.toArray(children)

  const defaultSeparator = <ChevronRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />

  const renderSeparator = separator || defaultSeparator

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center flex-wrap gap-1">
        {childArray.map((child, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 flex items-center" aria-hidden="true">
                {renderSeparator}
              </span>
            )}
            {child}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Page header with breadcrumbs
interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  showHomeIcon?: boolean
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  showHomeIcon = true,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} showHomeIcon={showHomeIcon} className="mb-4" />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}

export default Breadcrumbs
