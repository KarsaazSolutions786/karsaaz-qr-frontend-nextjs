'use client'

interface QRCodeCustomizerProps {
  customization: any
  onChange: (customization: any) => void
}

export function QRCodeCustomizer({ customization, onChange }: QRCodeCustomizerProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...customization, [field]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Customize QR Code</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="foregroundColor" className="block text-sm font-medium text-gray-700">
            Foreground Color
          </label>
          <input
            type="color"
            id="foregroundColor"
            value={customization?.foregroundColor || '#000000'}
            onChange={(e) => handleChange('foregroundColor', e.target.value)}
            className="mt-1 h-10 w-full rounded border border-gray-300"
          />
        </div>

        <div>
          <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">
            Background Color
          </label>
          <input
            type="color"
            id="backgroundColor"
            value={customization?.backgroundColor || '#FFFFFF'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="mt-1 h-10 w-full rounded border border-gray-300"
          />
        </div>
      </div>

      <div>
        <label htmlFor="style" className="block text-sm font-medium text-gray-700">
          Style
        </label>
        <select
          id="style"
          value={customization?.style || 'squares'}
          onChange={(e) => handleChange('style', e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="squares">Squares</option>
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
        </select>
      </div>

      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
          Size: {customization?.size || 500}px
        </label>
        <input
          type="range"
          id="size"
          min="100"
          max="2000"
          value={customization?.size || 500}
          onChange={(e) => handleChange('size', parseInt(e.target.value))}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
          Logo URL (Optional)
        </label>
        <input
          type="url"
          id="logoUrl"
          value={customization?.logoUrl || ''}
          onChange={(e) => handleChange('logoUrl', e.target.value)}
          placeholder="https://example.com/logo.png"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>
    </div>
  )
}
