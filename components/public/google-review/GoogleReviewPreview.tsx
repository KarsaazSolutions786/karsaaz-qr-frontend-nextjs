'use client'

import React, { useEffect, useState } from 'react'
import { Star, MapPin, ExternalLink, MessageSquare, CheckCircle, Building2 } from 'lucide-react'
import PreviewHeader from '@/components/public/shared/PreviewHeader'
import PreviewFooter from '@/components/public/shared/PreviewFooter'
import QRCodeBadge from '@/components/public/shared/QRCodeBadge'
import { useTranslation } from '@/lib/i18n'

interface GoogleReviewData {
  businessName: string
  logo?: string
  location?: string
  placeId?: string
  reviewUrl?: string
  googleMapsUrl?: string
  averageRating?: number
  totalReviews?: number
  customMessage?: string
  starRatingPrompt?: number
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
}

interface GoogleReviewPreviewProps {
  data: GoogleReviewData
}

/**
 * Purpose: Executes GoogleReviewPreview functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function GoogleReviewPreview({ data }: GoogleReviewPreviewProps) {
  const { t } = useTranslation()
  const [redirecting, setRedirecting] = useState(false)
  const primaryColor = data.theme?.primaryColor || '#4285f4'
  const bgColor = data.theme?.backgroundColor || '#f8f9fa'

  const googleReviewUrl = data.reviewUrl
    ? data.reviewUrl
    : data.placeId
      ? `https://search.google.com/local/writereview?placeid=${data.placeId}`
      : null

  useEffect(() => {
    // Auto-redirect after 3 seconds if we have a direct URL
    if (googleReviewUrl) {
      const timer = setTimeout(() => {
        setRedirecting(true)
        window.location.href = googleReviewUrl
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [googleReviewUrl])

  /**
   * Purpose: Executes renderStars functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const renderStars = (rating: number, size = 'w-6 h-6') => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
              ? 'fill-yellow-400/50 text-yellow-400'
              : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: bgColor }}
    >
      <PreviewHeader
        logo={data.logo}
        title={data.businessName}
        subtitle={t('Google Review')}
      />

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header Section */}
            <div
              className="px-8 py-10 text-center text-white relative overflow-hidden"
              style={{ backgroundColor: primaryColor }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white" />
                <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border-2 border-white" />
              </div>

              <div className="relative z-10">
                {data.logo ? (
                  <img
                    src={data.logo}
                    alt={data.businessName}
                    className="w-20 h-20 mx-auto mb-4 rounded-full object-cover ring-4 ring-white/30 shadow-lg"
                  />
                ) : (
                  <div
                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl font-bold ring-4 ring-white/30"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <Building2 className="w-10 h-10" />
                  </div>
                )}
                <h1 className="text-2xl font-bold mb-1">{data.businessName}</h1>
                {data.location && (
                  <div className="flex items-center justify-center gap-1 text-white/80 text-sm mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{data.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Rating Display */}
              {data.averageRating && data.averageRating > 0 && (
                <div className="text-center py-4 bg-gray-50 rounded-xl">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {data.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {renderStars(data.averageRating)}
                  </div>
                  {data.totalReviews && data.totalReviews > 0 && (
                    <p className="text-sm text-gray-500">
                      Based on {data.totalReviews.toLocaleString()} review{data.totalReviews !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}

              {/* Review Prompt */}
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('How was your experience?')}
                </h2>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  {data.customMessage ||
                    'Your feedback helps us improve and helps others make informed decisions. Please take a moment to share your experience on Google.'}
                </p>

                {/* Star Prompt */}
                {data.starRatingPrompt && data.starRatingPrompt > 0 && (
                  <div className="flex items-center justify-center gap-1 mb-5">
                    {renderStars(data.starRatingPrompt, 'w-8 h-8')}
                  </div>
                )}

                {googleReviewUrl ? (
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:brightness-110"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t('Leave a Google Review')}
                  </a>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    {t('Review link not configured')}
                  </div>
                )}
              </div>

              {/* Redirecting indicator */}
              {redirecting && (
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600 animate-pulse">
                  <CheckCircle className="w-4 h-4" />
                  {t('Redirecting to Google Reviews...')}
                </div>
              )}

              {!redirecting && googleReviewUrl && (
                <p className="text-xs text-center text-gray-400">
                  {t('You will be redirected to Google Reviews in a few seconds...')}
                </p>
              )}

              {/* Google Maps Link */}
              {data.googleMapsUrl && (
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm hover:underline transition-colors"
                  style={{ color: primaryColor }}
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('View on Google Maps')}
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <PreviewFooter />
      <QRCodeBadge variant="branded" position="bottom-right" />
    </div>
  )
}
