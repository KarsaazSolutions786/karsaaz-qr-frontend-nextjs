'use client';

import { Check } from 'lucide-react';

interface ChoicesQuestionProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: string[];
  label: string;
  multiple?: boolean;
}

export default function ChoicesQuestion({
  value,
  onChange,
  options,
  label,
  multiple = false,
}: ChoicesQuestionProps) {
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (option: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      onChange(next);
    } else {
      onChange(option);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {multiple && (
          <span className="ml-2 text-xs text-gray-400">(select multiple)</span>
        )}
      </label>
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-${
                  multiple ? 'md' : 'full'
                } border transition-colors ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
