'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle, Wallet, X } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { useTranslation } from '@/lib/i18n'

interface InsufficientCreditsModalProps {
  open: boolean
  onClose: () => void
  /** Current user balance */
  balance: number
  /** Price of the QR code the user tried to create */
  requiredAmount: number
  /** Whether the QR type is dynamic */
  isDynamic: boolean
}

/**
 * Purpose: Modal shown when a user in account-credit billing mode tries to create a QR code but does not have enough credits. Offers a link to the account credits page where they can top up their balance.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function InsufficientCreditsModal({
  open,
  onClose,
  balance,
  requiredAmount,
  isDynamic,
}: InsufficientCreditsModalProps) {
  const router = useRouter()
  const { t } = useTranslation()

  if (!open) return null

  const deficit = Math.max(0, requiredAmount - balance)
  const qrTypeLabel = isDynamic ? t('Dynamic') : t('Static')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-lg font-semibold text-gray-900">
          {t('Insufficient Credits')}
        </h2>

        {/* Description */}
        <p className="mb-6 text-center text-sm text-gray-600">
          Creating a {qrTypeLabel} QR Code costs{' '}
          <span className="font-semibold text-gray-900">${requiredAmount.toFixed(2)}</span> but your
          current balance is{' '}
          <span className="font-semibold text-gray-900">${balance.toFixed(2)}</span>.
          {deficit > 0 && (
            <>
              {' '}
              You need at least{' '}
              <span className="font-semibold text-red-600">${deficit.toFixed(2)}</span> more.
            </>
          )}
        </p>

        {/* Balance summary */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{qrTypeLabel} {t('QR Code Price')}</span>
            <span className="font-medium text-gray-900">${requiredAmount.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-gray-500">{t('Your Balance')}</span>
            <span className="font-medium text-gray-900">${balance.toFixed(2)}</span>
          </div>
          <div className="mt-2 border-t border-gray-200 pt-2 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{t('Shortfall')}</span>
            <span className="font-semibold text-red-600">${deficit.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onClose()
              router.push(ROUTES.FINANCE.ACCOUNT_CREDITS)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Wallet className="h-4 w-4" />
            {t('Add Credits')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('Cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
