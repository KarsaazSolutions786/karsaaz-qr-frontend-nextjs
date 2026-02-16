"use client";

import { useState, useEffect } from 'react';
import { BlockEditorProps } from '../types';
import { ImageBlockContent } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Image, X, Link, ExternalLink, EyeOff } from 'lucide-react';

/**
 * Image Block
 * A responsive image block with caption, alt text, optional link wrapping, and size controls
 */

export default function ImageBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const imageContent = content as ImageBlockContent;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  // Reset loading state when URL changes
  useEffect(() => {
    requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsLoading(true);
            setHasError(false);
            setImageKey(prev => prev + 1);
          });    });
  }, [imageContent.url]);

  // Handle content changes
  const handleContentChange = (field: keyof ImageBlockContent, value: string | number) => {
    onUpdate({
      content: {
        ...imageContent,
        [field]: value
      }
    });
  };

  // Handle design changes
  const handleDesignChange = (field: keyof typeof design, value: string) => {
    onUpdate({
      design: {
        ...design,
        [field]: value
      }
    });
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Public view (display mode)
  if (!isEditing) {
    const imageWrapper = (
      <div 
        className="block-image"
        style={{ 
          backgroundColor: design.backgroundColor,
          padding: design.padding,
          margin: design.margin,
          borderRadius: design.borderRadius,
          textAlign: 'center'
        }}
      >
        {imageContent.url && !hasError ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Loading state */}
            {isLoading && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem',
                minWidth: '200px',
                minHeight: '200px'
              }}>
                <div className="animate-pulse">
                  <Image size={48} style={{ opacity: 0.3 }} aria-label="Loading image" />
                </div>
              </div>
            )}
            
            {/* Actual image */}
            <img
              key={imageKey} // Add key prop here
              src={imageContent.url}
              alt={imageContent.alt || ''}
              title={imageContent.title || undefined}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: design.borderRadius,
                display: isLoading ? 'none' : 'block',
                width: imageContent.width || 'auto',
                height: imageContent.height || 'auto'
              }}
            />
            
            {/* Caption */}
            {imageContent.caption && !isLoading && !hasError && (
              <div style={{
                marginTop: '0.75rem',
                fontSize: '0.875rem',
                color: design.textColor || '#6b7280',
                fontStyle: 'italic'
              }}>
                {imageContent.caption}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#fef2f2',
            border: '1px dashed #fca5a5',
            borderRadius: '0.5rem',
            color: '#dc2626'
          }}>
            <Image size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <span style={{ fontSize: '0.875rem' }}>
              {hasError ? 'Failed to load image' : 'No image URL provided'}
            </span>
          </div>
        )}
      </div>
    );

    // Wrap with link if provided
    if (imageContent.link) {
      return (
        <a
          href={imageContent.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none',
            display: 'block'
          }}
        >
          {imageWrapper}
        </a>
      );
    }

    return imageWrapper;
  }

  // Edit mode
  return (
    <div className="block-editor-image space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image size={20} />
          <h3 className="text-lg font-semibold">Image Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Image URL */}
        <div>
          <Label htmlFor="image-url">Image URL *</Label>
          <Input
            id="image-url"
            type="url"
            value={imageContent.url || ''}
            onChange={(e) => handleContentChange('url', e.target.value)}
            placeholder="https://example.com/image.jpg"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter a valid image URL (JPG, PNG, GIF, WebP, etc.)
          </p>
          {hasError && imageContent.url && (
            <p className="text-xs text-destructive mt-1">
              Unable to load image. Please check the URL.
            </p>
          )}
        </div>

        {/* Alt Text */}
        <div>
          <Label htmlFor="image-alt">Alt Text (Accessibility)</Label>
          <Input
            id="image-alt"
            value={imageContent.alt || ''}
            onChange={(e) => handleContentChange('alt', e.target.value)}
            placeholder="Description of the image for screen readers"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Important for accessibility and SEO
          </p>
        </div>

        {/* Title */}
        <div>
          <Label htmlFor="image-title">Title (Tooltip)</Label>
          <Input
            id="image-title"
            value={imageContent.title || ''}
            onChange={(e) => handleContentChange('title', e.target.value)}
            placeholder="Text shown on hover"
          />
        </div>

        {/* Caption */}
        <div>
          <Label htmlFor="image-caption">Caption</Label>
          <Textarea
            id="image-caption"
            value={imageContent.caption || ''}
            onChange={(e) => handleContentChange('caption', e.target.value)}
            placeholder="Optional caption text displayed below the image"
            rows={2}
          />
        </div>

        {/* Link URL */}
        <div>
          <Label htmlFor="image-link">Link URL (Optional)</Label>
          <div className="flex gap-2">
            <Link size={16} className="mt-2 text-muted-foreground" />
            <Input
              id="image-link"
              type="url"
              value={imageContent.link || ''}
              onChange={(e) => handleContentChange('link', e.target.value)}
              placeholder="https://example.com (makes image clickable)"
              className="flex-1"
            />
          </div>
        </div>

        {/* Size Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="image-width">Width</Label>
            <Input
              id="image-width"
              value={imageContent.width || ''}
              onChange={(e) => handleContentChange('width', e.target.value)}
              placeholder="auto"
            />
            <p className="text-xs text-muted-foreground mt-1">
              e.g., 100%, 300px, 20rem
            </p>
          </div>
          <div>
            <Label htmlFor="image-height">Height</Label>
            <Input
              id="image-height"
              value={imageContent.height || ''}
              onChange={(e) => handleContentChange('height', e.target.value)}
              placeholder="auto"
            />
            <p className="text-xs text-muted-foreground mt-1">
              e.g., 200px, 15rem, auto
            </p>
          </div>
        </div>

        {/* Design Controls */}
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-semibold">Design Settings</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="design-padding">Padding</Label>
              <Input
                id="design-padding"
                value={design.padding || ''}
                onChange={(e) => handleDesignChange('padding', e.target.value)}
                placeholder="1rem"
              />
            </div>
            <div>
              <Label htmlFor="design-margin">Margin</Label>
              <Input
                id="design-margin"
                value={design.margin || ''}
                onChange={(e) => handleDesignChange('margin', e.target.value)}
                placeholder="0.5rem"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="design-bg-color">Background Color</Label>
              <Input
                id="design-bg-color"
                type="color"
                value={design.backgroundColor || '#ffffff'}
                onChange={(e) => handleDesignChange('backgroundColor', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="design-text-color">Caption Text Color</Label>
              <Input
                id="design-text-color"
                type="color"
                value={design.textColor || '#6b7280'}
                onChange={(e) => handleDesignChange('textColor', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="design-border-radius">Border Radius</Label>
            <Input
              id="design-border-radius"
              value={design.borderRadius || ''}
              onChange={(e) => handleDesignChange('borderRadius', e.target.value)}
              placeholder="0.5rem"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Preview</h4>
            {hasError ? (
              <span className="text-xs text-destructive">Error loading image</span>
            ) : isLoading && imageContent.url ? (
              <span className="text-xs text-muted-foreground">Loading...</span>
            ) : null}
          </div>
          
          <div className="border rounded-lg p-4 bg-muted/20">
            {!imageContent.url ? (
              <div className="text-center py-8 text-muted-foreground">
                <Image size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Enter an image URL to see preview</p>
              </div>
            ) : hasError ? (
              <div className="text-center py-8 text-destructive">
                <div className="flex items-center justify-center gap-2">
                  <EyeOff size={24} />
                  <p className="text-sm">Failed to load image</p>
                </div>
                <p className="text-xs mt-1 text-destructive/80">
                  Check the URL and try again
                </p>
              </div>
            ) : (
              <div className="text-center">
                <img
                  src={imageContent.url}
                  alt={imageContent.alt || 'Preview'}
                  className="max-w-full h-auto mx-auto rounded"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    width: imageContent.width || 'auto',
                    height: imageContent.height || 'auto',
                    maxHeight: '300px'
                  }}
                />
                {imageContent.caption && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    {imageContent.caption}
                  </p>
                )}
                {imageContent.link && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <ExternalLink size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Linked to: {imageContent.link}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}