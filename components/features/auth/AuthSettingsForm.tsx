'use client'

import { useForm } from 'react-hook-form'
import type { OAuthProviderName } from '@/lib/services/auth-workflow'

export interface AuthProviderSettings {
  enabled: boolean
  client_id: string
  client_secret: string
}

export interface AuthSettingsFormData {
  google: AuthProviderSettings
  facebook: AuthProviderSettings
  twitter: AuthProviderSettings
  auth0: AuthProviderSettings & { domain?: string }
}

interface AuthSettingsFormProps {
  defaultValues?: Partial<AuthSettingsFormData>
  onSubmit: (data: AuthSettingsFormData) => void | Promise<void>
  isLoading?: boolean
}

const PROVIDERS: { key: OAuthProviderName; label: string; icon: string }[] = [
  { key: 'google', label: 'Google', icon: '🔵' },
  { key: 'facebook', label: 'Facebook', icon: '📘' },
  { key: 'twitter', label: 'Twitter / X', icon: '🐦' },
  { key: 'auth0', label: 'Auth0', icon: '🔐' },
]

const DEFAULT_VALUES: AuthSettingsFormData = {
  google: { enabled: false, client_id: '', client_secret: '' },
  facebook: { enabled: false, client_id: '', client_secret: '' },
  twitter: { enabled: false, client_id: '', client_secret: '' },
  auth0: { enabled: false, client_id: '', client_secret: '', domain: '' },
}

export function AuthSettingsForm({ defaultValues, onSubmit, isLoading }: AuthSettingsFormProps) {
  const { register, handleSubmit, watch } = useForm<AuthSettingsFormData>({
    defaultValues: { ...DEFAULT_VALUES, ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {PROVIDERS.map(({ key, label, icon }) => {
        const enabled = watch(`${key}.enabled`)

        return (
          <div
            key={key}
            className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            {/* Provider header with toggle */}
            <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  {...register(`${key}.enabled`)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-2" />
              </label>
            </div>

            {/* Provider config fields */}
            {enabled && (
              <div className="px-5 py-4 space-y-4">
                {key === 'auth0' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Domain
                    </label>
                    <input
                      type="text"
                      {...register('auth0.domain')}
                      placeholder="your-tenant.auth0.com"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    {...register(`${key}.client_id`)}
                    placeholder={`${label} Client ID`}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    {...register(`${key}.client_secret`)}
                    placeholder="••••••••••••"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isLoading ? 'Saving...' : 'Save Auth Settings'}
        </button>
      </div>
    </form>
  )
}
