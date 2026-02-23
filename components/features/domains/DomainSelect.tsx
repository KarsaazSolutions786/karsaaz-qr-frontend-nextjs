'use client'

import { useDomains } from '@/hooks/queries/useDomains'
import type { Domain } from '@/types/entities/domain'

interface DomainSelectProps {
  value: string
  onChange: (domainId: string, domain?: Domain) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DomainSelect({
  value,
  onChange,
  placeholder = 'Select domain',
  disabled = false,
  className = '',
}: DomainSelectProps) {
  const { data, isLoading } = useDomains()
  const domains = data?.data ?? []

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const domainId = e.target.value
    const domain = domains.find((d) => d.id === domainId)
    onChange(domainId, domain)
  }

  if (isLoading) {
    return (
      <select
        disabled
        className={`block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-400 shadow-sm ${className}`}
      >
        <option>Loading…</option>
      </select>
    )
  }

  // Auto-select if only one domain
  const effectiveValue = domains.length === 1 && domains[0] ? domains[0].id : value

  return (
    <select
      value={effectiveValue}
      onChange={handleChange}
      disabled={disabled || domains.length <= 1}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
    >
      {!effectiveValue && <option value="">{placeholder}</option>}
      {domains.map((domain) => (
        <option key={domain.id} value={domain.id}>
          {domain.domain}
          {domain.isDefault ? ' (default)' : ''}
        </option>
      ))}
    </select>
  )
}
