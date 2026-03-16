'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

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
  const { t } = useTranslation()
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
        title={t("Custom code preview")}
        style={{ minHeight: 200 }}
      />
    )
  }

  // Non-sandbox mode still uses sandboxed iframe to prevent XSS
  return (
    <iframe
      srcDoc={srcdoc}
      sandbox="allow-scripts"
      className={cn('w-full border border-gray-200 rounded-lg', className)}
      title={t("Custom code preview")}
      style={{ minHeight: 200 }}
    />
  )
}
