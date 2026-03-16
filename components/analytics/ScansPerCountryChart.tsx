/**
 * ScansPerCountryChart Component
 *
 * Tabular view of scan counts by country with horizontal bar indicators.
 * Shows top 10 by default with "Show all" toggle, flag emojis, and percentages.
 * Complements the LocationMap choropleth with a more data-dense view.
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { CountryBreakdownItem } from '@/types/entities/analytics'

// ---------- Types ----------

export interface ScansPerCountryChartProps {
  data: CountryBreakdownItem[]
  totalScans: number
  isLoading?: boolean
  initialShowAll?: boolean
}

// ---------- Country flag mapping ----------

const COUNTRY_FLAGS: Record<string, string> = {
  AF: '\u{1F1E6}\u{1F1EB}', AG: '\u{1F1E6}\u{1F1EC}', AL: '\u{1F1E6}\u{1F1F1}',
  AM: '\u{1F1E6}\u{1F1F2}', AO: '\u{1F1E6}\u{1F1F4}', AR: '\u{1F1E6}\u{1F1F7}',
  AT: '\u{1F1E6}\u{1F1F9}', AU: '\u{1F1E6}\u{1F1FA}', AZ: '\u{1F1E6}\u{1F1FF}',
  BA: '\u{1F1E7}\u{1F1E6}', BD: '\u{1F1E7}\u{1F1E9}', BE: '\u{1F1E7}\u{1F1EA}',
  BG: '\u{1F1E7}\u{1F1EC}', BH: '\u{1F1E7}\u{1F1ED}', BO: '\u{1F1E7}\u{1F1F4}',
  BR: '\u{1F1E7}\u{1F1F7}', CA: '\u{1F1E8}\u{1F1E6}', CH: '\u{1F1E8}\u{1F1ED}',
  CL: '\u{1F1E8}\u{1F1F1}', CN: '\u{1F1E8}\u{1F1F3}', CO: '\u{1F1E8}\u{1F1F4}',
  CR: '\u{1F1E8}\u{1F1F7}', CZ: '\u{1F1E8}\u{1F1FF}', DE: '\u{1F1E9}\u{1F1EA}',
  DK: '\u{1F1E9}\u{1F1F0}', DO: '\u{1F1E9}\u{1F1F4}', DZ: '\u{1F1E9}\u{1F1FF}',
  EC: '\u{1F1EA}\u{1F1E8}', EG: '\u{1F1EA}\u{1F1EC}', ES: '\u{1F1EA}\u{1F1F8}',
  ET: '\u{1F1EA}\u{1F1F9}', FI: '\u{1F1EB}\u{1F1EE}', FR: '\u{1F1EB}\u{1F1F7}',
  GB: '\u{1F1EC}\u{1F1E7}', GE: '\u{1F1EC}\u{1F1EA}', GH: '\u{1F1EC}\u{1F1ED}',
  GR: '\u{1F1EC}\u{1F1F7}', GT: '\u{1F1EC}\u{1F1F9}', HK: '\u{1F1ED}\u{1F1F0}',
  HN: '\u{1F1ED}\u{1F1F3}', HR: '\u{1F1ED}\u{1F1F7}', HU: '\u{1F1ED}\u{1F1FA}',
  ID: '\u{1F1EE}\u{1F1E9}', IE: '\u{1F1EE}\u{1F1EA}', IL: '\u{1F1EE}\u{1F1F1}',
  IN: '\u{1F1EE}\u{1F1F3}', IQ: '\u{1F1EE}\u{1F1F6}', IR: '\u{1F1EE}\u{1F1F7}',
  IS: '\u{1F1EE}\u{1F1F8}', IT: '\u{1F1EE}\u{1F1F9}', JO: '\u{1F1EF}\u{1F1F4}',
  JP: '\u{1F1EF}\u{1F1F5}', KE: '\u{1F1F0}\u{1F1EA}', KR: '\u{1F1F0}\u{1F1F7}',
  KW: '\u{1F1F0}\u{1F1FC}', KZ: '\u{1F1F0}\u{1F1FF}', LB: '\u{1F1F1}\u{1F1E7}',
  LK: '\u{1F1F1}\u{1F1F0}', LT: '\u{1F1F1}\u{1F1F9}', LV: '\u{1F1F1}\u{1F1FB}',
  LY: '\u{1F1F1}\u{1F1FE}', MA: '\u{1F1F2}\u{1F1E6}', MM: '\u{1F1F2}\u{1F1F2}',
  MX: '\u{1F1F2}\u{1F1FD}', MY: '\u{1F1F2}\u{1F1FE}', NG: '\u{1F1F3}\u{1F1EC}',
  NL: '\u{1F1F3}\u{1F1F1}', NO: '\u{1F1F3}\u{1F1F4}', NP: '\u{1F1F3}\u{1F1F5}',
  NZ: '\u{1F1F3}\u{1F1FF}', OM: '\u{1F1F4}\u{1F1F2}', PA: '\u{1F1F5}\u{1F1E6}',
  PE: '\u{1F1F5}\u{1F1EA}', PH: '\u{1F1F5}\u{1F1ED}', PK: '\u{1F1F5}\u{1F1F0}',
  PL: '\u{1F1F5}\u{1F1F1}', PT: '\u{1F1F5}\u{1F1F9}', QA: '\u{1F1F6}\u{1F1E6}',
  RO: '\u{1F1F7}\u{1F1F4}', RS: '\u{1F1F7}\u{1F1F8}', RU: '\u{1F1F7}\u{1F1FA}',
  SA: '\u{1F1F8}\u{1F1E6}', SE: '\u{1F1F8}\u{1F1EA}', SG: '\u{1F1F8}\u{1F1EC}',
  SK: '\u{1F1F8}\u{1F1F0}', TH: '\u{1F1F9}\u{1F1ED}', TN: '\u{1F1F9}\u{1F1F3}',
  TR: '\u{1F1F9}\u{1F1F7}', TW: '\u{1F1F9}\u{1F1FC}', TZ: '\u{1F1F9}\u{1F1FF}',
  UA: '\u{1F1FA}\u{1F1E6}', AE: '\u{1F1E6}\u{1F1EA}', UG: '\u{1F1FA}\u{1F1EC}',
  US: '\u{1F1FA}\u{1F1F8}', UY: '\u{1F1FA}\u{1F1FE}', UZ: '\u{1F1FA}\u{1F1FF}',
  VE: '\u{1F1FB}\u{1F1EA}', VN: '\u{1F1FB}\u{1F1F3}', ZA: '\u{1F1FF}\u{1F1E6}',
}

/**
 * Generates a flag emoji from a two-letter ISO country code using regional
 * indicator symbols. Falls back to a globe emoji if the code is not two letters.
 */
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '\u{1F30D}'

  const upper = countryCode.toUpperCase()

  // Use lookup table for known codes (more reliable across platforms)
  if (COUNTRY_FLAGS[upper]) return COUNTRY_FLAGS[upper]

  // Dynamic generation using regional indicator symbols
  const codePoints = [...upper].map(
    (c) => 0x1f1e6 + c.charCodeAt(0) - 65
  )
  return String.fromCodePoint(...codePoints)
}

