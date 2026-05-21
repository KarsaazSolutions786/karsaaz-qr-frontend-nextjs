'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes DesignerPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function DesignerPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-lg border border-gray-200 bg-white p-12 shadow-sm">
        <svg
          className="mx-auto h-16 w-16 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
          />
        </svg>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('QR Code Designer')}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {t('Use the QR code creation wizard to access design and customization tools.')}
        </p>
        <div className="mt-8">
          <Link
            href="/qrcodes/new"
            className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            {t('Create New QR Code')}
          </Link>
        </div>
      </div>
    </div>
  )
}
