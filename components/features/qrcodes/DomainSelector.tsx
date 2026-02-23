'use client'

import { DomainSelect } from '@/components/features/domains/DomainSelect'

interface DomainSelectorProps {
  value: string
  onChange: (domainId: string) => void
  className?: string
}

/**
 * T182: Reusable domain selector for QR code create/edit forms.
 * Wraps DomainSelect with QR-form-specific labelling.
 */
export function DomainSelector({ value, onChange, className }: DomainSelectorProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Custom Domain <span className="text-gray-400 font-normal">(optional)</span>
      </label>
      <DomainSelect
        value={value}
        onChange={domainId => onChange(domainId)}
        placeholder="Use default domain"
      />
      <p className="mt-1 text-xs text-gray-500">Select a custom domain for the QR code short URL</p>
    </div>
  )
}
