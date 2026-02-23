import type { ContactBlockData } from '@/types/entities/biolink'

interface ContactBlockProps {
  block: ContactBlockData
  isEditing?: boolean
  onUpdate?: (data: ContactBlockData['data']) => void
}

export default function ContactBlock({ block, isEditing, onUpdate }: ContactBlockProps) {
  const { name, phone, email, address } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onUpdate?.({ ...block.data, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={phone || ''}
            onChange={(e) => onUpdate?.({ ...block.data, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email || ''}
            onChange={(e) => onUpdate?.({ ...block.data, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={address || ''}
            onChange={(e) => onUpdate?.({ ...block.data, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">{name}</h3>
      <div className="space-y-2 text-sm text-gray-600">
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-blue-600">
            <span>📞</span> {phone}
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-blue-600">
            <span>✉️</span> {email}
          </a>
        )}
        {address && (
          <p className="flex items-center gap-2">
            <span>📍</span> {address}
          </p>
        )}
      </div>
    </div>
  )
}
