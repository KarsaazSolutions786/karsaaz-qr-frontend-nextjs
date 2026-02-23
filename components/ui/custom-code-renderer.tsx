'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface CustomCodeRendererProps {
  html?: string
  css?: string
  js?: string
  sandbox?: boolean
  className?: string
}

export function CustomCodeRenderer({
  html = '',
  css = '',
  js = '',
  sandbox = true,
  className,
}: CustomCodeRendererProps) {
  const srcdoc = useMemo(
    () =>
      `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`,
    [html, css, js]
  )

  if (sandbox) {
    return (
      <iframe
        srcDoc={srcdoc}
        sandbox="allow-scripts"
        className={cn('w-full border border-gray-200 rounded-lg', className)}
        title="Custom code preview"
        style={{ minHeight: 200 }}
      />
    )
  }

  return (
    <div className={cn('border border-gray-200 rounded-lg p-4', className)}>
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {js && <script dangerouslySetInnerHTML={{ __html: js }} />}
    </div>
  )
}
