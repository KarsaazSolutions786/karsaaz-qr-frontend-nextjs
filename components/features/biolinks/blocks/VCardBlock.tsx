import type { VCardBlockData } from '@/types/entities/biolink'

interface VCardBlockProps {
  block: VCardBlockData
  isEditing?: boolean
  onUpdate?: (data: VCardBlockData['data']) => void
}

function generateVCardString(data: VCardBlockData['data']): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0']
  lines.push(`N:${data.lastName || ''};${data.firstName};;;`)
  lines.push(`FN:${data.firstName}${data.lastName ? ' ' + data.lastName : ''}`)
  if (data.organization) lines.push(`ORG:${data.organization}`)
  if (data.title) lines.push(`TITLE:${data.title}`)
  if (data.phone) lines.push(`TEL:${data.phone}`)
  if (data.email) lines.push(`EMAIL:${data.email}`)
  if (data.website) lines.push(`URL:${data.website}`)
  if (data.address) lines.push(`ADR:;;${data.address};;;;`)
  lines.push('END:VCARD')
  return lines.join('\n')
}

export default function VCardBlock({ block, isEditing, onUpdate }: VCardBlockProps) {
  const { firstName, lastName, organization, phone, email, website, address, title: jobTitle } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => onUpdate?.({ ...block.data, firstName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName || ''}
              onChange={(e) => onUpdate?.({ ...block.data, lastName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Organization</label>
          <input
            type="text"
            value={organization || ''}
            onChange={(e) => onUpdate?.({ ...block.data, organization: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            value={jobTitle || ''}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            value={website || ''}
            onChange={(e) => onUpdate?.({ ...block.data, website: e.target.value })}
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

  const fullName = `${firstName}${lastName ? ' ' + lastName : ''}`
  const vcard = generateVCardString(block.data)
  const vcardBlob = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-3 text-center">
        <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
        {jobTitle && <p className="text-sm text-gray-600">{jobTitle}</p>}
        {organization && <p className="text-sm text-gray-500">{organization}</p>}
      </div>
      <div className="mb-4 space-y-1 text-sm text-gray-600">
        {phone && <p>📞 {phone}</p>}
        {email && <p>✉️ {email}</p>}
        {website && <p>🌐 {website}</p>}
        {address && <p>📍 {address}</p>}
      </div>
      <a
        href={vcardBlob}
        download={`${fullName.replace(/\s/g, '_')}.vcf`}
        className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Save Contact
      </a>
    </div>
  )
}