// ---------- Loading skeleton ----------

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 flex-1 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  )
}

// ---------- Component ----------

export function ScansPerCountryChart({
  data,
  totalScans,
  isLoading = false,
  initialShowAll = false,
}: ScansPerCountryChartProps) {
  const { t } = useTranslation()
  const [showAll, setShowAll] = useState(initialShowAll)

  // Sort by scan count descending
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  )

  // Determine visible items
  const visible = showAll ? sorted : sorted.slice(0, 10)
  const hasMore = sorted.length > 10

  // Max count for bar width scaling
  const maxCount = sorted[0]?.value || 1

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
          <Globe className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t('Scans by Country')}
          </h3>
          <p className="text-sm text-gray-500">
            {sorted.length} {sorted.length === 1 ? 'country' : 'countries'} recorded
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <TableSkeleton />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Globe className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm text-gray-500">{t('No data available')}</p>
          <p className="mt-1 text-xs text-gray-400">
            {t('Country data will appear once your QR code is scanned')}
          </p>
        </div>
      ) : (
        <>
          {/* Table header */}
          <div className="mb-2 flex items-center gap-4 px-1 text-xs font-medium uppercase tracking-wider text-gray-400">
            <span className="w-8 text-center">#</span>
            <span className="flex-1">{t('Country')}</span>
            <span className="w-20 text-right">{t('Scans')}</span>
            <span className="w-14 text-right">%</span>
            <span className="hidden w-32 sm:block" />
          </div>

          {/* Rows */}
          <div className="space-y-1">
            {visible.map((item, index) => {
              const barWidth = (item.value / maxCount) * 100
              const percentage =
                totalScans > 0
                  ? ((item.value / totalScans) * 100).toFixed(1)
                  : '0.0'

              return (
                <div
                  key={`${item.countryCode}-${item.label}`}
                  className="group flex items-center gap-4 rounded-lg px-1 py-2.5 transition-colors hover:bg-gray-50"
                >
                  {/* Rank */}
                  <span className="w-8 text-center text-sm font-medium text-gray-400">
                    {index + 1}
                  </span>

                  {/* Country name + flag */}
                  <div className="flex flex-1 items-center gap-2.5 overflow-hidden">
                    <span className="text-lg leading-none">
                      {getCountryFlag(item.countryCode)}
                    </span>
                    <span className="truncate text-sm font-medium text-gray-900">
                      {item.label}
                    </span>
                    {item.countryCode && (
                      <span className="hidden text-xs text-gray-400 sm:inline">
                        {item.countryCode}
                      </span>
                    )}
                  </div>

                  {/* Scan count */}
                  <span className="w-20 text-right text-sm font-semibold text-gray-900">
                    {item.value.toLocaleString()}
                  </span>

                  {/* Percentage */}
                  <span className="w-14 text-right text-sm text-gray-500">
                    {percentage}%
                  </span>

                  {/* Bar indicator */}
                  <div className="hidden w-32 sm:block">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Show all / Show less */}
          {hasMore && (
            <div className="mt-4 border-t border-gray-100 pt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
              >
                {showAll ? (
                  <>
                    Show top 10 <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show all {sorted.length} countries{' '}
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
