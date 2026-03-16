/**
 * ScansPerLanguage Component
 *
 * Horizontal bar chart showing scan count by language.
 */

'use client';

import React, { useMemo } from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export interface LanguageData {
  language: string;
  count: number;
  percentage: number;
}

export interface ScansPerLanguageProps {
  data: LanguageData[];
  loading?: boolean;
}

const LANGUAGE_FLAGS: Record<string, string> = {
  english: '🇺🇸',
  spanish: '🇪🇸',
  french: '🇫🇷',
  german: '🇩🇪',
  portuguese: '🇧🇷',
  chinese: '🇨🇳',
  japanese: '🇯🇵',
  korean: '🇰🇷',
  arabic: '🇸🇦',
  hindi: '🇮🇳',
  russian: '🇷🇺',
  italian: '🇮🇹',
  dutch: '🇳🇱',
  turkish: '🇹🇷',
  polish: '🇵🇱',
  swedish: '🇸🇪',
  thai: '🇹🇭',
  vietnamese: '🇻🇳',
  indonesian: '🇮🇩',
  malay: '🇲🇾',
};

function getFlagEmoji(language: string): string {
  return LANGUAGE_FLAGS[language.toLowerCase()] ?? '🌐';
}

export function ScansPerLanguage({ data, loading = false }: ScansPerLanguageProps) {
  const { t } = useTranslation();

  const sorted = useMemo(
    () => [...data].sort((a, b) => b.count - a.count),
    [data]
  );

  const maxCount = sorted[0]?.count || 1;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
          <Languages className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('Scans by Language')}</h3>
          <p className="text-sm text-gray-500">{t('Visitor language distribution')}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-2 animate-pulse rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-8">
          <Languages className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('No language data available')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((item) => {
            const barWidth = (item.count / maxCount) * 100;

            return (
              <div key={item.language}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span>{getFlagEmoji(item.language)}</span>
                    {item.language}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.count.toLocaleString()} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
