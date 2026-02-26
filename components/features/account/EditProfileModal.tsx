'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { authAPI } from '@/lib/api/endpoints/auth'
import { useAuth } from '@/lib/hooks/useAuth'

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
}

const COUNTRY_CODES: Record<string, string> = {
  US: '1', PK: '92', IN: '91', GB: '44', CA: '1',
  AU: '61', DE: '49', FR: '33', IT: '39', ES: '34',
}

function getCallingCode(isoCode?: string): string {
  if (!isoCode) return '92'
  return COUNTRY_CODES[isoCode] || '92'
}

function getIsoFromCallingCode(code: string): string {
  const clean = code.replace('+', '')
  const reversed: Record<string, string> = {}
  for (const [iso, cc] of Object.entries(COUNTRY_CODES)) {
    reversed[cc] = iso
  }
  return reversed[clean] || 'PK'
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { user, refreshUserData } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+92')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (open && user) {
      setName(user.name || '')
      setEmail(user.email || '')
      const mob = (user as any).mobile_number
      if (mob?.mobile_number) {
        const cc = getCallingCode(mob.iso_code)
        setCountryCode(`+${cc}`)
        setPhoneNumber(mob.mobile_number)
      } else {
        setCountryCode('+92')
        setPhoneNumber('')
      }
      setAvatarPreview((user as any).profile_image_url || null)
      setErrors({})
    }
  }, [open, user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setErrors({})

    try {
      const payload: Record<string, any> = { name, email }
      if (phoneNumber) {
        payload.mobile_number = {
          mobile_number: phoneNumber,
          iso_code: getIsoFromCallingCode(countryCode),
        }
      }

      await authAPI.updateUser(user.id, payload)
      await refreshUserData()
      onClose()
    } catch (err: any) {
      if (err?.response?.status === 422) {
        const validationErrors = err.response.data?.errors || {}
        setErrors(validationErrors)
      } else {
        setErrors({ general: ['Failed to update profile'] })
      }
    } finally {
      setLoading(false)
    }
  }, [user, name, email, phoneNumber, countryCode, refreshUserData, onClose])

  if (!open) return null

  const initial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover border-4 border-gray-100"
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-blue-100 border-4 border-gray-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                {initial}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-blue-600 border-3 border-white flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* General errors */}
        {errors.general && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errors.general.join(', ')}
          </div>
        )}

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone No</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              placeholder="+92"
              disabled={loading}
              className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          {errors.mobile_number && <p className="mt-1 text-xs text-red-500">{errors.mobile_number[0]}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
