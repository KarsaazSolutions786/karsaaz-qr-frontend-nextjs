'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/lib/hooks/queries/useTranslations'
import { useUpdateTranslation } from '@/lib/hooks/mutations/useTranslationMutations'
import { useTranslation as useI18n } from '@/lib/i18n'
import { translationsAPI } from '@/lib/api/endpoints/translations'
import apiClient from '@/lib/api/client'
import type { CreateTranslationRequest } from '@/types/entities/translation'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes EditTranslationPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function EditTranslationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { t } = useI18n()
  const { data: translation, isLoading } = useTranslation(Number(id))
  const updateMutation = useUpdateTranslation()

  const [form, setForm] = useState<CreateTranslationRequest>({
    name: '',
    displayName: '',
    locale: '',
    direction: 'ltr',
  })
  const [flagFile, setFlagFile] = useState<File | null>(null)
  const [translationFile, setTranslationFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingTranslationFile, setUploadingTranslationFile] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const isDefault = translation?.isMain ?? false

  useEffect(() => {
    if (translation) {
      setForm({
        name: translation.name,
        displayName: translation.displayName,
        locale: translation.locale,
        direction: translation.direction,
      })
    }
  }, [translation])

  /**
   * Purpose: Sets .
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const set = (key: keyof CreateTranslationRequest, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let flagFileId: number | undefined

    if (flagFile) {
      try {
        setUploading(true)
        const fd = new FormData()
        fd.append('file', flagFile)
        const res = await apiClient.post<{ id: number }>('/files', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        flagFileId = res.data.id
      } finally {
        setUploading(false)
      }
    }

    await updateMutation.mutateAsync({
      id: Number(id),
      data: { ...form, ...(flagFileId ? { flagFileId } : {}) },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  /**
   * Purpose: Executes handleTranslationFileUpload functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleTranslationFileUpload = async () => {
    if (!translationFile) return
    try {
      setUploadingTranslationFile(true)
      setUploadError('')
      await translationsAPI.upload(Number(id), translationFile)
      setUploadSuccess(true)
      setTranslationFile(null)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch {
      setUploadError(t('Failed to upload translation file. Ensure it is a valid .json file.'))
    } finally {
      setUploadingTranslationFile(false)
    }
  }

  if (isLoading)
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LottieLoader size={80} />
      </div>
    )
  if (!translation) return <div className="text-center py-12">{t('Translation not found')}</div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Edit Translation')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {translation.displayName || translation.name}
          </p>
        </div>
        <Link href="/translations" className="text-sm text-blue-600 hover:text-blue-900">
          {t('← Back')}
        </Link>
      </div>

      {/* Info section */}
      <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm">
        <p className="font-medium text-blue-800 mb-2">{t('Translation Resources')}</p>
        <ul className="space-y-1 text-blue-700">
          <li>
            <a
              href="/api/translations/default-file"
              download
              className="underline hover:text-blue-900"
            >
              {t('Download default translation JSON file')}
            </a>
          </li>
          <li>
            {t('Manage content blocks for this language:')}{' '}
            <Link
              href={`/content-blocks?translation_id=${id}`}
              className="underline hover:text-blue-900"
            >
              {t('Content Blocks')}
            </Link>{' '}
            ·{' '}
            <Link
              href={`/blog-posts?translation_id=${id}`}
              className="underline hover:text-blue-900"
            >
              {t('Blog Posts')}
            </Link>
          </li>
        </ul>
      </div>

      {updateMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {t('Failed to save changes.')}
        </div>
      )}
      {saved && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
          {t('Changes saved successfully.')}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            disabled={isDefault}
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          />
          {isDefault && (
            <p className="mt-1 text-xs text-gray-500">
              {t('Cannot change the default language name')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Display Name')}</label>
          <input
            type="text"
            disabled={isDefault}
            value={form.displayName ?? ''}
            onChange={e => set('displayName', e.target.value)}
            placeholder="e.g. العربية"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Used in the language picker shown to end users')}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('Locale')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            disabled={isDefault}
            value={form.locale}
            onChange={e => set('locale', e.target.value)}
            placeholder="e.g. ar, ar-SA"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Text Direction')}</label>
          <div className="mt-2 flex gap-6">
            {(['ltr', 'rtl'] as const).map(dir => (
              <label
                key={dir}
                className={`flex cursor-pointer items-center gap-2 ${isDefault ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                <input
                  type="radio"
                  name="direction"
                  value={dir}
                  checked={form.direction === dir}
                  disabled={isDefault}
                  onChange={() => set('direction', dir)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  {dir === 'ltr' ? t('Left to Right (LTR)') : t('Right to Left (RTL)')}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Flag Image')}</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFlagFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('Upload a new flag to replace the existing one')}
          </p>
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('Cancel')}
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending || uploading}
            className="rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105 transition-all disabled:opacity-50"
          >
            {updateMutation.isPending || uploading ? t('Saving…') : t('Save Changes')}
          </button>
        </div>
      </form>

      {/* Translation File Upload — separate section */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{t('Upload Translation File')}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {t('Upload a JSON file with translated strings for this language.')}
        </p>

        {uploadError && (
          <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{uploadError}</div>
        )}
        {uploadSuccess && (
          <div className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {t('Translation file uploaded successfully.')}
          </div>
        )}

        <div className="mt-4 flex items-end gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept=".json"
              onChange={e => setTranslationFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
          <button
            type="button"
            onClick={handleTranslationFileUpload}
            disabled={!translationFile || uploadingTranslationFile}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {uploadingTranslationFile ? t('Uploading…') : t('Upload')}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {t(
            'Only .json files are accepted. Use the download link above to get the default file structure.'
          )}
        </p>
      </div>
    </div>
  )
}
