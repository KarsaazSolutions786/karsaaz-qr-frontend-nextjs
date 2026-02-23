import dynamic from 'next/dynamic'
import type { ComponentType, ReactNode } from 'react'

/**
 * Lazy-load heavy components to reduce initial bundle size.
 * Usage: const Chart = lazyLoad(() => import('@/components/ui/chart'))
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: { ssr?: boolean; loading?: () => ReactNode | null }
) {
  return dynamic(importFn, {
    ssr: options?.ssr ?? false,
    loading: options?.loading ?? (() => null),
  })
}

/**
 * Lazy-load a named export as a dynamic component.
 * Usage: const Editor = lazyLoadNamed(() => import('@/components/ui/markdown-editor'), 'MarkdownEditor')
 */
export function lazyLoadNamed<M extends Record<string, any>, K extends keyof M>(
  importFn: () => Promise<M>,
  exportName: K,
  options?: { ssr?: boolean; loading?: () => ReactNode | null }
) {
  return dynamic(
    () => importFn().then(mod => ({ default: mod[exportName] as ComponentType<any> })),
    {
      ssr: options?.ssr ?? false,
      loading: options?.loading ?? (() => null),
    }
  )
}

/** Lazy-loaded heavy UI component */
export const LazyMarkdownEditor = lazyLoadNamed(
  () => import('@/components/ui/markdown-editor'),
  'MarkdownEditor',
  { ssr: false }
)
