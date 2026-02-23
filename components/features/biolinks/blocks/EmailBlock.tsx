import type { EmailBlockData } from '@/types/entities/biolink'

interface EmailBlockProps {
  block: EmailBlockData
  isEditing?: boolean
  onUpdate?: (data: EmailBlockData['data']) => void
}

export default function EmailBlock({ block, isEditing, onUpdate }: EmailBlockProps) {
  const { email, subject, buttonText = 'Send Email' } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onUpdate?.({ ...block.data, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject (optional)</label>
          <input
            type="text"
            value={subject || ''}
            onChange={(e) => onUpdate?.({ ...block.data, subject: e.target.value })}
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
      </div>
    )
  }

  const mailtoUrl = subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`

  return (
    <a
      href={mailtoUrl}
      className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-white transition-colors hover:bg-blue-700"
    >
      ✉️ {buttonText}
    </a>
  )
}
