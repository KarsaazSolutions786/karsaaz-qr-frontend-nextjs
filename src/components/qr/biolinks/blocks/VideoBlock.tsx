"use client";

import { useState, useEffect } from 'react';
import { BlockEditorProps, VideoBlockContent } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Video, AlertCircle, X, Eye, EyeOff } from 'lucide-react';

/**
 * Video Block
 * Embed videos from YouTube, Vimeo, or custom URLs with responsive iframe
 */

// Detect platform from URL
const detectPlatform = (url: string): 'youtube' | 'vimeo' | 'custom' => {
  if (!url) return 'custom';
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (lowerUrl.includes('vimeo.com')) {
    return 'vimeo';
  }
  
  return 'custom';
};

// Extract video ID from YouTube URL
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Extract video ID from Vimeo URL
const extractVimeoId = (url: string): string | null => {
  const pattern = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
};

// Validate URL format
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return /^https?:\/\/.+/.test(url);
  }
};

// Get embed URL based on platform
const getEmbedUrl = (content: VideoBlockContent): string | null => {
  const { url, platform, autoplay, controls, privacyMode } = content;
  
  if (!url || !isValidUrl(url)) return null;
  
  if (platform === 'youtube') {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;
    
    const domain = privacyMode ? 'www.youtube-nocookie.com' : 'www.youtube.com';
    const params = new URLSearchParams();
    
    if (autoplay) params.append('autoplay', '1');
    if (!controls) params.append('controls', '0');
    params.append('rel', '0'); // Disable related videos
    params.append('modestbranding', '1'); // Minimal YouTube branding
    
    return `https://${domain}/embed/${videoId}?${params.toString()}`;
  }
  
  if (platform === 'vimeo') {
    const videoId = extractVimeoId(url);
    if (!videoId) return null;
    
    const params = new URLSearchParams();
    
    if (autoplay) params.append('autoplay', '1');
    if (!controls) params.append('controls', '0');
    params.append('title', '0');
    params.append('byline', '0');
    params.append('portrait', '0');
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }
  
  // For custom URLs, return as-is (assuming it's already an embed URL or direct video URL)
  return url;
};

