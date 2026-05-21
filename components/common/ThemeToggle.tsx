'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

/**
 * Purpose: Executes ThemeToggle functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function ThemeToggle() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={t('Toggle theme')}
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5 text-yellow-400" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}
