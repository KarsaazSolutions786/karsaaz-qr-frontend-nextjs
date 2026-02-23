'use client'

import type { UPIBlockData } from '@/types/entities/biolink'

interface UPIBlockProps {
  block: UPIBlockData
  isEditing?: boolean
  onUpdate?: (data: UPIBlockData['data']) => void
}

function buildUpiUrl(vpa: string, name?: string, amount?: number, note?: string): string {
  const params = new URLSearchParams()
  params.set('pa', vpa)
  if (name) params.set('pn', name)
  if (amount && amount > 0) params.set('am', amount.toString())
  if (note) params.set('tn', note)
  return `upi://pay?${params.toString()}`
}

export default function UPIBlock({ block, isEditing, onUpdate }: UPIBlockProps) {
  const { vpa, amount, name, note } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">UPI ID (VPA)</label>
          <input
            type="text"
            value={vpa}
            onChange={e => onUpdate?.({ ...block.data, vpa: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="name@upi"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payee Name (optional)</label>
          <input
            type="text"
            value={name || ''}
            onChange={e => onUpdate?.({ ...block.data, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (optional)</label>
            <input
              type="number"
              value={amount || ''}
              onChange={e =>
                onUpdate?.({ ...block.data, amount: parseFloat(e.target.value) || undefined })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="0.00"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Note (optional)</label>
            <input
              type="text"
              value={note || ''}
              onChange={e => onUpdate?.({ ...block.data, note: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    )
  }

  if (!vpa) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">No UPI ID set</p>
      </div>
    )
  }

  const upiUrl = buildUpiUrl(vpa, name, amount, note)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="text-center">
        {name && <p className="text-lg font-semibold text-gray-900">{name}</p>}
        <p className="font-mono text-sm text-gray-600">{vpa}</p>
        {amount != null && amount > 0 && (
          <p className="mt-1 text-xl font-bold text-green-600">₹{amount.toFixed(2)}</p>
        )}
        {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
      </div>
      <img src={qrUrl} alt="UPI QR Code" className="h-48 w-48 rounded-lg border border-gray-100" />
      <a
        href={upiUrl}
        className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-purple-700"
      >
        Pay via UPI
      </a>
    </div>
  )
}
