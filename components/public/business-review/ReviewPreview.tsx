'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, Calendar, ExternalLink, CheckCircle, Globe } from 'lucide-react';
import PreviewHeader from '@/components/public/shared/PreviewHeader';
import PreviewFooter from '@/components/public/shared/PreviewFooter';
import SocialShare from '@/components/public/shared/SocialShare';
import QRCodeBadge from '@/components/public/shared/QRCodeBadge';
import ReviewForm from './ReviewForm';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified?: boolean;
}

interface PlatformLink {
  platform: string;
  url: string;
  icon?: string;
}

interface BusinessReviewData {
  businessName: string;
  logo?: string;
  reviewMessage?: string;
  platforms?: PlatformLink[];
  reviews?: Review[];
  slug: string;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
  showExistingReviews?: boolean;
  allowMultipleReviews?: boolean;
}

interface ReviewPreviewProps {
  review: BusinessReviewData;
}

const platformIcons: Record<string, string> = {
  google: '🔍',
  facebook: '👥',
  yelp: '🍽️',
  tripadvisor: '✈️',
  trustpilot: '⭐',
  amazon: '📦',
};

export default function ReviewPreview({ review }: ReviewPreviewProps) {
  const [submitted, setSubmitted] = useState(false);
  const reviews = review.reviews || [];
  const primaryColor = review.theme?.primaryColor || '#2563eb';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleReviewSuccess = () => {
    setSubmitted(true);
    // Optionally refetch reviews here
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        const idx = r.rating - 1;
        distribution[idx] = (distribution[idx] ?? 0) + 1;
      }
    });
    return distribution.reverse();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Header */}
      <PreviewHeader
        logo={review.logo}
        title={review.businessName}
        subtitle="Share Your Experience"
        actions={
          <SocialShare
            url={currentUrl}
            title={`Review ${review.businessName}`}
            description={review.reviewMessage}
            size="md"
          />
        }
      />

      <main className="flex-1 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Thank You Message */}
          {submitted && (
            <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-2xl p-6 animate-in fade-in slide-in-from-top duration-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Thank You for Your Review! 🎉
                  </h3>
                  <p className="text-green-700">
                    Your feedback has been submitted successfully. We truly appreciate you taking the time to share your experience with us!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Business Info Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              {review.logo && (
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={review.logo}
                    alt={review.businessName}
                    className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-gray-100"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  How was your experience?
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {review.reviewMessage || `We'd love to hear about your experience with ${review.businessName}. Your feedback helps us serve you better!`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Review Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Review Form Card */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Leave Your Review</h2>
                </div>
                
                <ReviewForm
                  businessName={review.businessName}
                  slug={review.slug}
                  onSuccess={handleReviewSuccess}
                  primaryColor={primaryColor}
                />
              </section>

              {/* Existing Reviews */}
              {review.showExistingReviews && reviews.length > 0 && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">What Others Are Saying</h2>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold text-gray-900">{getAverageRating()}</span>
                      <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                    {getRatingDistribution().map((count, index) => {
                      const stars = 5 - index;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3 mb-2 last:mb-0">
                          <span className="text-sm font-medium text-gray-700 w-12">{stars} star</span>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: primaryColor 
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.slice(0, 10).map((reviewItem) => (
                      <div key={reviewItem.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {reviewItem.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{reviewItem.name}</h4>
                              {reviewItem.isVerified && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      'w-4 h-4',
                                      i < reviewItem.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(reviewItem.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{reviewItem.comment}</p>
                            
                            {/* Review Actions */}
                            <div className="flex items-center gap-4 mt-3">
                              <button className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                Helpful
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Platform Links */}
              {review.platforms && review.platforms.length > 0 && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="w-6 h-6" style={{ color: primaryColor }} />
                    <h2 className="text-xl font-bold text-gray-900">Review Us On</h2>
                  </div>
                  <div className="space-y-3">
                    {review.platforms.map((platform, index) => (
                      <a
                        key={index}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {platformIcons[platform.platform.toLowerCase()] || '🌐'}
                          </span>
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {platform.platform}
                          </span>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </a>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    Your reviews on these platforms help others discover us!
                  </p>
                </section>
              )}

              {/* Why Review Section */}
              <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Why Your Review Matters</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span>Help others make informed decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span>Share your valuable experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span>Help us improve our services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span>Support local businesses</span>
                  </li>
                </ul>
              </section>

              {/* Stats */}
              {reviews.length > 0 && (
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Review Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                        {reviews.length}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Total Reviews</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <div className="text-3xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                        <Star className="w-6 h-6 fill-current" />
                        {getAverageRating()}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Average Rating</div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>

      <PreviewFooter />
      <QRCodeBadge variant="branded" position="bottom-right" />
    </div>
  );
}
