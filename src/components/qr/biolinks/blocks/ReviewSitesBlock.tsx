"use client";

import { useState, useMemo } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, StarHalf, Globe, X, Plus, Trash2, ExternalLink, MessageSquare, Award, ShieldCheck, TrendingUp, Users, Facebook, MapPin, Calendar, Building, Phone, Pencil } from 'lucide-react';

/**
 * Review Sites Block
 * Display customer reviews from multiple platforms with ratings and review counts
 * Features:
 * - Multiple review platform support (Google, Yelp, TripAdvisor, Facebook, etc.)
 * - Star rating display with review counts
 * - Platform-specific icons and colors
 * - Average rating calculation
 * - Direct review links
 * - Review collection CTA
 * - Trust indicators
 * - Both edit and public view modes
 * - Responsive design
 */

// Interface for individual review platform
interface ReviewPlatform {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  url: string;
  icon: React.ElementType;
  color: string;
  reviewUrl?: string;
  lastUpdated?: string;
  verified?: boolean;
}

// Platform configuration
interface PlatformConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  reviewUrlTemplate?: string;
  placeholder: string;
}

// Available review platforms configuration
const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  google: {
    id: 'google',
    name: 'Google',
    icon: Globe,
    color: '#4285F4',
    reviewUrlTemplate: 'https://search.google.com/local/writereview?placeid={placeId}',
    placeholder: 'Enter Google Business Place ID'
  },
  yelp: {
    id: 'yelp',
    name: 'Yelp',
    icon: MapPin,
    color: '#FF1A1A',
    reviewUrlTemplate: 'https://www.yelp.com/writeareview/biz/{businessId}',
    placeholder: 'Enter Yelp Business ID'
  },
  tripadvisor: {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    icon: Calendar,
    color: '#00AA6C',
    reviewUrlTemplate: 'https://www.tripadvisor.com/UserReview-{locationId}',
    placeholder: 'Enter TripAdvisor Location ID'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: '#1877F2',
    reviewUrlTemplate: 'https://www.facebook.com/{pageId}/reviews',
    placeholder: 'Enter Facebook Page ID'
  },
  trustpilot: {
    id: 'trustpilot',
    name: 'Trustpilot',
    icon: ShieldCheck,
    color: '#00B67A',
    reviewUrlTemplate: 'https://www.trustpilot.com/review/{domain}',
    placeholder: 'Enter your domain'
  },
  booking: {
    id: 'booking',
    name: 'Booking.com',
    icon: Building,
    color: '#003580',
    reviewUrlTemplate: 'https://www.booking.com/hotel/{propertyId}.html#reviews',
    placeholder: 'Enter Booking.com Property ID'
  },
  custom: {
    id: 'custom',
    name: 'Custom Platform',
    icon: Globe,
    color: '#6B7280',
    placeholder: 'Enter direct review URL'
  }
};

// Rating display component
function RatingStars({ rating, reviewCount, showCount = true, showText = false, size = 'default' }: {
  rating?: number;
  reviewCount?: number;
  showCount?: boolean;
  showText?: boolean;
  size?: 'sm' | 'default' | 'lg';
}) {
  if (!rating || rating === 0) return null;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className={`${starSize} fill-yellow-400 text-yellow-400`} />
          ))}
          {hasHalfStar && (
            <div className="relative">
              <Star className={`${starSize} text-gray-300`} />
              <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
              </div>
            </div>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className={`${starSize} text-gray-300`} />
          ))}
        </div>
        {showText && (
          <span className={`${textSize} font-medium`}>
            {rating.toFixed(1)}
          </span>
        )}
      </div>
      {reviewCount && showCount && (
        <span className={`${textSize} text-muted-foreground`}>
          {reviewCount.toLocaleString()} {showText ? 'reviews' : ''}
        </span>
      )}
    </div>
  );
}

