'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCreateTranslation } from '@/lib/hooks/mutations/useTranslationMutations'
import apiClient from '@/lib/api/client'
import type { CreateTranslationRequest } from '@/types/entities/translation'

export default function NewTranslationPage() {
  const router = useRouter()
  const createMutation = useCreateTranslation()

  const [form, setForm] = useState<CreateTranslationRequest>({
    name: '',
    displayName: '',
    locale: '',
    direction: 'ltr',
  })
  const [flagFile, setFlagFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

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

    await createMutation.mutateAsync({ ...form, ...(flagFileId ? { flagFileId } : {}) } as CreateTranslationRequest)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Translation</h1>
          <p className="mt-2 text-sm text-gray-600">Add a new language to your application</p>
        </div>
        <Link href="/translations" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {createMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to create translation. Please check the fields and try again.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
          <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Arabic"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input type="text" value={form.displayName ?? ''} onChange={(e) => set('displayName', e.target.value)}
            placeholder="e.g. العربية"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
          <p className="mt-1 text-xs text-gray-500">Used in the language picker shown to end users</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Locale <span className="text-red-500">*</span></label>
          <input type="text" required value={form.locale} onChange={(e) => set('locale', e.target.value)}
            placeholder="e.g. ar, ar-SA, fr-FR"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Text Direction</label>
          <div className="mt-2 flex gap-6">
            {(['ltr', 'rtl'] as const).map((dir) => (
              <label key={dir} className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="direction" value={dir} checked={form.direction === dir}
                  onChange={() => set('direction', dir)} className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">{dir === 'ltr' ? 'Left to Right (LTR)' : 'Right to Left (RTL)'}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Flag Image</label>
          <input type="file" accept="image/*" onChange={(e) => setFlagFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100" />
          <p className="mt-1 text-xs text-gray-500">Optional flag icon displayed in the language picker</p>
        </div>

        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Translation JSON file upload is available after the language is first saved.
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <button type="button" onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={createMutation.isPending || uploading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {createMutation.isPending || uploading ? 'Creating…' : 'Create Translation'}
          </button>
        </div>
      </form>
    </div>
  )
}
