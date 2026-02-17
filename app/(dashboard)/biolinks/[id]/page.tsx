'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useBiolink } from '@/lib/hooks/queries/useBiolinks'
import { useUpdateBiolink, useDeleteBiolink } from '@/lib/hooks/mutations/useBiolinkMutations'
import BiolinkEditor from '@/components/features/biolinks/editor/BiolinkEditor'
import BiolinkPreview from '@/components/features/biolinks/editor/BiolinkPreview'
import type { BlockData } from '@/types/entities/biolink'

export default function EditBiolinkPage() {
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)

  const { data: biolink, isLoading } = useBiolink(id)
  const updateMutation = useUpdateBiolink()
  const deleteMutation = useDeleteBiolink()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (biolink) {
      setTitle(biolink.title)
      setSlug(biolink.slug)
      setDescription(biolink.description || '')
      setBlocks(biolink.blocks)
    }
  }, [biolink])

  const handleSave = async (isPublished: boolean) => {
    if (!title || !slug) {
      alert('Title and slug are required')
      return
    }

    try {
      await updateMutation.mutateAsync({
        id,
        title,
        slug,
        description: description || undefined,
        blocks,
        isPublished,
      })
      alert('Biolink updated successfully')
    } catch (error) {
      console.error('Failed to update biolink:', error)
      alert('Failed to update biolink')
    }
  }

  const handleDelete = async () => {
    if (confirm('Delete this biolink? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id)
        router.push('/biolinks')
      } catch (error) {
        console.error('Failed to delete biolink:', error)
        alert('Failed to delete biolink')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading biolink...</div>
      </div>
    )
  }

  if (!biolink) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Biolink not found</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Biolink</h1>
          <p className="mt-2 text-sm text-gray-600">Update your biolink page</p>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">yoursite.com/{slug}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="mb-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={`font-semibold ${biolink.isPublished ? 'text-green-600' : 'text-gray-600'}`}
                  >
                    {biolink.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>Views:</span>
                  <span className="font-semibold">{biolink.views}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleSave(false)}
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {biolink.isPublished ? 'Update' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editor / Preview Area */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8">
            {showPreview ? (
              <BiolinkPreview biolink={{ title, description, slug }} blocks={blocks} />
            ) : (
              <BiolinkEditor blocks={blocks} onChange={setBlocks} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
