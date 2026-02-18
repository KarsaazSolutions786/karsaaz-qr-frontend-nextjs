'use client';

import React, { useState, useRef } from 'react';
import {
  GripVertical,
  Upload,
  Trash2,
  Edit2,
  Image as ImageIcon,
} from 'lucide-react';
import { GalleryImage, createGalleryImage } from '@/types/entities/business-profile';

interface GalleryInputProps {
  value: GalleryImage[];
  onChange: (value: GalleryImage[]) => void;
}

export function GalleryInput({ value, onChange }: GalleryInputProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImageFromUrl = () => {
    if (!uploadUrl.trim()) return;
    const newImage = createGalleryImage(uploadUrl, value.length);
    onChange([...value, newImage]);
    setUploadUrl('');
    setEditingId(newImage.id);
  };

  const removeImage = (id: string) => {
    onChange(value.filter((img) => img.id !== id));
  };

  const updateImage = (id: string, updates: Partial<GalleryImage>) => {
    onChange(
      value.map((image) =>
        image.id === id ? { ...image, ...updates } : image
      )
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...value];
    const draggedImage = newImages[draggedIndex];
    if (!draggedImage) return;
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Update order
    const reordered = newImages.map((image, idx) => ({
      ...image,
      order: idx,
    }));

    onChange(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you'd upload these to a server and get URLs back
    // For now, we'll just create object URLs for preview
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const newImage = createGalleryImage(url, value.length);
        onChange([...value, newImage]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Image Gallery</h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Image from URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addImageFromUrl()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addImageFromUrl}
            disabled={!uploadUrl.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {value.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No images in gallery yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Upload images or add them from URLs
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Your First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value
            .sort((a, b) => a.order - b.order)
            .map((image, index) => {
              const isEditing = editingId === image.id;

              return (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group border rounded-lg overflow-hidden bg-white transition-all ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.alt || image.caption || 'Gallery image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EBroken Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    
                    {/* Drag handle */}
                    <button
                      type="button"
                      className="absolute top-2 left-2 p-1.5 bg-black/50 text-white rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(isEditing ? null : image.id)
                        }
                        className="p-1.5 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                        title="Edit caption"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="p-1.5 bg-red-600/80 text-white rounded hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Caption overlay */}
                    {!isEditing && image.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-white text-sm line-clamp-2">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Edit form */}
                  {isEditing && (
                    <div className="p-3 border-t bg-gray-50 space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Caption
                        </label>
                        <input
                          type="text"
                          value={image.caption || ''}
                          onChange={(e) =>
                            updateImage(image.id, { caption: e.target.value })
                          }
                          placeholder="Image description..."
                          className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={image.alt || ''}
                          onChange={(e) =>
                            updateImage(image.id, { alt: e.target.value })
                          }
                          placeholder="Alt text for accessibility..."
                          className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="w-full px-3 py-1.5 text-sm text-gray-700 bg-white border rounded hover:bg-gray-50 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        💡 Tip: Drag images to reorder them. Click edit to add captions.
      </div>
    </div>
  );
}
