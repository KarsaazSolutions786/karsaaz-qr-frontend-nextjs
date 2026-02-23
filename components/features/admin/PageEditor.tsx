'use client'

import { useState } from 'react'
import { Save, Loader2, Eye } from 'lucide-react'
import { pagesAPI } from '@/lib/api/endpoints/pages'
import type { Page, CreatePageRequest } from '@/types/entities/page'

interface PageEditorProps {
  page?: Page
  onSave?: (page: Page) => void
}

/**
 * T252 + T255: Simple page editor with title, slug, content, and save button.
 *
 * Uses a textarea with HTML preview as a fallback.
 * TODO: Integrate TipTap rich text editor when @tiptap/react is added to dependencies.
 */
export function PageEditor({ page, onSave }: PageEditorProps) {
  const [title, setTitle] = useState(page?.title || '')
  const [slug, setSlug] = useState(page?.slug || '')
  const [content, setContent] = useState(page?.htmlContent || '')
  const [metaDescription, setMetaDescription] = useState(page?.metaDescription || '')
  const [published, setPublished] = useState(page?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!page) {
      setSlug(generateSlug(value))
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }

    setError(null)
    setSaving(true)

    try {
      const payload: CreatePageRequest = {
        title,
        slug: slug || generateSlug(title),
        htmlContent: content,
        metaDescription: metaDescription || undefined,
        published,
      }

      const saved = page ? await pagesAPI.update(page.id, payload) : await pagesAPI.create(payload)

      onSave?.(saved)
    } catch {
      setError('Failed to save page. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Page Title *</label>
        <input
          type="text"
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
          placeholder="Page title"
          className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
        <div className="flex items-center">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
            /pages/
          </span>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="page-slug"
            className="block w-full rounded-r-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content — textarea fallback (TODO: replace with TipTap rich text editor) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Content * <span className="text-gray-400 font-normal">(HTML supported)</span>
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <Eye className="h-3.5 w-3.5" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {showPreview ? (
          <div
            className="min-h-[200px] rounded-md border border-gray-300 p-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={12}
            placeholder="Write your page content here... HTML is supported."
            className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 font-mono"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Description <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={metaDescription}
          onChange={e => setMetaDescription(e.target.value)}
          rows={2}
          placeholder="SEO meta description"
          className="block w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={e => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Published
        </label>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : page ? 'Update Page' : 'Create Page'}
        </button>
      </div>
    </div>
  )
}
