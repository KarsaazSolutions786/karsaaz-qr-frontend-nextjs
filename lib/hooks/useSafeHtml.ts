'use client';

import { useMemo } from 'react';
import { sanitizeHTML, sanitizeSvg } from '@/lib/utils/dom-safety';

/** Hook for safely rendering user-generated HTML content */
export function useSafeHtml(html: string | undefined): { __html: string } {
  return useMemo(() => ({
    __html: sanitizeHTML(html || ''),
  }), [html]);
}

/** Hook for safely rendering user-generated SVG content */
export function useSafeSvg(svg: string | undefined): { __html: string } {
  return useMemo(() => ({
    __html: sanitizeSvg(svg || ''),
  }), [svg]);
}
