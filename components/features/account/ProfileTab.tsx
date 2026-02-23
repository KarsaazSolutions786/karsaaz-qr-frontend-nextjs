'use client'

import { useState, useRef } from 'react'
import { ProfileEditor } from '@/components/features/auth/ProfileEditor'
import { User } from '@/types/entities/user'

interface AvatarUploadProps {
  user: User
}

export function AvatarUpload({ user }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const initial = user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="flex items-center gap-4 mb-6">
      <div
        className="relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-100 text-2xl font-bold text-blue-600"
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          initial
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
          </svg>
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Change avatar
        </button>
        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB.</p>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

interface ProfileTabProps {
  user: User
}

export function ProfileTab({ user }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
            {user.roles?.[0]?.name && (
              <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                {user.roles[0].name}
              </span>
            )}
          </div>
          <div className="text-right text-sm text-gray-500">
            {user.email_verified_at ? (
              <span className="inline-flex items-center gap-1 text-green-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-yellow-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Avatar + Edit Profile */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Edit Profile</h2>
        <AvatarUpload user={user} />
        <ProfileEditor user={user} />
      </div>
    </div>
  )
}
