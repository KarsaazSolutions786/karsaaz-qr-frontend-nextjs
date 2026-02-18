'use client'

import { useEffect, useRef } from 'react'

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
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!iframeRef.current) return

    try {
      // Create the complete HTML document with CSS and JS
      const document = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              /* Reset styles */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }

              /* User CSS */
              ${cssCode}
            </style>
          </head>
          <body>
            ${htmlCode}
            <script>
              // Error handling wrapper
              try {
                ${jsCode}
              } catch (error) {
                console.error('JavaScript execution error:', error);
                window.parent.postMessage({ type: 'error', message: error.message }, '*');
              }
            </script>
          </body>
        </html>
      `

      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(document)
        iframeDoc.close()
      }
    } catch (error) {
      console.error('Failed to render website:', error)
      onError?.()
    }
  }, [htmlCode, cssCode, jsCode, onError])

  // Listen for error messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'error') {
        console.error('Website error:', event.data.message)
        onError?.()
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onError])

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full"
      sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
      title="Website Preview"
      style={{
        border: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  )
}
