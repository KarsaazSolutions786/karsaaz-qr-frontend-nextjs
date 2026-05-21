'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePage } from '@/lib/hooks/queries/usePages'
import { useUpdatePage } from '@/lib/hooks/mutations/usePageMutations'
import type { CreatePageRequest } from '@/types/entities/page'
import { useTranslation } from '@/lib/i18n'
import { envConfig } from '@/lib/config/env-config'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes slugify functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const APP_URL = envConfig.APP_URL

/**
 * Purpose: Executes EditPagePage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useTranslation()
  const { id } = use(params)
  const router = useRouter()
  const { data: page, isLoading } = usePage(Number(id))
  const updateMutation = useUpdatePage()

  const [form, setForm] = useState<CreatePageRequest>({
    title: '',
    slug: '',
    htmlContent: '',
    metaDescription: '',
    published: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (page) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync form state from server data on load
      setForm({
        title: page.title,
        slug: page.slug,
        htmlContent: page.htmlContent,
        metaDescription: page.metaDescription ?? '',
        published: page.published,
      })
    }
  }, [page])

  /**
   * Purpose: Sets .
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const set = <K extends keyof CreatePageRequest>(key: K, value: CreatePageRequest[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  /**
   * Purpose: Executes handleTitleChange functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleTitleChange = (value: string) => {
    setForm(prev => ({ ...prev, title: value, slug: slugify(value) }))
  }

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync({ id: Number(id), data: form })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading)
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LottieLoader size={80} />
      </div>
    )
  if (!page) return <div className="text-center py-12">{t('Page not found')}</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Edit Page')}</h1>
          <p className="mt-2 text-sm text-gray-600">{page.title}</p>
        </div>
        <Link href="/pages" className="text-sm text-blue-600 hover:text-blue-900">
          {t('← Back')}
        </Link>
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
            {t('Title')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Slug')}</label>
          <input
            type="text"
            value={form.slug ?? ''}
            onChange={e => set('slug', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
          {form.slug && (
            <p className="mt-1 text-xs text-gray-500">
              URL:{' '}
              <a
                href={`${APP_URL}/${form.slug}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {APP_URL}/{form.slug}
              </a>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('HTML Content')} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={14}
            value={form.htmlContent}
            onChange={e => set('htmlContent', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Meta Description')}</label>
          <textarea
            rows={3}
            maxLength={160}
            value={form.metaDescription ?? ''}
            onChange={e => set('metaDescription', e.target.value)}
            placeholder="Brief description for search engines (max 160 characters)"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            {(form.metaDescription ?? '').length}/160 characters
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={form.published ?? false}
            onChange={e => set('published', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">
            {t('Published — make this page publicly accessible')}
          </label>
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
            disabled={updateMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? t('Saving…') : t('Save Changes')}
          </button>
        </div>
      </form>
    </div>
  )
}
