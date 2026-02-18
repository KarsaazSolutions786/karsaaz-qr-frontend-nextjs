'use client';

import React, { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  businessName: string;
  slug: string;
  onSuccess?: () => void;
  primaryColor?: string;
}

export default function ReviewForm({ businessName, slug, onSuccess, primaryColor = '#2563eb' }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!formData.comment.trim()) {
      setError('Please enter your review');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/qrcodes/business-review/${slug}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          name: formData.name,
          email: formData.email,
          comment: formData.comment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      setFormData({ name: '', email: '', comment: '' });
      setRating(0);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Rate Your Experience
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full p-1"
              style={{ 
                '--tw-ring-color': primaryColor,
              } as any}
            >
              <Star
                className={cn(
                  'w-10 h-10 transition-all',
                  (hoveredRating || rating) >= star
                    ? 'fill-current text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-3 text-lg font-semibold text-gray-700">
              {rating} {rating === 1 ? 'Star' : 'Stars'}
            </span>
          )}
        </div>
      </div>

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
          style={{ 
            '--tw-ring-color': primaryColor,
          } as any}
          placeholder="Enter your full name"
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
          Your Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
          style={{ 
            '--tw-ring-color': primaryColor,
          } as any}
          placeholder="your.email@example.com"
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Comment Textarea */}
      <div>
        <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all resize-none"
          style={{ 
            '--tw-ring-color': primaryColor,
          } as any}
          placeholder={`Share your experience with ${businessName}...`}
          disabled={isSubmitting}
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          Tell us about your experience, what you liked, or how we can improve.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full py-4 px-6 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ backgroundColor: primaryColor }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Review
          </>
        )}
      </button>

      <p className="text-xs text-center text-gray-500">
        Your review will be visible to others after approval
      </p>
    </form>
  );
}
