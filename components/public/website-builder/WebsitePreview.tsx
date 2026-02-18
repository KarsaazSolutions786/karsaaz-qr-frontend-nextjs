'use client'

import { useState, useEffect } from 'react'
import WebsiteDisplay from './WebsiteDisplay'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Monitor, Smartphone, Tablet, Loader2, AlertCircle } from 'lucide-react'

interface Website {
  title?: string
  description?: string
  htmlCode: string
  cssCode: string
  jsCode: string
  qrCodeId?: string
}

interface WebsitePreviewProps {
  website: Website
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile'

const viewportSizes = {
  desktop: { width: '100%', height: '100%', icon: Monitor, label: 'Desktop' },
  tablet: { width: '768px', height: '1024px', icon: Tablet, label: 'Tablet' },
  mobile: { width: '375px', height: '667px', icon: Smartphone, label: 'Mobile' },
}

export default function WebsitePreview({ website }: WebsitePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  const currentViewport = viewportSizes[viewport]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {website.title || 'Custom Website'}
              </h1>
              {website.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {website.description}
                </p>
              )}
            </div>

            {/* Viewport Selector */}
            <div className="flex items-center gap-2">
              {(Object.entries(viewportSizes) as [ViewportSize, typeof viewportSizes.desktop][]).map(([size, config]) => {
                const Icon = config.icon
                return (
                  <Button
                    key={size}
                    variant={viewport === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewport(size)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{config.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="overflow-hidden shadow-xl">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-[600px] bg-white dark:bg-gray-950">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading website...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && !isLoading && (
            <div className="flex items-center justify-center h-[600px] bg-white dark:bg-gray-950">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Failed to Load Website
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  There was an error rendering the website. Please check the code for issues.
                </p>
              </div>
            </div>
          )}

          {/* Website Display */}
          {!hasError && (
            <div
              className={`bg-white dark:bg-gray-950 transition-all duration-300 ${isLoading ? 'hidden' : 'block'}`}
            >
              <div className="flex items-center justify-center p-8">
                <div
                  style={{
                    width: currentViewport.width,
                    height: viewport === 'desktop' ? '100vh' : currentViewport.height,
                    maxHeight: viewport === 'desktop' ? '100vh' : currentViewport.height,
                    transition: 'all 0.3s ease-in-out',
                  }}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  <WebsiteDisplay
                    htmlCode={website.htmlCode}
                    cssCode={website.cssCode}
                    jsCode={website.jsCode}
                    onError={handleError}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
