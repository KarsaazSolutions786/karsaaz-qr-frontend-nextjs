'use client';

import React, { useState } from 'react';

export interface WelcomeStep {
  title: string;
  description: string;
  image?: string;
}

interface WelcomeModalProps {
  steps: WelcomeStep[];
  open: boolean;
  onClose: () => void;
}

export function WelcomeModal({ steps, open, onClose }: WelcomeModalProps) {
  const [current, setCurrent] = useState(0);

  if (!open || steps.length === 0) return null;

  const step = steps[current]!;
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Skip button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-sm text-gray-400 hover:text-gray-600"
        >
          Skip
        </button>

        {/* Step Content */}
        <div className="flex flex-col items-center text-center">
          {step.image && (
            <img
              src={step.image}
              alt={step.title}
              className="mb-4 h-40 w-auto rounded-lg object-contain"
            />
          )}
          <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
          <p className="mt-2 text-sm text-gray-600">{step.description}</p>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-1.5">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block h-2 w-2 rounded-full transition-colors ${
                idx === current ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setCurrent((c) => c - 1)}
            disabled={isFirst}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:invisible"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLast) {
                onClose();
              } else {
                setCurrent((c) => c + 1);
              }
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
