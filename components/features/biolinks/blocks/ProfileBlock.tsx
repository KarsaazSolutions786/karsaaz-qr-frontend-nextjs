import type { ProfileBlockData } from '@/types/entities/biolink'

interface ProfileBlockProps {
  block: ProfileBlockData
  isEditing?: boolean
  onUpdate?: (data: ProfileBlockData['data']) => void
}

export default function ProfileBlock({ block, isEditing, onUpdate }: ProfileBlockProps) {
  const { profileImage, backgroundImage, text, borderStyle = 'circle', size = 7 } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
          <input
            type="url"
            value={profileImage || ''}
            onChange={(e) => onUpdate?.({ ...block.data, profileImage: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Background Image URL (optional)</label>
          <input
            type="url"
            value={backgroundImage || ''}
            onChange={(e) => onUpdate?.({ ...block.data, backgroundImage: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Text / Handle</label>
          <input
            type="text"
            value={text || ''}
            onChange={(e) => onUpdate?.({ ...block.data, text: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="@handle"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Border Style</label>
          <select
            value={borderStyle}
            onChange={(e) =>
              onUpdate?.({ ...block.data, borderStyle: e.target.value as 'circle' | 'default' })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="circle">Circle</option>
            <option value="default">Default</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Size ({size}rem)</label>
          <input
            type="range"
            min={3}
            max={15}
            value={size}
            onChange={(e) => onUpdate?.({ ...block.data, size: parseInt(e.target.value) })}
            className="mt-1 block w-full"
          />
        </div>
      </div>
    )
  }

  const sizeStyle = `${size}rem`
  const borderRadius = borderStyle === 'circle' ? '9999px' : '0.5rem'

  return (
    <div className="text-center">
      {backgroundImage && (
        <div
          className="mb-4 rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})`, height: '120px' }}
        />
      )}
      {profileImage && (
        <img
          src={profileImage}
          alt={text || 'Profile'}
          className="mx-auto mb-2 object-cover"
          style={{
            width: sizeStyle,
            height: sizeStyle,
            borderRadius,
            marginTop: backgroundImage ? '-3rem' : undefined,
          }}
        />
      )}
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}
