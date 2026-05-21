'use client';

import { useMemo } from 'react';
import { sanitizeHTML, sanitizeSvg } from '@/lib/utils/dom-safety';

/**
 * Purpose: * Hook for safely rendering user-generated HTML content 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useSafeHtml(html: string | undefined): { __html: string } {
  return useMemo(() => ({
    __html: sanitizeHTML(html || ''),
  }), [html]);
}

/**
 * Purpose: * Hook for safely rendering user-generated SVG content 
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useSafeSvg(svg: string | undefined): { __html: string } {
  return useMemo(() => ({
    __html: sanitizeSvg(svg || ''),
  }), [svg]);
}
