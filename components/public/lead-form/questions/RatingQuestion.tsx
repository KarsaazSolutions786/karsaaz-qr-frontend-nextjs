'use client';

interface RatingQuestionProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

export default function RatingQuestion({
  value,
  onChange,
  label,
  min = 1,
  max = 10,
}: RatingQuestionProps) {
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {range.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
              value === num
                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min} — Low</span>
        <span>{max} — High</span>
      </div>
    </div>
  );
}
