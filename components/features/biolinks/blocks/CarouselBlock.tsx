'use client'

import { useState, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { CarouselBlockData } from '@/types/entities/biolink'

interface CarouselBlockProps {
  block: CarouselBlockData
  isEditing?: boolean
  onUpdate?: (data: CarouselBlockData['data']) => void
}

export default function CarouselBlock({ block, isEditing, onUpdate }: CarouselBlockProps) {
  const { t } = useTranslation();
  const { images, autoplay = false, interval = 5, showDots = true, showArrows = true, height = 300 } =
    block.data
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Autoplay handled via useEffect would need useRef for interval - kept simple for SSR compat
  // The autoplay attribute is stored for potential server-side rendering of the block

  if (isEditing) {
    const addImage = () => {
      onUpdate?.({ ...block.data, images: [...images, { url: '', alt: '', caption: '' }] })
    }

    const removeImage = (index: number) => {
      onUpdate?.({ ...block.data, images: images.filter((_, i) => i !== index) })
    }

    const updateImage = (index: number, field: string, value: string) => {
      const updated = images.map((img, i) => (i === index ? { ...img, [field]: value } : img))
      onUpdate?.({ ...block.data, images: updated })
    }

    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Height (px)')}</label>
            <input
              type="number"
              value={height}
              min={150}
              max={600}
              onChange={(e) =>
                onUpdate?.({ ...block.data, height: parseInt(e.target.value) || 300 })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Interval (seconds)')}
            </label>
            <input
              type="number"
              value={interval}
              min={1}
              max={30}
              onChange={(e) =>
                onUpdate?.({ ...block.data, interval: parseInt(e.target.value) || 5 })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`autoplay-${block.id}`}
              checked={autoplay}
              onChange={(e) => onUpdate?.({ ...block.data, autoplay: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`autoplay-${block.id}`} className="text-sm font-medium text-gray-700">
              {t('Autoplay')}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`dots-${block.id}`}
              checked={showDots}
              onChange={(e) => onUpdate?.({ ...block.data, showDots: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`dots-${block.id}`} className="text-sm font-medium text-gray-700">
              {t('Show Dots')}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`arrows-${block.id}`}
              checked={showArrows}
              onChange={(e) => onUpdate?.({ ...block.data, showArrows: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`arrows-${block.id}`} className="text-sm font-medium text-gray-700">
              {t('Show Arrows')}
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{t('Images')}</label>
          <button
            type="button"
            onClick={addImage}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {t('+ Add Image')}
          </button>
        </div>
        {images.map((image, index) => (
          <div key={index} className="space-y-1 rounded border border-gray-100 p-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={image.url}
                onChange={(e) => updateImage(index, 'url', e.target.value)}
                placeholder={t('Image URL')}
                className="block flex-1 rounded-md border-gray-300 text-sm shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-600 hover:text-red-700"
              >
                &#10005;
              </button>
            </div>
            <input
              type="text"
              value={image.alt || ''}
              onChange={(e) => updateImage(index, 'alt', e.target.value)}
              placeholder={t('Alt text (optional)')}
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm"
            />
            <input
              type="text"
              value={image.caption || ''}
              onChange={(e) => updateImage(index, 'caption', e.target.value)}
              placeholder={t('Caption (optional)')}
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm"
            />
          </div>
        ))}
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('No images added to carousel')}</p>
      </div>
    )
  }

  const safeIndex = Math.min(currentIndex, images.length - 1)

  return (
    <div className="relative overflow-hidden rounded-lg" style={{ height: `${height}px` }}>
      {/* Current Slide */}
      <div className="h-full w-full">
        <img
          src={images[safeIndex]?.url}
          alt={images[safeIndex]?.alt || ''}
          className="h-full w-full object-cover"
        />
        {images[safeIndex]?.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-sm text-white">{images[safeIndex].caption}</p>
          </div>
        )}
      </div>

      {/* Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
            aria-label="Previous slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
            aria-label="Next slide"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === safeIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
