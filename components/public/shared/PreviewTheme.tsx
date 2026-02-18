'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface PreviewThemeProps {
  defaultTheme?: 'light' | 'dark' | 'auto';
  showToggle?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export default function PreviewTheme({
  defaultTheme = 'auto',
  showToggle = true,
  position = 'top-right',
  className = '',
}: PreviewThemeProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    defaultTheme === 'auto' ? 'light' : defaultTheme
  );

  useEffect(() => {
    // Check system preference if auto
    if (defaultTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, defaultTheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  if (!showToggle) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        fixed ${positionClasses[position]}
        ${className}
        w-10 h-10 rounded-full
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        shadow-md hover:shadow-lg
        flex items-center justify-center
        transition-all duration-200
        hover:scale-110
        z-50
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}
