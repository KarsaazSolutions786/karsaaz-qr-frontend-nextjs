'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <h1 className="text-9xl font-bold text-red-500">500</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">Something went wrong</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{error.message || 'An unexpected error occurred.'}</p>
      <div className="mt-8 flex gap-4">
        <button onClick={reset} className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 transition-colors">
          Try Again
        </button>
        <a href="/" className="rounded-lg border border-gray-300 dark:border-gray-600 px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          Go Home
        </a>
      </div>
    </div>
  );
}