// Get thumbnail URL
const getThumbnailUrl = (url: string, platform?: string): string | null => {
  if (!url) return null;
  
  if (platform === 'youtube') {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      // YouTube provides several thumbnail qualities
      // Using maxresdefault for highest quality, falling back to hqdefault
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  if (platform === 'vimeo') {
    // Vimeo thumbnails require API access, so we'll skip for now
    // Could be enhanced with a backend API call to Vimeo
    return null;
  }
  
  return null;
};

export default function VideoBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const [urlError, setUrlError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { content, design } = block;
  const videoContent = content as VideoBlockContent;

  // Auto-detect platform when URL changes
  useEffect(() => {
    if (videoContent.url && !videoContent.platform) {
      const detectedPlatform = detectPlatform(videoContent.url);
      if (detectedPlatform !== 'custom') {
        onUpdate({
          content: {
            ...videoContent,
            platform: detectedPlatform
          }
        });
      }
    }
  }, [videoContent.url, onUpdate]);

  // Handle input changes
  const handleContentChange = (field: string, value: string | boolean) => {
    const updatedContent = {
      ...videoContent,
      [field]: value
    };

    // Auto-detect platform when URL changes
    if (field === 'url') {
      const detectedPlatform = detectPlatform(value);
      if (detectedPlatform !== 'custom') {
        updatedContent.platform = detectedPlatform;
      }
      
      // Validate URL
      if (value && !isValidUrl(value)) {
        setUrlError('Please enter a valid URL (must start with http:// or https://)');
      } else {
        setUrlError(null);
      }
    }

    onUpdate({
      content: updatedContent
    });
  };

  const handleDesignChange = (field: keyof typeof design, value: string) => {
    onUpdate({
      design: {
        ...design,
        [field]: value
      }
    });
  };

  const embedUrl = getEmbedUrl(videoContent);
  const thumbnailUrl = getThumbnailUrl(videoContent.url, videoContent.platform);
  const hasValidUrl = videoContent.url && isValidUrl(videoContent.url) && embedUrl !== null;

  // Render public view
  if (!isEditing) {
    return (
      <div 
        className="block-video" 
        style={{ 
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
        }}
      >
        <div style={{ width: '100%' }}>
          {/* Video Title */}
          {videoContent.title && (
            <h3 style={{ 
              color: design.textColor,
              marginBottom: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              {videoContent.title}
            </h3>
          )}

          {/* Video Description */}
          {videoContent.description && (
            <p style={{ 
              color: design.textColor,
              opacity: 0.8,
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {videoContent.description}
            </p>
          )}

          {/* Video Embed */}
          {hasValidUrl ? (
            <div 
              style={{ 
                position: 'relative',
                paddingBottom: '56.25%', // 16:9 aspect ratio
                height: 0,
                overflow: 'hidden',
                borderRadius: '8px',
                backgroundColor: '#000'
              }}
            >
              <iframe
                src={embedUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px'
                }}
                allow={videoContent.autoplay ? 'autoplay; encrypted-media' : 'encrypted-media'}
                allowFullScreen
                title={videoContent.title || 'Embedded video'}
              />
            </div>
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '2px dashed #d1d5db'
            }}>
              <Video size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p style={{ color: '#6b7280' }}>No valid video URL provided</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render editor interface
  return (
    <div className="block-editor-video space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Video Block</h3>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Video URL */}
        <div>
          <Label>Video URL</Label>
          <Input
            type="url"
            value={videoContent.url || ''}
            onChange={(e) => handleContentChange('url', e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            required
          />
          
          {urlError && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
              <AlertCircle size={14} />
              <span>{urlError}</span>
            </div>
          )}

          {videoContent.url && !urlError && videoContent.platform && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <Eye size={14} />
              <span>Detected: {videoContent.platform.charAt(0).toUpperCase() + videoContent.platform.slice(1)}</span>
            </div>
          )}
        </div>

        {/* Platform Selection */}
        <div>
          <Label>Platform</Label>
          <Select
            value={videoContent.platform || 'custom'}
            onValueChange={(value) => handleContentChange('platform', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="vimeo">Vimeo</SelectItem>
              <SelectItem value="custom">Custom/Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div>
          <Label>Title (optional)</Label>
          <Input
            value={videoContent.title || ''}
            onChange={(e) => handleContentChange('title', e.target.value)}
            placeholder="Video title"
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description (optional)</Label>
          <Textarea
            value={videoContent.description || ''}
            onChange={(e) => handleContentChange('description', e.target.value)}
            placeholder="Video description"
            rows={3}
          />
        </div>

        {/* Video Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="controls">Show Controls</Label>
            <Switch
              id="controls"
              checked={videoContent.controls !== false} // Default to true
              onCheckedChange={(checked) => handleContentChange('controls', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoplay">Autoplay</Label>
              <p className="text-sm text-gray-500">May be blocked by browsers</p>
            </div>
            <Switch
              id="autoplay"
              checked={videoContent.autoplay || false}
              onCheckedChange={(checked) => handleContentChange('autoplay', checked)}
            />
          </div>

          {videoContent.platform === 'youtube' && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="privacyMode">Privacy Mode (No Cookies)</Label>
                <p className="text-sm text-gray-500">YouTube won't store cookies</p>
              </div>
              <Switch
                id="privacyMode"
                checked={videoContent.privacyMode || false}
                onCheckedChange={(checked) => handleContentChange('privacyMode', checked)}
              />
            </div>
          )}
        </div>

        {/* Preview */}
        {hasValidUrl && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Preview</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                <span className="ml-2">{showPreview ? 'Hide' : 'Show'} Preview</span>
              </Button>
            </div>

            {showPreview && (
              <div 
                style={{ 
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '8px',
                  backgroundColor: '#000'
                }}
              >
                <iframe
                  src={embedUrl}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allow={videoContent.autoplay ? 'autoplay; encrypted-media' : 'encrypted-media'}
                  allowFullScreen
                  title="Video preview"
                />
              </div>
            )}
          </div>
        )}

        {/* Thumbnail Preview */}
        {thumbnailUrl && (
          <div className="border-t pt-4">
            <Label>Thumbnail Preview</Label>
            <div className="mt-2" style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '8px'
            }}>
              <img
                src={thumbnailUrl}
                alt="Video thumbnail"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  // If high-res thumbnail fails, try fallback
                  const fallbackUrl = thumbnailUrl.replace(&apos;maxresdefault&apos;, &apos;hqdefault&apos;);
                  (e.target as HTMLImageElement).src = fallbackUrl;
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
