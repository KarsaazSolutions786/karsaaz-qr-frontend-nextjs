'use client'

import { DomainSelect } from '@/components/features/domains/DomainSelect'
import { useTranslation } from '@/lib/i18n'

interface DomainSelectorProps {
  value: string
  onChange: (domainId: string) => void
  className?: string
}

/**
 * Purpose: T182: Reusable domain selector for QR code create/edit forms. Wraps DomainSelect with QR-form-specific labelling.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function DomainSelector({ value, onChange, className }: DomainSelectorProps) {
  const { t } = useTranslation()
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('Custom Domain')} <span className="text-gray-400 font-normal">({t('optional')})</span>
      </label>
      <DomainSelect
        value={value}
        onChange={domainId => onChange(domainId)}
        placeholder={t('Use default domain')}
      />
      <p className="mt-1 text-xs text-gray-500">{t('Select a custom domain for the QR code short URL')}</p>
    </div>
  )
}
