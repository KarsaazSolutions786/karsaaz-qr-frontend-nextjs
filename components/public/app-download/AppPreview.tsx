'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, StarHalf, Download, Shield, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DownloadButtons from './DownloadButtons'

interface AppData {
  appName: string
  developer: string
  icon: string
  description: string
  shortDescription?: string
  category?: string
  features?: string[]
  screenshots?: string[]
  appStoreUrl?: string
  playStoreUrl?: string
  apkUrl?: string
  rating?: number
  totalRatings?: number
  reviews?: Review[]
  version?: string
  whatsNew?: string[]
  size?: string
  minOsVersion?: string
  releaseDate?: string
  downloads?: string
  ageRating?: string
  languages?: string[]
  permissions?: string[]
}

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  date: string
  helpful?: number
}

interface AppPreviewProps {
  app: AppData
}

export default function AppPreview({ app }: AppPreviewProps) {
  const [currentScreenshot, setCurrentScreenshot] = useState(0)

  const nextScreenshot = () => {
    if (app.screenshots && currentScreenshot < app.screenshots.length - 1) {
      setCurrentScreenshot(currentScreenshot + 1)
    }
  }

  const prevScreenshot = () => {
    if (currentScreenshot > 0) {
      setCurrentScreenshot(currentScreenshot - 1)
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* App Icon */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-white/20">
                <Image
                  src={app.icon || '/placeholder-app-icon.png'}
                  alt={app.appName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* App Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-bold mb-2 drop-shadow-lg">
                {app.appName}
              </h1>
              <p className="text-xl text-white/90 mb-4">{app.developer}</p>
              
              {app.category && (
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-4">
                  {app.category}
                </Badge>
              )}

              <p className="text-lg text-white/80 mb-6 max-w-2xl">
                {app.shortDescription || app.description}
              </p>

              {/* Rating */}
              {app.rating && (
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {renderStars(app.rating)}
                  </div>
                  <div className="text-white/90">
                    <span className="text-2xl font-bold">{app.rating.toFixed(1)}</span>
                    {app.totalRatings && (
                      <span className="text-sm ml-2">({app.totalRatings.toLocaleString()} ratings)</span>
                    )}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-8 text-white/80">
                {app.downloads && (
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    <span className="font-semibold">{app.downloads}</span>
                  </div>
                )}
                {app.ageRating && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">{app.ageRating}</span>
                  </div>
                )}
                {app.size && (
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    <span className="font-semibold">{app.size}</span>
                  </div>
                )}
              </div>

              {/* Download Buttons */}
              <DownloadButtons
                appStoreUrl={app.appStoreUrl}
                playStoreUrl={app.playStoreUrl}
                apkUrl={app.apkUrl}
                className="justify-center md:justify-start"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Screenshots */}
            {app.screenshots && app.screenshots.length > 0 && (
              <Card className="overflow-hidden shadow-xl border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Screenshots
                  </h2>
                  <div className="relative">
                    <div className="aspect-[9/19.5] max-w-sm mx-auto bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
                      <Image
                        src={app.screenshots[currentScreenshot] ?? ''}
                        alt={`Screenshot ${currentScreenshot + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {app.screenshots.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg"
                          onClick={prevScreenshot}
                          disabled={currentScreenshot === 0}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg"
                          onClick={nextScreenshot}
                          disabled={currentScreenshot === app.screenshots.length - 1}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </>
                    )}

                    <div className="flex justify-center gap-2 mt-4">
                      {app.screenshots.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentScreenshot
                              ? 'bg-blue-600 w-8'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          onClick={() => setCurrentScreenshot(index)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* What's New */}
            {app.whatsNew && app.whatsNew.length > 0 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      What&apos;s New
                    </h2>
                    {app.version && (
                      <Badge variant="secondary" className="text-sm">
                        Version {app.version}
                      </Badge>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {app.whatsNew.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {app.releaseDate && (
                    <p className="text-sm text-gray-500 mt-4">
                      Released on {new Date(app.releaseDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  About This App
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {app.description}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            {app.features && app.features.length > 0 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {app.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mt-2"></div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {app.reviews && app.reviews.length > 0 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Ratings & Reviews
                  </h2>
                  <div className="space-y-6">
                    {app.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {review.userName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(review.rating)}
                            </div>
                            {review.title && (
                              <p className="font-medium text-gray-900 dark:text-white mb-1">
                                {review.title}
                              </p>
                            )}
                            <p className="text-gray-600 dark:text-gray-400">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Information
                </h3>
                <div className="space-y-3 text-sm">
                  {app.version && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Version</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{app.version}</p>
                    </div>
                  )}
                  {app.size && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Size</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{app.size}</p>
                    </div>
                  )}
                  {app.minOsVersion && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Requires</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{app.minOsVersion}</p>
                    </div>
                  )}
                  {app.developer && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Developer</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{app.developer}</p>
                    </div>
                  )}
                  {app.ageRating && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Age Rating</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{app.ageRating}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            {app.languages && app.languages.length > 0 && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {app.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Download Again CTA */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Download?</h3>
                <p className="text-white/80 mb-4 text-sm">
                  Get {app.appName} on your device now
                </p>
                <DownloadButtons
                  appStoreUrl={app.appStoreUrl}
                  playStoreUrl={app.playStoreUrl}
                  apkUrl={app.apkUrl}
                  className="flex-col"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
