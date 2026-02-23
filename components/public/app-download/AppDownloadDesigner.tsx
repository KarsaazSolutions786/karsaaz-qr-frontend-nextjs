'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Star, Download, ChevronLeft, ChevronRight, Smartphone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AppDownloadDesignerProps {
  appName: string
  description: string
  icon?: string
  screenshots?: string[]
  appStoreUrl?: string
  playStoreUrl?: string
  rating?: number
  downloadCount?: string
  version?: string
  category?: string
}

export default function AppDownloadDesigner({
  appName,
  description,
  icon,
  screenshots = [],
  appStoreUrl,
  playStoreUrl,
  rating = 0,
  downloadCount,
  version,
  category,
}: AppDownloadDesignerProps) {
  const [currentScreenshot, setCurrentScreenshot] = useState(0)

  const renderStars = (r: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(r) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-12">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl bg-white/10 flex-shrink-0">
            {icon ? (
              <Image src={icon} alt={appName} width={96} height={96} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                {appName.charAt(0)}
              </div>
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold mb-1">{appName}</h1>
            {category && (
              <Badge className="bg-white/20 text-white border-white/30 mb-2">{category}</Badge>
            )}
            <p className="text-white/80 text-sm mb-3">{description}</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 text-sm">
              {rating > 0 && (
                <div className="flex items-center gap-1">
                  {renderStars(rating)}
                  <span className="ml-1 font-semibold">{rating.toFixed(1)}</span>
                </div>
              )}
              {downloadCount && (
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{downloadCount}</span>
                </div>
              )}
              {version && <span>v{version}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Store Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          {appStoreUrl && (
            <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-14 px-6 gap-2 rounded-xl">
                <Smartphone className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[10px] leading-tight text-muted-foreground">
                    Download on the
                  </div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Button>
            </a>
          )}
          {playStoreUrl && (
            <a href={playStoreUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-14 px-6 gap-2 rounded-xl">
                <Smartphone className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-[10px] leading-tight text-muted-foreground">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Button>
            </a>
          )}
        </div>

        {/* Screenshots Carousel */}
        {screenshots.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Screenshots</h2>
              <div className="relative">
                <div className="aspect-[9/16] max-w-[240px] mx-auto rounded-2xl overflow-hidden bg-gray-100 shadow-lg relative">
                  <Image
                    src={screenshots[currentScreenshot] ?? ''}
                    alt={`Screenshot ${currentScreenshot + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                {screenshots.length > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentScreenshot(Math.max(0, currentScreenshot - 1))}
                      disabled={currentScreenshot === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentScreenshot + 1} / {screenshots.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setCurrentScreenshot(
                          Math.min(screenshots.length - 1, currentScreenshot + 1)
                        )
                      }
                      disabled={currentScreenshot === screenshots.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Download CTA */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Download {appName}</h3>
            <p className="text-white/80 text-sm mb-4">Available on iOS and Android</p>
            <Button className="bg-white text-indigo-600 hover:bg-white/90 font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Download Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
