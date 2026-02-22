'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarsQuestionProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  maxStars?: number;
}

export default function StarsQuestion({
  value,
  onChange,
  label,
  maxStars = 5,
}: StarsQuestionProps) {
  const [hovered, setHovered] = useState<number>(0);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className="flex gap-1"
        onMouseLeave={() => setHovered(0)}
      >
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => {
          const filled = star <= (hovered || value);
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  filled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-transparent text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {value > 0 && (
        <p className="text-sm text-gray-500">
          {value} / {maxStars}
        </p>
      )}
    </div>
  );
}
