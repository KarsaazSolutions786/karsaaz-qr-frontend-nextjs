'use client'

import type { Domain } from '@/types/entities/domain'

interface DomainStatusModalProps {
  domain: Domain
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

export function DomainStatusModal({
  domain,
  open,
  onClose,
  onConfirm,
  isLoading,
}: DomainStatusModalProps) {
  if (!open) return null

  const isActive = domain.status === 'verified'
  const action = isActive ? 'deactivate' : 'activate'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{isActive ? '⚠️' : '✅'}</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {isActive ? 'Deactivate' : 'Activate'} Domain
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to {action}{' '}
              <span className="font-medium text-gray-900">{domain.domain}</span>?
              {isActive && ' This domain will no longer serve your QR codes.'}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
              isActive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Processing...' : isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  )
}
