'use client'

import React from 'react'
import { Star, MapPin, ExternalLink, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface GoogleReviewDesignerProps {
  businessName: string
  location?: string
  placeId?: string
  averageRating?: number
  totalReviews?: number
  googleMapsUrl?: string
  logoUrl?: string
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
}

export default function GoogleReviewDesigner({
  businessName,
  location,
  averageRating = 0,
  totalReviews = 0,
  googleMapsUrl,
  logoUrl,
  theme,
}: GoogleReviewDesignerProps) {
  const primaryColor = theme?.primaryColor || '#4285f4'
  const bgColor = theme?.backgroundColor || '#f8f9fa'

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

  const googleReviewUrl = googleMapsUrl
    ? googleMapsUrl
    : `https://search.google.com/local/writereview?placeid=`

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-md">
        <Card className="overflow-hidden shadow-xl border-0">
          {/* Header */}
          <div
            className="px-6 py-8 text-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={businessName}
                className="w-16 h-16 mx-auto mb-4 rounded-full object-cover ring-4 ring-white/20"
              />
            ) : (
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-white/20"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {businessName.charAt(0)}
              </div>
            )}
            <h1 className="text-2xl font-bold mb-1">{businessName}</h1>
            {location && (
              <div className="flex items-center justify-center gap-1 text-white/80 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
            )}
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Star Rating Display */}
            {averageRating > 0 && (
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {renderStars(averageRating)}
                </div>
                {totalReviews > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Based on {totalReviews.toLocaleString()} review{totalReviews !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}

            {/* Review Prompt */}
            <div className="bg-blue-50 rounded-xl p-5 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">How was your experience?</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your feedback helps us improve. Please take a moment to leave a review on Google.
              </p>
              <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  className="w-full text-white font-semibold"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Leave a Google Review
                </Button>
              </a>
            </div>

            {/* Google Maps Link */}
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm hover:underline"
                style={{ color: primaryColor }}
              >
                <ExternalLink className="w-4 h-4" />
                View on Google Maps
              </a>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">Powered by Karsaaz QR</p>
      </div>
    </div>
  )
}
