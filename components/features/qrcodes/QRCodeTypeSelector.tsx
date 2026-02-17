'use client'

const QR_CODE_TYPES = [
  { value: 'url', label: 'URL', icon: '🔗', description: 'Link to a website' },
  { value: 'vcard', label: 'vCard', icon: '👤', description: 'Contact information' },
  { value: 'wifi', label: 'WiFi', icon: '📶', description: 'WiFi network credentials' },
  { value: 'text', label: 'Text', icon: '📝', description: 'Plain text content' },
  { value: 'email', label: 'Email', icon: '📧', description: 'Email address with subject' },
  { value: 'sms', label: 'SMS', icon: '💬', description: 'Text message' },
  { value: 'phone', label: 'Phone', icon: '📞', description: 'Phone number' },
  { value: 'location', label: 'Location', icon: '📍', description: 'GPS coordinates' },
  { value: 'calendar', label: 'Calendar', icon: '📅', description: 'Event details' },
  { value: 'app-store', label: 'App Store', icon: '📱', description: 'App download links' },
]

interface QRCodeTypeSelectorProps {
  value: string
  onChange: (type: string) => void
}

export function QRCodeTypeSelector({ value, onChange }: QRCodeTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select QR Code Type
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {QR_CODE_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition ${
              value === type.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-3xl">{type.icon}</span>
            <span className="text-sm font-medium">{type.label}</span>
            <span className="text-xs text-gray-500">{type.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
