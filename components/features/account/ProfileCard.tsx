'use client'

import { User } from '@/types/entities/user'

interface ProfileCardProps {
  user: User
  onEditProfile: () => void
  onResetPassword: () => void
}

function formatMobileNumber(mobileNumber: any): string {
  if (!mobileNumber || !mobileNumber.mobile_number) return ''
  const codes: Record<string, string> = {
    US: '1', PK: '92', IN: '91', GB: '44', CA: '1',
    AU: '61', DE: '49', FR: '33', IT: '39', ES: '34',
  }
  const callingCode = mobileNumber.iso_code ? codes[mobileNumber.iso_code] || '' : ''
  return `+${callingCode}${mobileNumber.mobile_number}`
}

export function ProfileCard({ user, onEditProfile, onResetPassword }: ProfileCardProps) {
  const profileImageUrl = (user as any).profile_image_url || null
  const initial = user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'
  const phone = formatMobileNumber((user as any).mobile_number)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="h-24 w-24 rounded-full object-cover border-4 border-gray-100"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-blue-100 border-4 border-gray-100 flex items-center justify-center text-3xl font-bold text-blue-600">
              {initial}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-2xl font-semibold text-gray-900 truncate">
            {user.name || 'User Name'}
          </h2>
          <p className="text-gray-500 mt-1 truncate">{user.email || 'user@example.com'}</p>
          {phone && (
            <p className="text-gray-500 mt-1">{phone}</p>
          )}
          {user.roles?.[0]?.name && (
            <span className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {user.roles[0].name}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onResetPassword}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Reset Password
          </button>
          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}
