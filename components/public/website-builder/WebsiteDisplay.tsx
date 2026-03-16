'use client'

import { useMemo, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'

interface WebsiteDisplayProps {
  htmlCode: string
  cssCode: string
  jsCode: string
  onError?: () => void
}

export default function WebsiteDisplay({
  htmlCode,
  cssCode,
  jsCode,
  onError,
}: WebsiteDisplayProps) {
  const { t } = useTranslation()

  // Build the full HTML document as a string for srcdoc.
  // Using srcdoc instead of document.write() so we can drop allow-same-origin
  // from the sandbox — preventing the iframe from accessing the parent's
  // cookies, localStorage, and DOM.
  const srcdoc = useMemo(
    () =>
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      ${cssCode}
    </style>
  </head>
  <body>
    ${htmlCode}
    <script>
      try {
        ${jsCode}
      } catch (error) {
        console.error('JavaScript execution error:', error);
        window.parent.postMessage({ type: 'website-preview-error', message: error.message }, '*');
      }
    </script>
  </body>
</html>`,
    [htmlCode, cssCode, jsCode]
  )

  // Listen for error messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'website-preview-error') {
        console.error('Website error:', event.data.message)
        onError?.()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onError])

  return (
    <iframe
      className="w-full h-full"
      srcDoc={srcdoc}
      sandbox="allow-scripts allow-forms allow-popups allow-modals"
      title={t('Website Preview')}
      style={{
        border: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  )
}
