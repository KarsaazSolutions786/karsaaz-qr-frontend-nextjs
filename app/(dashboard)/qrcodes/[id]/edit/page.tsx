'use client'

import { useQRCode } from '@/lib/hooks/queries/useQRCode'
import { QRWizardContainer } from '@/components/features/qrcodes/wizard'
import { useTranslation } from '@/lib/i18n'
import { BarChart3, ArrowLeft } from 'lucide-react'
import { LottieLoader } from '@/components/ui/lottie-loader'
import Link from 'next/link'

/**
 * Edit QR Code Page - Uses multi-step wizard in edit mode
 *
 * Features:
 * - Pre-loads existing QR code data
 * - Same wizard flow as creation
 * - All 4 steps available for editing
 * - Updates existing QR code on save
 * - Quick link to analytics from header
 */
export default function EditQRCodePage({ params }: { params: { id: string } }) {
  const { t } = useTranslation()
  const { data: qrcode, isLoading } = useQRCode(params.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LottieLoader size={80} className="mx-auto" />
          <p className="mt-4 text-gray-600">{t('Loading QR Code...')}</p>
        </div>
      </div>
    )
  }

  if (!qrcode) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <p className="text-red-600">{t('QR Code not found')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Edit page header with navigation and stats quick link */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/qrcodes/${params.id}`}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={t('Back to QR Code')}
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('Edit')}: {qrcode.name}
            </h1>
          </div>
        </div>
        <Link
          href={`/qrcodes/${params.id}/analytics`}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          {t('View Stats')}
        </Link>
      </div>

      <QRWizardContainer
        mode="edit"
        qrcodeId={params.id}
        initialData={qrcode}
      />
    </div>
  )
}
