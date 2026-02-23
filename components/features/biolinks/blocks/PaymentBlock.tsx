import type { PaymentBlockData } from '@/types/entities/biolink'

interface PaymentBlockProps {
  block: PaymentBlockData
  isEditing?: boolean
  onUpdate?: (data: PaymentBlockData['data']) => void
}

export default function PaymentBlock({ block, isEditing, onUpdate }: PaymentBlockProps) {
  const { amount, currency, description, paymentUrl } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => onUpdate?.({ ...block.data, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => onUpdate?.({ ...block.data, amount: parseFloat(e.target.value) || 0 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => onUpdate?.({ ...block.data, currency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="USD"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment URL</label>
          <input
            type="url"
            value={paymentUrl}
            onChange={(e) => onUpdate?.({ ...block.data, paymentUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  return (
    <a
      href={paymentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-lg bg-green-600 px-6 py-4 text-center text-white transition-colors hover:bg-green-700"
    >
      <span className="text-lg font-semibold">
        💳 Pay {currency} {amount.toFixed(2)}
      </span>
      {description && <p className="mt-1 text-sm text-green-100">{description}</p>}
    </a>
  )
}
