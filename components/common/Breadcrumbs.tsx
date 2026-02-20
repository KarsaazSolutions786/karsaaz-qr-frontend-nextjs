'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbLink {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  links?: BreadcrumbLink[];
  className?: string;
}

export function Breadcrumbs({ links, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate from path if no links provided
  const breadcrumbs: BreadcrumbLink[] = links ?? generateFromPath(pathname);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-sm text-gray-500 ${className}`}>
      <Link href="/" className="hover:text-gray-700">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </Link>
      {breadcrumbs.map((crumb, i) => {
        const isLast = i === breadcrumbs.length - 1;
        return (
          <React.Fragment key={crumb.href}>
            <svg className="mx-2 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {isLast ? (
              <span className="font-medium text-gray-700">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-gray-700">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function generateFromPath(pathname: string): BreadcrumbLink[] {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((seg, i) => ({
    href: '/' + segments.slice(0, i + 1).join('/'),
    label: seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
}
