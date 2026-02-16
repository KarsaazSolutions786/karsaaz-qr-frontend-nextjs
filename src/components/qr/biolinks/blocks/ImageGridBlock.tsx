"use client";

import { useState, useEffect } from 'react';
import { BlockEditorProps } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Image, Plus, ExternalLink, Eye, Grid3x3, LayoutGrid } from 'lucide-react';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Image Grid Block
 * Display multiple images in a responsive grid layout with lightbox support
 */

interface ImageItem {
  url: string;
  alt?: string;
  title?: string;
  caption?: string;
  link?: string;
  id?: string;
}

interface ImageGridBlockContent {
  images?: ImageItem[];
  columns?: number;
  gap?: string;
}

export default function ImageGridBlock({ block, onUpdate, onDelete, isEditing = false }: BlockEditorProps) {
  const { content, design } = block;
  const gridContent = content as ImageGridBlockContent;
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});
  const [imageErrorStates, setImageErrorStates] = useState<Record<string, boolean>>({});

  // Initialize default values
  const images = gridContent.images || [];
  const columns = gridContent.columns || 2;
  const gap = gridContent.gap || '1rem';

  // Generate grid column classes based on columns count and responsive behavior
  const getGridColumnClasses = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2';
    }
  };

  // Handle content changes
  const handleContentChange = (field: keyof ImageGridBlockContent, value: ImageItem[] | number | string) => {
    onUpdate({
      content: {
        ...gridContent,
        [field]: value
      }
    });
  };

  // Handle image item changes
  const handleImageItemChange = (index: number, field: keyof ImageItem, value: string) => {
    const updatedImages = [...images];
    if (!updatedImages[index]) {
      updatedImages[index] = { url: '', alt: '', title: '', caption: '', link: '' };
    }
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value
    };
    handleContentChange('images', updatedImages);
  };

  // Add new image item
  const addImageItem = () => {
    const newImage: ImageItem = {
      url: '',
      alt: '',
      title: '',
      caption: '',
      link: '',
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    handleContentChange('images', [...images, newImage]);
  };

  // Remove image item
  const removeImageItem = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    handleContentChange('images', updatedImages);
  };

  // Handle image load
  const handleImageLoad = (imageId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: false }));
    setImageErrorStates(prev => ({ ...prev, [imageId]: false }));
  };

  // Handle image error
  const handleImageError = (imageId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [imageId]: false }));
    setImageErrorStates(prev => ({ ...prev, [imageId]: true }));
  };

  // Open lightbox
  const openLightbox = (image: ImageItem) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  // Render single image item
  const renderImage = (image: ImageItem, index: number) => {
    const imageId = image.id || `img_${index}`;
    const isLoading = imageLoadingStates[imageId] !== false && image.url;
    const hasError = imageErrorStates[imageId];

    const imageContent = (
      <div className="relative w-full">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center bg-gray-100 rounded-lg aspect-square">
            <div className="animate-pulse">
              <Image size={32} className="opacity-30" />
            </div>
          </div>
        )}

        {/* Actual Image */}
        {image.url && !hasError && (
          <img
            src={image.url}
            alt={image.alt || ''}
            title={image.title || undefined}
            onLoad={() => handleImageLoad(imageId)}
            onError={() => handleImageError(imageId)}
            className={`w-full h-auto rounded-lg cursor-pointer transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ aspectRatio: 'auto' }}
            onClick={() => openLightbox(image)}
          />
        )}

        {/* Error State */}
        {hasError && (
          <div className="flex items-center justify-center bg-red-50 border border-red-200 rounded-lg aspect-square">
            <Image size={24} className="text-red-500 opacity-50" />
          </div>
        )}

        {/* No Image State */}
        {!image.url && (
          <div className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg aspect-square">
            <Image size={24} className="text-gray-400" />
          </div>
        )}

        {/* Caption Overlay (Public View) */}
        {image.caption && !hasError && image.url && !isEditing && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-sm p-2 rounded-b-lg">
            <p className="truncate">{image.caption}</p>
          </div>
        )}
      </div>
    );

    // Wrap with link if provided
    if (image.link && !isEditing) {
      return (
        <a
          href={image.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          {imageContent}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink size={16} className="text-white bg-black bg-opacity-50 rounded p-1" />
          </div>
        </a>
      );
    }

    return imageContent;
  };

  // Public view
  if (!isEditing) {
    if (!images || images.length === 0) {
      return (
        <div
          className="block-image-grid"
          style={{
            backgroundColor: design.backgroundColor,
            padding: design.padding,
            margin: design.margin,
            borderRadius: design.borderRadius,
          }}
        >
          <div className="text-center py-8 text-gray-500">
            <LayoutGrid size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No images in grid</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div
          className="block-image-grid"
          style={{
            backgroundColor: design.backgroundColor,
            padding: design.padding,
            margin: design.margin,
            borderRadius: design.borderRadius,
          }}
        >
          <div
            className={`grid ${getGridColumnClasses()} gap-4`}
            style={{ gap }}
          >
            {images.map((image, index) => (
              <div key={image.id || index} className="relative">
                {renderImage(image, index)}
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        <Dialog open={lightboxOpen} onClose={closeLightbox} className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title || &apos;Image Preview&apos;}</DialogTitle>
            <DialogDescription>
              {selectedImage?.caption || &apos;Click outside to close&apos;}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedImage?.url && (
              <img
                src={selectedImage.url}
                alt={selectedImage.alt || ''}
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: '70vh', objectFit: 'contain' }}
              />
            )}
            {selectedImage?.caption && (
              <p className="text-center text-sm text-gray-600 mt-4">
                {selectedImage.caption}
              </p>
            )}
            {selectedImage?.link && (
              <div className="text-center mt-2">
                <a
                  href={selectedImage.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
                >
                  <ExternalLink size={14} />
                  Open Link
                </a>
              </div>
            )}
          </div>
        </Dialog>
      </>
    );
  }

  // Edit view
  return (
    <div className="block-editor-image-grid space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid size={20} />
          <h3 className="text-lg font-semibold">Image Grid Block</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <X size={16} />
        </Button>
      </div>

      {/* Grid Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="grid-columns">Columns</Label>
          <Select
            value={columns.toString()}
            onValueChange={(value) => handleContentChange('columns', parseInt(value))}
          >
            <SelectTrigger id="grid-columns">
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

        <div>
          <Label htmlFor="grid-gap">Grid Gap</Label>
          <Input
            id="grid-gap"
            value={gap}
            onChange={(e) => handleContentChange('gap', e.target.value)}
            placeholder="1rem"
          />
          <p className="text-xs text-muted-foreground mt-1">
            CSS spacing value (px, rem, etc.)
          </p>
        </div>
      </div>

      {/* Design Settings */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold mb-4">Design Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="design-padding">Padding</Label>
            <Input
              id="design-padding"
              value={design.padding || ''}
              onChange={(e) => onUpdate({
                design: { ...design, padding: e.target.value }
              })}
              placeholder="1rem"
            />
          </div>
          <div>
            <Label htmlFor="design-margin">Margin</Label>
            <Input
              id="design-margin"
              value={design.margin || ''}
              onChange={(e) => onUpdate({
                design: { ...design, margin: e.target.value }
              })}
              placeholder="0.5rem 0"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="design-bg-color">Background Color</Label>
            <Input
              id="design-bg-color"
              type="color"
              value={design.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdate({
                design: { ...design, backgroundColor: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="design-border-radius">Border Radius</Label>
            <Input
              id="design-border-radius"
              value={design.borderRadius || ''}
              onChange={(e) => onUpdate({
                design: { ...design, borderRadius: e.target.value }
              })}
              placeholder="8px"
            />
          </div>
        </div>
      </div>

      {/* Image Items */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold">Images ({images.length})</h4>
          <Button onClick={addImageItem} size="sm">
            <Plus size={16} className="mr-2" />
            Add Image
          </Button>
        </div>

        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={image.id || index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium">Image {index + 1}</h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImageItem(index)}
                >
                  <X size={14} />
                </Button>
              </div>

              {/* Image Preview */}
              {image.url && (
                <div className="border rounded p-2">
                  {renderImage(image, index)}
                  {!imageErrorStates[image.id || `img_${index}`] && image.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => openLightbox(image)}
                    >
                      <Eye size={14} className="mr-2" />
                      Preview
                    </Button>
                  )}
                </div>
              )}

              {/* Image Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor={`image-url-${index}`}>Image URL *</Label>
                  <Input
                    id={`image-url-${index}`}
                    type="url"
                    value={image.url || ''}
                    onChange={(e) => handleImageItemChange(index, 'url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor={`image-alt-${index}`}>Alt Text</Label>
                  <Input
                    id={`image-alt-${index}`}
                    value={image.alt || ''}
                    onChange={(e) => handleImageItemChange(index, 'alt', e.target.value)}
                    placeholder="Description for accessibility"
                  />
                </div>

                <div>
                  <Label htmlFor={`image-title-${index}`}>Title</Label>
                  <Input
                    id={`image-title-${index}`}
                    value={image.title || ''}
                    onChange={(e) => handleImageItemChange(index, 'title', e.target.value)}
                    placeholder="Text shown on hover"
                  />
                </div>

                <div>
                  <Label htmlFor={`image-caption-${index}`}>Caption</Label>
                  <Input
                    id={`image-caption-${index}`}
                    value={image.caption || ''}
                    onChange={(e) => handleImageItemChange(index, 'caption', e.target.value)}
                    placeholder="Text displayed below image"
                  />
                </div>

                <div>
                  <Label htmlFor={`image-link-${index}`}>Link URL</Label>
                  <Input
                    id={`image-link-${index}`}
                    type="url"
                    value={image.link || ''}
                    onChange={(e) => handleImageItemChange(index, 'link', e.target.value)}
                    placeholder="https://example.com (makes image clickable)"
                  />
                </div>
              </div>
            </div>
          ))}

          {images.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <Image size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No images yet</p>
              <p className="text-xs mt-1">Click "Add Image" to get started</p>
            </div>
          )}
        </div>

        <Button onClick={addImageItem} className="w-full mt-4">
          <Plus size={16} className="mr-2" />
          Add Another Image
        </Button>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen} className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
                      <DialogTitle>{selectedImage?.title || &apos;Image Preview&apos;}</DialogTitle>          <DialogDescription>
            {selectedImage?.caption || &apos;Click outside to close&apos;}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {selectedImage?.url && (
            <img
              src={selectedImage.url}
              alt={selectedImage.alt || ''}
              className="w-full h-auto rounded-lg"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          )}
          {selectedImage?.caption && (
            <p className="text-center text-sm text-gray-600 mt-4">
              {selectedImage.caption}
            </p>
          )}
          {selectedImage?.link && (
            <div className="text-center mt-2">
              <a
                href={selectedImage.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
              >
                <ExternalLink size={14} />
                Open Link
              </a>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}