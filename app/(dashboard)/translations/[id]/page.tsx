'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from '@/lib/hooks/queries/useTranslations'
import { useUpdateTranslation } from '@/lib/hooks/mutations/useTranslationMutations'
import { translationsAPI } from '@/lib/api/endpoints/translations'
import apiClient from '@/lib/api/client'
import type { CreateTranslationRequest } from '@/types/entities/translation'

export default function EditTranslationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
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

  const set = (key: keyof CreateTranslationRequest, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

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
      setUploadError('Failed to upload translation file. Ensure it is a valid .json file.')
    } finally {
      setUploadingTranslationFile(false)
    }
  }

  if (isLoading) return (
    <div className="flex min-h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
    </div>
  )
  if (!translation) return <div className="text-center py-12">Translation not found</div>

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Translation</h1>
          <p className="mt-2 text-sm text-gray-600">{translation.displayName || translation.name}</p>
        </div>
        <Link href="/translations" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {/* Info section */}
      <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm">
        <p className="font-medium text-blue-800 mb-2">Translation Resources</p>
        <ul className="space-y-1 text-blue-700">
          <li>
            <a href="/api/translations/default-file" download className="underline hover:text-blue-900">
              Download default translation JSON file
            </a>
          </li>
          <li>
            Manage content blocks for this language:{' '}
            <Link href={`/content-blocks?translation_id=${id}`} className="underline hover:text-blue-900">Content Blocks</Link>{' '}
            ·{' '}
            <Link href={`/blog-posts?translation_id=${id}`} className="underline hover:text-blue-900">Blog Posts</Link>
          </li>
        </ul>
      </div>

      {updateMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to save changes.</div>
      )}
      {saved && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Changes saved successfully.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
          <input type="text" required disabled={isDefault} value={form.name} onChange={(e) => set('name', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" />
          {isDefault && <p className="mt-1 text-xs text-gray-500">Cannot change the default language name</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input type="text" disabled={isDefault} value={form.displayName ?? ''} onChange={(e) => set('displayName', e.target.value)}
            placeholder="e.g. العربية"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" />
          <p className="mt-1 text-xs text-gray-500">Used in the language picker shown to end users</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Locale <span className="text-red-500">*</span></label>
          <input type="text" required disabled={isDefault} value={form.locale} onChange={(e) => set('locale', e.target.value)}
            placeholder="e.g. ar, ar-SA"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Text Direction</label>
          <div className="mt-2 flex gap-6">
            {(['ltr', 'rtl'] as const).map((dir) => (
              <label key={dir} className={`flex cursor-pointer items-center gap-2 ${isDefault ? 'cursor-not-allowed opacity-60' : ''}`}>
                <input type="radio" name="direction" value={dir} checked={form.direction === dir}
                  disabled={isDefault} onChange={() => set('direction', dir)} className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">{dir === 'ltr' ? 'Left to Right (LTR)' : 'Right to Left (RTL)'}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Flag Image</label>
          <input type="file" accept="image/*" onChange={(e) => setFlagFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100" />
          <p className="mt-1 text-xs text-gray-500">Upload a new flag to replace the existing one</p>
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <button type="button" onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={updateMutation.isPending || uploading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {updateMutation.isPending || uploading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Translation File Upload — separate section */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Upload Translation File</h2>
        <p className="mt-1 text-sm text-gray-600">Upload a JSON file with translated strings for this language.</p>

        {uploadError && (
          <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{uploadError}</div>
        )}
        {uploadSuccess && (
          <div className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700">Translation file uploaded successfully.</div>
        )}

        <div className="mt-4 flex items-end gap-4">
          <div className="flex-1">
            <input type="file" accept=".json" onChange={(e) => setTranslationFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200" />
          </div>
          <button type="button" onClick={handleTranslationFileUpload}
            disabled={!translationFile || uploadingTranslationFile}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50">
            {uploadingTranslationFile ? 'Uploading…' : 'Upload'}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">Only .json files are accepted. Use the download link above to get the default file structure.</p>
      </div>
    </div>
  )
}
