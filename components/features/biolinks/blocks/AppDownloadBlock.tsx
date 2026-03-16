'use client'

import { useTranslation } from '@/lib/i18n'
import type { AppDownloadBlockData } from '@/types/entities/biolink'

interface AppDownloadBlockProps {
  block: AppDownloadBlockData
  isEditing?: boolean
  onUpdate?: (data: AppDownloadBlockData['data']) => void
}

export default function AppDownloadBlock({ block, isEditing, onUpdate }: AppDownloadBlockProps) {
  const {
    appName,
    description,
    appIcon,
    iosUrl,
    androidUrl,
    style = 'badges',
  } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('App Name')}</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => onUpdate?.({ ...block.data, appName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="My App"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Description (optional)')}</label>
          <input
            type="text"
            value={description || ''}
            onChange={(e) => onUpdate?.({ ...block.data, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Download our app today"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('App Icon URL (optional)')}</label>
          <input
            type="url"
            value={appIcon || ''}
            onChange={(e) => onUpdate?.({ ...block.data, appIcon: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com/app-icon.png"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('iOS App Store URL')}</label>
          <input
            type="url"
            value={iosUrl || ''}
            onChange={(e) => onUpdate?.({ ...block.data, iosUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://apps.apple.com/app/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Google Play Store URL')}</label>
          <input
            type="url"
            value={androidUrl || ''}
            onChange={(e) => onUpdate?.({ ...block.data, androidUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://play.google.com/store/apps/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Style')}</label>
          <select
            value={style}
            onChange={(e) =>
              onUpdate?.({ ...block.data, style: e.target.value as 'badges' | 'buttons' | 'card' })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="badges">{t('Store Badges')}</option>
            <option value="buttons">{t('Buttons')}</option>
            <option value="card">{t('Card')}</option>
          </select>
        </div>
      </div>
    )
  }

  if (!iosUrl && !androidUrl) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('No app store links set')}</p>
      </div>
    )
  }

  if (style === 'card') {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-4 mb-4">
          {appIcon ? (
            <img
              src={appIcon}
              alt={appName}
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              &#128241;
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{appName || t('App Name')}</h3>
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          {iosUrl && (
            <a
              href={iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <span className="block text-[10px] leading-tight">{t('Download on the')}</span>
              {t('App Store')}
            </a>
          )}
          {androidUrl && (
            <a
              href={androidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <span className="block text-[10px] leading-tight">{t('Get it on')}</span>
              {t('Google Play')}
            </a>
          )}
        </div>
      </div>
    )
  }

  if (style === 'buttons') {
    return (
      <div className="space-y-2">
        {appName && (
          <h3 className="text-center text-lg font-semibold text-gray-900">{appName}</h3>
        )}
        {description && (
          <p className="text-center text-sm text-gray-600">{description}</p>
        )}
        <div className="flex gap-2">
          {iosUrl && (
            <a
              href={iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              &#63743; {t('iOS')}
            </a>
          )}
          {androidUrl && (
            <a
              href={androidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              &#9654; {t('Android')}
            </a>
          )}
        </div>
      </div>
    )
  }

  // Default: badges style
  return (
    <div className="space-y-3">
      {appName && (
        <h3 className="text-center text-lg font-semibold text-gray-900">{appName}</h3>
      )}
      {description && (
        <p className="text-center text-sm text-gray-600">{description}</p>
      )}
      <div className="flex items-center justify-center gap-3">
        {iosUrl && (
          <a
            href={iosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-white transition-colors hover:bg-gray-800"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] leading-tight">{t('Download on the')}</div>
              <div className="text-sm font-semibold leading-tight">{t('App Store')}</div>
            </div>
          </a>
        )}
        {androidUrl && (
          <a
            href={androidUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-white transition-colors hover:bg-gray-800"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.834 1.64a1 1 0 0 1 0 1.74l-2.834 1.64-2.56-2.56 2.56-2.46zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] leading-tight">{t('Get it on')}</div>
              <div className="text-sm font-semibold leading-tight">{t('Google Play')}</div>
            </div>
          </a>
        )}
      </div>
    </div>
  )
}
