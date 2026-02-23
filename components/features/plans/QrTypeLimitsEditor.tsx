'use client'

import { useState, useCallback } from 'react'
import { QR_TYPES, type QRCodeTypeDefinition } from '@/lib/constants/qr-types'

export interface QrTypeLimit {
  typeId: string
  limit: number // -1 = unlimited
}

interface QrTypeLimitsEditorProps {
  limits: QrTypeLimit[]
  onChange: (limits: QrTypeLimit[]) => void
}

const dynamicTypes = QR_TYPES.filter((t) => t.cat === 'dynamic')

export function QrTypeLimitsEditor({ limits, onChange }: QrTypeLimitsEditorProps) {
  const [selectedType, setSelectedType] = useState('')

  const usedTypeIds = new Set(limits.map((l) => l.typeId))
  const availableTypes = dynamicTypes.filter((t) => !usedTypeIds.has(t.id))

  const addLimit = useCallback(() => {
    if (!selectedType) return
    onChange([...limits, { typeId: selectedType, limit: -1 }])
    setSelectedType('')
  }, [selectedType, limits, onChange])

  const removeLimit = useCallback(
    (typeId: string) => {
      onChange(limits.filter((l) => l.typeId !== typeId))
    },
    [limits, onChange]
  )

  const updateLimitValue = useCallback(
    (typeId: string, value: number) => {
      onChange(limits.map((l) => (l.typeId === typeId ? { ...l, limit: value } : l)))
    },
    [limits, onChange]
  )

  const getTypeName = (typeId: string): string => {
    const found: QRCodeTypeDefinition | undefined = QR_TYPES.find((t) => t.id === typeId)
    return found?.name ?? typeId
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        Override the default QR code limit per type. Use -1 for unlimited. If not set, the global &ldquo;Dynamic QR Codes&rdquo; limit applies.
      </p>

      {/* Existing limits */}
      {limits.length > 0 && (
        <div className="divide-y divide-gray-200 rounded-md border border-gray-200">
          {limits.map((l) => (
            <div key={l.typeId} className="flex items-center gap-3 px-3 py-2">
              <span className="flex-1 text-sm text-gray-800">{getTypeName(l.typeId)}</span>
              <input
                type="number"
                min={-1}
                value={l.limit}
                onChange={(e) => updateLimitValue(l.typeId, Number(e.target.value))}
                className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeLimit(l.typeId)}
                className="rounded p-1 text-red-500 hover:bg-red-50"
                title="Remove"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new type limit */}
      {availableTypes.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select QR type…</option>
            {availableTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addLimit}
            disabled={!selectedType}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}

      {limits.length === 0 && availableTypes.length > 0 && (
        <p className="text-xs text-gray-400">
          No per-type limits set. Add limits to restrict specific QR code types independently.
        </p>
      )}
    </div>
  )
}