// Average rating component
function AverageRatingDisplay({ platforms }: { platforms: ReviewPlatform[] }) {
  const totalRatings = platforms.reduce((sum, p) => sum + (p.rating * p.reviewCount), 0);
  const totalReviews = platforms.reduce((sum, p) => sum + p.reviewCount, 0);
  const averageRating = totalReviews > 0 ? totalRatings / totalReviews : 0;

  if (averageRating === 0) return null;

  return (
    <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <div className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</div>
        <div className="text-sm text-muted-foreground">Average Rating</div>
      </div>
      
      <div className="flex-1">
        <RatingStars rating={averageRating} reviewCount={totalReviews} showText={true} size="lg" />
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{totalReviews.toLocaleString()} Total Reviews</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>Across {platforms.length} Platforms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Platform card component
function PlatformCard({ platform, isEditing, onEdit, onDelete }: {
  platform: ReviewPlatform;
  isEditing: boolean;
  onEdit?: (platform: ReviewPlatform) => void;
  onDelete?: (platformId: string) => void;
}) {
  const PlatformIcon = PLATFORM_CONFIGS[platform.id]?.icon || Globe;
  const platformColor = PLATFORM_CONFIGS[platform.id]?.color || '#6B7280';

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(platform)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(platform.id)}
              className="h-8 w-8 p-0 text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-2">
          <PlatformIcon 
            className="w-5 h-5" 
            style={{ color: platformColor }}
          />
          <CardTitle className="text-lg">{platform.name}</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-2">
          {platform.verified && (
            <ShieldCheck className="w-3 h-3 text-green-500" />
          )}
          {platform.lastUpdated && (
            <span className="text-xs">Updated {platform.lastUpdated}</span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <RatingStars
              rating={platform.rating}
              reviewCount={platform.reviewCount}
              size="default"
              showText={true}
            />
          </div>
          
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
               style={{ backgroundColor: `${platformColor}20` }}>
            <PlatformIcon className="w-6 h-6" style={{ color: platformColor }} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => window.open(platform.url, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Reviews
        </Button>
        
        {platform.reviewUrl && (
          <Button
            className="flex-1"
            onClick={() => window.open(platform.reviewUrl, '_blank', 'noopener,noreferrer')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Leave Review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function ReviewSitesBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  
  const reviewContent = content as {
    platforms: ReviewPlatform[];
    showAverageRating?: boolean;
    showPlatformIcons?: boolean;
    showReviewCount?: boolean;
    showTrustIndicators?: boolean;
    enableReviewCollection?: boolean;
    collectionTitle?: string;
    collectionSubtitle?: string;
    customReviewUrl?: string;
    headerAlignment?: 'left' | 'center' | 'right';
    columns?: 1 | 2 | 3 | 4;
    style?: 'cards' | 'compact' | 'list';
  };

  const [newPlatform, setNewPlatform] = useState<string>('google');
  const [editingPlatform, setEditingPlatform] = useState<ReviewPlatform | null>(null);

  // Handle content changes
  const handleContentChange = (field: string, value: string | boolean | number | ReviewPlatform[]) => {
    onUpdate({
      content: {
        ...reviewContent,
        [field]: value
      }
    });
  };

  // Add new platform
  const addPlatform = () => {
    const platformId = newPlatform;
    const platformConfig = PLATFORM_CONFIGS[platformId];
    
    if (!platformConfig) return;

    const newPlatformData: ReviewPlatform = {
      id: platformId,
      name: platformConfig.name,
      rating: 5.0,
      reviewCount: 0,
      url: '',
      icon: platformConfig.icon,
      color: platformConfig.color,
      verified: false,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    handleContentChange('platforms', [...(reviewContent.platforms || []), newPlatformData]);
  };

  // Remove platform
  const removePlatform = (platformId: string) => {
    const updatedPlatforms = reviewContent.platforms?.filter(p => p.id !== platformId) || [];
    handleContentChange('platforms', updatedPlatforms);
  };

  // Update platform
  const updatePlatform = (platformId: string, updates: Partial<ReviewPlatform>) => {
    const updatedPlatforms = reviewContent.platforms?.map(platform => 
      platform.id === platformId ? { ...platform, ...updates } : platform
    ) || [];
    handleContentChange('platforms', updatedPlatforms);
  };

  // Get columns CSS class
  const getColumnsClass = () => {
    switch (reviewContent.columns || 3) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Public view
  if (!isEditing) {
    if (!reviewContent.platforms || reviewContent.platforms.length === 0) {
      return null;
    }

    return (
      <div 
        className="block-review-sites"
        style={{ 
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
        }}
      >
        <div className="space-y-6">
          {/* Header with average rating */}
          {reviewContent.showAverageRating && reviewContent.platforms.length > 0 && (
            <div className={reviewContent.headerAlignment === 'center' ? 'text-center' : 
                           reviewContent.headerAlignment === 'right' ? 'text-right' : 'text-left'}>
              <AverageRatingDisplay platforms={reviewContent.platforms} />
            </div>
          )}

          {/* Trust indicators */}
          {reviewContent.showTrustIndicators && (
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm">Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm">Real Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm">Trusted Platforms</span>
              </div>
            </div>
          )}

          {/* Review platforms grid */}
          <div className={`grid ${getColumnsClass()} gap-6`}>
            {reviewContent.platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                isEditing={false}
              />
            ))}
          </div>

          {/* Review collection CTA */}
          {reviewContent.enableReviewCollection && (
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">
                    {reviewContent.collectionTitle || 'Share Your Experience'}
                  </h3>
                  <p className="text-blue-100">
                    {reviewContent.collectionSubtitle || 'Your feedback helps us improve and helps others make informed decisions.'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {reviewContent.platforms.map((platform) => (
                      <Button
                        key={platform.id}
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(platform.reviewUrl || platform.url, '_blank', 'noopener,noreferrer')}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Review on {platform.name}
                      </Button>
                    ))}
                    {reviewContent.customReviewUrl && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(reviewContent.customReviewUrl, '_blank', 'noopener,noreferrer')}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Leave a Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Editor view
  return (
    <div className="block-editor-review-sites space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Review Sites Block</h3>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      {/* Add new platform */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PLATFORM_CONFIGS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="w-4 h-4" style={{ color: config.color }} />
                        {config.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addPlatform}>
              <Plus className="w-4 h-4 mr-2" />
              Add Platform
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform list */}
      {reviewContent.platforms && reviewContent.platforms.length > 0 && (
        <div className="space-y-4">
          {reviewContent.platforms.map((platform) => {
            const PlatformIcon = PLATFORM_CONFIGS[platform.id]?.icon || Globe;
            const platformConfig = PLATFORM_CONFIGS[platform.id];
            
            return (
              <Card key={platform.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <PlatformIcon className="w-5 h-5" style={{ color: platformConfig?.color }} />
                      <h4 className="font-medium">{platform.name}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlatform(platform.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Profile URL</Label>
                      <Input
                        type="url"
                        value={platform.url}
                        onChange={(e) => updatePlatform(platform.id, { url: e.target.value })}
                        placeholder={`${platform.name} business page URL`}
                      />
                    </div>

                    <div>
                      <Label>Review URL (Optional)</Label>
                      <Input
                        type="url"
                        value={platform.reviewUrl || ''}
                        onChange={(e) => updatePlatform(platform.id, { reviewUrl: e.target.value })}
                        placeholder="Direct link to leave a review"
                      />
                    </div>

                    <div>
                      <Label>Rating (0-5)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={platform.rating}
                        onChange={(e) => updatePlatform(platform.id, { rating: parseFloat(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <Label>Review Count</Label>
                      <Input
                        type="number"
                        min="0"
                        value={platform.reviewCount}
                        onChange={(e) => updatePlatform(platform.id, { reviewCount: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={platform.verified || false}
                        onCheckedChange={(checked) => updatePlatform(platform.id, { verified: checked })}
                      />
                      <Label>Verified Reviews</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Label className="text-sm text-muted-foreground">Last Updated:</Label>
                      <Input
                        type="date"
                        value={platform.lastUpdated || new Date().toISOString().split('T')[0]}
                        onChange={(e) => updatePlatform(platform.id, { lastUpdated: e.target.value })}
                        className="w-auto"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Global settings */}
      <Card>
        <CardHeader>
          <CardTitle>Block Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Layout Style</Label>
              <Select
                value={reviewContent.style || 'cards'}
                onValueChange={(value) => handleContentChange('style', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Columns</Label>
              <Select
                value={String(reviewContent.columns || 3)}
                onValueChange={(value) => handleContentChange('columns', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={reviewContent.showAverageRating ?? true}
                onCheckedChange={(checked) => handleContentChange('showAverageRating', checked)}
              />
              <Label>Show Average Rating</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={reviewContent.showTrustIndicators ?? true}
                onCheckedChange={(checked) => handleContentChange('showTrustIndicators', checked)}
              />
              <Label>Show Trust Indicators</Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={reviewContent.enableReviewCollection ?? true}
              onCheckedChange={(checked) => handleContentChange('enableReviewCollection', checked)}
            />
            <Label>Enable Review Collection CTA</Label>
          </div>

          {reviewContent.enableReviewCollection && (
            <>
              <div>
                <Label>Collection Title</Label>
                <Input
                  value={reviewContent.collectionTitle || ''}
                  onChange={(e) => handleContentChange('collectionTitle', e.target.value)}
                  placeholder="Share Your Experience"
                />
              </div>

              <div>
                <Label>Collection Subtitle</Label>
                <Input
                  value={reviewContent.collectionSubtitle || ''}
                  onChange={(e) => handleContentChange('collectionSubtitle', e.target.value)}
                  placeholder="Your feedback helps us improve..."
                />
              </div>

              <div>
                <Label>Custom Review URL (Optional)</Label>
                <Input
                  type="url"
                  value={reviewContent.customReviewUrl || ''}
                  onChange={(e) => handleContentChange('customReviewUrl', e.target.value)}
                  placeholder="https://example.com/leave-review"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
