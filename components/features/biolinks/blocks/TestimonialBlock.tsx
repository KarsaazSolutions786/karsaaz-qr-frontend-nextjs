'use client'

import { useTranslation } from '@/lib/i18n'
import type { TestimonialBlockData } from '@/types/entities/biolink'

interface TestimonialBlockProps {
  block: TestimonialBlockData
  isEditing?: boolean
  onUpdate?: (data: TestimonialBlockData['data']) => void
}

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`text-lg ${onChange ? 'cursor-pointer' : 'cursor-default'} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          disabled={!onChange}
        >
          &#9733;
        </button>
      ))}
    </div>
  )
}

export default function TestimonialBlock({ block, isEditing, onUpdate }: TestimonialBlockProps) {
  const { t } = useTranslation();
  const { testimonials } = block.data

  if (isEditing) {
    const addTestimonial = () => {
      onUpdate?.({
        ...block.data,
        testimonials: [
          ...testimonials,
          { name: '', photo: '', rating: 5, text: '', title: '' },
        ],
      })
    }

    const removeTestimonial = (index: number) => {
      onUpdate?.({
        ...block.data,
        testimonials: testimonials.filter((_, i) => i !== index),
      })
    }

    const updateTestimonial = (
      index: number,
      field: string,
      value: string | number
    ) => {
      const updated = testimonials.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      )
      onUpdate?.({ ...block.data, testimonials: updated })
    }

    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{t('Testimonials')}</label>
          <button
            type="button"
            onClick={addTestimonial}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {t('+ Add Testimonial')}
          </button>
        </div>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="space-y-2 rounded border border-gray-100 p-3">
            <div className="flex items-start gap-2">
              <input
                type="text"
                value={testimonial.name}
                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                placeholder="Name"
                className="block flex-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeTestimonial(index)}
                className="text-red-600 hover:text-red-700"
              >
                &#10005;
              </button>
            </div>
            <input
              type="text"
              value={testimonial.title || ''}
              onChange={(e) => updateTestimonial(index, 'title', e.target.value)}
              placeholder={t('Title / Company (optional)')}
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="url"
              value={testimonial.photo || ''}
              onChange={(e) => updateTestimonial(index, 'photo', e.target.value)}
              placeholder={t('Photo URL (optional)')}
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('Rating')}</label>
              <StarRating
                rating={testimonial.rating}
                onChange={(r) => updateTestimonial(index, 'rating', r)}
              />
            </div>
            <textarea
              value={testimonial.text}
              onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
              placeholder={t('Testimonial text')}
              rows={2}
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    )
  }

  if (testimonials.length === 0) return null

  return (
    <div className="space-y-4">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-5"
        >
          <div className="mb-3">
            <StarRating rating={testimonial.rating} />
          </div>
          <p className="mb-4 text-sm text-gray-700 italic whitespace-pre-wrap">
            &ldquo;{testimonial.text}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            {testimonial.photo ? (
              <img
                src={testimonial.photo}
                alt={testimonial.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
                {testimonial.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
              {testimonial.title && (
                <p className="text-xs text-gray-500">{testimonial.title}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
