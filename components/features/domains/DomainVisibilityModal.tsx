'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import type { Domain, DomainAvailability } from '@/types/entities/domain'

interface DomainVisibilityModalProps {
  domain: Domain
  open: boolean
  onClose: () => void
  onConfirm: (availability: DomainAvailability) => void | Promise<void>
  isLoading?: boolean
}

/**
 * Modal for changing domain availability between public (all users)
 * and private (domain owner only). Maps to the P1
 * `qrcg-domain-change-availability-modal` that calls
 * PUT /domains/{id}/update-availability.
 */
export function DomainVisibilityModal({
  domain,
  open,
  onClose,
  onConfirm,
  isLoading,
}: DomainVisibilityModalProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<DomainAvailability>(
    domain.availability ?? 'public'
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('Change Availability')}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {t('Domain:')}{' '}
          <span className="font-medium text-gray-900">{domain.domain}</span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {t(
            'Public domains are available for all application users. Private domains are only available to the domain owner.'
          )}
        </p>

        <div className="mt-5 space-y-2">
          {(['public', 'private'] as DomainAvailability[]).map((value) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                selected === value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="availability"
                value={value}
                checked={selected === value}
                onChange={() => setSelected(value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">
                  {value === 'public'
                    ? t('Public (all users)')
                    : t('Private (domain owner)')}
                </span>
                <p className="text-xs text-gray-500">
                  {value === 'public'
                    ? t('All users can create QR codes using this domain')
                    : t('Only the domain owner can use this domain')}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {t('Cancel')}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selected)}
            disabled={isLoading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? t('Saving...') : t('Update Availability')}
          </button>
        </div>
      </div>
    </div>
  )
}
