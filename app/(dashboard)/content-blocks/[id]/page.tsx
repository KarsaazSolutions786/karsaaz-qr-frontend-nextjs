'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useContentBlock } from '@/lib/hooks/queries/useContentBlocks'
import { useUpdateContentBlock } from '@/lib/hooks/mutations/useContentBlockMutations'
import { useTranslations } from '@/lib/hooks/queries/useTranslations'
import { useTranslation } from '@/lib/i18n'
import type { CreateContentBlockRequest } from '@/types/entities/content-block'

export default function EditContentBlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useTranslation()
  const { id } = use(params)
  const router = useRouter()
  const { data: block, isLoading } = useContentBlock(Number(id))
  const updateMutation = useUpdateContentBlock()
  const { data: translationsData } = useTranslations({ page: 1 })

  const [form, setForm] = useState<CreateContentBlockRequest>({
    title: '',
    position: '',
    content: '',
    sortOrder: 0,
    translationId: undefined,
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (block) {
      setForm({
        title: block.title,
        position: block.position,
        content: block.content,
        sortOrder: block.sortOrder,
        translationId: block.translationId,
      })
    }
  }, [block])

  const set = (key: keyof CreateContentBlockRequest, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync({ id: Number(id), data: form })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const activeTranslations = translationsData?.data.filter((tr) => tr.isActive) ?? []

  if (isLoading) return (
    <div className="flex min-h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
    </div>
  )
  if (!block) return <div className="text-center py-12">{t('Content block not found')}</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Edit Content Block')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('Update content block settings')}</p>
        </div>
        <Link href="/content-blocks" className="text-sm text-blue-600 hover:text-blue-900">{t('← Back')}</Link>
      </div>

      {updateMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{t('Failed to save changes.')}</div>
      )}
      {saved && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">{t('Changes saved successfully.')}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Title')} <span className="text-red-500">*</span></label>
          <input type="text" required value={form.title} onChange={(e) => set('title', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Position')} <span className="text-red-500">*</span></label>
          <input type="text" required value={form.position} onChange={(e) => set('position', e.target.value)}
            placeholder={t('e.g. header, footer, home-hero')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Sort Order')}</label>
          <input type="number" value={form.sortOrder ?? 0} onChange={(e) => set('sortOrder', Number(e.target.value))}
            className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
          <p className="mt-1 text-xs text-gray-500">{t('Controls the order of each block in the selected position')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Content')} <span className="text-red-500">*</span></label>
          <textarea required rows={10} value={form.content} onChange={(e) => set('content', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none" />
          <p className="mt-1 text-xs text-gray-500">{t('Supports Markdown formatting')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Language')}</label>
          <select value={form.translationId ?? ''} onChange={(e) => set('translationId', e.target.value ? Number(e.target.value) : undefined)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm">
            <option value="">{t('English (default)')}</option>
            {activeTranslations.map((tr) => (
              <option key={tr.id} value={tr.id}>{tr.displayName || tr.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <button type="button" onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{t('Cancel')}</button>
          <button type="submit" disabled={updateMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {updateMutation.isPending ? t('Saving...') : t('Save Changes')}
          </button>
        </div>
      </form>
    </div>
  )
}
