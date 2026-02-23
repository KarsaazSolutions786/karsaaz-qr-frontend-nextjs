import type { PhoneBlockData } from '@/types/entities/biolink'

interface PhoneBlockProps {
  block: PhoneBlockData
  isEditing?: boolean
  onUpdate?: (data: PhoneBlockData['data']) => void
}

export default function PhoneBlock({ block, isEditing, onUpdate }: PhoneBlockProps) {
  const { phone, buttonText = 'Call Now', showWhatsApp } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onUpdate?.({ ...block.data, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Text</label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => onUpdate?.({ ...block.data, buttonText: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showWhatsApp || false}
            onChange={(e) => onUpdate?.({ ...block.data, showWhatsApp: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label className="text-sm text-gray-700">Show WhatsApp button</label>
        </div>
      </div>
    )
  }

  const cleanPhone = phone.replace(/[^+\d]/g, '')

  return (
    <div className="space-y-2">
      <a
        href={`tel:${cleanPhone}`}
        className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-white transition-colors hover:bg-blue-700"
      >
        📞 {buttonText}
      </a>
      {showWhatsApp && (
        <a
          href={`https://wa.me/${cleanPhone.replace('+', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-lg bg-green-600 px-6 py-3 text-center text-white transition-colors hover:bg-green-700"
        >
          💬 WhatsApp
        </a>
      )}
    </div>
  )
}
