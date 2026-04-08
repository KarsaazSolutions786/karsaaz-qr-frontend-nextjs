'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ChevronRightIcon,
  PhotoIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { systemConfigsAPI } from '@/lib/api/endpoints/system-configs'
import { queryKeys } from '@/lib/query/keys'
import { resolveBackendUrl } from '@/lib/utils/resolve-backend-url'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

const CONFIG_KEYS = ['app.logo', 'app.favicon']
const DEFAULT_LOGO = '/sidebar-assets/sidebar-logo.svg'
const DEFAULT_FAVICON = '/favicon.ico'

interface FileUploadZoneProps {
  label: string
  description: string
  accept: string
  currentUrl: string | null
  defaultUrl: string
  onUpload: (file: File) => void
  onReset: () => void
  isUploading: boolean
  previewSize: { width: number; height: number }
}

function FileUploadZone({
  label,
  description,
  accept,
  currentUrl,
  defaultUrl,
  onUpload,
  onReset,
  isUploading,
  previewSize,
}: FileUploadZoneProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) onUpload(file)
    },
    [onUpload]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onUpload(file)
      // Reset the input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [onUpload]
  )

  const displayUrl = currentUrl ? resolveBackendUrl(currentUrl) || currentUrl : defaultUrl
  const isCustom = !!currentUrl

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">{label}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="px-4 py-5 sm:px-6 space-y-4">
        {/* Current preview */}
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <Image
              src={displayUrl}
              alt={label}
              width={previewSize.width}
              height={previewSize.height}
              className="object-contain"
              unoptimized
            />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {isCustom ? t('Custom image uploaded') : t('Using default')}
            </p>
            {isCustom && (
              <button
                type="button"
                onClick={onReset}
                className="mt-1 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
              >
                <ArrowPathIcon className="h-3 w-3" />
                {t('Reset to default')}
              </button>
            )}
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <LottieLoader size={80} />
              <p className="text-sm text-gray-500">{t('Uploading...')}</p>
            </div>
          ) : (
            <>
              <PhotoIcon className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {t('Drag and drop a file here, or')}{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {t('browse')}
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-400">{t('PNG, JPG, SVG or WebP. Max 2MB.')}</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  )
}

export default function LogoFaviconSettingsPage() {
  const { t } = useTranslation()
  const { data: configs, isLoading, isError } = useSystemConfigs(CONFIG_KEYS)
  const queryClient = useQueryClient()

  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)

  // Sync local state when configs load
  useEffect(() => {
    if (configs) {
      setLogoUrl(configs['app.logo'] || null)
      setFaviconUrl(configs['app.favicon'] || null)
    }
  }, [configs])

  const saveMutation = useMutation({
    mutationFn: (entries: { key: string; value: string | null }[]) =>
      systemConfigsAPI.save(entries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.systemConfigs.byKeys(CONFIG_KEYS) })
      toast.success(t('Settings saved successfully'))
    },
    onError: () => {
      toast.error(t('Failed to save settings'))
    },
  })

  const handleLogoUpload = useCallback(
    async (file: File) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t('File too large. Max 2MB.'))
        return
      }
      setUploadingLogo(true)
      try {
        const result = await systemConfigsAPI.upload('app.logo', file)
        const newUrl = result.url
        setLogoUrl(newUrl)
        await saveMutation.mutateAsync([{ key: 'app.logo', value: newUrl }])
      } catch {
        toast.error(t('Failed to upload logo'))
      } finally {
        setUploadingLogo(false)
      }
    },
    [saveMutation]
  )

  const handleFaviconUpload = useCallback(
    async (file: File) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t('File too large. Max 2MB.'))
        return
      }
      setUploadingFavicon(true)
      try {
        const result = await systemConfigsAPI.upload('app.favicon', file)
        const newUrl = result.url
        setFaviconUrl(newUrl)
        await saveMutation.mutateAsync([{ key: 'app.favicon', value: newUrl }])
      } catch {
        toast.error(t('Failed to upload favicon'))
      } finally {
        setUploadingFavicon(false)
      }
    },
    [saveMutation]
  )

  const handleResetLogo = useCallback(() => {
    setLogoUrl(null)
    saveMutation.mutate([{ key: 'app.logo', value: null }])
  }, [saveMutation])

  const handleResetFavicon = useCallback(() => {
    setFaviconUrl(null)
    saveMutation.mutate([{ key: 'app.favicon', value: null }])
  }, [saveMutation])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/system/settings" className="hover:text-gray-700 transition-colors">
          {t('Settings')}
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">{t('Logo & Favicon')}</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('Logo & Favicon')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('Upload your site logo and favicon. Changes take effect immediately across the application.')}
        </p>
      </div>

      {/* Content */}
      <div className="mt-8 space-y-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <LottieLoader size={80} />
          </div>
        )}

        {isError && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {t('Failed to load settings. Please try again.')}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <FileUploadZone
              label={t('Site Logo')}
              description={t('The main logo displayed in the sidebar and public pages. Recommended size: 240x64 pixels.')}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              currentUrl={logoUrl}
              defaultUrl={DEFAULT_LOGO}
              onUpload={handleLogoUpload}
              onReset={handleResetLogo}
              isUploading={uploadingLogo}
              previewSize={{ width: 160, height: 48 }}
            />

            <FileUploadZone
              label={t('Favicon')}
              description={t('The small icon shown in browser tabs. Recommended: 32x32 or 64x64 PNG/ICO.')}
              accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
              currentUrl={faviconUrl}
              defaultUrl={DEFAULT_FAVICON}
              onUpload={handleFaviconUpload}
              onReset={handleResetFavicon}
              isUploading={uploadingFavicon}
              previewSize={{ width: 32, height: 32 }}
            />

            {/* Info note about backend endpoint */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              <p>
                <strong>{t('Note:')}</strong> {t('Logo and favicon settings are stored via the')}{' '}
                <code className="bg-blue-100 px-1 rounded text-xs">POST /api/system/configs</code>{' '}
                {t('endpoint with config keys')} <code className="bg-blue-100 px-1 rounded text-xs">app.logo</code> {t('and')}{' '}
                <code className="bg-blue-100 px-1 rounded text-xs">app.favicon</code>. {t('File uploads use')}{' '}
                <code className="bg-blue-100 px-1 rounded text-xs">POST /api/system/configs/upload</code>.
              </p>
              {/* TODO: If the backend does not yet support these config keys, they need to be
                  added to the allowed config keys list in SystemController::saveConfigs(). */}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
